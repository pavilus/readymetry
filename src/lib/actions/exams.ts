"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface StartSessionOptions {
  certificationId: string;
  categories: string[];
  questionCount: number;
  difficulty: string;
  examType: "practice" | "timed_simulation";
}

export async function getExamCatalog() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = adminClient();
  const [{ data: certifications, error: certError }, { data: questions, error: questionError }] = await Promise.all([
    admin.from("certifications").select("id, code, name, body, available, question_count").order("code"),
    admin.from("questions").select("certification_id, category"),
  ]);
  if (certError) throw new Error(certError.message);
  if (questionError) throw new Error(questionError.message);

  const details = new Map<string, { count: number; categories: Set<string> }>();
  for (const question of questions ?? []) {
    const current = details.get(question.certification_id) ?? { count: 0, categories: new Set<string>() };
    current.count += 1;
    current.categories.add(question.category);
    details.set(question.certification_id, current);
  }

  return (certifications ?? []).map((certification: {
    id: string;
    code: string;
    name: string;
    body: string;
    available: boolean;
    question_count: number;
  }) => {
    const questionDetails = details.get(certification.id);
    const actualQuestionCount = questionDetails?.count ?? 0;
    return {
      ...certification,
      actualQuestionCount,
      available: certification.available && actualQuestionCount > 0,
      categories: [...(questionDetails?.categories ?? [])].sort(),
    };
  });
}

export async function startExamSession(opts: StartSessionOptions) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = adminClient();
  let query = admin
    .from("questions")
    .select("id, certification_id, category, subcategory, body, options, difficulty, reference")
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

  const { data: accessType, error: accessErr } = await admin.rpc("consume_exam_access", {
    p_user_id: user.id,
  });
  if (accessErr) throw new Error(accessErr.message);

  const { data: session, error: sErr } = await admin
    .from("exam_sessions")
    .insert({
      user_id: user.id,
      certification_id: opts.certificationId,
      exam_type: opts.examType,
      status: "in_progress",
      total_questions: shuffled.length,
      categories: opts.categories.length > 0 ? opts.categories : null,
      question_ids: shuffled.map((question: { id: string }) => question.id),
      remaining_seconds: opts.examType === "timed_simulation" ? shuffled.length * 90 : null,
      expires_at: opts.examType === "timed_simulation"
        ? new Date(Date.now() + shuffled.length * 90 * 1000).toISOString()
        : null,
    })
    .select()
    .single();

  if (sErr) {
    await admin.rpc("refund_exam_access", { p_user_id: user.id, p_access_type: accessType });
    throw new Error(sErr.message);
  }

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
    .select("*, questions(id, category, body, options, difficulty)")
    .eq("session_id", sessionId);

  return { session, answers: answers ?? [] };
}

export interface SubmitSessionPayload {
  sessionId: string;
  answers: {
    questionId: string;
    selectedAnswer: string;
    timeSpentSeconds: number;
    confidenceLevel: "confident" | "unsure" | "guessing" | null;
    flagged: boolean;
  }[];
  timeTakenSeconds: number;
}

export interface ExamProgress {
  answers: (string | null)[];
  confidences: ("confident" | "unsure" | "guessing" | null)[];
  flagged: boolean[];
  current: number;
  timeLeft: number;
  elapsedSeconds: number;
  questionTimes: number[];
}

export async function saveExamProgress(sessionId: string, progress: ExamProgress) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = adminClient();
  const { data: session } = await admin
    .from("exam_sessions")
    .select("exam_type, expires_at")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .eq("status", "in_progress")
    .maybeSingle();
  if (!session) throw new Error("Exam session not found");
  if (session.exam_type === "timed_simulation" && session.expires_at && new Date(session.expires_at).getTime() <= Date.now()) {
    throw new Error("Timed exam has ended");
  }

  const { error } = await admin
    .from("exam_sessions")
    .update({ progress, remaining_seconds: Math.max(0, progress.timeLeft) })
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .eq("status", "in_progress");
  if (error) throw new Error(error.message);
}

