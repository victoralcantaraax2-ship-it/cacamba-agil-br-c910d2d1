INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('active_gateway', 'blackcat')
ON CONFLICT DO NOTHING;