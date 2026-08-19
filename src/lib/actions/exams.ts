"use server";

import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { selectBalancedQuestions } from "@/lib/exam-selection";

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
    admin.from("questions").select("certification_id, category").eq("review_status", "published"),
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
  const { data: profile } = await admin
    .from("user_profiles")
    .select("subscription_tier, free_exam_consumed, purchased_exam_credits")
    .eq("id", user.id)
    .single();

  if (
    opts.examType === "timed_simulation"
    && profile?.subscription_tier === "starter"
    && !profile.free_exam_consumed
    && (profile.purchased_exam_credits ?? 0) === 0
  ) {
    throw new Error("Timed simulation is available with a paid exam credit or Readiness Pack");
  }

  let query = admin
    .from("questions")
    .select("id, certification_id, category, subcategory, body, options, difficulty, reference")
    .eq("certification_id", opts.certificationId)
    .eq("review_status", "published");

  if (opts.categories.length > 0) {
    query = query.in("category", opts.categories);
  }

  if (opts.difficulty !== "Any") {
    query = query.eq("difficulty", opts.difficulty.toLowerCase());
  }

  const { data: questions, error: qErr } = await query;
  if (qErr) throw new Error(qErr.message);
  if (!questions || questions.length === 0) throw new Error("No questions found for these filters");

  const { data: recentSessions } = await admin
    .from("exam_sessions")
    .select("question_ids")
    .eq("user_id", user.id)
    .eq("certification_id", opts.certificationId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(5);
  const recentlySeenIds = new Set<string>(
    (recentSessions ?? []).flatMap((session: { question_ids: string[] | null }) => session.question_ids ?? []),
  );
  const shuffled = selectBalancedQuestions(questions, opts.questionCount, recentlySeenIds);

  const { data: session, error: sErr } = await admin.rpc("create_exam_session_with_access", {
    p_user_id: user.id,
    p_certification_id: opts.certificationId,
    p_exam_type: opts.examType,
    p_categories: opts.categories,
    p_question_ids: shuffled.map((question: { id: string }) => question.id),
  });
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
  const { data, error } = await admin.rpc("submit_exam_session_atomic", {
    p_user_id: user.id,
    p_session_id: payload.sessionId,
    p_answers: payload.answers,
    p_time_taken_seconds: payload.timeTakenSeconds,
  });
  if (error) throw new Error(error.message);
  const result = data as { sessionId: string; score: number; correct: number; total: number };

  revalidatePath("/dashboard");
  revalidatePath("/analytics");

  return result;
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

  const admin = adminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();
  const hasFullAnalytics = profile?.subscription_tier === "ready" || profile?.subscription_tier === "workforce";
  const sessionAccess = (session as unknown as { access_type: "free" | "credit" | "workforce" }).access_type;
  const hasDetailedResults = hasFullAnalytics || sessionAccess === "credit" || sessionAccess === "workforce";

  if (!hasDetailedResults) {
    return {
      session,
      answers: [],
      categoryBreakdown: [],
      entitlements: { hasDetailedResults: false, hasFullAnalytics: false },
    };
  }

  const { data: answers } = await admin
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

  return {
    session,
    answers: answers ?? [],
    categoryBreakdown,
    entitlements: { hasDetailedResults, hasFullAnalytics },
  };
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
