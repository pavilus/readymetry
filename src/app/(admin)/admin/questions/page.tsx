import Link from "next/link";
import { adminClient } from "@/lib/supabase/admin";
import { toggleQuestionActive } from "@/lib/actions/admin";
import { Plus } from "lucide-react";

const DIFF_COLORS: Record<string, string> = {
  easy:   "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard:   "bg-red-100 text-red-700",
};

export default async function AdminQuestionsPage() {
  const db = adminClient();
  const { data: questions } = await db
    .from("questions")
    .select("id, certification_id, domain, section, difficulty, question_text, active, created_at, certifications(code)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Question Bank</h1>
          <p className="text-sm text-muted mt-0.5">{(questions ?? []).length} questions</p>
        </div>
        <Link
          href="/admin/questions/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
        >
          <Plus size={15} /> Add Question
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5FA] border-b border-border">
            <tr className="text-left text-xs text-muted">
              <th className="px-5 py-3 font-medium">Question</th>
              <th className="px-5 py-3 font-medium">Cert</th>
              <th className="px-5 py-3 font-medium">Domain</th>
              <th className="px-5 py-3 font-medium">Difficulty</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(questions ?? []).map((q: any) => (
              <tr key={q.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3 max-w-xs">
                  <p className="text-foreground truncate">{q.question_text}</p>
                  <p className="text-[11px] text-muted mt-0.5">{q.section ?? "—"}</p>
                </td>
                <td className="px-5 py-3 text-xs font-medium text-foreground">
                  {(q.certifications as { code: string } | null)?.code ?? "—"}
                </td>
                <td className="px-5 py-3 text-xs text-muted">{q.domain}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${DIFF_COLORS[q.difficulty] ?? ""}`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${q.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {q.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <form action={async () => {
                    "use server";
                    await toggleQuestionActive(q.id, !q.active);
                  }}>
                    <button
                      type="submit"
                      className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                        q.active
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {q.active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(questions ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted">
                  No questions yet. <Link href="/admin/questions/new" className="text-brand-700 font-medium underline">Add the first one.</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
