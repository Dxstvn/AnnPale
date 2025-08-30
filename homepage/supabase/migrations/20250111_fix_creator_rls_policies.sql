-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Creators can insert their own tiers" ON public.creator_subscription_tiers;

-- Create new INSERT policy that's less restrictive
CREATE POLICY "Creators can insert their own tiers"
    ON public.creator_subscription_tiers
    FOR INSERT
    WITH CHECK (
        auth.uid() = creator_id
    );

-- Drop existing UPDATE policy
DROP POLICY IF EXISTS "Creators can update their own tiers" ON public.creator_subscription_tiers;

-- Create new UPDATE policy
CREATE POLICY "Creators can update their own tiers"
    ON public.creator_subscription_tiers
    FOR UPDATE
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Drop existing DELETE policy
DROP POLICY IF EXISTS "Creators can delete their own tiers" ON public.creator_subscription_tiers;

-- Create new DELETE policy
CREATE POLICY "Creators can delete their own tiers"
    ON public.creator_subscription_tiers
    FOR DELETE
    USING (auth.uid() = creator_id);