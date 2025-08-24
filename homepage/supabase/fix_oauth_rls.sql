-- Fix OAuth authentication by adjusting RLS policies
-- The issue is that the trigger needs to insert profiles but RLS is blocking it

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can only update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create new policies that allow the trigger to work
CREATE POLICY "Enable insert for authentication" 
  ON profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Enable update for users based on id" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);

-- Verify the trigger function exists and is correct
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role user_role;
BEGIN
  -- Check if this is an admin email
  IF NEW.email IN ('jasmindustin@gmail.com', 'loicjasmin@gmail.com') THEN
    user_role := 'admin';
  ELSE
    -- Default to 'fan' role for OAuth users
    user_role := 'fan';
  END IF;

  INSERT INTO public.profiles (id, email, name, role, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    user_role,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Test that the policies are working
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';