#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTk4OTAsImV4cCI6MjA3MTM5NTg5MH0.zlQQHLmGBojPbw9GsSJqSpsWT9SlANPtEhZyEYKr4g0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthFlow() {
  console.log('Testing OAuth authentication flow...\n')
  
  // Check current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('❌ Session error:', sessionError.message)
    return
  }
  
  if (session) {
    console.log('✅ Active session found')
    console.log('   User ID:', session.user.id)
    console.log('   Email:', session.user.email)
    console.log('   Provider:', session.user.app_metadata.provider)
    
    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('❌ No profile found for user')
        console.log('   This would trigger profile creation in callback page')
      } else {
        console.error('❌ Profile fetch error:', profileError.message)
      }
    } else {
      console.log('✅ Profile found')
      console.log('   Name:', profile.name)
      console.log('   Role:', profile.role)
      console.log('   Avatar:', profile.avatar_url ? 'Yes' : 'No')
    }
    
    // Test API endpoint with Bearer token
    console.log('\n📡 Testing API endpoint...')
    const apiUrl = 'http://localhost:3000/api/auth/profile'
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API endpoint works with Bearer token')
        console.log('   Profile data received:', data.profile ? 'Yes' : 'No')
      } else {
        console.log('❌ API endpoint failed:', response.status, response.statusText)
        const error = await response.text()
        console.log('   Error:', error)
      }
    } catch (err) {
      console.error('❌ API request failed:', err.message)
    }
    
  } else {
    console.log('❌ No active session')
    console.log('   User needs to authenticate via OAuth')
    console.log('\nTo test OAuth flow:')
    console.log('1. Open http://localhost:3000/login')
    console.log('2. Click on Google or X button')
    console.log('3. Complete OAuth authentication')
    console.log('4. Check if redirected to appropriate dashboard')
  }
}

testAuthFlow().catch(console.error)