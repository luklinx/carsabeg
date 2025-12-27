-- 018_canonicalize_emails.sql
-- Canonicalize `users.email` to be case-insensitive and enforce uniqueness.
-- Uses the CITEXT extension to provide case-insensitive text and preserves
-- existing values by lower-casing during the migration.

-- Enable citext
CREATE EXTENSION IF NOT EXISTS citext;

-- Convert existing email values to lower-case and change column type to CITEXT
ALTER TABLE IF EXISTS users
  ALTER COLUMN email TYPE CITEXT USING lower(email);

-- Ensure a unique index exists (case-insensitive due to citext)
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);

-- Enforce email canonicalization on future writes via trigger
CREATE OR REPLACE FUNCTION canonicalize_user_email()
RETURNS trigger AS $$
BEGIN
  IF NEW.email IS NOT NULL THEN
    NEW.email := lower(NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_canonicalize_user_email
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION canonicalize_user_email();

-- Rollback (revert to varchar) -- NOTE: rollback will lowercase values and remove citext
-- To rollback safely, you may need manual checks in production.
-- ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255) USING lower(email);
-- DROP TRIGGER IF EXISTS trg_canonicalize_user_email ON users;
-- DROP FUNCTION IF EXISTS canonicalize_user_email();
-- DROP INDEX IF EXISTS users_email_unique;
-- DROP EXTENSION IF EXISTS citext;
