-- ============================================
-- COMPLETE MIGRATION SCRIPT FOR SUPABASE
-- Run this in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql/new
-- ============================================

-- Step 1: Create platform_revenue table (if not exists)
CREATE TABLE IF NOT EXISTS platform_revenue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  amount decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) NOT NULL,
  creator_earnings decimal(10,2) NOT NULL,
  revenue_type text NOT NULL DEFAULT 'order',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_revenue_created_at ON platform_revenue(created_at);
CREATE INDEX IF NOT EXISTS idx_platform_revenue_order_id ON platform_revenue(order_id);

-- Step 2: Create daily_platform_stats table (if not exists)
CREATE TABLE IF NOT EXISTS daily_platform_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  total_orders integer DEFAULT 0,
  total_revenue decimal(10,2) DEFAULT 0,
  total_platform_fees decimal(10,2) DEFAULT 0,
  total_creator_earnings decimal(10,2) DEFAULT 0,
  new_users integer DEFAULT 0,
  new_creators integer DEFAULT 0,
  active_users integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_platform_stats_date ON daily_platform_stats(date);

-- Step 3: Create statistics_audit_log table (if not exists)
CREATE TABLE IF NOT EXISTS statistics_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  operation text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  changed_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Step 4: Create/Update trigger to track platform revenue
CREATE OR REPLACE FUNCTION track_platform_revenue()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO platform_revenue (
      order_id,
      amount,
      platform_fee,
      creator_earnings,
      revenue_type
    ) VALUES (
      NEW.id,
      NEW.amount,
      NEW.platform_fee,
      NEW.creator_earnings,
      'order'
    );
    
    -- Update daily stats
    INSERT INTO daily_platform_stats (date, total_orders, total_revenue, total_platform_fees, total_creator_earnings)
    VALUES (CURRENT_DATE, 1, NEW.amount, NEW.platform_fee, NEW.creator_earnings)
    ON CONFLICT (date) DO UPDATE SET
      total_orders = daily_platform_stats.total_orders + 1,
      total_revenue = daily_platform_stats.total_revenue + NEW.amount,
      total_platform_fees = daily_platform_stats.total_platform_fees + NEW.platform_fee,
      total_creator_earnings = daily_platform_stats.total_creator_earnings + NEW.creator_earnings,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS track_platform_revenue_trigger ON orders;
CREATE TRIGGER track_platform_revenue_trigger
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION track_platform_revenue();

-- Step 5: Create materialized view for creator rankings
DROP MATERIALIZED VIEW IF EXISTS creator_rankings_mv;
CREATE MATERIALIZED VIEW creator_rankings_mv AS
SELECT 
  cs.creator_id,
  p.display_name,
  p.avatar_url,
  p.bio,
  p.price,
  p.categories,
  p.is_verified,
  p.response_time,
  cs.total_earnings,
  cs.total_orders,
  cs.completed_orders,
  cs.average_rating,
  cs.completion_rate,
  RANK() OVER (ORDER BY cs.total_earnings DESC) as earnings_rank,
  RANK() OVER (ORDER BY cs.average_rating DESC NULLS LAST) as rating_rank,
  RANK() OVER (ORDER BY cs.completed_orders DESC) as volume_rank,
  p.created_at
FROM creator_stats cs
JOIN profiles p ON p.id = cs.creator_id
WHERE p.user_role = 'creator';

CREATE UNIQUE INDEX IF NOT EXISTS idx_creator_rankings_mv_creator_id ON creator_rankings_mv(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_rankings_mv_earnings_rank ON creator_rankings_mv(earnings_rank);
CREATE INDEX IF NOT EXISTS idx_creator_rankings_mv_rating_rank ON creator_rankings_mv(rating_rank);

-- Step 6: Enable RLS on all statistics tables
ALTER TABLE creator_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics_audit_log ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for creator_stats
DROP POLICY IF EXISTS "Creators can view own stats" ON creator_stats;
DROP POLICY IF EXISTS "System can manage creator stats" ON creator_stats;

CREATE POLICY "Creators can view own stats"
ON creator_stats FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);

CREATE POLICY "System can manage creator stats"
ON creator_stats FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 8: Create RLS policies for platform_revenue
DROP POLICY IF EXISTS "Admins can view platform revenue" ON platform_revenue;
DROP POLICY IF EXISTS "System can insert platform revenue" ON platform_revenue;

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

