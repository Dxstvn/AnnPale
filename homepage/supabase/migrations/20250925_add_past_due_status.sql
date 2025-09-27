-- Add 'past_due' status to subscription_orders status constraint
ALTER TABLE subscription_orders DROP CONSTRAINT IF EXISTS subscription_orders_status_check;

ALTER TABLE subscription_orders ADD CONSTRAINT subscription_orders_status_check
CHECK (status IN ('pending', 'processing', 'active', 'paused', 'cancelled', 'expired', 'failed', 'trialing', 'past_due'));