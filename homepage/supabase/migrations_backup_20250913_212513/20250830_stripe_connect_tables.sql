-- Add Stripe account ID to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT false;

-- Create index for Stripe account lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON profiles(stripe_account_id);

-- Create transactions table for tracking all payments
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255),
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_id VARCHAR(255),
  
  -- Financial details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  platform_fee DECIMAL(10, 2),
  creator_earnings DECIMAL(10, 2),
  
  -- Refund tracking
  refund_amount DECIMAL(10, 2),
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Transaction details
  type VARCHAR(50) CHECK (type IN ('video', 'subscription', 'tip', 'gift')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
  
  -- Related entities
  video_request_id UUID REFERENCES video_requests(id) ON DELETE SET NULL,
  subscription_id UUID,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for transactions
CREATE INDEX idx_transactions_creator_id ON transactions(creator_id);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Create subscriptions table for recurring payments
CREATE TABLE IF NOT EXISTS creator_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  fan_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES creator_subscription_tiers(id) ON DELETE SET NULL,
  
  -- Subscription details
  tier_name VARCHAR(255),
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  interval VARCHAR(20) CHECK (interval IN ('month', 'year', 'week')),
  
  -- Status tracking
  status VARCHAR(50) CHECK (status IN ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid')),
  
  -- Billing periods
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for subscriptions
CREATE INDEX idx_creator_subscriptions_creator_id ON creator_subscriptions(creator_id);
CREATE INDEX idx_creator_subscriptions_fan_id ON creator_subscriptions(fan_id);
CREATE INDEX idx_creator_subscriptions_status ON creator_subscriptions(status);
CREATE INDEX idx_creator_subscriptions_tier_id ON creator_subscriptions(tier_id);

-- Create payout tracking table
CREATE TABLE IF NOT EXISTS creator_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_payout_id VARCHAR(255) UNIQUE,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Payout details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Status
  status VARCHAR(50) CHECK (status IN ('pending', 'in_transit', 'paid', 'failed', 'canceled')),
  
  -- Banking details (encrypted)
  arrival_date DATE,
  method VARCHAR(50),
  
  -- Period this payout covers
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  transaction_count INTEGER DEFAULT 0,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create index for payouts
CREATE INDEX idx_creator_payouts_creator_id ON creator_payouts(creator_id);
CREATE INDEX idx_creator_payouts_status ON creator_payouts(status);
CREATE INDEX idx_creator_payouts_created_at ON creator_payouts(created_at DESC);

-- Create earnings summary view for creators
CREATE OR REPLACE VIEW creator_earnings_summary AS
SELECT 
  t.creator_id,
  COUNT(DISTINCT t.id) as total_transactions,
  COUNT(DISTINCT t.id) FILTER (WHERE t.type = 'video') as video_sales,
  COUNT(DISTINCT cs.id) as active_subscriptions,
  COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) as gross_revenue,
  COALESCE(SUM(t.platform_fee) FILTER (WHERE t.status = 'completed'), 0) as total_platform_fees,
  COALESCE(SUM(t.creator_earnings) FILTER (WHERE t.status = 'completed'), 0) as net_earnings,
  COALESCE(SUM(t.refund_amount), 0) as total_refunds,
  DATE_TRUNC('month', CURRENT_DATE) as current_month,
  COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed' AND t.created_at >= DATE_TRUNC('month', CURRENT_DATE)), 0) as month_revenue,
  COALESCE(SUM(t.creator_earnings) FILTER (WHERE t.status = 'completed' AND t.created_at >= DATE_TRUNC('month', CURRENT_DATE)), 0) as month_earnings
FROM transactions t
LEFT JOIN creator_subscriptions cs ON cs.creator_id = t.creator_id AND cs.status = 'active'
WHERE t.creator_id IS NOT NULL
GROUP BY t.creator_id;

-- Create RLS policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own transactions" ON transactions
  FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Customers can view their own transactions" ON transactions
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT fan_id FROM video_requests WHERE id = video_request_id
    )
  );

CREATE POLICY "Service role can manage transactions" ON transactions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create RLS policies for subscriptions
ALTER TABLE creator_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON creator_subscriptions
  FOR SELECT
  USING (auth.uid() = fan_id OR auth.uid() = creator_id);

CREATE POLICY "Users can cancel their own subscriptions" ON creator_subscriptions
  FOR UPDATE
  USING (auth.uid() = fan_id)
  WITH CHECK (auth.uid() = fan_id);

CREATE POLICY "Service role can manage subscriptions" ON creator_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create RLS policies for payouts
ALTER TABLE creator_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own payouts" ON creator_payouts
  FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Service role can manage payouts" ON creator_payouts
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_subscriptions_updated_at BEFORE UPDATE ON creator_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();