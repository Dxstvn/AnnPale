// Script to clear stripe_account_id for a test user
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function clearStripeAccount(email) {
  try {
    // First, find the user by email
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('Error fetching users:', authError)
      return
    }

    const user = authUser.users.find(u => u.email === email)

    if (!user) {
      console.error(`User with email ${email} not found`)
      return
    }

    console.log(`Found user: ${user.id} (${user.email})`)

    // Get current profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, onboarding_started_at, onboarding_completed_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return
    }

    console.log('Current profile data:', profile)

    // Clear Stripe-related fields
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        stripe_account_id: null,
        stripe_charges_enabled: false,
        stripe_payouts_enabled: false,
        onboarding_started_at: null,
        onboarding_completed_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return
    }

    console.log(`Successfully cleared Stripe account for ${email}`)

    // Verify the update
    const { data: updatedProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, onboarding_started_at, onboarding_completed_at')
      .eq('id', user.id)
      .single()

    if (verifyError) {
      console.error('Error verifying update:', verifyError)
      return
    }

    console.log('Updated profile data:', updatedProfile)
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the script
const email = process.argv[2] || 'reggiej654@gmail.com'
console.log(`Clearing Stripe account for: ${email}`)
clearStripeAccount(email).then(() => {
  console.log('Script completed')
  process.exit(0)
})