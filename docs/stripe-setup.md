# Stripe payment setup

Readymetry keeps payment secrets in server environment variables. Never put a Stripe secret key or webhook secret in the database, browser, or a variable prefixed with `NEXT_PUBLIC_`.

## Required values

1. In Stripe, create five one-time payment products:
   - Single Exam
   - Readiness Pack
   - Workforce 5
   - Workforce 10
   - Workforce 25
2. Copy each product's `price_...` ID.
3. Copy the Stripe secret key from **Developers > API keys**.
4. Create a webhook endpoint for:
   - URL: `https://readymetry.com/api/stripe/webhook`
   - Events:
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
     - `charge.refunded`
     - `charge.dispute.created`
     - `charge.dispute.closed`
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
STRIPE_WORKFORCE_5_PRICE_ID=price_workforce_5
STRIPE_WORKFORCE_10_PRICE_ID=price_workforce_10
STRIPE_WORKFORCE_25_PRICE_ID=price_workforce_25
```

After changing production values, rebuild and restart the Next.js process. Confirm status at `/admin/integrations`, then complete one Stripe test-mode purchase and verify that exam credits or Workforce seats are fulfilled exactly once.

## Reconciliation and recovery

The `/admin/revenue` page shows recorded gross payments, refunds, fulfillment state, and unmatched Stripe events. Refunds and lost disputes are marked `requires_review`; access is not automatically removed because it may already have been consumed.

For a paid but missing purchase:

1. Confirm the Checkout Session is paid in Stripe.
2. Find the corresponding webhook delivery and retry it from Stripe.
3. Verify the purchase appears in `/admin/revenue` with `fulfilled` status.
4. Confirm the user's credit count or Workforce organization exactly once.

For an unmatched event, locate its PaymentIntent in Stripe and compare it with `stripe_purchases.stripe_payment_intent_id`. Resolve the underlying missing checkout event before changing entitlements manually.
