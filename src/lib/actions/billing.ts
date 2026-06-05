"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export type PurchaseType = "single_exam" | "readiness_pack" | "workforce_5" | "workforce_10" | "workforce_25";

const PRICE_ENV: Record<PurchaseType, string> = {
  single_exam: "STRIPE_SINGLE_EXAM_PRICE_ID",
  readiness_pack: "STRIPE_READINESS_PACK_PRICE_ID",
  workforce_5: "STRIPE_WORKFORCE_5_PRICE_ID",
  workforce_10: "STRIPE_WORKFORCE_10_PRICE_ID",
  workforce_25: "STRIPE_WORKFORCE_25_PRICE_ID",
};

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

  await adminClient().from("user_profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", user.id);

  return customer.id;
}

/** Activate the Free Trial starting state, no Stripe needed. */
export async function selectStarterPlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  await adminClient().from("user_profiles").update({
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

  const priceId = process.env[PRICE_ENV[product]];
  if (!priceId) throw new Error(`Stripe price is not configured for ${product}`);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
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
    .select("subscription_tier, plan_selected_at, purchased_exam_credits, free_exam_consumed, account_type, organization_name")
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
    canStartExam: tier === "workforce" || !data.free_exam_consumed || examCredits > 0,
    hasFullAnalytics: tier === "ready" || tier === "workforce",
  };
}
