-- Update profiles table to use display_name and remove username generation

-- Remove the username generation function if it exists
DROP FUNCTION IF EXISTS generate_username(TEXT);

-- Add display_name column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update existing records to use name as display_name if not set
UPDATE profiles
SET display_name = COALESCE(display_name, name)
WHERE display_name IS NULL;

-- Clear any auto-generated usernames (optional - you can keep existing ones)
-- UPDATE profiles SET username = NULL WHERE username IS NOT NULL;

-- Add comments to clarify column purposes
COMMENT ON COLUMN public.profiles.display_name IS 'Display name for the user profile (how they want to be known)';
COMMENT ON COLUMN public.profiles.username IS 'Optional username - not auto-generated, can be set manually';
COMMENT ON COLUMN public.profiles.first_name IS 'User first name for forms and Stripe prefilling';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name for forms and Stripe prefilling';

-- Ensure we have indexes on the fields we'll query
CREATE INDEX IF NOT EXISTS profiles_display_name_idx ON public.profiles(display_name);

-- Add any missing creator-specific columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stage_name TEXT,
ADD COLUMN IF NOT EXISTS price_per_video DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS social_media TEXT;

-- Add comments for creator-specific columns
COMMENT ON COLUMN public.profiles.stage_name IS 'Stage name for creators (deprecated - use display_name)';
COMMENT ON COLUMN public.profiles.price_per_video IS 'Creator price per video in USD';
COMMENT ON COLUMN public.profiles.social_media IS 'Creator social media links';