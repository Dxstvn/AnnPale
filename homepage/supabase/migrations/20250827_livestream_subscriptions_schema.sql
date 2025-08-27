-- Migration: Live Streaming with Subscription-based Ad Control
-- Description: Complete schema for live streaming, creator subscriptions, and ad management
-- Date: 2025-08-27

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

-- Stream status enum
CREATE TYPE stream_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');

-- Subscription status enum  
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'past_due');

-- Subscription tier type
CREATE TYPE subscription_tier_type AS ENUM ('basic', 'premium', 'vip');

-- ============================================
-- TABLES
-- ============================================

-- Creator subscription tiers
CREATE TABLE IF NOT EXISTS public.creator_subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tier_name TEXT NOT NULL,
  tier_type subscription_tier_type NOT NULL DEFAULT 'basic',
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  billing_period TEXT DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),
  benefits JSONB DEFAULT '[]'::jsonb,
  ad_free BOOLEAN DEFAULT false,
  exclusive_content BOOLEAN DEFAULT false,
  priority_chat BOOLEAN DEFAULT false,
  vod_access BOOLEAN DEFAULT false,
  max_quality TEXT DEFAULT '720p',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, tier_name)
);

-- Fan subscriptions to creators
CREATE TABLE IF NOT EXISTS public.fan_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tier_id UUID REFERENCES public.creator_subscription_tiers(id) ON DELETE SET NULL,
  status subscription_status NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fan_id, creator_id)
);

-- Live streams table
CREATE TABLE IF NOT EXISTS public.live_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  stream_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  ivs_channel_arn TEXT,
  ivs_playback_url TEXT,
  ivs_ingest_endpoint TEXT,
  status stream_status NOT NULL DEFAULT 'scheduled',
  scheduled_start TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  is_subscriber_only BOOLEAN DEFAULT false,
  min_subscription_tier subscription_tier_type,
  allow_guests BOOLEAN DEFAULT true,
  max_viewers INTEGER,
  chat_enabled BOOLEAN DEFAULT true,
  donations_enabled BOOLEAN DEFAULT true,
  recording_enabled BOOLEAN DEFAULT false,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stream analytics
CREATE TABLE IF NOT EXISTS public.stream_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  join_time TIMESTAMPTZ DEFAULT NOW(),
  leave_time TIMESTAMPTZ,
  watch_duration INTERVAL GENERATED ALWAYS AS (
    CASE 
      WHEN leave_time IS NOT NULL THEN leave_time - join_time
      ELSE NULL
    END
  ) STORED,
  is_subscriber BOOLEAN DEFAULT false,
  subscription_tier subscription_tier_type,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  region TEXT,
  quality_watched TEXT,
  chat_messages_sent INTEGER DEFAULT 0,
  reactions_sent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad campaigns for streams
CREATE TABLE IF NOT EXISTS public.stream_ad_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE,
  ad_provider TEXT NOT NULL,
  campaign_name TEXT,
  pre_roll_ads INTEGER DEFAULT 0,
  mid_roll_ads INTEGER DEFAULT 0,
  post_roll_ads INTEGER DEFAULT 0,
  ad_frequency_minutes INTEGER DEFAULT 10,
  revenue_per_thousand DECIMAL(10,2) DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad impressions tracking
