-- Create subscription_orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES creator_subscription_tiers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'cancelled', 'expired', 'failed')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  total_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  creator_earnings DECIMAL(10, 2) NOT NULL,
  stripe_subscription_id TEXT,
  stripe_checkout_session_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  last_payment_date TIMESTAMPTZ,
  last_payment_status TEXT,
  failed_payment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscription_orders_user_id ON subscription_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_creator_id ON subscription_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_tier_id ON subscription_orders(tier_id);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_status ON subscription_orders(status);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_stripe_subscription_id ON subscription_orders(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_orders_stripe_checkout_session_id ON subscription_orders(stripe_checkout_session_id);

-- Enable RLS
ALTER TABLE subscription_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscription_orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Creators can view subscriptions to their content
CREATE POLICY "Creators can view their subscriptions"
  ON subscription_orders
  FOR SELECT
  USING (auth.uid() = creator_id);

-- Service role can manage all subscriptions
CREATE POLICY "Service role can manage subscriptions"
  ON subscription_orders
  FOR ALL
  USING (auth.role() = 'service_role');

-- Users can insert their own subscriptions
CREATE POLICY "Users can create subscriptions"
  ON subscription_orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_subscription_orders_updated_at_trigger ON subscription_orders;
CREATE TRIGGER update_subscription_orders_updated_at_trigger
  BEFORE UPDATE ON subscription_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_orders_updated_at();