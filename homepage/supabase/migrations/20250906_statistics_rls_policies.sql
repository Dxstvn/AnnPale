-- Enable RLS on statistics tables
ALTER TABLE creator_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_platform_stats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATOR STATS POLICIES
-- ============================================

-- Creators can view their own stats
CREATE POLICY "Creators can view own stats"
ON creator_stats FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);

-- System can insert/update creator stats (for triggers)
CREATE POLICY "System can manage creator stats"
ON creator_stats FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- PLATFORM REVENUE POLICIES
-- ============================================

-- Only admins can view platform revenue
CREATE POLICY "Admins can view platform revenue"
ON platform_revenue FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_role = 'admin'
  )
);

-- System can insert platform revenue records
CREATE POLICY "System can insert platform revenue"
ON platform_revenue FOR INSERT
TO service_role
WITH CHECK (true);

-- ============================================
-- DAILY PLATFORM STATS POLICIES
-- ============================================

-- Only admins can view daily platform stats
CREATE POLICY "Admins can view daily platform stats"
ON daily_platform_stats FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_role = 'admin'
  )
);

-- System can manage daily platform stats
CREATE POLICY "System can manage daily platform stats"
ON daily_platform_stats FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT SELECT ON creator_stats TO authenticated;
GRANT SELECT ON platform_revenue TO authenticated;
GRANT SELECT ON daily_platform_stats TO authenticated;

-- Grant all permissions to service role for system operations
GRANT ALL ON creator_stats TO service_role;
GRANT ALL ON platform_revenue TO service_role;
GRANT ALL ON daily_platform_stats TO service_role;

-- ============================================
-- ADDITIONAL SECURITY POLICIES
-- ============================================

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is creator
CREATE OR REPLACE FUNCTION is_creator()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_role = 'creator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MATERIALIZED VIEW PERMISSIONS
-- ============================================

-- Grant permissions on the creator rankings view
GRANT SELECT ON creator_rankings_mv TO authenticated;

-- Create policy function for creator rankings
CREATE OR REPLACE FUNCTION can_view_creator_rankings()
RETURNS boolean AS $$
BEGIN
  -- Everyone can view public creator rankings
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AUDIT LOGGING FOR STATISTICS
-- ============================================

-- Create audit log table for tracking statistics changes
CREATE TABLE IF NOT EXISTS statistics_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  operation text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  changed_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE statistics_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view statistics audit logs"
ON statistics_audit_log FOR SELECT
TO authenticated
USING (is_admin());

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION log_statistics_changes()
RETURNS trigger AS $$
BEGIN
  INSERT INTO statistics_audit_log (table_name, operation, user_id, changed_data)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to statistics tables
CREATE TRIGGER audit_creator_stats_changes
AFTER INSERT OR UPDATE ON creator_stats
FOR EACH ROW
EXECUTE FUNCTION log_statistics_changes();

CREATE TRIGGER audit_platform_revenue_changes
AFTER INSERT ON platform_revenue
FOR EACH ROW
EXECUTE FUNCTION log_statistics_changes();

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_creator_stats_creator_id ON creator_stats(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_stats_updated_at ON creator_stats(updated_at);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_created_at ON platform_revenue(created_at);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_order_id ON platform_revenue(order_id);
CREATE INDEX IF NOT EXISTS idx_daily_platform_stats_date ON daily_platform_stats(date);

-- ============================================
-- DATA VALIDATION CONSTRAINTS
-- ============================================

-- Add check constraints to ensure data integrity
ALTER TABLE creator_stats
ADD CONSTRAINT check_positive_earnings CHECK (total_earnings >= 0),
ADD CONSTRAINT check_positive_orders CHECK (total_orders >= 0),
ADD CONSTRAINT check_valid_completion_rate CHECK (completion_rate >= 0 AND completion_rate <= 100),
ADD CONSTRAINT check_valid_rating CHECK (average_rating >= 0 AND average_rating <= 5);

ALTER TABLE platform_revenue
ADD CONSTRAINT check_positive_amounts CHECK (
  amount >= 0 AND 
  platform_fee >= 0 AND 
  creator_earnings >= 0
);

ALTER TABLE daily_platform_stats
ADD CONSTRAINT check_positive_stats CHECK (
  total_orders >= 0 AND
  total_revenue >= 0 AND
  new_users >= 0 AND
  new_creators >= 0
);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE creator_stats IS 'Aggregated statistics for each creator including earnings, orders, and performance metrics';
COMMENT ON TABLE platform_revenue IS 'Platform revenue tracking for each transaction';
COMMENT ON TABLE daily_platform_stats IS 'Daily aggregated platform-wide statistics';
COMMENT ON TABLE statistics_audit_log IS 'Audit log for tracking changes to statistics tables';

COMMENT ON COLUMN creator_stats.total_earnings IS 'Total lifetime earnings for the creator';
COMMENT ON COLUMN creator_stats.completion_rate IS 'Percentage of orders completed successfully (0-100)';
COMMENT ON COLUMN creator_stats.average_rating IS 'Average rating from completed orders (0-5)';

COMMENT ON COLUMN platform_revenue.platform_fee IS 'Platform commission (30% of order amount)';
COMMENT ON COLUMN platform_revenue.creator_earnings IS 'Creator earnings (70% of order amount)';

-- ============================================
-- REFRESH MATERIALIZED VIEW FUNCTION
-- ============================================

-- Create function to refresh creator rankings
CREATE OR REPLACE FUNCTION refresh_creator_rankings()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY creator_rankings_mv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION refresh_creator_rankings() TO service_role;

-- Create scheduled job to refresh rankings (requires pg_cron extension)
-- This would be set up in Supabase dashboard or via API
-- SELECT cron.schedule('refresh-creator-rankings', '0 */6 * * *', 'SELECT refresh_creator_rankings()');