const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixStoragePermissions() {
  console.log('🔧 Fixing storage bucket permissions...')
  
  try {
    // Update creator-images bucket to be public
    const { data, error } = await supabase.storage.updateBucket('creator-images', {
      public: true, // Make bucket public so images can be viewed
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    })
    
    if (error) {
      console.error('❌ Failed to update creator-images bucket:', error)
    } else {
      console.log('✅ Updated creator-images bucket to public access')
    }

    // Keep creator-videos private but we'll handle access differently
    const { data: videoData, error: videoError } = await supabase.storage.updateBucket('creator-videos', {
      public: false, // Keep videos private for now
      fileSizeLimit: 524288000, // 500MB
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']
    })
    
    if (videoError && videoError.statusCode !== '413') {
      console.error('❌ Failed to update creator-videos bucket:', videoError)
    } else {
      console.log('✅ Creator-videos bucket settings confirmed')
    }

  } catch (error) {
    console.error('❌ Error updating bucket permissions:', error)
  }

  console.log('✨ Storage permissions update complete!')
}

fixStoragePermissions().catch(console.error)