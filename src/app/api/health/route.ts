import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export async function GET() {
  const startedAt = Date.now();
  const { error } = await adminClient().from("certifications").select("id", { head: true, count: "exact" });
  const operationsConfigured = Boolean(
    process.env.ERROR_MONITOR_WEBHOOK_URL
    && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    && process.env.SUPABASE_CUSTOM_SMTP_ENABLED === "true",
  );
  const healthy = !error && operationsConfigured;

  const response = NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      database: error ? "unavailable" : "available",
      operationsConfigured,
      responseTimeMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
