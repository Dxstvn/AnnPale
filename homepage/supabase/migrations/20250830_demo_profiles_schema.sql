-- Demo Profiles Schema - Merged from all terminals
-- Migration to create demo-specific tables and enhance profiles table
-- Includes Entertainment, DJs, and Bands profiles support

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
  satisfaction_score decimal(3,2) DEFAULT 4.80,
  featured_category text,
  trending_rank integer,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_reviews table  
CREATE TABLE IF NOT EXISTS demo_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  video_type varchar(50), -- 'birthday' | 'encouragement' | 'anniversary'
  language varchar(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_sample_videos table
CREATE TABLE IF NOT EXISTS demo_sample_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_seconds integer,
  thumbnail_url text,
  category varchar(50),
  language varchar(10),
  view_count integer DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE demo_creator_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_sample_videos ENABLE ROW LEVEL SECURITY;

-- Public read access for demo data
CREATE POLICY "Public can view demo stats" ON demo_creator_stats
  FOR SELECT USING (true);

CREATE POLICY "Public can view demo reviews" ON demo_reviews
  FOR SELECT USING (true);

CREATE POLICY "Public can view demo samples" ON demo_sample_videos
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_demo_creator_stats_profile ON demo_creator_stats(profile_id);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_creator ON demo_reviews(creator_id);
CREATE INDEX IF NOT EXISTS idx_demo_reviews_rating ON demo_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_demo_sample_videos_creator ON demo_sample_videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_demo_sample_videos_category ON demo_sample_videos(category);

-- Grant permissions
GRANT SELECT ON demo_creator_stats TO authenticated;
GRANT SELECT ON demo_reviews TO authenticated;
GRANT SELECT ON demo_sample_videos TO authenticated;