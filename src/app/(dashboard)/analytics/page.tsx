import { getAnalyticsData } from "@/lib/actions/analytics";
import AnalyticsCharts from "./AnalyticsCharts";
import { StaggerList, StaggerItem } from "@/components/ui/FadeIn";
import { getBillingStatus } from "@/lib/actions/billing";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default async function AnalyticsPage() {
  const billing = await getBillingStatus();
  if (!billing?.hasFullAnalytics) redirect(ROUTES.pricing);
  const data = await getAnalyticsData();

  type Session = NonNullable<typeof data>["sessions"][number];
  const sessions: Session[] = data?.sessions ?? [];
  const trend = data?.trend ?? [];
  const categoryBreakdown = data?.categoryBreakdown ?? [];
  const stats = data?.stats ?? { totalQuestions: 0, avgScore: 0, totalSessions: 0, streak: 0 };

  const domainData = categoryBreakdown.map((c: { category: string; accuracy: number }) => ({
    domain: c.category.length > 12 ? c.category.slice(0, 12) + "…" : c.category,
    fullDomain: c.category,
    score: Math.round(c.accuracy),
  }));

  // Radar uses abbreviated category names (max 10 chars)
  const radarData = categoryBreakdown.map((c: { category: string; accuracy: number }) => ({
    subject: c.category.split(" ")[0],
    score: Math.round(c.accuracy),
    fullMark: 100,
  }));

  const weakAreas = [...categoryBreakdown]
    .sort((a: { accuracy: number }, b: { accuracy: number }) => a.accuracy - b.accuracy)
    .slice(0, 5)
    .map((c: { category: string; accuracy: number }) => ({
      label: c.category,
      pct: Math.round(c.accuracy),
      priority: c.accuracy < 60 ? "High" : c.accuracy < 75 ? "Medium" : "Low",
    }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Analytics</h1>
        <p className="text-sm text-muted mt-1">Your performance trends and readiness insights.</p>
      </div>

      {/* Summary stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Questions", value: stats.totalQuestions.toLocaleString() },
          { label: "Avg Score", value: `${stats.avgScore}%` },
          { label: "Sessions", value: stats.totalSessions.toString() },
          { label: "Study Streak", value: `${stats.streak} day${stats.streak !== 1 ? "s" : ""}` },
        ].map((s) => (
          <StaggerItem key={s.label} className="bg-white rounded-2xl border border-border p-5">
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </StaggerItem>
        ))}
      </StaggerList>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-sm font-semibold text-foreground mb-2">No sessions yet</p>
          <p className="text-xs text-muted">Complete a practice test to see your analytics.</p>
        </div>
      ) : (
        <AnalyticsCharts
          trend={trend}
          domainData={domainData}
          weakAreas={weakAreas}
          radarData={radarData}
          sessions={(sessions as Record<string, unknown>[]).map((s) => {
            const c = s.certifications as { code: string };
            const timeTaken = s.time_taken_seconds as number | null;
            const totalQ = s.total_questions as number;
            return {
              date: new Date(s.completed_at as string).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              cert: c.code,
              categories: (s.categories as string[] | null)?.join(", ") ?? "All topics",
              questions: totalQ,
              score: Math.round((s.score as number) ?? 0),
              time: timeTaken ? `${Math.floor(timeTaken / 60)}m` : "—",
              avgTimeSec: timeTaken && totalQ > 0 ? Math.round(timeTaken / totalQ) : null,
            };
          })}
        />
      )}
    </div>
  );
}
