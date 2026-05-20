"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import AuthCard from "@/components/shared/AuthCard";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the tokens in the URL hash — exchange them for a session
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => router.push(ROUTES.dashboard), 2000);
  };

  if (done) {
    return (
      <AuthCard title="Password updated" subtitle="You're all set">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <p className="text-sm text-muted">Redirecting to your dashboard…</p>
        </div>
      </AuthCard>
    );
  }

  if (!ready) {
    return (
      <AuthCard title="Reset your password" subtitle="Verifying your link…">
        <div className="flex justify-center py-6">
          <Loader2 size={24} className="animate-spin text-brand-700" />
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set new password" subtitle="Choose a strong password for your account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.35)]">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Update Password"}
        </button>
      </form>
    </AuthCard>
  );
}
