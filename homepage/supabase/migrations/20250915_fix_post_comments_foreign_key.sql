-- Fix the foreign key constraint for post_comments table
-- The table was incorrectly referencing creator_posts instead of posts

-- First, drop the incorrect foreign key constraint
ALTER TABLE public.post_comments
DROP CONSTRAINT IF EXISTS post_comments_post_id_fkey;

-- Add the correct foreign key constraint to the posts table
ALTER TABLE public.post_comments
ADD CONSTRAINT post_comments_post_id_fkey
FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Also fix any RLS policies that reference creator_posts
DROP POLICY IF EXISTS "Comments viewable on accessible posts" ON public.post_comments;

-- Create a new policy that references the correct posts table
CREATE POLICY "Comments viewable on accessible posts"
ON public.post_comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.posts p
        WHERE p.id = post_comments.post_id
    )
);

-- Also ensure post_likes has the correct foreign key (if it exists)
DO $$
BEGIN
    -- Check if post_likes table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'post_likes') THEN
        -- Drop old constraint if it exists
        ALTER TABLE public.post_likes
        DROP CONSTRAINT IF EXISTS post_likes_post_id_fkey;

        -- Add correct constraint
        ALTER TABLE public.post_likes
        ADD CONSTRAINT post_likes_post_id_fkey
        FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Also ensure post_views has the correct foreign key (if it exists)
DO $$
BEGIN
    -- Check if post_views table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'post_views') THEN
        -- Drop old constraint if it exists
        ALTER TABLE public.post_views
        DROP CONSTRAINT IF EXISTS post_views_post_id_fkey;

        -- Add correct constraint
        ALTER TABLE public.post_views
        ADD CONSTRAINT post_views_post_id_fkey
        FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Successfully fixed foreign key constraints for post-related tables';
END $$;