const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testUsers = [
  {
    email: 'testfan@annpale.test',
    password: 'TestPassword123!',
    role: 'fan',
    profile: {
      username: 'testfan',
      display_name: 'Test Fan User',
      is_creator: false
    }
  },
  {
    email: 'testcreator@annpale.test',
    password: 'TestPassword123!',
    role: 'creator',
    profile: {
      username: 'testcreator',
      display_name: 'Test Creator',
      is_creator: true,
      bio: 'Test creator account for E2E testing',
      price_per_video: 50
    }
  }
]

async function verifyAndCreateTestUsers() {
  console.log('🔍 Verifying test users...\n')

  for (const testUser of testUsers) {
    console.log(`Checking ${testUser.role}: ${testUser.email}`)
    
    try {
      // Check if user exists in auth.users
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        console.error(`  ❌ Error listing users:`, listError.message)
        continue
      }
      
      const existingUser = users.find(u => u.email === testUser.email)
      
      if (existingUser) {
        console.log(`  ✅ User exists in auth system (ID: ${existingUser.id})`)
        
        // Check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', existingUser.id)
          .single()
        
        if (profileError) {
          console.log(`  ⚠️ No profile found, creating...`)
          
          // Create profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: existingUser.id,
              ...testUser.profile,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          
          if (insertError) {
            console.error(`  ❌ Failed to create profile:`, insertError.message)
          } else {
            console.log(`  ✅ Profile created successfully`)
          }
        } else {
          console.log(`  ✅ Profile exists (username: ${profile.username})`)
          
          // Update profile if needed
          if (profile.is_creator !== testUser.profile.is_creator) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                is_creator: testUser.profile.is_creator,
                price_per_video: testUser.profile.price_per_video 
              })
              .eq('id', existingUser.id)
            
            if (updateError) {
              console.error(`  ❌ Failed to update profile:`, updateError.message)
            } else {
              console.log(`  ✅ Profile updated to is_creator: ${testUser.profile.is_creator}`)
            }
          }
        }
      } else {
        console.log(`  ⚠️ User does not exist, creating...`)
        
        // Create user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
          user_metadata: {
            role: testUser.role
          }
        })
        
        if (createError) {
          console.error(`  ❌ Failed to create user:`, createError.message)
        } else {
          console.log(`  ✅ User created (ID: ${newUser.user.id})`)
          
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: newUser.user.id,
              ...testUser.profile,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          
          if (profileError) {
            console.error(`  ❌ Failed to create profile:`, profileError.message)
          } else {
            console.log(`  ✅ Profile created successfully`)
          }
        }
      }
      
      // Test login
      console.log(`  🔐 Testing login...`)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      })
      
      if (signInError) {
        console.error(`  ❌ Login failed:`, signInError.message)
        
        // Try to update password if login failed
        if (existingUser) {
          console.log(`  🔄 Updating password...`)
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: testUser.password }
          )
          
          if (updateError) {
            console.error(`  ❌ Failed to update password:`, updateError.message)
          } else {
            console.log(`  ✅ Password updated successfully`)
          }
        }
      } else {
        console.log(`  ✅ Login successful`)
        await supabase.auth.signOut()
      }
      
    } catch (error) {
      console.error(`  ❌ Unexpected error:`, error.message)
    }
    
    console.log('')
  }
  
  console.log('✅ Test user verification complete!')
}

verifyAndCreateTestUsers().catch(console.error)