/**
 * Basic Profile Seeding for Entertainment Icons
 * Creates just the essential profile data without demo-specific tables
 */

import { createClient } from '@supabase/supabase-js'
import { entertainmentCreators, authCredentials } from '../lib/demo-profiles-entertainment'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedBasicProfiles() {
  console.log('🎭 Seeding Basic Entertainment Profiles...')
  
  try {
    // Get the actual auth IDs that were already created
    console.log('\n🔍 Getting existing auth user IDs...')
    
    const userIds: Record<string, string> = {}
    
    for (const creds of authCredentials) {
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
      
      if (userError) {
        console.error('❌ Error fetching users:', userError.message)
        continue
      }
      
      const user = userData.users.find(u => u.email === creds.email)
      if (user) {
        userIds[creds.email] = user.id
        console.log(`   ✅ Found user: ${creds.display_name} (${user.id})`)
      } else {
        console.log(`   ⚠️ User not found for: ${creds.email}`)
      }
    }
    
    // Update creator IDs with actual UUIDs
    for (const creator of entertainmentCreators) {
      if (userIds[creator.email]) {
        creator.id = userIds[creator.email]
      }
    }
    
    // Insert basic profile data
    console.log('\n👤 Inserting basic profile data...')
    
    for (const creator of entertainmentCreators) {
      console.log(`   Inserting profile: ${creator.display_name}`)
      
      const basicProfileData = {
        id: creator.id,
        email: creator.email,
        name: creator.full_name,
        display_name: creator.display_name,
        username: creator.username,
        role: 'creator',
        bio: creator.bio,
        category: creator.category,
        verified: creator.verified,
        languages: creator.languages,
        response_time: creator.response_time,
        price_video_message: creator.price_video_message,
        rating: creator.rating,
        total_reviews: creator.total_reviews,
        total_videos: creator.total_videos,
        completion_rate: creator.completion_rate,
        profile_image: creator.profile_image,
        cover_image: creator.cover_image,
        created_at: creator.created_at.toISOString(),
        updated_at: creator.updated_at.toISOString()
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(basicProfileData, { onConflict: 'id' })
      
      if (profileError) {
        console.error(`   ❌ Profile error for ${creator.display_name}:`, profileError.message)
        continue
      }
      
      console.log(`   ✅ Profile created for ${creator.display_name}`)
    }
    
    console.log('\n🎉 Basic Entertainment Profiles Seeded!')
    console.log('\n📋 Summary:')
    console.log(`   • ${entertainmentCreators.length} creator profiles`)
    console.log(`   • ${authCredentials.length} auth accounts (already created)`)
    
    console.log('\n🔐 Demo Login Credentials:')
    for (const creds of authCredentials) {
      console.log(`   ${creds.display_name}: ${creds.email} / ${creds.password}`)
    }
    
    console.log('\n✨ Profiles should now be visible in the Ann Pale platform!')
    
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding process
if (require.main === module) {
  seedBasicProfiles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

export { seedBasicProfiles }