CREATE POLICY "System can insert platform revenue"
ON platform_revenue FOR INSERT
TO service_role
WITH CHECK (true);

-- Step 9: Create RLS policies for daily_platform_stats
DROP POLICY IF EXISTS "Admins can view daily platform stats" ON daily_platform_stats;
DROP POLICY IF EXISTS "System can manage daily platform stats" ON daily_platform_stats;

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

CREATE POLICY "System can manage daily platform stats"
ON daily_platform_stats FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 10: Create RLS policies for statistics_audit_log
DROP POLICY IF EXISTS "Admins can view statistics audit logs" ON statistics_audit_log;

CREATE POLICY "Admins can view statistics audit logs"
ON statistics_audit_log FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.user_role = 'admin'
  )
);

-- Step 11: Grant necessary permissions
GRANT SELECT ON creator_stats TO authenticated;
GRANT SELECT ON platform_revenue TO authenticated;
GRANT SELECT ON daily_platform_stats TO authenticated;
GRANT SELECT ON statistics_audit_log TO authenticated;
GRANT SELECT ON creator_rankings_mv TO authenticated;

GRANT ALL ON creator_stats TO service_role;
GRANT ALL ON platform_revenue TO service_role;
GRANT ALL ON daily_platform_stats TO service_role;
GRANT ALL ON statistics_audit_log TO service_role;

-- Step 12: Create helper functions
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

-- Step 13: Create audit logging trigger
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

DROP TRIGGER IF EXISTS audit_creator_stats_changes ON creator_stats;
CREATE TRIGGER audit_creator_stats_changes
AFTER INSERT OR UPDATE ON creator_stats
FOR EACH ROW
EXECUTE FUNCTION log_statistics_changes();

DROP TRIGGER IF EXISTS audit_platform_revenue_changes ON platform_revenue;
CREATE TRIGGER audit_platform_revenue_changes
AFTER INSERT ON platform_revenue
FOR EACH ROW
EXECUTE FUNCTION log_statistics_changes();

-- Step 14: Add data validation constraints
ALTER TABLE creator_stats DROP CONSTRAINT IF EXISTS check_positive_earnings;
ALTER TABLE creator_stats DROP CONSTRAINT IF EXISTS check_positive_orders;
ALTER TABLE creator_stats DROP CONSTRAINT IF EXISTS check_valid_completion_rate;
ALTER TABLE creator_stats DROP CONSTRAINT IF EXISTS check_valid_rating;

ALTER TABLE creator_stats
ADD CONSTRAINT check_positive_earnings CHECK (total_earnings >= 0),
ADD CONSTRAINT check_positive_orders CHECK (total_orders >= 0),
ADD CONSTRAINT check_valid_completion_rate CHECK (completion_rate >= 0 AND completion_rate <= 100),
ADD CONSTRAINT check_valid_rating CHECK (average_rating >= 0 AND average_rating <= 5);

ALTER TABLE platform_revenue DROP CONSTRAINT IF EXISTS check_positive_amounts;
ALTER TABLE platform_revenue
ADD CONSTRAINT check_positive_amounts CHECK (
  amount >= 0 AND 
  platform_fee >= 0 AND 
  creator_earnings >= 0
);

ALTER TABLE daily_platform_stats DROP CONSTRAINT IF EXISTS check_positive_stats;
ALTER TABLE daily_platform_stats
ADD CONSTRAINT check_positive_stats CHECK (
  total_orders >= 0 AND
  total_revenue >= 0 AND
  new_users >= 0 AND
  new_creators >= 0
);

-- Step 15: Refresh materialized view function
CREATE OR REPLACE FUNCTION refresh_creator_rankings()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY creator_rankings_mv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION refresh_creator_rankings() TO service_role;

-- ============================================
-- VERIFICATION QUERIES
-- Run these after applying migrations to verify
-- ============================================

-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('platform_revenue', 'daily_platform_stats', 'statistics_audit_log')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('creator_stats', 'platform_revenue', 'daily_platform_stats', 'statistics_audit_log')
ORDER BY tablename;

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('creator_stats', 'platform_revenue', 'daily_platform_stats')
ORDER BY tablename, policyname;

-- Check materialized view exists
SELECT matviewname FROM pg_matviews 
WHERE schemaname = 'public' 
AND matviewname = 'creator_rankings_mv';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If all verification queries return results, 
-- the migration has been successfully applied!
-- ============================================