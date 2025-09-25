-- =========================================
-- FIX CREATOR STATS VIEW FOR DUAL ROLES
-- =========================================
-- Updates the existing creator_stats view to include dual-role users
-- This fixes the 406 error for users with role='fan' and is_creator=true

-- Drop the existing view
DROP VIEW IF EXISTS public.creator_stats CASCADE;

-- Recreate the view to include dual-role users
CREATE VIEW public.creator_stats AS
SELECT
    p.id AS creator_id,
    p.email AS creator_email,
    p.display_name AS creator_name,
    COUNT(DISTINCT vr.id) AS total_requests,
    COUNT(DISTINCT CASE
        WHEN vr.status = 'completed' THEN vr.id
    END) AS completed_videos,
    COUNT(DISTINCT CASE
        WHEN vr.status = 'pending' THEN vr.id
    END) AS pending_requests,
    COUNT(DISTINCT CASE
        WHEN vr.status IN ('cancelled', 'refunded') THEN vr.id
    END) AS cancelled_requests,
    COALESCE(SUM(CASE
        WHEN vr.status = 'completed' THEN vr.creator_earnings
        ELSE 0
    END), 0) AS total_earnings,
    COALESCE(SUM(CASE
        WHEN vr.status = 'completed' THEN vr.price
        ELSE 0
    END), 0) AS total_revenue,
    COALESCE(AVG(CASE
        WHEN vr.status = 'completed' THEN vr.price
    END), 0) AS average_price,
    COALESCE(AVG(CASE
        WHEN vr.rating IS NOT NULL THEN vr.rating
    END), 0) AS average_rating,
    COUNT(DISTINCT CASE
        WHEN vr.rating IS NOT NULL THEN vr.id
    END) AS total_reviews,
    COUNT(DISTINCT CASE
        WHEN vr.rating >= 4 THEN vr.id
    END) AS positive_reviews,
    CASE
        WHEN COUNT(DISTINCT vr.id) > 0
        THEN (COUNT(DISTINCT CASE WHEN vr.status = 'completed' THEN vr.id END)::DECIMAL / COUNT(DISTINCT vr.id)) * 100
        ELSE 0
    END AS completion_rate,
    COALESCE(AVG(CASE
        WHEN vr.responded_at IS NOT NULL AND vr.responded_at > vr.created_at
        THEN EXTRACT(EPOCH FROM (vr.responded_at - vr.created_at)) / 3600
    END), 0) AS avg_response_time_hours,
    COUNT(DISTINCT cst.id) AS total_subscription_tiers,
    COUNT(DISTINCT CASE
        WHEN cst.is_active = TRUE THEN cst.id
    END) AS active_subscription_tiers,
    COALESCE(MIN(cst.price), 0) AS min_tier_price,
    COALESCE(MAX(cst.price), 0) AS max_tier_price,
    MIN(vr.created_at) AS first_request_date,
    MAX(vr.created_at) AS last_request_date,
    MAX(CASE
        WHEN vr.status = 'completed' THEN vr.completed_at
    END) AS last_completed_date
FROM profiles p
LEFT JOIN video_requests vr ON p.id = vr.creator_id
LEFT JOIN creator_subscription_tiers cst ON p.id = cst.creator_id
WHERE
    -- Include both traditional creators and dual-role users
    p.role = 'creator' OR p.is_creator = TRUE
GROUP BY p.id, p.email, p.display_name;

-- Grant permissions
GRANT SELECT ON public.creator_stats TO authenticated;

-- Add comments for documentation
COMMENT ON VIEW public.creator_stats IS 'Statistics view for all users with creator capabilities (includes dual-role users)';
COMMENT ON COLUMN public.creator_stats.creator_id IS 'Reference to the creator profile';
COMMENT ON COLUMN public.creator_stats.total_earnings IS 'Total earnings from completed orders';
COMMENT ON COLUMN public.creator_stats.average_rating IS 'Average rating from customer reviews';