-- Video Management Schema Migration
-- This migration creates tables for video requests, videos, transactions, and access control

-- Create payment provider enum
CREATE TYPE payment_provider AS ENUM ('stripe', 'moncash', 'paypal');

-- Create video request status enum
CREATE TYPE video_request_status AS ENUM (
  'pending',      -- Request created, awaiting creator acceptance
  'accepted',     -- Creator accepted, awaiting recording
  'rejected',     -- Creator rejected the request
  'recording',    -- Creator is recording the video
  'processing',   -- Video uploaded, being processed
  'completed',    -- Video delivered to fan
  'cancelled',    -- Request cancelled (refunded)
  'expired'       -- Deadline passed without completion
);

-- Create video requests table
CREATE TABLE IF NOT EXISTS public.video_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fan_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  
  -- Request details
  occasion TEXT NOT NULL, -- Birthday, Anniversary, etc.
  recipient_name TEXT NOT NULL,
  instructions TEXT NOT NULL, -- What the fan wants the creator to say
  is_public BOOLEAN DEFAULT false, -- Can be shown on creator's profile
  
  -- Timing
  deadline TIMESTAMPTZ,
  requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Status
  status video_request_status DEFAULT 'pending' NOT NULL,
  rejection_reason TEXT,
  
  -- Pricing
  price_usd DECIMAL(10,2) NOT NULL,
  price_htg DECIMAL(10,2), -- Haitian Gourde price if applicable
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_deadline CHECK (deadline IS NULL OR deadline > requested_at)
);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES public.video_requests(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  
  -- Storage paths
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  thumbnail_path TEXT,
  preview_path TEXT, -- Short preview clip for public display
  
  -- Video metadata
  duration_seconds INTEGER NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'video/mp4',
  width INTEGER,
  height INTEGER,
  
  -- Processing status
  is_processed BOOLEAN DEFAULT false,
  processing_error TEXT,
  
  -- Visibility
  is_active BOOLEAN DEFAULT true,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Timestamps
  recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_id UUID REFERENCES public.video_requests(id) ON DELETE SET NULL,
  fan_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_provider payment_provider NOT NULL,
  provider_transaction_id TEXT UNIQUE,
  
  -- Status
  status TEXT NOT NULL, -- pending, completed, failed, refunded
  failure_reason TEXT,
  
  -- Provider-specific data
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  moncash_transaction_id TEXT,
  moncash_reference TEXT,
  
  -- User location info for analytics
  user_country TEXT,
  user_region TEXT,
  detected_location JSONB, -- Store full geolocation data
  
  -- Fees and payouts
  platform_fee DECIMAL(10,2),
  creator_payout DECIMAL(10,2),
  
  -- Timestamps
  initiated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create video access control table
CREATE TABLE IF NOT EXISTS public.video_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  
  -- Access details
  granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ, -- Optional expiration for time-limited access
  download_allowed BOOLEAN DEFAULT true,
  
  -- Usage tracking
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  downloaded_at TIMESTAMPTZ,
  
  UNIQUE(video_id, user_id)
);

