#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read profile JSON files
const wyclefProfile = JSON.parse(
  readFileSync(join(__dirname, '../profiles/wyclef-jean-profile.json'), 'utf-8')
)

const michaelProfile = JSON.parse(
  readFileSync(join(__dirname, '../profiles/michael-brun-profile.json'), 'utf-8')
)

const rutshelleProfile = JSON.parse(
  readFileSync(join(__dirname, '../profiles/rutshelle-guillaume-profile.json'), 'utf-8')
)

const profiles = [wyclefProfile, michaelProfile, rutshelleProfile]

interface ProfileData {
  profile: {
    id: string
    email: string
    firstName: string
    lastName: string
    displayName: string
    category: string
    subcategory: string
    bio: string
    pricing: {
      videoMessage: number
      videoCall: number
      currency: string
    }
    languages: string[]
    socialMedia: Record<string, any>
    images: {
      profile: string
      cover: string
    }
    achievements: string[]
    currentProjects: string[]
    availability: {
      timezone: string
      responseHours: string
      acceptingRequests: boolean
    }
    verified: boolean
    featured: boolean
    active: boolean
    rating: number
    responseTime: string
  }
  demoData: {
    sampleVideos: Array<{
      id: string
      title: string
      description: string
      duration: number
      category: string
      thumbnail: string
      price: number
    }>
    reviews: Array<{
      id: string
      userName: string
      userAvatar: string
      rating: number
      date: string
      category: string
      text: string
      helpful: number
    }>
    stats: {
      totalOrders: number
      completionRate: number
      avgDeliveryTime: string
      repeatCustomers: number
    }
  }
}

