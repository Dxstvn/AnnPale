-- Migration: Flexible Creator Subscription Tiers
-- Description: Updates subscription tiers to support custom names, colors, icons, and benefits
-- Date: 2025-08-27

-- ============================================
-- ALTER EXISTING TABLES
-- ============================================

-- Add new columns to creator_subscription_tiers for flexible customization
ALTER TABLE public.creator_subscription_tiers 
ADD COLUMN IF NOT EXISTS tier_slug VARCHAR(100),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT 'from-purple-600 to-pink-600',
ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT 'star',
ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 1;

-- Update the benefits column to support structured data
COMMENT ON COLUMN public.creator_subscription_tiers.benefits IS 'JSON array of benefit objects with text and icon properties';

-- Create unique constraint on creator_id and tier_slug
ALTER TABLE public.creator_subscription_tiers 
ADD CONSTRAINT unique_creator_tier_slug UNIQUE (creator_id, tier_slug);

-- Create index for performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_creator_tiers_sort ON public.creator_subscription_tiers(creator_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_creator_tiers_active ON public.creator_subscription_tiers(creator_id, is_active);

-- ============================================
-- ADD CONTENT FEED TABLE FOR SUBSCRIPTION GATING
-- ============================================

CREATE TABLE IF NOT EXISTS public.content_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tier_id UUID REFERENCES public.creator_subscription_tiers(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('video', 'post', 'live', 'announcement')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  is_public BOOLEAN DEFAULT false,
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for content feed queries
CREATE INDEX IF NOT EXISTS idx_content_feed_creator ON public.content_feed(creator_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_feed_tier ON public.content_feed(tier_id);
CREATE INDEX IF NOT EXISTS idx_content_feed_type ON public.content_feed(type);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on creator_subscription_tiers
ALTER TABLE public.creator_subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Creators can view all tiers (for discovery)
CREATE POLICY "Tiers are viewable by everyone" ON public.creator_subscription_tiers
  FOR SELECT USING (true);

-- Creators can manage their own tiers
CREATE POLICY "Creators can insert their own tiers" ON public.creator_subscription_tiers
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own tiers" ON public.creator_subscription_tiers
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own tiers" ON public.creator_subscription_tiers
  FOR DELETE USING (auth.uid() = creator_id);

-- Enable RLS on content_feed
ALTER TABLE public.content_feed ENABLE ROW LEVEL SECURITY;

-- Public content is viewable by everyone
CREATE POLICY "Public content is viewable by everyone" ON public.content_feed
  FOR SELECT USING (is_public = true);

-- Tier-gated content is viewable by subscribers
CREATE POLICY "Subscribers can view gated content" ON public.content_feed
  FOR SELECT USING (
    tier_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.fan_subscriptions fs
      JOIN public.creator_subscription_tiers ct ON fs.tier_id = ct.id
      WHERE fs.fan_id = auth.uid() 
        AND fs.creator_id = content_feed.creator_id
        AND fs.status = 'active'
        AND ct.sort_order <= (
          SELECT sort_order FROM public.creator_subscription_tiers 
          WHERE id = content_feed.tier_id
        )
    )
  );

-- Creators can manage their own content
CREATE POLICY "Creators can insert their own content" ON public.content_feed
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own content" ON public.content_feed
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own content" ON public.content_feed
  FOR DELETE USING (auth.uid() = creator_id);

-- ============================================
-- FUNCTIONS FOR TIER MANAGEMENT
-- ============================================

-- Function to generate tier slug from tier name
CREATE OR REPLACE FUNCTION generate_tier_slug(tier_name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(REGEXP_REPLACE(tier_name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate tier_slug if not provided
CREATE OR REPLACE FUNCTION set_tier_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tier_slug IS NULL OR NEW.tier_slug = '' THEN
    NEW.tier_slug := generate_tier_slug(NEW.tier_name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_tier_slug
BEFORE INSERT OR UPDATE ON public.creator_subscription_tiers
FOR EACH ROW EXECUTE FUNCTION set_tier_slug();

-- Function to get subscriber count for a tier
CREATE OR REPLACE FUNCTION get_tier_subscriber_count(tier_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.fan_subscriptions
    WHERE tier_id = $1 AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA UPDATES (for existing tiers)
-- ============================================

-- Update existing tiers with default values
UPDATE public.creator_subscription_tiers
SET 
  tier_slug = generate_tier_slug(tier_name),
  description = CASE 
    WHEN tier_type = 'basic' THEN 'Get access to exclusive content and support the creator'
    WHEN tier_type = 'premium' THEN 'Premium access with additional perks and benefits'
    WHEN tier_type = 'vip' THEN 'VIP experience with all benefits and exclusive access'
    ELSE 'Support the creator and get exclusive benefits'
  END,
  color = CASE
    WHEN tier_type = 'basic' THEN 'from-purple-500 to-purple-700'
    WHEN tier_type = 'premium' THEN 'from-pink-500 to-rose-700'
    WHEN tier_type = 'vip' THEN 'from-amber-500 to-orange-700'
    ELSE 'from-purple-600 to-pink-600'
  END,
  icon = CASE
    WHEN tier_type = 'basic' THEN 'star'
    WHEN tier_type = 'premium' THEN 'zap'
    WHEN tier_type = 'vip' THEN 'trophy'
    ELSE 'star'
  END,
  sort_order = CASE
    WHEN tier_type = 'basic' THEN 1
    WHEN tier_type = 'premium' THEN 2
    WHEN tier_type = 'vip' THEN 3
    ELSE 1
  END
WHERE tier_slug IS NULL;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT ALL ON public.creator_subscription_tiers TO authenticated;
GRANT ALL ON public.content_feed TO authenticated;
GRANT EXECUTE ON FUNCTION generate_tier_slug TO authenticated;
GRANT EXECUTE ON FUNCTION get_tier_subscriber_count TO authenticated;