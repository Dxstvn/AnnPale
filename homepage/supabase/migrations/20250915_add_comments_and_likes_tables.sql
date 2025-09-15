-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for post_comments
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_comment_id ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for post_likes
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for comment_likes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- Enable RLS for all tables
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_comments (already in previous migration, but ensuring they exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'post_comments'
    AND policyname = 'Users can create comments'
  ) THEN
    CREATE POLICY "Users can create comments" ON post_comments
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'post_comments'
    AND policyname = 'Users can update their own comments'
  ) THEN
    CREATE POLICY "Users can update their own comments" ON post_comments
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'post_comments'
    AND policyname = 'Users can delete their own comments'
  ) THEN
    CREATE POLICY "Users can delete their own comments" ON post_comments
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'post_comments'
    AND policyname = 'Anyone can view comments'
  ) THEN
    CREATE POLICY "Anyone can view comments" ON post_comments
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- RLS policies for post_likes
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

-- RLS policies for comment_likes
CREATE POLICY "Users can create their own comment likes" ON comment_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment likes" ON comment_likes
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comment likes" ON comment_likes
  FOR SELECT
  USING (true);

-- Create function to get nested comments (replies)
CREATE OR REPLACE FUNCTION get_post_comments_with_replies(p_post_id UUID)
RETURNS TABLE(
  id UUID,
  post_id UUID,
  user_id UUID,
  parent_comment_id UUID,
  content TEXT,
  likes_count INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  replies JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE comment_tree AS (
    -- Base case: top-level comments
    SELECT
      c.id,
      c.post_id,
      c.user_id,
      c.parent_comment_id,
      c.content,
      c.likes_count,
      c.created_at,
      c.updated_at,
      0 as level
    FROM post_comments c
    WHERE c.post_id = p_post_id
      AND c.parent_comment_id IS NULL

    UNION ALL

    -- Recursive case: replies
    SELECT
      c.id,
      c.post_id,
      c.user_id,
      c.parent_comment_id,
      c.content,
      c.likes_count,
      c.created_at,
      c.updated_at,
      ct.level + 1
    FROM post_comments c
    INNER JOIN comment_tree ct ON c.parent_comment_id = ct.id
    WHERE ct.level < 3  -- Limit nesting depth
  )
  SELECT
    ct.id,
    ct.post_id,
    ct.user_id,
    ct.parent_comment_id,
    ct.content,
    ct.likes_count,
    ct.created_at,
    ct.updated_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', r.id,
            'user_id', r.user_id,
            'content', r.content,
            'likes_count', r.likes_count,
            'created_at', r.created_at
          ) ORDER BY r.created_at ASC
        )
        FROM post_comments r
        WHERE r.parent_comment_id = ct.id
      ),
      '[]'::jsonb
    ) as replies
  FROM comment_tree ct
  WHERE ct.parent_comment_id IS NULL
  ORDER BY ct.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create or replace function to update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE post_comments
    SET likes_count = (
      SELECT COUNT(*) FROM comment_likes WHERE comment_id = NEW.comment_id
    )
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_comments
    SET likes_count = (
      SELECT COUNT(*) FROM comment_likes WHERE comment_id = OLD.comment_id
    )
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment likes count
DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW
EXECUTE FUNCTION update_comment_likes_count();