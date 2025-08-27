-- Create table for storing creator IVS channels
CREATE TABLE IF NOT EXISTS public.creator_channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  channel_arn TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  playback_url TEXT NOT NULL,
  ingest_endpoint TEXT NOT NULL,
  stream_key_arn TEXT NOT NULL,
  -- Security: Never store the actual stream key value
  is_live BOOLEAN DEFAULT false,
  current_stream_id UUID REFERENCES public.live_streams(id) ON DELETE SET NULL,
  total_streams INTEGER DEFAULT 0,
  total_viewer_hours NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_creator_channels_creator_id ON public.creator_channels(creator_id);
CREATE INDEX idx_creator_channels_is_live ON public.creator_channels(is_live);

-- Enable RLS
ALTER TABLE public.creator_channels ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Creators can view and manage their own channel
CREATE POLICY "Creators can view own channel" ON public.creator_channels
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update own channel" ON public.creator_channels
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert own channel" ON public.creator_channels
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own channel" ON public.creator_channels
  FOR DELETE USING (auth.uid() = creator_id);

-- Public can view channel info (for playback)
CREATE POLICY "Public can view channel info" ON public.creator_channels
  FOR SELECT USING (true);

-- Admins can manage all channels
CREATE POLICY "Admins can manage all channels" ON public.creator_channels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update the updated_at timestamp
CREATE TRIGGER update_creator_channels_updated_at
  BEFORE UPDATE ON public.creator_channels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();