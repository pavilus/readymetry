"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { selectStarterPlan, createCheckoutSession } from "@/lib/actions/billing";
import PricingCards from "@/components/pricing/PricingCards";
import CheckoutModal from "@/components/pricing/CheckoutModal";
import type { PricingProductKey } from "@/lib/constants";

export default function PlanPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<PricingProductKey | null>(null);

  const handleSelect = async (product: PricingProductKey) => {
    if (product === "free") {
      setLoading("free");
      try {
        await selectStarterPlan();
        window.location.href = ROUTES.dashboard;
      } catch {
        setLoading(null);
      }
      return;
    }
    if (product === "workforce") {
      window.location.href = "mailto:hello@readymetry.com?subject=Workforce%20Plan%20Inquiry";
      return;
    }
    setModalProduct(product);
  };

  const handleConfirm = async (product: PricingProductKey) => {
    if (product === "single_exam" || product === "readiness_pack") {
      setLoading(product);
      setModalProduct(null);
      try {
        await createCheckoutSession(product);
      } catch {
        setLoading(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center px-4 py-12">
      <Link href={ROUTES.home} className="mb-10">
        <Image src="/logo.png" alt="Readymetry" width={320} height={96} className="h-16 w-auto" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">Step 3 of 3</p>
        <h1 className="text-3xl font-extrabold text-foreground mb-3">Choose your plan</h1>
        <p className="text-sm text-muted max-w-md mx-auto">
          Start free or unlock premium preparation. One-time payment — no subscription.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl">
        <PricingCards
          onSelect={handleSelect}
          isLoading={loading}
          ctaOverride={{
            free: "Start Free",
            single_exam: "Buy — $39",
            readiness_pack: "Get Fully Ready — $99",
            workforce: "Contact Sales",
          }}
          showWorkforce={false}
        />
      </div>

      <p className="text-xs text-muted mt-8 text-center">
        Secure payments via Stripe · One-time purchase · Questions?{" "}
        <a href="mailto:hello@readymetry.com" className="text-brand-700 hover:underline">Contact us</a>
      </p>

      {modalProduct && modalProduct !== "free" && modalProduct !== "workforce" && (
        <CheckoutModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
