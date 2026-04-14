
CREATE TABLE public.pix_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT,
  plan_id TEXT,
  plan_label TEXT,
  amount NUMERIC NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'checkout',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pix_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert pix_leads" ON public.pix_leads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read pix_leads" ON public.pix_leads FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update pix_leads" ON public.pix_leads FOR UPDATE TO public USING (true) WITH CHECK (true);
