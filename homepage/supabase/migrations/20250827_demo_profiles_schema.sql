-- Migration: Demo Profiles Schema
-- Created: 2025-08-27
-- Terminal 4: Bands & Additional Artists

-- Add demo-specific fields to existing profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS is_demo_account boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS demo_tier varchar(20), -- 'superstar' | 'celebrity' | 'rising_star'
  ADD COLUMN IF NOT EXISTS public_figure_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS wikipedia_url text,
  ADD COLUMN IF NOT EXISTS official_website text,
  ADD COLUMN IF NOT EXISTS press_kit_url text;

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