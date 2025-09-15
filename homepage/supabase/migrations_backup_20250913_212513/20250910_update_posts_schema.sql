-- Update existing posts table to support content system
-- Add missing columns for creator content functionality

-- Add new columns to support content management
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('video', 'image', 'text', 'live')),
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS tier_required VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing data to have sensible defaults
UPDATE posts 
SET 
  title = COALESCE(title, LEFT(content, 100)),
  description = COALESCE(description, content),
  content_type = COALESCE(content_type, 'text'),
  is_public = COALESCE(is_public, true),
  likes_count = COALESCE(likes_count, 0),
  comments_count = COALESCE(comments_count, 0), 
  shares_count = COALESCE(shares_count, 0),
  status = COALESCE(status, 'published'),
  published_at = COALESCE(published_at, created_at)
WHERE title IS NULL OR description IS NULL;

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_posts_creator_id ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_tier_required ON posts(tier_required);
CREATE INDEX IF NOT EXISTS idx_posts_is_public ON posts(is_public);

-- Create post_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only like a post once
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Create post_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_date DATE DEFAULT CURRENT_DATE,
  
  -- Track unique views per user per day
  UNIQUE(post_id, user_id, viewed_date)
);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at);

-- Create post_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'hidden')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_comment_id);

-- Enable Row Level Security on new tables
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_likes
DROP POLICY IF EXISTS "Users can view all likes" ON post_likes;
CREATE POLICY "Users can view all likes" ON post_likes
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can like posts" ON post_likes;
CREATE POLICY "Users can like posts" ON post_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike their own likes" ON post_likes;
CREATE POLICY "Users can unlike their own likes" ON post_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for post_views
DROP POLICY IF EXISTS "Anyone can create views" ON post_views;
CREATE POLICY "Anyone can create views" ON post_views
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "View counts are public" ON post_views;
CREATE POLICY "View counts are public" ON post_views
  FOR SELECT
  USING (true);

-- RLS Policies for post_comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON post_comments;
CREATE POLICY "Comments are viewable by everyone" ON post_comments
  FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Authenticated users can comment" ON post_comments;
CREATE POLICY "Authenticated users can comment" ON post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON post_comments;
CREATE POLICY "Users can update their own comments" ON post_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;
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
      UPDATE posts SET view_count = COALESCE(view_count, 0) + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'post_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for engagement count updates
DROP TRIGGER IF EXISTS update_post_likes_count ON post_likes;
CREATE TRIGGER update_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_engagement_counts();

DROP TRIGGER IF EXISTS update_post_views_count ON post_views;
CREATE TRIGGER update_post_views_count
  AFTER INSERT ON post_views
  FOR EACH ROW
  EXECUTE FUNCTION update_post_engagement_counts();

DROP TRIGGER IF EXISTS update_post_comments_count ON post_comments;
CREATE TRIGGER update_post_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_engagement_counts();