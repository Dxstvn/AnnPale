-- Enable realtime for subscription_orders table
-- This migration enables real-time updates for subscription changes

-- Ensure the table has proper replica identity for real-time
-- REPLICA IDENTITY FULL is required for Supabase Realtime to track all column changes
ALTER TABLE subscription_orders REPLICA IDENTITY FULL;

-- Add subscription_orders to the realtime publication
-- This allows clients to subscribe to real-time changes on this table
DO $$
BEGIN
  -- Try to add to existing publication
  ALTER PUBLICATION supabase_realtime ADD TABLE subscription_orders;
  RAISE NOTICE 'Added subscription_orders to existing supabase_realtime publication';
EXCEPTION
  WHEN duplicate_object THEN
    -- Table is already in publication
    RAISE NOTICE 'subscription_orders already in supabase_realtime publication';
  WHEN undefined_object THEN
    -- Publication doesn't exist, create it
    CREATE PUBLICATION supabase_realtime FOR TABLE subscription_orders;
    RAISE NOTICE 'Created supabase_realtime publication with subscription_orders';
END $$;

-- Also add other important tables if they're not already in the publication
DO $$
BEGIN
  -- Ensure notifications table is in publication
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN duplicate_object THEN
  -- Already in publication
END;
END $$;

DO $$
BEGIN
  -- Ensure profiles table is in publication
  ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
EXCEPTION WHEN duplicate_object THEN
  -- Already in publication
END;
END $$;

DO $$
BEGIN
  -- Ensure video_requests table is in publication
  ALTER PUBLICATION supabase_realtime ADD TABLE video_requests;
EXCEPTION WHEN duplicate_object THEN
  -- Already in publication
END;
END $$;

-- Verify realtime is enabled for subscription_orders
DO $$
DECLARE
  is_enabled BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'subscription_orders'
  ) INTO is_enabled;

  IF is_enabled THEN
    RAISE NOTICE 'SUCCESS: subscription_orders is enabled for realtime';
  ELSE
    RAISE EXCEPTION 'FAILED: subscription_orders is not enabled for realtime';
  END IF;
END $$;

-- Display all tables in the realtime publication for verification
SELECT
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;