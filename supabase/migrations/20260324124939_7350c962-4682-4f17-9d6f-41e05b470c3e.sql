
-- Create complaints table
CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  description text NOT NULL,
  attachment_url text,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now(),
  admin_notes text
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert complaints
CREATE POLICY "Anyone can submit complaints" ON public.complaints
  FOR INSERT TO public WITH CHECK (true);

-- Allow anyone to read (for admin, no auth)
CREATE POLICY "Allow read complaints" ON public.complaints
  FOR SELECT TO public USING (true);

-- Allow update for admin
CREATE POLICY "Allow update complaints" ON public.complaints
  FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Create storage bucket for complaint attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-attachments', 'complaint-attachments', true);

-- Allow public uploads to complaint-attachments bucket
CREATE POLICY "Allow public upload to complaint-attachments" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'complaint-attachments');

-- Allow public read from complaint-attachments bucket
CREATE POLICY "Allow public read complaint-attachments" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'complaint-attachments');
