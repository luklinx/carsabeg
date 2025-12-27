-- Migration: create admins table
-- Creates a simple allowlist of admin emails for server-side checks

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins ((lower(email)));
