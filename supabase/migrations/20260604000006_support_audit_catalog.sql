-- Keep certification question counts truthful and add support/audit operations.

CREATE OR REPLACE FUNCTION sync_certification_question_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_certification_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_certification_id := OLD.certification_id;
  ELSE
    v_certification_id := NEW.certification_id;
  END IF;
  UPDATE certifications
  SET question_count = (SELECT count(*) FROM questions WHERE certification_id = v_certification_id)
  WHERE id = v_certification_id;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_certification_question_count_trigger ON questions;
CREATE TRIGGER sync_certification_question_count_trigger
AFTER INSERT OR UPDATE OF certification_id OR DELETE ON questions
FOR EACH ROW EXECUTE FUNCTION sync_certification_question_count();

UPDATE certifications certification
SET question_count = (SELECT count(*) FROM questions WHERE certification_id = certification.id);

UPDATE certifications SET available = FALSE WHERE question_count = 0;

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (char_length(subject) BETWEEN 3 AND 160),
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'account', 'exam', 'technical')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own_tickets" ON support_tickets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users_create_own_tickets" ON support_tickets FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND status = 'open' AND priority = 'medium' AND internal_notes IS NULL
);
REVOKE ALL ON support_tickets FROM authenticated;
GRANT SELECT, INSERT (user_id, subject, category, message) ON support_tickets TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE support_tickets_ticket_number_seq TO authenticated;

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON audit_logs FROM anon, authenticated;
GRANT ALL ON support_tickets, audit_logs TO service_role;
GRANT ALL ON SEQUENCE support_tickets_ticket_number_seq TO service_role;
