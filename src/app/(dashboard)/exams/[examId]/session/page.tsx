"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Flag, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { submitExamSession } from "@/lib/actions/exams";

interface Question {
  id: string;
  body: string;
  options: { key: string; text: string }[];
  category: string;
  difficulty: string;
}

type Confidence = "confident" | "unsure" | "guessing" | null;

const CONFIDENCE_OPTIONS: { value: Confidence; label: string; color: string }[] = [
  { value: "confident", label: "Confident", color: "bg-emerald-50 border-emerald-300 text-emerald-700" },
  { value: "unsure", label: "Unsure", color: "bg-amber-50 border-amber-300 text-amber-700" },
  { value: "guessing", label: "Guessing", color: "bg-red-50 border-red-300 text-red-600" },
];

export default function ExamSessionPage() {
  const router = useRouter();
  const { examId } = useParams<{ examId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [confidences, setConfidences] = useState<Confidence[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const startTime = useRef(Date.now());
  const questionStartTime = useRef(Date.now());
  // accumulated time per question in ms
  const questionTimes = useRef<number[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem(`session_${examId}`);
    if (!raw) {
      router.push(ROUTES.exams);
      return;
    }
    const qs: Question[] = JSON.parse(raw);
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(null));
    setConfidences(Array(qs.length).fill(null));
    setFlagged(Array(qs.length).fill(false));
    setTimeLeft(qs.length * 90);
    questionTimes.current = Array(qs.length).fill(0);
    questionStartTime.current = Date.now();
    setLoading(false);
  }, [examId, router]);

  useEffect(() => {
    if (loading || submitting || questions.length === 0) return;
    const t = setInterval(() => setTimeLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [loading, submitting, questions.length]);

  const accumulateTime = (idx: number) => {
    questionTimes.current[idx] = (questionTimes.current[idx] ?? 0) + (Date.now() - questionStartTime.current);
    questionStartTime.current = Date.now();
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  const selectAnswer = (key: string) => {
    const next = [...answers];
    next[current] = key;
    setAnswers(next);
  };

  const setConfidence = (val: Confidence) => {
    const next = [...confidences];
    next[current] = confidences[current] === val ? null : val;
    setConfidences(next);
  };

  const toggleFlag = () => {
    const next = [...flagged];
    next[current] = !next[current];
    setFlagged(next);
  };

  const goNext = () => {
    accumulateTime(current);
    setCurrent((v) => Math.min(questions.length - 1, v + 1));
  };

  const goPrev = () => {
    accumulateTime(current);
    setCurrent((v) => Math.max(0, v - 1));
  };

  const goTo = (idx: number) => {
    accumulateTime(current);
    setCurrent(idx);
  };

  const handleSubmit = async () => {
    accumulateTime(current);
    setSubmitting(true);
    setSubmitError("");
    const totalTime = Math.round((Date.now() - startTime.current) / 1000);

    const payload = questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: answers[i] ?? "",
      timeSpentSeconds: Math.round((questionTimes.current[i] ?? 0) / 1000),
      confidenceLevel: confidences[i],
      flagged: flagged[i],
    }));

    try {
      await submitExamSession({
        sessionId: examId,
        answers: payload,
        timeTakenSeconds: totalTime,
      });
      sessionStorage.removeItem(`session_${examId}`);
      router.push(ROUTES.results(examId));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not submit this exam. Please try again.");
      setSubmitting(false);
    }
  };
  useEffect(() => {
    if (loading || submitting || questions.length === 0 || timeLeft !== 0) return;
    const timeout = window.setTimeout(() => void handleSubmit(), 0);
    return () => window.clearTimeout(timeout);
    // The zero transition is the only event that should trigger automatic submission.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5FA] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-700" />
      </div>
    );
  }

  const q = questions[current];
  const answered = answers.filter((a) => a !== null).length;

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(ROUTES.exams)} className="text-muted hover:text-foreground transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-foreground">Practice Test</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${timeLeft < 120 ? "text-red-500" : "text-foreground"}`}>
            <Clock size={15} />
            {mins}:{secs}
          </div>
          <span className="text-xs text-muted">{answered}/{questions.length} answered</span>
        </div>
      </div>

      <div className="flex-1 flex max-w-5xl mx-auto w-full px-6 py-8 gap-6">
        {/* Question */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted font-medium">Question {current + 1} of {questions.length}</span>
            <div className="flex-1 h-1.5 bg-brand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-700 rounded-full transition-all"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-muted bg-surface border border-border px-2 py-0.5 rounded-full capitalize">{q.difficulty}</span>
          </div>

          <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-border p-7 flex-1"
          >
            <div className="flex items-start justify-between mb-6">
              <p className="text-base font-medium text-foreground leading-relaxed max-w-2xl">{q.body}</p>
              <button
                onClick={toggleFlag}
                className={`ml-4 shrink-0 p-2 rounded-lg border transition-colors ${
                  flagged[current] ? "border-amber-300 bg-amber-50 text-amber-600" : "border-border text-muted hover:border-amber-300"
                }`}
              >
                <Flag size={15} />
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {q.options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => selectAnswer(opt.key)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                    answers[current] === opt.key
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-border hover:border-brand-300 hover:bg-brand-50/40 text-foreground"
                  }`}
                >
                  <span className={`inline-flex w-6 h-6 rounded-full text-xs font-bold items-center justify-center mr-3 ${
                    answers[current] === opt.key ? "bg-brand-700 text-white" : "bg-surface text-muted"
                  }`}>
                    {opt.key}
                  </span>
                  {opt.text}
                </button>
              ))}
            </div>

            {/* Confidence selector */}
            {answers[current] !== null && (
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted mb-2.5">How confident are you?</p>
                <div className="flex gap-2">
                  {CONFIDENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setConfidence(opt.value)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        confidences[current] === opt.value
                          ? opt.color
                          : "border-border text-muted hover:bg-surface"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : "Submit Test"}
              </button>
            )}
          </div>
          {submitError && (
            <p role="alert" className="text-sm text-red-600 text-center">{submitError}</p>
          )}
        </div>

        {/* Question map */}
        <div className="w-44 shrink-0">
          <div className="bg-white rounded-2xl border border-border p-4 sticky top-24">
            <p className="text-xs font-semibold text-foreground mb-3">Questions</p>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    i === current ? "bg-brand-700 text-white"
                    : answers[i] !== null && confidences[i] === "confident" ? "bg-emerald-100 text-emerald-700"
                    : answers[i] !== null && confidences[i] === "guessing" ? "bg-red-100 text-red-600"
                    : answers[i] !== null ? "bg-brand-100 text-brand-700"
                    : flagged[i] ? "bg-amber-100 text-amber-600"
                    : "bg-surface text-muted hover:bg-brand-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              {[
                { color: "bg-brand-700", label: "Current" },
                { color: "bg-brand-100", label: "Answered" },
                { color: "bg-emerald-100", label: "Confident" },
                { color: "bg-red-100", label: "Guessing" },
                { color: "bg-amber-100", label: "Flagged" },
                { color: "bg-surface border border-border", label: "Skipped" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${l.color}`} />
                  <span className="text-[10px] text-muted">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
