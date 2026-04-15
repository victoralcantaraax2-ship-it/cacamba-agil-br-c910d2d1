
-- Explicit deny-all SELECT policies (RLS enabled + no policy = denied by default, but this makes intent explicit)

-- card_transactions: deny public SELECT
CREATE POLICY "Deny public read card_transactions" ON public.card_transactions
FOR SELECT USING (false);

-- complaints: deny public SELECT
CREATE POLICY "Deny public read complaints" ON public.complaints
FOR SELECT USING (false);

-- pix_leads: deny public SELECT
CREATE POLICY "Deny public read pix_leads" ON public.pix_leads
FOR SELECT USING (false);

-- admin_settings: deny public SELECT
CREATE POLICY "Deny public read admin_settings" ON public.admin_settings
FOR SELECT USING (false);
