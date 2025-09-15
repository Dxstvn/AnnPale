-- Create subscriptions table to track creator subscriptions
CREATE TABLE IF NOT EXISTS public.creator_subscriptions (
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
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_subscriber ON public.creator_subscriptions(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_creator ON public.creator_subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_status ON public.creator_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_tier ON public.creator_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_expires ON public.creator_subscriptions(expires_at);

-- Enable RLS
ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (reference columns directly without table prefix)
CREATE POLICY "Users can view their own subscriptions" ON public.creator_subscriptions
  FOR SELECT USING (
    auth.uid() = subscriber_id OR 
    auth.uid() = creator_id
  );
  
CREATE POLICY "Users can manage their own subscriptions" ON public.creator_subscriptions
  FOR ALL USING (auth.uid() = subscriber_id);

-- Function to check if a user has an active subscription to a creator
CREATE OR REPLACE FUNCTION has_active_subscription(
  p_subscriber_id UUID,
  p_creator_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.creator_subscriptions 
    WHERE subscriber_id = p_subscriber_id 
      AND creator_id = p_creator_id 
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user has access to a specific tier
CREATE OR REPLACE FUNCTION has_tier_access(
  p_subscriber_id UUID,
  p_creator_id UUID,
  p_tier_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_subscription_tier_id UUID;
  v_subscription_tier_price DECIMAL;
  v_required_tier_price DECIMAL;
BEGIN
  -- Get the subscriber's current tier for this creator
  SELECT tier_id INTO v_subscription_tier_id
  FROM public.creator_subscriptions
  WHERE subscriber_id = p_subscriber_id 
    AND creator_id = p_creator_id 
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
  LIMIT 1;
  
  -- If no subscription, no access
  IF v_subscription_tier_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- If subscribed to the exact tier, has access
  IF v_subscription_tier_id = p_tier_id THEN
    RETURN TRUE;
  END IF;
  
  -- Check if subscribed to a higher tier (by price)
  SELECT price INTO v_subscription_tier_price
  FROM public.creator_subscription_tiers
  WHERE id = v_subscription_tier_id;
  
  SELECT price INTO v_required_tier_price
  FROM public.creator_subscription_tiers
  WHERE id = p_tier_id;
  
  -- If subscribed to a more expensive tier, has access to lower tiers
  RETURN COALESCE(v_subscription_tier_price, 0) >= COALESCE(v_required_tier_price, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.creator_subscriptions TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION has_tier_access TO authenticated;

-- Create a test subscription for development (optional - comment out in production)
DO $$
DECLARE
  v_fan_id UUID;
  v_creator_id UUID := '530c7ea1-4946-4f34-b636-7530c2e376fb'; -- Dustin Jasmin
  v_tier_id UUID;
BEGIN
  -- Get a fan user (not the creator)
  SELECT id INTO v_fan_id
  FROM public.profiles
  WHERE id != v_creator_id
    AND (role = 'fan' OR role IS NULL OR role != 'creator')
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Get the lowest tier for this creator
  SELECT id INTO v_tier_id
  FROM public.creator_subscription_tiers
  WHERE creator_id = v_creator_id
    AND is_active = true
  ORDER BY price ASC
  LIMIT 1;
  
  -- Create a test subscription if we have both IDs
  IF v_fan_id IS NOT NULL AND v_tier_id IS NOT NULL THEN
    INSERT INTO public.creator_subscriptions (
      subscriber_id,
      creator_id,
      tier_id,
      status,
      expires_at
    ) VALUES (
      v_fan_id,
      v_creator_id,
      v_tier_id,
      'active',
      now() + interval '30 days'
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Created test subscription for fan % to creator %', v_fan_id, v_creator_id;
  ELSE
    RAISE NOTICE 'Could not create test subscription - fan_id: %, tier_id: %', v_fan_id, v_tier_id;
  END IF;
END $$;