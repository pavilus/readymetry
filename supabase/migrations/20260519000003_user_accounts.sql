-- Add account type, Stripe billing, and enterprise org support

-- Extend user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS organization_name TEXT,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS purchased_exam_credits INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plan_selected_at TIMESTAMPTZ;

-- Organizations (Enterprise tier)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Org members / pending invites
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  UNIQUE(organization_id, email)
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orgs_owner_all" ON organizations FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE POLICY "org_members_owner_all" ON organization_members FOR ALL TO authenticated
  USING (organization_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid()));

CREATE POLICY "org_members_self_select" ON organization_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());

GRANT ALL ON organizations TO authenticated;
GRANT ALL ON organization_members TO authenticated;

-- Safe increment for exam credits (called from service role in webhook)
CREATE OR REPLACE FUNCTION increment_exam_credits(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE user_profiles
  SET purchased_exam_credits = purchased_exam_credits + p_amount
  WHERE id = p_user_id;
END;
$$;
