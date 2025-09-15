-- Analytics Performance Indexes
-- Created: 2025-09-12
-- Optimizes query performance for analytics operations

-- Indexes for creator_revenue_analytics table
CREATE INDEX IF NOT EXISTS idx_creator_revenue_analytics_creator_date 
ON creator_revenue_analytics(creator_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_creator_revenue_analytics_date_revenue 
ON creator_revenue_analytics(date DESC, total_revenue DESC) 
WHERE total_revenue > 0;

CREATE INDEX IF NOT EXISTS idx_creator_revenue_analytics_creator_month
ON creator_revenue_analytics(creator_id, date_trunc('month', date));

-- Indexes for creator_occasion_analytics table
CREATE INDEX IF NOT EXISTS idx_creator_occasion_analytics_creator_date 
ON creator_occasion_analytics(creator_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_creator_occasion_analytics_occasion_revenue
ON creator_occasion_analytics(creator_id, occasion_type, revenue DESC)
WHERE revenue > 0;

CREATE INDEX IF NOT EXISTS idx_creator_occasion_analytics_date_range
ON creator_occasion_analytics(creator_id, date DESC, occasion_type)
WHERE revenue > 0;

-- Indexes for creator_monthly_analytics table
CREATE INDEX IF NOT EXISTS idx_creator_monthly_analytics_creator_month
ON creator_monthly_analytics(creator_id, month DESC);

CREATE INDEX IF NOT EXISTS idx_creator_monthly_analytics_revenue
ON creator_monthly_analytics(total_revenue DESC, month DESC)
WHERE total_revenue > 0;

-- Composite index for date range queries
CREATE INDEX IF NOT EXISTS idx_creator_analytics_date_range
ON creator_revenue_analytics(creator_id, date, total_revenue)
WHERE total_revenue > 0;

-- Index for video_requests analytics processing
CREATE INDEX IF NOT EXISTS idx_video_requests_analytics_processing
ON video_requests(creator_id, status, analytics_processed, updated_at)
WHERE status = 'completed' AND analytics_processed = false;

-- Index for recent orders (for real-time updates)
CREATE INDEX IF NOT EXISTS idx_video_requests_recent_completed
ON video_requests(creator_id, updated_at DESC, creator_earnings)
WHERE status = 'completed' AND creator_earnings > 0;

-- Partial index for active creators with recent revenue
CREATE INDEX IF NOT EXISTS idx_active_creators_recent_revenue
ON creator_revenue_analytics(creator_id, date DESC)
WHERE date >= CURRENT_DATE - INTERVAL '90 days' AND total_revenue > 0;

-- Index for occasion categorization lookups
CREATE INDEX IF NOT EXISTS idx_video_requests_occasion_category
ON video_requests(occasion, occasion_category, status)
WHERE status = 'completed';

-- Analyze tables to update statistics
ANALYZE creator_revenue_analytics;
ANALYZE creator_occasion_analytics;
ANALYZE creator_monthly_analytics;
ANALYZE video_requests;

-- Create a function to refresh analytics materialized view efficiently
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Refresh the materialized view concurrently if possible
    BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY revenue_analytics_summary;
    EXCEPTION WHEN OTHERS THEN
        -- Fall back to regular refresh if concurrent refresh fails
        REFRESH MATERIALIZED VIEW revenue_analytics_summary;
    END;
    
    -- Update table statistics
    ANALYZE creator_revenue_analytics;
    ANALYZE creator_occasion_analytics;
    ANALYZE creator_monthly_analytics;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION refresh_analytics_views() TO authenticated;

-- Comment on indexes for documentation
COMMENT ON INDEX idx_creator_revenue_analytics_creator_date IS 'Primary index for creator daily analytics queries';
COMMENT ON INDEX idx_creator_occasion_analytics_creator_date IS 'Primary index for creator occasion analytics queries';
COMMENT ON INDEX idx_creator_monthly_analytics_creator_month IS 'Primary index for creator monthly analytics queries';
COMMENT ON INDEX idx_video_requests_analytics_processing IS 'Index for processing unprocessed video requests';
COMMENT ON INDEX idx_active_creators_recent_revenue IS 'Partial index for active creators with recent revenue';