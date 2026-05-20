"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { saveOnboarding } from "@/lib/actions/onboarding";

const TRACKS = [
  {
    id: "11111111-0000-0000-0000-000000000001",
    code: "AWS CWI",
    name: "Certified Welding Inspector",
    body: "American Welding Society",
    desc: "Part A, B, and C — 150 questions, 3 hours",
    available: true,
  },
  {
    id: "11111111-0000-0000-0000-000000000002",
    code: "ASNT NDT Level II",
    name: "Non-Destructive Testing",
    body: "ASNT",
    desc: "PT · MT · UT · RT methods",
    available: true,
  },
  {
    id: "11111111-0000-0000-0000-000000000003",
    code: "API 570",
    name: "Piping Inspector",
    body: "API",
    desc: "Coming soon",
    available: false,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFinish = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      await saveOnboarding(selected, examDate || null);
      router.push(ROUTES.plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center px-4 py-16">
      <Link href={ROUTES.home} className="mb-10">
        <Image src="/logo.png" alt="Readymetry" width={480} height={144} className="h-[134px] w-auto" />
      </Link>

      {step === 1 && (
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">Step 1 of 2</p>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">Choose your certification track</h1>
            <p className="text-sm text-muted">Pick the exam you&apos;re preparing for. You can add more later.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {TRACKS.map((track) => (
              <button
                key={track.id}
                disabled={!track.available}
                onClick={() => setSelected(track.id)}
                className={`relative rounded-2xl border p-5 text-left flex flex-col gap-2 transition-all ${
                  !track.available
                    ? "opacity-40 cursor-not-allowed bg-white border-border"
                    : selected === track.id
                    ? "border-brand-600 bg-brand-50 shadow-[0_0_0_2px_rgba(109,40,217,0.3)]"
                    : "border-border bg-white hover:border-brand-200 hover:shadow-sm"
                }`}
              >
                {selected === track.id && (
                  <CheckCircle2 size={18} className="absolute top-4 right-4 text-brand-600" />
                )}
                <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full w-fit">
                  {track.code}
                </span>
                <p className="text-sm font-bold text-foreground">{track.name}</p>
                <p className="text-xs text-muted">{track.desc}</p>
                {!track.available && (
                  <span className="text-[11px] text-muted font-medium">Coming soon</span>
                )}
              </button>
            ))}
          </div>

          <button
            disabled={!selected}
            onClick={() => setStep(2)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white font-semibold text-sm hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">Step 2 of 2</p>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">When&apos;s your exam?</h1>
            <p className="text-sm text-muted">We&apos;ll tailor your readiness plan to your timeline.</p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-6">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Target exam date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>

            <p className="text-xs text-muted text-center">Don&apos;t have a date yet? You can skip this and set it later.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <>Go to Dashboard <ArrowRight size={15} /></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
