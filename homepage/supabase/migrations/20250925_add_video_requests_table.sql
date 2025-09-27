-- Create video_requests table
CREATE TABLE IF NOT EXISTS video_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fan_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL CHECK (request_type IN ('personal', 'gift')),
    occasion TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT,
    instructions TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    rush_delivery BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pending_payment', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled', 'expired')),
    payment_intent_id TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_video_requests_fan_id ON video_requests(fan_id);
CREATE INDEX idx_video_requests_creator_id ON video_requests(creator_id);
CREATE INDEX idx_video_requests_status ON video_requests(status);
CREATE INDEX idx_video_requests_created_at ON video_requests(created_at DESC);

-- Add RLS policies
ALTER TABLE video_requests ENABLE ROW LEVEL SECURITY;

-- Policy for fans to create their own video requests
CREATE POLICY "Fans can create their own video requests"
    ON video_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = fan_id);

-- Policy for fans to view their own video requests
CREATE POLICY "Fans can view their own video requests"
    ON video_requests
    FOR SELECT
    TO authenticated
    USING (auth.uid() = fan_id);

-- Policy for creators to view video requests made to them
CREATE POLICY "Creators can view video requests made to them"
    ON video_requests
    FOR SELECT
    TO authenticated
    USING (auth.uid() = creator_id);

-- Policy for creators to update video requests made to them
CREATE POLICY "Creators can update video requests made to them"
    ON video_requests
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Policy for fans to update their own pending requests
CREATE POLICY "Fans can update their own pending requests"
    ON video_requests
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = fan_id AND status IN ('pending', 'pending_payment'))
    WITH CHECK (auth.uid() = fan_id);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_video_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_requests_updated_at
    BEFORE UPDATE ON video_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_video_requests_updated_at();

-- Add function to handle expiration of requests
CREATE OR REPLACE FUNCTION expire_old_video_requests()
RETURNS void AS $$
BEGIN
    UPDATE video_requests
    SET status = 'expired'
    WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;