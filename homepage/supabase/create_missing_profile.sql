-- Create profile for jasmindustin@gmail.com
INSERT INTO public.profiles (id, email, name, role, email_verified)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', 'Dustin Jasmin'),
  'admin'::user_role,
  true
FROM auth.users 
WHERE email = 'jasmindustin@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin'::user_role,
  email_verified = true,
  updated_at = NOW();

-- Verify it was created
SELECT * FROM profiles WHERE email = 'jasmindustin@gmail.com';