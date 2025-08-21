-- CHECK FOR SUSPICIOUS ACTIVITY
-- Run this periodically to monitor for unauthorized access

-- 1. Check for new users created in the last 24 hours
SELECT 
  'New User' as activity_type,
  created_at,
  email,
  raw_user_meta_data->>'name' as name,
  last_sign_in_at
FROM auth.users
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 2. Check for any admin users (should only be you and loicjasmin)
SELECT 
  'Admin User Check' as activity_type,
  p.email,
  p.name,
  p.role,
  p.created_at,
  p.updated_at
FROM profiles p
WHERE role = 'admin';

-- 3. Check for recent profile updates
SELECT 
  'Profile Update' as activity_type,
  email,
  name,
  role,
  updated_at
FROM profiles
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;

-- 4. Check for any bookings created recently
SELECT 
  'Recent Booking' as activity_type,
  id,
  customer_id,
  creator_id,
  status,
  created_at
FROM bookings
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 5. Count total users to detect mass deletions
SELECT 
  'User Count' as metric,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
  COUNT(CASE WHEN role = 'creator' THEN 1 END) as creator_count,
  COUNT(CASE WHEN role = 'fan' THEN 1 END) as fan_count
FROM profiles;

-- 6. Check auth logs for failed attempts (if available)
SELECT 
  'Auth Log' as activity_type,
  created_at,
  raw_user_meta_data->>'email' as email,
  raw_app_meta_data->>'provider' as provider,
  last_sign_in_at
FROM auth.users
WHERE last_sign_in_at > NOW() - INTERVAL '1 hour'
ORDER BY last_sign_in_at DESC
LIMIT 20;