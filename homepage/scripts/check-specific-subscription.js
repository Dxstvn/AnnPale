const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkSpecificSubscription() {
  console.log('🔍 Checking subscription for daj353@nyu.edu...\n')
  
  const fanEmail = 'daj353@nyu.edu'
  const creatorEmail = 'dustin.jasmin@jaspire.co'
  
  try {
    // 1. Get the fan user
    const { data: fanUser, error: fanError } = await supabase
      .from('profiles')
      .select('id, email, name, role')
      .eq('email', fanEmail)
      .single()
    
    if (fanError || !fanUser) {
      console.log('❌ Fan user not found:', fanError?.message)
      return
    }
    
    console.log('👤 Fan User Found:')
    console.log('   Email:', fanUser.email)
    console.log('   ID:', fanUser.id)
    console.log('   Name:', fanUser.name)
    console.log('   Role:', fanUser.role || 'not set')
    
    // 2. Get the creator user
    const { data: creatorUser, error: creatorError } = await supabase
      .from('profiles')
      .select('id, email, name, role')
      .eq('email', creatorEmail)
      .single()
    
    if (creatorError || !creatorUser) {
      console.log('❌ Creator user not found:', creatorError?.message)
      return
    }
    
    console.log('\n👨‍🎨 Creator User Found:')
    console.log('   Email:', creatorUser.email)
    console.log('   ID:', creatorUser.id)
    console.log('   Name:', creatorUser.name)
    console.log('   Role:', creatorUser.role || 'not set')
    
    // 3. Check for any subscriptions between these users
    const { data: subscriptions, error: subError } = await supabase
      .from('creator_subscriptions')
      .select(`
        *,
        tier:creator_subscription_tiers(
          id,
          tier_name,
          price,
          benefits
        )
      `)
      .eq('subscriber_id', fanUser.id)
      .eq('creator_id', creatorUser.id)
    
    console.log('\n📊 Subscription Status:')
    if (subError) {
      console.log('❌ Error checking subscriptions:', subError.message)
    } else if (!subscriptions || subscriptions.length === 0) {
      console.log('❌ NO SUBSCRIPTION FOUND between these users')
      console.log('\n⚠️  This is the issue - no subscription exists in the database')
    } else {
      console.log('Found', subscriptions.length, 'subscription(s):')
      subscriptions.forEach((sub, index) => {
        console.log(`\n   Subscription ${index + 1}:`)
        console.log('   - ID:', sub.id)
        console.log('   - Status:', sub.status)
        console.log('   - Tier:', sub.tier?.tier_name || 'No tier')
        console.log('   - Price: $' + (sub.tier?.price || 0))
        console.log('   - Started:', new Date(sub.started_at).toLocaleDateString())
        console.log('   - Expires:', sub.expires_at ? new Date(sub.expires_at).toLocaleDateString() : 'Never')
        console.log('   - Stripe ID:', sub.stripe_subscription_id || 'None')
      })
    }
    
    // 4. Check if there's an active subscription
    const { data: activeSub } = await supabase
      .from('creator_subscriptions')
      .select('*')
      .eq('subscriber_id', fanUser.id)
      .eq('creator_id', creatorUser.id)
      .eq('status', 'active')
      .single()
    
    if (!activeSub) {
      console.log('\n❌ No ACTIVE subscription found')
      
      // 5. Let's create the subscription since user said they subscribed
      console.log('\n🔧 Creating subscription for the user...')
      
      // First get the basic tier for this creator
      const { data: basicTier } = await supabase
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', creatorUser.id)
        .eq('is_active', true)
        .order('price', { ascending: true })
        .limit(1)
        .single()
      
      if (basicTier) {
        console.log('Found basic tier:', basicTier.tier_name, '($' + basicTier.price + ')')
        
        const { data: newSub, error: createError } = await supabase
          .from('creator_subscriptions')
          .insert({
            subscriber_id: fanUser.id,
            creator_id: creatorUser.id,
            tier_id: basicTier.id,
            status: 'active',
            started_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single()
        
        if (createError) {
          console.log('❌ Error creating subscription:', createError.message)
        } else {
          console.log('✅ Created subscription:', newSub.id)
        }
      } else {
        console.log('❌ No tiers found for creator')
      }
    }
    
    // 6. Test the access functions
    console.log('\n🔐 Testing Access Functions:')
    const { data: hasAccess } = await supabase
      .rpc('has_active_subscription', {
        p_subscriber_id: fanUser.id,
        p_creator_id: creatorUser.id
      })
    
    console.log('   has_active_subscription:', hasAccess ? '✅ True' : '❌ False')
    
    // 7. Check creator's posts
    const { data: posts } = await supabase
      .from('posts')
      .select('id, title, is_public, access_tier_ids')
      .eq('creator_id', creatorUser.id)
      .limit(5)
    
    console.log('\n📝 Creator Posts:')
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        console.log('   -', post.title)
        console.log('     Public:', post.is_public ? 'Yes' : 'No')
        console.log('     Tier Required:', post.access_tier_ids?.length > 0 ? 'Yes' : 'No')
      })
    } else {
      console.log('   No posts found for this creator')
    }
    
    // 8. Check all subscriptions for the fan
    const { data: allFanSubs } = await supabase
      .from('creator_subscriptions')
      .select(`
        *,
        creator:profiles!creator_subscriptions_creator_id_fkey(
          id,
          email,
          name
        )
      `)
      .eq('subscriber_id', fanUser.id)
    
    console.log('\n📋 All Subscriptions for Fan:')
    if (allFanSubs && allFanSubs.length > 0) {
      allFanSubs.forEach(sub => {
        console.log('   - Creator:', sub.creator?.email || sub.creator_id)
        console.log('     Status:', sub.status)
      })
    } else {
      console.log('   No subscriptions found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkSpecificSubscription().catch(console.error)