"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, ArrowRight, Zap, BookOpen, Package, Building2, Loader2 } from "lucide-react";
import { PRICING_TIERS, type PricingProductKey, ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";

const ICONS: Record<PricingProductKey, React.ElementType> = {
  free: BookOpen,
  single_exam: Package,
  readiness_pack: Zap,
  workforce: Building2,
};

interface PricingCardsProps {
  onSelect?: (product: PricingProductKey) => void;
  isLoading?: string | null;
  ctaOverride?: Partial<Record<PricingProductKey, string>>;
  showWorkforce?: boolean;
}

export default function PricingCards({
  onSelect,
  isLoading,
  ctaOverride,
  showWorkforce = true,
}: PricingCardsProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  const tiers = showWorkforce ? PRICING_TIERS : PRICING_TIERS.filter((t) => t.id !== "workforce");

  const handleClick = (productKey: PricingProductKey, pricingType: string) => {
    if (onSelect) {
      onSelect(productKey);
      return;
    }
    if (pricingType === "contact") {
      window.location.href = "mailto:hello@readymetry.com?subject=Workforce%20Plan%20Inquiry";
      return;
    }
    router.push(ROUTES.signup);
  };

  return (
    <div className={`grid gap-6 ${showWorkforce ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"} items-stretch`}>
      {tiers.map((tier, i) => {
        const Icon = ICONS[tier.productKey];
        const isHighlight = tier.highlight;
        const isHovered = hovered === tier.id;
        const loading = isLoading === tier.productKey;
        const cta = ctaOverride?.[tier.productKey] ?? tier.cta;

        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
            onMouseEnter={() => setHovered(tier.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative"
          >
            <motion.div
              animate={{ scale: isHovered && !isHighlight ? 1.02 : 1, y: isHovered && isHighlight ? -4 : 0 }}
              transition={{ duration: 0.2 }}
              className={`relative h-full rounded-3xl flex flex-col overflow-hidden border transition-shadow duration-300 ${
                isHighlight
                  ? "bg-gradient-to-br from-[#6D28D9] to-[#4c1d95] border-purple-600 shadow-[0_16px_56px_rgba(109,40,217,0.45)]"
                  : tier.id === "workforce"
                  ? "bg-[#0f0f14] border-[#2a2a38] text-white"
                  : "bg-white border-border shadow-sm hover:shadow-md"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-px left-0 right-0 flex justify-center">
                  <span className="inline-block px-4 py-1 text-[11px] font-bold bg-amber-400 text-amber-900 rounded-b-xl shadow-sm">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className={`flex flex-col flex-1 p-7 ${tier.badge ? "pt-8" : ""}`}>
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isHighlight ? "bg-white/20" : tier.id === "workforce" ? "bg-white/10" : "bg-brand-50"
                  }`}>
                    <Icon size={18} className={isHighlight || tier.id === "workforce" ? "text-white" : "text-brand-700"} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${
                      isHighlight ? "text-purple-200" : tier.id === "workforce" ? "text-gray-400" : "text-muted"
                    }`}>
                      {tier.name}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-4xl font-extrabold tracking-tight ${
                      isHighlight || tier.id === "workforce" ? "text-white" : "text-foreground"
                    }`}>
                      {tier.priceLabel}
                    </span>
                    {tier.priceNote && (
                      <span className={`text-sm ${
                        isHighlight ? "text-purple-200" : tier.id === "workforce" ? "text-gray-400" : "text-muted"
                      }`}>
                        {tier.priceNote}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tagline / Tooltip toggle */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={isHovered ? "tooltip" : "tagline"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className={`text-xs leading-relaxed mb-6 min-h-[3.5rem] ${
                      isHighlight ? "text-purple-100" : tier.id === "workforce" ? "text-gray-400" : "text-muted"
                    }`}
                  >
                    {isHovered ? tier.tooltip : tier.tagline}
                  </motion.p>
                </AnimatePresence>

                {/* Features */}
                <div className="flex flex-col gap-2.5 flex-1 mb-7">
                  {tier.features.map((feature) => {
                    const isLocked = "locked" in feature && feature.locked;
                    return (
                      <div key={feature.text} className={`flex items-start gap-2.5 ${isLocked ? "relative" : ""}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isLocked
                            ? "bg-gray-100"
                            : isHighlight
                            ? "bg-white/20"
                            : tier.id === "workforce"
                            ? "bg-white/10"
                            : "bg-brand-50"
                        }`}>
                          {isLocked ? (
                            <Lock size={8} className="text-gray-400" />
                          ) : (
                            <Check size={9} className={isHighlight || tier.id === "workforce" ? "text-white" : "text-brand-700"} />
                          )}
                        </div>
                        <span className={`text-xs leading-relaxed ${
                          isLocked
                            ? "blur-[3px] select-none text-gray-400"
                            : isHighlight
                            ? "text-purple-100"
                            : tier.id === "workforce"
                            ? "text-gray-300"
                            : "text-muted"
                        }`}>
                          {feature.text}
                        </span>
                        {isLocked && (
                          <span className="absolute left-6 top-0 text-[10px] font-medium text-gray-400 italic">locked</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleClick(tier.productKey, tier.pricingType)}
                  disabled={!!isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
                    isHighlight
                      ? "bg-white text-brand-700 hover:bg-brand-50 shadow-lg"
                      : tier.id === "workforce"
                      ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                      : tier.id === "free"
                      ? "border border-border bg-white text-foreground hover:bg-[#F5F5F8]"
                      : "bg-brand-700 text-white hover:bg-brand-800 shadow-[0_4px_14px_rgba(109,40,217,0.3)]"
                  }`}
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <>
                      {cta}
                      {tier.pricingType !== "free" && <ArrowRight size={14} />}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
