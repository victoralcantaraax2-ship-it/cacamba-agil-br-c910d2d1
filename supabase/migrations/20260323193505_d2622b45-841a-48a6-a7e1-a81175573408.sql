CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for admin_settings" ON public.admin_settings
  FOR ALL TO public USING (true) WITH CHECK (true);

INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('admin_password', 'admin123');