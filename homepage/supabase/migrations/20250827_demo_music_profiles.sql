-- Demo profiles migration for music superstars
-- Create demo-specific tables for realistic creator profiles

-- Demo creator stats table for enhanced analytics
CREATE TABLE IF NOT EXISTS public.demo_creator_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_orders INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 100 CHECK (completion_rate >= 0 AND completion_rate <= 100),
  avg_delivery_time_days DECIMAL(3, 1) DEFAULT 2.0,
  repeat_customers INTEGER DEFAULT 0,
  rating_average DECIMAL(2, 1) DEFAULT 5.0 CHECK (rating_average >= 0 AND rating_average <= 5.0),
  total_reviews INTEGER DEFAULT 0,
  response_time_hours INTEGER DEFAULT 4,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo reviews table for realistic user reviews
CREATE TABLE IF NOT EXISTS public.demo_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  category TEXT,
  review_date DATE DEFAULT CURRENT_DATE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo sample videos table for showcase content
CREATE TABLE IF NOT EXISTS public.demo_sample_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  price DECIMAL(10, 2),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo creator achievements table
CREATE TABLE IF NOT EXISTS public.demo_creator_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_text TEXT NOT NULL,
  achievement_type TEXT DEFAULT 'award',
  year INTEGER,
  is_major BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo creator current projects table
CREATE TABLE IF NOT EXISTS public.demo_creator_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  project_description TEXT,
  project_status TEXT DEFAULT 'active',
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo creator social media stats
CREATE TABLE IF NOT EXISTS public.demo_creator_social (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  handle TEXT,
  follower_count TEXT,
  url TEXT,
  is_verified BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.demo_creator_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_sample_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_creator_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_creator_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_creator_social ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read access for demo data
CREATE POLICY "Public read access for demo stats" ON public.demo_creator_stats
  FOR SELECT USING (true);

CREATE POLICY "Public read access for demo reviews" ON public.demo_reviews
  FOR SELECT USING (true);

CREATE POLICY "Public read access for demo videos" ON public.demo_sample_videos
  FOR SELECT USING (true);

CREATE POLICY "Public read access for demo achievements" ON public.demo_creator_achievements
  FOR SELECT USING (true);

CREATE POLICY "Public read access for demo projects" ON public.demo_creator_projects
  FOR SELECT USING (true);

CREATE POLICY "Public read access for demo social" ON public.demo_creator_social
  FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "Admins can manage demo stats" ON public.demo_creator_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage demo reviews" ON public.demo_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage demo videos" ON public.demo_sample_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage demo achievements" ON public.demo_creator_achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage demo projects" ON public.demo_creator_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage demo social" ON public.demo_creator_social
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS demo_creator_stats_creator_id_idx ON public.demo_creator_stats(creator_id);
CREATE INDEX IF NOT EXISTS demo_reviews_creator_id_idx ON public.demo_reviews(creator_id);
CREATE INDEX IF NOT EXISTS demo_reviews_rating_idx ON public.demo_reviews(rating);
CREATE INDEX IF NOT EXISTS demo_sample_videos_creator_id_idx ON public.demo_sample_videos(creator_id);
CREATE INDEX IF NOT EXISTS demo_sample_videos_category_idx ON public.demo_sample_videos(category);
CREATE INDEX IF NOT EXISTS demo_creator_achievements_creator_id_idx ON public.demo_creator_achievements(creator_id);
CREATE INDEX IF NOT EXISTS demo_creator_projects_creator_id_idx ON public.demo_creator_projects(creator_id);
CREATE INDEX IF NOT EXISTS demo_creator_social_creator_id_idx ON public.demo_creator_social(creator_id);

-- Triggers for updated_at
CREATE TRIGGER update_demo_creator_stats_updated_at 
  BEFORE UPDATE ON public.demo_creator_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Functions for demo data management
CREATE OR REPLACE FUNCTION public.get_demo_creator_profile(creator_email TEXT)
RETURNS JSONB AS $$
DECLARE
  creator_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'profile', row_to_json(p.*),
    'stats', row_to_json(s.*),
    'social_media', COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'platform', soc.platform,
          'handle', soc.handle,
          'follower_count', soc.follower_count,
          'url', soc.url,
          'is_verified', soc.is_verified
        )
      ) FILTER (WHERE soc.id IS NOT NULL), 
      '[]'::jsonb
    ),
    'achievements', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'text', a.achievement_text,
          'type', a.achievement_type,
          'year', a.year,
          'is_major', a.is_major
        )
      ) FILTER (WHERE a.id IS NOT NULL), 
      '[]'::jsonb
    ),
    'projects', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'title', pr.project_title,
          'description', pr.project_description,
          'status', pr.project_status,
          'year', pr.year,
          'is_featured', pr.is_featured
        )
      ) FILTER (WHERE pr.id IS NOT NULL), 
      '[]'::jsonb
    ),
    'sample_videos', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'title', v.title,
          'description', v.description,
          'duration_seconds', v.duration_seconds,
          'category', v.category,
          'thumbnail_url', v.thumbnail_url,
          'price', v.price
        )
      ) FILTER (WHERE v.id IS NOT NULL), 
      '[]'::jsonb
    ),
    'reviews', COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'reviewer_name', r.reviewer_name,
          'reviewer_avatar', r.reviewer_avatar,
          'rating', r.rating,
          'review_text', r.review_text,
          'category', r.category,
          'review_date', r.review_date,
          'helpful_count', r.helpful_count
        )
      ) FILTER (WHERE r.id IS NOT NULL), 
      '[]'::jsonb
    )
  ) INTO creator_data
  FROM public.profiles p
  LEFT JOIN public.demo_creator_stats s ON s.creator_id = p.id
  LEFT JOIN public.demo_creator_social soc ON soc.creator_id = p.id
  LEFT JOIN public.demo_creator_achievements a ON a.creator_id = p.id
  LEFT JOIN public.demo_creator_projects pr ON pr.creator_id = p.id
  LEFT JOIN public.demo_sample_videos v ON v.creator_id = p.id
  LEFT JOIN public.demo_reviews r ON r.creator_id = p.id
  WHERE p.email = creator_email
  GROUP BY p.id, s.id;
  
  RETURN creator_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;