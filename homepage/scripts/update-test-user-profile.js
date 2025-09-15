import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateTestUserProfile() {
  try {
    // Find the user
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) throw authError

    const user = authUser.users.find(u => u.email === 'reggiej654@gmail.com')
    if (!user) {
      console.log('User not found')
      return
    }

    console.log('Found user:', user.id)

    // Update profile with enhanced data for Stripe prefilling
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: 'Reggie',
        last_name: 'Jean',
        username: 'reggiejean',
        phone: '+15551234567', // Sample phone for testing
        website: 'https://reggiejean.com', // Optional website
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return
    }

    console.log('\n===========================================')
    console.log('PROFILE UPDATED SUCCESSFULLY')
    console.log('===========================================')
    console.log('Name:', updatedProfile.name)
    console.log('First Name:', updatedProfile.first_name)
    console.log('Last Name:', updatedProfile.last_name)
    console.log('Username:', updatedProfile.username)
    console.log('Email:', updatedProfile.email)
    console.log('Phone:', updatedProfile.phone)
    console.log('Website:', updatedProfile.website)
    console.log('Profile URL:', `https://annpale.com/${updatedProfile.username}`)
    console.log('===========================================')
    console.log('\nThis data will be prefilled in Stripe Connect onboarding:')
    console.log('- Individual name: ' + updatedProfile.first_name + ' ' + updatedProfile.last_name)
    console.log('- Business name: ' + updatedProfile.name)
    console.log('- Email: ' + updatedProfile.email)
    console.log('- Phone: ' + updatedProfile.phone)
    console.log('- Website: ' + (updatedProfile.website || `https://annpale.com/${updatedProfile.username}`))
    console.log('===========================================\n')
  } catch (error) {
    console.error('Error:', error)
  }
}

updateTestUserProfile()