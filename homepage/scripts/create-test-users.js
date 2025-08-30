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

const testUsers = [
  {
    email: 'testfan@annpale.test',
    password: 'TestFan123!',
    role: 'customer',
    name: 'Test Fan',
    metadata: { test_account: true }
  },
  {
    email: 'testcreator@annpale.test',
    password: 'TestCreator123!',
    role: 'creator',
    name: 'Test Creator',
    metadata: { test_account: true }
  },
  {
    email: 'testadmin@annpale.test',
    password: 'TestAdmin123!',
    role: 'admin',
    name: 'Test Admin',
    metadata: { test_account: true }
  }
]

async function createTestUsers() {
  console.log('🚀 Creating test users...')
  
  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role,
          ...user.metadata
        }
      })

      if (authError) {
        if (authError.message?.includes('already exists')) {
          console.log(`⚠️  User ${user.email} already exists, skipping...`)
          
          // Get existing user
          const { data: users } = await supabase.auth.admin.listUsers()
          const existingUser = users?.users?.find(u => u.email === user.email)
          
          if (existingUser) {
            // Update profile if needed
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: existingUser.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })
            
            if (!profileError) {
              console.log(`✅ Updated profile for ${user.email}`)
            }
          }
          continue
        }
        throw authError
      }

      console.log(`✅ Created auth user: ${user.email}`)

      // Create or update profile
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error(`❌ Failed to create profile for ${user.email}:`, profileError)
        } else {
          console.log(`✅ Created profile for ${user.email}`)
        }
      }
    } catch (error) {
      console.error(`❌ Failed to create user ${user.email}:`, error)
    }
  }
  
  console.log('\n✨ Test users setup complete!')
  console.log('\n📝 Test Credentials:')
  testUsers.forEach(user => {
    console.log(`\n${user.role.toUpperCase()}:`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Password: ${user.password}`)
  })
}

createTestUsers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })