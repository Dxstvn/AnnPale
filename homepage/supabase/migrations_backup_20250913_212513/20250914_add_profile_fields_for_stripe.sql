-- Add additional profile fields for better Stripe Connect prefilling
-- These fields will help reduce friction during onboarding

-- Add first_name and last_name columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- Add a function to generate username from name
CREATE OR REPLACE FUNCTION generate_username(full_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert name to lowercase and replace spaces with dots
  base_username := LOWER(REGEXP_REPLACE(full_name, '[^a-zA-Z0-9]+', '.', 'g'));
  base_username := TRIM(BOTH '.' FROM base_username);

  -- Ensure username is not empty
  IF base_username = '' OR base_username IS NULL THEN
    base_username := 'user';
  END IF;

  final_username := base_username;

  -- Check for uniqueness and add number if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter;
  END LOOP;

  RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles to have first_name and last_name based on name field
UPDATE public.profiles
SET
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = CASE
    WHEN ARRAY_LENGTH(STRING_TO_ARRAY(name, ' '), 1) > 1
    THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
    ELSE ''
  END
WHERE first_name IS NULL;

-- Generate usernames for existing profiles that don't have one
UPDATE public.profiles
SET username = generate_username(name)
WHERE username IS NULL;

-- Add comment explaining the purpose of these fields
COMMENT ON COLUMN public.profiles.first_name IS 'User first name for Stripe Connect prefilling';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name for Stripe Connect prefilling';
COMMENT ON COLUMN public.profiles.username IS 'Unique username for profile URLs (e.g., annpale.com/username)';
COMMENT ON COLUMN public.profiles.website IS 'Optional personal website URL';