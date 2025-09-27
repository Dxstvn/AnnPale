-- Add payment_intent_id column to video_requests table
ALTER TABLE video_requests
ADD COLUMN payment_intent_id TEXT;

-- Create an index on payment_intent_id for faster lookups
CREATE INDEX idx_video_requests_payment_intent_id
ON video_requests(payment_intent_id)
WHERE payment_intent_id IS NOT NULL;

-- Add a unique constraint to ensure one payment intent per video request
ALTER TABLE video_requests
ADD CONSTRAINT unique_payment_intent_id
UNIQUE(payment_intent_id);

-- Update RLS policies to ensure users can read their own video requests
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own video requests" ON video_requests;

-- Create comprehensive read policy
CREATE POLICY "Users can view their own video requests"
ON video_requests
FOR SELECT
USING (
  auth.uid() = fan_id OR
  auth.uid() = creator_id
);

-- Ensure users can update their own video requests (for payment intent ID)
DROP POLICY IF EXISTS "Users can update their own video requests" ON video_requests;

CREATE POLICY "Users can update their own video requests"
ON video_requests
FOR UPDATE
USING (auth.uid() = fan_id)
WITH CHECK (auth.uid() = fan_id);