-- Combined migration to add display_name and Stripe-related fields to profiles
-- This ensures remote database is aligned with local changes

-- Add display_name column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add first_name and last_name columns for Stripe prefilling
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Add Stripe-related columns for onboarding status
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Update existing records to use name as display_name if not set
UPDATE profiles
SET display_name = COALESCE(display_name, name)
WHERE display_name IS NULL;

-- Update existing profiles to have first_name and last_name based on name field
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
WHERE first_name IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_display_name_idx ON public.profiles(display_name);
CREATE INDEX IF NOT EXISTS profiles_stripe_account_id_idx ON public.profiles(stripe_account_id) WHERE stripe_account_id IS NOT NULL;

-- Add comments to clarify column purposes
COMMENT ON COLUMN public.profiles.display_name IS 'Display name for the user profile (how they want to be known)';
COMMENT ON COLUMN public.profiles.first_name IS 'User first name for forms and Stripe prefilling';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name for forms and Stripe prefilling';
COMMENT ON COLUMN public.profiles.stripe_charges_enabled IS 'Whether Stripe charges are enabled for this creator';
COMMENT ON COLUMN public.profiles.stripe_payouts_enabled IS 'Whether Stripe payouts are enabled for this creator';
COMMENT ON COLUMN public.profiles.onboarding_completed_at IS 'Timestamp when Stripe onboarding was completed';

-- Add creator-specific columns if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS price_per_video DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS social_media TEXT;

-- Add comments for creator-specific columns
COMMENT ON COLUMN public.profiles.price_per_video IS 'Creator price per video in USD';
COMMENT ON COLUMN public.profiles.social_media IS 'Creator social media links';