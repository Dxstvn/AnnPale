const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Load profile data
const profileData = JSON.parse(fs.readFileSync('./terminal4-profile-data.json', 'utf8'))

async function createProfile(creatorKey, data) {
  console.log(`\nCreating profile for ${data.display_name}...`)
  
  try {
    // 1. Check if auth user already exists and get ID
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    let userId = null
    
    if (existingUsers && existingUsers.users) {
      const existingUser = existingUsers.users.find(u => u.email === data.email)
      if (existingUser) {
        console.log(`✓ Auth user already exists for ${data.display_name}`)
        userId = existingUser.id
      }
    }

    if (!userId) {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          name: data.display_name,
          role: 'creator'
        }
      })

      if (authError) {
        console.error(`Auth creation error for ${data.display_name}:`, authError.message)
        return false
      }

      console.log(`✓ Auth user created for ${data.display_name}`)
      userId = authData.user.id
    }

    // 2. Check if profile exists, insert or update
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    const profileData = {
      email: data.email,
      name: data.full_name,
      display_name: data.display_name,
      role: data.role,
      bio: data.bio,
      phone: data.phone,
      location: data.location,
      language_preference: 'ht',
      email_verified: true,
      user_role: data.role,
      is_creator: data.is_creator,
      is_demo_account: data.is_demo_account,
      demo_tier: data.demo_tier,
      public_figure_verified: data.public_figure_verified,
      wikipedia_url: data.wikipedia_url,
      official_website: data.official_website,
      press_kit_url: data.press_kit_url
    }

    if (existingProfile) {
      // Update existing profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)

      if (profileError) {
        console.error(`Profile update error for ${data.display_name}:`, profileError.message)
        return false
      }

      console.log(`✓ Profile updated for ${data.display_name}`)
    } else {
      // Insert new profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: userId, ...profileData })

      if (profileError) {
        console.error(`Profile creation error for ${data.display_name}:`, profileError.message)
        return false
      }

      console.log(`✓ Profile created for ${data.display_name}`)
    }

    // 3. Create creator stats
    const { error: statsError } = await supabase
      .from('demo_creator_stats')
      .insert({
        profile_id: userId,
        total_earnings: data.stats.total_earnings,
        videos_this_month: data.stats.videos_this_month,
        average_turnaround_hours: data.stats.average_turnaround_hours,
        satisfaction_score: data.stats.satisfaction_score,
        featured_category: data.stats.featured_category,
        trending_rank: data.stats.trending_rank
      })

    if (statsError) {
      console.error(`Stats creation error for ${data.display_name}:`, statsError.message)
      return false
    }

    console.log(`✓ Stats created for ${data.display_name}`)

    // 4. Create sample videos
    for (const video of data.sample_videos) {
      const { error: videoError } = await supabase
        .from('demo_sample_videos')
        .insert({
          creator_id: userId,
          title: video.title,
          description: video.description,
          duration_seconds: video.duration_seconds,
          category: video.category,
          language: video.language,
          view_count: Math.floor(Math.random() * 1000) + 100 // Random view count
        })

      if (videoError) {
        console.error(`Sample video creation error for ${data.display_name}:`, videoError.message)
        return false
      }
    }

    console.log(`✓ Sample videos created for ${data.display_name}`)

    // 5. Create reviews
    for (const review of data.reviews) {
      const { error: reviewError } = await supabase
        .from('demo_reviews')
        .insert({
          creator_id: userId,
          reviewer_name: review.reviewer_name,
          rating: review.rating,
          review_text: review.review_text,
          video_type: review.video_type,
          language: review.language
        })

      if (reviewError) {
        console.error(`Review creation error for ${data.display_name}:`, reviewError.message)
        return false
      }
    }

    console.log(`✓ Reviews created for ${data.display_name}`)

    // 6. Create creator settings (basic)
    const { error: settingsError } = await supabase
      .from('creator_settings')
      .insert({
        creator_id: userId,
        response_time: data.response_time,
        pricing_video_message: data.price_video_message,
        pricing_live_call: data.price_live_call,
        languages: data.languages,
        account_status: data.account_status,
        completion_rate: data.completion_rate
      })

    if (settingsError) {
      console.error(`Settings creation error for ${data.display_name}:`, settingsError.message)
      // Don't return false for settings error as it might not be critical
    } else {
      console.log(`✓ Settings created for ${data.display_name}`)
    }

    console.log(`🎉 Successfully created complete profile for ${data.display_name}!`)
    return true

  } catch (error) {
    console.error(`Unexpected error for ${data.display_name}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting Terminal 4 profile creation...')
  console.log('Creating profiles for: Kenny, T-Vice, Carimi, Djakout, Harmonik, BelO\n')

  const results = []

  for (const [key, data] of Object.entries(profileData)) {
    const success = await createProfile(key, data)
    results.push({ creator: data.display_name, success })
    
    // Wait a bit between creations to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log('\n' + '='.repeat(50))
  console.log('TERMINAL 4 PROFILE CREATION SUMMARY')
  console.log('='.repeat(50))

  results.forEach(result => {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED'
    console.log(`${result.creator}: ${status}`)
  })

  const successCount = results.filter(r => r.success).length
  console.log(`\nTotal: ${successCount}/${results.length} profiles created successfully`)

  if (successCount === results.length) {
    console.log('🎉 All Terminal 4 profiles created successfully!')
  } else {
    console.log('⚠️  Some profiles failed to create. Check the logs above.')
  }
}

// Run the script
main().catch(console.error)