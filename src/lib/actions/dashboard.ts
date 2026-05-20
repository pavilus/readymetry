"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user profile + active cert
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: userCertRaw } = await supabase
    .from("user_certifications")
    .select("*, certifications(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  type UserCertWithCert = { id: string; user_id: string; certification_id: string; exam_date: string | null; certifications: unknown };
  const userCert = userCertRaw as UserCertWithCert | null;

  if (!userCert) {
    return { profile, userCert: null, readiness: 0, sessions: [], categoryBreakdown: [], stats: null };
  }

  const certId = userCert.certification_id;

  type SessionRow = { id: string; certification_id: string; certifications: unknown; score: number | null; total_questions: number; time_taken_seconds: number | null; categories: string[] | null; completed_at: string | null };
  type StatRow = { score: number | null; total_questions: number; time_taken_seconds: number | null };

  // Recent sessions
  const { data: sessionsRaw } = await supabase
    .from("exam_sessions")
    .select("*, certifications(code, name)")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(5);
  const sessions = sessionsRaw as SessionRow[] | null;

  // Readiness (avg of last 5 sessions)
  const last5 = (sessions ?? []).slice(0, 5);
  const readiness = last5.length > 0
    ? Math.round(last5.reduce((sum, s) => sum + (s.score ?? 0), 0) / last5.length)
    : 0;

  // Category breakdown (from DB function or manual)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: breakdown } = await (supabase as any)
    .rpc("get_category_breakdown", { p_user_id: user.id, p_certification_id: certId });

  // Aggregate stats
  const { data: allSessionsRaw } = await supabase
    .from("exam_sessions")
    .select("score, total_questions, time_taken_seconds")
    .eq("user_id", user.id)
    .eq("certification_id", certId)
    .eq("status", "completed");
  const allSessions = allSessionsRaw as StatRow[] | null;

  const totalSessions = allSessions?.length ?? 0;
  const avgScore = totalSessions > 0
    ? Math.round((allSessions!.reduce((s, r) => s + (r.score ?? 0), 0)) / totalSessions)
    : 0;
  const totalTime = allSessions?.reduce((s, r) => s + (r.time_taken_seconds ?? 0), 0) ?? 0;
  const passProb = readiness >= 80 ? Math.min(95, readiness + 5) : Math.max(30, readiness - 5);

  return {
    profile,
    userCert,
    readiness,
    sessions: sessions ?? [],
    categoryBreakdown: breakdown ?? [],
    stats: {
      totalSessions,
      avgScore,
      passProb,
      studyHours: Math.round(totalTime / 3600),
    },
    examDaysRemaining: userCert.exam_date
      ? Math.max(0, Math.ceil((new Date(userCert.exam_date).getTime() - Date.now()) / 86400000))
      : null,
  };
}
