-- 012_create_user_auth_accounts.sql
-- Creates a mapping between auth identities and user profiles so we can
-- associate multiple auth accounts (or auth ids) with a single users row
-- without reassigning primary keys.

CREATE TABLE IF NOT EXISTS user_auth_accounts (
  auth_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_auth_accounts_user_id ON user_auth_accounts(user_id);
