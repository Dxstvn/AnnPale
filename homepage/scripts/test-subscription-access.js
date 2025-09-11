const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testSubscriptionAccess() {
  console.log('🧪 Testing subscription access system...\n')
  
  const creatorId = '530c7ea1-4946-4f34-b636-7530c2e376fb' // Dustin Jasmin
  
  try {
    // 1. Get a fan user (not the creator)
    const { data: fanUser } = await supabase
      .from('profiles')
      .select('id, email, name')
      .neq('id', creatorId)
      .limit(1)
      .single()
    
    if (!fanUser) {
      console.log('❌ No fan user found')
      return
    }
    
    console.log('👤 Test Fan:', fanUser.email || fanUser.name || fanUser.id)
    
    // 2. Get creator's subscription tier
    const { data: tier } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .order('price', { ascending: true })
      .limit(1)
      .single()
    
    if (!tier) {
      console.log('❌ No tiers found for creator')
      return
    }
    
    console.log('📦 Using Tier:', tier.tier_name, `($${tier.price})`)
    
    // 3. Check if subscription already exists
    const { data: existingSub } = await supabase
      .from('creator_subscriptions')
      .select('*')
      .eq('subscriber_id', fanUser.id)
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .single()
    
    if (existingSub) {
      console.log('✅ Subscription already exists:', existingSub.id)
    } else {
      // 4. Create a test subscription
      const { data: newSub, error: subError } = await supabase
        .from('creator_subscriptions')
        .insert({
          subscriber_id: fanUser.id,
          creator_id: creatorId,
          tier_id: tier.id,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single()
      
      if (subError) {
        console.error('❌ Error creating subscription:', subError.message)
        return
      }
      
      console.log('✅ Created subscription:', newSub.id)
    }
    
    // 5. Test the has_active_subscription function
    const { data: hasAccess } = await supabase
      .rpc('has_active_subscription', {
        p_subscriber_id: fanUser.id,
        p_creator_id: creatorId
      })
    
    console.log('\n📊 Access Check:')
    console.log('  - Has active subscription:', hasAccess ? '✅ Yes' : '❌ No')
    
    // 6. Create a test post to verify access
    const { data: testPost, error: postError } = await supabase
      .from('posts')
      .insert({
        creator_id: creatorId,
        title: 'Test Subscription Post',
        content: 'This is a test post for subscribers only',
        is_public: false,
        access_tier_ids: [tier.id],
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (postError) {
      console.log('Note: Could not create test post:', postError.message)
    } else {
      console.log('\n📝 Created test post:', testPost.id)
      console.log('  - Title:', testPost.title)
      console.log('  - Public:', testPost.is_public ? 'Yes' : 'No')
      console.log('  - Requires tier:', tier.tier_name)
    }
    
    // 7. Check if the fan can access posts
    const { data: posts } = await supabase
      .from('posts')
      .select('id, title, is_public')
      .eq('creator_id', creatorId)
      .limit(5)
    
    console.log('\n📚 Creator Posts:')
    posts?.forEach(post => {
      const accessible = post.is_public || hasAccess
      console.log(`  - ${post.title}: ${accessible ? '✅ Accessible' : '🔒 Locked'}`)
    })
    
    console.log('\n✨ Subscription system test complete!')
    console.log('\nSummary:')
    console.log('  - Fan user:', fanUser.email || fanUser.id)
    console.log('  - Creator:', creatorId)
    console.log('  - Subscription tier:', tier.tier_name)
    console.log('  - Has access:', hasAccess ? 'Yes' : 'No')
    console.log('\nFan should now be able to see subscriber-only posts in:')
    console.log('  1. /fan/home - Home feed')
    console.log('  2. /fan/creators/' + creatorId + ' - Creator profile')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testSubscriptionAccess().catch(console.error)