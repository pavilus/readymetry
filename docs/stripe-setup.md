# Stripe payment setup

Readymetry keeps payment secrets in server environment variables. Never put a Stripe secret key or webhook secret in the database, browser, or a variable prefixed with `NEXT_PUBLIC_`.

## Required values

1. In Stripe, create two one-time payment products:
   - Single Exam
   - Readiness Pack
2. Copy each product's `price_...` ID.
3. Copy the Stripe secret key from **Developers > API keys**.
4. Create a webhook endpoint for:
   - URL: `https://readymetry.com/api/stripe/webhook`
   - Event: `checkout.session.completed`
5. Copy the endpoint's `whsec_...` signing secret.

Set these variables in the server environment:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://readymetry.com
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_signing_secret
STRIPE_SINGLE_EXAM_PRICE_ID=price_single_exam
STRIPE_READINESS_PACK_PRICE_ID=price_readiness_pack
```

After changing production values, rebuild and restart the Next.js process. Confirm status at `/admin/integrations`, then complete one Stripe test-mode purchase and verify that the user's exam credits increase exactly once.
