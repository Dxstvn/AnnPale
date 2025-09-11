-- =====================================================
-- PHASE 1: SUBSCRIPTION SYSTEM DATABASE SCHEMA
-- =====================================================

-- 1. SUBSCRIPTION ORDERS TABLE
-- Similar structure to video orders for consistency
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
CREATE INDEX idx_subscription_orders_next_billing_date ON public.subscription_orders(next_billing_date);
CREATE INDEX idx_subscription_orders_stripe_subscription_id ON public.subscription_orders(stripe_subscription_id);

-- =====================================================
-- 2. POSTS TABLE ENHANCEMENTS FOR PREVIEW SYSTEM
-- =====================================================
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preview_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS preview_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS preview_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_tier_ids UUID[] DEFAULT ARRAY[]::UUID[],
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Index for preview posts
CREATE INDEX IF NOT EXISTS idx_posts_preview ON public.posts(is_preview, preview_order) 
WHERE is_preview = true;

CREATE INDEX IF NOT EXISTS idx_posts_access_tiers ON public.posts USING GIN(access_tier_ids);

-- =====================================================
-- 3. POST ACCESS TIERS JUNCTION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_access_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES public.creator_subscription_tiers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(post_id, tier_id)
);

CREATE INDEX idx_post_access_tiers_post_id ON public.post_access_tiers(post_id);
CREATE INDEX idx_post_access_tiers_tier_id ON public.post_access_tiers(tier_id);

-- =====================================================
-- 4. USER FEED PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_feed_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Display preferences
    feed_layout VARCHAR(20) DEFAULT 'vertical' CHECK (feed_layout IN ('vertical', 'grid', 'list')),
    autoplay_videos BOOLEAN DEFAULT true,
    show_captions BOOLEAN DEFAULT true,
    content_quality VARCHAR(20) DEFAULT 'auto' CHECK (content_quality IN ('auto', 'high', 'medium', 'low')),
    
    -- Content preferences
    hide_seen_content BOOLEAN DEFAULT false,
    prioritize_subscribed BOOLEAN DEFAULT true,
    show_recommendations BOOLEAN DEFAULT true,
    
    -- Notification preferences
    notify_new_posts BOOLEAN DEFAULT true,
    notify_live_streams BOOLEAN DEFAULT true,
    notify_subscription_expiry BOOLEAN DEFAULT true,
    
    -- Privacy settings
    anonymous_viewing BOOLEAN DEFAULT false,
    save_watch_history BOOLEAN DEFAULT true,
    
    -- Metadata
    last_feed_visit TIMESTAMPTZ,
    total_watch_time INTEGER DEFAULT 0, -- in seconds
    preferred_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    blocked_creators UUID[] DEFAULT ARRAY[]::UUID[],
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_feed_preferences_user_id ON public.user_feed_preferences(user_id);

-- =====================================================
-- 5. CREATOR FEED SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.creator_feed_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Feed appearance
    theme_color VARCHAR(7), -- Hex color
    cover_image_url TEXT,
    intro_video_url TEXT,
    bio_display_mode VARCHAR(20) DEFAULT 'compact' CHECK (bio_display_mode IN ('compact', 'full', 'hidden')),
    
    -- Content settings
    default_post_visibility VARCHAR(20) DEFAULT 'public' CHECK (
        default_post_visibility IN ('public', 'subscribers', 'tier1', 'tier2', 'tier3', 'private')
    ),
    preview_post_count INTEGER DEFAULT 3 CHECK (preview_post_count >= 0 AND preview_post_count <= 10),
    pin_featured_posts BOOLEAN DEFAULT true,
    
    -- Engagement settings
    allow_comments BOOLEAN DEFAULT true,
    allow_shares BOOLEAN DEFAULT true,
    moderate_comments BOOLEAN DEFAULT false,
    require_subscription_for_comments BOOLEAN DEFAULT false,
    
    -- Analytics visibility
    show_subscriber_count BOOLEAN DEFAULT true,
    show_view_counts BOOLEAN DEFAULT true,
    show_engagement_stats BOOLEAN DEFAULT false,
    
    -- Monetization
    show_tip_button BOOLEAN DEFAULT true,
    show_subscription_prompt BOOLEAN DEFAULT true,
    subscription_prompt_frequency INTEGER DEFAULT 5, -- Show prompt every N posts
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_creator_feed_settings_creator_id ON public.creator_feed_settings(creator_id);

