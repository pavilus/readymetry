import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export async function GET() {
  const startedAt = Date.now();
  const { error } = await adminClient().from("certifications").select("id", { head: true, count: "exact" });

  return NextResponse.json(
    {
      status: error ? "degraded" : "ok",
      database: error ? "unavailable" : "available",
      responseTimeMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    },
    { status: error ? 503 : 200 },
  );
}
