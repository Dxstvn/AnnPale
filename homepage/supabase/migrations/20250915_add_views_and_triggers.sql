-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create post_views table for tracking unique views
CREATE TABLE IF NOT EXISTS post_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON post_views(viewed_at);

-- Create or replace function to update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET likes_count = (
      SELECT COUNT(*) FROM post_likes WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET likes_count = (
      SELECT COUNT(*) FROM post_likes WHERE post_id = OLD.post_id
    )
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for likes count
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();

-- Create or replace function to update post comments count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET comments_count = (
      SELECT COUNT(*) FROM post_comments WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET comments_count = (
      SELECT COUNT(*) FROM post_comments WHERE post_id = OLD.post_id
    )
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comments count
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON post_comments;
CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comments_count();

-- Create or replace function to update post views count
CREATE OR REPLACE FUNCTION update_post_views_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET views_count = (
      SELECT COUNT(*) FROM post_views WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET views_count = (
      SELECT COUNT(*) FROM post_views WHERE post_id = OLD.post_id
    )
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for views count
DROP TRIGGER IF EXISTS trigger_update_post_views_count ON post_views;
CREATE TRIGGER trigger_update_post_views_count
AFTER INSERT OR DELETE ON post_views
FOR EACH ROW
EXECUTE FUNCTION update_post_views_count();

-- Add RLS policies for post_views
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own views
CREATE POLICY "Users can create their own views" ON post_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to see all views (for counting purposes)
CREATE POLICY "Anyone can view post views" ON post_views
  FOR SELECT
  USING (true);

-- Add RLS policies for post_likes if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'post_likes'
    AND policyname = 'Users can create their own likes'
  ) THEN
    CREATE POLICY "Users can create their own likes" ON post_likes
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'post_likes'
    AND policyname = 'Users can delete their own likes'
  ) THEN
    CREATE POLICY "Users can delete their own likes" ON post_likes
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'post_likes'
    AND policyname = 'Anyone can view post likes'
  ) THEN
    CREATE POLICY "Anyone can view post likes" ON post_likes
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Add RLS policies for post_comments
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Allow users to create comments
CREATE POLICY "Users can create comments" ON post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments" ON post_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" ON post_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow anyone to view comments
CREATE POLICY "Anyone can view comments" ON post_comments
  FOR SELECT
  USING (true);

-- Update existing posts to have accurate counts
UPDATE posts SET likes_count = (
  SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id
);

UPDATE posts SET comments_count = (
  SELECT COUNT(*) FROM post_comments WHERE post_id = posts.id
);

UPDATE posts SET views_count = (
  SELECT COUNT(*) FROM post_views WHERE post_id = posts.id
);