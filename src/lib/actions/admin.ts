"use server";

import { redirect } from "next/navigation";
import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const ok = ["admin", "super_admin"].includes((profile as any)?.role ?? "");
  if (!ok) redirect("/dashboard");

  return user;
}

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin();
  const db = adminClient();
  await db.from("profiles").update({ role, updated_at: new Date().toISOString() }).eq("id", userId);
}

export async function createQuestion(formData: FormData) {
  await requireAdmin();
  const db = adminClient();

  const choices = ["A", "B", "C", "D"].map((id) => ({
    id,
    text: formData.get(`choice_${id}`) as string,
  }));

  await db.from("questions").insert({
    certification_id: formData.get("certification_id") as string,
    domain:           formData.get("domain") as string,
    section:          (formData.get("section") as string) || null,
    difficulty:       formData.get("difficulty") as string,
    question_text:    formData.get("question_text") as string,
    answer_choices:   choices,
    correct_answer:   formData.get("correct_answer") as string,
    explanation:      formData.get("explanation") as string,
    estimated_time:   parseInt(formData.get("estimated_time") as string) || 60,
    active:           true,
  });

  redirect("/admin/questions");
}

export async function toggleQuestionActive(questionId: string, active: boolean) {
  await requireAdmin();
  const db = adminClient();
  await db.from("questions").update({ active, updated_at: new Date().toISOString() }).eq("id", questionId);
}
