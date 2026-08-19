import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";

const requiredEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  NEXT_PUBLIC_APP_URL: "https://example.com",
  STRIPE_SECRET_KEY: "sk_test_example",
  STRIPE_WEBHOOK_SECRET: "whsec_example",
  STRIPE_SINGLE_EXAM_PRICE_ID: "price_single",
  STRIPE_READINESS_PACK_PRICE_ID: "price_pack",
  STRIPE_WORKFORCE_5_PRICE_ID: "price_workforce_5",
  STRIPE_WORKFORCE_10_PRICE_ID: "price_workforce_10",
  STRIPE_WORKFORCE_25_PRICE_ID: "price_workforce_25",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
  SUPABASE_CUSTOM_SMTP_ENABLED: "true",
  ERROR_MONITOR_WEBHOOK_URL: "https://monitor.example/events",
};

test("environment preflight succeeds without printing secret values", () => {
  const result = spawnSync(process.execPath, ["scripts/check-environment.mjs"], {
    encoding: "utf8",
    env: { PATH: process.env.PATH, ...requiredEnvironment },
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Environment preflight passed/);
  assert.doesNotMatch(result.stdout, /test-service-role-key|sk_test_example/);
});

test("environment preflight rejects an unconfirmed SMTP marker", () => {
  const result = spawnSync(process.execPath, ["scripts/check-environment.mjs"], {
    encoding: "utf8",
    env: { PATH: process.env.PATH, ...requiredEnvironment, SUPABASE_CUSTOM_SMTP_ENABLED: "false" },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /SUPABASE_CUSTOM_SMTP_ENABLED/);
});

test("environment preflight identifies missing variable names", () => {
  const result = spawnSync(process.execPath, ["scripts/check-environment.mjs"], {
    encoding: "utf8",
    env: { PATH: process.env.PATH },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(result.stderr, /STRIPE_WEBHOOK_SECRET/);
});
