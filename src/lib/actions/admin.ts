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
  const actor = await requireAdmin();
  if (!["user", "admin"].includes(role)) throw new Error("Invalid role");
  const db = adminClient();
  await db.from("user_profiles").update({ role, updated_at: new Date().toISOString() }).eq("id", userId);
  await db.from("audit_logs").insert({ actor_id: actor.id, action: "user.role_updated", entity_type: "user", entity_id: userId, details: { role } });
}

export async function createQuestion(formData: FormData) {
  const actor = await requireAdmin();
  const db = adminClient();
  const examPart = String(formData.get("exam_part") ?? "");
  const sourceEdition = String(formData.get("source_edition") ?? "").trim();
  if (examPart === "C" && !sourceEdition) throw new Error("Part C questions require a source edition");

  const choices = ["A", "B", "C", "D"].map((id) => ({
    key: id,
    text: formData.get(`choice_${id}`) as string,
  }));

  const { data: question, error } = await db.from("questions").insert({
    certification_id: formData.get("certification_id") as string,
    category:         formData.get("category") as string,
    subcategory:      (formData.get("subcategory") as string) || null,
    difficulty:       formData.get("difficulty") as string,
    body:             formData.get("body") as string,
    options:          choices,
    correct_answer:   formData.get("correct_answer") as string,
    explanation:      formData.get("explanation") as string,
    reference:        (formData.get("reference") as string) || null,
    exam_part:        examPart,
    source_kind:      formData.get("source_kind") as string,
    source_edition:   sourceEdition || null,
    source_url:       (formData.get("source_url") as string) || null,
    question_pool:    formData.get("question_pool") as string,
    review_status:    "needs_review",
  }).select("id").single();
  if (error) throw new Error(error.message);
  await db.from("audit_logs").insert({ actor_id: actor.id, action: "question.created", entity_type: "question", entity_id: question.id });

  redirect("/admin/questions");
}

export async function updateQuestionReviewStatus(formData: FormData) {
  const actor = await requireAdmin();
  const questionId = String(formData.get("question_id") ?? "");
  const reviewStatus = String(formData.get("review_status") ?? "");
  if (!["needs_review", "published", "retired"].includes(reviewStatus)) throw new Error("Invalid review status");

  const db = adminClient();
  if (reviewStatus === "published") {
    const { data: question, error: questionError } = await db
      .from("questions")
      .select("exam_part, source_edition, explanation, reference, source_url")
      .eq("id", questionId)
      .single();
    if (questionError) throw new Error(questionError.message);
    if (question.exam_part === "C" && !question.source_edition) throw new Error("Part C questions require a source edition");
    if (!question.explanation || !question.reference) throw new Error("Published questions require an explanation and reference");
  }
  const { error } = await db.from("questions").update({ review_status: reviewStatus }).eq("id", questionId);
  if (error) throw new Error(error.message);
  await db.from("audit_logs").insert({
    actor_id: actor.id,
    action: "question.review_status_updated",
    entity_type: "question",
    entity_id: questionId,
    details: { review_status: reviewStatus },
  });
}

export async function updateSupportTicket(formData: FormData) {
  const actor = await requireAdmin();
  const ticketId = String(formData.get("ticket_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const priority = String(formData.get("priority") ?? "");
  const internalNotes = String(formData.get("internal_notes") ?? "").trim();
  if (!["open", "in_progress", "resolved", "closed"].includes(status)) throw new Error("Invalid status");
  if (!["low", "medium", "high", "urgent"].includes(priority)) throw new Error("Invalid priority");

  const db = adminClient();
  const { error } = await db.from("support_tickets").update({
    status,
    priority,
    internal_notes: internalNotes || null,
    updated_at: new Date().toISOString(),
  }).eq("id", ticketId);
  if (error) throw new Error(error.message);
  await db.from("audit_logs").insert({
    actor_id: actor.id,
    action: "support_ticket.updated",
    entity_type: "support_ticket",
    entity_id: ticketId,
    details: { status, priority },
  });
}
