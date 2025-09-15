-- Statistics Tables for Ann Pale Platform
-- Tracks creator performance metrics and platform revenue

-- 1. Creator Statistics Table
CREATE TABLE IF NOT EXISTS creator_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Order metrics
  total_orders INTEGER DEFAULT 0,
  pending_orders INTEGER DEFAULT 0,
  accepted_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  rejected_orders INTEGER DEFAULT 0,
  refunded_orders INTEGER DEFAULT 0,
  
  -- Financial metrics
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  pending_earnings DECIMAL(10, 2) DEFAULT 0.00,
  available_balance DECIMAL(10, 2) DEFAULT 0.00,
  total_refunds DECIMAL(10, 2) DEFAULT 0.00,
  
  -- Performance metrics
  average_completion_time INTERVAL,
  completion_rate DECIMAL(5, 2) DEFAULT 0.00, -- Percentage
  acceptance_rate DECIMAL(5, 2) DEFAULT 0.00, -- Percentage
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  
  -- Time tracking
  last_order_at TIMESTAMPTZ,
  last_payout_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one stats row per creator
  CONSTRAINT unique_creator_stats UNIQUE(creator_id)
);

-- 2. Platform Revenue Table
CREATE TABLE IF NOT EXISTS platform_revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Transaction reference
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  payment_intent_id TEXT,
  
  -- Financial data
  platform_fee DECIMAL(10, 2) NOT NULL,
  stripe_fee DECIMAL(10, 2) DEFAULT 0.00,
  net_revenue DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'refunded', 'partial_refund')),
  refund_amount DECIMAL(10, 2) DEFAULT 0.00,
  
  -- Metadata
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  fan_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Daily Statistics Aggregation (for reporting)
CREATE TABLE IF NOT EXISTS daily_platform_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  
  -- Order metrics
  total_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  refunded_orders INTEGER DEFAULT 0,
  
  -- Financial metrics
  gross_revenue DECIMAL(10, 2) DEFAULT 0.00,
  platform_fees DECIMAL(10, 2) DEFAULT 0.00,
  stripe_fees DECIMAL(10, 2) DEFAULT 0.00,
  net_revenue DECIMAL(10, 2) DEFAULT 0.00,
  total_refunds DECIMAL(10, 2) DEFAULT 0.00,
  
  -- User metrics
  active_creators INTEGER DEFAULT 0,
  active_fans INTEGER DEFAULT 0,
  new_creators INTEGER DEFAULT 0,
  new_fans INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one row per day
  CONSTRAINT unique_daily_stats UNIQUE(date)
);

-- Indexes for performance
CREATE INDEX idx_creator_stats_creator_id ON creator_stats(creator_id);
CREATE INDEX idx_creator_stats_updated_at ON creator_stats(updated_at);
CREATE INDEX idx_platform_revenue_order_id ON platform_revenue(order_id);
CREATE INDEX idx_platform_revenue_created_at ON platform_revenue(created_at);
CREATE INDEX idx_platform_revenue_creator_id ON platform_revenue(creator_id);
CREATE INDEX idx_daily_platform_stats_date ON daily_platform_stats(date);

-- Function to update creator stats
CREATE OR REPLACE FUNCTION update_creator_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize stats if not exists
  INSERT INTO creator_stats (creator_id)
  VALUES (NEW.creator_id)
  ON CONFLICT (creator_id) DO NOTHING;
  
  -- Update stats based on order status
  IF TG_OP = 'INSERT' THEN
    UPDATE creator_stats
    SET 
      total_orders = total_orders + 1,
      pending_orders = pending_orders + 1,
      last_order_at = NOW(),
      updated_at = NOW()
    WHERE creator_id = NEW.creator_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status transitions
    IF OLD.status != NEW.status THEN
      UPDATE creator_stats
      SET
        pending_orders = CASE 
          WHEN OLD.status = 'pending' THEN pending_orders - 1
          WHEN NEW.status = 'pending' THEN pending_orders + 1
          ELSE pending_orders
        END,
        accepted_orders = CASE
          WHEN OLD.status = 'accepted' THEN accepted_orders - 1
          WHEN NEW.status = 'accepted' THEN accepted_orders + 1
          ELSE accepted_orders
        END,
        completed_orders = CASE
          WHEN OLD.status = 'completed' THEN completed_orders - 1
          WHEN NEW.status = 'completed' THEN completed_orders + 1
          ELSE completed_orders
        END,
        rejected_orders = CASE
          WHEN OLD.status = 'rejected' THEN rejected_orders - 1
          WHEN NEW.status = 'rejected' THEN rejected_orders + 1
          ELSE rejected_orders
        END,
        refunded_orders = CASE
          WHEN OLD.status = 'refunded' THEN refunded_orders - 1
          WHEN NEW.status = 'refunded' THEN refunded_orders + 1
          ELSE refunded_orders
        END,
        total_earnings = CASE
          WHEN NEW.status = 'completed' THEN total_earnings + NEW.creator_earnings
          WHEN OLD.status = 'completed' AND NEW.status = 'refunded' THEN total_earnings - OLD.creator_earnings
          ELSE total_earnings
        END,
        pending_earnings = CASE
          WHEN NEW.status IN ('accepted', 'in_progress') THEN pending_earnings + NEW.creator_earnings
          WHEN OLD.status IN ('accepted', 'in_progress') AND NEW.status IN ('completed', 'refunded', 'rejected') 
            THEN pending_earnings - OLD.creator_earnings
          ELSE pending_earnings
        END,
        total_refunds = CASE
          WHEN NEW.status = 'refunded' THEN total_refunds + NEW.creator_earnings
          ELSE total_refunds
        END,
        updated_at = NOW()
      WHERE creator_id = NEW.creator_id;
      
      -- Update completion rate
      UPDATE creator_stats
      SET
        completion_rate = CASE
          WHEN (completed_orders + rejected_orders) > 0 
          THEN (completed_orders::DECIMAL / (completed_orders + rejected_orders)) * 100
          ELSE 0
        END,
        acceptance_rate = CASE
          WHEN total_orders > 0
          THEN ((total_orders - rejected_orders)::DECIMAL / total_orders) * 100
          ELSE 0
        END
      WHERE creator_id = NEW.creator_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to record platform revenue
