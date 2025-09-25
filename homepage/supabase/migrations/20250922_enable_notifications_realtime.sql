-- =========================================
-- ENABLE REAL-TIME FOR NOTIFICATIONS TABLE
-- =========================================
-- This migration ensures real-time is properly enabled for notifications

-- First, ensure the notifications table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'notifications'
  ) THEN
    RAISE EXCEPTION 'Notifications table does not exist';
  END IF;
END $$;

-- Drop existing publication if it exists and recreate
DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
CREATE PUBLICATION supabase_realtime;

-- Add notifications table to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Also add other tables that should have real-time (if they exist)
DO $$
BEGIN
  -- Add profiles table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;

  -- Add video_requests table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'video_requests') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.video_requests;
  END IF;

  -- Add posts table if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  END IF;
END $$;

-- Ensure replica identity is set for real-time
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Grant necessary permissions for real-time
GRANT SELECT ON public.notifications TO anon;
GRANT SELECT ON public.notifications TO authenticated;

-- Create or update RLS policy for real-time subscriptions
-- Users should be able to subscribe to their own notifications
DROP POLICY IF EXISTS "Enable real-time for own notifications" ON public.notifications;
CREATE POLICY "Enable real-time for own notifications" ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Verify the configuration
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  -- Check if notifications is in the publication
  SELECT COUNT(*) INTO table_count
  FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime'
  AND schemaname = 'public'
  AND tablename = 'notifications';

  IF table_count = 0 THEN
    RAISE WARNING 'Notifications table not added to real-time publication';
  ELSE
    RAISE NOTICE 'Notifications table successfully added to real-time publication';
  END IF;
END $$;

-- Add a comment for documentation
COMMENT ON TABLE public.notifications IS 'User notifications with real-time support enabled';