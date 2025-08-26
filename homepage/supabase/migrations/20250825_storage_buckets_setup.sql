-- Supabase Storage Buckets Setup
-- This migration creates storage buckets for video files and configures RLS policies

-- Note: Bucket creation must be done via Supabase Dashboard or Management API
-- This file documents the required buckets and their RLS policies

-- Required Storage Buckets:
-- 1. creator-videos (private) - Stores completed video files
-- 2. video-thumbnails (public) - Stores video thumbnail images  
-- 3. temp-recordings (private) - Temporary storage for in-progress recordings

-- After creating buckets in Supabase Dashboard, run these policies:

-- ============================================
-- POLICIES FOR 'creator-videos' BUCKET (Private)
-- ============================================

-- Allow creators to upload videos to their own folder
CREATE POLICY "Creators can upload videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'creator-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'creator'
  )
);

-- Allow creators to update their own videos
CREATE POLICY "Creators can update own videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'creator-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
) WITH CHECK (
  bucket_id = 'creator-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow creators to delete their own videos
CREATE POLICY "Creators can delete own videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'creator-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view videos they have purchased access to
CREATE POLICY "Users can view purchased videos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'creator-videos' AND
  (
    -- Creator can view their own videos
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    -- Users with video access can view
    EXISTS (
      SELECT 1 FROM public.video_access va
      JOIN public.videos v ON va.video_id = v.id
      WHERE va.user_id = auth.uid()
      AND v.storage_path = name
      AND (va.expires_at IS NULL OR va.expires_at > NOW())
    )
    OR
    -- Admins can view all videos
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  )
);

-- ============================================
-- POLICIES FOR 'video-thumbnails' BUCKET (Public Read)
-- ============================================

-- Allow creators to upload thumbnails to their folder
CREATE POLICY "Creators can upload thumbnails" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'video-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'creator'
  )
);

-- Allow creators to update their thumbnails
CREATE POLICY "Creators can update thumbnails" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'video-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
) WITH CHECK (
  bucket_id = 'video-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow creators to delete their thumbnails
CREATE POLICY "Creators can delete thumbnails" ON storage.objects
FOR DELETE USING (
  bucket_id = 'video-thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to thumbnails
CREATE POLICY "Public can view thumbnails" ON storage.objects
FOR SELECT USING (
  bucket_id = 'video-thumbnails'
);

-- ============================================
-- POLICIES FOR 'temp-recordings' BUCKET (Private)
-- ============================================

-- Allow creators to upload temporary recordings
CREATE POLICY "Creators can upload temp recordings" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'temp-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text AND
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'creator'
  )
);

-- Allow creators to view their temp recordings
CREATE POLICY "Creators can view temp recordings" ON storage.objects
FOR SELECT USING (
  bucket_id = 'temp-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow creators to delete their temp recordings
CREATE POLICY "Creators can delete temp recordings" ON storage.objects
FOR DELETE USING (
  bucket_id = 'temp-recordings' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- HELPER FUNCTIONS FOR STORAGE MANAGEMENT
-- ============================================

-- Function to generate signed URL for video access
CREATE OR REPLACE FUNCTION public.get_video_signed_url(
  p_video_id UUID,
  p_expiry_seconds INTEGER DEFAULT 3600
)
RETURNS TEXT AS $$
DECLARE
  v_storage_path TEXT;
  v_has_access BOOLEAN;
BEGIN
  -- Check if user has access to the video
  SELECT EXISTS (
    SELECT 1 FROM public.video_access
    WHERE video_id = p_video_id
    AND user_id = auth.uid()
    AND (expires_at IS NULL OR expires_at > NOW())
  ) INTO v_has_access;
  
  -- Also check if user is the creator
  IF NOT v_has_access THEN
    SELECT EXISTS (
      SELECT 1 FROM public.videos
      WHERE id = p_video_id
      AND creator_id = auth.uid()
    ) INTO v_has_access;
  END IF;
  
  IF NOT v_has_access THEN
    RAISE EXCEPTION 'Access denied to video';
  END IF;
  
  -- Get the storage path
  SELECT storage_path INTO v_storage_path
  FROM public.videos
  WHERE id = p_video_id;
  
  IF v_storage_path IS NULL THEN
    RAISE EXCEPTION 'Video not found';
  END IF;
  
  -- Return the storage path (actual signed URL generation happens in application code)
  RETURN v_storage_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up temporary recordings older than 24 hours
CREATE OR REPLACE FUNCTION public.cleanup_temp_recordings()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- This function should be called by a scheduled job
  -- It returns the count of deleted files for logging
  
  -- Note: Actual file deletion from storage needs to be handled
  -- via Supabase Edge Function or external cron job
  
  SELECT COUNT(*) INTO v_deleted_count
  FROM storage.objects
  WHERE bucket_id = 'temp-recordings'
  AND created_at < NOW() - INTERVAL '24 hours';
  
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to move video from temp to permanent storage
CREATE OR REPLACE FUNCTION public.finalize_video_upload(
  p_temp_path TEXT,
  p_final_path TEXT,
  p_request_id UUID,
  p_duration_seconds INTEGER,
  p_file_size_bytes BIGINT
)
RETURNS UUID AS $$
DECLARE
  v_video_id UUID;
  v_creator_id UUID;
BEGIN
  -- Get creator ID from request
  SELECT creator_id INTO v_creator_id
  FROM public.video_requests
  WHERE id = p_request_id;
  
  IF v_creator_id IS NULL THEN
    RAISE EXCEPTION 'Request not found';
  END IF;
  
  -- Verify the creator is making this call
  IF v_creator_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Create video record
  INSERT INTO public.videos (
    request_id,
    creator_id,
    storage_path,
    duration_seconds,
    file_size_bytes,
    is_processed
  ) VALUES (
    p_request_id,
    v_creator_id,
    p_final_path,
    p_duration_seconds,
    p_file_size_bytes,
    true
  ) RETURNING id INTO v_video_id;
  
  -- Update request status
  UPDATE public.video_requests
  SET status = 'completed',
      completed_at = NOW()
  WHERE id = p_request_id;
  
  RETURN v_video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKET CONFIGURATION NOTES
-- ============================================

-- To set up the buckets in Supabase Dashboard:
-- 
-- 1. Go to Storage section
-- 2. Create new bucket 'creator-videos':
--    - Public: FALSE
--    - File size limit: 500MB
--    - Allowed MIME types: video/mp4, video/webm, video/quicktime
--
-- 3. Create new bucket 'video-thumbnails':
--    - Public: TRUE (for CDN access)
--    - File size limit: 5MB
--    - Allowed MIME types: image/jpeg, image/png, image/webp
--
-- 4. Create new bucket 'temp-recordings':
--    - Public: FALSE
--    - File size limit: 500MB
--    - Allowed MIME types: video/mp4, video/webm
--
-- 5. Configure CORS for all buckets to allow your domain:
--    {
--      "allowedOrigins": ["https://annpale.com", "http://localhost:3000"],
--      "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
--      "allowedHeaders": ["*"],
--      "maxAge": 3600
--    }