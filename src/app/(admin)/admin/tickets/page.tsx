import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function AdminTicketsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft size={14} /> Back to overview
      </Link>
      <div className="mt-8 border border-border bg-white p-8 text-center">
        <MessageSquare size={28} className="mx-auto text-muted" />
        <h1 className="mt-4 text-xl font-bold text-foreground">Support tickets are not enabled</h1>
        <p className="mt-2 text-sm text-muted">
          This page will become available after the support ticket database and customer support workflow are added.
        </p>
      </div>
    </div>
  );
}
