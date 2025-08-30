-- Create creator_subscription_tiers table
CREATE TABLE IF NOT EXISTS public.creator_subscription_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    billing_period VARCHAR(20) DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),
    features JSONB DEFAULT '[]'::jsonb,
    benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
    max_subscribers INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Tier-specific features
    ad_free BOOLEAN DEFAULT false,
    early_access BOOLEAN DEFAULT false,
    exclusive_content BOOLEAN DEFAULT false,
    direct_messaging BOOLEAN DEFAULT false,
    group_chat_access BOOLEAN DEFAULT false,
    monthly_video_message BOOLEAN DEFAULT false,
    priority_requests BOOLEAN DEFAULT false,
    behind_scenes BOOLEAN DEFAULT false,
    
    -- Ensure unique tier names per creator
    CONSTRAINT unique_tier_name_per_creator UNIQUE(creator_id, tier_name)
);

-- Create indexes for better query performance
CREATE INDEX idx_creator_subscription_tiers_creator_id ON public.creator_subscription_tiers(creator_id);
CREATE INDEX idx_creator_subscription_tiers_is_active ON public.creator_subscription_tiers(is_active);
CREATE INDEX idx_creator_subscription_tiers_price ON public.creator_subscription_tiers(price);

-- Enable Row Level Security
ALTER TABLE public.creator_subscription_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Anyone can view active tiers (for browsing/subscription)
CREATE POLICY "Anyone can view active tiers"
    ON public.creator_subscription_tiers
    FOR SELECT
    USING (is_active = true);

-- Policy: Creators can view all their own tiers (active and inactive)
CREATE POLICY "Creators can view all their own tiers"
    ON public.creator_subscription_tiers
    FOR SELECT
    USING (
        auth.uid() = creator_id
    );

-- Policy: Creators can insert their own tiers
CREATE POLICY "Creators can insert their own tiers"
    ON public.creator_subscription_tiers
    FOR INSERT
    WITH CHECK (
        auth.uid() = creator_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'creator'
        )
    );

-- Policy: Creators can update their own tiers
CREATE POLICY "Creators can update their own tiers"
    ON public.creator_subscription_tiers
    FOR UPDATE
    USING (
        auth.uid() = creator_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'creator'
        )
    )
    WITH CHECK (
        auth.uid() = creator_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'creator'
        )
    );

-- Policy: Creators can delete their own tiers
CREATE POLICY "Creators can delete their own tiers"
    ON public.creator_subscription_tiers
    FOR DELETE
    USING (
        auth.uid() = creator_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'creator'
        )
    );

-- Policy: Admins can manage all tiers
CREATE POLICY "Admins can manage all tiers"
    ON public.creator_subscription_tiers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_creator_subscription_tiers_updated_at
    BEFORE UPDATE ON public.creator_subscription_tiers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to validate tier limits per creator
CREATE OR REPLACE FUNCTION public.check_tier_limit()
RETURNS TRIGGER AS $$
DECLARE
    tier_count INTEGER;
    max_tiers INTEGER := 10; -- Maximum tiers per creator
BEGIN
    SELECT COUNT(*) INTO tier_count
    FROM public.creator_subscription_tiers
    WHERE creator_id = NEW.creator_id;
    
    IF tier_count >= max_tiers THEN
        RAISE EXCEPTION 'Creator cannot have more than % subscription tiers', max_tiers;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce tier limits
CREATE TRIGGER check_tier_limit_before_insert
    BEFORE INSERT ON public.creator_subscription_tiers
    FOR EACH ROW
    EXECUTE FUNCTION public.check_tier_limit();

-- Grant necessary permissions
GRANT ALL ON public.creator_subscription_tiers TO authenticated;
GRANT ALL ON public.creator_subscription_tiers TO service_role;

-- Add comment to table
COMMENT ON TABLE public.creator_subscription_tiers IS 'Stores subscription tier information for creators, allowing them to define multiple pricing tiers with different features and benefits';