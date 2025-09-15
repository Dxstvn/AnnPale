-- Create bucket for creator post images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creator-images',
  'creator-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for creator-images bucket
CREATE POLICY "Creators can upload their own images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'creator-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (role = 'creator' OR is_creator = true)
  )
);

CREATE POLICY "Images are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'creator-images');

CREATE POLICY "Creators can update their own images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'creator-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'creator-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Creators can delete their own images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'creator-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);