"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Zap, BookOpen, Loader2, CircleAlert } from "lucide-react";
import { ROUTES } from "@/lib/constants";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"checking" | "paid" | "error">(sessionId ? "checking" : "error");
  const [product, setProduct] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    const check = async () => {
      for (let attempt = 0; attempt < 8 && !cancelled; attempt++) {
        const response = await fetch(`/api/stripe/checkout-status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        if (response.ok) {
          const result = await response.json() as { paid: boolean; product: string | null };
          if (result.paid) {
            setProduct(result.product);
            setStatus("paid");
            return;
          }
        }
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
      }
      if (!cancelled) setStatus("error");
    };
    void check();
    return () => { cancelled = true; };
  }, [sessionId]);

  const content = {
    readiness_pack: {
      icon: Zap,
      title: "Readiness Pack confirmed!",
      sub: "Five exam credits and full analytics have been added to your account.",
      color: "text-brand-700",
      bg: "bg-brand-50",
    },
    single_exam: {
      icon: BookOpen,
      title: "Exam credit added!",
      sub: "You now have 1 additional mock exam. Head to Practice Tests to use it.",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
  }[product ?? ""] ?? {
    icon: CheckCircle2,
    title: "Payment confirmed!",
    sub: "Your purchase is being added to your account.",
    color: "text-brand-700",
    bg: "bg-brand-50",
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-4 text-center">
        <div>
          <Loader2 size={36} className="animate-spin text-brand-700 mx-auto mb-5" />
          <h1 className="text-xl font-bold text-foreground">Confirming your payment</h1>
          <p className="text-sm text-muted mt-2">This normally takes only a few seconds.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <CircleAlert size={36} className="text-amber-600 mx-auto mb-5" />
          <h1 className="text-xl font-bold text-foreground">We are still confirming your payment</h1>
          <p className="text-sm text-muted mt-2 mb-6">Your payment may still be processing. Check your dashboard before trying another purchase.</p>
          <Link href={ROUTES.dashboard} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold">
            Go to Dashboard <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

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
