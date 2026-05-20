"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, ArrowRight, Zap, Building2, BookOpen } from "lucide-react";
import { ROUTES } from "@/lib/constants";

function SuccessContent() {
  const params = useSearchParams();
  const plan = params.get("plan");

  const content = {
    ready: {
      icon: Zap,
      title: "You're on the Ready Plan!",
      sub: "Unlimited exams, full analytics, and everything you need to pass.",
      color: "text-brand-700",
      bg: "bg-brand-50",
    },
    enterprise: {
      icon: Building2,
      title: "Enterprise plan activated!",
      sub: "Invite your team and start tracking readiness across your organization.",
      color: "text-slate-700",
      bg: "bg-slate-50",
    },
    exam_credit: {
      icon: BookOpen,
      title: "Exam credit added!",
      sub: "You now have 1 additional mock exam. Head to Practice Tests to use it.",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
  }[plan ?? "ready"] ?? {
    icon: CheckCircle2,
    title: "Payment confirmed!",
    sub: "Your account has been upgraded.",
    color: "text-brand-700",
    bg: "bg-brand-50",
  };

  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className={`w-20 h-20 rounded-full ${content.bg} flex items-center justify-center mx-auto mb-6`}>
          <Icon size={36} className={content.color} />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-3">{content.title}</h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">{content.sub}</p>
        <Link
          href={ROUTES.dashboard}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.3)]"
        >
          Go to Dashboard <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
