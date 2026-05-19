ALTER TABLE weekly_reviews
  DROP COLUMN IF EXISTS coaching_notes,
  DROP COLUMN IF EXISTS quality_added,
  ADD COLUMN IF NOT EXISTS pride_note text;
