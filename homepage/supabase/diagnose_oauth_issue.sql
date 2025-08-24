-- Diagnostic queries to find the OAuth issue

-- 1. Check if RLS is enabled on profiles table
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 2. Check existing policies on profiles
SELECT 
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 4. Check for any recent auth users (last hour)
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'name' as name
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 5. Check for any profiles created recently
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM public.profiles 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 6. Try to manually test the trigger function with a dummy user
-- This will help identify if the function itself has issues
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- Try to simulate what the trigger does
  INSERT INTO public.profiles (id, email, name, role, email_verified)
  VALUES (
    test_user_id,
    'test@example.com',
    'Test User',
    'fan',
    true
  );
  
  -- If successful, delete the test record
  DELETE FROM public.profiles WHERE id = test_user_id;
  
  RAISE NOTICE 'Manual insert test successful';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Manual insert test failed: %', SQLERRM;
END;
$$;