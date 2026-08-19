import fs from "node:fs";
import path from "node:path";

const REQUIRED_VARIABLES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_SINGLE_EXAM_PRICE_ID",
  "STRIPE_READINESS_PACK_PRICE_ID",
  "STRIPE_WORKFORCE_5_PRICE_ID",
  "STRIPE_WORKFORCE_10_PRICE_ID",
  "STRIPE_WORKFORCE_25_PRICE_ID",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "SUPABASE_CUSTOM_SMTP_ENABLED",
  "ERROR_MONITOR_WEBHOOK_URL",
];

const TRUE_VARIABLES = ["SUPABASE_CUSTOM_SMTP_ENABLED"];

const ENV_FILES = [".env.production.local", ".env.local", ".env.production", ".env"];

function readEnvironmentFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const values = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "");
    }
    values[match[1]] = value;
  }
  return values;
}

const fileValues = ENV_FILES.reduce((values, filename) => {
  const filePath = path.join(process.cwd(), filename);
  const currentFile = readEnvironmentFile(filePath);
  for (const [name, value] of Object.entries(currentFile)) {
    if (!(name in values)) values[name] = value;
  }
  return values;
}, {});

const missing = REQUIRED_VARIABLES.filter((name) => !(process.env[name] || fileValues[name]));
const invalid = TRUE_VARIABLES.filter((name) => (process.env[name] || fileValues[name]) !== "true");

if (missing.length > 0 || invalid.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  if (invalid.length > 0) console.error(`Environment variables that must equal true: ${invalid.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`Environment preflight passed (${REQUIRED_VARIABLES.length} required variables present).`);
}
