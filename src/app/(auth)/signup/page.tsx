"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import AuthCard from "@/components/shared/AuthCard";
import { ROUTES } from "@/lib/constants";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Auth logic wired in next phase
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your certification journey today"
      footer={
        <>
          Already have an account?{" "}
          <Link href={ROUTES.login} className="font-semibold text-brand-700 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Full name
          </label>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Alex Johnson"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition"
          />
        </div>

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
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 characters"
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
              Create Account <ArrowRight size={16} />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-muted leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="#" className="underline hover:text-foreground">Terms of Service</Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
        </p>
      </form>
    </AuthCard>
  );
}
