"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Timer, ChevronRight, Loader2, Lock, ShoppingCart } from "lucide-react";
import { createCheckoutSession } from "@/lib/actions/billing";
import { ROUTES } from "@/lib/constants";
import { getExamCatalog, startExamSession } from "@/lib/actions/exams";

interface Certification {
  id: string;
  code: string;
  name: string;
  body: string;
  available: boolean;
  actualQuestionCount: number;
  categories: string[];
}

const QUESTION_COUNTS = [10, 25, 50];
const DIFFICULTIES = ["Any", "Easy", "Medium", "Hard"];

export default function ExamsPage() {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [cert, setCert] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("Any");
  const [timed, setTimed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [billing, setBilling] = useState<{ canStartExam: boolean; tier: string; examCredits: number } | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [buyingCredits, setBuyingCredits] = useState(false);

  useEffect(() => {
    fetch("/api/billing/status").then((r) => r.json()).then(setBilling).catch(() => null);
    getExamCatalog()
      .then((catalog: Certification[]) => {
        setCertifications(catalog);
        setCert(catalog.find((item) => item.available)?.id ?? catalog[0]?.id ?? "");
      })
      .catch(() => setError("Could not load the certification catalog."));
  }, []);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    // Block Starter users who've used their free exam and have no credits
    if (billing && !billing.canStartExam) {
      setShowCreditModal(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await startExamSession({
        certificationId: cert,
        categories: selectedTopics,
        questionCount,
        difficulty,
        examType: timed ? "timed_simulation" : "practice",
      });

      // Store questions in sessionStorage so the session page can read them
      const { session, questions } = result as { session: { id: string }; questions: unknown[] };
      sessionStorage.setItem(`session_${session.id}`, JSON.stringify(questions));
      router.push(ROUTES.examSession(session.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start exam");
      setLoading(false);
    }
  };

  const selectedCertification = certifications.find((item) => item.id === cert);
  const certTopics = selectedCertification?.categories ?? [];

  const handleBuyCredits = async () => {
    setBuyingCredits(true);
    try {
      await createCheckoutSession("single_exam");
    } catch {
      setBuyingCredits(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Build Practice Test</h1>
          <p className="text-sm text-muted mt-1">Customize by certification, topic, difficulty, and time.</p>
        </div>
        {billing?.tier === "starter" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <Lock size={13} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">
              Starter · {billing.examCredits > 0 ? `${billing.examCredits} credit${billing.examCredits !== 1 ? "s" : ""} remaining` : billing.canStartExam ? "1 free exam available" : "No exams left"}
            </span>
          </div>
        )}
      </div>

      {/* Credit purchase modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-border p-8 max-w-sm w-full text-center shadow-xl">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={24} className="text-amber-600" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground mb-2">You&apos;ve used your free exam</h2>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              Buy a premium mock exam for <span className="font-bold text-foreground">$39</span>, or get 5 exams + full analytics with the <span className="font-bold text-foreground">Readiness Pack</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuyCredits}
                disabled={buyingCredits}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 transition-colors"
              >
                {buyingCredits ? <Loader2 size={15} className="animate-spin" /> : <><ShoppingCart size={15} /> Buy 1 Exam — $39</>}
              </button>
              <ChevronRight
                size={15}
                className="hidden"
              />
              <a href="/plan" className="w-full py-3 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface transition-colors text-center">
                Get Readiness Pack (5 exams)
              </a>
              <button onClick={() => setShowCreditModal(false)} className="text-xs text-muted hover:text-foreground">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Certification */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="text-sm font-semibold text-foreground mb-3">Certification</p>
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((c) => (
                <button
                  key={c.id}
                  disabled={!c.available}
                  onClick={() => { setCert(c.id); setSelectedTopics([]); }}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    !c.available ? "opacity-40 cursor-not-allowed border-border" :
                    cert === c.id
                      ? "border-brand-600 bg-brand-50"
                      : "border-border hover:border-brand-200"
                  }`}
                >
                  <p className={`text-sm font-bold ${cert === c.id ? "text-brand-700" : "text-foreground"}`}>
                    {c.code}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{c.name}</p>
                  <p className="text-[11px] text-muted mt-2">{c.actualQuestionCount} questions available</p>
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Topics</p>
              <button
                onClick={() =>
                  setSelectedTopics(selectedTopics.length === certTopics.length ? [] : certTopics)
                }
                className="text-xs text-brand-700 hover:underline"
              >
                {selectedTopics.length === certTopics.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {certTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedTopics.includes(topic)
                      ? "bg-brand-700 text-white border-brand-700"
                      : "bg-white text-muted border-border hover:border-brand-300"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-3">Leave empty to draw from all topics.</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Questions</p>
              <div className="flex gap-2">
                {QUESTION_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      questionCount === n
                        ? "bg-brand-700 text-white border-brand-700"
                        : "border-border text-muted hover:border-brand-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Difficulty</p>
              <div className="grid grid-cols-2 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      difficulty === d
                        ? "bg-brand-700 text-white border-brand-700"
                        : "border-border text-muted hover:border-brand-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timed toggle */}
          <div className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer size={17} className="text-brand-700" />
              <div>
                <p className="text-sm font-semibold text-foreground">Timed Mode</p>
                <p className="text-xs text-muted">1.5 min per question</p>
              </div>
            </div>
            <button
              onClick={() => setTimed((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors relative ${timed ? "bg-brand-700" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${timed ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Summary + CTA */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-8">
            <p className="text-sm font-semibold text-foreground mb-4">Test Summary</p>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { label: "Certification", value: selectedCertification?.code ?? "Loading" },
                { label: "Topics", value: selectedTopics.length === 0 ? "All topics" : `${selectedTopics.length} selected` },
                { label: "Questions", value: questionCount },
                { label: "Difficulty", value: difficulty },
                { label: "Mode", value: timed ? "Timed" : "Practice" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-xs text-muted">{row.label}</span>
                  <span className="text-xs font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !selectedCertification?.available}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.3)]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><BookOpen size={15} /> Generate Test</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
