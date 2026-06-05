-- Self-serve Workforce purchases create an organization and reserved seats.

CREATE TABLE IF NOT EXISTS workforce_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  seat_limit INTEGER NOT NULL CHECK (seat_limit > 0),
  stripe_customer_id TEXT,
  stripe_checkout_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workforce_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES workforce_organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'removed')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  joined_at TIMESTAMPTZ,
  UNIQUE (organization_id, email),
  UNIQUE (organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS workforce_organizations_owner_idx
  ON workforce_organizations(owner_user_id);

CREATE INDEX IF NOT EXISTS workforce_members_user_idx
  ON workforce_members(user_id);

CREATE INDEX IF NOT EXISTS workforce_members_email_status_idx
  ON workforce_members(lower(email), status);

ALTER TABLE workforce_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_members ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON workforce_organizations TO authenticated;
GRANT SELECT ON workforce_members TO authenticated;
GRANT ALL PRIVILEGES ON workforce_organizations TO service_role;
GRANT ALL PRIVILEGES ON workforce_members TO service_role;

CREATE OR REPLACE FUNCTION claim_workforce_invitation(
  p_user_id UUID,
  p_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member workforce_members%ROWTYPE;
  v_org workforce_organizations%ROWTYPE;
BEGIN
  SELECT *
    INTO v_member
  FROM workforce_members
  WHERE lower(email) = lower(p_email)
    AND status = 'pending'
  ORDER BY invited_at ASC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  SELECT *
    INTO v_org
  FROM workforce_organizations
  WHERE id = v_member.organization_id;

  UPDATE workforce_members
  SET user_id = p_user_id,
      status = 'active',
      joined_at = now()
  WHERE id = v_member.id;

  UPDATE user_profiles
  SET subscription_tier = 'workforce',
      account_type = 'enterprise',
      organization_name = coalesce(organization_name, v_org.name),
      plan_selected_at = coalesce(plan_selected_at, now())
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION claim_workforce_invitation(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION claim_workforce_invitation(UUID, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION fulfill_stripe_purchase(
  p_event_id TEXT,
  p_event_type TEXT,
  p_user_id UUID,
  p_product TEXT,
  p_customer_id TEXT DEFAULT NULL,
  p_checkout_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seats INTEGER;
  v_org_id UUID;
  v_org_name TEXT;
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
        stripe_customer_id = coalesce(p_customer_id, stripe_customer_id),
        plan_selected_at = coalesce(plan_selected_at, now())
    WHERE id = p_user_id;
  ELSIF p_product = 'readiness_pack' THEN
    UPDATE user_profiles
    SET subscription_tier = 'ready',
        purchased_exam_credits = purchased_exam_credits + 5,
        stripe_customer_id = coalesce(p_customer_id, stripe_customer_id),
        plan_selected_at = now()
    WHERE id = p_user_id;
  ELSIF p_product IN ('workforce_5', 'workforce_10', 'workforce_25') THEN
    v_seats := CASE p_product
      WHEN 'workforce_5' THEN 5
      WHEN 'workforce_10' THEN 10
      WHEN 'workforce_25' THEN 25
    END;

    SELECT coalesce(nullif(organization_name, ''), 'Readymetry Workforce Team')
      INTO v_org_name
    FROM user_profiles
    WHERE id = p_user_id;

    INSERT INTO workforce_organizations(
      owner_user_id,
      name,
      seat_limit,
      stripe_customer_id,
      stripe_checkout_session_id
    )
    VALUES (
      p_user_id,
      v_org_name,
      v_seats,
      p_customer_id,
      p_checkout_session_id
    )
    ON CONFLICT (stripe_checkout_session_id) DO UPDATE
      SET updated_at = now()
    RETURNING id INTO v_org_id;

    UPDATE user_profiles
    SET subscription_tier = 'workforce',
        account_type = 'enterprise',
        organization_name = v_org_name,
        stripe_customer_id = coalesce(p_customer_id, stripe_customer_id),
        plan_selected_at = now()
    WHERE id = p_user_id;

    INSERT INTO workforce_members(
      organization_id,
      user_id,
      email,
      role,
      status,
      joined_at
    )
    SELECT
      v_org_id,
      p_user_id,
      coalesce(auth.users.email, 'owner@readymetry.local'),
      'owner',
      'active',
      now()
    FROM auth.users
    WHERE auth.users.id = p_user_id
    ON CONFLICT (organization_id, email) DO UPDATE
      SET user_id = excluded.user_id,
          role = 'owner',
          status = 'active',
          joined_at = coalesce(workforce_members.joined_at, now());
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
REVOKE ALL ON FUNCTION fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT, TEXT) TO service_role;
