import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupTestUser() {
  console.log('Setting up test user...')

  const testEmail = 'testfan@annpale.test'
  const testPassword = 'TestPassword123!'

  try {
    // Check if user exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', testEmail)
      .single()

    if (existingProfile) {
      console.log('Test user already exists:', existingProfile)

      // Try to update the password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingProfile.id,
        { password: testPassword }
      )

      if (updateError) {
        console.error('Error updating password:', updateError)
      } else {
        console.log('Password updated successfully')
      }

      return
    }

    // Create new user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        name: 'Test Fan User',
        role: 'fan'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    console.log('Auth user created:', authData.user?.id)

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user!.id,
        email: testEmail,
        name: 'Test Fan User',
        role: 'fan',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      return
    }

    console.log('Test user created successfully:', profile)
  } catch (error) {
    console.error('Error setting up test user:', error)
  }
}

setupTestUser()