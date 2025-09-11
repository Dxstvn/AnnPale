-- Create webhook_events table for tracking all webhook events
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', etc.
  event_type VARCHAR(100) NOT NULL, -- 'payment_intent.succeeded', etc.
  event_id VARCHAR(255) UNIQUE, -- External event ID from provider
  payload JSONB NOT NULL, -- Full event payload
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'received' CHECK (status IN ('received', 'processing', 'processed', 'failed')),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for webhook events
CREATE INDEX idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- Create RLS policies for webhook_events
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access webhook events
CREATE POLICY "Service role can manage webhook events" ON webhook_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add customer_id column to transactions table (was missing)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Create index for customer email lookups
CREATE INDEX IF NOT EXISTS idx_transactions_customer_email ON transactions(customer_email);