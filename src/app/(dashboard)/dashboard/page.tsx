import Link from "next/link";
import { TrendingUp, BookOpen, Target, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { getDashboardData } from "@/lib/actions/dashboard";
import { getBillingStatus } from "@/lib/actions/billing";
import { redirect } from "next/navigation";

function ReadinessRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="124" height="124" viewBox="0 0 124 124" className="-rotate-90">
        <circle cx="62" cy="62" r={r} fill="none" stroke="#ede9fe" strokeWidth="12" />
        <circle cx="62" cy="62" r={r} fill="none" stroke="#6d28d9" strokeWidth="12"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-brand-700">{score}%</span>
        <span className="text-[10px] text-muted font-medium uppercase tracking-wide">Ready</span>
      </div>
    </div>
  );
}

function getReadinessLabel(score: number) {
  if (score >= 80) return "Exam Ready";
  if (score >= 65) return "Almost Ready";
  if (score > 0) return "In Progress";
  return "Just Starting";
}

export default async function DashboardPage() {
  const [data, billing] = await Promise.all([getDashboardData(), getBillingStatus()]);
  if (!data) redirect(ROUTES.login);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { profile, userCert, readiness, sessions, categoryBreakdown, stats, examDaysRemaining } = data as any;

  const firstName = (profile?.full_name as string | null)?.split(" ")[0] ?? "there";
  const cert = userCert?.certifications as { code: string; name: string } | null;
  const weakAreas = categoryBreakdown
    .slice(0, 4)
    .map((c: { category: string; accuracy: number }) => ({ label: c.category, pct: Math.round(c.accuracy) }));

  if (!userCert) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-foreground mb-3">Welcome to Readymetry</h1>
          <p className="text-sm text-muted mb-6">Choose a certification track to get started.</p>
          <Link
            href={ROUTES.onboarding}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
          >
            Choose Certification <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Welcome back, {firstName}</h1>
          <p className="text-sm text-muted mt-0.5">
            {cert?.code} Candidate
            {examDaysRemaining !== null && ` · Exam in ${examDaysRemaining} days`}
          </p>
        </div>
        <Link
          href={ROUTES.exams}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.3)]"
        >
          <BookOpen size={15} /> Start Practice
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tests Taken", value: stats?.totalSessions.toString() ?? "0", sub: "All time", icon: BookOpen, color: "text-brand-700 bg-brand-50" },
          { label: "Avg Score", value: `${stats?.avgScore ?? 0}%`, sub: "All sessions", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
          billing?.hasFullAnalytics
            ? { label: "Pass Probability", value: `${stats?.passProb ?? 0}%`, sub: "Based on recent tests", icon: Target, color: "text-brand-700 bg-brand-50" }
            : { label: "Exam Credits", value: `${billing?.examCredits ?? 0}`, sub: billing?.canStartExam ? "Available now" : "Buy another exam", icon: Target, color: "text-brand-700 bg-brand-50" },
          { label: "Access", value: billing?.hasFullAnalytics ? "Ready" : "Basic", sub: billing?.hasFullAnalytics ? "Analytics unlocked" : "Per-exam results", icon: Clock, color: "text-amber-600 bg-amber-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <Icon size={17} />
              </div>
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
              <p className="text-[11px] text-muted mt-1">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness card */}
        {billing?.hasFullAnalytics ? (
        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col items-center text-center">
          <p className="text-sm font-semibold text-foreground mb-4">Readiness Score</p>
          <ReadinessRing score={readiness} />
          <p className="text-sm font-bold text-foreground mt-4">{getReadinessLabel(readiness)}</p>
          {readiness === 0 ? (
            <p className="text-xs text-muted mt-1">Take your first practice test to see your score.</p>
          ) : (
            <p className="text-xs text-muted mt-1">Score 80%+ to be exam-ready</p>
          )}
          {readiness > 0 && readiness < 80 && weakAreas.length > 0 && (
            <div className="w-full mt-5 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Focus on {weakAreas[0].label} to improve your score</p>
            </div>
          )}
        </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col justify-center text-center">
            <p className="text-sm font-semibold text-foreground mb-2">Unlock readiness tracking</p>
            <p className="text-xs text-muted mb-5">See pass probability, weak areas, and progress across every exam with the Readiness Pack.</p>
            <Link href={ROUTES.pricing} className="inline-flex justify-center px-4 py-2.5 rounded-xl bg-brand-700 text-white text-xs font-semibold">
              View Readiness Pack
            </Link>
          </div>
        )}

        {/* Weak areas */}
        {billing?.hasFullAnalytics ? (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-foreground">Weak Areas</p>
            <Link href={ROUTES.analytics} className="text-xs text-brand-700 font-medium hover:underline flex items-center gap-0.5">
              See all <ChevronRight size={12} />
            </Link>
          </div>
          {weakAreas.length === 0 ? (
            <p className="text-sm text-muted">Take a practice test to see your weak areas.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {(weakAreas as { label: string; pct: number }[]).map((a) => (
                <div key={a.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-foreground">{a.label}</span>
                    <span className="text-xs font-semibold text-muted">{a.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${a.pct < 60 ? "bg-red-400" : a.pct < 70 ? "bg-amber-400" : "bg-brand-600"}`}
                      style={{ width: `${a.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-6 flex items-center justify-center text-center">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Weak-area analysis</p>
              <p className="text-xs text-muted">Included with the Readiness Pack.</p>
            </div>
          </div>
        )}

        {/* Recent sessions */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-foreground">Recent Sessions</p>
            <Link href={ROUTES.exams} className="text-xs text-brand-700 font-medium hover:underline">
              New test
            </Link>
          </div>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted">No sessions yet. Start a practice test!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {(sessions as { id: string; certifications: { code: string }; completed_at: string; total_questions: number; score: number }[]).map((s) => {
                const c = s.certifications;
                const date = new Date(s.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <Link
                    key={s.id}
                    href={ROUTES.results(s.id)}
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-brand-200 hover:bg-brand-50/50 transition-all group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground">{c.code}</p>
                      <p className="text-[11px] text-muted">{date} · {s.total_questions} questions</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${(s.score ?? 0) >= 72 ? "text-emerald-600" : "text-red-500"}`}>
                        {Math.round(s.score ?? 0)}%
                      </span>
                      <ChevronRight size={13} className="text-muted group-hover:text-brand-600 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
