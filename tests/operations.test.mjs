import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

test("backup automation requires encrypted off-repository storage", () => {
  const backup = fs.readFileSync("scripts/backup-database.sh", "utf8");
  assert.match(backup, /BACKUP_OUTPUT_DIR/);
  assert.match(backup, /BACKUP_AGE_RECIPIENT/);
  assert.match(backup, /must be outside the repository/);
  assert.match(backup, /age --recipient/);
  assert.match(backup, /shasum -a 256/);
  const result = spawnSync("bash", ["scripts/backup-database.sh"], { encoding: "utf8", env: { PATH: process.env.PATH } });
  assert.equal(result.status, 1);
});

test("restore verification refuses targets not confirmed as disposable", () => {
  const verify = fs.readFileSync("scripts/verify-restored-database.sh", "utf8");
  assert.match(verify, /RESTORE_CONFIRM_DISPOSABLE/);
  assert.match(verify, /PRODUCTION_PROJECT_REF/);
  assert.match(fs.readFileSync("scripts/verify-restored-database.sql", "utf8"), /BEGIN READ ONLY/);
  const result = spawnSync("bash", ["scripts/verify-restored-database.sh"], { encoding: "utf8", env: { PATH: process.env.PATH } });
  assert.equal(result.status, 1);
});

test("weekly backup timer is persistent", () => {
  const timer = fs.readFileSync("ops/readymetry-backup.timer", "utf8");
  assert.match(timer, /OnCalendar=/);
  assert.match(timer, /Persistent=true/);
});
