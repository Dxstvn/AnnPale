-- Add preview video management to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS preview_video_url TEXT,
ADD COLUMN IF NOT EXISTS preview_video_thumbnail TEXT;

-- Track which completed videos are used as preview samples
CREATE TABLE IF NOT EXISTS creator_preview_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  video_request_id UUID REFERENCES video_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  occasion TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_preview_videos_creator ON creator_preview_videos(creator_id, is_active);
CREATE INDEX IF NOT EXISTS idx_preview_videos_order ON creator_preview_videos(creator_id, display_order);

-- Enable RLS
ALTER TABLE creator_preview_videos ENABLE ROW LEVEL SECURITY;

-- Policy for creators to manage their preview videos
CREATE POLICY "Creators manage preview videos" ON creator_preview_videos
  FOR ALL
  USING (auth.uid() = creator_id);

-- Policy for public to view active preview videos
CREATE POLICY "Public view active previews" ON creator_preview_videos
  FOR SELECT
  USING (is_active = true);

-- Add comment for documentation
COMMENT ON TABLE creator_preview_videos IS 'Stores preview videos that creators select from their completed video requests to showcase on their profile';
COMMENT ON COLUMN creator_preview_videos.display_order IS 'Order in which preview videos are displayed (lower numbers first)';
COMMENT ON COLUMN creator_preview_videos.is_active IS 'Whether this preview video is currently visible to the public';