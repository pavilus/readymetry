import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function AdminLogsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
        <ArrowLeft size={14} /> Back to overview
      </Link>
      <div className="mt-8 border border-border bg-white p-8 text-center">
        <FileText size={28} className="mx-auto text-muted" />
        <h1 className="mt-4 text-xl font-bold text-foreground">Audit logs are not enabled</h1>
        <p className="mt-2 text-sm text-muted">
          Administrative activity logging will appear here after the audit log database and retention policy are added.
        </p>
      </div>
    </div>
  );
}
