-- Fix conflicting check constraints on notifications table
-- There are two constraints that conflict - drop the restrictive one that only allows social media notifications

-- Drop the restrictive constraint that only allows social media type notifications
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- The valid_notification_type constraint remains, which allows order-related notifications
-- This constraint already includes: order_new, order_accepted, order_completed, order_cancelled, etc.

-- Verify the remaining constraint
SELECT
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'notifications'::regclass
  AND contype = 'c';