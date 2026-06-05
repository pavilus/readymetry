"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.login);
  return user;
}

async function findUserByEmail(email: string) {
  const db = adminClient();
  let page = 1;
  while (page <= 10) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw new Error(error.message);
    const match = data.users.find((user: { email?: string }) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

export async function claimWorkforceInviteForCurrentUser() {
  const user = await requireUser();
  if (!user.email) return;

  await adminClient().rpc("claim_workforce_invitation", {
    p_user_id: user.id,
    p_email: user.email,
  });
}

export async function inviteWorkforceMember(formData: FormData) {
  const user = await requireUser();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) throw new Error("Enter a valid email address");

  const db = adminClient();
  const { data: org, error: orgError } = await db
    .from("workforce_organizations")
    .select("id, seat_limit")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (orgError || !org) throw new Error("No Workforce organization found");

  const { count } = await db
    .from("workforce_members")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", org.id)
    .in("status", ["pending", "active"]);
  if ((count ?? 0) >= org.seat_limit) throw new Error("All Workforce seats are already assigned");

  const existingUser = await findUserByEmail(email);
  const status = existingUser ? "active" : "pending";
  const memberPayload: Record<string, any> = {
    organization_id: org.id,
    email,
    role: "member",
    status,
    user_id: existingUser?.id ?? null,
    joined_at: existingUser ? new Date().toISOString() : null,
  };

  const { error } = await db
    .from("workforce_members")
    .upsert(memberPayload, { onConflict: "organization_id,email" });
  if (error) throw new Error(error.message);

  if (existingUser) {
    await db.from("user_profiles").update({
      subscription_tier: "workforce",
      account_type: "enterprise",
      plan_selected_at: new Date().toISOString(),
    }).eq("id", existingUser.id);
  }

  revalidatePath(ROUTES.team);
}
