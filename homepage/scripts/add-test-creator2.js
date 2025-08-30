const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestCreator2() {
  const user = {
    email: 'testcreator2@annpale.test',
    password: 'TestCreator2123!',
    role: 'creator',
    name: 'Test Creator 2',
  }

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        role: user.role,
        test_account: true
      }
    })

    if (authError) {
      console.error(`❌ Failed to create user ${user.email}:`, authError)
      return
    }

    if (!authData.user) {
      console.error('No user data returned')
      return
    }

    // Create or update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error(`❌ Failed to create profile for ${user.email}:`, profileError)
      // Try to cleanup auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return
    }

    console.log(`✅ Created ${user.role}: ${user.email}`)
    console.log(`   Password: ${user.password}`)
    console.log(`   User ID: ${authData.user.id}`)
  } catch (error) {
    console.error(`❌ Unexpected error creating ${user.email}:`, error)
  }
}

createTestCreator2().then(() => {
  console.log('\n✨ Test Creator 2 created successfully!')
}).catch(error => {
  console.error('Failed to create test user:', error)
  process.exit(1)
})