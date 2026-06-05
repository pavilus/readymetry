import { CheckCircle2, CircleAlert, ExternalLink } from "lucide-react";

const VARIABLES = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", label: "Supabase project URL", group: "Supabase" },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", label: "Supabase anonymous key", group: "Supabase" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", label: "Supabase service role key", group: "Supabase" },
  { key: "STRIPE_SECRET_KEY", label: "Stripe secret key", group: "Stripe" },
  { key: "STRIPE_WEBHOOK_SECRET", label: "Stripe webhook signing secret", group: "Stripe" },
  { key: "STRIPE_SINGLE_EXAM_PRICE_ID", label: "Single Exam price ID", group: "Stripe" },
  { key: "STRIPE_READINESS_PACK_PRICE_ID", label: "Readiness Pack price ID", group: "Stripe" },
  { key: "STRIPE_WORKFORCE_5_PRICE_ID", label: "Workforce 5 price ID", group: "Stripe" },
  { key: "STRIPE_WORKFORCE_10_PRICE_ID", label: "Workforce 10 price ID", group: "Stripe" },
  { key: "STRIPE_WORKFORCE_25_PRICE_ID", label: "Workforce 25 price ID", group: "Stripe" },
  { key: "NEXT_PUBLIC_APP_URL", label: "Application URL", group: "Application" },
] as const;

function maskedHint(key: string) {
  const value = process.env[key];
  if (!value) return "Not configured";
  if (key === "STRIPE_SECRET_KEY") return value.startsWith("sk_live_") ? "Live mode" : "Test mode";
  if (key.endsWith("PRICE_ID")) return `${value.slice(0, 10)}...`;
  return "Configured";
}

export default function IntegrationsPage() {
  const configured = VARIABLES.filter(({ key }) => Boolean(process.env[key])).length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-foreground">Integrations</h1>
        <p className="text-sm text-muted mt-1">
          {configured} of {VARIABLES.length} required environment variables are configured.
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {VARIABLES.map(({ key, label, group }, index) => {
          const ready = Boolean(process.env[key]);
          return (
            <div key={key} className={`flex items-center gap-4 px-5 py-4 ${index ? "border-t border-border" : ""}`}>
              {ready
                ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                : <CircleAlert size={18} className="text-amber-600 shrink-0" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <span className="text-[10px] uppercase font-bold text-muted">{group}</span>
                </div>
                <code className="text-xs text-muted">{key}</code>
              </div>
              <span className={`text-xs font-semibold ${ready ? "text-emerald-700" : "text-amber-700"}`}>
                {maskedHint(key)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <p className="text-xs text-muted">Secrets are managed on the server and are never displayed here.</p>
        <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
          Stripe Dashboard <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
