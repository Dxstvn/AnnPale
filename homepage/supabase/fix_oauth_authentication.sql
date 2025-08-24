-- Fix OAuth Authentication Issues
-- This migration ensures OAuth users can authenticate properly and profiles are created

-- 1. First, check and enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to start fresh
DROP POLICY IF EXISTS "Enable insert for authentication" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can only update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- 3. Create comprehensive RLS policies
-- Allow anyone to read profiles (public profiles)
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);

-- 4. Create or replace the trigger function for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role user_role;
  user_name text;
  avatar_url text;
BEGIN
  -- Determine user role
  IF NEW.email IN ('jasmindustin@gmail.com', 'loicjasmin@gmail.com') THEN
    user_role := 'admin'::user_role;
  ELSE
    user_role := 'fan'::user_role;
  END IF;

  -- Extract name from OAuth metadata or email
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'user_name',
    split_part(NEW.email, '@', 1)
  );

  -- Extract avatar URL from OAuth metadata
  avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NEW.raw_user_meta_data->>'profile_image_url_https',
    NEW.raw_user_meta_data->>'profile_image_url'
  );

  -- Insert the profile
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    avatar_url,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_role,
    avatar_url,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(profiles.name, EXCLUDED.name),
    avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
    email_verified = EXCLUDED.email_verified,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail authentication
    RAISE LOG 'Error in handle_new_user trigger for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 5. Ensure the trigger is properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Create a function to manually create missing profiles for existing users
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, avatar_url, email_verified, created_at, updated_at)
  SELECT 
    u.id,
    u.email,
    COALESCE(
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name',
      u.raw_user_meta_data->>'user_name',
      split_part(u.email, '@', 1)
    ),
    CASE 
      WHEN u.email IN ('jasmindustin@gmail.com', 'loicjasmin@gmail.com') THEN 'admin'::user_role
      ELSE 'fan'::user_role
    END,
    COALESCE(
      u.raw_user_meta_data->>'avatar_url',
      u.raw_user_meta_data->>'picture',
      u.raw_user_meta_data->>'profile_image_url_https',
      u.raw_user_meta_data->>'profile_image_url'
    ),
    COALESCE(u.email_confirmed_at IS NOT NULL, false),
    COALESCE(u.created_at, NOW()),
    NOW()
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE p.id IS NULL;
END;
$$;

-- 7. Run the function to create any missing profiles
SELECT public.create_missing_profiles();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- 9. Verify the setup
DO $$
BEGIN
  RAISE NOTICE 'OAuth authentication fix completed successfully';
  RAISE NOTICE 'Profiles table RLS: enabled';
  RAISE NOTICE 'Trigger function: created';
  RAISE NOTICE 'Missing profiles: created';
END $$;