"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveOnboarding(certificationId: string, examDate: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const db = supabase as any;
  const { error } = await db.from("user_certifications").upsert(
    {
      user_id: user.id,
      certification_id: certificationId,
      exam_date: examDate || null,
    },
    { onConflict: "user_id,certification_id" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function getUserCertification() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_certifications")
    .select("*, certifications(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}
