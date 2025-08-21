-- EMERGENCY SECURITY MEASURES
-- Run this immediately in Supabase SQL editor to add additional security

-- Enable RLS on all tables if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_creators ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies for profiles table
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can only update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Restrict bookings to authenticated users only
CREATE POLICY "Bookings viewable by participants only"
  ON bookings FOR SELECT
  USING (
    auth.uid() = customer_id OR 
    auth.uid() = creator_id
  );

CREATE POLICY "Only customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Protect videos table
CREATE POLICY "Videos viewable by owner and recipient"
  ON videos FOR SELECT
  USING (
    auth.uid() = booking_id::uuid OR
    auth.uid() IN (
      SELECT customer_id FROM bookings WHERE id = videos.booking_id
    ) OR
    auth.uid() IN (
      SELECT creator_id FROM bookings WHERE id = videos.booking_id
    )
  );

-- Protect messages
CREATE POLICY "Messages viewable by participants only"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Add audit log for tracking suspicious activity
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to log authentication attempts
CREATE OR REPLACE FUNCTION log_auth_attempt()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO security_audit_log (event_type, user_id, details)
  VALUES ('auth_attempt', NEW.id, jsonb_build_object(
    'email', NEW.email,
    'provider', NEW.raw_app_meta_data->>'provider'
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log auth attempts
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION log_auth_attempt();

-- Check for any suspicious activity in the last 24 hours
SELECT 
  created_at,
  email,
  raw_user_meta_data->>'name' as name,
  last_sign_in_at
FROM auth.users
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;