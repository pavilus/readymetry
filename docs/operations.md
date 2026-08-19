# Readymetry operations

## Health monitoring

- Public health endpoint: `https://readymetry.com/api/health`
- Alert when the endpoint returns a non-200 response or when `status` is not `ok`.
- Configure the monitor to check every five minutes and notify at least two maintainers after two consecutive failures.
- Check PM2 with `pm2 status readymetry` and inspect logs with `pm2 logs readymetry --lines 100 --nostream`.

The endpoint reports `operationsConfigured: false` and returns 503 until custom SMTP, Turnstile, and the error-monitor endpoint are configured. It never returns secret values.

## Error monitoring

Set `ERROR_MONITOR_WEBHOOK_URL` to an HTTPS ingestion endpoint that accepts JSON. If it requires bearer authentication, set `ERROR_MONITOR_BEARER_TOKEN`. Server errors are also written as structured JSON to PM2 logs. Reports omit headers, query strings, user data, and raw exception messages.

Trigger a controlled error in staging and verify both the external alert and the `error_monitor_delivery_failed` fallback log behavior before enabling production alerts.

## Database backups

Readymetry currently uses Supabase. Independent logical backups are encrypted with age before leaving temporary storage.

1. Install `age`, Docker, and the Supabase CLI on the backup host.
2. Copy `ops/readymetry-backup.service` and `ops/readymetry-backup.timer` into `/etc/systemd/system/`.
3. Create `/etc/readymetry/backup.env`, owned by root with mode `0600`, containing `BACKUP_OUTPUT_DIR`, `BACKUP_AGE_RECIPIENT`, `SUPABASE_PROJECT_REF`, and the Supabase access credentials required by the linked CLI.
4. Ensure `BACKUP_OUTPUT_DIR` is mounted off-host storage and is outside `/root/readymetry`.
5. Enable the schedule with `systemctl daemon-reload` and `systemctl enable --now readymetry-backup.timer`.
6. Run `systemctl start readymetry-backup.service` once and verify the encrypted archive and JSON checksum manifest off-host.

Quarterly, decrypt an archive into temporary storage and restore its `roles.sql`, `schema.sql`, and `data.sql` files into a disposable Supabase project. Then set `RESTORE_DATABASE_URL`, `RESTORE_CONFIRM_DISPOSABLE=true`, and `PRODUCTION_PROJECT_REF`, and run `npm run restore:verify`. The verifier is read-only and refuses a URL containing the production project reference.

Never commit database dumps, service-role keys, access tokens, or production environment files.

## Authentication delivery and abuse protection

Configure a custom SMTP provider in Supabase Authentication settings, then set `SUPABASE_CUSTOM_SMTP_ENABLED=true` only after signup confirmation and password recovery messages arrive successfully. Configure SPF, DKIM, and DMARC for the authentication sending domain and disable provider link tracking for auth messages.

Create a Cloudflare Turnstile widget for the production hostname. Configure its secret in Supabase Authentication > Bot and Abuse Protection, and set only its public site key as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in the application environment. Test signup, login, and password recovery before deployment.

## Incident response

1. Confirm impact through `/api/health`, PM2 status, and recent structured error logs.
2. Stop deployments and record the current Git commit, first failure time, and affected routes.
3. Check Supabase status, Stripe webhook deliveries, disk capacity, and the latest backup manifest.
4. Roll back the application to the last known-good commit when the failure is application-only; do not roll back database migrations without a reviewed forward repair.
5. For data loss, create a disposable restore target first and complete `npm run restore:verify` before authorizing any production restore.
6. Record resolution, customer impact, and follow-up actions without copying secrets or personal data into the incident log.

## Deployment

Run `./deploy.sh`. It synchronizes source files while preserving server environment files, builds before restarting PM2, and stops immediately if a command fails.

The deployment host must run Node.js 22. Deployment uses `npm ci` and runs `npm run env:check` before building. The preflight reports missing variable names but never prints their values.

Before deployment:

1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run `npm test`.
4. Run `npm run build`.

After deployment:

1. Verify `/api/health`.
2. Verify `/`, `/signup`, and one protected-route redirect.
3. Confirm `pm2 status readymetry` is online.

## Integration tests

The behavioral integration suite runs against the disposable local Supabase stack in CI. It validates RLS isolation, protected question answers, entitlement consumption and refunds, Stripe event idempotency, and Workforce fulfillment.

To run it locally, install Docker and the Supabase CLI, then run:

1. `supabase start`
2. Export `API_URL`, `ANON_KEY`, and `SERVICE_ROLE_KEY` from `supabase status -o env` as `SUPABASE_TEST_URL`, `SUPABASE_TEST_ANON_KEY`, and `SUPABASE_TEST_SERVICE_ROLE_KEY`.
3. Run `npm run test:integration`.

The suite refuses remote Supabase URLs unless `ALLOW_REMOTE_SUPABASE_TESTS=true` is deliberately provided. Never point it at production.
