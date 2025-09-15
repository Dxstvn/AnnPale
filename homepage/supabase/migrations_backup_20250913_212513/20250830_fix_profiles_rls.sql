-- Fix infinite recursion in profiles RLS policies
-- This migration drops problematic policies and creates simple, non-recursive ones

-- Drop all existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
DROP POLICY IF EXISTS "Authenticated can read profiles" ON profiles;

-- Create simple, non-recursive policy for authenticated users to read any profile
-- This is needed for the middleware to check user roles
CREATE POLICY "authenticated_read_all_profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "users_insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "users_delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);