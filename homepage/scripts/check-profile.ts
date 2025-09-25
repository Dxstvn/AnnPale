import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkProfile() {
  const userId = '530c7ea1-4946-4f34-b636-7530c2e376fb'

  // Check profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
  } else {
    console.log('Profile data:', profile)
  }

  // Check if there are any completed video requests
  const { data: videoRequests, error: videoError } = await supabase
    .from('video_requests')
    .select('*')
    .eq('creator_id', userId)
    .eq('status', 'completed')

  if (videoError) {
    console.error('Error fetching video requests:', videoError)
  } else {
    console.log(`\nCompleted video requests for creator: ${videoRequests?.length || 0}`)
    if (videoRequests && videoRequests.length > 0) {
      console.log('Sample video request:', videoRequests[0])
    }
  }

  // Check preview videos
  const { data: previewVideos, error: previewError } = await supabase
    .from('creator_preview_videos')
    .select('*')
    .eq('creator_id', userId)

  if (previewError) {
    console.error('Error fetching preview videos:', previewError)
  } else {
    console.log(`\nPreview videos for creator: ${previewVideos?.length || 0}`)
    if (previewVideos && previewVideos.length > 0) {
      console.log('Preview videos:', previewVideos)
    }
  }
}

checkProfile().catch(console.error)