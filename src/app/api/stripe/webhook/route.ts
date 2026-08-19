import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function objectId(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id ?? null;
}

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
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "unpaid") return NextResponse.json({ received: true });
    const userId = session.metadata?.user_id;
    const product = session.metadata?.product;
    if (!userId || !product) return NextResponse.json({ error: "Missing checkout metadata" }, { status: 400 });
    if (session.amount_total === null || !session.currency) {
      return NextResponse.json({ error: "Missing checkout amount" }, { status: 400 });
    }

    const { error } = await supabase.rpc("fulfill_stripe_purchase", {
      p_event_id: event.id,
      p_event_type: event.type,
      p_user_id: userId,
      p_product: product,
      p_customer_id: typeof session.customer === "string" ? session.customer : null,
      p_checkout_session_id: session.id,
      p_payment_intent_id: objectId(session.payment_intent),
      p_amount_total: session.amount_total,
      p_currency: session.currency,
    });
    if (error) return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const { error } = await supabase.rpc("record_stripe_lifecycle_event", {
      p_event_id: event.id,
      p_event_type: event.type,
      p_object_id: charge.id,
      p_payment_intent_id: objectId(charge.payment_intent),
      p_charge_id: charge.id,
      p_amount: charge.amount_refunded,
      p_currency: charge.currency,
      p_object_status: charge.refunded ? "refunded" : "partially_refunded",
    });
    if (error) return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  if (event.type === "charge.dispute.created" || event.type === "charge.dispute.closed") {
    const dispute = event.data.object;
    const { error } = await supabase.rpc("record_stripe_lifecycle_event", {
      p_event_id: event.id,
      p_event_type: event.type,
      p_object_id: dispute.id,
      p_payment_intent_id: objectId(dispute.payment_intent),
      p_charge_id: objectId(dispute.charge),
      p_amount: dispute.amount,
      p_currency: dispute.currency,
      p_object_status: dispute.status,
    });
    if (error) return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
