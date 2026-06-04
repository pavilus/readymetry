import { adminClient } from "@/lib/supabase/admin";

export default async function AdminLogsPage() {
  const db = adminClient();
  const [{ data: logs }, { data: authUsers }] = await Promise.all([
    db.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const emails = new Map<string, string>(
    authUsers.users.map((user: { id: string; email?: string }) => [user.id, user.email ?? "Unknown"] as const),
  );

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted">Latest administrative changes</p>
      </div>
      <div className="overflow-hidden border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs text-muted">
            <tr><th className="px-5 py-3">Action</th><th className="px-5 py-3">Actor</th><th className="px-5 py-3">Entity</th><th className="px-5 py-3">Time</th></tr>
          </thead>
          <tbody>
            {(logs ?? []).map((log: Record<string, unknown>) => (
              <tr key={log.id as string} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-mono text-xs text-foreground">{log.action as string}</td>
                <td className="px-5 py-3 text-xs text-muted">{emails.get(log.actor_id as string) ?? "System"}</td>
                <td className="px-5 py-3 text-xs text-muted">{log.entity_type as string} {log.entity_id ? `· ${log.entity_id as string}` : ""}</td>
                <td className="px-5 py-3 text-xs text-muted">{new Date(log.created_at as string).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(logs ?? []).length === 0 && <p className="p-10 text-center text-sm text-muted">No administrative activity recorded yet.</p>}
      </div>
    </div>
  );
}
