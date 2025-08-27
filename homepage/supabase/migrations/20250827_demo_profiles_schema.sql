-- Demo Profiles Schema for Entertainment Icons
-- Migration to create demo-specific tables and enhance profiles table

-- Add demo-specific fields to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  is_demo_account boolean DEFAULT false,
  demo_tier varchar(20) CHECK (demo_tier IN ('superstar', 'celebrity', 'rising_star')),
  public_figure_verified boolean DEFAULT false,
  wikipedia_url text,
  official_website text,
  press_kit_url text,
  hometown varchar(255),
  years_active integer,
  subcategory varchar(100),
  career_highlights text[],
  follower_count integer DEFAULT 0,
  monthly_bookings integer DEFAULT 0,
  repeat_customer_rate decimal(3,2) DEFAULT 0.0,
  price_live_call decimal(10,2) DEFAULT 0.0,
  response_time varchar(50) DEFAULT '24 hours',
  languages text[] DEFAULT ARRAY['Haitian Creole', 'English', 'French'],
  account_status varchar(20) DEFAULT 'active' CHECK (account_status IN ('active', 'busy', 'vacation')),
  sample_videos text[],
  intro_video varchar(500),
  cover_image varchar(500),
  last_active timestamp with time zone DEFAULT NOW();

-- Create demo_creator_stats table
CREATE TABLE IF NOT EXISTS demo_creator_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_earnings decimal(10,2) DEFAULT 0,
  videos_this_month integer DEFAULT 0,
  average_turnaround_hours integer DEFAULT 24,
  satisfaction_score decimal(3,2) DEFAULT 4.80 CHECK (satisfaction_score >= 0 AND satisfaction_score <= 5.0),
  featured_category text,
  trending_rank integer,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_reviews table  
CREATE TABLE IF NOT EXISTS demo_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  video_type varchar(50) DEFAULT 'general', -- 'birthday', 'encouragement', 'anniversary', etc.
  language varchar(10) DEFAULT 'en', -- 'en', 'fr', 'ht'
  helpful_count integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_sample_videos table
CREATE TABLE IF NOT EXISTS demo_sample_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_seconds integer DEFAULT 60,
  thumbnail_url text,
  category varchar(50) DEFAULT 'general',
  language varchar(10) DEFAULT 'en',
  view_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_creator_stats_profile_id ON demo_creator_stats(profile_id);
CREATE INDEX IF NOT EXISTS idx_demo_creator_stats_trending_rank ON demo_creator_stats(trending_rank);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_creator_id ON demo_reviews(creator_id);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_rating ON demo_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_created_at ON demo_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_sample_videos_creator_id ON demo_sample_videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_demo_sample_videos_category ON demo_sample_videos(category);
CREATE INDEX IF NOT EXISTS idx_profiles_demo_account ON profiles(is_demo_account) WHERE is_demo_account = true;
CREATE INDEX IF NOT EXISTS idx_profiles_demo_tier ON profiles(demo_tier) WHERE demo_tier IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE demo_creator_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_sample_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access to demo data (read-only)
CREATE POLICY "Public can view demo creator stats" ON demo_creator_stats
  FOR SELECT USING (true);

CREATE POLICY "Public can view demo reviews" ON demo_reviews
  FOR SELECT USING (true);

CREATE POLICY "Public can view demo sample videos" ON demo_sample_videos
  FOR SELECT USING (true);

-- Allow authenticated users to insert demo data (for seeding)
CREATE POLICY "Authenticated can insert demo stats" ON demo_creator_stats
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert demo reviews" ON demo_reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert demo sample videos" ON demo_sample_videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Service role can do everything (for seeding scripts)
CREATE POLICY "Service role can manage demo stats" ON demo_creator_stats
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage demo reviews" ON demo_reviews
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage demo sample videos" ON demo_sample_videos
  FOR ALL USING (auth.role() = 'service_role');

-- Create functions for better demo data management
CREATE OR REPLACE FUNCTION get_demo_creator_stats(creator_id UUID)
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_earnings', total_earnings,
    'videos_this_month', videos_this_month,
    'average_turnaround_hours', average_turnaround_hours,
    'satisfaction_score', satisfaction_score,
    'featured_category', featured_category,
    'trending_rank', trending_rank
  )
  FROM demo_creator_stats
  WHERE profile_id = creator_id;
$$;

CREATE OR REPLACE FUNCTION get_demo_reviews_summary(creator_id UUID)
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_reviews', COUNT(*),
    'average_rating', ROUND(AVG(rating)::numeric, 2),
    'five_star_count', COUNT(*) FILTER (WHERE rating = 5),
    'four_star_count', COUNT(*) FILTER (WHERE rating = 4),
    'three_star_count', COUNT(*) FILTER (WHERE rating = 3),
    'two_star_count', COUNT(*) FILTER (WHERE rating = 2),
    'one_star_count', COUNT(*) FILTER (WHERE rating = 1),
    'recent_reviews', (
      SELECT json_agg(json_build_object(
        'reviewer_name', reviewer_name,
        'rating', rating,
        'review_text', review_text,
        'video_type', video_type,
        'language', language,
        'created_at', created_at
      ) ORDER BY created_at DESC)
      FROM demo_reviews 
      WHERE creator_id = get_demo_reviews_summary.creator_id 
      AND created_at >= NOW() - INTERVAL '30 days'
      LIMIT 5
    )
  )
  FROM demo_reviews
  WHERE creator_id = get_demo_reviews_summary.creator_id;
$$;

-- Function to update stats automatically
CREATE OR REPLACE FUNCTION update_demo_stats_on_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the profile's rating and review count
  UPDATE profiles 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2) 
      FROM demo_reviews 
      WHERE creator_id = NEW.creator_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM demo_reviews 
      WHERE creator_id = NEW.creator_id
    ),
    updated_at = NOW()
  WHERE id = NEW.creator_id;

  -- Update satisfaction score in demo_creator_stats
  UPDATE demo_creator_stats
  SET 
    satisfaction_score = (
      SELECT ROUND(AVG(rating)::numeric, 2) 
      FROM demo_reviews 
      WHERE creator_id = NEW.creator_id
    ),
    updated_at = NOW()
  WHERE profile_id = NEW.creator_id;

  RETURN NEW;
END;
$$;

-- Trigger to automatically update stats when new review is added
CREATE TRIGGER update_stats_on_demo_review
  AFTER INSERT ON demo_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_demo_stats_on_review();

-- Comments for documentation
COMMENT ON TABLE demo_creator_stats IS 'Statistics specific to demo creator profiles for realistic platform showcasing';
COMMENT ON TABLE demo_reviews IS 'Sample reviews for demo creator profiles with multilingual support';
COMMENT ON TABLE demo_sample_videos IS 'Sample video descriptions and metadata for demo creators';

COMMENT ON COLUMN profiles.is_demo_account IS 'Marks accounts as demo/example profiles for platform showcasing';
COMMENT ON COLUMN profiles.demo_tier IS 'Tier classification for demo accounts: superstar, celebrity, or rising_star';
COMMENT ON COLUMN profiles.public_figure_verified IS 'Indicates if the demo profile represents a verified public figure';

-- Insert some initial configuration data
INSERT INTO demo_creator_stats (id, profile_id, total_earnings, videos_this_month, satisfaction_score, featured_category)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 0.00, 0, 5.00, 'New Creator')
ON CONFLICT DO NOTHING;