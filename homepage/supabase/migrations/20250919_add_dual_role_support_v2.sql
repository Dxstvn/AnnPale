-- =========================================
-- DUAL ROLE SUPPORT - FAN/CREATOR SYSTEM V2
-- =========================================
-- This migration adds support for users to have both fan and creator capabilities
-- Users can activate creator features while maintaining their fan experience

-- Add columns to track creator activation for fans (if they don't exist)
DO $$
BEGIN
    -- Add is_creator column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public'
                   AND table_name = 'profiles'
                   AND column_name = 'is_creator') THEN
        ALTER TABLE public.profiles ADD COLUMN is_creator BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add creator_activated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public'
                   AND table_name = 'profiles'
                   AND column_name = 'creator_activated_at') THEN
        ALTER TABLE public.profiles ADD COLUMN creator_activated_at TIMESTAMPTZ;
    END IF;

    -- Add current_mode column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public'
                   AND table_name = 'profiles'
                   AND column_name = 'current_mode') THEN
        ALTER TABLE public.profiles ADD COLUMN current_mode TEXT DEFAULT 'fan' CHECK (current_mode IN ('fan', 'creator'));
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.is_creator IS 'Indicates if user has creator capabilities activated (can be true for both fans and creators)';
COMMENT ON COLUMN public.profiles.creator_activated_at IS 'Timestamp when user activated creator features';
COMMENT ON COLUMN public.profiles.current_mode IS 'Current viewing mode - determines which interface the user sees';

-- Update existing creators to have is_creator = true
UPDATE public.profiles
SET is_creator = TRUE
WHERE role = 'creator' AND is_creator IS DISTINCT FROM TRUE;

-- Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_profiles_is_creator
ON public.profiles(is_creator)
WHERE is_creator = TRUE;

CREATE INDEX IF NOT EXISTS idx_profiles_current_mode
ON public.profiles(current_mode);

-- =========================================
-- UPDATE RLS POLICIES FOR DUAL ROLES
-- =========================================

-- Drop and recreate policy for updating creator fields
DROP POLICY IF EXISTS "Users with creator access can update creator fields" ON public.profiles;
CREATE POLICY "Users with creator access can update creator fields" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      role = 'creator' OR
      (role = 'fan' AND is_creator = TRUE)
    )
  );

-- =========================================
-- FUNCTION TO ACTIVATE CREATOR FEATURES
-- =========================================

CREATE OR REPLACE FUNCTION activate_creator_features()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_profile RECORD;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get the user's current profile
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Check if already a creator or has creator access
  IF v_profile.role = 'creator' OR v_profile.is_creator = TRUE THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Creator features are already activated',
      'is_creator', true
    );
  END IF;

  -- Only fans can activate creator features
  IF v_profile.role != 'fan' THEN
    RAISE EXCEPTION 'Only fan accounts can activate creator features';
  END IF;

  -- Activate creator features
  UPDATE public.profiles
  SET
    is_creator = TRUE,
    creator_activated_at = NOW(),
    updated_at = NOW()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Creator features successfully activated',
    'is_creator', true,
    'activated_at', NOW()
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION activate_creator_features() TO authenticated;

-- =========================================
-- FUNCTION TO SWITCH VIEWING MODE
-- =========================================

CREATE OR REPLACE FUNCTION switch_user_mode(p_mode TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_profile RECORD;
BEGIN
  -- Validate mode parameter
  IF p_mode NOT IN ('fan', 'creator') THEN
    RAISE EXCEPTION 'Invalid mode. Must be "fan" or "creator"';
  END IF;

  -- Get the current user ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get the user's profile
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  -- Check if user can switch to creator mode
  IF p_mode = 'creator' AND v_profile.is_creator != TRUE THEN
    RAISE EXCEPTION 'Creator features not activated. Please activate creator features first.';
  END IF;

  -- Update the current mode
  UPDATE public.profiles
  SET
    current_mode = p_mode,
    updated_at = NOW()
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'mode', p_mode,
    'message', 'Successfully switched to ' || p_mode || ' mode'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION switch_user_mode(TEXT) TO authenticated;

-- =========================================
-- VIEW FOR USER CAPABILITIES
-- =========================================

-- Drop the view if it exists
DROP VIEW IF EXISTS user_capabilities;

CREATE VIEW user_capabilities AS
SELECT
  id,
  email,
  display_name,
  role,
  is_creator,
  current_mode,
  CASE
    WHEN role = 'admin' THEN ARRAY['admin', 'browse', 'order', 'create', 'moderate']
    WHEN role = 'creator' OR is_creator = TRUE THEN ARRAY['browse', 'order', 'create', 'earn']
    ELSE ARRAY['browse', 'order']
  END AS capabilities,
  CASE
    WHEN role = 'creator' THEN 'Creator'
    WHEN is_creator = TRUE THEN 'Fan + Creator'
    WHEN role = 'admin' THEN 'Admin'
    ELSE 'Fan'
  END AS account_type
FROM public.profiles;

-- Grant select permission on the view
GRANT SELECT ON user_capabilities TO authenticated;