-- =====================================================
-- 6. SUBSCRIPTION TRANSACTIONS TABLE
-- For tracking payment history
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscription_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_order_id UUID NOT NULL REFERENCES public.subscription_orders(id) ON DELETE CASCADE,
    
    -- Transaction details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    type VARCHAR(50) NOT NULL CHECK (
        type IN ('payment', 'refund', 'chargeback', 'adjustment', 'promo_credit')
    ),
    status VARCHAR(50) NOT NULL CHECK (
        status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled')
    ),
    
    -- Stripe details
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    stripe_refund_id VARCHAR(255),
    
    -- Metadata
    description TEXT,
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscription_transactions_order_id ON public.subscription_transactions(subscription_order_id);
CREATE INDEX idx_subscription_transactions_status ON public.subscription_transactions(status);
CREATE INDEX idx_subscription_transactions_created_at ON public.subscription_transactions(created_at DESC);

-- =====================================================
-- 7. SUBSCRIPTION ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.subscription_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Metrics
    date DATE NOT NULL,
    new_subscribers INTEGER DEFAULT 0,
    cancelled_subscribers INTEGER DEFAULT 0,
    active_subscribers INTEGER DEFAULT 0,
    trial_subscribers INTEGER DEFAULT 0,
    
    -- Revenue metrics
    daily_revenue DECIMAL(10, 2) DEFAULT 0,
    monthly_recurring_revenue DECIMAL(10, 2) DEFAULT 0,
    average_revenue_per_user DECIMAL(10, 2) DEFAULT 0,
    
    -- Engagement metrics
    churn_rate DECIMAL(5, 2) DEFAULT 0,
    retention_rate DECIMAL(5, 2) DEFAULT 0,
    conversion_rate DECIMAL(5, 2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(creator_id, date)
);

CREATE INDEX idx_subscription_analytics_creator_date ON public.subscription_analytics(creator_id, date DESC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE public.subscription_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_access_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feed_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_feed_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_analytics ENABLE ROW LEVEL SECURITY;

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

-- Post Access Tiers Policies
CREATE POLICY "Anyone can view post access tiers"
    ON public.post_access_tiers FOR SELECT
    USING (true);

CREATE POLICY "Creators can manage post access tiers"
    ON public.post_access_tiers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.posts
            WHERE posts.id = post_access_tiers.post_id
            AND posts.creator_id = auth.uid()
        )
    );

-- User Feed Preferences Policies
CREATE POLICY "Users can manage their own feed preferences"
    ON public.user_feed_preferences FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Creator Feed Settings Policies
CREATE POLICY "Anyone can view creator feed settings"
    ON public.creator_feed_settings FOR SELECT
    USING (true);

CREATE POLICY "Creators can manage their own feed settings"
    ON public.creator_feed_settings FOR ALL
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Subscription Transactions Policies
CREATE POLICY "Users and creators can view related transactions"
    ON public.subscription_transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.subscription_orders
            WHERE subscription_orders.id = subscription_transactions.subscription_order_id
            AND (subscription_orders.user_id = auth.uid() OR subscription_orders.creator_id = auth.uid())
        )
    );

-- Subscription Analytics Policies
CREATE POLICY "Creators can view their own analytics"
    ON public.subscription_analytics FOR SELECT
    USING (auth.uid() = creator_id);

CREATE POLICY "System can manage analytics"
    ON public.subscription_analytics FOR ALL
    USING (auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    ));

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update subscription order status
CREATE OR REPLACE FUNCTION public.update_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update updated_at timestamp
    NEW.updated_at = now();
    
    -- Track status change timestamps
    IF NEW.status != OLD.status THEN
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

CREATE TRIGGER update_subscription_order_status
    BEFORE UPDATE ON public.subscription_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_subscription_status();

-- Function to calculate subscription analytics
CREATE OR REPLACE FUNCTION public.calculate_subscription_analytics(p_creator_id UUID, p_date DATE)
RETURNS VOID AS $$
DECLARE
    v_new_subscribers INTEGER;
    v_cancelled_subscribers INTEGER;
    v_active_subscribers INTEGER;
    v_trial_subscribers INTEGER;
    v_daily_revenue DECIMAL;
    v_mrr DECIMAL;
    v_arpu DECIMAL;
