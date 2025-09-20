-- Final fix for notifications real-time
-- Include all existing types and fix real-time configuration

-- First update any 'follow' types to 'system' for consistency
UPDATE notifications SET type = 'system' WHERE type = 'follow';

-- Now add the constraint
ALTER TABLE notifications ADD CONSTRAINT valid_notification_type CHECK (
  type IS NULL OR type IN (
    'order_new',
    'order_accepted',
    'order_completed',
    'order_cancelled',
    'payment_received',
    'payment_failed',
    'review_received',
    'message_received',
    'subscription_started',
    'subscription_ended',
    'system_announcement',
    'system',
    'follow',
    'test'
  )
);

-- Ensure proper RLS for INSERT
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Make sure real-time is enabled
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Ensure publication is set up correctly
DO $$
BEGIN
  -- Try to add to existing publication
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION
  WHEN duplicate_object THEN
    -- Table already in publication, that's fine
    NULL;
  WHEN undefined_object THEN
    -- Publication doesn't exist, create it
    CREATE PUBLICATION supabase_realtime FOR TABLE notifications;
END $$;

-- Grant all necessary permissions
GRANT ALL ON notifications TO authenticated;
GRANT SELECT ON notifications TO anon;