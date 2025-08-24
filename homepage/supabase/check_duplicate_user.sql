-- Check if there's a duplicate user issue

-- 1. Check if your Google account already exists in auth.users
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  raw_user_meta_data->>'name' as name,
  raw_app_meta_data->>'provider' as provider
FROM auth.users 
WHERE email = 'jasmindustin@gmail.com'
   OR raw_user_meta_data->>'email' = 'jasmindustin@gmail.com';

-- 2. Check if there's already a profile with your email
SELECT 
  id,
  email,
  name,
  role,
  created_at,
  updated_at
FROM public.profiles 
WHERE email = 'jasmindustin@gmail.com';

-- 3. If there's a mismatch (user exists but no profile), create the profile manually
-- ONLY RUN THIS IF YOU SEE A USER IN auth.users BUT NO PROFILE
-- DO $$
-- DECLARE
--   user_record RECORD;
-- BEGIN
--   SELECT * INTO user_record 
--   FROM auth.users 
--   WHERE email = 'jasmindustin@gmail.com' 
--   LIMIT 1;
--   
--   IF user_record.id IS NOT NULL THEN
--     INSERT INTO public.profiles (id, email, name, role, email_verified)
--     VALUES (
--       user_record.id,
--       user_record.email,
--       COALESCE(user_record.raw_user_meta_data->>'name', 'Dustin Jasmin'),
--       'admin',
--       true
--     )
--     ON CONFLICT (id) DO UPDATE
--     SET 
--       email = EXCLUDED.email,
--       name = EXCLUDED.name,
--       role = 'admin',
--       updated_at = NOW();
--     
--     RAISE NOTICE 'Profile created/updated for user %', user_record.email;
--   ELSE
--     RAISE NOTICE 'No user found with that email';
--   END IF;
-- END;
-- $$;