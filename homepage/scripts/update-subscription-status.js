const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateSubscriptionStatus() {
  console.log('🔄 Updating subscription statuses...\n')
  
  try {
    // Get all subscriptions
    const { data: allSubs, error } = await supabase
      .from('creator_subscriptions')
      .select('*')
    
    if (error) {
      console.error('Error fetching subscriptions:', error)
      return
    }
    
    console.log(`Found ${allSubs.length} subscriptions to check\n`)
    
    let updated = 0
    const now = new Date()
    
    for (const sub of allSubs) {
      let shouldUpdate = false
      let newStatus = sub.status
      
      // Check if subscription has expired
      if (sub.expires_at && new Date(sub.expires_at) < now) {
        if (sub.status === 'active') {
          newStatus = 'expired'
          shouldUpdate = true
          console.log(`📅 Subscription ${sub.id} has expired (was active)`)
        }
      } else if (sub.expires_at && new Date(sub.expires_at) >= now) {
        // Check if marked as expired but shouldn't be
        if (sub.status === 'expired' && !sub.cancelled_at) {
          newStatus = 'active'
          shouldUpdate = true
          console.log(`✅ Subscription ${sub.id} should be active (was marked expired)`)
        }
      }
      
      if (shouldUpdate) {
        const { error: updateError } = await supabase
          .from('creator_subscriptions')
          .update({ status: newStatus })
          .eq('id', sub.id)
        
        if (updateError) {
          console.error(`Failed to update ${sub.id}:`, updateError.message)
        } else {
          updated++
        }
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`  - Total subscriptions: ${allSubs.length}`)
    console.log(`  - Updated: ${updated}`)
    
    // Check the specific user's subscription
    console.log('\n🔍 Checking daj353@nyu.edu subscription...')
    
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', 'daj353@nyu.edu')
      .single()
    
    if (user) {
      const { data: userSub } = await supabase
        .from('creator_subscriptions')
        .select(`
          *,
          creator:profiles!creator_subscriptions_creator_id_fkey(
            email,
            name
          ),
          tier:creator_subscription_tiers(
            tier_name,
            price
          )
        `)
        .eq('subscriber_id', user.id)
        .single()
      
      if (userSub) {
        const expiresAt = new Date(userSub.expires_at)
        const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        console.log(`  Creator: ${userSub.creator?.email}`)
        console.log(`  Status: ${userSub.status}`)
        console.log(`  Tier: ${userSub.tier?.tier_name} ($${userSub.tier?.price})`)
        console.log(`  Expires: ${expiresAt.toLocaleDateString()}`)
        console.log(`  Days remaining: ${daysRemaining}`)
        console.log(`  Should be: ${daysRemaining > 0 ? 'Active' : 'Expired'}`)
        
        // Fix if needed
        if (daysRemaining > 0 && userSub.status !== 'active') {
          console.log(`\n⚠️  Status mismatch! Updating to active...`)
          const { error: fixError } = await supabase
            .from('creator_subscriptions')
            .update({ status: 'active' })
            .eq('id', userSub.id)
          
          if (fixError) {
            console.error('Failed to fix:', fixError.message)
          } else {
            console.log('✅ Fixed!')
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateSubscriptionStatus().catch(console.error)