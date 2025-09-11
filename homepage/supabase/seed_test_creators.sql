-- Seed data for test creators
-- This file creates test creators with different tiers for E2E testing

-- First ensure we have creator profiles
INSERT INTO profiles (id, email, full_name, username, bio, avatar_url, user_type, category, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'creator1@test.com', 'Jean Baptiste', 'jeanbaptiste', 'Popular Haitian musician and performer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator1', 'creator', 'Music', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'creator2@test.com', 'Marie Louise', 'marielouise', 'Renowned Haitian actress and comedian', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator2', 'creator', 'Comedy', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'creator3@test.com', 'Pierre Michel', 'pierremichel', 'Professional athlete and sports personality', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator3', 'creator', 'Sports', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  user_type = EXCLUDED.user_type,
  category = EXCLUDED.category,
  updated_at = NOW();

-- Add the testcreator to creators table
INSERT INTO profiles (id, email, full_name, username, bio, avatar_url, user_type, category, created_at, updated_at)
VALUES 
  ('bd47a39e-de73-4aa4-bd58-d11bcdacd63f', 'testcreator@annpale.test', 'Test Creator', 'testcreator', 'Test creator for E2E testing', 'https://api.dicebear.com/7.x/avataaars/svg?seed=testcreator', 'creator', 'Entertainment', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  user_type = EXCLUDED.user_type,
  category = EXCLUDED.category,
  updated_at = NOW();

-- Create subscription tiers for creators
INSERT INTO creator_subscription_tiers (id, creator_id, name, description, price, benefits, max_subscribers, is_active, created_at, updated_at)
VALUES
  -- Jean Baptiste's tiers
  ('tier-001', '550e8400-e29b-41d4-a716-446655440001', 'Bronze Fan', 'Basic support tier', 9.99, 
   ARRAY['Monthly shoutout', 'Access to exclusive posts', 'Bronze badge'], 
   NULL, true, NOW(), NOW()),
  ('tier-002', '550e8400-e29b-41d4-a716-446655440001', 'Silver Supporter', 'Premium support tier', 19.99, 
   ARRAY['Weekly shoutouts', 'Exclusive content', 'Behind-the-scenes access', 'Silver badge', 'Monthly Q&A'], 
   NULL, true, NOW(), NOW()),
  ('tier-003', '550e8400-e29b-41d4-a716-446655440001', 'Gold VIP', 'Ultimate fan tier', 49.99, 
   ARRAY['Daily interaction', 'All exclusive content', 'Personal messages', 'Gold badge', 'Weekly video calls', 'Meet & greet opportunities'], 
   100, true, NOW(), NOW()),
   
  -- Marie Louise's tiers
  ('tier-004', '550e8400-e29b-41d4-a716-446655440002', 'Comedy Club', 'Join the laughter', 14.99, 
   ARRAY['New comedy sketches', 'Blooper reels', 'Fan submissions featured'], 
   NULL, true, NOW(), NOW()),
  ('tier-005', '550e8400-e29b-41d4-a716-446655440002', 'VIP Comedy', 'Premium comedy experience', 29.99, 
   ARRAY['Early access to shows', 'Script previews', 'Virtual meet & greets', 'Personalized jokes'], 
   50, true, NOW(), NOW()),
   
  -- Pierre Michel's tier (single tier)
  ('tier-006', '550e8400-e29b-41d4-a716-446655440003', 'Team Pierre', 'Join the team', 24.99, 
   ARRAY['Training videos', 'Diet plans', 'Workout routines', 'Monthly coaching call'], 
   NULL, true, NOW(), NOW()),
   
  -- Test Creator's tiers
  ('tier-007', 'bd47a39e-de73-4aa4-bd58-d11bcdacd63f', 'Test Basic', 'Basic test tier', 5.00, 
   ARRAY['Test benefit 1', 'Test benefit 2'], 
   NULL, true, NOW(), NOW()),
  ('tier-008', 'bd47a39e-de73-4aa4-bd58-d11bcdacd63f', 'Test Premium', 'Premium test tier', 15.00, 
   ARRAY['All basic benefits', 'Premium test benefit 1', 'Premium test benefit 2'], 
   NULL, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  benefits = EXCLUDED.benefits,
  max_subscribers = EXCLUDED.max_subscribers,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Add some video request pricing for creators
INSERT INTO video_requests (id, creator_id, base_price, is_accepting_requests, turnaround_days, created_at, updated_at)
VALUES
  ('vr-001', '550e8400-e29b-41d4-a716-446655440001', 75.00, true, 7, NOW(), NOW()),
  ('vr-002', '550e8400-e29b-41d4-a716-446655440002', 50.00, true, 5, NOW(), NOW()),
  ('vr-003', '550e8400-e29b-41d4-a716-446655440003', 100.00, true, 14, NOW(), NOW()),
  ('vr-004', 'bd47a39e-de73-4aa4-bd58-d11bcdacd63f', 25.00, true, 3, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  base_price = EXCLUDED.base_price,
  is_accepting_requests = EXCLUDED.is_accepting_requests,
  turnaround_days = EXCLUDED.turnaround_days,
  updated_at = NOW();

-- Add some posts for creators to make profiles more realistic
INSERT INTO posts (id, creator_id, content, is_public, created_at, updated_at)
VALUES
  ('post-001', '550e8400-e29b-41d4-a716-446655440001', 'New music video coming soon! 🎵', true, NOW() - INTERVAL '2 days', NOW()),
  ('post-002', '550e8400-e29b-41d4-a716-446655440001', 'Thank you for all the support! ❤️', false, NOW() - INTERVAL '1 day', NOW()),
  ('post-003', '550e8400-e29b-41d4-a716-446655440002', 'Behind the scenes from latest comedy show 😂', true, NOW() - INTERVAL '3 days', NOW()),
  ('post-004', '550e8400-e29b-41d4-a716-446655440003', 'Training hard for the next match! 💪', true, NOW() - INTERVAL '5 days', NOW())
ON CONFLICT (id) DO NOTHING;