import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, TrendingUp, Clock, BookOpen, Sparkles, Target } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { getSessionResults } from "@/lib/actions/exams";
import { redirect } from "next/navigation";

function ScoreRing({ score, passingScore }: { score: number; passingScore: number }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const passed = score >= passingScore;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#ede9fe" strokeWidth="14" />
        <circle
          cx="72" cy="72" r={r} fill="none"
          stroke={passed ? "#10b981" : "#6d28d9"}
          strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-extrabold ${passed ? "text-emerald-600" : "text-brand-700"}`}>{score}%</span>
        <span className="text-[10px] text-muted font-medium uppercase tracking-wide mt-0.5">
          {passed ? "Passed" : "Keep going"}
        </span>
      </div>
    </div>
  );
}

function generateFeedback(
  score: number,
  passingScore: number,
  categoryBreakdown: { category: string; accuracy: number; total: number }[],
  avgTimeSec: number | null,
) {
  const passed = score >= passingScore;
  const gap = passingScore - score;
  const topWeak = [...categoryBreakdown].sort((a, b) => a.accuracy - b.accuracy).slice(0, 2);
  const topStrong = [...categoryBreakdown].sort((a, b) => b.accuracy - a.accuracy).slice(0, 1);

  const summary = passed
    ? `Strong performance — you scored ${score}%, ${score - passingScore} points above the ${passingScore}% passing threshold. Your results show solid exam readiness.`
    : `You scored ${score}%, just ${gap} point${gap !== 1 ? "s" : ""} below the ${passingScore}% passing threshold. With focused practice on your weak areas, you can close this gap quickly.`;

  const recs: string[] = [];

  if (topWeak.length > 0 && topWeak[0].accuracy < 70) {
    recs.push(`Focus on ${topWeak[0].category} — your ${topWeak[0].accuracy}% accuracy here has the highest impact on your overall score.`);
  }
  if (topWeak.length > 1 && topWeak[1].accuracy < 75) {
    recs.push(`${topWeak[1].category} also needs attention at ${topWeak[1].accuracy}%. Review core concepts in this domain before your next session.`);
  }
  if (topStrong.length > 0 && topStrong[0].accuracy >= 85) {
    recs.push(`${topStrong[0].category} is a clear strength at ${topStrong[0].accuracy}%. Use this as your confidence anchor going into the real exam.`);
  }
  if (avgTimeSec !== null && avgTimeSec > 120) {
    recs.push(`Your average pace was ${Math.floor(avgTimeSec / 60)}m ${avgTimeSec % 60}s per question — above the 2-minute target. Work on building speed through timed drills.`);
  } else if (avgTimeSec !== null && avgTimeSec < 30) {
    recs.push(`You averaged only ${avgTimeSec}s per question. Make sure you're reading each question fully before selecting an answer.`);
  }
  if (!passed && gap <= 10) {
    recs.push(`You're very close to passing. One more focused session on your weak areas should get you over the line.`);
  }

  return { summary, recs };
}

