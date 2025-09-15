-- Add video-related fields to orders table for video request fulfillment
-- This migration adds the necessary columns to support the video upload and delivery workflow

-- Add video-related columns to the orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS video_metadata JSONB DEFAULT '{}';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS video_uploaded_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS video_duration INTEGER; -- Duration in seconds
ALTER TABLE orders ADD COLUMN IF NOT EXISTS video_size BIGINT; -- File size in bytes

-- Update the status enum to include proper video workflow statuses
-- Note: We'll update the status transitions through application logic instead of enum constraints
-- This allows more flexibility for future status changes

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_video_url ON orders(video_url) WHERE video_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_status_video_uploaded ON orders(status, video_uploaded_at);

-- Add a comment to document the video workflow statuses
COMMENT ON COLUMN orders.status IS 'Order status: pending (waiting for creator acceptance), accepted (creator accepted, ready to record), in_progress (creator is recording/uploading), completed (video delivered), cancelled, refunded';

-- Create a storage bucket for video files if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('video-requests', 'video-requests', false)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the video storage bucket
CREATE POLICY "Users can upload videos for their orders"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'video-requests' 
  AND auth.role() = 'authenticated'
  AND (
    -- Allow creators to upload videos for orders they own
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.creator_id = auth.uid()
      AND orders.id::text = (storage.foldername(name))[1]
    )
  )
);

CREATE POLICY "Users can view videos for their orders"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'video-requests' 
  AND auth.role() = 'authenticated'
  AND (
    -- Allow creators and fans to view videos for their orders
    EXISTS (
      SELECT 1 FROM orders 
      WHERE (orders.creator_id = auth.uid() OR orders.user_id = auth.uid())
      AND orders.id::text = (storage.foldername(name))[1]
    )
  )
);

CREATE POLICY "Creators can update video files for their orders"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'video-requests'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.creator_id = auth.uid()
    AND orders.id::text = (storage.foldername(name))[1]
  )
);

-- Update existing orders table RLS policies to include video-related operations
-- Service role policy should already exist, but ensure it covers video fields
DO $$
BEGIN
  -- Create or replace the service role policy for orders to include video operations
  DROP POLICY IF EXISTS "orders_service_policy" ON orders;
  CREATE POLICY "orders_service_policy" ON orders
    FOR ALL TO service_role USING (true) WITH CHECK (true);
    
  -- Ensure authenticated users can update video fields for their orders
  DROP POLICY IF EXISTS "orders_creators_can_update" ON orders;
  CREATE POLICY "orders_creators_can_update" ON orders
    FOR UPDATE TO authenticated 
    USING (auth.uid() = creator_id) 
    WITH CHECK (auth.uid() = creator_id);
END $$;