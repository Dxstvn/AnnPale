-- Payment System Tables Migration
-- Creates tables for Stripe integration, orders, transactions, and refunds

-- Create payment intent status enum
CREATE TYPE payment_intent_status AS ENUM (
  'requires_payment_method',
  'requires_confirmation',
  'requires_action',
  'processing',
  'requires_capture',
  'canceled',
  'succeeded',
  'failed'
);

-- Create order status enum (if not already created)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'refunded',
      'partial_refund'
    );
  END IF;
END $$;

-- Create refund status enum
CREATE TYPE refund_status AS ENUM (
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled'
);

-- Create transaction type enum
CREATE TYPE transaction_type AS ENUM (
  'payment',
  'refund',
  'payout',
  'adjustment',
  'fee'
);

-- Payment Intents table - stores Stripe payment intent data
CREATE TABLE IF NOT EXISTS public.payment_intents (
  id TEXT PRIMARY KEY, -- Stripe payment intent ID
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status payment_intent_status NOT NULL DEFAULT 'requires_payment_method',
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  stripe_customer_id TEXT,
  payment_method_id TEXT,
  client_secret TEXT,
  last_error JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Orders table - stores video request orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  video_request_id UUID REFERENCES public.video_requests(id) ON DELETE SET NULL,
  payment_intent_id TEXT REFERENCES public.payment_intents(id) ON DELETE SET NULL,
  
  -- Order details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status order_status NOT NULL DEFAULT 'pending',
  
  -- Additional info
  metadata JSONB DEFAULT '{}',
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Webhook Events table - logs all webhook events for debugging
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider VARCHAR(50) NOT NULL, -- 'stripe', 'moncash', etc.
  event_type VARCHAR(100) NOT NULL,
  event_id TEXT UNIQUE NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Financial Transactions table - tracks all financial transactions
-- (Note: transactions table already exists in video_management_schema)
-- We'll extend it with additional fields if needed
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_intent_id TEXT REFERENCES public.payment_intents(id) ON DELETE SET NULL,
  
  -- Transaction details
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  description TEXT,
  
  -- Related entities
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Payment provider details
  provider VARCHAR(50) NOT NULL, -- 'stripe', 'moncash', etc.
  provider_transaction_id TEXT,
  provider_response JSONB,
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ
);

-- Refunds table - tracks refund requests and status
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID REFERENCES public.financial_transactions(id) ON DELETE SET NULL,
  
  -- Refund details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  reason TEXT NOT NULL,
  status refund_status NOT NULL DEFAULT 'pending',
  
  -- Provider details
  provider VARCHAR(50) NOT NULL,
  provider_refund_id TEXT,
  provider_response JSONB,
  
  -- User who requested refund
  requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Timestamps
  requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  approved_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON public.payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_creator_id ON public.payment_intents(creator_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON public.payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_payment_intents_created_at ON public.payment_intents(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_creator_id ON public.orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON public.webhook_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_order_id ON public.financial_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id ON public.financial_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_creator_id ON public.financial_transactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON public.financial_transactions(type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_at ON public.financial_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON public.refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON public.refunds(status);
CREATE INDEX IF NOT EXISTS idx_refunds_requested_at ON public.refunds(requested_at DESC);

-- Enable Row Level Security
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_intents
CREATE POLICY "Users can view their own payment intents" ON public.payment_intents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment intents" ON public.payment_intents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payment intents" ON public.payment_intents
  FOR UPDATE USING (true) WITH CHECK (true);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = creator_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can update orders they're assigned to" ON public.orders
  FOR UPDATE USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);

-- RLS Policies for financial_transactions
CREATE POLICY "Users can view their own financial transactions" ON public.financial_transactions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = creator_id);

-- RLS Policies for refunds
CREATE POLICY "Users can view refunds for their orders" ON public.refunds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = refunds.order_id 
      AND (orders.user_id = auth.uid() OR orders.creator_id = auth.uid())
    )
  );

CREATE POLICY "Users can request refunds for their orders" ON public.refunds
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for webhook_events (admin only)
CREATE POLICY "Admins can view webhook events" ON public.webhook_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_payment_intents_updated_at 
  BEFORE UPDATE ON public.payment_intents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  counter INTEGER;
BEGIN
  year_part := TO_CHAR(NOW(), 'YY');
  
  -- Get the current counter for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 7 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.orders
  WHERE order_number LIKE 'ORD-' || year_part || '-%';
  
  new_number := 'ORD-' || year_part || '-' || LPAD(counter::TEXT, 6, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Add comments for documentation
COMMENT ON TABLE public.payment_intents IS 'Stores Stripe payment intent data and status';
COMMENT ON TABLE public.orders IS 'Stores video request orders and their fulfillment status';
COMMENT ON TABLE public.webhook_events IS 'Logs all incoming webhook events for debugging and audit';
COMMENT ON TABLE public.financial_transactions IS 'Tracks all financial transactions including payments and payouts';
COMMENT ON TABLE public.refunds IS 'Manages refund requests and their processing status';