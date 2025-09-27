-- =====================================================
-- MIGRATION: Sync creator_subscriptions to subscription_orders
-- Purpose: Migrate existing subscription data to the unified subscription_orders table
-- Date: 2025-09-26
-- =====================================================

-- Step 1: Migrate existing creator_subscriptions to subscription_orders
-- Only migrate subscriptions that don't already exist in subscription_orders
INSERT INTO public.subscription_orders (
    id,
    user_id,
    creator_id,
    tier_id,
    total_amount,
    platform_fee,
    creator_earnings,
    currency,
    status,
    billing_period,
    current_period_start,
    current_period_end,
    next_billing_date,
    cancelled_at,
    stripe_subscription_id,
    created_at,
    updated_at,
    activated_at
)
SELECT
    cs.id,
    cs.subscriber_id as user_id,
    cs.creator_id,
    cs.tier_id,
    COALESCE(cst.price, 0) as total_amount,
    COALESCE(cst.price * 0.30, 0) as platform_fee,  -- 30% platform fee
    COALESCE(cst.price * 0.70, 0) as creator_earnings,  -- 70% to creator
    'USD' as currency,
    CASE
        WHEN cs.status = 'active' AND cs.expires_at > NOW() THEN 'active'
        WHEN cs.status = 'active' AND cs.expires_at <= NOW() THEN 'expired'
        ELSE cs.status
    END as status,
    COALESCE(cst.billing_period, 'monthly') as billing_period,
    cs.started_at as current_period_start,
    cs.expires_at as current_period_end,
    cs.expires_at as next_billing_date,
    cs.cancelled_at,
    cs.stripe_subscription_id,
    cs.created_at,
    cs.updated_at,
    cs.started_at as activated_at
FROM public.creator_subscriptions cs
LEFT JOIN public.creator_subscription_tiers cst ON cs.tier_id = cst.id
WHERE NOT EXISTS (
    SELECT 1
    FROM public.subscription_orders so
    WHERE so.user_id = cs.subscriber_id
    AND so.creator_id = cs.creator_id
    AND so.tier_id = cs.tier_id
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Update any subscription_orders that have stripe_subscription_id
-- but might be missing other data
UPDATE public.subscription_orders so
SET
    current_period_end = COALESCE(so.current_period_end, cs.expires_at),
    next_billing_date = COALESCE(so.next_billing_date, cs.expires_at),
    status = CASE
        WHEN so.status = 'pending' AND cs.status = 'active' THEN 'active'
        WHEN so.status = 'active' AND cs.expires_at <= NOW() THEN 'expired'
        ELSE so.status
    END,
    updated_at = NOW()
FROM public.creator_subscriptions cs
WHERE cs.stripe_subscription_id = so.stripe_subscription_id
AND cs.stripe_subscription_id IS NOT NULL;

-- Step 3: Create a view for backward compatibility (optional)
-- This allows old code to continue working while we migrate
CREATE OR REPLACE VIEW public.creator_subscriptions_view AS
SELECT
    so.id,
    so.user_id as subscriber_id,
    so.creator_id,
    so.tier_id,
    so.status,
    so.created_at as started_at,
    so.current_period_end as expires_at,
    so.cancelled_at,
    so.stripe_subscription_id,
    so.created_at,
    so.updated_at
FROM public.subscription_orders so;

-- Step 4: Add indexes for better performance on the view
CREATE INDEX IF NOT EXISTS idx_subscription_orders_user_creator
ON public.subscription_orders(user_id, creator_id);

CREATE INDEX IF NOT EXISTS idx_subscription_orders_current_period_end
ON public.subscription_orders(current_period_end);

-- Step 5: Grant permissions on the view
GRANT SELECT ON public.creator_subscriptions_view TO authenticated;

-- Step 6: Add comment for documentation
COMMENT ON VIEW public.creator_subscriptions_view IS 'Backward compatibility view for creator_subscriptions table. Use subscription_orders table directly for new code.';

-- Step 7: Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'Migration completed: creator_subscriptions → subscription_orders';
    RAISE NOTICE 'Total migrated: %', (SELECT COUNT(*) FROM public.subscription_orders);
END $$;