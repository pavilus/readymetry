import { createClient } from "@/lib/supabase/server";
import { createSupportTicket } from "@/lib/actions/support";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  resolved: "bg-emerald-50 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
};

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, ticket_number, subject, category, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Support</h1>
        <p className="mt-1 text-sm text-muted">Send a request and track its status.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form action={createSupportTicket} className="space-y-4 border border-border bg-white p-6">
          <h2 className="text-sm font-bold text-foreground">New request</h2>
          <select name="category" className="w-full border border-border bg-white px-3 py-2 text-sm" defaultValue="general">
            <option value="general">General</option>
            <option value="account">Account</option>
            <option value="exam">Exam</option>
            <option value="technical">Technical</option>
          </select>
          <input name="subject" required minLength={3} maxLength={160} placeholder="Subject" className="w-full border border-border px-3 py-2 text-sm" />
          <textarea name="message" required minLength={10} maxLength={5000} rows={7} placeholder="Describe what happened" className="w-full resize-none border border-border px-3 py-2 text-sm" />
          <button className="w-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">Send request</button>
        </form>
        <div className="border border-border bg-white">
          <div className="border-b border-border px-5 py-4"><h2 className="text-sm font-bold text-foreground">Your requests</h2></div>
          {(tickets ?? []).map((ticket: Record<string, unknown>) => (
            <div key={ticket.id as string} className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-0">
              <div>
                <p className="text-sm font-semibold text-foreground">#{ticket.ticket_number as number} {ticket.subject as string}</p>
                <p className="mt-1 text-xs capitalize text-muted">{ticket.category as string} · {new Date(ticket.created_at as string).toLocaleDateString()}</p>
              </div>
              <span className={`shrink-0 px-2 py-1 text-[11px] font-semibold capitalize ${STATUS_COLORS[ticket.status as string] ?? ""}`}>
                {(ticket.status as string).replace("_", " ")}
              </span>
            </div>
          ))}
          {(tickets ?? []).length === 0 && <p className="p-8 text-center text-sm text-muted">No support requests yet.</p>}
        </div>
      </div>
    </div>
  );
}
