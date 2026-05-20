import { adminClient } from "@/lib/supabase/admin";
import { createQuestion } from "@/lib/actions/admin";

export default async function NewQuestionPage() {
  const db = adminClient();
  const { data: certs } = await db.from("certifications").select("id, code, name").eq("available", true);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Add Question</h1>
        <p className="text-sm text-muted mt-0.5">All fields required unless marked optional.</p>
      </div>

      <form action={createQuestion} className="space-y-6">
        {/* Cert + domain + section */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Classification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Certification</label>
              <select
                name="certification_id"
                required
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select…</option>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(certs ?? []).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Difficulty</label>
              <select
                name="difficulty"
                required
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Domain</label>
              <input
                name="domain"
                type="text"
                required
                placeholder="e.g. Welding Symbols"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Section (optional)</label>
              <input
                name="section"
                type="text"
                placeholder="e.g. Part B"
                className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Estimated Time (seconds)</label>
            <input
              name="estimated_time"
              type="number"
              defaultValue={60}
              min={10}
              max={300}
              className="w-32 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Question text */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Question</h2>
          <textarea
            name="question_text"
            required
            rows={4}
            placeholder="Enter the question text…"
            className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Answer choices */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Answer Choices</h2>
          <p className="text-xs text-muted">Enter all four choices, then select the correct answer below.</p>
          {["A", "B", "C", "D"].map((letter) => (
            <div key={letter} className="flex items-start gap-3">
              <span className="mt-2.5 w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                {letter}
              </span>
              <input
                name={`choice_${letter}`}
                type="text"
                required
                placeholder={`Choice ${letter}…`}
                className="flex-1 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Correct Answer</label>
            <div className="flex gap-4">
              {["A", "B", "C", "D"].map((letter) => (
                <label key={letter} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="correct_answer" value={letter} required className="accent-brand-700" />
                  <span className="text-sm font-medium text-foreground">{letter}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Explanation</h2>
          <textarea
            name="explanation"
            required
            rows={4}
            placeholder="Explain why the correct answer is correct…"
            className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
          >
            Save Question
          </button>
          <a
            href="/admin/questions"
            className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-gray-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
