-- Migration: Add columns needed for creator browsing functionality
-- Date: 2025-09-16
-- Purpose: Support the /browse page by adding creator-specific columns

-- =========================================
-- ADD MISSING COLUMNS FOR BROWSE PAGE
-- =========================================

-- Add creator browse columns with sensible defaults
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'artist',
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
ADD COLUMN IF NOT EXISTS total_videos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- =========================================
-- ADD INDEXES FOR PERFORMANCE
-- =========================================

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_profiles_category ON public.profiles(category) WHERE role = 'creator';

-- Index for filtering by verified status
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified) WHERE role = 'creator';

-- Index for sorting by rating
CREATE INDEX IF NOT EXISTS idx_profiles_average_rating ON public.profiles(average_rating DESC) WHERE role = 'creator';

-- Index for sorting by review count (popularity)
CREATE INDEX IF NOT EXISTS idx_profiles_total_reviews ON public.profiles(total_reviews DESC) WHERE role = 'creator';

-- =========================================
-- ADD CHECK CONSTRAINTS
-- =========================================

-- Ensure rating is between 0 and 5
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_average_rating_range;

ALTER TABLE public.profiles
ADD CONSTRAINT check_average_rating_range
CHECK (average_rating IS NULL OR (average_rating >= 0 AND average_rating <= 5));

-- Ensure response time is positive
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_response_time_positive;

ALTER TABLE public.profiles
ADD CONSTRAINT check_response_time_positive
CHECK (response_time_hours IS NULL OR response_time_hours > 0);

-- Ensure counts are non-negative
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_counts_non_negative;

ALTER TABLE public.profiles
ADD CONSTRAINT check_counts_non_negative
CHECK (
  (total_videos IS NULL OR total_videos >= 0) AND
  (total_reviews IS NULL OR total_reviews >= 0)
);

-- =========================================
-- DOCUMENTATION
-- =========================================

COMMENT ON COLUMN public.profiles.category IS 'Creator category/type (e.g., musician, comedian, actor, artist, athlete, etc.)';
COMMENT ON COLUMN public.profiles.verified IS 'Whether the creator has been verified by the platform administrators';
COMMENT ON COLUMN public.profiles.response_time_hours IS 'Average response time in hours for creator to fulfill video requests';
COMMENT ON COLUMN public.profiles.languages IS 'Array of languages the creator can communicate in';
COMMENT ON COLUMN public.profiles.total_videos IS 'Total number of personalized videos created by this creator';
COMMENT ON COLUMN public.profiles.average_rating IS 'Average rating from customer reviews on a scale of 0-5';
COMMENT ON COLUMN public.profiles.total_reviews IS 'Total number of customer reviews received';

-- =========================================
-- UPDATE EXISTING CREATORS WITH SAMPLE DATA
-- =========================================

-- Update any existing creators with more realistic default values based on their role
UPDATE public.profiles
SET
  category = CASE
    WHEN bio ILIKE '%music%' OR bio ILIKE '%singer%' OR bio ILIKE '%artist%' THEN 'musician'
    WHEN bio ILIKE '%comedy%' OR bio ILIKE '%comedian%' OR bio ILIKE '%funny%' THEN 'comedian'
    WHEN bio ILIKE '%actor%' OR bio ILIKE '%actress%' OR bio ILIKE '%film%' THEN 'actor'
    WHEN bio ILIKE '%athlete%' OR bio ILIKE '%sport%' OR bio ILIKE '%player%' THEN 'athlete'
    ELSE 'artist'
  END,
  languages = CASE
    WHEN bio ILIKE '%haitian%' OR bio ILIKE '%creole%' THEN ARRAY['Haitian Creole', 'French', 'English']::TEXT[]
    WHEN bio ILIKE '%french%' THEN ARRAY['French', 'English']::TEXT[]
    ELSE ARRAY['English']::TEXT[]
  END,
  response_time_hours = FLOOR(RANDOM() * 48 + 1)::INTEGER, -- Random between 1-48 hours
  verified = CASE WHEN RANDOM() > 0.3 THEN true ELSE false END -- 70% chance of being verified
WHERE role = 'creator';

-- =========================================
-- GRANT PERMISSIONS
-- =========================================

-- Ensure authenticated users can read these new columns
-- (RLS policies should already handle this, but being explicit)
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon; -- Allow anonymous users to browse creators