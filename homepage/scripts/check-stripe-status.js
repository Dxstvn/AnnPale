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

async function checkUserStripeStatus() {
  try {
    // Find the user
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) throw authError

    const user = authUser.users.find(u => u.email === 'reggiej654@gmail.com')
    if (!user) {
      console.log('User not found')
      return
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, onboarding_started_at, onboarding_completed_at')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    console.log('\n===========================================')
    console.log('USER STRIPE STATUS CHECK')
    console.log('===========================================')
    console.log('User ID:', profile.id)
    console.log('Email:', profile.email)
    console.log('-------------------------------------------')
    console.log('Stripe Account ID:', profile.stripe_account_id || 'NOT SET')
    console.log('Charges Enabled:', profile.stripe_charges_enabled)
    console.log('Payouts Enabled:', profile.stripe_payouts_enabled)
    console.log('Onboarding Started:', profile.onboarding_started_at || 'Never')
    console.log('Onboarding Completed:', profile.onboarding_completed_at || 'Never')
    console.log('-------------------------------------------')

    if (profile.stripe_account_id) {
      console.log('✅ ACCOUNT EXISTS:', profile.stripe_account_id)
      if (!profile.stripe_charges_enabled || !profile.stripe_payouts_enabled) {
        console.log('⚠️  BUT onboarding is INCOMPLETE')
        console.log('   (charges or payouts not enabled)')
      } else {
        console.log('✅ ONBOARDING COMPLETE')
        console.log('   (both charges and payouts enabled)')
      }
    } else {
      console.log('❌ NO STRIPE ACCOUNT')
      console.log('   User needs to start onboarding')
    }
    console.log('===========================================\n')
  } catch (error) {
    console.error('Error:', error)
  }
}

checkUserStripeStatus()