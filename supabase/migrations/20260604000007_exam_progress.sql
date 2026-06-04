-- Persist active exam progress for refresh and cross-device recovery.

ALTER TABLE exam_sessions
  ADD COLUMN IF NOT EXISTS progress JSONB,
  ADD COLUMN IF NOT EXISTS remaining_seconds INTEGER CHECK (remaining_seconds IS NULL OR remaining_seconds >= 0),
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
