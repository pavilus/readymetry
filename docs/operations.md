# Readymetry operations

## Health monitoring

- Public health endpoint: `https://readymetry.com/api/health`
- Alert when the endpoint returns a non-200 response or when `status` is not `ok`.
- Check PM2 with `pm2 status readymetry` and inspect logs with `pm2 logs readymetry --lines 100 --nostream`.

## Database backups

Readymetry currently uses Supabase. Before schema changes and at least weekly:

1. Export the linked database with `supabase db dump --linked -f backups/readymetry-YYYY-MM-DD.sql`.
2. Store the encrypted backup outside the VPS and outside the repository.
3. Record the Supabase project reference and migration commit associated with the backup.
4. Quarterly, restore the backup into a temporary project and verify users, certifications, questions, and exam sessions.

Never commit database dumps, service-role keys, access tokens, or production environment files.

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
