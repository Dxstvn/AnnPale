-- Simple sync of test users from remote to local
-- These IDs and data are from the remote database

-- Insert test users into profiles
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES 
    ('0f3753a3-029c-473a-9aee-fc107d10c569', 'testcreator@annpale.test', 'Test Creator', 'creator', '2024-08-22 03:39:55.839558+00', '2024-08-22 03:39:55.839558+00'),
    ('dc3fa8e7-1157-40f8-b7b0-001a0a8851a8', 'testadmin@annpale.test', 'Test Admin', 'admin', '2024-08-22 03:39:56.209982+00', '2024-08-22 03:39:56.209982+00'),
    ('06f50456-7d78-451b-b25e-ea6858fde159', 'testcreator2@annpale.test', 'Test Creator 2', 'creator', '2024-08-22 03:39:56.396764+00', '2024-08-22 03:39:56.396764+00'),
    ('8f8d7143-99e8-4ca6-868f-38df513e2264', 'testfan@annpale.test', 'Test Fan', 'fan', '2024-08-22 03:39:56.589161+00', '2024-08-22 03:39:56.589161+00')
ON CONFLICT (id) DO UPDATE 
SET 
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Verify the import
SELECT email, name, role FROM profiles WHERE email LIKE '%test%' ORDER BY email;