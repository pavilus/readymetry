-- Trace every purchase and payment lifecycle event without exposing it to browser clients.

CREATE TABLE stripe_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product TEXT NOT NULL CHECK (product IN ('single_exam', 'readiness_pack', 'workforce_5', 'workforce_10', 'workforce_25')),
  stripe_checkout_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_customer_id TEXT,
  amount_total BIGINT NOT NULL CHECK (amount_total >= 0),
  amount_refunded BIGINT NOT NULL DEFAULT 0 CHECK (amount_refunded >= 0),
  currency TEXT NOT NULL CHECK (currency ~ '^[a-z]{3}$'),
  payment_status TEXT NOT NULL DEFAULT 'paid'
    CHECK (payment_status IN ('paid', 'partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost')),
  fulfillment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (fulfillment_status IN ('pending', 'fulfilled', 'requires_review')),
  entitlement_units INTEGER NOT NULL CHECK (entitlement_units > 0),
  action_required BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  refunded_at TIMESTAMPTZ,
  disputed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX stripe_purchases_user_idx ON stripe_purchases(user_id, paid_at DESC);
CREATE INDEX stripe_purchases_status_idx ON stripe_purchases(payment_status, action_required, paid_at DESC);

CREATE TABLE stripe_payment_events (
  event_id TEXT PRIMARY KEY,
  purchase_id UUID REFERENCES stripe_purchases(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  stripe_object_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  amount BIGINT,
  currency TEXT,
  object_status TEXT,
  processing_status TEXT NOT NULL DEFAULT 'processed'
    CHECK (processing_status IN ('processed', 'unmatched')),
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX stripe_payment_events_purchase_idx ON stripe_payment_events(purchase_id, received_at DESC);
CREATE INDEX stripe_payment_events_unmatched_idx ON stripe_payment_events(processing_status, received_at DESC);

ALTER TABLE stripe_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_payment_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON stripe_purchases, stripe_payment_events FROM PUBLIC, anon, authenticated;
GRANT SELECT ON stripe_purchases, stripe_payment_events TO service_role;

DROP FUNCTION IF EXISTS fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT, TEXT);

CREATE FUNCTION fulfill_stripe_purchase(
  p_event_id TEXT,
  p_event_type TEXT,
  p_user_id UUID,
  p_product TEXT,
  p_customer_id TEXT,
  p_checkout_session_id TEXT,
  p_payment_intent_id TEXT,
  p_amount_total BIGINT,
  p_currency TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase_id UUID;
  v_units INTEGER;
  v_seats INTEGER;
  v_org_id UUID;
  v_org_name TEXT;
BEGIN
  IF p_checkout_session_id IS NULL OR p_amount_total IS NULL OR p_amount_total < 0
     OR p_currency !~ '^[a-z]{3}$' THEN
    RAISE EXCEPTION 'Invalid Stripe purchase data';
  END IF;

  v_units := CASE p_product
    WHEN 'single_exam' THEN 1
    WHEN 'readiness_pack' THEN 5
    WHEN 'workforce_5' THEN 5
    WHEN 'workforce_10' THEN 10
    WHEN 'workforce_25' THEN 25
    ELSE NULL
  END;
  IF v_units IS NULL THEN RAISE EXCEPTION 'Unknown Stripe product'; END IF;

  -- Preserve idempotency history from deployments before the purchase ledger existed.
  INSERT INTO processed_stripe_events(event_id, event_type)
  VALUES (p_event_id, p_event_type)
  ON CONFLICT (event_id) DO NOTHING;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  INSERT INTO stripe_payment_events(
    event_id, event_type, stripe_object_id, stripe_payment_intent_id, amount, currency
  ) VALUES (
    p_event_id, p_event_type, p_checkout_session_id, p_payment_intent_id, p_amount_total, p_currency
  );

  INSERT INTO stripe_purchases(
    user_id, product, stripe_checkout_session_id, stripe_payment_intent_id,
    stripe_customer_id, amount_total, currency, entitlement_units
  ) VALUES (
    p_user_id, p_product, p_checkout_session_id, p_payment_intent_id,
    p_customer_id, p_amount_total, p_currency, v_units
  )
  ON CONFLICT (stripe_checkout_session_id) DO NOTHING
  RETURNING id INTO v_purchase_id;

  IF v_purchase_id IS NULL THEN
    UPDATE stripe_payment_events
    SET purchase_id = (SELECT id FROM stripe_purchases WHERE stripe_checkout_session_id = p_checkout_session_id)
    WHERE event_id = p_event_id;
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
  ELSE
    v_seats := v_units;
    SELECT coalesce(nullif(organization_name, ''), 'Readymetry Workforce Team')
      INTO v_org_name FROM user_profiles WHERE id = p_user_id;

    INSERT INTO workforce_organizations(
      owner_user_id, name, seat_limit, stripe_customer_id, stripe_checkout_session_id
    ) VALUES (
      p_user_id, v_org_name, v_seats, p_customer_id, p_checkout_session_id
    )
    ON CONFLICT (stripe_checkout_session_id) DO UPDATE SET updated_at = now()
    RETURNING id INTO v_org_id;

    UPDATE user_profiles
    SET subscription_tier = 'workforce', account_type = 'enterprise',
        organization_name = v_org_name,
        stripe_customer_id = coalesce(p_customer_id, stripe_customer_id),
        plan_selected_at = now()
    WHERE id = p_user_id;

    INSERT INTO workforce_members(organization_id, user_id, email, role, status, joined_at)
    SELECT v_org_id, p_user_id, coalesce(email, 'owner@readymetry.local'), 'owner', 'active', now()
    FROM auth.users WHERE id = p_user_id
    ON CONFLICT (organization_id, email) DO UPDATE SET
      user_id = excluded.user_id, role = 'owner', status = 'active',
      joined_at = coalesce(workforce_members.joined_at, now());
  END IF;

  IF NOT FOUND THEN RAISE EXCEPTION 'User profile not found'; END IF;

  UPDATE stripe_purchases SET fulfillment_status = 'fulfilled', updated_at = now()
  WHERE id = v_purchase_id;
  UPDATE stripe_payment_events SET purchase_id = v_purchase_id WHERE event_id = p_event_id;
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION fulfill_stripe_purchase(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT) TO service_role;

CREATE FUNCTION record_stripe_lifecycle_event(
  p_event_id TEXT,
  p_event_type TEXT,
  p_object_id TEXT,
  p_payment_intent_id TEXT,
  p_charge_id TEXT,
  p_amount BIGINT,
  p_currency TEXT,
  p_object_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase stripe_purchases%ROWTYPE;
BEGIN
  INSERT INTO stripe_payment_events(
    event_id, event_type, stripe_object_id, stripe_payment_intent_id,
    stripe_charge_id, amount, currency, object_status, processing_status
  ) VALUES (
    p_event_id, p_event_type, p_object_id, p_payment_intent_id,
    p_charge_id, p_amount, p_currency, p_object_status, 'unmatched'
  ) ON CONFLICT (event_id) DO NOTHING;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  SELECT * INTO v_purchase FROM stripe_purchases
  WHERE (p_payment_intent_id IS NOT NULL AND stripe_payment_intent_id = p_payment_intent_id)
     OR (p_charge_id IS NOT NULL AND stripe_charge_id = p_charge_id)
  ORDER BY paid_at DESC LIMIT 1 FOR UPDATE;

  IF NOT FOUND THEN RETURN FALSE; END IF;

  UPDATE stripe_payment_events
  SET purchase_id = v_purchase.id, processing_status = 'processed'
  WHERE event_id = p_event_id;

  IF p_event_type = 'charge.refunded' THEN
    UPDATE stripe_purchases SET
      stripe_charge_id = coalesce(p_charge_id, stripe_charge_id),
      amount_refunded = greatest(coalesce(p_amount, 0), amount_refunded),
      payment_status = CASE
        WHEN coalesce(p_amount, 0) >= amount_total THEN 'refunded'
        ELSE 'partially_refunded'
      END,
      fulfillment_status = 'requires_review',
      action_required = TRUE,
      refunded_at = now(), updated_at = now()
    WHERE id = v_purchase.id;
  ELSIF p_event_type = 'charge.dispute.created' THEN
    UPDATE stripe_purchases SET
      stripe_charge_id = coalesce(p_charge_id, stripe_charge_id),
      payment_status = 'disputed', fulfillment_status = 'requires_review',
      action_required = TRUE, disputed_at = now(), updated_at = now()
    WHERE id = v_purchase.id;
  ELSIF p_event_type = 'charge.dispute.closed' THEN
    UPDATE stripe_purchases SET
      stripe_charge_id = coalesce(p_charge_id, stripe_charge_id),
      payment_status = CASE WHEN p_object_status IN ('won', 'warning_closed') THEN 'dispute_won' ELSE 'dispute_lost' END,
      fulfillment_status = CASE WHEN p_object_status IN ('won', 'warning_closed') THEN 'fulfilled' ELSE 'requires_review' END,
      action_required = p_object_status NOT IN ('won', 'warning_closed'),
      updated_at = now()
    WHERE id = v_purchase.id;
  END IF;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION record_stripe_lifecycle_event(TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION record_stripe_lifecycle_event(TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT) TO service_role;
