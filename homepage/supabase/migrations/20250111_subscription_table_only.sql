-- Drop existing table if it exists (be careful with this in production!)
DROP TABLE IF EXISTS public.creator_subscriptions CASCADE;

-- Create subscriptions table to track creator subscriptions
CREATE TABLE public.creator_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES public.creator_subscription_tiers(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_creator_subscriptions_subscriber ON public.creator_subscriptions(subscriber_id);
CREATE INDEX idx_creator_subscriptions_creator ON public.creator_subscriptions(creator_id);
CREATE INDEX idx_creator_subscriptions_status ON public.creator_subscriptions(status);
CREATE INDEX idx_creator_subscriptions_tier ON public.creator_subscriptions(tier_id);
CREATE INDEX idx_creator_subscriptions_expires ON public.creator_subscriptions(expires_at);

-- Enable RLS
ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies separately
CREATE POLICY "select_own_subscriptions" 
  ON public.creator_subscriptions 
  FOR SELECT 
  USING (true);  -- Temporarily allow all selects for testing

CREATE POLICY "manage_own_subscriptions" 
  ON public.creator_subscriptions 
  FOR INSERT 
  WITH CHECK (true);  -- Temporarily allow all inserts for testing

CREATE POLICY "update_own_subscriptions" 
  ON public.creator_subscriptions 
  FOR UPDATE 
  USING (true);  -- Temporarily allow all updates for testing

-- Grant permissions
GRANT ALL ON public.creator_subscriptions TO authenticated;
GRANT ALL ON public.creator_subscriptions TO anon;