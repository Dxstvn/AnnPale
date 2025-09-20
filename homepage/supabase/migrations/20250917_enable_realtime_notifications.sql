-- Enable real-time for notifications table
-- This allows the SSE subscription to receive real-time updates

-- Add the notifications table to real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Ensure proper RLS policies for real-time
-- Real-time will respect the existing RLS policies we have on the notifications table

-- Grant necessary permissions for real-time
GRANT SELECT ON notifications TO anon;
GRANT SELECT ON notifications TO authenticated;

-- Note: The existing RLS policies will ensure users only see their own notifications
-- even through real-time subscriptions