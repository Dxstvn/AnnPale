-- Fix migration: Add missing tables and columns
-- This migration adds the missing tables that should have been created in the initial schema

-- Add missing columns to profiles if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_role user_role DEFAULT 'fan',
ADD COLUMN IF NOT EXISTS is_creator boolean DEFAULT false;

-- Create video_requests table
CREATE TABLE IF NOT EXISTS public.video_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL,
    occasion VARCHAR(100),
    recipient_name VARCHAR(255),
    instructions TEXT,
    price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    video_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.video_requests(id) ON DELETE CASCADE,
    fan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2),
    creator_earnings DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    refund_id TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create livestream_views table
CREATE TABLE IF NOT EXISTS public.livestream_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    livestream_id UUID,
    fan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create creator_followers table
CREATE TABLE IF NOT EXISTS public.creator_followers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(creator_id, follower_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_video_requests_fan ON public.video_requests(fan_id);
CREATE INDEX IF NOT EXISTS idx_video_requests_creator ON public.video_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_requests_status ON public.video_requests(status);
CREATE INDEX IF NOT EXISTS idx_transactions_fan ON public.transactions(fan_id);
CREATE INDEX IF NOT EXISTS idx_transactions_creator ON public.transactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_followers_creator ON public.creator_followers(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_followers_follower ON public.creator_followers(follower_id);

-- Enable RLS
ALTER TABLE public.video_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestream_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_followers ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view their own video requests" ON public.video_requests
    FOR SELECT USING (auth.uid() = fan_id OR auth.uid() = creator_id);

CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = fan_id OR auth.uid() = creator_id);

CREATE POLICY "Public can view creator followers count" ON public.creator_followers
    FOR SELECT USING (true);

CREATE POLICY "Users can follow creators" ON public.creator_followers
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow creators" ON public.creator_followers
    FOR DELETE USING (auth.uid() = follower_id);