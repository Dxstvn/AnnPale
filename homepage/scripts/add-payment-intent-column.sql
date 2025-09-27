-- Check if column exists and add if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'video_requests'
        AND column_name = 'payment_intent_id'
    ) THEN
        ALTER TABLE video_requests
        ADD COLUMN payment_intent_id TEXT;

        -- Create index for faster lookups
        CREATE INDEX idx_video_requests_payment_intent_id
        ON video_requests(payment_intent_id)
        WHERE payment_intent_id IS NOT NULL;

        RAISE NOTICE 'Column payment_intent_id added successfully';
    ELSE
        RAISE NOTICE 'Column payment_intent_id already exists';
    END IF;
END $$;

-- Ensure RLS policies allow updating payment_intent_id
DROP POLICY IF EXISTS "Fans can update payment intent" ON video_requests;
CREATE POLICY "Fans can update payment intent"
ON video_requests
FOR UPDATE
USING (auth.uid() = fan_id)
WITH CHECK (auth.uid() = fan_id);