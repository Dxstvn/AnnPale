#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTk4OTAsImV4cCI6MjA3MTM5NTg5MH0.zlQQHLmGBojPbw9GsSJqSpsWT9SlANPtEhZyEYKr4g0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testOAuthSetup() {
  console.log('🔍 Testing OAuth Authentication Setup\n')
  console.log('=' .repeat(50))
  
  // Test 1: Check current session
  console.log('\n📋 Test 1: Checking current session...')
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.log('   ❌ Session error:', sessionError.message)
  } else if (session) {
    console.log('   ✅ Active session found')
    console.log('   - User:', session.user.email)
    console.log('   - Provider:', session.user.app_metadata.provider)
    console.log('   - ID:', session.user.id)
  } else {
    console.log('   ℹ️  No active session (expected if not logged in)')
  }
  
  // Test 2: Generate OAuth URLs (without redirecting)
  console.log('\n🔗 Test 2: Generating OAuth URLs...')
  
  // Test Google OAuth
  console.log('   Testing Google OAuth URL generation...')
  const { data: googleData, error: googleError } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
      skipBrowserRedirect: true
    }
  })
  
  if (googleError) {
    console.log('   ❌ Google OAuth error:', googleError.message)
  } else if (googleData?.url) {
    console.log('   ✅ Google OAuth URL generated successfully')
    const url = new URL(googleData.url)
    console.log('   - Host:', url.hostname)
    console.log('   - Has state:', url.searchParams.has('state'))
    console.log('   - Has redirect_uri:', url.searchParams.has('redirect_uri'))
  }
  
  // Test Twitter/X OAuth
  console.log('\n   Testing X (Twitter) OAuth URL generation...')
  const { data: twitterData, error: twitterError } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
      skipBrowserRedirect: true
    }
  })
  
  if (twitterError) {
    console.log('   ❌ X OAuth error:', twitterError.message)
    console.log('      This usually means the provider is not configured in Supabase')
  } else if (twitterData?.url) {
    console.log('   ✅ X OAuth URL generated successfully')
    const url = new URL(twitterData.url)
    console.log('   - Host:', url.hostname)
    console.log('   - Has state:', url.searchParams.has('state'))
    console.log('   - Has redirect_uri:', url.searchParams.has('redirect_uri'))
  }
  
  // Test 3: Check if profiles table is accessible
  console.log('\n📊 Test 3: Checking profiles table access...')
  try {
    const { data: profiles, error: profileError, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    if (profileError) {
      console.log('   ❌ Cannot access profiles table:', profileError.message)
      console.log('      This might indicate RLS issues')
    } else {
      console.log('   ✅ Profiles table is accessible')
      console.log('   - Total profiles:', count || 0)
    }
  } catch (err) {
    console.log('   ❌ Exception accessing profiles:', err.message)
  }
  
  // Test 4: List auth providers status
  console.log('\n🔐 Test 4: OAuth Provider Configuration Status')
  console.log('   (Note: Provider details can only be checked in Supabase Dashboard)')
  console.log('\n   📍 Required configurations:')
  console.log('   Google:')
  console.log('   - Client ID: Must be set in Supabase Dashboard')
  console.log('   - Client Secret: Must be set in Supabase Dashboard')
  console.log('   - Callback URL: https://yijizsscwkvepljqojkz.supabase.co/auth/v1/callback')
  console.log('\n   X/Twitter:')
  console.log('   - API Key: Must be set in Supabase Dashboard')
  console.log('   - API Secret: Must be set in Supabase Dashboard')
  console.log('   - Callback URL: https://yijizsscwkvepljqojkz.supabase.co/auth/v1/callback')
  
  // Summary
  console.log('\n' + '=' .repeat(50))
  console.log('\n📈 Summary:')
  console.log('\n✅ Working:')
  if (googleData?.url) console.log('   - Google OAuth URL generation')
  if (twitterData?.url) console.log('   - X OAuth URL generation')
  if (!sessionError) console.log('   - Session management')
  
  console.log('\n⚠️  Action Items:')
  if (googleError) console.log('   - Configure Google OAuth in Supabase Dashboard')
  if (twitterError) console.log('   - Configure X/Twitter OAuth in Supabase Dashboard')
  
  console.log('\n📚 Next Steps:')
  console.log('1. Go to: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/auth/providers')
  console.log('2. Enable and configure Google and Twitter providers')
  console.log('3. Run SQL migration: supabase/fix_oauth_authentication.sql')
  console.log('4. Test login at: http://localhost:3000/login')
  console.log('\nFor detailed instructions, see: supabase/oauth_configuration.md')
}

testOAuthSetup().catch(console.error)