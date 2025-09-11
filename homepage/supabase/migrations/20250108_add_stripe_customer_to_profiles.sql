-- Add stripe_customer_id to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Add stripe_price_id columns to creator_subscription_tiers if they don't exist
ALTER TABLE creator_subscription_tiers
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id_yearly TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_creator_subscription_tiers_stripe_product_id ON creator_subscription_tiers(stripe_product_id);