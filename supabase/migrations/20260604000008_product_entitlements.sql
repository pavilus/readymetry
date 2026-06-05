-- Record the access product used for each exam so result entitlements remain
-- stable even when a user purchases or upgrades later.

ALTER TABLE exam_sessions
  ADD COLUMN IF NOT EXISTS access_type TEXT
    CHECK (access_type IN ('free', 'credit', 'workforce'));

UPDATE exam_sessions session
SET access_type = CASE
  WHEN profile.subscription_tier = 'workforce' THEN 'workforce'
  WHEN session.id = (
    SELECT first_session.id
    FROM exam_sessions first_session
    WHERE first_session.user_id = session.user_id
    ORDER BY first_session.started_at ASC
    LIMIT 1
  ) THEN 'free'
  ELSE 'credit'
END
FROM user_profiles profile
WHERE profile.id = session.user_id
  AND session.access_type IS NULL;

ALTER TABLE exam_sessions
  ALTER COLUMN access_type SET DEFAULT 'free';

ALTER TABLE exam_sessions
  ALTER COLUMN access_type SET NOT NULL;

-- A user who intentionally buys an exam should receive the paid experience
-- immediately. Their Free Trial remains available for a later practice exam.
CREATE OR REPLACE FUNCTION consume_exam_access(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier TEXT;
  v_credits INTEGER;
  v_free_consumed BOOLEAN;
BEGIN
  SELECT subscription_tier, purchased_exam_credits, free_exam_consumed
    INTO v_tier, v_credits, v_free_consumed
  FROM user_profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF v_tier = 'workforce' THEN
    RETURN 'workforce';
  END IF;

  IF v_credits > 0 THEN
    UPDATE user_profiles
    SET purchased_exam_credits = purchased_exam_credits - 1
    WHERE id = p_user_id;
    RETURN 'credit';
  END IF;

  IF NOT coalesce(v_free_consumed, FALSE) THEN
    UPDATE user_profiles SET free_exam_consumed = TRUE WHERE id = p_user_id;
    RETURN 'free';
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
  ELSIF p_access_type = 'free' THEN
    UPDATE user_profiles
    SET free_exam_consumed = FALSE
    WHERE id = p_user_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION refund_exam_access(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION refund_exam_access(UUID, TEXT) TO service_role;
