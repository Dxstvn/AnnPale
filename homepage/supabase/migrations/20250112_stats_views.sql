-- Create video_requests table (if not exists) for tracking creator orders
CREATE TABLE IF NOT EXISTS public.video_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'recording', 'completed', 'cancelled', 'refunded')),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    platform_fee DECIMAL(10, 2) DEFAULT 0 CHECK (platform_fee >= 0),
    creator_earnings DECIMAL(10, 2) GENERATED ALWAYS AS (price - platform_fee) STORED,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    occasion VARCHAR(100),
    instructions TEXT,
    is_public BOOLEAN DEFAULT true,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for video_requests
CREATE INDEX IF NOT EXISTS idx_video_requests_creator_id ON public.video_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_requests_customer_id ON public.video_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_video_requests_status ON public.video_requests(status);
CREATE INDEX IF NOT EXISTS idx_video_requests_created_at ON public.video_requests(created_at DESC);

-- Create transactions table (if not exists) for tracking payments
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_request_id UUID REFERENCES public.video_requests(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('payment', 'refund', 'payout', 'platform_fee')),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    stripe_payment_intent_id TEXT,
    stripe_transfer_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_creator_id ON public.transactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON public.transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_video_request_id ON public.transactions(video_request_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

-- Drop existing views if they exist (to recreate them)
DROP VIEW IF EXISTS public.creator_stats CASCADE;
DROP VIEW IF EXISTS public.platform_stats CASCADE;

-- Create creator_stats view for aggregating creator metrics
CREATE OR REPLACE VIEW public.creator_stats AS
SELECT 
    p.id AS creator_id,
    p.email AS creator_email,
    p.name AS creator_name,
    -- Video request metrics
    COUNT(DISTINCT vr.id) AS total_requests,
    COUNT(DISTINCT CASE WHEN vr.status = 'completed' THEN vr.id END) AS completed_videos,
    COUNT(DISTINCT CASE WHEN vr.status = 'pending' THEN vr.id END) AS pending_requests,
    COUNT(DISTINCT CASE WHEN vr.status = 'cancelled' THEN vr.id END) AS cancelled_requests,
    
    -- Financial metrics (only completed transactions)
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN vr.creator_earnings ELSE 0 END), 0) AS total_earnings,
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN vr.price ELSE 0 END), 0) AS total_revenue,
    COALESCE(AVG(CASE WHEN vr.status = 'completed' THEN vr.price END), 0) AS average_price,
    
    -- Rating metrics
    COALESCE(AVG(CASE WHEN vr.rating IS NOT NULL THEN vr.rating END), 0) AS average_rating,
    COUNT(DISTINCT CASE WHEN vr.rating IS NOT NULL THEN vr.id END) AS total_reviews,
    COUNT(DISTINCT CASE WHEN vr.rating >= 4 THEN vr.id END) AS positive_reviews,
    
    -- Performance metrics
    CASE 
        WHEN COUNT(DISTINCT vr.id) > 0 
        THEN (COUNT(DISTINCT CASE WHEN vr.status = 'completed' THEN vr.id END)::DECIMAL / COUNT(DISTINCT vr.id)::DECIMAL * 100)
        ELSE 0 
    END AS completion_rate,
    
    -- Response time (average time to accept requests in hours)
    COALESCE(
        AVG(
            CASE 
                WHEN vr.status != 'pending' AND vr.updated_at > vr.created_at 
                THEN EXTRACT(EPOCH FROM (vr.updated_at - vr.created_at)) / 3600
            END
        ), 0
    ) AS avg_response_time_hours,
    
    -- Subscription metrics
    COUNT(DISTINCT cst.id) AS total_subscription_tiers,
    COUNT(DISTINCT CASE WHEN cst.is_active = true THEN cst.id END) AS active_subscription_tiers,
    COALESCE(MIN(cst.price), 0) AS min_tier_price,
    COALESCE(MAX(cst.price), 0) AS max_tier_price,
    
    -- Time-based metrics
    MIN(vr.created_at) AS first_request_date,
    MAX(vr.created_at) AS last_request_date,
    MAX(CASE WHEN vr.status = 'completed' THEN vr.completed_at END) AS last_completed_date
    
