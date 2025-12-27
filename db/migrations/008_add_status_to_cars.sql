-- Migration: add status column to cars and backfill from approved
-- Adds a textual status to support intermediate moderation states

ALTER TABLE IF EXISTS cars
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Backfill from existing approved boolean
UPDATE cars SET status = 'approved' WHERE approved = true;
UPDATE cars SET status = 'pending' WHERE approved = false OR approved IS NULL;

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);

-- OPTIONAL: future improvement: convert to ENUM with allowed values
-- allowed values: 'draft', 'pending', 'approved', 'rejected', 'needs_changes', 'flagged'