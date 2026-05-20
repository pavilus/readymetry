import { adminClient } from "@/lib/supabase/admin";

export default async function AdminLogsPage() {
  const db = adminClient();
  const { data: logs } = await db
    .from("audit_logs")
    .select("id, action, entity_type, entity_id, actor_id, ip_address, created_at, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted mt-0.5">Last 100 events</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5FA] border-b border-border">
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Entity</th>
              <th className="px-5 py-3 font-medium">Actor</th>
              <th className="px-5 py-3 font-medium">IP</th>
              <th className="px-5 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(logs ?? []).map((l: any) => {
              const actor = l.profiles as { email: string } | null;
              return (
                <tr key={l.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{l.action}</span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs text-foreground font-medium">{l.entity_type}</p>
                    {l.entity_id && <p className="text-[11px] text-muted font-mono truncate max-w-[120px]">{l.entity_id}</p>}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">{actor?.email ?? l.actor_id ?? "system"}</td>
                  <td className="px-5 py-3 text-xs font-mono text-muted">{l.ip_address ?? "—"}</td>
                  <td className="px-5 py-3 text-xs text-muted">
                    {new Date(l.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            })}
            {(logs ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted">No audit logs yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
