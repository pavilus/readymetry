import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function CTABanner() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-700 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          Start your journey to certification success
        </h2>
        <p className="text-brand-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of professionals who trust Readymetry to help them pass with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ROUTES.signup}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-brand-50 transition-colors shadow-lg"
          >
            Start Free Practice
            <ArrowRight size={16} />
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-brand-400 text-white font-semibold text-sm hover:bg-brand-800 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
