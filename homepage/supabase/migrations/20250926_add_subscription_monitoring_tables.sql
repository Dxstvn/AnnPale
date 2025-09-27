-- =====================================================
-- MIGRATION: Add subscription monitoring tables
-- Purpose: Support subscription monitoring dashboard
-- Date: 2025-09-26
-- =====================================================

-- Create sync_logs table for tracking synchronization runs
CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    results JSONB NOT NULL,
    errors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at DESC);

-- Create webhook_events table for tracking Stripe webhooks
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correlation_id TEXT,
    stripe_event_id TEXT,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed', 'completed')),
    payload JSONB,
    event_data JSONB,
    result_data JSONB,
    error_message TEXT,
    error_stack TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for webhook events
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON public.webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_correlation_id ON public.webhook_events(correlation_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON public.webhook_events(processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON public.webhook_events(status);

-- Add RLS policies
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view sync logs
CREATE POLICY "Admins can view sync logs"
    ON public.sync_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Service role can insert sync logs
CREATE POLICY "Service role can insert sync logs"
    ON public.sync_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Only admins can view webhook events
CREATE POLICY "Admins can view webhook events"
    ON public.webhook_events
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Service role can manage webhook events
CREATE POLICY "Service role can manage webhook events"
    ON public.webhook_events
    FOR ALL
    TO service_role
    WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE public.sync_logs IS 'Stores results of subscription synchronization runs';
COMMENT ON TABLE public.webhook_events IS 'Stores processed Stripe webhook events';

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Migration completed: Added subscription monitoring tables';
END $$;