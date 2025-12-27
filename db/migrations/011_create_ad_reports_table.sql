-- 011_create_ad_reports_table.sql
-- Create table to store user reports about ads

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ad_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL,
  reason TEXT NOT NULL,
  reporter VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foreign key reference to cars(id)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cars') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'fk_ad_reports_car_id' AND table_name = 'ad_reports'
    ) THEN
      ALTER TABLE ad_reports
      ADD CONSTRAINT fk_ad_reports_car_id FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_ad_reports_car_id ON ad_reports(car_id);
