-- Create views for real-time statistics aggregation
-- These views will power the dashboards with real data

-- Fan stats view
CREATE OR REPLACE VIEW fan_stats AS
SELECT 
    p.id as user_id,
    p.email,
    p.user_role,
    COUNT(DISTINCT vr.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN vr.request_type = 'video_call' THEN vr.id END) as video_calls,
    COUNT(DISTINCT CASE WHEN ls.fan_id IS NOT NULL THEN ls.id END) as livestreams_watched,
    COALESCE(SUM(t.amount), 0)::numeric as total_spent,
    COUNT(DISTINCT CASE WHEN vr.status = 'pending' THEN vr.id END) as pending_requests,
    COUNT(DISTINCT CASE WHEN vr.status = 'completed' THEN vr.id END) as completed_requests
FROM profiles p
LEFT JOIN video_requests vr ON p.id = vr.fan_id
LEFT JOIN livestream_views ls ON p.id = ls.fan_id
LEFT JOIN transactions t ON vr.id = t.request_id AND t.status = 'completed'
WHERE p.user_role = 'fan'
GROUP BY p.id, p.email, p.user_role;

-- Creator stats view  
CREATE OR REPLACE VIEW creator_stats AS
SELECT
    p.id as creator_id,
    p.email,
    p.display_name,
    COALESCE(SUM(t.amount * 0.8), 0)::numeric as total_earnings, -- 80% after platform fee
    COUNT(DISTINCT CASE WHEN vr.status = 'pending' THEN vr.id END) as pending_requests,
    COUNT(DISTINCT CASE WHEN vr.status = 'completed' THEN vr.id END) as completed_videos,
    AVG(CASE WHEN vr.rating IS NOT NULL THEN vr.rating END)::numeric(3,1) as average_rating,
    COUNT(DISTINCT f.id) as follower_count,
    -- Monthly earnings
    COALESCE(SUM(CASE 
        WHEN t.created_at >= date_trunc('month', CURRENT_DATE) 
        THEN t.amount * 0.8 
    END), 0)::numeric as monthly_earnings,
    -- Today's earnings  
    COALESCE(SUM(CASE 
        WHEN t.created_at >= date_trunc('day', CURRENT_DATE)
        THEN t.amount * 0.8
    END), 0)::numeric as today_earnings,
    -- Response time (average in hours)
    AVG(EXTRACT(EPOCH FROM (vr.responded_at - vr.created_at))/3600)::numeric(5,1) as avg_response_time_hours,
    -- Completion rate
    CASE 
        WHEN COUNT(vr.id) > 0 
        THEN (COUNT(CASE WHEN vr.status = 'completed' THEN 1 END)::numeric / COUNT(vr.id) * 100)::numeric(5,2)
        ELSE 0
    END as completion_rate,
    -- Customer satisfaction (based on ratings >= 4)
    CASE 
        WHEN COUNT(CASE WHEN vr.rating IS NOT NULL THEN 1 END) > 0
        THEN (COUNT(CASE WHEN vr.rating >= 4 THEN 1 END)::numeric / COUNT(CASE WHEN vr.rating IS NOT NULL THEN 1 END) * 100)::numeric(5,2)
        ELSE 0
    END as customer_satisfaction
FROM profiles p
LEFT JOIN video_requests vr ON p.id = vr.creator_id
LEFT JOIN transactions t ON vr.id = t.request_id AND t.status = 'completed'
LEFT JOIN creator_followers f ON p.id = f.creator_id
WHERE p.user_role = 'creator'
GROUP BY p.id, p.email, p.display_name;

-- Admin/Platform stats view
CREATE OR REPLACE VIEW platform_stats AS
SELECT
    -- User metrics
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM profiles WHERE user_role = 'creator') as total_creators,
    (SELECT COUNT(*) FROM profiles WHERE user_role = 'fan') as total_fans,
    (SELECT COUNT(*) FROM video_requests WHERE status = 'completed') as total_videos,
    -- Financial metrics
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'completed')::numeric as total_revenue,
    -- Monthly growth (new users)
    (SELECT COUNT(*) FROM profiles WHERE created_at >= date_trunc('month', CURRENT_DATE))::int as new_users_this_month,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
        AND created_at < date_trunc('month', CURRENT_DATE))::int as new_users_last_month,
    -- Pending items
    (SELECT COUNT(*) FROM creator_applications WHERE status = 'pending') as pending_approvals,
    (SELECT COUNT(*) FROM video_requests WHERE status = 'pending') as active_orders,
    -- Platform rating
    (SELECT AVG(rating) FROM video_requests WHERE rating IS NOT NULL)::numeric(3,1) as average_rating,
    -- Weekly metrics
    (SELECT COUNT(*) FROM transactions WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' AND status = 'completed') as weekly_transactions,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' AND status = 'completed')::numeric as weekly_revenue;

