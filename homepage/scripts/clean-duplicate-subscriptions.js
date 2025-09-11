const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanDuplicateSubscriptions() {
  console.log('🧹 Cleaning duplicate subscriptions...\n')
  
  try {
    // Get all subscriptions
    const { data: allSubs, error } = await supabase
      .from('creator_subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching subscriptions:', error)
      return
    }
    
    console.log(`Found ${allSubs.length} total subscriptions\n`)
    
    // Group by subscriber_id and creator_id
    const subMap = new Map()
    
    allSubs.forEach(sub => {
      const key = `${sub.subscriber_id}_${sub.creator_id}`
      if (!subMap.has(key)) {
        subMap.set(key, [])
      }
      subMap.get(key).push(sub)
    })
    
    // Find duplicates
    let duplicatesFound = 0
    let duplicatesRemoved = 0
    
    for (const [key, subs] of subMap.entries()) {
      if (subs.length > 1) {
        duplicatesFound++
        console.log(`\n🔍 Found ${subs.length} subscriptions for ${key}:`)
        
        // Sort by status priority (active > cancelled > expired) and then by created_at
        subs.sort((a, b) => {
          // Priority: active = 3, paused = 2, cancelled = 1, expired = 0
          const statusPriority = {
            'active': 3,
            'paused': 2,
            'cancelled': 1,
            'expired': 0
          }
          
          const aPriority = statusPriority[a.status] || 0
          const bPriority = statusPriority[b.status] || 0
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority // Higher priority first
          }
          
          // If same status, keep the most recent
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        
        // Keep the first one (highest priority/most recent), mark others for deletion
        const toKeep = subs[0]
        const toDelete = subs.slice(1)
        
        console.log(`  ✅ Keeping: ${toKeep.id} (${toKeep.status}, created: ${new Date(toKeep.created_at).toLocaleDateString()})`)
        
        for (const sub of toDelete) {
          console.log(`  ❌ Deleting: ${sub.id} (${sub.status}, created: ${new Date(sub.created_at).toLocaleDateString()})`)
          
          // Delete the duplicate
          const { error: deleteError } = await supabase
            .from('creator_subscriptions')
            .delete()
            .eq('id', sub.id)
          
          if (deleteError) {
            console.error(`    Failed to delete ${sub.id}:`, deleteError.message)
          } else {
            duplicatesRemoved++
          }
        }
      }
    }
    
    if (duplicatesFound === 0) {
      console.log('✨ No duplicate subscriptions found!')
    } else {
      console.log(`\n📊 Summary:`)
      console.log(`  - Duplicate sets found: ${duplicatesFound}`)
      console.log(`  - Subscriptions removed: ${duplicatesRemoved}`)
    }
    
    // Now check the specific user mentioned
    console.log('\n🔍 Checking specific user (daj353@nyu.edu)...')
    
    const { data: user } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', 'daj353@nyu.edu')
      .single()
    
    if (user) {
      const { data: userSubs } = await supabase
        .from('creator_subscriptions')
        .select(`
          *,
          creator:profiles!creator_subscriptions_creator_id_fkey(
            id,
            email,
            name
          ),
          tier:creator_subscription_tiers(
            tier_name,
            price
          )
        `)
        .eq('subscriber_id', user.id)
      
      console.log(`\nSubscriptions for ${user.email}:`)
      if (userSubs && userSubs.length > 0) {
        userSubs.forEach(sub => {
          console.log(`  - Creator: ${sub.creator?.email || sub.creator_id}`)
          console.log(`    Status: ${sub.status}`)
          console.log(`    Tier: ${sub.tier?.tier_name || 'Unknown'} ($${sub.tier?.price || 0})`)
          console.log(`    Expires: ${sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'Never'}`)
        })
      } else {
        console.log('  No subscriptions found')
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

cleanDuplicateSubscriptions().catch(console.error)