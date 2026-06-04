"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSupportTicket(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const subject = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "general");
  const message = String(formData.get("message") ?? "").trim();
  if (subject.length < 3 || message.length < 10) throw new Error("Please provide more detail.");

  const supportClient = supabase as unknown as {
    from: (table: "support_tickets") => {
      insert: (values: { user_id: string; subject: string; category: string; message: string }) => Promise<{ error: { message: string } | null }>;
    };
  };
  const { error } = await supportClient.from("support_tickets").insert({ user_id: user.id, subject, category, message });
  if (error) throw new Error(error.message);
  revalidatePath("/support");
}
