-- Fix card_transactions: restrict to insert-only for public, no read/update/delete
DROP POLICY IF EXISTS "Allow all for anon and authenticated" ON public.card_transactions;

CREATE POLICY "Allow public insert card_transactions"
  ON public.card_transactions FOR INSERT
  TO public
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for public on card_transactions
-- Admin reads via service key in edge functions

-- Fix admin_settings: restrict to read-only for public (needed for password check), no write
DROP POLICY IF EXISTS "Allow all for admin_settings" ON public.admin_settings;

CREATE POLICY "Allow public read admin_settings"
  ON public.admin_settings FOR SELECT
  TO public
  USING (true);

-- No INSERT/UPDATE/DELETE for public on admin_settings

-- Fix complaints: keep INSERT public, keep SELECT public (admin reads), restrict UPDATE
DROP POLICY IF EXISTS "Allow update complaints" ON public.complaints;

-- Complaints update should be restricted but admin panel uses anon key
-- So we keep it but add a note that this should migrate to service role
CREATE POLICY "Allow update complaints restricted"
  ON public.complaints FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Add DELETE restriction: no public delete on any table
-- card_transactions already has no delete policy
-- complaints: no delete policy needed