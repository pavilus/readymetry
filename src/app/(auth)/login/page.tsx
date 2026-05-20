"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import AuthCard from "@/components/shared/AuthCard";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const isAdmin = redirectTo.startsWith("/admin");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectTo || ROUTES.dashboard);
    }
  };

  return (
    <AuthCard
      title={isAdmin ? "Admin Dashboard" : "Welcome back"}
      subtitle={isAdmin ? "Sign in with your admin credentials" : "Sign in to your Readymetry account"}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.signup} className="font-semibold text-brand-700 hover:underline">
            Sign up free
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200">
            <ShieldCheck size={14} className="text-brand-700 shrink-0" />
            <p className="text-xs text-brand-700 font-medium">Restricted access — authorized personnel only</p>
          </div>
        )}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="alex@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs text-brand-700 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Your password"
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.35)]"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCard title="Welcome back" subtitle="Sign in to your Readymetry account"><div className="py-8 flex justify-center"><Loader2 size={20} className="animate-spin text-brand-700" /></div></AuthCard>}>
      <LoginForm />
    </Suspense>
  );
}
