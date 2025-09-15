-- Add missing count columns to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Update existing posts with their actual counts
UPDATE posts p
SET
  likes_count = COALESCE((SELECT COUNT(*) FROM post_likes WHERE post_id = p.id), 0),
  comments_count = COALESCE((SELECT COUNT(*) FROM post_comments WHERE post_id = p.id), 0),
  view_count = COALESCE((SELECT COUNT(*) FROM post_views WHERE post_id = p.id), 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON posts(likes_count);
CREATE INDEX IF NOT EXISTS idx_posts_comments_count ON posts(comments_count);
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count);

-- Ensure the trigger functions exist and work correctly
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET likes_count = COALESCE(likes_count, 0) + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET comments_count = COALESCE(comments_count, 0) + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET comments_count = GREATEST(COALESCE(comments_count, 0) - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = NEW.post_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Recreate triggers if they don't exist properly
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();

DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON post_comments;
CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comments_count();

DROP TRIGGER IF EXISTS trigger_update_post_view_count ON post_views;
CREATE TRIGGER trigger_update_post_view_count
AFTER INSERT ON post_views
FOR EACH ROW
EXECUTE FUNCTION update_post_view_count();