FROM public.profiles p
LEFT JOIN public.video_requests vr ON p.id = vr.creator_id
LEFT JOIN public.creator_subscription_tiers cst ON p.id = cst.creator_id
WHERE p.role = 'creator'
GROUP BY p.id, p.email, p.name;

-- Create platform_stats view for overall platform metrics
CREATE OR REPLACE VIEW public.platform_stats AS
SELECT 
    -- User metrics
    COUNT(DISTINCT p.id) AS total_users,
    COUNT(DISTINCT CASE WHEN p.role = 'creator' THEN p.id END) AS total_creators,
    COUNT(DISTINCT CASE WHEN p.role = 'fan' THEN p.id END) AS total_fans,
    COUNT(DISTINCT CASE WHEN p.role = 'admin' THEN p.id END) AS total_admins,
    
    -- Active user metrics (users with activity in last 30 days)
    COUNT(DISTINCT CASE 
        WHEN p.updated_at >= CURRENT_DATE - INTERVAL '30 days' 
        THEN p.id 
    END) AS active_users_30d,
    
    COUNT(DISTINCT CASE 
        WHEN p.role = 'creator' AND EXISTS (
            SELECT 1 FROM video_requests vr 
            WHERE vr.creator_id = p.id 
            AND vr.created_at >= CURRENT_DATE - INTERVAL '30 days'
        ) THEN p.id 
    END) AS active_creators_30d,
    
    -- Video request metrics
    COUNT(DISTINCT vr.id) AS total_video_requests,
    COUNT(DISTINCT CASE WHEN vr.status = 'completed' THEN vr.id END) AS completed_videos,
    COUNT(DISTINCT CASE WHEN vr.status = 'pending' THEN vr.id END) AS pending_videos,
    
    -- Financial metrics
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN vr.price END), 0) AS total_revenue,
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN vr.platform_fee END), 0) AS total_platform_fees,
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN vr.creator_earnings END), 0) AS total_creator_earnings,
    COALESCE(AVG(CASE WHEN vr.status = 'completed' THEN vr.price END), 0) AS average_order_value,
    
    -- Rating metrics
    COALESCE(AVG(vr.rating), 0) AS average_rating,
    COUNT(DISTINCT CASE WHEN vr.rating IS NOT NULL THEN vr.id END) AS total_ratings,
    
    -- Completion metrics
    CASE 
        WHEN COUNT(DISTINCT vr.id) > 0 
        THEN (COUNT(DISTINCT CASE WHEN vr.status = 'completed' THEN vr.id END)::DECIMAL / COUNT(DISTINCT vr.id)::DECIMAL * 100)
        ELSE 0 
    END AS overall_completion_rate,
    
    -- Subscription tier metrics
    COUNT(DISTINCT cst.id) AS total_subscription_tiers,
    COUNT(DISTINCT cst.creator_id) AS creators_with_tiers,
    COALESCE(AVG(cst.price), 0) AS average_tier_price,
    
    -- Time metrics
    CURRENT_TIMESTAMP AS stats_generated_at
    
FROM public.profiles p
LEFT JOIN public.video_requests vr ON (p.id = vr.creator_id OR p.id = vr.customer_id)
LEFT JOIN public.creator_subscription_tiers cst ON p.id = cst.creator_id AND cst.is_active = true
CROSS JOIN (SELECT 1) AS dummy_row -- Ensures we always get one row even with no data
GROUP BY dummy_row."?column?";

-- Grant permissions for views
GRANT SELECT ON public.creator_stats TO authenticated;
GRANT SELECT ON public.platform_stats TO authenticated;

-- Enable RLS on the new tables
ALTER TABLE public.video_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_requests
CREATE POLICY "Users can view their own video requests"
    ON public.video_requests FOR SELECT
    USING (auth.uid() = creator_id OR auth.uid() = customer_id);

CREATE POLICY "Creators can update their video requests"
    ON public.video_requests FOR UPDATE
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can create video requests"
    ON public.video_requests FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = creator_id OR auth.uid() = customer_id);

-- Admin policies
CREATE POLICY "Admins can manage all video requests"
    ON public.video_requests FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can view all transactions"
    ON public.transactions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ));

-- Add comments
COMMENT ON VIEW public.creator_stats IS 'Aggregated statistics for each creator including earnings, ratings, and completion metrics';
COMMENT ON VIEW public.platform_stats IS 'Platform-wide statistics including user counts, revenue, and overall metrics';