async function seedMusicProfiles() {
  console.log('🎵 Starting music profiles seeding...')

  for (const profileData of profiles as ProfileData[]) {
    const { profile, demoData } = profileData

    try {
      console.log(`\n📝 Processing ${profile.displayName}...`)

      // Create auth account
      console.log('  Creating auth account...')
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: profile.email,
        password: 'TempPassword123!',
        email_confirm: true,
        user_metadata: {
          name: profile.displayName,
          role: 'creator'
        }
      })

      if (authError) {
        console.error(`  ❌ Auth creation failed for ${profile.displayName}:`, authError.message)
        continue
      }

      const userId = authData.user.id
      console.log(`  ✅ Auth account created: ${userId}`)

      // Update profile with additional data
      console.log('  Updating profile...')
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profile.displayName,
          role: 'creator',
          bio: profile.bio.substring(0, 500), // Truncate if too long
          avatar_url: profile.images.profile,
          language_preference: profile.languages[0]?.toLowerCase() || 'en'
        })
        .eq('id', userId)

      if (profileError) {
        console.error(`  ❌ Profile update failed:`, profileError.message)
      } else {
        console.log(`  ✅ Profile updated`)
      }

      // Create creator settings
      console.log('  Creating creator settings...')
      const { error: settingsError } = await supabase
        .from('creator_settings')
        .upsert({
          creator_id: userId,
          base_price: profile.pricing.videoMessage,
          currency: profile.pricing.currency,
          turnaround_days: parseInt(profile.responseTime.split(' ')[0]) || 2,
          is_accepting_orders: profile.availability.acceptingRequests,
          auto_accept_orders: false,
          categories: [profile.category, profile.subcategory],
          languages: profile.languages
        })

      if (settingsError) {
        console.error(`  ❌ Creator settings failed:`, settingsError.message)
      } else {
        console.log(`  ✅ Creator settings created`)
      }

      // Create demo stats
      console.log('  Creating demo stats...')
      const { error: statsError } = await supabase
        .from('demo_creator_stats')
        .upsert({
          creator_id: userId,
          total_orders: demoData.stats.totalOrders,
          completion_rate: demoData.stats.completionRate,
          avg_delivery_time_days: parseFloat(demoData.stats.avgDeliveryTime.split(' ')[0]),
          repeat_customers: demoData.stats.repeatCustomers,
          rating_average: profile.rating,
          total_reviews: demoData.reviews.length,
          response_time_hours: parseInt(profile.responseTime.split(' ')[0]) || 4
        })

      if (statsError) {
        console.error(`  ❌ Demo stats failed:`, statsError.message)
      } else {
        console.log(`  ✅ Demo stats created`)
      }

      // Create social media entries
      console.log('  Creating social media entries...')
      let socialOrder = 0
      for (const [platform, data] of Object.entries(profile.socialMedia)) {
        if (typeof data === 'object' && data.handle) {
          const { error: socialError } = await supabase
            .from('demo_creator_social')
            .upsert({
              creator_id: userId,
              platform,
              handle: data.handle,
              follower_count: data.followers || data.monthlyListeners,
              url: data.url,
              is_verified: true,
              display_order: socialOrder++
            })

          if (socialError) {
            console.error(`  ❌ Social media ${platform} failed:`, socialError.message)
          }
        }
      }
      console.log(`  ✅ Social media entries created`)

      // Create achievements
      console.log('  Creating achievements...')
      for (let i = 0; i < profile.achievements.length; i++) {
        const achievement = profile.achievements[i]
        const { error: achievementError } = await supabase
          .from('demo_creator_achievements')
          .upsert({
            creator_id: userId,
            achievement_text: achievement,
            achievement_type: 'award',
            is_major: i < 3, // First 3 are major achievements
            display_order: i
          })

        if (achievementError) {
          console.error(`  ❌ Achievement ${i} failed:`, achievementError.message)
        }
      }
      console.log(`  ✅ Achievements created (${profile.achievements.length})`)

      // Create current projects
      console.log('  Creating current projects...')
      for (let i = 0; i < profile.currentProjects.length; i++) {
        const project = profile.currentProjects[i]
        const { error: projectError } = await supabase
          .from('demo_creator_projects')
          .upsert({
            creator_id: userId,
            project_title: project.substring(0, 100), // Truncate title if needed
            project_description: project,
            project_status: 'active',
            year: 2024,
            is_featured: i < 2, // First 2 are featured
            display_order: i
          })

        if (projectError) {
          console.error(`  ❌ Project ${i} failed:`, projectError.message)
        }
      }
      console.log(`  ✅ Current projects created (${profile.currentProjects.length})`)

      // Create sample videos
      console.log('  Creating sample videos...')
      for (const video of demoData.sampleVideos) {
        const { error: videoError } = await supabase
          .from('demo_sample_videos')
          .upsert({
            creator_id: userId,
            title: video.title,
            description: video.description,
            duration_seconds: video.duration,
            category: video.category,
            thumbnail_url: video.thumbnail,
            price: video.price,
            is_featured: true
          })

        if (videoError) {
          console.error(`  ❌ Sample video failed:`, videoError.message)
        }
      }
      console.log(`  ✅ Sample videos created (${demoData.sampleVideos.length})`)

      // Create reviews
      console.log('  Creating reviews...')
      for (const review of demoData.reviews) {
        const { error: reviewError } = await supabase
          .from('demo_reviews')
          .upsert({
            creator_id: userId,
            reviewer_name: review.userName,
            reviewer_avatar: review.userAvatar,
            rating: review.rating,
            review_text: review.text,
            category: review.category,
            review_date: review.date,
            helpful_count: review.helpful
          })

        if (reviewError) {
          console.error(`  ❌ Review failed:`, reviewError.message)
        }
      }
      console.log(`  ✅ Reviews created (${demoData.reviews.length})`)

      console.log(`\n✅ Successfully seeded ${profile.displayName}!`)

    } catch (error) {
      console.error(`\n❌ Failed to seed ${profile.displayName}:`, error)
      continue
    }
  }

  console.log('\n🎉 Music profiles seeding completed!')
  console.log('\n📋 Summary:')
  console.log(`  • ${profiles.length} music superstars processed`)
  console.log('  • Auth accounts created with temp passwords')
  console.log('  • Profile data populated')
  console.log('  • Demo statistics generated')
  console.log('  • Sample content created')
  console.log('\n🔐 Next steps:')
  console.log('  1. Test login with: [email]@annpale.demo / TempPassword123!')
  console.log('  2. Update passwords through admin panel')
  console.log('  3. Test platform integration')
}

// Run the seeding script
if (require.main === module) {
  seedMusicProfiles().catch(console.error)
}

export default seedMusicProfiles