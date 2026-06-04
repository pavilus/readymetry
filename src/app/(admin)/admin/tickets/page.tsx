import { adminClient } from "@/lib/supabase/admin";
import { updateSupportTicket } from "@/lib/actions/admin";

export default async function AdminTicketsPage() {
  const db = adminClient();
  const [{ data: tickets }, { data: authUsers }] = await Promise.all([
    db.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(100),
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const emails = new Map<string, string>(
    authUsers.users.map((user: { id: string; email?: string }) => [user.id, user.email ?? "Unknown"] as const),
  );

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Support Tickets</h1>
        <p className="mt-1 text-sm text-muted">{(tickets ?? []).length} requests loaded</p>
      </div>
      <div className="space-y-4">
        {(tickets ?? []).map((ticket: Record<string, unknown>) => (
          <form key={ticket.id as string} action={updateSupportTicket} className="grid gap-4 border border-border bg-white p-5 lg:grid-cols-[1fr_180px_220px]">
            <input type="hidden" name="ticket_id" value={ticket.id as string} />
            <div>
              <p className="text-sm font-bold text-foreground">#{ticket.ticket_number as number} {ticket.subject as string}</p>
              <p className="mt-1 text-xs text-muted">{emails.get(ticket.user_id as string)} · {ticket.category as string}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{ticket.message as string}</p>
            </div>
            <div className="space-y-3">
              <select name="status" defaultValue={ticket.status as string} className="w-full border border-border bg-white px-3 py-2 text-xs">
                {["open", "in_progress", "resolved", "closed"].map((status) => <option key={status}>{status}</option>)}
              </select>
              <select name="priority" defaultValue={ticket.priority as string} className="w-full border border-border bg-white px-3 py-2 text-xs">
                {["low", "medium", "high", "urgent"].map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <textarea name="internal_notes" defaultValue={(ticket.internal_notes as string | null) ?? ""} rows={4} placeholder="Internal notes" className="w-full resize-none border border-border px-3 py-2 text-xs" />
              <button className="w-full bg-brand-700 px-3 py-2 text-xs font-semibold text-white">Save</button>
            </div>
          </form>
        ))}
        {(tickets ?? []).length === 0 && <p className="border border-border bg-white p-10 text-center text-sm text-muted">No support tickets yet.</p>}
      </div>
    </div>
  );
}
