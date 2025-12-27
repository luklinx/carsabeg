-- 009_create_inspections_table.sql
BEGIN;

-- Ensure pgcrypto is available for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid,
  name text,
  phone text,
  preferred_time text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

COMMIT;
