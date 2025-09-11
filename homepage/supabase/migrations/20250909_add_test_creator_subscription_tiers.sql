-- Add subscription tiers for the E2E test creator
-- Test Creator ID: 0f3753a3-029c-473a-9aee-fc107d10c569

-- First ensure the test creator profile exists
INSERT INTO profiles (id, email, name, display_name, bio, role, created_at, updated_at)
VALUES (
  '0f3753a3-029c-473a-9aee-fc107d10c569',
  'testcreator@annpale.test',
  'Test Creator',
  'Test Creator',
  'Test creator account for E2E testing',
  'creator',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Update the test creator's Stripe account ID to the test Connect account
UPDATE profiles
SET stripe_account_id = 'acct_1S3TOyEM4K7HiodW'
WHERE id = '0f3753a3-029c-473a-9aee-fc107d10c569';

-- Add subscription tiers for the test creator
INSERT INTO creator_subscription_tiers (
  creator_id,
  tier_name,
  description,
  price,
  benefits,
  tier_type,
  is_active,
  created_at,
  updated_at
)
VALUES 
  -- Gold Tier - matching the test price of $9.99
  (
    '0f3753a3-029c-473a-9aee-fc107d10c569',
    'Gold Tier',
    'Premium subscription tier for testing',
    9.99,
    '["Access to exclusive content", "Monthly video messages", "Priority support", "Behind-the-scenes access"]'::jsonb,
    'premium',
    true,
    NOW(),
    NOW()
  ),
  -- Silver Tier - alternative test tier
  (
    '0f3753a3-029c-473a-9aee-fc107d10c569',
    'Silver Tier',
    'Standard subscription tier for testing',
    4.99,
    '["Access to exclusive content", "Community access", "Monthly updates"]'::jsonb,
    'basic',
    true,
    NOW(),
    NOW()
  ),
  -- Platinum Tier - high-value test tier
  (
    '0f3753a3-029c-473a-9aee-fc107d10c569',
    'Platinum Tier',
    'VIP subscription tier for testing',
    19.99,
    '["Everything in Gold Tier", "Weekly video calls", "Personal shoutouts", "VIP community access", "Early access to new content"]'::jsonb,
    'vip',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (creator_id, tier_name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  benefits = EXCLUDED.benefits,
  tier_type = EXCLUDED.tier_type,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the tiers were created
SELECT 
  p.name as creator_name,
  p.stripe_account_id,
  COUNT(t.id) as tier_count,
  STRING_AGG(t.tier_name || ' ($' || t.price || ')', ', ' ORDER BY t.price) as tiers
FROM profiles p
LEFT JOIN creator_subscription_tiers t ON p.id = t.creator_id
WHERE p.id = '0f3753a3-029c-473a-9aee-fc107d10c569'
GROUP BY p.name, p.stripe_account_id;