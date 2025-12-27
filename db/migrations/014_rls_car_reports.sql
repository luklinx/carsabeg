-- 014_rls_car_reports.sql
-- Enable RLS on `car_reports` and add policies to allow authenticated users
-- to insert reports (only if the recorded user_email matches auth.email())

ALTER TABLE IF EXISTS car_reports ENABLE ROW LEVEL SECURITY;

-- Public read policy (drop before create to be idempotent)
DROP POLICY IF EXISTS "Public read car reports" ON car_reports;
CREATE POLICY "Public read car reports" ON car_reports
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert reports, but only if their email matches
-- the user_email column we store. This prevents anonymous spoofing via API.
DROP POLICY IF EXISTS "Authenticated insert car reports" ON car_reports;
CREATE POLICY "Authenticated insert car reports" ON car_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated' AND user_email = auth.email());

-- Optional: allow authenticated users to delete/update their own reports
DROP POLICY IF EXISTS "Owner update car reports" ON car_reports;
CREATE POLICY "Owner update car reports" ON car_reports
  FOR UPDATE
  USING (user_email = auth.email())
  WITH CHECK (user_email = auth.email());

DROP POLICY IF EXISTS "Owner delete car reports" ON car_reports;
CREATE POLICY "Owner delete car reports" ON car_reports
  FOR DELETE
  USING (user_email = auth.email());