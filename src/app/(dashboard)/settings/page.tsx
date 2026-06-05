import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateAccount, updatePassword } from "@/lib/actions/account";
import { ROUTES } from "@/lib/constants";

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-600";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(ROUTES.login);

  const { data: profileRaw } = await supabase
    .from("user_profiles")
    .select("full_name, organization_name, subscription_tier, purchased_exam_credits")
    .eq("id", user.id)
    .single();
  const profile = profileRaw as {
    full_name: string | null;
    organization_name: string | null;
    subscription_tier: string;
    purchased_exam_credits: number;
  } | null;

  const tier = profile?.subscription_tier ?? "starter";
  const planFeatures = tier === "workforce"
    ? ["Unlimited exam sessions", "Full readiness analytics", "Team access"]
    : tier === "ready"
      ? ["Permanent readiness analytics", "Five exam credits per pack", "All available certification tracks"]
      : ["One Free Trial practice exam", "Purchase detailed exam credits anytime"];
  const accessName = tier === "workforce" ? "Workforce access" : tier === "ready" ? "Readiness analytics" : "Free Trial access";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account and access.</p>
      </div>

      <div className="flex flex-col gap-6">
        <section className="bg-white rounded-xl border border-border p-7">
          <h2 className="text-sm font-semibold text-foreground mb-5">Profile</h2>
          <form action={updateAccount} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="full_name">Full name</label>
                <input id="full_name" name="full_name" className={inputClass} defaultValue={profile?.full_name ?? ""} />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email address</label>
                <input id="email" className={inputClass} value={user.email ?? ""} readOnly />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="organization_name">Company / Organization</label>
              <input id="organization_name" name="organization_name" className={inputClass} defaultValue={profile?.organization_name ?? ""} />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-5 py-2.5 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800">
                Save profile
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-border p-7">
          <h2 className="text-sm font-semibold text-foreground mb-5">Password</h2>
          <form action={updatePassword} className="flex items-end gap-3">
            <div className="flex-1">
              <label className={labelClass} htmlFor="password">New password</label>
              <input id="password" name="password" type="password" minLength={8} required className={inputClass} />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-lg border border-brand-200 bg-brand-50 text-brand-700 text-sm font-semibold">
              Update password
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-border p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">{accessName}</h2>
              <p className="text-xs text-muted mt-1">{profile?.purchased_exam_credits ?? 0} paid exam credits remaining</p>
            </div>
            <a href={ROUTES.pricing} className="px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold">Buy credits</a>
          </div>
          <div className="flex flex-col gap-2">
            {planFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-muted">
                <Check size={14} className="text-emerald-600" />
                {feature}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
