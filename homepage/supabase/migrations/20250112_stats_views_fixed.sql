-- Drop existing views if they exist (to recreate them)
DROP VIEW IF EXISTS public.creator_stats CASCADE;
DROP VIEW IF EXISTS public.platform_stats CASCADE;

-- Add missing columns to video_requests if they don't exist
DO $$ 
BEGIN
    -- Add platform_fee column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'video_requests' 
                   AND column_name = 'platform_fee') THEN
        ALTER TABLE public.video_requests 
        ADD COLUMN platform_fee DECIMAL(10, 2) DEFAULT 0 CHECK (platform_fee >= 0);
    END IF;
    
    -- Add creator_earnings as a computed column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'video_requests' 
                   AND column_name = 'creator_earnings') THEN
        ALTER TABLE public.video_requests 
        ADD COLUMN creator_earnings DECIMAL(10, 2) GENERATED ALWAYS AS (price - COALESCE(platform_fee, 0)) STORED;
    END IF;
END $$;

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
    COUNT(DISTINCT CASE WHEN vr.status IN ('cancelled', 'refunded') THEN vr.id END) AS cancelled_requests,
    
    -- Financial metrics (only completed transactions)
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN (vr.price - COALESCE(vr.platform_fee, 0)) ELSE 0 END), 0) AS total_earnings,
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
    
    -- Response time (average time to respond in hours)
    COALESCE(
        AVG(
            CASE 
                WHEN vr.responded_at IS NOT NULL AND vr.responded_at > vr.created_at 
                THEN EXTRACT(EPOCH FROM (vr.responded_at - vr.created_at)) / 3600
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
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN COALESCE(vr.platform_fee, vr.price * 0.2) END), 0) AS total_platform_fees,
    COALESCE(SUM(CASE WHEN vr.status = 'completed' THEN (vr.price - COALESCE(vr.platform_fee, vr.price * 0.2)) END), 0) AS total_creator_earnings,
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
LEFT JOIN public.video_requests vr ON (p.id = vr.creator_id OR p.id = vr.fan_id)
LEFT JOIN public.creator_subscription_tiers cst ON p.id = cst.creator_id AND cst.is_active = true
CROSS JOIN (SELECT 1) AS dummy_row -- Ensures we always get one row even with no data
GROUP BY dummy_row."?column?";

-- Grant permissions for views
GRANT SELECT ON public.creator_stats TO authenticated;
GRANT SELECT ON public.platform_stats TO authenticated;

-- Add comments
COMMENT ON VIEW public.creator_stats IS 'Aggregated statistics for each creator including earnings, ratings, and completion metrics';
COMMENT ON VIEW public.platform_stats IS 'Platform-wide statistics including user counts, revenue, and overall metrics';