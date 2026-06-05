-- Add editorial metadata so question-bank growth does not bypass review.

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS exam_part TEXT NOT NULL DEFAULT 'A'
    CHECK (exam_part IN ('A', 'B', 'C')),
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'needs_review'
    CHECK (review_status IN ('draft', 'needs_review', 'published', 'retired')),
  ADD COLUMN IF NOT EXISTS source_kind TEXT NOT NULL DEFAULT 'general_reference'
    CHECK (source_kind IN ('official_outline', 'general_reference', 'licensed_standard')),
  ADD COLUMN IF NOT EXISTS source_edition TEXT;

-- Preserve the current live pool while making its review debt visible.
UPDATE questions
SET review_status = 'published'
WHERE review_status = 'needs_review';

CREATE INDEX IF NOT EXISTS questions_bank_selection_idx
  ON questions(certification_id, review_status, exam_part, category, difficulty);

UPDATE certifications
SET description = 'Three-part AWS CWI assessment: Part A Fundamentals, Part B Practical, and Part C Code Book'
WHERE code = 'AWS CWI';