-- Create creator settings table for video preferences
CREATE TABLE IF NOT EXISTS public.creator_video_settings (
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Availability
  is_accepting_requests BOOLEAN DEFAULT true,
  
  -- Pricing
  base_price_usd DECIMAL(10,2) DEFAULT 25.00,
  base_price_htg DECIMAL(10,2) DEFAULT 3750.00, -- ~150 HTG per USD
  
  -- Turnaround time
  standard_delivery_days INTEGER DEFAULT 7,
  express_delivery_days INTEGER DEFAULT 2,
  express_multiplier DECIMAL(3,2) DEFAULT 1.5, -- 1.5x price for express
  
  -- Request preferences
  max_video_length_seconds INTEGER DEFAULT 180, -- 3 minutes default
  auto_accept_requests BOOLEAN DEFAULT false,
  
  -- Recording settings
  default_video_quality TEXT DEFAULT '1080p',
  add_watermark BOOLEAN DEFAULT true,
  
  -- Payout preferences
  payout_method TEXT, -- 'stripe', 'moncash', 'bank_transfer'
  payout_details JSONB, -- Encrypted payout account details
  
  -- Statistics
  total_videos_created INTEGER DEFAULT 0,
  total_earnings_usd DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(2,1),
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_video_requests_fan_id ON public.video_requests(fan_id);
CREATE INDEX idx_video_requests_creator_id ON public.video_requests(creator_id);
CREATE INDEX idx_video_requests_status ON public.video_requests(status);
CREATE INDEX idx_video_requests_deadline ON public.video_requests(deadline);

CREATE INDEX idx_videos_request_id ON public.videos(request_id);
CREATE INDEX idx_videos_creator_id ON public.videos(creator_id);
CREATE INDEX idx_videos_is_active ON public.videos(is_active);

CREATE INDEX idx_transactions_fan_id ON public.transactions(fan_id);
CREATE INDEX idx_transactions_creator_id ON public.transactions(creator_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_provider ON public.transactions(payment_provider);

CREATE INDEX idx_video_access_video_id ON public.video_access(video_id);
CREATE INDEX idx_video_access_user_id ON public.video_access(user_id);

-- Enable RLS on all tables
ALTER TABLE public.video_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_video_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_requests
CREATE POLICY "Fans can view their own requests" ON public.video_requests
  FOR SELECT USING (auth.uid() = fan_id);

CREATE POLICY "Creators can view requests for them" ON public.video_requests
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Fans can create requests" ON public.video_requests
  FOR INSERT WITH CHECK (auth.uid() = fan_id);

CREATE POLICY "Creators can update their requests" ON public.video_requests
  FOR UPDATE USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- RLS Policies for videos
CREATE POLICY "Users can view videos they have access to" ON public.videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.video_access
      WHERE video_access.video_id = videos.id
      AND video_access.user_id = auth.uid()
    ) OR 
    auth.uid() = creator_id
  );

CREATE POLICY "Creators can insert their own videos" ON public.videos
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own videos" ON public.videos
  FOR UPDATE USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = fan_id OR auth.uid() = creator_id);

CREATE POLICY "System can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = fan_id);

-- RLS Policies for video_access
CREATE POLICY "Users can view their own access records" ON public.video_access
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for creator_video_settings
CREATE POLICY "Anyone can view creator settings" ON public.creator_video_settings
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage their own settings" ON public.creator_video_settings
  FOR ALL USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Create updated_at trigger for all tables
CREATE TRIGGER update_video_requests_updated_at BEFORE UPDATE ON public.video_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_video_settings_updated_at BEFORE UPDATE ON public.creator_video_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create creator settings when a creator profile is created
CREATE OR REPLACE FUNCTION public.handle_new_creator_settings()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'creator' THEN
    INSERT INTO public.creator_video_settings (creator_id)
    VALUES (NEW.id)
    ON CONFLICT (creator_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create settings for new creators
CREATE TRIGGER on_creator_profile_created
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW 
  WHEN (NEW.role = 'creator')
  EXECUTE FUNCTION public.handle_new_creator_settings();

-- Function to update video request status when video is uploaded
CREATE OR REPLACE FUNCTION public.handle_video_upload()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.video_requests
  SET status = 'completed',
      completed_at = NOW()
  WHERE id = NEW.request_id
  AND status != 'completed';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update request status on video upload
CREATE TRIGGER on_video_uploaded
  AFTER INSERT ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_video_upload();

-- Function to grant video access after successful payment
CREATE OR REPLACE FUNCTION public.grant_video_access(
  p_video_id UUID,
  p_user_id UUID,
  p_transaction_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO public.video_access (video_id, user_id, transaction_id)
  VALUES (p_video_id, p_user_id, p_transaction_id)
  ON CONFLICT (video_id, user_id) DO UPDATE
  SET transaction_id = EXCLUDED.transaction_id,
      granted_at = NOW();
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;