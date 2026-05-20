import { adminClient } from "@/lib/supabase/admin";

const STATUS_COLORS: Record<string, string> = {
  open:         "bg-red-100 text-red-700",
  in_progress:  "bg-blue-100 text-blue-700",
  waiting_user: "bg-amber-100 text-amber-700",
  resolved:     "bg-emerald-100 text-emerald-700",
  closed:       "bg-gray-100 text-gray-500",
};

const PRIORITY_COLORS: Record<string, string> = {
  low:    "bg-gray-100 text-gray-500",
  medium: "bg-amber-100 text-amber-700",
  high:   "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default async function AdminTicketsPage() {
  const db = adminClient();
  const { data: tickets } = await db
    .from("support_tickets")
    .select("id, ticket_number, status, priority, category, subject, created_at, profiles(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Support Tickets</h1>
        <p className="text-sm text-muted mt-0.5">{(tickets ?? []).length} tickets</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5FA] border-b border-border">
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Subject</th>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(tickets ?? []).map((t: any) => {
              const user = t.profiles as { email: string; full_name: string | null } | null;
              return (
                <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-xs font-mono text-muted">{t.ticket_number}</td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="font-medium text-foreground truncate">{t.subject ?? "—"}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs text-foreground">{user?.full_name ?? "—"}</p>
                    <p className="text-[11px] text-muted">{user?.email ?? "—"}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted capitalize">{t.category?.replace("_", " ") ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[t.priority] ?? ""}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status] ?? ""}`}>
                      {t.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">
                    {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
            {(tickets ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted">No tickets yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
