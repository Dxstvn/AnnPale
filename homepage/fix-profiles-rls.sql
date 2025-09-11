-- Fix RLS policies for profiles table to allow public read access to creators

-- First, check existing policies
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

-- Drop restrictive policies that might be blocking access
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create a new policy that allows everyone (including anonymous users) to view creator profiles
CREATE POLICY "Public read access to creator profiles" 
ON profiles FOR SELECT 
USING (role = 'creator');

-- Create a policy that allows authenticated users to view all profiles
CREATE POLICY "Authenticated users can view all profiles" 
ON profiles FOR SELECT 
TO authenticated
USING (true);

-- Create a policy that allows anonymous users to view creator profiles
CREATE POLICY "Anonymous users can view creator profiles" 
ON profiles FOR SELECT 
TO anon
USING (role = 'creator');

-- Verify the new policies
SELECT 
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;