const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupStorageBuckets() {
  console.log('🚀 Setting up storage buckets...')
  
  const buckets = [
    { 
      id: 'creator-images', 
      name: 'creator-images',
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    },
    { 
      id: 'creator-videos', 
      name: 'creator-videos',
      public: false,
      fileSizeLimit: 524288000, // 500MB
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']
    }
  ]

  for (const bucket of buckets) {
    try {
      // Check if bucket already exists
      const { data: existingBucket } = await supabase.storage.getBucket(bucket.id)
      
      if (existingBucket) {
        console.log(`✅ Bucket '${bucket.id}' already exists`)
        
        // Update bucket settings if needed
        const { error: updateError } = await supabase.storage.updateBucket(bucket.id, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes
        })
        
        if (updateError) {
          console.error(`❌ Failed to update bucket '${bucket.id}':`, updateError)
        } else {
          console.log(`✅ Updated settings for bucket '${bucket.id}'`)
        }
      } else {
        // Create the bucket
        const { data, error } = await supabase.storage.createBucket(bucket.id, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes
        })
        
        if (error) {
          console.error(`❌ Failed to create bucket '${bucket.id}':`, error)
        } else {
          console.log(`✅ Created bucket '${bucket.id}'`)
        }
      }
    } catch (error) {
      console.error(`❌ Error processing bucket '${bucket.id}':`, error)
    }
  }

  console.log('✨ Storage bucket setup complete!')
}

setupStorageBuckets().catch(console.error)