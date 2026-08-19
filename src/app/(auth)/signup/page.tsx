"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import AuthCard from "@/components/shared/AuthCard";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import AuthCaptcha, { authCaptchaEnabled } from "@/components/shared/AuthCaptcha";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (authCaptchaEnabled && !captchaToken) { setError("Please complete the security check"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const intent = new URLSearchParams(window.location.search).get("intent");
    const next = intent ? `${ROUTES.onboarding}?intent=${intent}` : ROUTES.onboarding;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        captchaToken: captchaToken ?? undefined,
        data: {
          full_name: form.fullName,
          account_type: "individual",
        },
      },
    });
    if (signUpError) {
      setError(signUpError.message); setLoading(false); setCaptchaToken(null); setCaptchaReset((value) => value + 1); return;
    }
    if (!data.session) {
      setConfirmationSent(true);
      setLoading(false);
      return;
    }
    router.push(next);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition";

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your certification journey today"
      footer={<>Already have an account?{" "}<Link href={ROUTES.login} className="font-semibold text-brand-700 hover:underline">Log in</Link></>}
    >
      {confirmationSent ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-foreground">We sent a confirmation link to <strong>{form.email}</strong>.</p>
          <p className="text-xs text-muted">Open the link in that email to verify your account and continue onboarding.</p>
          <Link href={ROUTES.login} className="inline-flex text-sm font-semibold text-brand-700 hover:underline">Return to login</Link>
        </div>
      ) : <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
          <input type="text" required autoComplete="name" value={form.fullName} placeholder="Alex Johnson"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
        </div>

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

        <AuthCaptcha onToken={setCaptchaToken} resetKey={captchaReset} />

        <button type="submit" disabled={loading || (authCaptchaEnabled && !captchaToken)}
          className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.35)]">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
        </button>

        <p className="text-center text-[11px] text-muted leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href={ROUTES.terms} className="underline hover:text-foreground">Terms of Service</Link>{" "}and{" "}
          <Link href={ROUTES.privacy} className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>
      </form>}
    </AuthCard>
  );
}
