-- Add support for multiple tier access control on posts
-- First, let's add columns for better access control
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS access_tier_ids UUID[] DEFAULT '{}';

-- Create a junction table for post tier access
CREATE TABLE IF NOT EXISTS post_tier_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES creator_subscription_tiers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination
  UNIQUE(post_id, tier_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_tier_access_post_id ON post_tier_access(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tier_access_tier_id ON post_tier_access(tier_id);
CREATE INDEX IF NOT EXISTS idx_posts_access_tier_ids ON posts USING GIN(access_tier_ids);

-- Enable RLS
ALTER TABLE post_tier_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for post_tier_access
-- Creators can manage their own post tier access
CREATE POLICY "Creators can manage post tier access"
  ON post_tier_access
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_tier_access.post_id
      AND p.creator_id = auth.uid()
    )
  );

-- Anyone can view tier access for published posts
CREATE POLICY "View tier access for published posts"
  ON post_tier_access
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_tier_access.post_id
      AND p.status = 'published'
    )
  );

-- Update posts RLS policies to handle tier-based access
DROP POLICY IF EXISTS "View published posts" ON posts;

CREATE POLICY "View accessible posts"
  ON posts
  FOR SELECT
  USING (
    -- Post is public
    is_public = true
    OR
    -- User is the creator
    creator_id = auth.uid()
    OR
    -- Post is published and user has subscription to required tier
    (
      status = 'published' 
      AND (
        -- No tier restriction (all subscribers)
        COALESCE(array_length(access_tier_ids, 1), 0) = 0
        OR
        -- User has subscription to one of the required tiers
        EXISTS (
          SELECT 1 FROM creator_subscriptions cs
          WHERE cs.subscriber_id = auth.uid()
          AND cs.creator_id = posts.creator_id
          AND cs.status = 'active'
          AND (
            cs.tier_id = ANY(access_tier_ids)
            OR 
            access_tier_ids IS NULL
            OR
            array_length(access_tier_ids, 1) = 0
          )
        )
      )
    )
  );

-- Creators can manage their own posts
CREATE POLICY "Creators manage own posts"
  ON posts
  FOR ALL
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Function to check if user has access to a post
CREATE OR REPLACE FUNCTION check_post_access(
  p_post_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_post RECORD;
  v_has_access BOOLEAN DEFAULT false;
BEGIN
  -- Get post details
  SELECT 
    creator_id, 
    is_public, 
    access_tier_ids,
    status
  INTO v_post
  FROM posts
  WHERE id = p_post_id;
  
  -- Post not found
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Post is not published
  IF v_post.status != 'published' THEN
    -- Only creator can see unpublished posts
    RETURN v_post.creator_id = p_user_id;
  END IF;
  
  -- Public post
  IF v_post.is_public THEN
    RETURN true;
  END IF;
  
  -- User is the creator
  IF v_post.creator_id = p_user_id THEN
    RETURN true;
  END IF;
  
  -- Check if user has subscription to required tier
  IF array_length(v_post.access_tier_ids, 1) > 0 THEN
    -- Post requires specific tiers
    SELECT EXISTS (
      SELECT 1 
      FROM creator_subscriptions cs
      WHERE cs.subscriber_id = p_user_id
      AND cs.creator_id = v_post.creator_id
      AND cs.status = 'active'
      AND cs.tier_id = ANY(v_post.access_tier_ids)
    ) INTO v_has_access;
  ELSE
    -- Post is for all subscribers (no specific tier required)
    SELECT EXISTS (
      SELECT 1 
      FROM creator_subscriptions cs
      WHERE cs.subscriber_id = p_user_id
      AND cs.creator_id = v_post.creator_id
      AND cs.status = 'active'
    ) INTO v_has_access;
  END IF;
  
  RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible posts from a creator
CREATE OR REPLACE FUNCTION get_accessible_posts(
  p_creator_id UUID,
  p_user_id UUID DEFAULT auth.uid()
) RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  content_type VARCHAR,
  thumbnail_url TEXT,
  is_public BOOLEAN,
  is_preview BOOLEAN,
  is_featured BOOLEAN,
  has_access BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.content_type,
    p.thumbnail_url,
    p.is_public,
    p.is_preview,
    p.is_featured,
    check_post_access(p.id, p_user_id) as has_access
  FROM posts p
  WHERE p.creator_id = p_creator_id
  AND p.status = 'published'
  ORDER BY p.published_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;