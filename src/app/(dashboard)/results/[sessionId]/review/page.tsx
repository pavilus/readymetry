"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, CheckCircle2, XCircle, Bookmark, RotateCcw, AlertCircle, Lock } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { getSessionResults } from "@/lib/actions/exams";

interface Option { key: string; text: string }
interface ReviewAnswer {
  id: string;
  is_correct: boolean;
  selected_answer: string;
  time_spent_seconds: number | null;
  questions: {
    category: string;
    body: string;
    correct_answer: string;
    explanation: string | null;
    options: Option[];
    difficulty?: string;
  };
}

type FilterMode = "all" | "incorrect" | "correct";

export default function ReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [answers, setAnswers] = useState<ReviewAnswer[]>([]);
  const [session, setSession] = useState<{ certifications: { code: string; name: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("incorrect");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [hasDetailedResults, setHasDetailedResults] = useState(true);

  useEffect(() => {
    getSessionResults(sessionId).then((data) => {
      if (!data) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = data as any;
      setHasDetailedResults(raw.entitlements?.hasDetailedResults ?? false);
      setSession(raw.session);
      setAnswers(raw.answers ?? []);
      // Start all incorrect answers expanded
      const incorrectIds = new Set<string>(
        (raw.answers ?? [])
          .filter((a: ReviewAnswer) => !a.is_correct)
          .map((a: ReviewAnswer) => a.id)
      );
      setExpanded(incorrectIds);
      // Load bookmarks from localStorage
      try {
        const stored = localStorage.getItem(`bookmarks_${sessionId}`);
        if (stored) setBookmarked(new Set(JSON.parse(stored)));
      } catch { /* ignore */ }
      setLoading(false);
    });
  }, [sessionId]);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(`bookmarks_${sessionId}`, JSON.stringify([...next]));
      return next;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = answers.filter((a) => {
    if (filter === "incorrect") return !a.is_correct;
    if (filter === "correct") return a.is_correct;
    return true;
  });

  const incorrectCount = answers.filter((a) => !a.is_correct).length;
  const correctCount = answers.filter((a) => a.is_correct).length;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-border" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasDetailedResults) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <Lock size={28} className="mx-auto text-brand-700 mb-3" />
          <h1 className="text-xl font-extrabold text-foreground mb-2">Detailed review is not included in the Free Trial</h1>
          <p className="text-sm text-muted mb-6">A Single Exam Credit includes full answers and explanations. The Readiness Pack also adds long-term analytics.</p>
          <Link href={ROUTES.pricing} className="inline-flex px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold">
            Compare access options
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href={ROUTES.results(sessionId)}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-3"
          >
            <ChevronLeft size={15} /> Back to Results
          </Link>
          <h1 className="text-2xl font-extrabold text-foreground">Answer Review</h1>
          <p className="text-sm text-muted mt-1">
            {session?.certifications?.code} · {incorrectCount} incorrect · {correctCount} correct
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted bg-white border border-border rounded-xl px-3 py-2">
          <Bookmark size={13} className="text-brand-600" />
          {bookmarked.size} saved
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "incorrect", label: `Incorrect (${incorrectCount})`, color: "text-red-600 bg-red-50 border-red-200" },
          { key: "correct", label: `Correct (${correctCount})`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          { key: "all", label: `All (${answers.length})`, color: "text-brand-700 bg-brand-50 border-brand-200" },
        ] as { key: FilterMode; label: string; color: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
              filter === tab.key ? tab.color : "border-border text-muted bg-white hover:bg-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" />
          <p className="text-sm font-semibold text-foreground">No {filter} answers</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {filtered.map((answer, idx) => {
          const q = answer.questions;
          const opts = Array.isArray(q.options) ? q.options as Option[] : [];
          const isExpanded = expanded.has(answer.id);
          const isBookmarked = bookmarked.has(answer.id);

          return (
            <div
              key={answer.id}
              className={`bg-white rounded-2xl border transition-all ${
                answer.is_correct ? "border-emerald-100" : "border-red-100"
              }`}
            >
              {/* Question header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => toggleExpanded(answer.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {answer.is_correct
                      ? <CheckCircle2 size={18} className="text-emerald-500" />
                      : <XCircle size={18} className="text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">{q.category}</span>
                      {q.difficulty && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted capitalize">
                          {q.difficulty}
                        </span>
                      )}
                      <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        answer.is_correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                      }`}>
                        Q{idx + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-2">
                      {q.body}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(answer.id); }}
                    className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                      isBookmarked ? "text-brand-700 bg-brand-50" : "text-muted hover:text-brand-600"
                    }`}
                  >
                    <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <p className="text-sm font-medium text-foreground leading-relaxed mb-4">{q.body}</p>

                  {/* Options */}
                  <div className="flex flex-col gap-2 mb-5">
                    {opts.map((opt) => {
                      const isCorrect = opt.key === q.correct_answer;
                      const isSelected = opt.key === answer.selected_answer;
                      const isWrongSelected = isSelected && !isCorrect;

                      return (
                        <div
                          key={opt.key}
                          className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
                            isCorrect
                              ? "border-emerald-300 bg-emerald-50"
                              : isWrongSelected
                              ? "border-red-300 bg-red-50"
                              : "border-border bg-surface/50"
                          }`}
                        >
                          <span className={`inline-flex w-6 h-6 shrink-0 rounded-full text-xs font-bold items-center justify-center ${
                            isCorrect ? "bg-emerald-500 text-white"
                            : isWrongSelected ? "bg-red-400 text-white"
                            : "bg-white border border-border text-muted"
                          }`}>
                            {opt.key}
                          </span>
                          <span className={`flex-1 ${
                            isCorrect ? "text-emerald-800 font-medium"
                            : isWrongSelected ? "text-red-700 line-through"
                            : "text-muted"
                          }`}>
                            {opt.text}
                          </span>
                          {isCorrect && (
                            <span className="text-[10px] font-semibold text-emerald-600 shrink-0">Correct</span>
                          )}
                          {isWrongSelected && (
                            <span className="text-[10px] font-semibold text-red-500 shrink-0">Your answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation ? (
                    <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={14} className="text-brand-700 shrink-0" />
                        <span className="text-xs font-semibold text-brand-700">Explanation</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{q.explanation}</p>
                    </div>
                  ) : (
                    <div className="bg-surface border border-border rounded-xl p-4">
                      <p className="text-xs text-muted">No explanation available for this question.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 mt-8">
        <Link
          href={ROUTES.results(sessionId)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-surface transition-colors"
        >
          <ChevronLeft size={15} /> Back to Results
        </Link>
        <Link
          href={ROUTES.exams}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
        >
          <RotateCcw size={15} /> Practice Weak Areas
        </Link>
      </div>
    </div>
  );
}
