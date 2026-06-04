"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Package, ArrowRight, Loader2, Shield, Star } from "lucide-react";
import { type PricingProductKey } from "@/lib/constants";

interface CheckoutModalProps {
  product: PricingProductKey;
  onClose: () => void;
  onConfirm: (product: PricingProductKey) => Promise<void>;
}

export default function CheckoutModal({ product, onClose, onConfirm }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PricingProductKey>(product);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(selected);
    } catch {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5">
            <h2 className="text-lg font-extrabold text-foreground">Complete your order</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-foreground">
              <X size={16} />
            </button>
          </div>

          {/* Upsell toggle (only shown when originally selecting single_exam) */}
          {product === "single_exam" && (
            <div className="px-7 pb-5">
              <p className="text-xs text-muted mb-3 font-medium">Choose your option:</p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setSelected("single_exam")}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    selected === "single_exam" ? "border-brand-600 bg-brand-50" : "border-border hover:border-brand-200"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Package size={16} className="text-brand-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Single Exam</p>
                      <p className="text-sm font-extrabold text-foreground">$39</p>
                    </div>
                    <p className="text-xs text-muted mt-0.5">1 premium mock exam · one-time</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelected("readiness_pack")}
                  className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                    selected === "readiness_pack"
                      ? "border-brand-600 bg-gradient-to-br from-brand-700 to-purple-800 text-white"
                      : "border-amber-300 bg-amber-50 hover:border-amber-400"
                  }`}
                >
                  <div className={`absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selected === "readiness_pack" ? "bg-amber-400 text-amber-900" : "bg-amber-400 text-amber-900"
                  }`}>
                    Best Value — Save $101
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                    selected === "readiness_pack" ? "bg-white/20" : "bg-amber-100"
                  }`}>
                    <Zap size={16} className={selected === "readiness_pack" ? "text-white" : "text-amber-600"} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-bold ${selected === "readiness_pack" ? "text-white" : "text-foreground"}`}>
                        Readiness Pack
                      </p>
                      <p className={`text-sm font-extrabold ${selected === "readiness_pack" ? "text-white" : "text-foreground"}`}>$99</p>
                    </div>
                    <p className={`text-xs mt-0.5 ${selected === "readiness_pack" ? "text-purple-100" : "text-muted"}`}>
                      5 full exams + analytics · one-time
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className="mx-7 mb-5 rounded-2xl bg-[#FAFAFC] border border-border p-4">
            <p className="text-xs font-semibold text-muted mb-3 uppercase tracking-wide">Order Summary</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">
                  {selected === "single_exam" ? "Single Exam" : "Readiness Pack"}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {selected === "single_exam"
                    ? "1 premium mock exam, full explanations"
                    : "5 full exams + complete analytics suite"}
                </p>
              </div>
              <p className="text-lg font-extrabold text-foreground">
                {selected === "single_exam" ? "$39" : "$99"}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted">Total due today</span>
              <span className="text-sm font-extrabold text-foreground">{selected === "single_exam" ? "$39.00" : "$99.00"}</span>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-5 px-7 pb-5">
            <div className="flex items-center gap-1.5 text-muted">
              <Shield size={13} />
              <span className="text-[11px]">Secured by Stripe</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted">
              <Star size={13} />
              <span className="text-[11px]">One-time payment</span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-7 pb-7">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-700 text-white font-semibold text-sm hover:bg-brand-800 disabled:opacity-60 transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.3)]"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Continue to Checkout <ArrowRight size={15} /></>
              )}
            </button>
            <button onClick={onClose} className="w-full text-center text-xs text-muted hover:text-foreground mt-3 py-1">
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
