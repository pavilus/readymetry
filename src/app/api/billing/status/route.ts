import { getBillingStatus } from "@/lib/actions/billing";
import { NextResponse } from "next/server";

export async function GET() {
  const status = await getBillingStatus();
  if (!status) return NextResponse.json(null, { status: 401 });
  return NextResponse.json(status);
}
