-- Create refunds table for detailed refund tracking
-- This migration adds comprehensive refund management to the Ann Pale platform
-- Author: Claude Code Integration Plan
-- Date: 2025-09-10

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create refund status enum
CREATE TYPE refund_status AS ENUM (
  'pending',      -- Refund initiated, awaiting Stripe processing
  'processing',   -- Stripe is processing the refund
  'succeeded',    -- Refund completed successfully
  'failed',       -- Refund failed
  'cancelled'     -- Refund was cancelled
);

-- Create refund reason enum
CREATE TYPE refund_reason AS ENUM (
  'creator_rejection',    -- Creator rejected the video request
  'fan_cancellation',    -- Fan cancelled their order
  'system_expiry',       -- Order expired without completion
  'admin_refund',        -- Admin-initiated refund
  'dispute_chargeback',  -- Chargeback dispute
  'technical_issue',     -- Technical problems
  'duplicate_payment',   -- Duplicate payment refund
  'other'               -- Other reason (with notes)
);

-- Create refunds table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key relationships
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_intent_id VARCHAR REFERENCES payment_intents(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL, -- Fan who gets refunded
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL, -- Creator involved
  
  -- Stripe refund information
  stripe_refund_id VARCHAR UNIQUE NOT NULL,
  stripe_charge_id VARCHAR,
  
  -- Refund amounts (in USD)
  refund_amount DECIMAL(10,2) NOT NULL,
  original_amount DECIMAL(10,2) NOT NULL,
  platform_fee_refund DECIMAL(10,2) DEFAULT 0, -- How much platform fee was refunded
  creator_earnings_refund DECIMAL(10,2) DEFAULT 0, -- How much creator earnings were refunded
  cancellation_fee DECIMAL(10,2) DEFAULT 0, -- Fee charged for cancellation (if any)
  
  -- Status and reason
  status refund_status NOT NULL DEFAULT 'pending',
  reason refund_reason NOT NULL,
  reason_notes TEXT, -- Additional explanation for the refund
  
  -- Who initiated the refund
  initiated_by UUID REFERENCES profiles(id) ON DELETE SET NULL, -- User who initiated (fan, creator, admin)
  initiated_by_type VARCHAR(20) NOT NULL, -- 'fan', 'creator', 'admin', 'system'
  
  -- Processing details
  failure_reason TEXT, -- If refund failed, why
  stripe_failure_code VARCHAR(50), -- Stripe failure code if applicable
  
  -- Metadata
  metadata JSONB DEFAULT '{}', -- Additional data (rejection details, etc.)
  
  -- Timestamps
  initiated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ, -- When Stripe confirmed processing
  completed_at TIMESTAMPTZ, -- When refund was fully completed
  failed_at TIMESTAMPTZ, -- When refund failed
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT refunds_amount_positive CHECK (refund_amount > 0),
  CONSTRAINT refunds_original_amount_positive CHECK (original_amount > 0),
  CONSTRAINT refunds_refund_not_exceed_original CHECK (refund_amount <= original_amount),
  CONSTRAINT refunds_fees_valid CHECK (
    platform_fee_refund >= 0 AND 
    creator_earnings_refund >= 0 AND 
    cancellation_fee >= 0
  ),
  CONSTRAINT refunds_initiated_by_type_valid CHECK (
    initiated_by_type IN ('fan', 'creator', 'admin', 'system')
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_intent_id ON refunds(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_refunds_user_id ON refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_refunds_creator_id ON refunds(creator_id);
CREATE INDEX IF NOT EXISTS idx_refunds_stripe_refund_id ON refunds(stripe_refund_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_refunds_reason ON refunds(reason);
CREATE INDEX IF NOT EXISTS idx_refunds_initiated_by ON refunds(initiated_by);
CREATE INDEX IF NOT EXISTS idx_refunds_created_at ON refunds(created_at);

-- Add webhook_events table if it doesn't exist (for audit logging)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_event_id VARCHAR UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  api_version VARCHAR(20),
  livemode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events(processed_at);

-- Enable RLS on refunds table
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for refunds table
CREATE POLICY "Users can view their own refunds" ON refunds
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can manage refunds" ON refunds
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for webhook_events (admin only)
CREATE POLICY "Admins can view webhook events" ON webhook_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Service role can manage webhook events" ON webhook_events
  FOR ALL USING (auth.role() = 'service_role');

-- Add updated_at trigger for refunds
CREATE TRIGGER update_refunds_updated_at 
  BEFORE UPDATE ON refunds 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add orders table status enum update (add new statuses if they don't exist)
-- This is safer than altering the enum directly
DO $$ 
BEGIN
    -- Add 'disputed' status if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'disputed' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
    ) THEN
        -- Note: We need to check if order_status enum exists first
        -- If it doesn't exist, we'll create it with the new statuses
        BEGIN
            ALTER TYPE order_status ADD VALUE 'disputed';
        EXCEPTION
            WHEN undefined_object THEN
                -- Create the enum if it doesn't exist
                CREATE TYPE order_status AS ENUM (
                    'pending',
                    'accepted', 
                    'in_progress',
                    'completed',
                    'rejected',
                    'cancelled',
                    'refunded',
                    'disputed'
                );
        END;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If any error occurs, create the enum with all statuses
        CREATE TYPE order_status AS ENUM (
            'pending',
            'accepted', 
            'in_progress',
            'completed',
            'rejected',
            'cancelled',
            'refunded',
            'disputed'
        );
END $$;

-- Function to automatically create refund record when Stripe refund is processed
CREATE OR REPLACE FUNCTION public.create_refund_record(
  p_stripe_refund_id VARCHAR,
  p_order_id UUID,
  p_refund_amount DECIMAL,
  p_reason refund_reason,
  p_initiated_by_type VARCHAR,
  p_initiated_by UUID DEFAULT NULL,
  p_reason_notes TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  refund_id UUID;
  order_record RECORD;
BEGIN
  -- Get order details
  SELECT * INTO order_record 
  FROM orders 
  WHERE id = p_order_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;
  
  -- Insert refund record
  INSERT INTO refunds (
    order_id,
    payment_intent_id,
    user_id,
    creator_id,
    stripe_refund_id,
    refund_amount,
    original_amount,
    platform_fee_refund,
    creator_earnings_refund,
    reason,
    reason_notes,
    initiated_by,
    initiated_by_type,
    metadata,
    status
  ) VALUES (
    p_order_id,
    order_record.payment_intent_id,
    order_record.user_id,
    order_record.creator_id,
    p_stripe_refund_id,
    p_refund_amount,
    order_record.amount,
    CASE 
      WHEN p_refund_amount = order_record.amount THEN order_record.platform_fee
      ELSE ROUND(order_record.platform_fee * (p_refund_amount / order_record.amount), 2)
    END,
    CASE 
      WHEN p_refund_amount = order_record.amount THEN order_record.creator_earnings
      ELSE ROUND(order_record.creator_earnings * (p_refund_amount / order_record.amount), 2)
    END,
    p_reason,
    p_reason_notes,
    p_initiated_by,
    p_initiated_by_type,
    p_metadata,
    'processing'
  ) RETURNING id INTO refund_id;
  
  RETURN refund_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update refund status when webhook is received
CREATE OR REPLACE FUNCTION public.update_refund_status(
  p_stripe_refund_id VARCHAR,
  p_status refund_status,
  p_failure_reason TEXT DEFAULT NULL,
  p_stripe_failure_code VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  update_timestamp TIMESTAMPTZ := NOW();
BEGIN
  UPDATE refunds 
  SET 
    status = p_status,
    failure_reason = p_failure_reason,
    stripe_failure_code = p_stripe_failure_code,
    processed_at = CASE WHEN p_status IN ('processing', 'succeeded') THEN update_timestamp ELSE processed_at END,
    completed_at = CASE WHEN p_status = 'succeeded' THEN update_timestamp ELSE completed_at END,
    failed_at = CASE WHEN p_status = 'failed' THEN update_timestamp ELSE failed_at END,
    updated_at = update_timestamp
  WHERE stripe_refund_id = p_stripe_refund_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for refund analytics
CREATE OR REPLACE VIEW public.refund_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as refund_date,
  reason,
  initiated_by_type,
  status,
  COUNT(*) as refund_count,
  SUM(refund_amount) as total_refund_amount,
  AVG(refund_amount) as average_refund_amount,
  SUM(platform_fee_refund) as total_platform_fee_refunded,
  SUM(creator_earnings_refund) as total_creator_earnings_refunded
FROM refunds
GROUP BY DATE_TRUNC('day', created_at), reason, initiated_by_type, status
ORDER BY refund_date DESC;

-- Grant access to the view
GRANT SELECT ON public.refund_analytics TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE refunds IS 'Comprehensive refund tracking with Stripe integration and fee calculations';
COMMENT ON COLUMN refunds.platform_fee_refund IS 'Portion of platform fee that was refunded (30% of refund amount)';
COMMENT ON COLUMN refunds.creator_earnings_refund IS 'Portion of creator earnings that was refunded (70% of refund amount)';
COMMENT ON COLUMN refunds.cancellation_fee IS 'Fee charged to fan for cancellation (deducted from refund)';
COMMENT ON COLUMN refunds.initiated_by_type IS 'Type of user who initiated: fan, creator, admin, or system';

COMMENT ON FUNCTION create_refund_record IS 'Creates a refund record with automatic fee calculations';
COMMENT ON FUNCTION update_refund_status IS 'Updates refund status based on Stripe webhook events';