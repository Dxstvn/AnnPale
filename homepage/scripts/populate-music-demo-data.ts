#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Remote Supabase configuration
const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseKey = 'REDACTED'

const supabase = createClient(supabaseUrl, supabaseKey)

// Map emails to known user IDs
const userMapping = {
  'wyclef.jean@annpale.demo': 'd963aa48-879d-461c-9df3-7dc557b545f9',
  'michael.brun@annpale.demo': '819421cf-9437-4d10-bb09-bca4e0c12cba',
  'rutshelle.guillaume@annpale.demo': 'cbce25c9-04e0-45c7-b872-473fed4eeb1d'
}

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

async function populateDemoData() {
  console.log('🎵 Populating demo data for existing musicians...\n')

  for (const profileData of profiles) {
    const { profile, demoData } = profileData
    const userId = userMapping[profile.email]

    if (!userId) {
      console.error(`❌ User ID not found for ${profile.displayName}`)
      continue
    }

    console.log(`📝 Processing ${profile.displayName}...`)

    try {
      // Create creator settings
      console.log('  Creating creator settings...')
      await supabase
        .from('creator_settings')
        .upsert({
          creator_id: userId,
          base_price: profile.pricing.videoMessage,
          currency: profile.pricing.currency,
          turnaround_days: parseInt(profile.responseTime.split(' ')[0]) || 2,
          is_accepting_orders: profile.availability.acceptingRequests,
          categories: [profile.category, profile.subcategory],
          languages: profile.languages
        })
      console.log('  ✅ Creator settings done')

      // Create demo stats
      console.log('  Creating demo stats...')
      await supabase
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
      console.log('  ✅ Demo stats created')

      // Create social media entries
      console.log('  Creating social media entries...')
      let socialOrder = 0
      for (const [platform, data] of Object.entries(profile.socialMedia)) {
        if (typeof data === 'object' && data.handle) {
          await supabase
            .from('demo_creator_social')
            .insert({
              creator_id: userId,
              platform,
              handle: data.handle,
              follower_count: data.followers || data.monthlyListeners,
              url: data.url,
              is_verified: true,
              display_order: socialOrder++
            })
        }
      }
      console.log(`  ✅ Social media entries created`)

      // Create achievements
      console.log('  Creating achievements...')
      for (let i = 0; i < profile.achievements.length; i++) {
        await supabase
          .from('demo_creator_achievements')
          .insert({
            creator_id: userId,
            achievement_text: profile.achievements[i],
            achievement_type: 'award',
            is_major: i < 3,
            display_order: i
          })
      }
      console.log(`  ✅ Achievements created (${profile.achievements.length})`)

      // Create current projects
      console.log('  Creating current projects...')
      for (let i = 0; i < profile.currentProjects.length; i++) {
        await supabase
          .from('demo_creator_projects')
          .insert({
            creator_id: userId,
            project_title: profile.currentProjects[i].substring(0, 100),
            project_description: profile.currentProjects[i],
            project_status: 'active',
            year: 2024,
            is_featured: i < 2,
            display_order: i
          })
      }
      console.log(`  ✅ Current projects created (${profile.currentProjects.length})`)

      // Create sample videos
      console.log('  Creating sample videos...')
      for (const video of demoData.sampleVideos) {
        await supabase
          .from('demo_sample_videos')
          .insert({
            creator_id: userId,
            title: video.title,
            description: video.description,
            duration_seconds: video.duration,
            category: video.category,
            thumbnail_url: video.thumbnail,
            price: video.price,
            is_featured: true
          })
      }
      console.log(`  ✅ Sample videos created (${demoData.sampleVideos.length})`)

      // Create reviews
      console.log('  Creating reviews...')
      for (const review of demoData.reviews) {
        await supabase
          .from('demo_reviews')
          .insert({
            creator_id: userId,
            reviewer_name: review.userName,
            reviewer_avatar: review.userAvatar,
            rating: review.rating,
            review_text: review.text,
            category: review.category,
            review_date: review.date,
            helpful_count: review.helpful
          })
      }
      console.log(`  ✅ Reviews created (${demoData.reviews.length})`)

      console.log(`\n✅ Successfully populated data for ${profile.displayName}!`)

    } catch (error) {
      console.error(`\n❌ Error populating data for ${profile.displayName}:`, error)
    }
  }

  console.log('\n🎉 Demo data population completed!')
}

// Run the population
populateDemoData().catch(console.error)