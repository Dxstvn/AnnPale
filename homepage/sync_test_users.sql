-- Sync test users from remote to local Supabase
-- This script creates test users with proper authentication

-- First, clear any existing test users
DELETE FROM profiles WHERE email LIKE '%test%@annpale.test';

-- Insert test user profiles (data from remote database)
INSERT INTO profiles (id, created_at, updated_at, name, email, avatar_url, bio, role, is_demo_account, demo_tier, category, public_figure_verified) VALUES
('662e93d6-9aac-418f-9fb2-be80b5cdd91c', '2024-08-22T03:39:55.839558+00:00', '2024-08-22T03:39:55.839558+00:00', 'Test Admin', 'testadmin@annpale.test', NULL, NULL, 'admin', false, NULL, NULL, false),
('e9e79b73-d87c-4e01-9b82-49c6ede4c9a0', '2024-08-22T03:39:56.209982+00:00', '2024-08-22T03:39:56.209982+00:00', 'Test Creator', 'testcreator@annpale.test', NULL, NULL, 'creator', false, NULL, 'Entertainment', false),
('c92f2bd5-9a53-4f8f-b6c8-61074db9fb8f', '2024-08-22T03:39:56.396764+00:00', '2024-08-22T03:39:56.396764+00:00', 'Test Creator 2', 'testcreator2@annpale.test', NULL, NULL, 'creator', false, NULL, 'Music', false),
('fb802e7b-e821-4c35-b48f-a2e2bc5f85b2', '2024-08-22T03:39:56.589161+00:00', '2024-08-22T03:39:56.589161+00:00', 'Test Fan', 'testfan@annpale.test', NULL, NULL, 'fan', false, NULL, NULL, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  category = EXCLUDED.category;

-- Also need to create auth users for these test accounts
-- Note: These will need to be created through Supabase Auth API or manually
-- The passwords are: TestAdmin123!, TestCreator123!, TestFan123!