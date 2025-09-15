const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testSubscriptions() {
  console.log('Testing subscriptions data...\n')
  
  // Get all subscriptions
  const { data: subscriptions, error: subError } = await supabase
    .from('subscriptions')
    .select('*')
  
  console.log('All subscriptions:', subscriptions)
  if (subError) console.error('Error:', subError)
  
  // Get profiles to match creator emails
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('id, email, name, role')
    .in('email', ['dustin.jasmin@jaspire.co', 'daj353@nyu.edu'])
  
  console.log('\nProfiles:', profiles)
  if (profError) console.error('Error:', profError)
  
  // Check subscription with creator_id
  if (profiles) {
    const creatorProfile = profiles.find(p => p.email === 'dustin.jasmin@jaspire.co')
    const fanProfile = profiles.find(p => p.email === 'daj353@nyu.edu')
    
    console.log('\nCreator ID:', creatorProfile?.id)
    console.log('Fan ID:', fanProfile?.id)
    
    if (creatorProfile) {
      const { data: creatorSubs, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('creator_id', creatorProfile.id)
      
      console.log('\nSubscriptions for creator:', creatorSubs)
      if (error) console.error('Error:', error)
    }
    
    if (fanProfile) {
      const { data: fanSubs, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('fan_id', fanProfile.id)
      
      console.log('\nSubscriptions for fan:', fanSubs)
      if (error) console.error('Error:', error)
    }
  }
}

testSubscriptions().catch(console.error)