-- Add INSERT policy for video_requests table
-- This allows authenticated users to create video requests for themselves

-- Drop the policy if it exists (for idempotency)
DROP POLICY IF EXISTS "Users can create video requests" ON video_requests;

-- Create the INSERT policy
CREATE POLICY "Users can create video requests" 
ON video_requests 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = fan_id);

-- This policy ensures that:
-- 1. Only authenticated users can insert video requests
-- 2. Users can only create requests where they are the fan (fan_id matches their auth.uid())
-- 3. This prevents users from creating requests on behalf of others