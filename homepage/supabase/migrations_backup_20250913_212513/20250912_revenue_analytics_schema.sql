-- Revenue Analytics Database Schema
-- Created: 2025-09-12
-- Purpose: Create analytics tables for creator revenue tracking and reporting

-- Main daily revenue analytics table
CREATE TABLE IF NOT EXISTS creator_revenue_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    video_request_revenue DECIMAL(10,2) DEFAULT 0,
    subscription_revenue DECIMAL(10,2) DEFAULT 0,
    platform_fees DECIMAL(10,2) DEFAULT 0,
    net_earnings DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(creator_id, date)
);

-- Occasion type analytics for revenue breakdown
CREATE TABLE IF NOT EXISTS creator_occasion_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    occasion_type TEXT NOT NULL,
    date DATE NOT NULL,
    revenue DECIMAL(10,2) DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(creator_id, occasion_type, date)
);

-- Monthly aggregated analytics for performance tracking
CREATE TABLE IF NOT EXISTS creator_monthly_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    month DATE NOT NULL, -- First day of month (YYYY-MM-01)
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    revenue_growth_percentage DECIMAL(5,2) DEFAULT 0,
    order_growth_percentage DECIMAL(5,2) DEFAULT 0,
    previous_month_revenue DECIMAL(10,2) DEFAULT 0,
    previous_month_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(creator_id, month)
);

-- Add analytics columns to existing video_requests table
ALTER TABLE video_requests 
ADD COLUMN IF NOT EXISTS occasion_category TEXT,
ADD COLUMN IF NOT EXISTS analytics_processed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

