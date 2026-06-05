import Link from "next/link";
import { ArrowRight, TrendingUp, Target, Zap } from "lucide-react";
import { ROUTES } from "@/lib/constants";

function ReadinessRing({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#ede9fe" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke="#6d28d9"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-brand-700">{score}%</span>
        <span className="text-[9px] text-muted font-medium">Ready</span>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-brand-700/10 rounded-3xl blur-2xl" />

      <div className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(109,40,217,0.15)] border border-brand-100 p-5 w-[300px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted">Welcome back,</p>
            <p className="text-sm font-semibold text-foreground">Alex</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-xs font-bold text-brand-700">A</span>
          </div>
        </div>

        {/* Readiness score */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-surface rounded-xl">
          <ReadinessRing score={78} />
          <div>
            <p className="text-xs text-muted mb-0.5">Readiness Score</p>
            <p className="text-sm font-semibold text-foreground">Almost Ready</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={11} className="text-success" />
              <span className="text-[11px] text-success font-medium">+6% this week</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-surface rounded-lg p-2.5">
            <p className="text-xs text-muted">Tests Taken</p>
            <p className="text-base font-bold text-foreground">12</p>
          </div>
          <div className="bg-surface rounded-lg p-2.5">
            <p className="text-xs text-muted">Avg Score</p>
            <p className="text-base font-bold text-foreground">74%</p>
          </div>
        </div>

        {/* Weak areas */}
        <div>
          <p className="text-xs font-medium text-muted mb-2">Weak Areas</p>
          {[
            { label: "Metallurgy", pct: 52 },
            { label: "Visual Inspection", pct: 61 },
            { label: "Weld Symbols", pct: 67 },
          ].map((item) => (
            <div key={item.label} className="mb-2">
              <div className="flex justify-between mb-0.5">
                <span className="text-[11px] text-foreground">{item.label}</span>
                <span className="text-[11px] text-muted">{item.pct}%</span>
              </div>
              <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-700 rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-elevated border border-border px-3 py-2 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
          <Target size={12} className="text-success" />
        </div>
        <div>
          <p className="text-[10px] text-muted">Pass Probability</p>
          <p className="text-xs font-bold text-foreground">79%</p>
        </div>
      </div>
    </div>
  );
}

const STATS = [
  { value: "1 free", label: "practice exam" },
  { value: "No", label: "subscription required" },
  { value: "AWS CWI", label: "available now" },
];

export default function Hero() {
  return (
    <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-50 blur-3xl opacity-60 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left — copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 mb-6">
              <Zap size={12} className="text-brand-700" />
              <span className="text-xs font-semibold text-brand-700">Certification Readiness Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-6">
              Know If You&apos;re{" "}
              <span className="text-brand-700">Ready</span>{" "}
              Before Exam Day
            </h1>

            <p className="text-lg text-muted leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Realistic practice exams, intelligent analytics, and personalized insights to help you pass with confidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link
                href={ROUTES.signup}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white font-semibold text-sm hover:bg-brand-800 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.4)]"
              >
                Start Free Practice
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#certifications"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-surface transition-colors"
              >
                Explore Certifications
              </Link>
            </div>

            <p className="text-sm text-muted">AWS CWI practice is available now. Additional certification tracks are coming soon.</p>
          </div>

          {/* Right — dashboard preview */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <DashboardPreview />
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 flex items-center gap-0 divide-x divide-border max-w-xl mx-auto lg:mx-0">
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 px-6 first:pl-0 last:pr-0 text-center lg:text-left">
              <p className="text-2xl font-extrabold text-brand-700">{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
