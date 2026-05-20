import { adminClient } from "@/lib/supabase/admin";
import { Users, BookOpen, DollarSign, MessageSquare } from "lucide-react";

function fmt(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export default async function AdminOverviewPage() {
  const db  = adminClient();
  const now = new Date();
  const day7ago   = new Date(now.getTime() - 7  * 86400000).toISOString();
  const day30ago  = new Date(now.getTime() - 30 * 86400000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    totalUsers, activeUsers, newUsers,
    totalSessions, completedSessions,
    revenueAll, revenueMonth,
    openTickets,
    totalQuestions,
    recentUsers,
  ] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("profiles").select("id", { count: "exact", head: true }).gte("last_sign_in_at", day7ago),
    db.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", day30ago),
    db.from("exam_sessions").select("id", { count: "exact", head: true }),
    db.from("exam_sessions").select("id", { count: "exact", head: true }).eq("status", "submitted"),
    db.from("purchases").select("amount_cents").eq("status", "completed"),
    db.from("purchases").select("amount_cents").eq("status", "completed").gte("created_at", monthStart),
    db.from("support_tickets").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
    db.from("questions").select("id", { count: "exact", head: true }).eq("active", true),
    db.from("profiles").select("id, email, full_name, role, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalRevenue = (revenueAll.data ?? []).reduce((s: number, r: any) => s + (r.amount_cents ?? 0), 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monthRevenue = (revenueMonth.data ?? []).reduce((s: number, r: any) => s + (r.amount_cents ?? 0), 0);

  const stats = [
    {
      label: "Total Users",
      value: (totalUsers.count ?? 0).toLocaleString(),
      sub: `${activeUsers.count ?? 0} active this week · ${newUsers.count ?? 0} new this month`,
      icon: Users,
      color: "text-brand-700 bg-brand-50",
    },
    {
      label: "Exam Sessions",
      value: (totalSessions.count ?? 0).toLocaleString(),
      sub: `${completedSessions.count ?? 0} completed`,
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Revenue",
      value: fmt(totalRevenue),
      sub: `${fmt(monthRevenue)} this month`,
      icon: DollarSign,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Open Tickets",
      value: (openTickets.count ?? 0).toLocaleString(),
      sub: `${totalQuestions.count ?? 0} active questions in bank`,
      icon: MessageSquare,
      color: "text-red-500 bg-red-50",
    },
  ];

  const ROLE_COLORS: Record<string, string> = {
    user:            "bg-gray-100 text-gray-600",
    org_admin:       "bg-blue-100 text-blue-700",
    support_agent:   "bg-cyan-100 text-cyan-700",
    content_manager: "bg-amber-100 text-amber-700",
    admin:           "bg-purple-100 text-purple-700",
    super_admin:     "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted mt-0.5">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <Icon size={17} />
              </div>
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
              <p className="text-[11px] text-muted mt-1">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Recent Users</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="pb-2 font-medium">Name / Email</th>
              <th className="pb-2 font-medium">Role</th>
              <th className="pb-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(recentUsers.data ?? []).map((u: any) => (
              <tr key={u.id} className="border-b border-border/50 last:border-0">
                <td className="py-2.5 pr-4">
                  <p className="font-medium text-foreground">{u.full_name ?? "—"}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="py-2.5 pr-4">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-2.5 text-xs text-muted">
                  {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