export async function resumeExamSession(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = adminClient();
  const { data: session, error } = await admin
    .from("exam_sessions")
    .select("id, status, question_ids, progress, remaining_seconds, exam_type, expires_at")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .eq("status", "in_progress")
    .maybeSingle();
  if (error || !session?.question_ids?.length) return null;

  const { data: questions, error: questionError } = await admin
    .from("questions")
    .select("id, certification_id, category, subcategory, body, options, difficulty, reference")
    .in("id", session.question_ids);
  if (questionError) throw new Error(questionError.message);
  const byId = new Map((questions ?? []).map((question: { id: string }) => [question.id, question]));

  return {
    questions: session.question_ids.map((id: string) => byId.get(id)).filter(Boolean),
    progress: session.progress,
    remainingSeconds: session.exam_type === "timed_simulation" && session.expires_at
      ? Math.max(0, Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000))
      : session.remaining_seconds,
  };
}

export async function submitExamSession(payload: SubmitSessionPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = adminClient();
  const { data: session, error: sessionErr } = await admin
    .from("exam_sessions")
    .select("id, status, question_ids, exam_type, expires_at, progress")
    .eq("id", payload.sessionId)
    .eq("user_id", user.id)
    .single();

  if (sessionErr || !session) throw new Error("Exam session not found");
  if (session.status !== "in_progress") throw new Error("Exam session has already been submitted");
  if (!payload.answers.length) throw new Error("No answers submitted");

  const timedExpired = session.exam_type === "timed_simulation"
    && session.expires_at
    && new Date(session.expires_at).getTime() <= Date.now();
  const expiredProgress = timedExpired ? session.progress as ExamProgress | null : null;
  const submittedAnswers = timedExpired
    ? payload.answers.map((answer, index) => ({ ...answer, selectedAnswer: expiredProgress?.answers[index] ?? "" }))
    : payload.answers;

  const questionIds = submittedAnswers.map((a) => a.questionId);
  if (new Set(questionIds).size !== questionIds.length) throw new Error("Duplicate answers submitted");

  const allowedIds = new Set((session.question_ids ?? []) as string[]);
  if (questionIds.length !== allowedIds.size || !questionIds.every((id) => allowedIds.has(id))) {
    throw new Error("Submission contains questions outside this exam session");
  }

  const { data: questions } = await admin
    .from("questions")
    .select("id, correct_answer")
    .in("id", questionIds);

  if (!questions || questions.length !== questionIds.length) throw new Error("Failed to fetch questions");

  const correctMap = Object.fromEntries((questions as { id: string; correct_answer: string }[]).map((q) => [q.id, q.correct_answer]));

  const answerRows = submittedAnswers.map((a) => ({
    session_id: payload.sessionId,
    question_id: a.questionId,
    selected_answer: a.selectedAnswer,
    is_correct: correctMap[a.questionId] === a.selectedAnswer,
    time_spent_seconds: a.timeSpentSeconds,
    confidence_level: a.confidenceLevel,
    flagged: a.flagged,
  }));

  const { error: answerErr } = await admin
    .from("user_answers")
    .upsert(answerRows, { onConflict: "session_id,question_id" });
  if (answerErr) throw new Error(answerErr.message);

  const correct = (answerRows as { is_correct: boolean }[]).filter((a) => a.is_correct).length;
  const score = Math.round((correct / answerRows.length) * 100);

  const { error } = await admin
    .from("exam_sessions")
    .update({
      status: "completed",
      score,
      correct_answers: correct,
      time_taken_seconds: payload.timeTakenSeconds,
      completed_at: new Date().toISOString(),
      progress: null,
      remaining_seconds: 0,
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
    .eq("status", "completed")
    .maybeSingle();

  if (error || !session) return null;

  const { data: answers } = await adminClient()
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
