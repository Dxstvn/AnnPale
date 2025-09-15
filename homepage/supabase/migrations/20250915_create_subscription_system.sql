-- Create subscription system tables for Ann Pale platform
-- This migration creates the necessary tables for managing creator subscriptions

-- =====================================================
-- 1. CREATOR SUBSCRIPTION TIERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.creator_subscription_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    billing_period VARCHAR(20) DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),
    features JSONB DEFAULT '[]'::jsonb,
    benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
    max_subscribers INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Tier-specific features
    ad_free BOOLEAN DEFAULT false,
    early_access BOOLEAN DEFAULT false,
    exclusive_content BOOLEAN DEFAULT false,
    direct_messaging BOOLEAN DEFAULT false,
    group_chat_access BOOLEAN DEFAULT false,
    monthly_video_message BOOLEAN DEFAULT false,
    priority_requests BOOLEAN DEFAULT false,
    behind_scenes BOOLEAN DEFAULT false,

    -- Ensure unique tier names per creator
    CONSTRAINT unique_tier_name_per_creator UNIQUE(creator_id, tier_name)
);

-- Create indexes for better query performance
CREATE INDEX idx_creator_subscription_tiers_creator_id ON public.creator_subscription_tiers(creator_id);
CREATE INDEX idx_creator_subscription_tiers_is_active ON public.creator_subscription_tiers(is_active);

-- =====================================================
-- 2. SUBSCRIPTION ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscription_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES public.creator_subscription_tiers(id) ON DELETE RESTRICT,

    -- Order details
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
    creator_earnings DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (creator_earnings >= 0),
    currency VARCHAR(3) DEFAULT 'USD',

    -- Subscription lifecycle
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'processing', 'active', 'paused', 'cancelled', 'expired', 'failed', 'trialing')
    ),

    -- Billing information
    billing_period VARCHAR(20) NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,

    -- Payment details
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    payment_method_id VARCHAR(255),
    last_payment_status VARCHAR(50),
    last_payment_date TIMESTAMPTZ,
    failed_payment_count INTEGER DEFAULT 0,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    referral_source VARCHAR(100),
    promo_code VARCHAR(50),
    discount_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    activated_at TIMESTAMPTZ,
    paused_at TIMESTAMPTZ,
    resumed_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_active_subscription UNIQUE(user_id, creator_id, status)
        WHERE status IN ('active', 'trialing'),
    CONSTRAINT valid_billing_dates CHECK (
        current_period_end IS NULL OR current_period_start IS NULL OR
        current_period_end > current_period_start
    )
);

-- Indexes for subscription orders
CREATE INDEX idx_subscription_orders_user_id ON public.subscription_orders(user_id);
CREATE INDEX idx_subscription_orders_creator_id ON public.subscription_orders(creator_id);
CREATE INDEX idx_subscription_orders_tier_id ON public.subscription_orders(tier_id);
CREATE INDEX idx_subscription_orders_status ON public.subscription_orders(status);
CREATE INDEX idx_subscription_orders_stripe_subscription_id ON public.subscription_orders(stripe_subscription_id);

-- =====================================================
-- 3. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on tables
ALTER TABLE public.creator_subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_orders ENABLE ROW LEVEL SECURITY;

-- Creator Subscription Tiers Policies
CREATE POLICY "Anyone can view active subscription tiers"
    ON public.creator_subscription_tiers FOR SELECT
    USING (is_active = true);

CREATE POLICY "Creators can manage their own tiers"
    ON public.creator_subscription_tiers FOR ALL
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Subscription Orders Policies
CREATE POLICY "Users can view their own subscription orders"
    ON public.subscription_orders FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = creator_id);

CREATE POLICY "Users can create subscription orders"
    ON public.subscription_orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription orders"
    ON public.subscription_orders FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_subscription_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();

    -- Track status change timestamps
    IF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
        CASE NEW.status
            WHEN 'active' THEN
                NEW.activated_at = now();
            WHEN 'paused' THEN
                NEW.paused_at = now();
            WHEN 'cancelled' THEN
                NEW.cancelled_at = now();
            ELSE
                -- No specific timestamp update
        END CASE;

        -- If resuming from pause
        IF OLD.status = 'paused' AND NEW.status = 'active' THEN
            NEW.resumed_at = now();
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription orders
CREATE TRIGGER update_subscription_order_timestamps
    BEFORE UPDATE ON public.subscription_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_subscription_timestamps();

-- Create trigger for subscription tiers
CREATE TRIGGER update_subscription_tier_timestamps
    BEFORE UPDATE ON public.creator_subscription_tiers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON public.creator_subscription_tiers TO authenticated;
GRANT ALL ON public.subscription_orders TO authenticated;

-- =====================================================
-- 6. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE public.creator_subscription_tiers IS 'Stores subscription tier definitions for creators';
COMMENT ON TABLE public.subscription_orders IS 'Tracks fan subscriptions to creator content';
COMMENT ON COLUMN public.subscription_orders.status IS 'Current status of the subscription (active, cancelled, etc.)';
COMMENT ON COLUMN public.subscription_orders.tier_id IS 'References the subscription tier the fan has subscribed to';