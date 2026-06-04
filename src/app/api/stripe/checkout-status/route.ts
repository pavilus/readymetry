import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Missing checkout session" }, { status: 400 });

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "Checkout session not found" }, { status: 404 });
  }
  if (session.metadata?.user_id !== user.id) {
    return NextResponse.json({ error: "Checkout session not found" }, { status: 404 });
  }

  return NextResponse.json({
    paid: session.payment_status === "paid",
    product: session.metadata?.product ?? null,
  });
}
