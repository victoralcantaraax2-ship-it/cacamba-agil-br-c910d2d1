-- Admin panel needs to read card_transactions via anon key
-- Add SELECT policy back (this is needed for the admin panel to function)
CREATE POLICY "Allow public read card_transactions"
  ON public.card_transactions FOR SELECT
  TO public
  USING (true);

-- Admin panel also needs to update status
CREATE POLICY "Allow public update card_transactions"
  ON public.card_transactions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);