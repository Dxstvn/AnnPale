-- Create test users in auth.users table for local Supabase
-- These passwords are TestFan123!, TestCreator123!, TestAdmin123!

-- Insert auth users (password is encrypted using bcrypt)
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
) VALUES
    (
        '8f8d7143-99e8-4ca6-868f-38df513e2264',
        '00000000-0000-0000-0000-000000000000',
        'testfan@annpale.test',
        crypt('TestFan123!', gen_salt('bf')),
        now(),
        '2024-08-22 03:39:56.589161+00',
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        'authenticated',
        'authenticated'
    ),
    (
        '0f3753a3-029c-473a-9aee-fc107d10c569',
        '00000000-0000-0000-0000-000000000000',
        'testcreator@annpale.test',
        crypt('TestCreator123!', gen_salt('bf')),
        now(),
        '2024-08-22 03:39:55.839558+00',
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        'authenticated',
        'authenticated'
    ),
    (
        'dc3fa8e7-1157-40f8-b7b0-001a0a8851a8',
        '00000000-0000-0000-0000-000000000000',
        'testadmin@annpale.test',
        crypt('TestAdmin123!', gen_salt('bf')),
        now(),
        '2024-08-22 03:39:56.209982+00',
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        'authenticated',
        'authenticated'
    ),
    (
        '06f50456-7d78-451b-b25e-ea6858fde159',
        '00000000-0000-0000-0000-000000000000',
        'testcreator2@annpale.test',
        crypt('TestCreator123!', gen_salt('bf')),
        now(),
        '2024-08-22 03:39:56.396764+00',
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        'authenticated',
        'authenticated'
    )
ON CONFLICT (id) DO UPDATE
SET 
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Verify auth users were created
SELECT id, email FROM auth.users WHERE email LIKE '%test%' ORDER BY email;