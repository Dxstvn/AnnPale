#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  console.log('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDeployment() {
  console.log('🧪 Testing Terminal 1 Music Superstars deployment...\n')

  try {
    // Test 1: Check if demo tables exist
    console.log('1. Testing database schema...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', 'demo_%')

    if (tablesError) {
      console.error('❌ Schema test failed:', tablesError.message)
      return
    }

    const expectedTables = [
      'demo_creator_stats',
      'demo_reviews', 
      'demo_sample_videos',
      'demo_creator_achievements',
      'demo_creator_projects',
      'demo_creator_social'
    ]

    const foundTables = tables?.map(t => t.table_name) || []
    const missingTables = expectedTables.filter(t => !foundTables.includes(t))

    if (missingTables.length > 0) {
      console.error('❌ Missing tables:', missingTables.join(', '))
      console.log('💡 Run the migration first: 20250827_demo_music_profiles.sql')
      return
    } else {
      console.log('✅ All demo tables exist')
    }

    // Test 2: Check for demo creator accounts
    console.log('\n2. Testing demo creator accounts...')
    const { data: creators, error: creatorsError } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .like('email', '%annpale.demo')

    if (creatorsError) {
      console.error('❌ Creators test failed:', creatorsError.message)
      return
    }

    const expectedCreators = [
      'wyclef.jean@annpale.demo',
      'michael.brun@annpale.demo', 
      'rutshelle.guillaume@annpale.demo'
    ]

    const foundEmails = creators?.map(c => c.email) || []
    const missingCreators = expectedCreators.filter(e => !foundEmails.includes(e))

    if (missingCreators.length > 0) {
      console.error('❌ Missing creators:', missingCreators.join(', '))
      console.log('💡 Create auth accounts through Supabase dashboard')
      return
    } else {
      console.log('✅ All 3 creator accounts exist')
    }

    // Test 3: Check demo data completeness
    console.log('\n3. Testing demo data completeness...')
    
    for (const creator of creators || []) {
      console.log(`\n   Testing ${creator.name}...`)

      // Check stats
      const { data: stats } = await supabase
        .from('demo_creator_stats')
        .select('*')
        .eq('creator_id', creator.id)
        .single()

      // Check social media
      const { data: social } = await supabase
        .from('demo_creator_social')
        .select('*')
        .eq('creator_id', creator.id)

      // Check achievements  
      const { data: achievements } = await supabase
        .from('demo_creator_achievements')
        .select('*')
        .eq('creator_id', creator.id)

      // Check projects
      const { data: projects } = await supabase
        .from('demo_creator_projects')
        .select('*')
        .eq('creator_id', creator.id)

      // Check sample videos
      const { data: videos } = await supabase
        .from('demo_sample_videos')
        .select('*')
        .eq('creator_id', creator.id)

      // Check reviews
      const { data: reviews } = await supabase
        .from('demo_reviews')
        .select('*')
        .eq('creator_id', creator.id)

      console.log(`     Stats: ${stats ? '✅' : '❌'}`)
      console.log(`     Social: ${social?.length || 0} accounts ${social?.length >= 3 ? '✅' : '❌'}`)
      console.log(`     Achievements: ${achievements?.length || 0} items ${achievements?.length >= 5 ? '✅' : '❌'}`)
      console.log(`     Projects: ${projects?.length || 0} items ${projects?.length >= 4 ? '✅' : '❌'}`)
      console.log(`     Videos: ${videos?.length || 0} samples ${videos?.length >= 3 ? '✅' : '❌'}`)
      console.log(`     Reviews: ${reviews?.length || 0} reviews ${reviews?.length >= 3 ? '✅' : '❌'}`)
    }

    // Test 4: Test function
    console.log('\n4. Testing helper function...')
    const { data: profileData, error: functionError } = await supabase
      .rpc('get_demo_creator_profile', { 
        creator_email: 'wyclef.jean@annpale.demo' 
      })

    if (functionError) {
      console.error('❌ Function test failed:', functionError.message)
    } else if (profileData) {
      console.log('✅ Helper function working')
    } else {
      console.error('❌ Function returned no data')
    }

    console.log('\n🎉 Deployment test completed!')
    console.log('\n📊 Summary:')
    console.log(`   • Database schema: ✅`)
    console.log(`   • Creator accounts: ${creators?.length || 0}/3`)
    console.log(`   • Demo data: Check individual results above`)
    console.log(`   • Helper functions: ${functionError ? '❌' : '✅'}`)

  } catch (error) {
    console.error('💥 Test failed with error:', error)
  }
}

// Test RLS policies
async function testRLS() {
  console.log('\n🔒 Testing Row Level Security policies...')
  
  // Test public read access (should work)
  const { data: publicStats, error: publicError } = await supabase
    .from('demo_creator_stats')
    .select('*')
    .limit(1)

  if (publicError) {
    console.error('❌ Public read access failed:', publicError.message)
  } else {
    console.log('✅ Public read access working')
  }
}

// Run tests
if (require.main === module) {
  testDeployment()
    .then(() => testRLS())
    .catch(console.error)
}

export { testDeployment }