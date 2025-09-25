-- =========================================
-- UPDATE RLS POLICIES FOR DUAL-ROLE CREATOR SUPPORT
-- =========================================
-- This migration updates all creator-related table policies to support dual-role users
-- Users with role='fan' and is_creator=true will have full creator access

-- =========================================
-- POSTS TABLE POLICIES
-- =========================================

-- Drop existing creator-only policies
DROP POLICY IF EXISTS "Creators can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Creators can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Creators can delete their own posts" ON public.posts;

-- Create new policies that support dual-role users
CREATE POLICY "Creators can insert their own posts" ON public.posts
  FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  );

CREATE POLICY "Creators can update their own posts" ON public.posts
  FOR UPDATE
  USING (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  );

CREATE POLICY "Creators can delete their own posts" ON public.posts
  FOR DELETE
  USING (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  );

-- =========================================
-- CREATOR_SUBSCRIPTION_TIERS TABLE POLICIES
-- =========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Creators can insert their own tiers" ON public.creator_subscription_tiers;
DROP POLICY IF EXISTS "Creators can update their own tiers" ON public.creator_subscription_tiers;
DROP POLICY IF EXISTS "Creators can delete their own tiers" ON public.creator_subscription_tiers;
DROP POLICY IF EXISTS "Creators manage own tiers" ON public.creator_subscription_tiers;

-- Create new policies that support dual-role users
CREATE POLICY "Creators can insert their own tiers" ON public.creator_subscription_tiers
  FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  );

CREATE POLICY "Creators can update their own tiers" ON public.creator_subscription_tiers
  FOR UPDATE
  USING (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  )
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  );

CREATE POLICY "Creators can delete their own tiers" ON public.creator_subscription_tiers
  FOR DELETE
  USING (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  );

-- =========================================
-- POST_ACCESS_TIERS TABLE POLICIES
-- =========================================

-- Drop existing policy
DROP POLICY IF EXISTS "Creators can manage post access tiers" ON public.post_access_tiers;

-- Create new policy that supports dual-role users
CREATE POLICY "Creators can manage post access tiers" ON public.post_access_tiers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_access_tiers.post_id
      AND posts.creator_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = post_access_tiers.post_id
      AND posts.creator_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (role = 'creator' OR is_creator = TRUE)
    )
  );

-- =========================================
-- CREATOR_FEED_SETTINGS TABLE POLICIES (if exists)
-- =========================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'creator_feed_settings'
  ) THEN
    -- Drop existing policy
    DROP POLICY IF EXISTS "Creators can manage their own feed settings" ON public.creator_feed_settings;

    -- Create new policy that supports dual-role users
    EXECUTE 'CREATE POLICY "Creators can manage their own feed settings" ON public.creator_feed_settings
      FOR ALL
      USING (
        auth.uid() = creator_id AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )
      WITH CHECK (
        auth.uid() = creator_id AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )';
  END IF;
END $$;

-- =========================================
-- VIDEO_REQUESTS TABLE POLICIES
-- =========================================

-- Check if video_requests table exists and update policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'video_requests'
  ) THEN
    -- Drop existing creator-only policies if they exist
    DROP POLICY IF EXISTS "Creators can view their video requests" ON public.video_requests;
    DROP POLICY IF EXISTS "Creators can update their video requests" ON public.video_requests;

    -- Create new policies that support dual-role users
    EXECUTE 'CREATE POLICY "Creators can view their video requests" ON public.video_requests
      FOR SELECT
      USING (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )';

    EXECUTE 'CREATE POLICY "Creators can update their video requests" ON public.video_requests
      FOR UPDATE
      USING (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )
      WITH CHECK (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )';
  END IF;
END $$;

-- =========================================
-- CREATOR_PREVIEW_VIDEOS TABLE POLICIES
-- =========================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'creator_preview_videos'
  ) THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Creators can manage their preview videos" ON public.creator_preview_videos;
    DROP POLICY IF EXISTS "Creators can view their preview videos" ON public.creator_preview_videos;

    -- Create new policies that support dual-role users
    EXECUTE 'CREATE POLICY "Creators can view their preview videos" ON public.creator_preview_videos
      FOR SELECT
      USING (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )';

    EXECUTE 'CREATE POLICY "Creators can manage their preview videos" ON public.creator_preview_videos
      FOR ALL
      USING (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )
      WITH CHECK (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )';
  END IF;
END $$;

-- =========================================
-- LIVE_STREAMS TABLE POLICIES (if exists)
-- =========================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'live_streams'
  ) THEN
    -- Drop existing policy
    DROP POLICY IF EXISTS "Creators manage own streams" ON public.live_streams;

    -- Create new policy that supports dual-role users
    EXECUTE 'CREATE POLICY "Creators manage own streams" ON public.live_streams
      FOR ALL
      USING (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )
      WITH CHECK (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )';
  END IF;
END $$;

-- =========================================
-- SUBSCRIPTION_ANALYTICS TABLE POLICIES (if exists)
-- =========================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'subscription_analytics'
  ) THEN
    -- Drop existing policy
    DROP POLICY IF EXISTS "Creators can view their own analytics" ON public.subscription_analytics;

    -- Create new policy that supports dual-role users
    EXECUTE 'CREATE POLICY "Creators can view their own analytics" ON public.subscription_analytics
      FOR SELECT
      USING (
        creator_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid()
          AND (role = ''creator'' OR is_creator = TRUE)
        )
      )';
  END IF;
END $$;

-- =========================================
-- Grant necessary permissions
-- =========================================

-- Ensure authenticated users have proper permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creator_subscription_tiers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_access_tiers TO authenticated;

-- Add comments for documentation
COMMENT ON POLICY "Creators can insert their own posts" ON public.posts IS 'Allows both traditional creators and dual-role users to create posts';
COMMENT ON POLICY "Creators can update their own posts" ON public.posts IS 'Allows both traditional creators and dual-role users to update their posts';
COMMENT ON POLICY "Creators can delete their own posts" ON public.posts IS 'Allows both traditional creators and dual-role users to delete their posts';