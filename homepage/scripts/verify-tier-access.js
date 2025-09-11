const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyTierAccess() {
  console.log('🔍 Verifying tier-based access control...\n')
  
  const fanEmail = 'daj353@nyu.edu'
  const creatorEmail = 'dustin.jasmin@jaspire.co'
  
  try {
    // 1. Get both users
    const { data: fanUser } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('email', fanEmail)
      .single()
    
    const { data: creatorUser } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('email', creatorEmail)
      .single()
    
    console.log('👤 Fan:', fanEmail, '(' + fanUser.id + ')')
    console.log('👨‍🎨 Creator:', creatorEmail, '(' + creatorUser.id + ')')
    
    // 2. Get the subscription with tier details
    const { data: subscription } = await supabase
      .from('creator_subscriptions')
      .select(`
        *,
        tier:creator_subscription_tiers(
          id,
          tier_name,
          price
        )
      `)
      .eq('subscriber_id', fanUser.id)
      .eq('creator_id', creatorUser.id)
      .eq('status', 'active')
      .single()
    
    console.log('\n✅ Active Subscription:')
    console.log('   Tier:', subscription.tier?.tier_name || 'Unknown')
    console.log('   Tier ID:', subscription.tier_id)
    console.log('   Price: $' + (subscription.tier?.price || 0))
    
    // 3. Check all posts from this creator
    const { data: allPosts } = await supabase
      .from('posts')
      .select('id, title, is_public, access_tier_ids')
      .eq('creator_id', creatorUser.id)
    
    console.log('\n📝 Creator Posts Analysis:')
    console.log('   Total posts:', allPosts?.length || 0)
    
    if (allPosts && allPosts.length > 0) {
      allPosts.forEach(post => {
        const isPublic = post.is_public
        const requiresTier = post.access_tier_ids && post.access_tier_ids.length > 0
        const userHasRequiredTier = requiresTier && subscription.tier_id ? 
          post.access_tier_ids.includes(subscription.tier_id) : false
        
        const hasAccess = isPublic || (!requiresTier && subscription) || userHasRequiredTier
        
        console.log(`\n   Post: "${post.title}"`)
        console.log('     - Public:', isPublic ? 'Yes' : 'No')
        console.log('     - Requires tiers:', requiresTier ? post.access_tier_ids.join(', ') : 'None (any subscription works)')
        console.log('     - User has required tier:', userHasRequiredTier ? 'Yes' : 'No')
        console.log('     - Final access:', hasAccess ? '✅ GRANTED' : '❌ DENIED')
      })
    }
    
    // 4. Test the API endpoint
    console.log('\n🌐 Testing API Endpoint Logic:')
    
    // Simulate what the API does
    const { data: activeSubscriptions } = await supabase
      .from('creator_subscriptions')
      .select('creator_id, tier_id')
      .eq('subscriber_id', fanUser.id)
      .eq('status', 'active')
    
    console.log('   Active subscriptions found:', activeSubscriptions?.length || 0)
    
    if (activeSubscriptions && activeSubscriptions.length > 0) {
      const subscribedCreatorIds = activeSubscriptions.map(s => s.creator_id)
      console.log('   Subscribed to creators:', subscribedCreatorIds.join(', '))
      
      // The current API shows ALL posts from subscribed creators
      // This is the problem - it doesn't check tier requirements
      console.log('\n   ⚠️  ISSUE: API currently shows ALL posts from subscribed creators')
      console.log('   ⚠️  It should check if user has the required tier for each post')
    }
    
    console.log('\n💡 Solution:')
    console.log('   The API needs to check tier requirements for each post')
    console.log('   Posts should only be shown if:')
    console.log('   1. Post is public, OR')
    console.log('   2. User is subscribed AND:')
    console.log('      a. Post has no tier requirements (any subscription works), OR')
    console.log('      b. User has one of the required tiers')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

verifyTierAccess().catch(console.error)