-- Add views_count column to cars
ALTER TABLE IF EXISTS cars
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0 NOT NULL;

-- Backfill NULLs just in case
UPDATE cars SET views_count = 0 WHERE views_count IS NULL;
