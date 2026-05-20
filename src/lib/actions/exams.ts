"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface StartSessionOptions {
  certificationId: string;
  categories: string[];
  questionCount: number;
  difficulty: string;
  examType: "practice" | "timed_simulation";
}

export async function startExamSession(opts: StartSessionOptions) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let query = supabase
    .from("questions")
    .select("*")
    .eq("certification_id", opts.certificationId);

  if (opts.categories.length > 0) {
    query = query.in("category", opts.categories);
  }

  if (opts.difficulty !== "Any") {
    query = query.eq("difficulty", opts.difficulty.toLowerCase());
  }

  const { data: questions, error: qErr } = await query;
  if (qErr) throw new Error(qErr.message);
  if (!questions || questions.length === 0) throw new Error("No questions found for these filters");

  // Shuffle and pick requested count
  const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, opts.questionCount);

  const db = supabase as any;
  const { data: session, error: sErr } = await db
    .from("exam_sessions")
    .insert({
      user_id: user.id,
      certification_id: opts.certificationId,
      exam_type: opts.examType,
      status: "in_progress",
      total_questions: shuffled.length,
      categories: opts.categories.length > 0 ? opts.categories : null,
    })
    .select()
    .single();

  if (sErr) throw new Error(sErr.message);

  return { session, questions: shuffled };
}

export async function getExamSession(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: session, error: sErr } = await supabase
    .from("exam_sessions")
    .select("*, certifications(code, name, passing_score)")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (sErr) throw new Error(sErr.message);

  const { data: answers } = await supabase
    .from("user_answers")
    .select("*, questions(*)")
    .eq("session_id", sessionId);

  return { session, answers: answers ?? [] };
}

export interface SubmitSessionPayload {
  sessionId: string;
  answers: { questionId: string; selectedAnswer: string; timeSpentSeconds: number }[];
  timeTakenSeconds: number;
}

export async function submitExamSession(payload: SubmitSessionPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Fetch the questions to check correctness
  const questionIds = payload.answers.map((a) => a.questionId);
  const db2 = supabase as any;
  const { data: questions } = await db2
    .from("questions")
    .select("id, correct_answer")
    .in("id", questionIds);

  if (!questions) throw new Error("Failed to fetch questions");

  const correctMap = Object.fromEntries((questions as { id: string; correct_answer: string }[]).map((q) => [q.id, q.correct_answer]));

  const answerRows = payload.answers.map((a) => ({
    session_id: payload.sessionId,
    question_id: a.questionId,
    selected_answer: a.selectedAnswer,
    is_correct: correctMap[a.questionId] === a.selectedAnswer,
    time_spent_seconds: a.timeSpentSeconds,
  }));

  await db2.from("user_answers").insert(answerRows);

  const correct = (answerRows as { is_correct: boolean }[]).filter((a) => a.is_correct).length;
  const score = Math.round((correct / answerRows.length) * 100);

  const { error } = await db2
    .from("exam_sessions")
    .update({
      status: "completed",
      score,
      correct_answers: correct,
      time_taken_seconds: payload.timeTakenSeconds,
      completed_at: new Date().toISOString(),
    })
    .eq("id", payload.sessionId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/analytics");

  return { sessionId: payload.sessionId, score, correct, total: answerRows.length };
}

export async function getSessionResults(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: session, error } = await supabase
    .from("exam_sessions")
    .select("*, certifications(code, name, passing_score)")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !session) return null;

  const db3 = supabase as any;
  const { data: answers } = await db3
    .from("user_answers")
    .select("*, questions(category, body, correct_answer, explanation, options)")
    .eq("session_id", sessionId);

  type AnswerWithQ = { is_correct: boolean; questions: { category: string } };
  // Build category breakdown
  const categoryMap: Record<string, { correct: number; total: number }> = {};
  for (const a of (answers ?? []) as AnswerWithQ[]) {
    const cat = a.questions.category;
    if (!categoryMap[cat]) categoryMap[cat] = { correct: 0, total: 0 };
    categoryMap[cat].total++;
    if (a.is_correct) categoryMap[cat].correct++;
  }

  const categoryBreakdown = Object.entries(categoryMap).map(([category, { correct, total }]) => ({
    category,
    correct,
    total,
    accuracy: Math.round((correct / total) * 100),
  })).sort((a, b) => a.accuracy - b.accuracy);

  return { session, answers: answers ?? [], categoryBreakdown };
}

export async function getRecentSessions(limit = 5) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("exam_sessions")
    .select("*, certifications(code, name)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