CREATE OR REPLACE FUNCTION record_platform_revenue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.platform_fee > 0 THEN
    -- Record platform revenue when order is created
    INSERT INTO platform_revenue (
      order_id,
      payment_intent_id,
      platform_fee,
      net_revenue,
      creator_id,
      fan_id,
      status,
      metadata
    ) VALUES (
      NEW.id,
      NEW.payment_intent_id,
      NEW.platform_fee,
      NEW.platform_fee, -- Net revenue equals platform fee initially
      NEW.creator_id,
      NEW.user_id,
      'completed',
      NEW.metadata
    );
    
    -- Update daily stats
    INSERT INTO daily_platform_stats (date, total_orders, gross_revenue, platform_fees, net_revenue)
    VALUES (
      CURRENT_DATE,
      1,
      NEW.amount,
      NEW.platform_fee,
      NEW.platform_fee
    )
    ON CONFLICT (date) DO UPDATE
    SET
      total_orders = daily_platform_stats.total_orders + 1,
      gross_revenue = daily_platform_stats.gross_revenue + NEW.amount,
      platform_fees = daily_platform_stats.platform_fees + NEW.platform_fee,
      net_revenue = daily_platform_stats.net_revenue + NEW.platform_fee,
      updated_at = NOW();
      
  ELSIF OLD.status != 'refunded' AND NEW.status = 'refunded' THEN
    -- Handle refunds
    UPDATE platform_revenue
    SET 
      status = 'refunded',
      refund_amount = OLD.platform_fee,
      updated_at = NOW()
    WHERE order_id = NEW.id;
    
    -- Update daily stats for refunds
    UPDATE daily_platform_stats
    SET
      refunded_orders = refunded_orders + 1,
      total_refunds = total_refunds + NEW.amount,
      net_revenue = net_revenue - OLD.platform_fee,
      updated_at = NOW()
    WHERE date = CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_creator_stats_on_order_change
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_creator_stats();

CREATE TRIGGER record_platform_revenue_on_order_change
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION record_platform_revenue();

-- Function to calculate average completion time
CREATE OR REPLACE FUNCTION calculate_average_completion_time(p_creator_id UUID)
RETURNS INTERVAL AS $$
DECLARE
  avg_time INTERVAL;
BEGIN
  SELECT AVG(completed_at - created_at)
  INTO avg_time
  FROM orders
  WHERE creator_id = p_creator_id
    AND status = 'completed'
    AND completed_at IS NOT NULL;
    
  RETURN COALESCE(avg_time, INTERVAL '0');
END;
$$ LANGUAGE plpgsql;

-- Materialized view for creator rankings
CREATE MATERIALIZED VIEW IF NOT EXISTS creator_rankings AS
SELECT
  cs.creator_id,
  p.display_name,
  p.avatar_url,
  cs.total_orders,
  cs.completed_orders,
  cs.total_earnings,
  cs.completion_rate,
  cs.average_rating,
  cs.total_reviews,
  RANK() OVER (ORDER BY cs.total_earnings DESC) as earnings_rank,
  RANK() OVER (ORDER BY cs.completed_orders DESC) as orders_rank,
  RANK() OVER (ORDER BY cs.average_rating DESC NULLS LAST) as rating_rank
FROM creator_stats cs
JOIN profiles p ON p.id = cs.creator_id
WHERE p.user_type = 'creator';

-- Refresh the materialized view periodically (can be called via cron job)
CREATE OR REPLACE FUNCTION refresh_creator_rankings()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY creator_rankings;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE creator_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_platform_stats ENABLE ROW LEVEL SECURITY;

-- Creator stats policies
CREATE POLICY "Creators can view own stats" ON creator_stats
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "System can manage creator stats" ON creator_stats
  FOR ALL USING (auth.role() = 'service_role');

-- Platform revenue policies (admin only)
CREATE POLICY "Admins can view platform revenue" ON platform_revenue
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "System can manage platform revenue" ON platform_revenue
  FOR ALL USING (auth.role() = 'service_role');

-- Daily stats policies (admin only)
CREATE POLICY "Admins can view daily stats" ON daily_platform_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "System can manage daily stats" ON daily_platform_stats
  FOR ALL USING (auth.role() = 'service_role');

-- Function to get creator daily earnings
CREATE OR REPLACE FUNCTION get_creator_daily_earnings(
  p_creator_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(date DATE, earnings DECIMAL(10, 2)) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(o.created_at) as date,
    SUM(o.creator_earnings) as earnings
  FROM orders o
  WHERE o.creator_id = p_creator_id
    AND o.status = 'completed'
    AND o.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
  GROUP BY DATE(o.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT ON creator_stats TO authenticated;
GRANT SELECT ON platform_revenue TO authenticated;
GRANT SELECT ON daily_platform_stats TO authenticated;
GRANT SELECT ON creator_rankings TO authenticated;
GRANT EXECUTE ON FUNCTION get_creator_daily_earnings TO authenticated;