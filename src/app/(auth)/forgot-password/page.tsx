"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import AuthCard from "@/components/shared/AuthCard";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=recovery`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link
          href={ROUTES.login}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Check your inbox</p>
            <p className="text-sm text-muted">
              We sent a reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          <button
            onClick={() => setSent(false)}
            className="text-xs text-muted hover:text-foreground underline transition-colors"
          >
            Didn&apos;t receive it? Try again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.35)]"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
