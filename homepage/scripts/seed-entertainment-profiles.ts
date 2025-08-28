/**
 * Database Seeding Script for Entertainment Icons
 * Seeds Supabase with Ti Jo Zenny, Richard Cavé, and Carel Pedre profiles
 * 
 * Usage: npx tsx scripts/seed-entertainment-profiles.ts
 */

import { createClient } from '@supabase/supabase-js'
import { entertainmentCreators, authCredentials, sampleReviews } from '../lib/demo-profiles-entertainment'
import { allSampleVideos, creatorStats, allSampleReviews } from '../lib/demo-content-generator'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials. Check your .env.local file.')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedEntertainmentProfiles() {
  console.log('🎭 Starting Entertainment Icons Profile Seeding...')
  
  try {
    // 1. Create authentication accounts
    console.log('\n📧 Creating authentication accounts...')
    
    for (const creds of authCredentials) {
      console.log(`   Creating auth for: ${creds.display_name}`)
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: creds.email,
        password: creds.password,
        email_confirm: true,
        user_metadata: {
          name: creds.display_name,
          role: 'creator'
        }
      })
      
      if (authError) {
        console.error(`   ❌ Auth error for ${creds.email}:`, authError.message)
        continue
      }
      
      console.log(`   ✅ Auth created for ${creds.display_name} (${authData.user.id})`)
      
      // Update the profile with the actual UUID
      const creator = entertainmentCreators.find(c => c.email === creds.email)
      if (creator) {
        creator.id = authData.user.id
      }
    }
    
    // 2. Insert profile data
    console.log('\n👤 Inserting profile data...')
    
    for (const creator of entertainmentCreators) {
      console.log(`   Inserting profile: ${creator.display_name}`)
      
      const profileData = {
        id: creator.id,
        email: creator.email,
        name: creator.full_name,
        display_name: creator.display_name,
        username: creator.username,
        role: 'creator',
        bio: creator.bio,
        category: creator.category,
        subcategory: creator.subcategory,
        verified: creator.verified,
        languages: creator.languages,
        response_time: creator.response_time,
        price_video_message: creator.price_video_message,
        price_live_call: creator.price_live_call,
        rating: creator.rating,
        total_reviews: creator.total_reviews,
        total_videos: creator.total_videos,
        completion_rate: creator.completion_rate,
        profile_image: creator.profile_image,
        cover_image: creator.cover_image,
        follower_count: creator.follower_count,
        monthly_bookings: creator.monthly_bookings,
        repeat_customer_rate: creator.repeat_customer_rate,
        hometown: creator.hometown,
        years_active: creator.years_active,
        account_status: creator.account_status,
        is_demo_account: creator.is_demo_account,
        demo_tier: creator.demo_tier,
        public_figure_verified: creator.public_figure_verified,
        created_at: creator.created_at.toISOString(),
        updated_at: creator.updated_at.toISOString(),
        last_active: creator.last_active.toISOString()
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData)
      
      if (profileError) {
        console.error(`   ❌ Profile error for ${creator.display_name}:`, profileError.message)
        continue
      }
      
      console.log(`   ✅ Profile created for ${creator.display_name}`)
    }
    
    // 3. Insert creator statistics
    console.log('\n📊 Inserting creator statistics...')
    
    for (const stats of creatorStats) {
      const creator = entertainmentCreators.find(c => c.id === stats.profile_id)
      const creatorName = creator?.display_name || stats.profile_id
      
      console.log(`   Inserting stats for: ${creatorName}`)
      
      const { error: statsError } = await supabase
        .from('demo_creator_stats')
        .upsert({
          ...stats,
          created_at: new Date().toISOString()
        })
      
      if (statsError) {
        console.error(`   ❌ Stats error for ${creatorName}:`, statsError.message)
        continue
      }
      
      console.log(`   ✅ Stats created for ${creatorName}`)
    }
    
    // 4. Insert sample videos
    console.log('\n🎬 Inserting sample videos...')
    
    for (const video of allSampleVideos) {
      const creator = entertainmentCreators.find(c => c.id === video.creator_id)
      const creatorName = creator?.display_name || video.creator_id
      
      console.log(`   Inserting video: ${video.title} (${creatorName})`)
      
      const { error: videoError } = await supabase
        .from('demo_sample_videos')
        .upsert({
          ...video,
          created_at: video.created_at.toISOString()
        })
      
      if (videoError) {
        console.error(`   ❌ Video error for ${video.title}:`, videoError.message)
        continue
      }
      
      console.log(`   ✅ Video created: ${video.title}`)
    }
    
    // 5. Insert reviews
    console.log('\n⭐ Inserting reviews...')
    
    // Insert primary reviews
    for (const [creatorId, reviews] of Object.entries(sampleReviews)) {
      const creator = entertainmentCreators.find(c => c.id === creatorId)
      const creatorName = creator?.display_name || creatorId
      
      for (const review of reviews) {
        console.log(`   Inserting review for: ${creatorName} by ${review.reviewer_name}`)
        
        const reviewData = {
          creator_id: creatorId,
          reviewer_name: review.reviewer_name,
          rating: review.rating,
          review_text: review.review_text,
          video_type: review.video_type,
          language: review.language,
          created_at: new Date().toISOString()
        }
        
        const { error: reviewError } = await supabase
          .from('demo_reviews')
          .insert(reviewData)
        
        if (reviewError) {
          console.error(`   ❌ Review error for ${creatorName}:`, reviewError.message)
          continue
        }
        
        console.log(`   ✅ Review created for ${creatorName}`)
      }
    }
    
    // Insert additional reviews
    for (const [creatorId, reviews] of Object.entries(allSampleReviews)) {
      const creator = entertainmentCreators.find(c => c.id === creatorId)
      const creatorName = creator?.display_name || creatorId
      
      for (const review of reviews) {
        console.log(`   Inserting additional review for: ${creatorName} by ${review.reviewer_name}`)
        
        const { error: reviewError } = await supabase
          .from('demo_reviews')
          .upsert({
            ...review,
            created_at: review.created_at.toISOString()
          })
        
        if (reviewError) {
          console.error(`   ❌ Additional review error for ${creatorName}:`, reviewError.message)
          continue
        }
        
        console.log(`   ✅ Additional review created for ${creatorName}`)
      }
    }
    
    console.log('\n🎉 Entertainment Icons Profile Seeding Complete!')
    console.log('\n📋 Summary:')
    console.log(`   • ${entertainmentCreators.length} creator profiles`)
    console.log(`   • ${authCredentials.length} auth accounts`)
    console.log(`   • ${creatorStats.length} stat records`)
    console.log(`   • ${allSampleVideos.length} sample videos`)
    console.log(`   • Multiple reviews per creator`)
    
    console.log('\n🔐 Demo Login Credentials:')
    for (const creds of authCredentials) {
      console.log(`   ${creds.display_name}: ${creds.email} / ${creds.password}`)
    }
    
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding process
if (require.main === module) {
  seedEntertainmentProfiles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

export { seedEntertainmentProfiles }