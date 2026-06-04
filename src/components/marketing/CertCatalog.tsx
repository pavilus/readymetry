import Link from "next/link";
import { ArrowRight, Lock, CheckCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { adminClient } from "@/lib/supabase/admin";

interface CatalogCertification {
  id: string;
  code: string;
  name: string;
  body: string;
  available: boolean;
  exam_duration_minutes: number;
  passing_score: number;
  questions: number;
}

export default async function CertCatalog() {
  const db = adminClient();
  const [{ data: certifications }, { data: questions }] = await Promise.all([
    db.from("certifications").select("id, code, name, body, available, exam_duration_minutes, passing_score").order("code"),
    db.from("questions").select("certification_id"),
  ]);
  const counts = new Map<string, number>();
  for (const question of questions ?? []) counts.set(question.certification_id, (counts.get(question.certification_id) ?? 0) + 1);
  const certs: CatalogCertification[] = (certifications ?? []).map((certification: Omit<CatalogCertification, "questions">) => ({
    ...certification,
    questions: counts.get(certification.id as string) ?? 0,
    available: Boolean(certification.available) && (counts.get(certification.id as string) ?? 0) > 0,
  }));
  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Prepare for the most in-demand certifications
          </h2>
          <p className="text-muted text-lg">
            Practice with the certification question banks currently available in Readymetry.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className={`relative rounded-2xl border bg-white p-5 flex flex-col gap-4 transition-all ${
                Boolean(cert.available)
                  ? "border-brand-200 hover:shadow-[0_8px_30px_rgba(109,40,217,0.12)] hover:-translate-y-0.5 cursor-pointer"
                  : "border-border opacity-50"
              }`}
            >
              {/* Badge */}
              <div className={`w-12 h-12 rounded-xl ${cert.available ? "bg-brand-50" : "bg-slate-50"} flex items-center justify-center`}>
                <span className={`text-sm font-extrabold ${cert.available ? "text-brand-700" : "text-slate-500"}`}>
                  {cert.code.split(" ")[0]}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-foreground leading-tight">{cert.code}</p>
                <p className="text-xs text-muted mt-1 leading-snug">{cert.name}</p>
              </div>

              {Boolean(cert.available) && Boolean(cert.questions) && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-success shrink-0" />
                  <span className="text-[11px] text-muted">{cert.questions} questions</span>
                </div>
              )}

              {!cert.available && (
                <div className="flex items-center gap-1.5">
                  <Lock size={11} className="text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-400">Coming soon</span>
                </div>
              )}

              {Boolean(cert.available) && (
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

      </div>
    </section>
  );
}
