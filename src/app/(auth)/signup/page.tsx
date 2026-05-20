"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2, User, Building2 } from "lucide-react";
import AuthCard from "@/components/shared/AuthCard";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

type AccountType = "individual" | "enterprise";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [form, setForm] = useState({ fullName: "", email: "", password: "", organizationName: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (accountType === "enterprise" && !form.organizationName.trim()) { setError("Organization name is required"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    await new Promise((r) => setTimeout(r, 600));
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("profiles").update({
        account_type: accountType,
        organization_name: accountType === "enterprise" ? form.organizationName : null,
      }).eq("id", user.id);
    }
    router.push(ROUTES.onboarding);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition";

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your certification journey today"
      footer={<>Already have an account?{" "}<Link href={ROUTES.login} className="font-semibold text-brand-700 hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account type</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { type: "individual" as AccountType, icon: User, label: "Individual", sub: "Personal exam prep" },
              { type: "enterprise" as AccountType, icon: Building2, label: "Enterprise", sub: "Teams & organizations" },
            ]).map(({ type, icon: Icon, label, sub }) => (
              <button key={type} type="button" onClick={() => setAccountType(type)}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${accountType === type ? "border-brand-600 bg-brand-50" : "border-border hover:border-brand-200"}`}>
                <div className={`flex items-center gap-2 ${accountType === type ? "text-brand-700" : "text-foreground"}`}>
                  <Icon size={14} /><span className="text-sm font-semibold">{label}</span>
                </div>
                <span className="text-[11px] text-muted">{sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
          <input type="text" required autoComplete="name" value={form.fullName} placeholder="Alex Johnson"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
        </div>

        {accountType === "enterprise" && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Organization name</label>
            <input type="text" required value={form.organizationName} placeholder="Industrial Inspection Inc."
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })} className={inputClass} />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
          <input type="email" required autoComplete="email" value={form.email} placeholder="alex@example.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} required autoComplete="new-password"
              value={form.password} placeholder="Min. 8 characters"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition" />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.35)]">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
        </button>

        <p className="text-center text-[11px] text-muted leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="#" className="underline hover:text-foreground">Terms of Service</Link>{" "}and{" "}
          <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>
      </form>
    </AuthCard>
  );
}
