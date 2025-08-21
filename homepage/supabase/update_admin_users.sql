-- Update the handle_new_user function to include both admin emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role user_role;
BEGIN
  -- Check if this is an admin email
  IF NEW.email IN ('jasmindustin@gmail.com', 'loicjasmin@gmail.com') THEN
    user_role := 'admin';
  ELSE
    -- Default to 'fan' role, will be updated during signup process
    user_role := 'fan';
  END IF;

  INSERT INTO public.profiles (id, email, name, role, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    user_role,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- If loicjasmin@gmail.com already exists in the database, update their role to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'loicjasmin@gmail.com';

-- Verify the admin users
SELECT email, name, role, created_at 
FROM public.profiles 
WHERE email IN ('jasmindustin@gmail.com', 'loicjasmin@gmail.com');