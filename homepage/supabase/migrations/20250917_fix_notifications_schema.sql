-- Fix notifications table schema to match the code expectations
-- The code expects: is_read (boolean), data (jsonb), no title column required

-- First, drop the existing check constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS valid_notification_type;

-- Add the new columns we need
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS post_id UUID;

-- Update existing data to migrate from old schema to new
UPDATE notifications
SET
  is_read = CASE WHEN read_at IS NOT NULL THEN true ELSE false END,
  data = COALESCE(metadata, '{}')
WHERE is_read IS NULL;

-- Now we can safely drop the old columns
ALTER TABLE notifications
  DROP COLUMN IF EXISTS title,
  DROP COLUMN IF EXISTS read_at,
  DROP COLUMN IF EXISTS metadata;

-- Make message nullable since code sometimes doesn't provide it
ALTER TABLE notifications ALTER COLUMN message DROP NOT NULL;

-- Add a more flexible check constraint for notification types
ALTER TABLE notifications ADD CONSTRAINT valid_notification_type CHECK (
  type IN (
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

-- Also allow service role to insert for any user (for system notifications)
CREATE POLICY "Service role can insert notifications" ON notifications
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- Ensure the table has proper replica identity for real-time
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Re-add the table to the real-time publication (idempotent)
DO $$
BEGIN
  -- Check if publication exists
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Remove and re-add to ensure clean state
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS notifications;
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  ELSE
    -- Create publication if it doesn't exist
    CREATE PUBLICATION supabase_realtime FOR TABLE notifications;
  END IF;
END $$;

-- Grant necessary permissions for real-time
GRANT SELECT ON notifications TO anon;
GRANT SELECT ON notifications TO authenticated;
GRANT INSERT ON notifications TO authenticated;

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_is_read
  ON notifications(user_id, is_read)
  WHERE is_read = false;

-- Update the functions to work with new schema
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

-- Update mark as read function
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

-- Update unread count function
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM notifications
  WHERE user_id = p_user_id AND is_read = false;

  RETURN COALESCE(v_count, 0);
END;
$$;

-- Clean up old read notifications function
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE is_read = true
    AND created_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;