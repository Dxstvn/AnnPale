const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupCreatorTiers() {
  console.log('🚀 Setting up creator subscription tiers (simplified)...')
  
  const creatorId = '530c7ea1-4946-4f34-b636-7530c2e376fb' // Dustin Jasmin's creator ID
  
  try {
    // Clear existing tiers for this creator
    console.log('🧹 Clearing existing tiers for creator...')
    await supabase
      .from('creator_subscription_tiers')
      .delete()
      .eq('creator_id', creatorId)
    
    // Define the tiers with only basic fields that exist in the table
    const tiers = [
      {
        creator_id: creatorId,
        tier_name: 'Fan Support',
        description: 'Show your support and get exclusive access to my content!',
        price: 5.00,
        billing_period: 'monthly',
        benefits: [
          'Access to exclusive posts and updates',
          'Early access to new content',
          'Supporter badge on your profile',
          'Monthly newsletter with personal updates'
        ],
        features: {
          icon: '⭐',
          color: '#8B5CF6'
        },
        is_active: true
      },
      {
        creator_id: creatorId,
        tier_name: 'Premium Member',
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
        features: {
          icon: '💎',
          color: '#EC4899'
        },
        is_active: true
      },
      {
        creator_id: creatorId,
        tier_name: 'VIP All-Access',
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
        features: {
          icon: '👑',
          color: '#F59E0B',
          highlighted: true
        },
        is_active: true
      }
    ]
    
    // Insert the tiers one by one
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
    
    console.log(`\n✨ Successfully created ${createdTiers.length} subscription tiers!`)
    
    // Display created tiers
    if (createdTiers.length > 0) {
      console.log('\nCreated tiers:')
      createdTiers.forEach(tier => {
        console.log(`  - ${tier.tier_name}: $${tier.price}/${tier.billing_period}`)
        console.log(`    ID: ${tier.id}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error setting up creator tiers:', error)
  }
}

setupCreatorTiers().catch(console.error)