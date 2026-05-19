import { BookOpen, BarChart3, BrainCircuit } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: BookOpen,
    title: "Choose Your Certification",
    description:
      "Select your target certification and let Readymetry map your personalized preparation path.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Practice Your Way",
    description:
      "Take timed simulations or focused topic drills. Every session adapts to your weak areas.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Get Smarter, Improve Faster",
    description:
      "Your readiness score updates in real time. Know exactly when you're ready to book exam day.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            How Readymetry Works
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Three steps to transform how you prepare for certification exams.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px bg-brand-100" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center relative">
                {/* Icon circle */}
                <div className="relative mb-6 z-10">
                  <div className="w-20 h-20 rounded-2xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center shadow-card">
                    <Icon size={28} className="text-brand-700" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-700 text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
