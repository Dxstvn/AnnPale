-- Add viewed_at column to video_requests table
-- This column tracks when a creator views a video request for the first time
-- Used for unread request counting in the notification polling hook

ALTER TABLE public.video_requests
ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ;

-- Add index for better query performance when filtering unviewed requests
CREATE INDEX IF NOT EXISTS idx_video_requests_viewed_at
ON public.video_requests(creator_id, viewed_at)
WHERE viewed_at IS NULL;

-- Add comment to document the column's purpose
COMMENT ON COLUMN public.video_requests.viewed_at IS 'Timestamp when the creator first viewed this video request';