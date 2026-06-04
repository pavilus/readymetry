-- Secure exam delivery and enforce paid exam credits.

ALTER TABLE exam_sessions
  ADD COLUMN IF NOT EXISTS question_ids UUID[];

ALTER TABLE user_answers
  ADD COLUMN IF NOT EXISTS confidence_level TEXT
    CHECK (confidence_level IN ('confident', 'unsure', 'guessing')),
  ADD COLUMN IF NOT EXISTS flagged BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS user_answers_session_question_unique
  ON user_answers(session_id, question_id);

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS free_exam_consumed BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE user_profiles profile
SET free_exam_consumed = TRUE
WHERE EXISTS (
  SELECT 1 FROM exam_sessions session WHERE session.user_id = profile.id
);

-- Authenticated clients may read question prompts, but answers and explanations
-- are available only through trusted server-side service-role calls.
REVOKE SELECT ON questions FROM authenticated;
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

CREATE OR REPLACE FUNCTION consume_exam_access(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier TEXT;
  v_credits INTEGER;
BEGIN
  SELECT subscription_tier, purchased_exam_credits
    INTO v_tier, v_credits
  FROM user_profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF v_tier = 'workforce' THEN
    RETURN 'workforce';
  END IF;

  IF NOT coalesce((SELECT free_exam_consumed FROM user_profiles WHERE id = p_user_id), FALSE) THEN
    UPDATE user_profiles SET free_exam_consumed = TRUE WHERE id = p_user_id;
    RETURN 'free';
  END IF;

  IF v_credits > 0 THEN
    UPDATE user_profiles
    SET purchased_exam_credits = purchased_exam_credits - 1
    WHERE id = p_user_id;
    RETURN 'credit';
  END IF;

  RAISE EXCEPTION 'No exam credits available';
END;
$$;

REVOKE ALL ON FUNCTION consume_exam_access(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION consume_exam_access(UUID) TO service_role;

CREATE OR REPLACE FUNCTION refund_exam_access(p_user_id UUID, p_access_type TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_access_type = 'credit' THEN
    UPDATE user_profiles
    SET purchased_exam_credits = purchased_exam_credits + 1
    WHERE id = p_user_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION refund_exam_access(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION refund_exam_access(UUID, TEXT) TO service_role;

CREATE TABLE IF NOT EXISTS processed_stripe_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE processed_stripe_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION fulfill_stripe_purchase(
  p_event_id TEXT,
  p_event_type TEXT,
  p_user_id UUID,
  p_product TEXT,
  p_customer_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO processed_stripe_events(event_id, event_type)
  VALUES (p_event_id, p_event_type)
  ON CONFLICT (event_id) DO NOTHING;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF p_product = 'single_exam' THEN
    UPDATE user_profiles
    SET purchased_exam_credits = purchased_exam_credits + 1,
        plan_selected_at = coalesce(plan_selected_at, now())
    WHERE id = p_user_id;
  ELSIF p_product = 'readiness_pack' THEN
    UPDATE user_profiles
    SET subscription_tier = 'ready',
        purchased_exam_credits = purchased_exam_credits + 5,
        stripe_customer_id = coalesce(p_customer_id, stripe_customer_id),
        plan_selected_at = now()
    WHERE id = p_user_id;
  ELSE
    RAISE EXCEPTION 'Unknown Stripe product';
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT) TO service_role;
