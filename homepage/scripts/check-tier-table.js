const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkTierTable() {
  console.log('🔍 Checking creator_subscription_tiers table structure...')
  
  try {
    // Try to insert a minimal tier to see what columns exist
    const testTier = {
      creator_id: '530c7ea1-4946-4f34-b636-7530c2e376fb',
      tier_name: 'Test Tier ' + Date.now(),
      description: 'Test tier description',
      price: 1.00,
      billing_period: 'monthly',
      benefits: ['Test benefit'],
      is_active: true
    }
    
    const { data, error } = await supabase
      .from('creator_subscription_tiers')
      .insert(testTier)
      .select()
      .single()
    
    if (error) {
      console.log('❌ Error inserting test tier:', error.message)
      console.log('Error details:', error)
    } else {
      console.log('✅ Successfully created test tier!')
      console.log('Tier structure:', JSON.stringify(data, null, 2))
      
      // Delete the test tier
      await supabase
        .from('creator_subscription_tiers')
        .delete()
        .eq('id', data.id)
      
      console.log('🧹 Test tier deleted')
    }
    
    // Try to fetch existing tiers to see structure
    const { data: existingTiers, error: fetchError } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .limit(1)
    
    if (!fetchError && existingTiers && existingTiers.length > 0) {
      console.log('\n📊 Example tier structure:')
      console.log(JSON.stringify(existingTiers[0], null, 2))
    }
    
  } catch (error) {
    console.error('❌ Error checking table:', error)
  }
}

checkTierTable().catch(console.error)