BEGIN
    -- Calculate new subscribers
    SELECT COUNT(*) INTO v_new_subscribers
    FROM public.subscription_orders
    WHERE creator_id = p_creator_id
    AND DATE(created_at) = p_date
    AND status IN ('active', 'trialing');
    
    -- Calculate cancelled subscribers
    SELECT COUNT(*) INTO v_cancelled_subscribers
    FROM public.subscription_orders
    WHERE creator_id = p_creator_id
    AND DATE(cancelled_at) = p_date;
    
    -- Calculate active subscribers
    SELECT COUNT(*) INTO v_active_subscribers
    FROM public.subscription_orders
    WHERE creator_id = p_creator_id
    AND status = 'active'
    AND DATE(created_at) <= p_date
    AND (cancelled_at IS NULL OR DATE(cancelled_at) > p_date);
    
    -- Calculate trial subscribers
    SELECT COUNT(*) INTO v_trial_subscribers
    FROM public.subscription_orders
    WHERE creator_id = p_creator_id
    AND status = 'trialing'
    AND DATE(created_at) <= p_date;
    
    -- Calculate daily revenue
    SELECT COALESCE(SUM(amount), 0) INTO v_daily_revenue
    FROM public.subscription_transactions
    WHERE subscription_order_id IN (
        SELECT id FROM public.subscription_orders WHERE creator_id = p_creator_id
    )
    AND DATE(created_at) = p_date
    AND status = 'succeeded'
    AND type = 'payment';
    
    -- Calculate MRR (simplified)
    SELECT COALESCE(SUM(
        CASE 
            WHEN billing_period = 'monthly' THEN creator_earnings
            WHEN billing_period = 'yearly' THEN creator_earnings / 12
        END
    ), 0) INTO v_mrr
    FROM public.subscription_orders
    WHERE creator_id = p_creator_id
    AND status = 'active';
    
    -- Calculate ARPU
    IF v_active_subscribers > 0 THEN
        v_arpu := v_mrr / v_active_subscribers;
    ELSE
        v_arpu := 0;
    END IF;
    
    -- Insert or update analytics
    INSERT INTO public.subscription_analytics (
        creator_id, date, new_subscribers, cancelled_subscribers,
        active_subscribers, trial_subscribers, daily_revenue,
        monthly_recurring_revenue, average_revenue_per_user
    ) VALUES (
        p_creator_id, p_date, v_new_subscribers, v_cancelled_subscribers,
        v_active_subscribers, v_trial_subscribers, v_daily_revenue,
        v_mrr, v_arpu
    )
    ON CONFLICT (creator_id, date) DO UPDATE SET
        new_subscribers = EXCLUDED.new_subscribers,
        cancelled_subscribers = EXCLUDED.cancelled_subscribers,
        active_subscribers = EXCLUDED.active_subscribers,
        trial_subscribers = EXCLUDED.trial_subscribers,
        daily_revenue = EXCLUDED.daily_revenue,
        monthly_recurring_revenue = EXCLUDED.monthly_recurring_revenue,
        average_revenue_per_user = EXCLUDED.average_revenue_per_user;
END;
$$ LANGUAGE plpgsql;

-- Function to check post access based on subscription
CREATE OR REPLACE FUNCTION public.check_post_access(
    p_user_id UUID,
    p_post_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_is_public BOOLEAN;
    v_creator_id UUID;
    v_required_tiers UUID[];
    v_user_tier_id UUID;
BEGIN
    -- Get post details
    SELECT is_public, creator_id, access_tier_ids
    INTO v_is_public, v_creator_id, v_required_tiers
    FROM public.posts
    WHERE id = p_post_id;
    
    -- If post doesn't exist, deny access
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- If post is public, allow access
    IF v_is_public THEN
        RETURN TRUE;
    END IF;
    
    -- If user is the creator, allow access
    IF p_user_id = v_creator_id THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user has active subscription with required tier
    SELECT tier_id INTO v_user_tier_id
    FROM public.subscription_orders
    WHERE user_id = p_user_id
    AND creator_id = v_creator_id
    AND status IN ('active', 'trialing')
    LIMIT 1;
    
    -- If user has no active subscription, deny access
    IF v_user_tier_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- If no specific tiers required, any subscription grants access
    IF v_required_tiers IS NULL OR array_length(v_required_tiers, 1) = 0 THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user's tier is in required tiers
    RETURN v_user_tier_id = ANY(v_required_tiers);
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.subscription_orders IS 'Stores subscription orders with full lifecycle tracking';
COMMENT ON TABLE public.post_access_tiers IS 'Maps posts to subscription tiers for access control';
COMMENT ON TABLE public.user_feed_preferences IS 'Stores user preferences for feed display and behavior';
COMMENT ON TABLE public.creator_feed_settings IS 'Stores creator settings for their feed appearance and behavior';
COMMENT ON TABLE public.subscription_transactions IS 'Tracks all payment transactions for subscriptions';
COMMENT ON TABLE public.subscription_analytics IS 'Stores aggregated analytics data for creator subscriptions';