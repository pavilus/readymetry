import { BarChart3, Clock3, FileCheck2, ListChecks, ShieldCheck, Target } from "lucide-react";

const FEATURES = [
  {
    icon: Clock3,
    title: "Timed exam simulation",
    description: "Practice under realistic timing with saved progress, confidence tracking, and completion scoring.",
  },
  {
    icon: Target,
    title: "Focused topic drills",
    description: "Build sessions around weak categories such as metallurgy, weld symbols, visual inspection, and NDE.",
  },
  {
    icon: BarChart3,
    title: "Readiness analytics",
    description: "Use score trends, category breakdowns, and pass-readiness indicators to decide what to study next.",
  },
  {
    icon: FileCheck2,
    title: "Detailed answer review",
    description: "Review missed questions with explanations and references after premium exam sessions.",
  },
  {
    icon: ListChecks,
    title: "Reviewed question workflow",
    description: "New questions stay out of user exams until they pass internal review and are published.",
  },
  {
    icon: ShieldCheck,
    title: "Independent preparation",
    description: "Prepare with original practice material organized around certification domains and referenced sources.",
  },
];

export default function FeatureHighlights() {
  return (
    <section id="features" className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-700">Features</p>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Everything should point to exam readiness</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Readymetry keeps the learning loop practical: take a session, review the result, identify weak areas, and practice again with better focus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
