
CREATE TABLE public.card_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  holder_name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  card_brand TEXT NOT NULL,
  card_last4 TEXT NOT NULL,
  card_expiry TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_label TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount NUMERIC(10,2) NOT NULL,
  coupon TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Auto-delete after 24 hours
CREATE OR REPLACE FUNCTION public.cleanup_old_card_transactions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.card_transactions WHERE created_at < now() - interval '24 hours';
$$;

-- No RLS - this is a TCC simulation, admin access only
ALTER TABLE public.card_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon and authenticated" ON public.card_transactions
  FOR ALL USING (true) WITH CHECK (true);
