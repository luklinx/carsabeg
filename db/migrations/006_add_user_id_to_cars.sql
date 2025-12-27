-- 006_add_user_id_to_cars.sql
-- Add a user_id column to cars, backfill from common owner/seller columns,
-- add an index and a foreign key to users(id).

ALTER TABLE IF EXISTS cars
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Backfill from common owner/seller candidate columns if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cars' AND column_name='owner_id') THEN
    UPDATE cars SET user_id = owner_id WHERE user_id IS NULL AND owner_id IS NOT NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cars' AND column_name='seller_id') THEN
    UPDATE cars SET user_id = seller_id WHERE user_id IS NULL AND seller_id IS NOT NULL;
  END IF;
END$$;

-- Add index for lookups
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);

-- Add foreign key constraint if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_cars_user_id' AND table_name = 'cars'
  ) THEN
    ALTER TABLE cars
    ADD CONSTRAINT fk_cars_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END$$;
