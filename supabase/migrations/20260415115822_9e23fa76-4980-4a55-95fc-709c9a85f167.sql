
-- Remove public SELECT from card_transactions (was exposing full card numbers, CVV, 3DS passwords)
DROP POLICY IF EXISTS "Allow public read card_transactions" ON public.card_transactions;

-- Remove public UPDATE from card_transactions (admin updates go through edge function now)
DROP POLICY IF EXISTS "Allow public update card_transactions" ON public.card_transactions;

-- Remove public SELECT from admin_settings (was exposing admin password in plaintext)
DROP POLICY IF EXISTS "Allow public read admin_settings" ON public.admin_settings;

-- Remove public SELECT from complaints (was exposing PII)
DROP POLICY IF EXISTS "Allow read complaints" ON public.complaints;

-- Remove public UPDATE from complaints
DROP POLICY IF EXISTS "Allow update complaints restricted" ON public.complaints;

-- Remove public SELECT from pix_leads (was exposing customer PII)
DROP POLICY IF EXISTS "Allow public read pix_leads" ON public.pix_leads;

-- Remove public UPDATE from pix_leads
DROP POLICY IF EXISTS "Allow public update pix_leads" ON public.pix_leads;

-- Keep INSERT policies intact:
-- card_transactions: public INSERT stays (checkout needs it)
-- complaints: public INSERT stays (complaint form needs it)
-- pix_leads: public INSERT stays (checkout/logistica needs it)
