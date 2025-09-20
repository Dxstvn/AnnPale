-- Fix notifications table for real-time subscriptions
-- The table already has the correct columns, but we need to fix constraints and real-time

-- First, drop the existing check constraint if it exists
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS valid_notification_type;

-- Add a more flexible check constraint for notification types
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
    'system',  -- Added for testing
    'test'     -- Added for testing
  )
);

-- Update RLS policies to allow authenticated users to insert their own notifications
DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;

-- Allow authenticated users to insert notifications for themselves
CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ensure the table has proper replica identity for real-time
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Fix the publication for real-time
DO $$
BEGIN
  -- Remove from publication if exists
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE notifications;
  EXCEPTION
    WHEN undefined_object THEN
      -- Publication doesn't exist or table not in it, that's fine
      NULL;
  END;

  -- Add to publication
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  EXCEPTION
    WHEN undefined_object THEN
      -- Publication doesn't exist, create it
      CREATE PUBLICATION supabase_realtime FOR TABLE notifications;
  END;
END $$;

-- Grant necessary permissions for real-time
GRANT SELECT ON notifications TO anon;
GRANT SELECT ON notifications TO authenticated;
GRANT INSERT ON notifications TO authenticated;
GRANT UPDATE ON notifications TO authenticated;

-- Create or replace functions with correct schema
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, message, data, is_read)
  VALUES (p_user_id, p_type, p_message, p_data, false)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

-- Mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(
  p_user_id UUID,
  p_notification_ids UUID[] DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  IF p_notification_ids IS NULL THEN
    -- Mark all unread notifications as read
    UPDATE notifications
    SET is_read = true
    WHERE user_id = p_user_id AND is_read = false;
  ELSE
    -- Mark specific notifications as read
    UPDATE notifications
    SET is_read = true
    WHERE user_id = p_user_id
      AND id = ANY(p_notification_ids)
      AND is_read = false;
  END IF;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;