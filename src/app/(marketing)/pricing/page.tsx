"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import PricingCards from "@/components/pricing/PricingCards";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import CheckoutModal from "@/components/pricing/CheckoutModal";
import { type PricingProductKey, ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { createCheckoutSession } from "@/lib/actions/billing";

const FAQ = [
  {
    q: "What happens after my free exam?",
    a: "After your 1 free mock exam, you can purchase a Single Exam credit ($39 one-time) or upgrade to the Readiness Pack for 5 exams plus full analytics. No subscription required.",
  },
  {
    q: "Are these real exam simulations?",
    a: "Yes. Our question banks are built from AWS CWI exam domains and modeled after the actual certification format, including difficulty calibration and timed conditions.",
  },
  {
    q: "What analytics do I get with the Readiness Pack?",
    a: "Full readiness analytics include: pass probability score, skill radar chart, weak area breakdowns, confidence tracking, adaptive improvement recommendations, and detailed session history.",
  },
  {
    q: "Can I buy just one more exam after the free one?",
    a: "Yes — the Single Exam option ($39) gives you one premium mock exam with full explanations and detailed review. No lock-in.",
  },
  {
    q: "What is the Workforce plan?",
    a: "Workforce is for organizations training 15+ employees for certification. It includes team dashboards, compliance reporting, exportable analytics, and admin controls. Contact us for pricing.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you encounter a technical issue that prevents you from completing your purchased exam, reach out to hello@readymetry.com within 7 days and we'll make it right.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        {open ? <ChevronUp size={16} className="text-muted shrink-0" /> : <ChevronDown size={16} className="text-muted shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <p className="text-sm text-muted pb-5 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [modalProduct, setModalProduct] = useState<PricingProductKey | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelect = (product: PricingProductKey) => {
    if (product === "free") {
      router.push(ROUTES.signup);
      return;
    }
    if (product === "workforce") {
      window.location.href = "mailto:hello@readymetry.com?subject=Workforce%20Plan%20Inquiry";
      return;
    }
    setModalProduct(product);
  };

  const handleConfirm = async (product: PricingProductKey) => {
    if (product === "free") {
      router.push(ROUTES.signup);
      return;
    }
    setLoadingPlan(product);
    setModalProduct(null);
    try {
      // If user is not signed in, they'll be redirected to login by the server action
      if (product === "single_exam" || product === "readiness_pack") {
        await createCheckoutSession(product);
      }
    } catch {
      router.push(ROUTES.signup);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFC]">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-3">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5 leading-tight">
              Built for professionals who take certification seriously
            </h1>
            <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed">
              Start free. Buy what you need. No subscriptions, no lock-in.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto mb-24">
          <PricingCards
            onSelect={handleSelect}
            isLoading={loadingPlan}
          />
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-extrabold text-foreground mb-2">Compare plans</h2>
            <p className="text-sm text-muted">See exactly what&apos;s included at each level.</p>
          </motion.div>
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
            <ComparisonTable />
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-extrabold text-foreground mb-8 text-center">Frequently asked questions</h2>
          <div className="bg-white rounded-2xl border border-border px-6 divide-y divide-border shadow-sm">
            {FAQ.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-brand-700 to-purple-800 rounded-3xl p-10 text-white shadow-[0_16px_56px_rgba(109,40,217,0.35)]">
            <h2 className="text-2xl font-extrabold mb-3">Ready to start?</h2>
            <p className="text-purple-100 text-sm mb-7 max-w-md mx-auto leading-relaxed">
              Your first mock exam is free. No credit card required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push(ROUTES.signup)}
                className="px-7 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-brand-50 transition-colors shadow-lg"
              >
                Start Free
              </button>
              <button
                onClick={() => setModalProduct("single_exam")}
                className="px-7 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Buy Single Exam — $39
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />

      {/* Checkout Modal */}
      {modalProduct && modalProduct !== "free" && modalProduct !== "workforce" && (
        <CheckoutModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
