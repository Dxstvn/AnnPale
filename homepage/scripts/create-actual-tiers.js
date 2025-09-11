const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createActualTiers() {
  console.log('🚀 Creating subscription tiers for Dustin Jasmin...')
  
  const creatorId = '530c7ea1-4946-4f34-b636-7530c2e376fb'
  
  try {
    // Clear existing tiers for this creator
    console.log('🧹 Clearing existing tiers...')
    const { error: deleteError } = await supabase
      .from('creator_subscription_tiers')
      .delete()
      .eq('creator_id', creatorId)
    
    if (deleteError) {
      console.log('Note: Could not delete existing tiers:', deleteError.message)
    }
    
    // Define the tiers with correct structure
    const tiers = [
      {
        creator_id: creatorId,
        tier_name: 'Fan Support',
        tier_type: 'basic',
        description: 'Show your support and get exclusive access to my content!',
        price: 5.00,
        billing_period: 'monthly',
        benefits: [
          'Access to exclusive posts and updates',
          'Early access to new content',
          'Supporter badge on your profile',
          'Monthly newsletter with personal updates'
        ],
        ad_free: true,
        exclusive_content: true,
        priority_chat: false,
        vod_access: true,
        max_quality: '1080p',
        is_active: true
      },
      {
        creator_id: creatorId,
        tier_name: 'Premium Member',
        tier_type: 'premium',
        description: 'Get closer to the action with premium perks and exclusive content!',
        price: 15.00,
        billing_period: 'monthly',
        benefits: [
          'All Fan Support benefits',
          'Monthly live streams access',
          'Behind-the-scenes content',
          'Priority response to comments',
          'Exclusive Discord access',
          'Monthly Q&A sessions'
        ],
        ad_free: true,
        exclusive_content: true,
        priority_chat: true,
        vod_access: true,
        max_quality: '1080p',
        is_active: true
      },
      {
        creator_id: creatorId,
        tier_name: 'VIP All-Access',
        tier_type: 'vip',
        description: 'The ultimate experience with direct access and personalized content!',
        price: 50.00,
        billing_period: 'monthly',
        benefits: [
          'All Premium Member benefits',
          'Direct messaging access',
          'Personalized monthly video message',
          'Custom content requests',
          'VIP badge and recognition',
          'Exclusive merchandise',
          'Birthday and holiday greetings',
          'Priority booking for video messages'
        ],
        ad_free: true,
        exclusive_content: true,
        priority_chat: true,
        vod_access: true,
        max_quality: '4k',
        is_active: true
      }
    ]
    
    // Insert each tier
    console.log('📦 Creating subscription tiers...')
    const createdTiers = []
    
    for (const tier of tiers) {
      const { data, error } = await supabase
        .from('creator_subscription_tiers')
        .insert(tier)
        .select()
        .single()
      
      if (error) {
        console.error(`❌ Failed to create tier "${tier.tier_name}":`, error.message)
      } else {
        console.log(`✅ Created tier: ${tier.tier_name} ($${tier.price}/month)`)
        createdTiers.push(data)
      }
    }
    
    if (createdTiers.length > 0) {
      console.log(`\n✨ Successfully created ${createdTiers.length} subscription tiers!`)
      console.log('\nCreated tiers:')
      createdTiers.forEach(tier => {
        console.log(`  - ${tier.tier_name} (${tier.tier_type}): $${tier.price}/${tier.billing_period}`)
        console.log(`    ID: ${tier.id}`)
        console.log(`    Benefits: ${tier.benefits.length} items`)
      })
    }
    
    // Verify all tiers for this creator
    const { data: allTiers, error: fetchError } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .order('price', { ascending: true })
    
    if (!fetchError && allTiers) {
      console.log(`\n📊 Total tiers for creator: ${allTiers.length}`)
    }
    
  } catch (error) {
    console.error('❌ Error creating tiers:', error)
  }
}

createActualTiers().catch(console.error)