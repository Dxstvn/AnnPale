require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('   Please ensure these are set in your .env.local file')
  process.exit(1)
}

// Initialize Supabase client with service role
const supabase = createClient(supabaseUrl, serviceKey)

// Test Stripe account ID (from the API code)
const TEST_STRIPE_ACCOUNT_ID = 'acct_1S3TOyEM4K7HiodW'

async function assignTestStripeAccounts() {
  console.log('🔄 Fetching all creator profiles...')
  
  // Get all creators (is_creator = true)
  const { data: creators, error: fetchError } = await supabase
    .from('profiles')
    .select('id, display_name, is_creator, stripe_account_id')
    .eq('is_creator', true)
  
  if (fetchError) {
    console.error('❌ Error fetching creators:', fetchError)
    return
  }
  
  console.log(`📊 Found ${creators.length} creators`)
  
  // Update each creator with test Stripe account
  for (const creator of creators) {
    if (creator.stripe_account_id === TEST_STRIPE_ACCOUNT_ID) {
      console.log(`✅ ${creator.display_name} already has test Stripe account`)
      continue
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        stripe_account_id: TEST_STRIPE_ACCOUNT_ID,
        updated_at: new Date().toISOString()
      })
      .eq('id', creator.id)
    
    if (updateError) {
      console.error(`❌ Error updating ${creator.display_name}:`, updateError)
    } else {
      console.log(`✅ Updated ${creator.display_name} with test Stripe account`)
    }
  }
  
  console.log('✨ Done! All creators now have test Stripe accounts')
}

// Run the script
assignTestStripeAccounts().catch(console.error)