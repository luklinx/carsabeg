-- Migration: 016_add_regional_specs.sql
-- Adds canonical regional/spec fields used for filtering and display

BEGIN;

ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS seller_type TEXT,
  ADD COLUMN IF NOT EXISTS body_type TEXT,
  ADD COLUMN IF NOT EXISTS exterior_color TEXT,
  ADD COLUMN IF NOT EXISTS interior_color TEXT,
  ADD COLUMN IF NOT EXISTS market TEXT,
  ADD COLUMN IF NOT EXISTS specs JSONB;

-- Lightweight B-tree indexes for equality filters
CREATE INDEX IF NOT EXISTS idx_cars_seller_type ON cars(seller_type);
CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type);
CREATE INDEX IF NOT EXISTS idx_cars_exterior_color ON cars(exterior_color);
CREATE INDEX IF NOT EXISTS idx_cars_interior_color ON cars(interior_color);
CREATE INDEX IF NOT EXISTS idx_cars_market ON cars(market);

-- Optionally create trigram indexes for partial matching on body & colors
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_cars_body_type_trgm ON cars USING gin (body_type gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cars_exterior_color_trgm ON cars USING gin (exterior_color gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cars_interior_color_trgm ON cars USING gin (interior_color gin_trgm_ops);

COMMIT;

-- DOWN
-- To rollback:
-- ALTER TABLE cars DROP COLUMN IF EXISTS specs, DROP COLUMN IF EXISTS market, DROP COLUMN IF EXISTS interior_color, DROP COLUMN IF EXISTS exterior_color, DROP COLUMN IF EXISTS body_type, DROP COLUMN IF EXISTS seller_type;
-- DROP INDEX IF EXISTS idx_cars_seller_type;
-- DROP INDEX IF EXISTS idx_cars_body_type;
-- DROP INDEX IF EXISTS idx_cars_exterior_color;
-- DROP INDEX IF EXISTS idx_cars_interior_color;
-- DROP INDEX IF EXISTS idx_cars_market;
-- DROP INDEX IF EXISTS idx_cars_body_type_trgm;
-- DROP INDEX IF EXISTS idx_cars_exterior_color_trgm;
-- DROP INDEX IF EXISTS idx_cars_interior_color_trgm;