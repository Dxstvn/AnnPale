-- Create avatars storage bucket for user profile pictures
-- This migration sets up the storage bucket with proper configuration and policies

-- Insert the bucket configuration
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket so avatars can be displayed without authentication
  false, -- No AVIF auto-detection needed
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif']::text[] -- Allowed image types
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies for the avatars bucket

-- Policy: Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access to all avatars (since they're profile pictures)
CREATE POLICY "Public can view all avatars" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Add comment for documentation
COMMENT ON COLUMN storage.buckets.id IS 'Storage bucket for user profile avatars';

-- Notify completion
DO $$
BEGIN
  RAISE NOTICE 'Avatars storage bucket created successfully';
  RAISE NOTICE 'Bucket: avatars';
  RAISE NOTICE 'Access: Public read, authenticated write';
  RAISE NOTICE 'File size limit: 5MB';
  RAISE NOTICE 'Allowed types: JPEG, PNG, GIF';
END $$;