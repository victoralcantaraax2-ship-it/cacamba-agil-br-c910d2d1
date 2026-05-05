UPDATE storage.buckets SET public = false WHERE id = 'complaint-attachments';

DROP POLICY IF EXISTS "Public read complaint attachments" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload complaint attachments" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload complaint attachments" ON storage.objects;

CREATE POLICY "Public can upload complaint attachments"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'complaint-attachments');