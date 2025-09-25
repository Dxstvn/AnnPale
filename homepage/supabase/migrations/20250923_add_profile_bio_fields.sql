-- Migration: Add bio and extended bio fields to profiles table
-- Date: 2025-09-23
-- Purpose: Support creator profile bio information

-- =========================================
-- ADD BIO COLUMNS
-- =========================================

-- Add bio column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add extended_bio column for longer descriptions
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS extended_bio TEXT;

-- =========================================
-- ADD CHECK CONSTRAINTS
-- =========================================

-- Ensure bio doesn't exceed 500 characters
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_bio_length;

ALTER TABLE public.profiles
ADD CONSTRAINT check_bio_length
CHECK (bio IS NULL OR LENGTH(bio) <= 500);

-- Ensure extended_bio doesn't exceed 2000 characters
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_extended_bio_length;

ALTER TABLE public.profiles
ADD CONSTRAINT check_extended_bio_length
CHECK (extended_bio IS NULL OR LENGTH(extended_bio) <= 2000);

-- =========================================
-- UPDATE EXISTING DATA
-- =========================================

-- If tagline exists, copy it to bio for creators who don't have a bio
UPDATE public.profiles
SET bio = COALESCE(bio, tagline)
WHERE role = 'creator' AND bio IS NULL AND tagline IS NOT NULL;

-- =========================================
-- DOCUMENTATION
-- =========================================

COMMENT ON COLUMN public.profiles.bio IS 'Short bio/tagline for creator profile (max 500 characters)';
COMMENT ON COLUMN public.profiles.extended_bio IS 'Extended bio/description for creator profile (max 2000 characters)';

-- =========================================
-- COMPLETION MESSAGE
-- =========================================

DO $$
BEGIN
  RAISE NOTICE 'Profile bio fields migration completed successfully';
  RAISE NOTICE 'Added columns: bio, extended_bio';
  RAISE NOTICE 'Added constraints for bio field lengths';
END $$;