-- Function to get weekly earnings for a creator (last 7 days)
CREATE OR REPLACE FUNCTION get_weekly_earnings(p_creator_id UUID)
RETURNS TABLE(day TEXT, amount NUMERIC) AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(
            CURRENT_DATE - INTERVAL '6 days',
            CURRENT_DATE,
            '1 day'::interval
        )::date AS date
    )
    SELECT 
        TO_CHAR(ds.date, 'Mon DD') as day,
        COALESCE(SUM(t.amount * 0.8), 0)::numeric as amount
    FROM date_series ds
    LEFT JOIN video_requests vr ON vr.creator_id = p_creator_id 
        AND DATE(vr.created_at) = ds.date
    LEFT JOIN transactions t ON t.request_id = vr.id 
        AND t.status = 'completed'
    GROUP BY ds.date
    ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming events for a fan
CREATE OR REPLACE FUNCTION get_upcoming_events(p_fan_id UUID)
RETURNS TABLE(
    id UUID,
    event_type TEXT,
    creator_name TEXT,
    scheduled_date TIMESTAMPTZ,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vr.id,
        vr.request_type as event_type,
        p.display_name as creator_name,
        vr.scheduled_date,
        vr.status
    FROM video_requests vr
    JOIN profiles p ON p.id = vr.creator_id
    WHERE vr.fan_id = p_fan_id
        AND vr.status IN ('pending', 'accepted')
        AND (vr.scheduled_date IS NULL OR vr.scheduled_date >= NOW())
    ORDER BY vr.scheduled_date ASC NULLS LAST, vr.created_at DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent activity for a fan
CREATE OR REPLACE FUNCTION get_recent_activity(p_fan_id UUID)
RETURNS TABLE(
    id UUID,
    activity_type TEXT,
    description TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vr.id,
        'booking' as activity_type,
        CONCAT('Booked video from ', p.display_name) as description,
        vr.created_at
    FROM video_requests vr
    JOIN profiles p ON p.id = vr.creator_id
    WHERE vr.fan_id = p_fan_id
    ORDER BY vr.created_at DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Function to get pending requests for a creator
CREATE OR REPLACE FUNCTION get_pending_requests(p_creator_id UUID)
RETURNS TABLE(
    id UUID,
    fan_name TEXT,
    request_type TEXT,
    occasion TEXT,
    price NUMERIC,
    created_at TIMESTAMPTZ,
    due_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vr.id,
        p.display_name as fan_name,
        vr.request_type,
        vr.occasion,
        vr.price,
        vr.created_at,
        vr.due_date
    FROM video_requests vr
    JOIN profiles p ON p.id = vr.fan_id
    WHERE vr.creator_id = p_creator_id
        AND vr.status = 'pending'
    ORDER BY vr.created_at ASC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Function to get top videos for a creator
CREATE OR REPLACE FUNCTION get_top_videos(p_creator_id UUID)
RETURNS TABLE(
    id UUID,
    title TEXT,
    views INT,
    rating NUMERIC,
    earnings NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vr.id,
        COALESCE(vr.occasion, vr.request_type) as title,
        COALESCE(vr.view_count, 0) as views,
        vr.rating,
        COALESCE(t.amount * 0.8, 0)::numeric as earnings
    FROM video_requests vr
    LEFT JOIN transactions t ON t.request_id = vr.id AND t.status = 'completed'
    WHERE vr.creator_id = p_creator_id
        AND vr.status = 'completed'
        AND vr.rating IS NOT NULL
    ORDER BY vr.rating DESC NULLS LAST, vr.view_count DESC NULLS LAST
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate monthly growth percentage
CREATE OR REPLACE FUNCTION get_monthly_growth()
RETURNS NUMERIC AS $$
DECLARE
    current_month_users INT;
    last_month_users INT;
    growth_percentage NUMERIC;
BEGIN
    SELECT COUNT(*) INTO current_month_users
    FROM profiles
    WHERE created_at >= date_trunc('month', CURRENT_DATE);
    
    SELECT COUNT(*) INTO last_month_users
    FROM profiles
    WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        AND created_at < date_trunc('month', CURRENT_DATE);
    
    IF last_month_users = 0 THEN
        IF current_month_users > 0 THEN
            RETURN 100.0;
        ELSE
            RETURN 0.0;
        END IF;
    ELSE
        growth_percentage := ((current_month_users - last_month_users)::NUMERIC / last_month_users * 100)::NUMERIC(5,2);
        RETURN growth_percentage;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_requests_fan_id ON video_requests(fan_id);
CREATE INDEX IF NOT EXISTS idx_video_requests_creator_id ON video_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_requests_status ON video_requests(status);
CREATE INDEX IF NOT EXISTS idx_transactions_request_id ON transactions(request_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_creator_followers_creator_id ON creator_followers(creator_id);

-- Grant appropriate permissions
GRANT SELECT ON fan_stats TO authenticated;
GRANT SELECT ON creator_stats TO authenticated;
GRANT SELECT ON platform_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_earnings TO authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_events TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_requests TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_videos TO authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_growth TO authenticated;