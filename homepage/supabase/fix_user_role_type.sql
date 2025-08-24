-- Fix the missing user_role type that's causing OAuth to fail

-- Create the user_role enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('fan', 'creator', 'admin');
  END IF;
END$$;

-- Verify the type was created
SELECT typname, typtype, typcategory 
FROM pg_type 
WHERE typname = 'user_role';

-- Now update the trigger function to handle the enum properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is an admin email
  IF NEW.email IN ('jasmindustin@gmail.com', 'loicjasmin@gmail.com') THEN
    INSERT INTO public.profiles (id, email, name, role, email_verified)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'admin'::user_role,
      COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
    );
  ELSE
    -- Default to 'fan' role for OAuth users
    INSERT INTO public.profiles (id, email, name, role, email_verified)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'fan'::user_role,
      COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test that everything is working
SELECT 
  column_name,
  data_type,
  udt_name
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name = 'role';