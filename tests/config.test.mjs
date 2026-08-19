import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

test("required public and operational routes exist", () => {
  const routes = [
    "src/app/(marketing)/privacy/page.tsx",
    "src/app/(marketing)/terms/page.tsx",
    "src/app/(marketing)/cookies/page.tsx",
    "src/app/(marketing)/refund/page.tsx",
    "src/app/(marketing)/accessibility/page.tsx",
    "src/app/(marketing)/exam-disclaimer/page.tsx",
    "src/app/(marketing)/contact/page.tsx",
    "src/app/api/health/route.ts",
    "src/app/(dashboard)/support/page.tsx",
    "src/app/(dashboard)/team/page.tsx",
    "src/app/sitemap.ts",
    "src/app/robots.ts",
    "src/app/opengraph-image.tsx",
  ];
  for (const route of routes) assert.equal(fs.existsSync(route), true, `${route} is missing`);
});

test("marketing navigation points to live routes and sections", () => {
  const navbar = fs.readFileSync("src/components/marketing/Navbar.tsx", "utf8");
  const footer = fs.readFileSync("src/components/marketing/Footer.tsx", "utf8");
  const landing = fs.readFileSync("src/app/(marketing)/page.tsx", "utf8");
  assert.doesNotMatch(navbar, /href: "#/);
  assert.doesNotMatch(footer, /#pricing/);
  assert.match(landing, /FeatureHighlights/);
  assert.match(landing, /ResourcesSection/);
  for (const route of ["refund", "accessibility", "examDisclaimer"]) {
    assert.match(footer, new RegExp(`ROUTES\\.${route}`));
  }
});

test("support and audit migration preserves internal-note privacy", () => {
  const migration = fs.readFileSync("supabase/migrations/20260604000006_support_audit_catalog.sql", "utf8");
  assert.match(migration, /GRANT SELECT, INSERT \(user_id, subject, category, message\) ON support_tickets TO authenticated/);
  assert.match(migration, /REVOKE ALL ON audit_logs FROM anon, authenticated/);
});

test("deployment preserves environment files and fails on command errors", () => {
  const deploy = fs.readFileSync("deploy.sh", "utf8");
  assert.match(deploy, /set -e/);
  assert.match(deploy, /--exclude='\.env\*'/);
  assert.match(deploy, /--delete/);
  assert.match(deploy, /npm ci/);
  assert.match(deploy, /npm run env:check/);
  assert.match(deploy, /node --version/);
});

test("CI runs the complete local quality gate", () => {
  const workflow = fs.readFileSync(".github/workflows/ci.yml", "utf8");
  for (const command of ["npm ci", "npm run lint", "npm run typecheck", "npm test", "npm run questions:audit", "npm run build", "npm audit --omit=dev"]) {
    assert.match(workflow, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("security headers remain configured", () => {
  const config = fs.readFileSync("next.config.ts", "utf8");
  for (const header of ["Content-Security-Policy", "Strict-Transport-Security", "X-Frame-Options", "X-Content-Type-Options"]) {
    assert.match(config, new RegExp(header));
  }
});

test("exam products preserve per-session entitlements", () => {
  const migration = fs.readFileSync("supabase/migrations/20260604000008_product_entitlements.sql", "utf8");
  const exams = fs.readFileSync("src/lib/actions/exams.ts", "utf8");
  assert.match(migration, /access_type IN \('free', 'credit', 'workforce'\)/);
  assert.ok(migration.indexOf("IF v_credits > 0") < migration.indexOf("IF NOT coalesce(v_free_consumed"), "paid credits must be used before the Free Trial");
  assert.match(exams, /entitlements: \{ hasDetailedResults: false, hasFullAnalytics: false \}/);
  assert.match(exams, /access_type: accessType/);
});

test("workforce is self-serve through Stripe and team seats", () => {
  const constants = fs.readFileSync("src/lib/constants.ts", "utf8");
  const billing = fs.readFileSync("src/lib/actions/billing.ts", "utf8");
  const pricing = fs.readFileSync("src/app/(marketing)/pricing/page.tsx", "utf8");
  const migration = fs.readFileSync("supabase/migrations/20260605000001_workforce_self_serve.sql", "utf8");
  assert.match(constants, /workforce_5/);
  assert.match(constants, /workforce_10/);
  assert.match(constants, /workforce_25/);
  assert.match(billing, /STRIPE_WORKFORCE_5_PRICE_ID/);
  assert.match(pricing, /createCheckoutSession\(product\)/);
  assert.doesNotMatch(pricing, /Workforce%20Plan%20Inquiry/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS workforce_organizations/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS workforce_members/);
  assert.match(migration, /claim_workforce_invitation/);
});

test("question-bank growth is reviewed and balanced", () => {
  const quality = fs.readFileSync("supabase/migrations/20260604000009_question_bank_quality.sql", "utf8");
  const batch = fs.readFileSync("supabase/migrations/20260604000010_cwi_part_a_batch_001.sql", "utf8");
  const exams = fs.readFileSync("src/lib/actions/exams.ts", "utf8");
  assert.match(quality, /review_status IN \('draft', 'needs_review', 'published', 'retired'\)/);
  assert.match(batch, /'needs_review'/);
  assert.match(exams, /\.eq\("review_status", "published"\)/);
  assert.match(exams, /selectBalancedQuestions\(questions, opts\.questionCount, recentlySeenIds\)/);
});

test("question sources distinguish previews from complete references", () => {
  const sources = fs.readFileSync("docs/question-sources.md", "utf8");
  const separation = fs.readFileSync("supabase/migrations/20260604000011_question_pool_separation.sql", "utf8");
  assert.match(sources, /Welding Handbook, Ninth Edition, Volume 4/);
  assert.match(sources, /front matter and contents only/);
  assert.match(separation, /source_url TEXT/);
});

test("third-party reference questions remain review-only by default", () => {
  const batch = fs.readFileSync("supabase/migrations/20260604000013_cwi_processes_batch_002.sql", "utf8");
  const fundamentals = fs.readFileSync("supabase/migrations/20260604000014_cwi_fundamentals_batch_003.sql", "utf8");
  const inspection = fs.readFileSync("supabase/migrations/20260604000015_cwi_inspection_testing_batch_004.sql", "utf8");
  const sources = fs.readFileSync("docs/question-sources.md", "utf8");
  assert.match(batch, /'needs_review', 'third_party_reference'/);
  assert.match(fundamentals, /'needs_review', 'third_party_reference'/);
  assert.match(inspection, /'needs_review', 'third_party_reference'/);
  assert.match(sources, /redistribution authorization is unclear/);
});

test("question bank contains only current pools", () => {
  const separation = fs.readFileSync("supabase/migrations/20260604000011_question_pool_separation.sql", "utf8");
  assert.match(separation, /question_pool IN \('cwi_core', 'd1_1_2020'\)/);
  assert.equal(fs.existsSync("supabase/migrations/20260604000012_d1_1_2000_historical_batch_001.sql"), false);
});
