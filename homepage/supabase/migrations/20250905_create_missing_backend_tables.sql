-- Ann Pale Backend Integration: Missing Database Tables
-- This migration creates the critical tables needed for backend coordination
-- Author: Claude Code Integration Plan
-- Date: 2025-09-05

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- payment_intents table (Stripe payment tracking)
CREATE TABLE IF NOT EXISTS payment_intents (
  id VARCHAR PRIMARY KEY, -- Stripe payment intent ID
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(50) NOT NULL, -- requires_payment_method, requires_confirmation, requires_action, processing, requires_capture, canceled, succeeded
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- orders table (Video request orders after payment)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_request_id UUID REFERENCES video_requests(id) ON DELETE CASCADE,
  payment_intent_id VARCHAR REFERENCES payment_intents(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  platform_fee DECIMAL(10,2) NOT NULL, -- 30% platform fee
  creator_earnings DECIMAL(10,2) NOT NULL, -- 70% creator earnings
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, accepted, in_progress, completed, cancelled, refunded
  metadata JSONB DEFAULT '{}',
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- stripe_accounts table (Creator payout accounts)
CREATE TABLE IF NOT EXISTS stripe_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_account_id VARCHAR NOT NULL UNIQUE,
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  onboarding_complete BOOLEAN DEFAULT false,
  requirements_currently_due TEXT[], -- Array of required fields
  requirements_eventually_due TEXT[], -- Array of eventually required fields
  requirements_past_due TEXT[], -- Array of past due requirements
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- video_uploads table
CREATE TABLE IF NOT EXISTS video_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  video_url TEXT, -- Supabase storage URL
  thumbnail_url TEXT, -- Generated thumbnail URL
  duration INTEGER, -- Duration in seconds
  size_bytes BIGINT,
  processing_status VARCHAR(50) DEFAULT 'uploading', -- uploading, processing, ready, failed
  processing_error TEXT, -- Error message if processing failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- payments table (Track all transactions and splits)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  stripe_payment_id VARCHAR NOT NULL, -- Stripe charge ID
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  creator_earnings DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL, -- succeeded, pending, failed, refunded
  stripe_fee DECIMAL(10,2), -- Stripe processing fee
  net_platform_fee DECIMAL(10,2), -- Platform fee minus Stripe fee
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_creator_id ON payment_intents(creator_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_creator_id ON orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_stripe_accounts_creator_id ON stripe_accounts(creator_id);
CREATE INDEX IF NOT EXISTS idx_stripe_accounts_stripe_account_id ON stripe_accounts(stripe_account_id);

CREATE INDEX IF NOT EXISTS idx_video_uploads_order_id ON video_uploads(order_id);
CREATE INDEX IF NOT EXISTS idx_video_uploads_creator_id ON video_uploads(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_uploads_processing_status ON video_uploads(processing_status);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Add Row Level Security (RLS) policies

-- payment_intents RLS
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment intents" ON payment_intents
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can manage payment intents" ON payment_intents
  FOR ALL USING (auth.role() = 'service_role');

-- orders RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Creators can update their orders" ON orders
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- stripe_accounts RLS  
ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their stripe accounts" ON stripe_accounts
  FOR SELECT USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Creators can update their stripe accounts" ON stripe_accounts
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Service role can manage stripe accounts" ON stripe_accounts
  FOR ALL USING (auth.role() = 'service_role');

-- video_uploads RLS
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view videos from their orders" ON video_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = video_uploads.order_id 
      AND (orders.user_id = auth.uid() OR orders.creator_id = auth.uid())
    ) OR
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Creators can manage their video uploads" ON video_uploads
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Service role can manage video uploads" ON video_uploads
  FOR ALL USING (auth.role() = 'service_role');

-- payments RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payments from their orders" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND (orders.user_id = auth.uid() OR orders.creator_id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can manage payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

-- Add triggers to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_intents_updated_at 
  BEFORE UPDATE ON payment_intents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_accounts_updated_at 
  BEFORE UPDATE ON stripe_accounts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_uploads_updated_at 
  BEFORE UPDATE ON video_uploads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraints to ensure data integrity
ALTER TABLE orders ADD CONSTRAINT orders_amount_positive CHECK (amount > 0);
ALTER TABLE orders ADD CONSTRAINT orders_platform_fee_valid CHECK (platform_fee >= 0 AND platform_fee <= amount);
ALTER TABLE orders ADD CONSTRAINT orders_creator_earnings_valid CHECK (creator_earnings >= 0 AND creator_earnings <= amount);
ALTER TABLE orders ADD CONSTRAINT orders_fees_sum_equals_amount CHECK (platform_fee + creator_earnings = amount);

ALTER TABLE payment_intents ADD CONSTRAINT payment_intents_amount_positive CHECK (amount > 0);
ALTER TABLE payments ADD CONSTRAINT payments_amount_positive CHECK (amount > 0);
ALTER TABLE video_uploads ADD CONSTRAINT video_uploads_duration_positive CHECK (duration IS NULL OR duration > 0);
ALTER TABLE video_uploads ADD CONSTRAINT video_uploads_size_positive CHECK (size_bytes IS NULL OR size_bytes > 0);

-- Create functions for common calculations
CREATE OR REPLACE FUNCTION calculate_platform_fee(amount DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(amount * 0.30, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION calculate_creator_earnings(amount DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(amount * 0.70, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add comments for documentation
COMMENT ON TABLE payment_intents IS 'Tracks Stripe payment intents for video orders and subscriptions';
COMMENT ON TABLE orders IS 'Video request orders after successful payment with 70/30 split';
COMMENT ON TABLE stripe_accounts IS 'Creator Stripe Connect accounts for payouts';
COMMENT ON TABLE video_uploads IS 'Tracks uploaded videos and their processing status';
COMMENT ON TABLE payments IS 'Records of completed transactions with fee breakdowns';

COMMENT ON COLUMN orders.platform_fee IS '30% platform fee from total amount';
COMMENT ON COLUMN orders.creator_earnings IS '70% creator earnings from total amount';
COMMENT ON COLUMN stripe_accounts.requirements_currently_due IS 'Stripe account requirements that must be fulfilled';
COMMENT ON COLUMN video_uploads.processing_status IS 'Status: uploading, processing, ready, failed';