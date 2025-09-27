-- =========================================
-- FIX REALTIME FOR NOTIFICATIONS TABLE
-- =========================================
-- Run this in Supabase SQL Editor to fix realtime issues

-- 1. Drop and recreate the publication
DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
CREATE PUBLICATION supabase_realtime;

-- 2. Add notifications table to publication
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 3. Set replica identity to FULL (required for realtime)
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- 4. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON notifications TO anon, authenticated;

-- 5. Ensure RLS is enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 6. Create or replace the RLS policy for SELECT
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- 7. Create policy for realtime subscriptions
DROP POLICY IF EXISTS "Enable realtime for own notifications" ON notifications;
CREATE POLICY "Enable realtime for own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- 8. Verify the setup
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime'
  AND schemaname = 'public'
  AND tablename = 'notifications';

  IF table_count = 0 THEN
    RAISE EXCEPTION 'Notifications table not added to realtime publication';
  ELSE
    RAISE NOTICE 'Success: Notifications table is in realtime publication';
  END IF;
END $$;

-- 9. Test by checking if realtime is enabled
SELECT
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename = 'notifications';