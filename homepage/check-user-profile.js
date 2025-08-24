#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseServiceKey) {
  console.error('Please set SUPABASE_SERVICE_KEY environment variable')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkUserProfile(email) {
  console.log(`Checking profile for ${email}...\n`)
  
  // First, find the user in auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error('Error fetching auth users:', authError)
    return
  }
  
  const authUser = authUsers.users.find(u => u.email === email)
  
  if (authUser) {
    console.log('✅ Found in auth.users')
    console.log('   User ID:', authUser.id)
    console.log('   Created:', new Date(authUser.created_at).toLocaleString())
    console.log('   Provider:', authUser.app_metadata.provider)
    console.log('   Last sign in:', authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at).toLocaleString() : 'Never')
    
    // Check for profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('\n❌ No profile found in profiles table')
        console.log('   Profile needs to be created')
      } else {
        console.error('\n❌ Error fetching profile:', profileError)
      }
    } else {
      console.log('\n✅ Found in profiles table')
      console.log('   Name:', profile.name)
      console.log('   Role:', profile.role)
      console.log('   Created:', new Date(profile.created_at).toLocaleString())
      console.log('   Avatar:', profile.avatar_url ? 'Yes' : 'No')
    }
  } else {
    console.log('❌ User not found in auth.users')
  }
}

// Check for jasmindustin@gmail.com
checkUserProfile('jasmindustin@gmail.com').catch(console.error)