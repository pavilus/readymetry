-- Restrict browser clients to user-owned, non-privileged data changes.

REVOKE ALL ON user_profiles FROM authenticated;
GRANT SELECT ON user_profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url, account_type, organization_name) ON user_profiles TO authenticated;

REVOKE ALL ON questions FROM authenticated;
GRANT SELECT (
  id,
  certification_id,
  category,
  subcategory,
  body,
  options,
  difficulty,
  reference,
  created_at
) ON questions TO authenticated;

REVOKE ALL ON exam_sessions FROM authenticated;
GRANT SELECT ON exam_sessions TO authenticated;

REVOKE ALL ON user_answers FROM authenticated;
GRANT SELECT ON user_answers TO authenticated;

REVOKE ALL ON user_certifications FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON user_certifications TO authenticated;

REVOKE ALL ON FUNCTION increment_exam_credits(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_exam_credits(UUID, INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION increment_exam_credits(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Credit amount must be positive';
  END IF;

  UPDATE user_profiles
  SET purchased_exam_credits = purchased_exam_credits + p_amount
  WHERE id = p_user_id;
END;
$$;

REVOKE ALL ON FUNCTION increment_exam_credits(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_exam_credits(UUID, INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION get_readiness_score(p_user_id UUID, p_certification_id UUID)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score numeric;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT avg(score)::numeric(5,2) INTO v_score
  FROM (
    SELECT score FROM exam_sessions
    WHERE user_id = p_user_id
      AND certification_id = p_certification_id
      AND status = 'completed'
    ORDER BY completed_at DESC
    LIMIT 5
  ) recent;
  RETURN coalesce(v_score, 0);
END;
$$;

CREATE OR REPLACE FUNCTION get_category_breakdown(p_user_id UUID, p_certification_id UUID)
RETURNS TABLE(category TEXT, accuracy NUMERIC, question_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    q.category,
    round(100.0 * sum(CASE WHEN ua.is_correct THEN 1 ELSE 0 END) / count(*), 1),
    count(*)
  FROM user_answers ua
  JOIN questions q ON q.id = ua.question_id
  JOIN exam_sessions es ON es.id = ua.session_id
  WHERE es.user_id = p_user_id
    AND es.certification_id = p_certification_id
    AND es.status = 'completed'
  GROUP BY q.category
  ORDER BY accuracy ASC;
END;
$$;

REVOKE ALL ON FUNCTION get_readiness_score(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION get_category_breakdown(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_readiness_score(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_category_breakdown(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, account_type, organization_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    CASE
      WHEN NEW.raw_user_meta_data->>'account_type' = 'enterprise' THEN 'enterprise'
      ELSE 'individual'
    END,
    NULLIF(NEW.raw_user_meta_data->>'organization_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
