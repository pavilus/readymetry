-- Keep staff-only support notes unavailable to authenticated browser clients.

REVOKE SELECT ON support_tickets FROM authenticated;
GRANT SELECT (
  id,
  ticket_number,
  user_id,
  subject,
  category,
  message,
  status,
  priority,
  created_at,
  updated_at
) ON support_tickets TO authenticated;
