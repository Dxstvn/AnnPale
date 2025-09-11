const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU5MzI4OCwiZXhwIjoyMDcyMTY5Mjg4fQ.G9G6t9CxTa3RTFEHWrsOAd7NeOXCcPlwF0NuOKuw-M4'
)

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