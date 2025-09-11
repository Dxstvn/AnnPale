-- Create posts table for creator content feed
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Content details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'image', 'text', 'live')),
  
  -- Media URLs
  thumbnail_url TEXT,
  video_url TEXT,
  image_url TEXT,
  
  -- Access control
  tier_required VARCHAR(100), -- Can be null for public posts
  is_public BOOLEAN DEFAULT false,
  
  -- Engagement metrics
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_posts_creator_id ON posts(creator_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_content_type ON posts(content_type);
CREATE INDEX idx_posts_tier_required ON posts(tier_required);

-- Create post_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only like a post once
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- Create post_views table for tracking views
CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Can be null for anonymous views
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_date DATE DEFAULT CURRENT_DATE,
  
  -- Track unique views per user per day
  UNIQUE(post_id, user_id, viewed_date)
);

CREATE INDEX idx_post_views_post_id ON post_views(post_id);
CREATE INDEX idx_post_views_user_id ON post_views(user_id);
CREATE INDEX idx_post_views_viewed_at ON post_views(viewed_at);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE, -- For nested comments
  
  content TEXT NOT NULL,
  
  likes_count INTEGER DEFAULT 0,
  
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'hidden')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX idx_post_comments_parent_id ON post_comments(parent_comment_id);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
-- Everyone can view published posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT
  USING (status = 'published');

-- Creators can manage their own posts
CREATE POLICY "Creators can insert their own posts" ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own posts" ON posts
  FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own posts" ON posts
  FOR DELETE
  USING (auth.uid() = creator_id);

-- RLS Policies for post_likes
CREATE POLICY "Users can view all likes" ON post_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts" ON post_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" ON post_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for post_views
CREATE POLICY "Anyone can create views" ON post_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "View counts are public" ON post_views
  FOR SELECT
  USING (true);

-- RLS Policies for post_comments
CREATE POLICY "Comments are viewable by everyone" ON post_comments
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can comment" ON post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON post_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON post_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION update_post_engagement_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'post_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'post_views' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET views_count = views_count + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'post_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for engagement count updates
CREATE TRIGGER update_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_engagement_counts();

CREATE TRIGGER update_post_views_count
  AFTER INSERT ON post_views
  FOR EACH ROW
  EXECUTE FUNCTION update_post_engagement_counts();

CREATE TRIGGER update_post_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_engagement_counts();

-- Insert sample posts for demo creators
INSERT INTO posts (creator_id, title, description, content_type, thumbnail_url, is_public, tier_required) 
VALUES
  -- Wyclef Jean posts
  ('d963aa48-879d-461c-9df3-7dc557b545f9', 'Behind the Scenes: Studio Session', 'Working on new music in the studio! 🎵', 'video', '/images/studio-thumbnail.jpg', true, null),
  ('d963aa48-879d-461c-9df3-7dc557b545f9', 'Exclusive Performance', 'Private concert for my top tier supporters', 'video', '/images/concert-thumbnail.jpg', false, 'vip-all-access'),
  ('d963aa48-879d-461c-9df3-7dc557b545f9', 'Message to Haiti 🇭🇹', 'My thoughts on recent events and how we can help', 'text', null, true, null),
  
  -- Michael Brun posts
  ('819421cf-9437-4d10-bb09-bca4e0c12cba', 'New Track Preview', 'First listen to my upcoming single!', 'video', '/images/track-preview.jpg', false, 'backstage-pass'),
  ('819421cf-9437-4d10-bb09-bca4e0c12cba', 'DJ Set Highlights', 'Best moments from last night''s show', 'video', '/images/dj-set.jpg', true, null),
  ('819421cf-9437-4d10-bb09-bca4e0c12cba', 'Production Tips', 'How I made the beat for my latest track', 'video', '/images/production.jpg', false, 'studio-session'),
  
  -- Rutshelle Guillaume posts  
  ('cbce25c9-04e0-45c7-b872-473fed4eeb1d', 'Acoustic Session', 'Stripped down version of my hit song', 'video', '/images/acoustic.jpg', true, null),
  ('cbce25c9-04e0-45c7-b872-473fed4eeb1d', 'Vocal Coaching', 'Tips for aspiring singers', 'video', '/images/vocal-coaching.jpg', false, 'golden-mic'),
  ('cbce25c9-04e0-45c7-b872-473fed4eeb1d', 'Tour Diary', 'Behind the scenes from my world tour', 'image', '/images/tour-diary.jpg', false, 'silver-stage');

-- Update some engagement metrics for realism
UPDATE posts SET 
  likes_count = floor(random() * 500 + 50),
  views_count = floor(random() * 2000 + 200),
  comments_count = floor(random() * 50 + 5)
WHERE creator_id IN (
  'd963aa48-879d-461c-9df3-7dc557b545f9',
  '819421cf-9437-4d10-bb09-bca4e0c12cba', 
  'cbce25c9-04e0-45c7-b872-473fed4eeb1d'
);