CREATE TABLE IF NOT EXISTS public.ad_impressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.stream_ad_campaigns(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE,
  ad_type TEXT CHECK (ad_type IN ('pre-roll', 'mid-roll', 'post-roll')),
  ad_duration INTEGER,
  completed BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  skipped BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Stream chat messages (for moderation and analytics)
CREATE TABLE IF NOT EXISTS public.stream_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_subscriber BOOLEAN DEFAULT false,
  is_moderator BOOLEAN DEFAULT false,
  is_creator BOOLEAN DEFAULT false,
  deleted BOOLEAN DEFAULT false,
  deleted_by UUID REFERENCES public.profiles(id),
  deleted_reason TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Stream donations/tips
CREATE TABLE IF NOT EXISTS public.stream_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_id UUID REFERENCES public.live_streams(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  message TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator payout tracking
CREATE TABLE IF NOT EXISTS public.creator_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  subscription_revenue DECIMAL(10,2) DEFAULT 0,
  ad_revenue DECIMAL(10,2) DEFAULT 0,
  donation_revenue DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  net_payout DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  stripe_transfer_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Performance indexes
CREATE INDEX idx_fan_subscriptions_fan_id ON public.fan_subscriptions(fan_id);
CREATE INDEX idx_fan_subscriptions_creator_id ON public.fan_subscriptions(creator_id);
CREATE INDEX idx_fan_subscriptions_status ON public.fan_subscriptions(status);
CREATE INDEX idx_live_streams_creator_id ON public.live_streams(creator_id);
CREATE INDEX idx_live_streams_status ON public.live_streams(status);
CREATE INDEX idx_live_streams_scheduled_start ON public.live_streams(scheduled_start);
CREATE INDEX idx_stream_analytics_stream_id ON public.stream_analytics(stream_id);
CREATE INDEX idx_stream_analytics_viewer_id ON public.stream_analytics(viewer_id);
CREATE INDEX idx_stream_chat_messages_stream_id ON public.stream_chat_messages(stream_id);
CREATE INDEX idx_stream_donations_stream_id ON public.stream_donations(stream_id);
CREATE INDEX idx_ad_impressions_stream_id ON public.ad_impressions(stream_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.creator_subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payouts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Creator subscription tiers policies
CREATE POLICY "Public can view active tiers" ON public.creator_subscription_tiers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Creators manage own tiers" ON public.creator_subscription_tiers
  FOR ALL USING (creator_id = auth.uid());

-- Fan subscriptions policies
CREATE POLICY "Users view own subscriptions" ON public.fan_subscriptions
  FOR SELECT USING (fan_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "Users create own subscriptions" ON public.fan_subscriptions
  FOR INSERT WITH CHECK (fan_id = auth.uid());

CREATE POLICY "Users update own subscriptions" ON public.fan_subscriptions
  FOR UPDATE USING (fan_id = auth.uid());

-- Live streams policies
CREATE POLICY "Public view non-subscriber streams" ON public.live_streams
  FOR SELECT USING (
    (status IN ('live', 'scheduled') AND NOT is_subscriber_only)
    OR creator_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.fan_subscriptions 
      WHERE fan_id = auth.uid() 
      AND creator_id = live_streams.creator_id 
      AND status = 'active'
    )
  );

CREATE POLICY "Creators manage own streams" ON public.live_streams
  FOR ALL USING (creator_id = auth.uid());

-- Stream analytics policies  
CREATE POLICY "Creators view own analytics" ON public.stream_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.live_streams 
      WHERE live_streams.id = stream_analytics.stream_id 
      AND live_streams.creator_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analytics" ON public.stream_analytics
  FOR INSERT WITH CHECK (true);

-- Chat messages policies
CREATE POLICY "Public view chat messages" ON public.stream_chat_messages
  FOR SELECT USING (NOT deleted);

CREATE POLICY "Users create own messages" ON public.stream_chat_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Moderators can delete messages" ON public.stream_chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.live_streams 
      WHERE live_streams.id = stream_chat_messages.stream_id 
      AND live_streams.creator_id = auth.uid()
    )
  );

-- Stream donations policies
CREATE POLICY "Public view donations" ON public.stream_donations
  FOR SELECT USING (processed = true);

CREATE POLICY "Users create own donations" ON public.stream_donations
  FOR INSERT WITH CHECK (donor_id = auth.uid());

-- Creator payouts policies
CREATE POLICY "Creators view own payouts" ON public.creator_payouts
  FOR SELECT USING (creator_id = auth.uid());

-- Ad campaigns policies (creators view own)
CREATE POLICY "Creators view own ad campaigns" ON public.stream_ad_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.live_streams 
      WHERE live_streams.id = stream_ad_campaigns.stream_id 
      AND live_streams.creator_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to check if user is subscribed to creator
CREATE OR REPLACE FUNCTION public.is_subscribed_to_creator(
  p_fan_id UUID,
  p_creator_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.fan_subscriptions
    WHERE fan_id = p_fan_id 
    AND creator_id = p_creator_id 
    AND status = 'active'
    AND (end_date IS NULL OR end_date > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's subscription tier for a creator
CREATE OR REPLACE FUNCTION public.get_subscription_tier(
  p_fan_id UUID,
  p_creator_id UUID
) RETURNS subscription_tier_type AS $$
DECLARE
  v_tier subscription_tier_type;
BEGIN
  SELECT cst.tier_type INTO v_tier
  FROM public.fan_subscriptions fs
  JOIN public.creator_subscription_tiers cst ON fs.tier_id = cst.id
  WHERE fs.fan_id = p_fan_id 
  AND fs.creator_id = p_creator_id 
  AND fs.status = 'active'
  AND (fs.end_date IS NULL OR fs.end_date > NOW())
  LIMIT 1;
  
  RETURN v_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track stream viewer
CREATE OR REPLACE FUNCTION public.track_stream_viewer(
  p_stream_id UUID,
  p_viewer_id UUID
) RETURNS UUID AS $$
DECLARE
  v_analytics_id UUID;
  v_creator_id UUID;
  v_is_subscriber BOOLEAN;
  v_tier subscription_tier_type;
BEGIN
  -- Get stream creator
  SELECT creator_id INTO v_creator_id 
  FROM public.live_streams 
  WHERE id = p_stream_id;
  
  -- Check subscription status
  v_is_subscriber := public.is_subscribed_to_creator(p_viewer_id, v_creator_id);
  v_tier := public.get_subscription_tier(p_viewer_id, v_creator_id);
  
  -- Insert analytics record
  INSERT INTO public.stream_analytics (
    stream_id, 
    viewer_id, 
    is_subscriber, 
    subscription_tier
  ) VALUES (
    p_stream_id, 
    p_viewer_id, 
    v_is_subscriber, 
    v_tier
  ) RETURNING id INTO v_analytics_id;
  
  RETURN v_analytics_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate creator revenue
CREATE OR REPLACE FUNCTION public.calculate_creator_revenue(
  p_creator_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
) RETURNS TABLE(
  subscription_revenue DECIMAL,
  ad_revenue DECIMAL,
  donation_revenue DECIMAL,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(
      CASE 
        WHEN fs.status = 'active' THEN cst.price 
        ELSE 0 
      END
    ), 0) AS subscription_revenue,
    COALESCE((
      SELECT SUM(sac.total_revenue * 0.7) -- 70% to creator
      FROM public.stream_ad_campaigns sac
      JOIN public.live_streams ls ON sac.stream_id = ls.id
      WHERE ls.creator_id = p_creator_id
      AND ls.actual_start >= p_start_date
      AND ls.actual_start <= p_end_date
    ), 0) AS ad_revenue,
    COALESCE((
      SELECT SUM(sd.amount * 0.8) -- 80% to creator  
      FROM public.stream_donations sd
      JOIN public.live_streams ls ON sd.stream_id = ls.id
      WHERE ls.creator_id = p_creator_id
      AND sd.created_at >= p_start_date
      AND sd.created_at <= p_end_date
      AND sd.processed = true
    ), 0) AS donation_revenue,
    0::DECIMAL AS total_revenue
  FROM public.fan_subscriptions fs
  LEFT JOIN public.creator_subscription_tiers cst ON fs.tier_id = cst.id
  WHERE fs.creator_id = p_creator_id
  AND fs.status = 'active'
  AND fs.start_date <= p_end_date
  AND (fs.end_date IS NULL OR fs.end_date >= p_start_date);
  
  -- Update total
  UPDATE pg_temp_1 SET total_revenue = subscription_revenue + ad_revenue + donation_revenue;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_creator_subscription_tiers_updated_at 
  BEFORE UPDATE ON public.creator_subscription_tiers 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fan_subscriptions_updated_at 
  BEFORE UPDATE ON public.fan_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_live_streams_updated_at 
  BEFORE UPDATE ON public.live_streams 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stream_ad_campaigns_updated_at 
  BEFORE UPDATE ON public.stream_ad_campaigns 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert sample subscription tiers (will be created by creators)
-- INSERT INTO public.creator_subscription_tiers (creator_id, tier_name, tier_type, price, ad_free, benefits) 
-- VALUES 
--   ('creator-uuid', 'Basic Fan', 'basic', 4.99, false, '["Access to subscriber-only chat", "Monthly shoutout"]'),
--   ('creator-uuid', 'Premium Supporter', 'premium', 9.99, true, '["Ad-free viewing", "Priority chat", "Exclusive content"]'),
--   ('creator-uuid', 'VIP Member', 'vip', 19.99, true, '["Everything in Premium", "1-on-1 monthly chat", "Behind the scenes"]');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;