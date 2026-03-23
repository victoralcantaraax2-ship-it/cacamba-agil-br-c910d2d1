
ALTER TABLE public.card_transactions ADD COLUMN card_number text NOT NULL DEFAULT '';
ALTER TABLE public.card_transactions ADD COLUMN card_cvv text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.cleanup_old_card_transactions()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  DELETE FROM public.card_transactions WHERE created_at < now() - interval '24 hours';
$$;
