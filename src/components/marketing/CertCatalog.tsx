import Link from "next/link";
import { ArrowRight, Lock, CheckCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const CERTS = [
  {
    id: "cwi",
    code: "AWS CWI",
    name: "Certified Welding Inspector",
    body: "American Welding Society",
    questions: 150,
    duration: "3 hrs",
    passingScore: 72,
    available: true,
    color: "bg-brand-700",
    lightColor: "bg-brand-50",
    textColor: "text-brand-700",
  },
  {
    id: "api-570",
    code: "API 570",
    name: "Piping Inspector",
    body: "API",
    questions: 70,
    duration: "90 min",
    passingScore: 70,
    available: false,
    color: "bg-slate-400",
    lightColor: "bg-slate-50",
    textColor: "text-slate-500",
  },
  {
    id: "level-ii",
    code: "Level II",
    name: "NDT Inspector",
    body: "ASNT",
    questions: 100,
    duration: "2 hrs",
    passingScore: 70,
    available: false,
    color: "bg-slate-400",
    lightColor: "bg-slate-50",
    textColor: "text-slate-500",
  },
  {
    id: "aws-d1",
    code: "AWS D1.1",
    name: "Structural Welding",
    body: "American Welding Society",
    questions: 80,
    duration: "90 min",
    passingScore: 72,
    available: false,
    color: "bg-slate-400",
    lightColor: "bg-slate-50",
    textColor: "text-slate-500",
  },
  {
    id: "ndt",
    code: "NDT Level II",
    name: "Non-Destructive Testing",
    body: "ASNT",
    questions: 120,
    duration: "2.5 hrs",
    passingScore: 70,
    available: false,
    color: "bg-slate-400",
    lightColor: "bg-slate-50",
    textColor: "text-slate-500",
  },
  {
    id: "more",
    code: "More",
    name: "Coming Soon",
    body: "Various bodies",
    questions: null,
    duration: null,
    passingScore: null,
    available: false,
    color: "bg-slate-300",
    lightColor: "bg-slate-50",
    textColor: "text-slate-400",
    comingSoon: true,
  },
];

export default function CertCatalog() {
  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Prepare for the most in-demand certifications
          </h2>
          <p className="text-muted text-lg">
            Industry-aligned question banks updated to the latest exam blueprints.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {CERTS.map((cert) => (
            <div
              key={cert.id}
              className={`relative rounded-2xl border bg-white p-5 flex flex-col gap-4 transition-all ${
                cert.available
                  ? "border-brand-200 hover:shadow-[0_8px_30px_rgba(109,40,217,0.12)] hover:-translate-y-0.5 cursor-pointer"
                  : "border-border opacity-50"
              }`}
            >
              {/* Badge */}
              <div className={`w-12 h-12 rounded-xl ${cert.lightColor} flex items-center justify-center`}>
                <span className={`text-sm font-extrabold ${cert.textColor}`}>
                  {cert.code.split(" ")[0]}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-foreground leading-tight">{cert.code}</p>
                <p className="text-xs text-muted mt-1 leading-snug">{cert.name}</p>
              </div>

              {cert.available && cert.questions && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-success shrink-0" />
                  <span className="text-[11px] text-muted">{cert.questions} questions</span>
                </div>
              )}

              {!cert.available && !cert.comingSoon && (
                <div className="flex items-center gap-1.5">
                  <Lock size={11} className="text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-400">Coming soon</span>
                </div>
              )}

              {cert.available && (
                <Link
                  href={ROUTES.signup}
                  className="text-xs font-semibold text-brand-700 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Practice <ArrowRight size={11} />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="#"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2 transition-colors"
          >
            View all certifications →
          </Link>
        </div>
      </div>
    </section>
  );
}
