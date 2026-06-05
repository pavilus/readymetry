-- Keep current edition-specific codebook questions distinct from the core CWI pool.

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS question_pool TEXT NOT NULL DEFAULT 'cwi_core'
    CHECK (question_pool IN ('cwi_core', 'd1_1_2020')),
  ADD COLUMN IF NOT EXISTS source_url TEXT;

ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_source_kind_check;
ALTER TABLE questions
  ADD CONSTRAINT questions_source_kind_check
  CHECK (source_kind IN ('official_outline', 'general_reference', 'licensed_standard', 'third_party_reference'));

CREATE INDEX IF NOT EXISTS questions_pool_selection_idx
  ON questions(certification_id, question_pool, review_status, exam_part, category, difficulty);
