-- Consolidated migration for profile and Stripe-related updates
-- This migration combines all critical changes needed for the Ann Pale platform

-- =========================================
-- PROFILE ENHANCEMENTS
-- =========================================

-- Add display_name column for user profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add first_name and last_name for better user data and Stripe prefilling
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Add Stripe onboarding tracking columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Add creator-specific columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS price_per_video DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS social_media TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- =========================================
-- DATA MIGRATION
-- =========================================

-- Populate display_name from existing name field if not set
UPDATE public.profiles
SET display_name = COALESCE(display_name, name)
WHERE display_name IS NULL AND name IS NOT NULL;

-- Parse first_name and last_name from existing name field
UPDATE public.profiles
SET
  first_name = COALESCE(first_name, SPLIT_PART(name, ' ', 1)),
  last_name = COALESCE(last_name,
    CASE
      WHEN ARRAY_LENGTH(STRING_TO_ARRAY(name, ' '), 1) > 1
      THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
      ELSE NULL
    END
  )
WHERE first_name IS NULL AND name IS NOT NULL;

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================

-- Create indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON public.profiles(stripe_account_id) WHERE stripe_account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_charges_enabled ON public.profiles(stripe_charges_enabled) WHERE role = 'creator';

-- =========================================
-- COLUMN DOCUMENTATION
-- =========================================

-- Add comments to document column purposes
COMMENT ON COLUMN public.profiles.display_name IS 'Public display name for the user (how they want to be known on the platform)';
COMMENT ON COLUMN public.profiles.first_name IS 'User first name for forms, legal documents, and Stripe onboarding prefilling';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name for forms, legal documents, and Stripe onboarding prefilling';
COMMENT ON COLUMN public.profiles.stripe_charges_enabled IS 'Indicates if creator has completed Stripe onboarding and can accept payments';
COMMENT ON COLUMN public.profiles.stripe_payouts_enabled IS 'Indicates if creator has completed Stripe onboarding and can receive payouts';
COMMENT ON COLUMN public.profiles.onboarding_completed_at IS 'Timestamp when creator successfully completed Stripe Connect onboarding';
COMMENT ON COLUMN public.profiles.price_per_video IS 'Creator-set price per personalized video message in USD';
COMMENT ON COLUMN public.profiles.social_media IS 'JSON object containing creator social media links';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number for account recovery and Stripe verification';
COMMENT ON COLUMN public.profiles.website IS 'Creator personal or professional website URL';

-- =========================================
-- ENSURE STRIPE ACCOUNT ID EXISTS
-- =========================================

-- Make sure stripe_account_id column exists (should already be there from earlier migrations)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT UNIQUE;

COMMENT ON COLUMN public.profiles.stripe_account_id IS 'Stripe Connect account ID for creators to receive payments';

-- =========================================
-- VALIDATION CONSTRAINTS
-- =========================================

-- Add check constraint for price_per_video
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_price_per_video_positive;

ALTER TABLE public.profiles
ADD CONSTRAINT check_price_per_video_positive
CHECK (price_per_video IS NULL OR price_per_video >= 0);

-- Add check constraint for role values
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS check_valid_role;

ALTER TABLE public.profiles
ADD CONSTRAINT check_valid_role
CHECK (role IN ('fan', 'creator', 'admin'));

-- =========================================
-- FUNCTION TO FORMAT DISPLAY NAME
-- =========================================

-- Create a function to get formatted display name (falls back to name if display_name is null)
CREATE OR REPLACE FUNCTION get_display_name(profile_row profiles)
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(profile_row.display_name, profile_row.name, 'User');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =========================================
-- COMPLETION MESSAGE
-- =========================================

DO $$
BEGIN
  RAISE NOTICE 'Profile and Stripe updates migration completed successfully';
  RAISE NOTICE 'Added columns: display_name, first_name, last_name, stripe_charges_enabled, stripe_payouts_enabled, onboarding_completed_at, price_per_video, social_media, phone, website';
  RAISE NOTICE 'Created indexes for performance optimization';
  RAISE NOTICE 'Added data validation constraints';
END $$;