"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAnalyticsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userCertRaw } = await supabase
    .from("user_certifications")
    .select("certification_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const userCert = userCertRaw as { certification_id: string } | null;
  const certId = userCert?.certification_id;

  // All completed sessions
  let sessionsQuery = supabase
    .from("exam_sessions")
    .select("*, certifications(code, name)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false });

  if (certId) sessionsQuery = sessionsQuery.eq("certification_id", certId);

  type SessionRow = { id: string; certification_id: string; certifications: unknown; score: number | null; total_questions: number; time_taken_seconds: number | null; categories: string[] | null; completed_at: string | null };
  const { data: sessionsRaw } = await sessionsQuery;
  const sessions = sessionsRaw as SessionRow[] | null;

  // Build readiness trend from sessions (chronological)
  const trend = [...(sessions ?? [])]
    .reverse()
    .map((s) => ({
      date: new Date(s.completed_at!).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: Math.round(s.score ?? 0),
    }));

  // Category breakdown
  const analyticsClient = supabase as unknown as {
    rpc: (
      name: "get_category_breakdown",
      args: { p_user_id: string; p_certification_id: string },
    ) => Promise<{ data: { category: string; accuracy: number; question_count: number }[] | null }>;
  };
  const breakdown = certId
    ? await analyticsClient.rpc("get_category_breakdown", { p_user_id: user.id, p_certification_id: certId })
    : { data: [] };

  // Aggregate stats
  const totalQ = (sessions ?? []).reduce((s, r) => s + r.total_questions, 0);
  const avgScore = sessions && sessions.length > 0
    ? Math.round(sessions.reduce((s, r) => s + (r.score ?? 0), 0) / sessions.length)
    : 0;

  // Study streak (consecutive days with at least one session)
  let streak = 0;
  if (sessions && sessions.length > 0) {
    const dates = [...new Set(sessions.map((s) =>
      new Date(s.completed_at!).toDateString()
    ))];
    const check = new Date();
    for (const d of dates) {
      if (new Date(d).toDateString() === check.toDateString()) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else break;
    }
  }

  return {
    sessions: sessions ?? [],
    trend,
    categoryBreakdown: breakdown.data ?? [],
    stats: {
      totalQuestions: totalQ,
      avgScore,
      totalSessions: sessions?.length ?? 0,
      streak,
    },
  };
}
