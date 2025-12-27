-- 017_add_seller_type_to_users.sql
-- Adds a nullable seller_type column to users so seller type can be derived from profile

ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS seller_type VARCHAR(80);

CREATE INDEX IF NOT EXISTS idx_users_seller_type ON users (seller_type);

-- Rollback
-- ALTER TABLE users DROP COLUMN IF EXISTS seller_type;
