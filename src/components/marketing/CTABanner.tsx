import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function CTABanner() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Start your journey to certification success
        </h2>
        <p className="text-brand-200 text-lg mb-10 max-w-xl mx-auto">
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
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-brand-500 text-white font-bold text-sm hover:bg-brand-800 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
