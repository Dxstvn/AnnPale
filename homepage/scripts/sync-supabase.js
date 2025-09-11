#!/usr/bin/env node

/**
 * Sync local and remote Supabase environments
 * Ensures test users exist with correct passwords
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Configuration
const REMOTE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Test users configuration
const TEST_USERS = [
  {
    email: 'testfan@annpale.test',
    password: 'TestFan123!',
    role: 'fan',
    name: 'Test Fan'
  },
  {
    email: 'testcreator@annpale.test',
    password: 'TestCreator123!',
    role: 'creator',
    name: 'Test Creator'
  },
  {
    email: 'testadmin@annpale.test',
    password: 'TestAdmin123!',
    role: 'admin',
    name: 'Test Admin'
  }
]

async function syncTestUsers() {
  console.log('🔄 Starting Supabase synchronization...')
  
  if (!REMOTE_URL || !SERVICE_KEY) {
    console.error('❌ Missing required environment variables')
    process.exit(1)
  }

  const supabase = createClient(REMOTE_URL, SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log(`📡 Connected to: ${REMOTE_URL}`)

  for (const user of TEST_USERS) {
    console.log(`\n👤 Processing ${user.email}...`)
    
    try {
      // Check if user exists in profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', user.email)
      
      if (profileError) {
        console.error(`  ❌ Error checking profile: ${profileError.message}`)
        continue
      }

      if (profiles && profiles.length > 0) {
        const profile = profiles[0]
        console.log(`  ✅ User exists with ID: ${profile.id}`)
        console.log(`     Role: ${profile.role}`)
        
        // Verify we can authenticate with this user
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password
        })
        
        if (authError) {
          console.log(`  ⚠️  Authentication failed: ${authError.message}`)
          console.log(`     This might indicate password needs to be reset`)
          
          // Try to reset password via admin API
          console.log(`  🔧 Attempting to update password...`)
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            profile.id,
            { password: user.password }
          )
          
          if (updateError) {
            console.error(`  ❌ Could not update password: ${updateError.message}`)
          } else {
            console.log(`  ✅ Password updated successfully`)
          }
        } else {
          console.log(`  ✅ Authentication successful`)
          await supabase.auth.signOut()
        }
      } else {
        console.log(`  ⚠️  User not found in profiles table`)
        console.log(`     You may need to create this user manually`)
      }
    } catch (error) {
      console.error(`  ❌ Unexpected error: ${error.message}`)
    }
  }

  // Check for any extra test users
  console.log('\n🔍 Checking for additional test users...')
  const { data: allTestUsers, error: listError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .like('email', '%@annpale.test')
  
  if (!listError && allTestUsers) {
    console.log(`Found ${allTestUsers.length} users with @annpale.test emails:`)
    allTestUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.role}) [${u.id}]`)
    })
  }

  console.log('\n✨ Synchronization complete!')
}

// Run the sync
syncTestUsers().catch(console.error)