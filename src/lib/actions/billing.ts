"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export type PurchaseType = "single_exam" | "readiness_pack";

async function getOrCreateStripeCustomer(supabase: any, user: { id: string; email?: string }) {
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("stripe_customer_id, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id as string;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email ?? "",
    name: profile?.full_name ?? undefined,
    metadata: { supabase_user_id: user.id },
  });

  await supabase.from("user_profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", user.id);

  return customer.id;
}

/** Free tier — mark plan as selected, no Stripe needed */
export async function selectStarterPlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await (supabase as any).from("user_profiles").update({
    subscription_tier: "starter",
    plan_selected_at: new Date().toISOString(),
  }).eq("id", user.id);
}

/** One-time Stripe checkout for Single Exam ($39) or Readiness Pack ($99) */
export async function createCheckoutSession(product: PurchaseType) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const customerId = await getOrCreateStripeCustomer(supabase, user);
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://readymetry.com";

  const priceId = product === "single_exam"
    ? process.env.STRIPE_SINGLE_EXAM_PRICE_ID!
    : process.env.STRIPE_READINESS_PACK_PRICE_ID!;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/checkout/success?plan=${product}`,
    cancel_url: `${appUrl}/pricing`,
    metadata: { user_id: user.id, product },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  redirect(session.url!);
}

/** Get current user's billing status — used by dashboard + exams page */
export async function getBillingStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await (supabase as any)
    .from("user_profiles")
    .select("subscription_tier, plan_selected_at, purchased_exam_credits, account_type, organization_name")
    .eq("id", user.id)
    .single();

  if (!data) return null;

  const { count } = await supabase
    .from("exam_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const tier = data.subscription_tier as "starter" | "ready" | "workforce";
  const completedSessions = count ?? 0;
  const examCredits = (data.purchased_exam_credits as number) ?? 0;

  return {
    tier,
    planSelectedAt: data.plan_selected_at as string | null,
    examCredits,
    completedSessions,
    accountType: data.account_type as "individual" | "enterprise",
    organizationName: data.organization_name as string | null,
    // starter = 1 free exam; after that, need credits or upgrade
    canStartExam: tier !== "starter" || completedSessions === 0 || examCredits > 0,
    hasFullAnalytics: tier === "ready" || tier === "workforce",
  };
}

/** Called from dashboard server component — redirects to /plan if no plan yet */
export async function requirePlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.login);

  const { data } = await (supabase as any)
    .from("user_profiles")
    .select("plan_selected_at")
    .eq("id", user.id)
    .single();

  if (!data?.plan_selected_at) redirect(ROUTES.plan);
}