export default async function ResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const data = await getSessionResults(sessionId);

  if (!data) redirect(ROUTES.dashboard);

  type ResultsData = {
    session: {
      certifications: { code: string; name: string; passing_score: number };
      score: number | null;
      total_questions: number;
      time_taken_seconds: number | null;
      completed_at: string | null;
      started_at: string;
    };
    categoryBreakdown: { category: string; accuracy: number; correct: number; total: number }[];
    answers: { time_spent_seconds: number | null; is_correct: boolean; questions: { category: string } }[];
    entitlements: { hasDetailedResults: boolean; hasFullAnalytics: boolean };
  };
  const { session, categoryBreakdown, answers, entitlements } = data as unknown as ResultsData;
  const hasDetailedResults = entitlements?.hasDetailedResults ?? false;
  const cert = session.certifications as { code: string; name: string; passing_score: number };
  const score = Math.round(session.score ?? 0);
  const passingScore = cert.passing_score ?? 72;
  const passed = score >= passingScore;
  const avgTimeSec = session.total_questions > 0 && session.time_taken_seconds
    ? Math.round(session.time_taken_seconds / session.total_questions)
    : null;
  const passProb = score >= 80 ? Math.min(95, score + 5) : Math.max(30, score - 5);

  const examDate = new Date(session.completed_at ?? session.started_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const weakAreas = [...categoryBreakdown]
    .sort((a: { accuracy: number }, b: { accuracy: number }) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const { summary, recs } = generateFeedback(score, passingScore, categoryBreakdown, avgTimeSec);

  // Pacing data: time_taken_seconds per question from answers
  const slowQuestions = answers.filter((a) => (a.time_spent_seconds ?? 0) > 120).length;
  const fastQuestions = answers.filter((a) => (a.time_spent_seconds ?? 0) < 20 && (a.time_spent_seconds ?? 0) > 0).length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Results & Analysis</h1>
        <p className="text-sm text-muted mt-1">
          {cert.code} · {examDate} · {session.total_questions} questions
        </p>
      </div>

      <div className={`grid grid-cols-1 ${hasDetailedResults ? "lg:grid-cols-3" : "max-w-md"} gap-6 mb-6`}>
        {/* Score card */}
        <div className="bg-white rounded-2xl border border-border p-8 flex flex-col items-center text-center gap-4">
          <ScoreRing score={score} passingScore={passingScore} />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${passed ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`}>
            {passed
              ? <CheckCircle size={14} className="text-emerald-600" />
              : <XCircle size={14} className="text-amber-600" />}
            <span className={`text-xs font-semibold ${passed ? "text-emerald-700" : "text-amber-700"}`}>
              {passed ? `Passed · Passing score ${passingScore}%` : `Below passing score of ${passingScore}%`}
            </span>
          </div>
        </div>

        {/* Stats */}
        {hasDetailedResults && (
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-brand-700 bg-brand-50">
              <TrendingUp size={17} />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{passProb}%</p>
            <p className="text-xs text-muted mt-0.5">Pass Probability</p>
            <p className="text-[11px] text-muted mt-0.5">Based on this session</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-emerald-600 bg-emerald-50">
              <Clock size={17} />
            </div>
            <p className="text-2xl font-extrabold text-foreground">
              {avgTimeSec ? `${Math.floor(avgTimeSec / 60)}m ${avgTimeSec % 60}s` : "—"}
            </p>
            <p className="text-xs text-muted mt-0.5">Avg Time / Question</p>
          </div>
        </div>
        )}

        {/* Weak areas */}
        {hasDetailedResults && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <p className="text-sm font-semibold text-foreground mb-4">Areas to Improve</p>
          {weakAreas.length === 0 ? (
            <p className="text-sm text-muted">Take more tests to see weak areas.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {weakAreas.map((item: { category: string; accuracy: number }) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-foreground">{item.category}</span>
                    <span className="text-xs font-semibold text-muted">{item.accuracy}%</span>
                  </div>
                  <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.accuracy < 60 ? "bg-red-400" : "bg-amber-400"}`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>

      {/* AI Feedback Summary */}
      {hasDetailedResults ? (
      <>
      <div className="bg-gradient-to-br from-brand-700 to-purple-800 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-purple-200" />
          <span className="text-sm font-semibold text-purple-100">Performance Summary</span>
        </div>
        <p className="text-sm leading-relaxed text-white/90 mb-4">{summary}</p>
        {recs.length > 0 && (
          <div className="flex flex-col gap-2">
            {recs.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-purple-100">{i + 1}</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pacing analysis */}
      {session.time_taken_seconds && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <p className="text-sm font-semibold text-foreground mb-5">Pacing Analysis</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Time", value: `${Math.floor(session.time_taken_seconds / 60)}m ${session.time_taken_seconds % 60}s`, icon: Clock, color: "text-brand-700 bg-brand-50" },
              { label: "Avg / Question", value: avgTimeSec ? `${avgTimeSec}s` : "—", icon: Target, color: "text-emerald-600 bg-emerald-50" },
              { label: "Slow (>2 min)", value: slowQuestions.toString(), icon: XCircle, color: "text-amber-600 bg-amber-50" },
              { label: "Quick (<20s)", value: fastQuestions.toString(), icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col gap-2 p-4 rounded-xl bg-surface border border-border">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon size={15} />
                  </div>
                  <p className="text-xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Domain breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <p className="text-sm font-semibold text-foreground mb-5">Domain Mastery</p>
          <div className="flex flex-col gap-4">
            {[...categoryBreakdown].sort((a: { accuracy: number }, b: { accuracy: number }) => b.accuracy - a.accuracy).map((d: { category: string; accuracy: number; total: number }) => (
              <div key={d.category} className="flex items-center gap-4">
                <span className="text-xs text-foreground w-40 shrink-0">{d.category}</span>
                <div className="flex-1 h-2 bg-brand-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      d.accuracy >= passingScore ? "bg-emerald-500" : d.accuracy >= 60 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ width: `${d.accuracy}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-10 text-right ${
                  d.accuracy >= passingScore ? "text-emerald-600" : d.accuracy >= 60 ? "text-amber-600" : "text-red-500"
                }`}>
                  {d.accuracy}%
                </span>
                <span className="text-[11px] text-muted w-20">{d.total} questions</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <p className="text-sm font-semibold text-foreground mb-2">Free Trial result</p>
          <p className="text-sm text-muted mb-5">
            Your Free Trial includes your score and pass result. Purchase a Single Exam Credit for detailed explanations and per-exam analysis, or choose the Readiness Pack for long-term readiness tracking.
          </p>
          <Link href={ROUTES.pricing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold">
            Compare access options <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {hasDetailedResults ? (
        <Link
          href={ROUTES.reviewResults(sessionId)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.3)]"
        >
          <BookOpen size={15} /> Review Answers
        </Link>
        ) : (
          <Link
            href={ROUTES.pricing}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
          >
            <BookOpen size={15} /> Unlock Detailed Review
          </Link>
        )}
        <Link
          href={ROUTES.exams}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-surface transition-colors"
        >
          <ArrowRight size={15} /> Practice Weak Areas
        </Link>
        <Link
          href={ROUTES.exams}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-surface transition-colors"
        >
          <RotateCcw size={15} /> New Test
        </Link>
      </div>
    </div>
  );
}
