"use server";

import { redirect } from "next/navigation";
import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const ok = (profile as { role?: string } | null)?.role === "admin";
  if (!ok) redirect("/dashboard");

  return user;
}

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin();
  if (!["user", "admin"].includes(role)) throw new Error("Invalid role");
  const db = adminClient();
  await db.from("user_profiles").update({ role, updated_at: new Date().toISOString() }).eq("id", userId);
}

export async function createQuestion(formData: FormData) {
  await requireAdmin();
  const db = adminClient();

  const choices = ["A", "B", "C", "D"].map((id) => ({
    key: id,
    text: formData.get(`choice_${id}`) as string,
  }));

  await db.from("questions").insert({
    certification_id: formData.get("certification_id") as string,
    category:         formData.get("category") as string,
    subcategory:      (formData.get("subcategory") as string) || null,
    difficulty:       formData.get("difficulty") as string,
    body:             formData.get("body") as string,
    options:          choices,
    correct_answer:   formData.get("correct_answer") as string,
    explanation:      formData.get("explanation") as string,
    reference:        (formData.get("reference") as string) || null,
  });

  redirect("/admin/questions");
}
