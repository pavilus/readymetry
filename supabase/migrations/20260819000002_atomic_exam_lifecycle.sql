-- Make credit consumption, exam creation, scoring, and completion transactional.

CREATE OR REPLACE FUNCTION create_exam_session_with_access(
  p_user_id UUID,
  p_certification_id UUID,
  p_exam_type TEXT,
  p_categories TEXT[],
  p_question_ids UUID[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_access_type TEXT;
  v_session exam_sessions%ROWTYPE;
  v_question_count INTEGER;
BEGIN
  IF p_exam_type NOT IN ('practice', 'timed_simulation') THEN
    RAISE EXCEPTION 'Invalid exam type';
  END IF;
  v_question_count := coalesce(array_length(p_question_ids, 1), 0);
  IF v_question_count = 0 OR v_question_count > 200 THEN
    RAISE EXCEPTION 'Invalid question count';
  END IF;
  IF (SELECT count(DISTINCT question_id) FROM unnest(p_question_ids) AS ids(question_id)) <> v_question_count THEN
    RAISE EXCEPTION 'Duplicate question IDs';
  END IF;
  IF (
    SELECT count(*)
    FROM questions
    WHERE id = ANY(p_question_ids)
      AND certification_id = p_certification_id
      AND review_status = 'published'
  ) <> v_question_count THEN
    RAISE EXCEPTION 'Question set is invalid';
  END IF;

  v_access_type := consume_exam_access(p_user_id);
  IF p_exam_type = 'timed_simulation' AND v_access_type = 'free' THEN
    RAISE EXCEPTION 'Timed simulation requires paid access';
  END IF;

  INSERT INTO exam_sessions (
    user_id,
    certification_id,
    exam_type,
    status,
    total_questions,
    categories,
    question_ids,
    remaining_seconds,
    expires_at,
    access_type
  ) VALUES (
    p_user_id,
    p_certification_id,
    p_exam_type,
    'in_progress',
    v_question_count,
    CASE WHEN coalesce(array_length(p_categories, 1), 0) > 0 THEN p_categories ELSE NULL END,
    p_question_ids,
    CASE WHEN p_exam_type = 'timed_simulation' THEN v_question_count * 90 ELSE NULL END,
    CASE WHEN p_exam_type = 'timed_simulation' THEN now() + make_interval(secs => v_question_count * 90) ELSE NULL END,
    v_access_type
  )
  RETURNING * INTO v_session;

  RETURN to_jsonb(v_session);
END;
$$;

REVOKE ALL ON FUNCTION create_exam_session_with_access(UUID, UUID, TEXT, TEXT[], UUID[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION create_exam_session_with_access(UUID, UUID, TEXT, TEXT[], UUID[]) TO service_role;

CREATE OR REPLACE FUNCTION submit_exam_session_atomic(
  p_user_id UUID,
  p_session_id UUID,
  p_answers JSONB,
  p_time_taken_seconds INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session exam_sessions%ROWTYPE;
  v_answer JSONB;
  v_question_id UUID;
  v_selected_answer TEXT;
  v_correct_answer TEXT;
  v_time_spent INTEGER;
  v_confidence TEXT;
  v_flagged BOOLEAN;
  v_seen_ids UUID[] := ARRAY[]::UUID[];
  v_correct INTEGER := 0;
  v_total INTEGER;
  v_score INTEGER;
  v_question_index INTEGER;
  v_timed_expired BOOLEAN;
BEGIN
  IF jsonb_typeof(p_answers) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Answers must be an array';
  END IF;
  IF p_time_taken_seconds IS NULL OR p_time_taken_seconds < 0 OR p_time_taken_seconds > 604800 THEN
    RAISE EXCEPTION 'Invalid total time';
  END IF;

  SELECT * INTO v_session
  FROM exam_sessions
  WHERE id = p_session_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Exam session not found'; END IF;
  IF v_session.status <> 'in_progress' THEN RAISE EXCEPTION 'Exam session has already been submitted'; END IF;

  v_total := jsonb_array_length(p_answers);
  IF v_total = 0 OR v_total <> coalesce(array_length(v_session.question_ids, 1), 0) THEN
    RAISE EXCEPTION 'Submission must contain every session question';
  END IF;
  v_timed_expired := v_session.exam_type = 'timed_simulation'
    AND v_session.expires_at IS NOT NULL
    AND v_session.expires_at <= now();

  FOR v_answer IN SELECT value FROM jsonb_array_elements(p_answers)
  LOOP
    v_question_id := (v_answer->>'questionId')::UUID;
    IF v_question_id = ANY(v_seen_ids) THEN RAISE EXCEPTION 'Duplicate answers submitted'; END IF;
    v_question_index := array_position(v_session.question_ids, v_question_id);
    IF v_question_index IS NULL THEN RAISE EXCEPTION 'Question is outside this exam session'; END IF;
    v_seen_ids := array_append(v_seen_ids, v_question_id);

    v_selected_answer := coalesce(v_answer->>'selectedAnswer', '');
    IF v_timed_expired THEN
      v_selected_answer := coalesce(v_session.progress->'answers'->>(v_question_index - 1), '');
    END IF;
    IF v_selected_answer NOT IN ('', 'A', 'B', 'C', 'D') THEN RAISE EXCEPTION 'Invalid selected answer'; END IF;

    v_time_spent := coalesce((v_answer->>'timeSpentSeconds')::INTEGER, 0);
    IF v_time_spent < 0 OR v_time_spent > 86400 THEN RAISE EXCEPTION 'Invalid question time'; END IF;
    v_confidence := nullif(v_answer->>'confidenceLevel', '');
    IF v_confidence IS NOT NULL AND v_confidence NOT IN ('confident', 'unsure', 'guessing') THEN
      RAISE EXCEPTION 'Invalid confidence level';
    END IF;
    v_flagged := coalesce((v_answer->>'flagged')::BOOLEAN, FALSE);

    SELECT correct_answer INTO v_correct_answer FROM questions WHERE id = v_question_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Question not found'; END IF;
    IF v_selected_answer = v_correct_answer THEN v_correct := v_correct + 1; END IF;

    INSERT INTO user_answers (
      session_id, question_id, selected_answer, is_correct,
      time_spent_seconds, confidence_level, flagged
    ) VALUES (
      p_session_id, v_question_id, v_selected_answer, v_selected_answer = v_correct_answer,
      v_time_spent, v_confidence, v_flagged
    )
    ON CONFLICT (session_id, question_id) DO UPDATE SET
      selected_answer = excluded.selected_answer,
      is_correct = excluded.is_correct,
      time_spent_seconds = excluded.time_spent_seconds,
      confidence_level = excluded.confidence_level,
      flagged = excluded.flagged;
  END LOOP;

  v_score := round(100.0 * v_correct / v_total);
  UPDATE exam_sessions SET
    status = 'completed',
    score = v_score,
    correct_answers = v_correct,
    time_taken_seconds = p_time_taken_seconds,
    completed_at = now(),
    progress = NULL,
    remaining_seconds = 0
  WHERE id = p_session_id AND user_id = p_user_id AND status = 'in_progress';
  IF NOT FOUND THEN RAISE EXCEPTION 'Exam session has already been submitted'; END IF;

  RETURN jsonb_build_object(
    'sessionId', p_session_id,
    'score', v_score,
    'correct', v_correct,
    'total', v_total
  );
END;
$$;

REVOKE ALL ON FUNCTION submit_exam_session_atomic(UUID, UUID, JSONB, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION submit_exam_session_atomic(UUID, UUID, JSONB, INTEGER) TO service_role;
