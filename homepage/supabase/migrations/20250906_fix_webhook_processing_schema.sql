-- Fix database schema issues preventing webhook processing
-- Created: 2025-09-06

-- 1. Fix payment_intents table and RLS policies
DROP POLICY IF EXISTS "payment_intents_insert_policy" ON payment_intents;
DROP POLICY IF EXISTS "payment_intents_select_policy" ON payment_intents;
DROP POLICY IF EXISTS "payment_intents_update_policy" ON payment_intents;

-- Create payment_intents table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_intents (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    creator_id UUID REFERENCES profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for payment_intents
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_intents (allow service role to manage)
CREATE POLICY "payment_intents_service_policy" ON payment_intents 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 2. Fix payments table - add missing net_platform_fee column
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS net_platform_fee DECIMAL(10,2) DEFAULT 0;

-- Update existing payments if column was missing
UPDATE payments 
SET net_platform_fee = platform_fee 
WHERE net_platform_fee IS NULL;

-- 3. Create platform_revenue table (replacing platform_stats for revenue tracking)
CREATE TABLE IF NOT EXISTS platform_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    payment_intent_id TEXT NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    stripe_fee DECIMAL(10,2) DEFAULT 0,
    net_platform_fee DECIMAL(10,2) NOT NULL,
    creator_id UUID REFERENCES profiles(id),
    fan_id UUID REFERENCES profiles(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for platform_revenue
ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;

-- Create policies for platform_revenue
CREATE POLICY "platform_revenue_service_policy" ON platform_revenue 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 4. Fix orders table - ensure proper structure
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS creator_earnings DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2);

-- Create index on payment_intent_id for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);

-- 5. Ensure webhook_events table exists and has proper structure
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_id TEXT UNIQUE NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for webhook_events  
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies for webhook_events
CREATE POLICY "webhook_events_service_policy" ON webhook_events 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 6. Create stripe_accounts table if it doesn't exist (for Stripe Connect)
CREATE TABLE IF NOT EXISTS stripe_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES profiles(id) UNIQUE,
    stripe_account_id TEXT UNIQUE NOT NULL,
    charges_enabled BOOLEAN DEFAULT false,
    payouts_enabled BOOLEAN DEFAULT false,
    onboarding_complete BOOLEAN DEFAULT false,
    requirements_currently_due TEXT[] DEFAULT '{}',
    requirements_eventually_due TEXT[] DEFAULT '{}',
    requirements_past_due TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for stripe_accounts
ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for stripe_accounts
CREATE POLICY "stripe_accounts_service_policy" ON stripe_accounts 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 7. Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    platform_fee DECIMAL(10,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "transactions_service_policy" ON transactions 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 8. Update existing orders table RLS policies to allow service access
DROP POLICY IF EXISTS "orders_service_policy" ON orders;
CREATE POLICY "orders_service_policy" ON orders 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 9. Update existing payments table RLS policies to allow service access
DROP POLICY IF EXISTS "payments_service_policy" ON payments;
CREATE POLICY "payments_service_policy" ON payments 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 10. Create helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_payment_intents_creator_id ON payment_intents(creator_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_payment_intent ON platform_revenue(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_creator_id ON platform_revenue(creator_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);

-- 11. Grant necessary permissions to service role
GRANT ALL ON payment_intents TO service_role;
GRANT ALL ON platform_revenue TO service_role;
GRANT ALL ON webhook_events TO service_role;
GRANT ALL ON stripe_accounts TO service_role;
GRANT ALL ON transactions TO service_role;
GRANT ALL ON orders TO service_role;
GRANT ALL ON payments TO service_role;

-- 12. Create function to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 13. Create triggers for updated_at columns
CREATE TRIGGER update_payment_intents_updated_at 
    BEFORE UPDATE ON payment_intents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_accounts_updated_at 
    BEFORE UPDATE ON stripe_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Refresh schema cache by analyzing tables
ANALYZE payment_intents;
ANALYZE platform_revenue;
ANALYZE webhook_events;
ANALYZE stripe_accounts;
ANALYZE transactions;
ANALYZE orders;
ANALYZE payments;

-- Migration completed successfully
SELECT 'Database schema fixed for webhook processing - all tables and policies created' as result;