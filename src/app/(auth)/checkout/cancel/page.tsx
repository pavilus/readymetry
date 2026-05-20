import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <XCircle size={36} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-3">Payment cancelled</h1>
        <p className="text-sm text-muted mb-8">No charges were made. You can choose a plan whenever you&apos;re ready.</p>
        <Link
          href={ROUTES.plan}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Plans
        </Link>
      </div>
    </div>
  );
}
