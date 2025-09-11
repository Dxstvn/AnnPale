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

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION has_active_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION has_tier_access TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_subscription TO anon;
GRANT EXECUTE ON FUNCTION has_tier_access TO anon;

-- Create a test subscription for development
INSERT INTO public.creator_subscriptions (
  subscriber_id,
  creator_id,
  tier_id,
  status,
  expires_at
)
SELECT 
  p.id as subscriber_id,
  '530c7ea1-4946-4f34-b636-7530c2e376fb' as creator_id,
  t.id as tier_id,
  'active' as status,
  now() + interval '30 days' as expires_at
FROM public.profiles p
CROSS JOIN (
  SELECT id 
  FROM public.creator_subscription_tiers 
  WHERE creator_id = '530c7ea1-4946-4f34-b636-7530c2e376fb'
  AND is_active = true
  ORDER BY price ASC
  LIMIT 1
) t
WHERE p.id != '530c7ea1-4946-4f34-b636-7530c2e376fb'
  AND (p.role = 'fan' OR p.role IS NULL OR p.role != 'creator')
LIMIT 1
ON CONFLICT DO NOTHING;