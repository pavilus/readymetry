import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const stripe = getStripe();
  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = adminSupabase();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const product = session.metadata?.product;
    if (!userId) return NextResponse.json({ received: true });

    if (product === "single_exam") {
      // Add 1 exam credit, keep starter tier, mark plan as selected
      await supabase.rpc("increment_exam_credits", { p_user_id: userId, p_amount: 1 });
      await supabase.from("user_profiles")
        .update({ plan_selected_at: new Date().toISOString() })
        .eq("id", userId)
        .is("plan_selected_at", null); // only set if not already set
    } else if (product === "readiness_pack") {
      // Full analytics unlock + 5 exam credits
      await supabase.from("user_profiles").update({
        subscription_tier: "ready",
        stripe_customer_id: session.customer as string,
        plan_selected_at: new Date().toISOString(),
      }).eq("id", userId);
      await supabase.rpc("increment_exam_credits", { p_user_id: userId, p_amount: 5 });
    }
  }

  return NextResponse.json({ received: true });
}
