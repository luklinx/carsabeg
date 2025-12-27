-- 013_rls_seller_feedback.sql
-- Enable RLS on `seller_feedback` and add policies to allow authenticated users
-- to insert feedback (only if the recorded user_email matches auth.email())

ALTER TABLE IF EXISTS seller_feedback ENABLE ROW LEVEL SECURITY;

-- Public read policy (drop before create to be idempotent)
DROP POLICY IF EXISTS "Public read feedback" ON seller_feedback;
CREATE POLICY "Public read feedback" ON seller_feedback
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert feedback, but only if their email matches
-- the user_email column we store. This prevents anonymous spoofing via API.
DROP POLICY IF EXISTS "Authenticated insert feedback" ON seller_feedback;
CREATE POLICY "Authenticated insert feedback" ON seller_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated' AND user_email = auth.email());

-- Optional: allow authenticated users to delete/update their own feedback
DROP POLICY IF EXISTS "Owner update feedback" ON seller_feedback;
CREATE POLICY "Owner update feedback" ON seller_feedback
  FOR UPDATE
  USING (user_email = auth.email())
  WITH CHECK (user_email = auth.email());

DROP POLICY IF EXISTS "Owner delete feedback" ON seller_feedback;
CREATE POLICY "Owner delete feedback" ON seller_feedback
  FOR DELETE
  USING (user_email = auth.email());