-- Add analytics columns to existing subscription_orders table (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription_orders') THEN
        ALTER TABLE subscription_orders 
        ADD COLUMN IF NOT EXISTS analytics_processed BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_creator_revenue_analytics_creator_date 
ON creator_revenue_analytics(creator_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_creator_revenue_analytics_date 
ON creator_revenue_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_creator_occasion_analytics_creator_date 
ON creator_occasion_analytics(creator_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_creator_occasion_analytics_type 
ON creator_occasion_analytics(creator_id, occasion_type, date DESC);

CREATE INDEX IF NOT EXISTS idx_creator_monthly_analytics_creator_month 
ON creator_monthly_analytics(creator_id, month DESC);

CREATE INDEX IF NOT EXISTS idx_video_requests_analytics 
ON video_requests(creator_id, status, analytics_processed);

CREATE INDEX IF NOT EXISTS idx_video_requests_occasion_category 
ON video_requests(creator_id, occasion_category, created_at DESC);

-- Create materialized view for quick revenue summaries
CREATE MATERIALIZED VIEW IF NOT EXISTS creator_revenue_summary AS
SELECT 
    vr.creator_id,
    DATE(vr.created_at) as date,
    SUM(vr.creator_earnings) as daily_revenue,
    COUNT(*) as daily_orders,
    AVG(vr.creator_earnings) as avg_order_value,
    vr.occasion_category,
    COUNT(*) FILTER (WHERE vr.status = 'completed') as completed_orders,
    SUM(vr.creator_earnings) FILTER (WHERE vr.status = 'completed') as completed_revenue
FROM video_requests vr
WHERE vr.creator_earnings > 0
GROUP BY vr.creator_id, DATE(vr.created_at), vr.occasion_category;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_creator_revenue_summary_unique 
ON creator_revenue_summary(creator_id, date, COALESCE(occasion_category, ''));

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_revenue_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY creator_revenue_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to categorize occasions automatically
CREATE OR REPLACE FUNCTION categorize_occasion(occasion_text TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Convert to lowercase for comparison
    occasion_text := LOWER(TRIM(occasion_text));
    
    -- Birthday category
    IF occasion_text LIKE '%birthday%' OR 
       occasion_text LIKE '%bday%' OR 
       occasion_text LIKE '%born day%' OR
       occasion_text LIKE '%birth day%' THEN
        RETURN 'birthday';
    END IF;
    
    -- Anniversary category
    IF occasion_text LIKE '%anniversary%' OR 
       occasion_text LIKE '%wedding%' OR 
       occasion_text LIKE '%marriage%' OR
       occasion_text LIKE '%married%' THEN
        RETURN 'anniversary';
    END IF;
    
    -- Graduation category
    IF occasion_text LIKE '%graduation%' OR 
       occasion_text LIKE '%graduate%' OR 
       occasion_text LIKE '%diploma%' OR
       occasion_text LIKE '%degree%' THEN
        RETURN 'graduation';
    END IF;
    
    -- Holiday category
    IF occasion_text LIKE '%christmas%' OR 
       occasion_text LIKE '%holiday%' OR 
       occasion_text LIKE '%thanksgiving%' OR
       occasion_text LIKE '%valentine%' OR
       occasion_text LIKE '%easter%' THEN
        RETURN 'holiday';
    END IF;
    
    -- Custom/special category
    IF occasion_text LIKE '%custom%' OR 
       occasion_text LIKE '%special%' OR 
       occasion_text LIKE '%personal%' OR
       occasion_text LIKE '%congratulation%' THEN
        RETURN 'custom';
    END IF;
    
    -- Default to 'other'
    RETURN 'other';
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically categorize occasions on insert/update
CREATE OR REPLACE FUNCTION auto_categorize_occasion()
RETURNS TRIGGER AS $$
BEGIN
    -- Only categorize if not already set or if occasion field changed
    IF NEW.occasion_category IS NULL OR 
       (OLD.occasion IS DISTINCT FROM NEW.occasion AND NEW.occasion IS NOT NULL) THEN
        NEW.occasion_category := categorize_occasion(NEW.occasion);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for video_requests
DROP TRIGGER IF EXISTS trigger_auto_categorize_occasion ON video_requests;
CREATE TRIGGER trigger_auto_categorize_occasion
    BEFORE INSERT OR UPDATE ON video_requests
    FOR EACH ROW
    EXECUTE FUNCTION auto_categorize_occasion();

-- Function to update analytics when orders change
CREATE OR REPLACE FUNCTION update_revenue_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process completed orders with earnings
    IF NEW.status = 'completed' AND NEW.creator_earnings > 0 AND NOT NEW.analytics_processed THEN
        
        -- Insert or update daily analytics
        INSERT INTO creator_revenue_analytics (
            creator_id, date, total_revenue, total_orders, video_request_revenue, net_earnings
        ) VALUES (
            NEW.creator_id, 
            DATE(NEW.updated_at), 
            NEW.creator_earnings, 
            1, 
            NEW.creator_earnings, 
            NEW.creator_earnings
        )
        ON CONFLICT (creator_id, date) 
        DO UPDATE SET
            total_revenue = creator_revenue_analytics.total_revenue + NEW.creator_earnings,
            total_orders = creator_revenue_analytics.total_orders + 1,
            video_request_revenue = creator_revenue_analytics.video_request_revenue + NEW.creator_earnings,
            net_earnings = creator_revenue_analytics.net_earnings + NEW.creator_earnings,
            updated_at = NOW();
        
        -- Insert or update occasion analytics
        INSERT INTO creator_occasion_analytics (
            creator_id, occasion_type, date, revenue, order_count, avg_order_value
        ) VALUES (
            NEW.creator_id,
            COALESCE(NEW.occasion_category, 'other'),
            DATE(NEW.updated_at),
            NEW.creator_earnings,
            1,
            NEW.creator_earnings
        )
        ON CONFLICT (creator_id, occasion_type, date)
        DO UPDATE SET
            revenue = creator_occasion_analytics.revenue + NEW.creator_earnings,
            order_count = creator_occasion_analytics.order_count + 1,
            avg_order_value = (creator_occasion_analytics.revenue + NEW.creator_earnings) / 
                             (creator_occasion_analytics.order_count + 1),
            updated_at = NOW();
        
        -- Mark as processed
        NEW.analytics_processed := TRUE;
        NEW.processed_at := NOW();
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics updates
DROP TRIGGER IF EXISTS trigger_update_revenue_analytics ON video_requests;
CREATE TRIGGER trigger_update_revenue_analytics
    BEFORE UPDATE ON video_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_revenue_analytics();

-- Enable Row Level Security on analytics tables
ALTER TABLE creator_revenue_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_occasion_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_monthly_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics tables
CREATE POLICY "Creators can view their own analytics" ON creator_revenue_analytics
    FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "System can manage analytics" ON creator_revenue_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'system')
        )
    );

CREATE POLICY "Creators can view their occasion analytics" ON creator_occasion_analytics
    FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "System can manage occasion analytics" ON creator_occasion_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'system')
        )
    );

CREATE POLICY "Creators can view their monthly analytics" ON creator_monthly_analytics
    FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "System can manage monthly analytics" ON creator_monthly_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'system')
        )
    );

-- Grant necessary permissions
GRANT SELECT ON creator_revenue_analytics TO authenticated;
GRANT SELECT ON creator_occasion_analytics TO authenticated;
GRANT SELECT ON creator_monthly_analytics TO authenticated;
GRANT SELECT ON creator_revenue_summary TO authenticated;

-- Create comments for documentation
COMMENT ON TABLE creator_revenue_analytics IS 'Daily revenue analytics aggregated by creator';
COMMENT ON TABLE creator_occasion_analytics IS 'Revenue breakdown by occasion type per creator';
COMMENT ON TABLE creator_monthly_analytics IS 'Monthly performance metrics and growth calculations';
COMMENT ON FUNCTION categorize_occasion IS 'Automatically categorizes occasion text into predefined types';
COMMENT ON FUNCTION refresh_revenue_summary IS 'Refreshes the materialized view for revenue summaries';