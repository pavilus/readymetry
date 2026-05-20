"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

const CERTS = ["AWS CWI", "ASNT NDT Level II", "API 570", "AWS D1.1"];
const TABS = ["Profile", "Preferences", "Subscription"] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Alex Johnson",
    email: "alex@example.com",
    company: "Industrial Inspection Inc.",
    phone: "",
  });
  const [prefs, setPrefs] = useState({
    cert: "AWS CWI",
    examDate: "2026-07-01",
    dailyGoal: "20",
    emailReminders: true,
    timedByDefault: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border mb-6 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-white text-foreground shadow-sm border border-border" : "text-muted hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border p-7">
        {tab === "Profile" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-brand-700 flex items-center justify-center text-white text-xl font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{profile.fullName}</p>
                <button className="text-xs text-brand-700 hover:underline mt-0.5">Change avatar</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full name</label>
                <input className={inputClass} value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Email address</label>
                <input className={inputClass} type="email" value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Company / Organization</label>
                <input className={inputClass} value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Phone (optional)</label>
                <input className={inputClass} type="tel" value={profile.phone} placeholder="+1 555 000 0000"
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-3">Change Password</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Current password</label>
                  <input className={inputClass} type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className={labelClass}>New password</label>
                  <input className={inputClass} type="password" placeholder="Min. 8 characters" />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Preferences" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Target Certification</label>
              <select
                className={inputClass}
                value={prefs.cert}
                onChange={(e) => setPrefs({ ...prefs, cert: e.target.value })}
              >
                {CERTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Target Exam Date</label>
              <input className={inputClass} type="date" value={prefs.examDate}
                onChange={(e) => setPrefs({ ...prefs, examDate: e.target.value })} />
            </div>

            <div>
              <label className={labelClass}>Daily practice goal (questions)</label>
              <select
                className={inputClass}
                value={prefs.dailyGoal}
                onChange={(e) => setPrefs({ ...prefs, dailyGoal: e.target.value })}
              >
                {["10", "20", "30", "50"].map((n) => <option key={n}>{n} questions</option>)}
              </select>
            </div>

            {[
              { key: "emailReminders" as const, label: "Email practice reminders", sub: "Daily nudge to keep your streak" },
              { key: "timedByDefault" as const, label: "Timed mode by default", sub: "1.5 min per question" },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{toggle.label}</p>
                  <p className="text-xs text-muted mt-0.5">{toggle.sub}</p>
                </div>
                <button
                  onClick={() => setPrefs({ ...prefs, [toggle.key]: !prefs[toggle.key] })}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${prefs[toggle.key] ? "bg-brand-700" : "bg-border"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${prefs[toggle.key] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "Subscription" && (
          <div className="flex flex-col gap-5">
            <div className="p-5 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-brand-800">Ready Plan</p>
                <p className="text-xs text-brand-600 mt-0.5">$29/month · Renews July 1, 2026</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-brand-700 text-white text-xs font-semibold">Active</span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">Your plan includes:</p>
              {[
                "Unlimited practice exams",
                "Full readiness analytics",
                "Pass probability prediction",
                "All certification tracks",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-sm text-muted">{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
              <button className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-surface transition-colors">
                Cancel Subscription
              </button>
              <button className="flex-1 py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 text-sm font-semibold hover:bg-brand-100 transition-colors">
                Upgrade to Workforce
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || tab === "Subscription"}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <><Check size={15} /> Saved</> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
