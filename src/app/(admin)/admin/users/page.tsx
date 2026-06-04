import { adminClient } from "@/lib/supabase/admin";
import { updateUserRole } from "@/lib/actions/admin";

const ROLE_COLORS: Record<string, string> = {
  user:            "bg-gray-100 text-gray-600",
  org_admin:       "bg-blue-100 text-blue-700",
  support_agent:   "bg-cyan-100 text-cyan-700",
  content_manager: "bg-amber-100 text-amber-700",
  admin:           "bg-purple-100 text-purple-700",
  super_admin:     "bg-red-100 text-red-700",
};

const ROLES = ["user", "admin"];

export default async function AdminUsersPage() {
  const db = adminClient();
  const { data: profiles } = await db
    .from("user_profiles")
    .select("id, full_name, role, account_type, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const { data: authUsers } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authById = new Map(authUsers.users.map((user: { id: string; email?: string; last_sign_in_at?: string }) => [user.id, user]));
  const users = (profiles ?? []).map((profile: Record<string, unknown>) => ({
    ...profile,
    ...(authById.get(profile.id as string) ?? {}),
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Users</h1>
        <p className="text-sm text-muted mt-0.5">{(users ?? []).length} users loaded</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5FA] border-b border-border">
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Last Sign-in</th>
              <th className="px-5 py-3 font-medium">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(users ?? []).map((u: any) => (
              <tr key={u.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground">{u.full_name ?? "—"}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-muted capitalize">{u.account_type ?? "individual"}</td>
                <td className="px-5 py-3 text-xs text-muted">
                  {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-5 py-3 text-xs text-muted">
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "Never"}
                </td>
                <td className="px-5 py-3">
                  <form action={async (fd: FormData) => {
                    "use server";
                    await updateUserRole(fd.get("user_id") as string, fd.get("role") as string);
                  }}>
                    <input type="hidden" name="user_id" value={u.id} />
                    <div className="flex items-center gap-2">
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="text-xs border border-border rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1 rounded-lg bg-brand-700 text-white font-medium hover:bg-brand-800 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
