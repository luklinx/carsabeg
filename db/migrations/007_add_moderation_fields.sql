-- Migration: add moderation/audit fields to cars
-- Adds approved_by, approved_at, and moderation_notes

ALTER TABLE IF EXISTS cars
  ADD COLUMN IF NOT EXISTS approved_by UUID NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS moderation_notes TEXT NULL;

-- Add foreign key constraint to users table if it exists (safe check)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'users' AND relkind = 'r')
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_cars_approved_by_users') THEN
    ALTER TABLE cars ADD CONSTRAINT fk_cars_approved_by_users FOREIGN KEY (approved_by) REFERENCES users(id);
  END IF;
END$$;

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_cars_approved_at ON cars(approved_at);
CREATE INDEX IF NOT EXISTS idx_cars_approved_by ON cars(approved_by);