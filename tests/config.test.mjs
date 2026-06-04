import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

test("required public and operational routes exist", () => {
  const routes = [
    "src/app/(marketing)/privacy/page.tsx",
    "src/app/(marketing)/terms/page.tsx",
    "src/app/(marketing)/cookies/page.tsx",
    "src/app/(marketing)/contact/page.tsx",
    "src/app/api/health/route.ts",
    "src/app/(dashboard)/support/page.tsx",
    "src/app/sitemap.ts",
    "src/app/robots.ts",
    "src/app/opengraph-image.tsx",
  ];
  for (const route of routes) assert.equal(fs.existsSync(route), true, `${route} is missing`);
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
});

test("security headers remain configured", () => {
  const config = fs.readFileSync("next.config.ts", "utf8");
  for (const header of ["Content-Security-Policy", "Strict-Transport-Security", "X-Frame-Options", "X-Content-Type-Options"]) {
    assert.match(config, new RegExp(header));
  }
});
