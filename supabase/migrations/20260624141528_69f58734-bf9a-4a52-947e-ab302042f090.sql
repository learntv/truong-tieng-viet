CREATE POLICY "Public read sgk bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'sgk');