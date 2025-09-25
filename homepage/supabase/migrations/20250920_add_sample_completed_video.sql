-- Add a sample completed video request for testing preview videos functionality
-- This creates a completed video request for Dustin Jasmin (creator)

INSERT INTO public.video_requests (
  id,
  creator_id,
  fan_id,
  request_type,
  recipient_name,
  instructions,
  price,
  status,
  video_url,
  thumbnail_url,
  duration,
  completed_at,
  rating,
  review,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '530c7ea1-4946-4f34-b636-7530c2e376fb', -- Dustin Jasmin (creator)
  'c948265a-fb81-4c40-be8d-8dd536433738', -- Test fan user
  'birthday',
  'Marie',
  'Please wish my wife Marie a happy 30th birthday. She loves your music!',
  50.00,
  'completed',
  'https://example.com/videos/sample-birthday-video.mp4',
  'https://example.com/thumbnails/sample-birthday-thumb.jpg',
  52, -- 52 seconds duration
  NOW() - INTERVAL '2 days',
  5.0,
  'Amazing! Marie loved it so much. Thank you for making her day special!',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;