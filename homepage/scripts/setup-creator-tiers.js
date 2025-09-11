const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupCreatorTiers() {
  console.log('🚀 Setting up creator subscription tiers...')
  
  const creatorId = '530c7ea1-4946-4f34-b636-7530c2e376fb' // Dustin Jasmin's creator ID
  
  try {
    // First, check if the table exists by trying to query it
    const { data: existingTiers, error: checkError } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('creator_id', creatorId)
    
    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('📝 Creating creator_subscription_tiers table...')
      
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.creator_subscription_tiers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            tier_name VARCHAR(100) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
            billing_period VARCHAR(20) DEFAULT 'monthly' CHECK (billing_period IN ('monthly', 'yearly')),
            features JSONB DEFAULT '[]'::jsonb,
            benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
            max_subscribers INTEGER,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now(),
            
            -- Tier-specific features
            ad_free BOOLEAN DEFAULT false,
            early_access BOOLEAN DEFAULT false,
            exclusive_content BOOLEAN DEFAULT false,
            direct_messaging BOOLEAN DEFAULT false,
            group_chat_access BOOLEAN DEFAULT false,
            monthly_video_message BOOLEAN DEFAULT false,
            priority_requests BOOLEAN DEFAULT false,
            behind_scenes BOOLEAN DEFAULT false,
            
            -- Ensure unique tier names per creator
            CONSTRAINT unique_tier_name_per_creator UNIQUE(creator_id, tier_name)
          );
          
          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_creator_subscription_tiers_creator_id ON public.creator_subscription_tiers(creator_id);
          CREATE INDEX IF NOT EXISTS idx_creator_subscription_tiers_is_active ON public.creator_subscription_tiers(is_active);
          
          -- Enable RLS
          ALTER TABLE public.creator_subscription_tiers ENABLE ROW LEVEL SECURITY;
          
          -- Create policies
          CREATE POLICY "Anyone can view active tiers" ON public.creator_subscription_tiers
            FOR SELECT USING (is_active = true);
            
          CREATE POLICY "Creators can manage own tiers" ON public.creator_subscription_tiers
            FOR ALL USING (auth.uid() = creator_id);
        `
      }).catch(() => {
        console.log('Note: Could not create table via exec_sql, may already exist')
      })
    }
    
    // Clear existing tiers for this creator (optional - comment out to keep existing)
    console.log('🧹 Clearing existing tiers for creator...')
    await supabase
      .from('creator_subscription_tiers')
      .delete()
      .eq('creator_id', creatorId)
    
    // Define the tiers to create
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
        ad_free: true,
        early_access: true,
        exclusive_content: true,
        direct_messaging: false,
        group_chat_access: false,
        monthly_video_message: false,
        priority_requests: false,
        behind_scenes: false,
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
        ad_free: true,
        early_access: true,
        exclusive_content: true,
        direct_messaging: false,
        group_chat_access: true,
        monthly_video_message: false,
        priority_requests: true,
        behind_scenes: true,
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
        ad_free: true,
        early_access: true,
        exclusive_content: true,
        direct_messaging: true,
        group_chat_access: true,
        monthly_video_message: true,
        priority_requests: true,
        behind_scenes: true,
        is_active: true
      }
    ]
    
    // Insert the tiers
    console.log('📦 Creating subscription tiers...')
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
      }
    }
    
    // Verify the tiers were created
    const { data: createdTiers, error: verifyError } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .order('price', { ascending: true })
    
    if (verifyError) {
      console.error('❌ Error verifying tiers:', verifyError)
    } else {
      console.log(`\n✨ Successfully created ${createdTiers.length} subscription tiers!`)
      console.log('\nCreated tiers:')
      createdTiers.forEach(tier => {
        console.log(`  - ${tier.tier_name}: $${tier.price}/${tier.billing_period}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error setting up creator tiers:', error)
  }
}

setupCreatorTiers().catch(console.error)