const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createSubscriptionSystem() {
  console.log('🚀 Creating subscription system...')
  
  try {
    // Try to create the table via SQL
    let createError = null
    try {
      const result = await supabase.rpc('exec_sql', {
        sql: `
          -- Create subscriptions table
          CREATE TABLE IF NOT EXISTS public.creator_subscriptions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            subscriber_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            tier_id UUID REFERENCES public.creator_subscription_tiers(id) ON DELETE SET NULL,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
            started_at TIMESTAMPTZ DEFAULT now(),
            expires_at TIMESTAMPTZ,
            cancelled_at TIMESTAMPTZ,
            stripe_subscription_id VARCHAR(255),
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now(),
            
            -- Ensure unique active subscription per subscriber-creator pair
            CONSTRAINT unique_active_subscription UNIQUE(subscriber_id, creator_id, status)
          );
          
          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_subscriber ON public.creator_subscriptions(subscriber_id);
          CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_creator ON public.creator_subscriptions(creator_id);
          CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_status ON public.creator_subscriptions(status);
          CREATE INDEX IF NOT EXISTS idx_creator_subscriptions_tier ON public.creator_subscriptions(tier_id);
          
          -- Enable RLS
          ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;
          
          -- RLS Policies
          CREATE POLICY "Users can view their own subscriptions" ON public.creator_subscriptions
            FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
            
          CREATE POLICY "Users can create their own subscriptions" ON public.creator_subscriptions
            FOR INSERT WITH CHECK (auth.uid() = subscriber_id);
            
          CREATE POLICY "Users can update their own subscriptions" ON public.creator_subscriptions
            FOR UPDATE USING (auth.uid() = subscriber_id);
        `
      })
      createError = result.error
    } catch (err) {
      console.log('Note: Could not create table via SQL, may already exist')
      createError = err
    }
    
    if (createError) {
      console.log('Table might already exist, continuing...')
    } else {
      console.log('✅ Subscription table created')
    }
    
    // Get fan and creator IDs
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email, role')
      .in('email', ['fan@example.com', 'creator@example.com'])
    
    console.log('Found profiles:', profiles?.map(p => ({ email: p.email, role: p.role })))
    
    // For testing, let's create a subscription for the current test users
    // Assuming we have a fan user and Dustin as creator
    const creatorId = '530c7ea1-4946-4f34-b636-7530c2e376fb' // Dustin Jasmin
    
    // Get a tier for this creator
    const { data: tiers } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .order('price', { ascending: true })
      .limit(1)
      .single()
    
    if (!tiers) {
      console.log('❌ No tiers found for creator')
      return
    }
    
    console.log('Found tier:', tiers.tier_name, `($${tiers.price})`)
    
    // Get or create a test fan user
    let fanId = null
    
    // Check if we have any fan users
    const { data: fanUsers } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('role', 'fan')
      .limit(1)
    
    if (fanUsers && fanUsers.length > 0) {
      fanId = fanUsers[0].id
      console.log('Using existing fan:', fanUsers[0].email || fanUsers[0].name)
    } else {
      // For simplicity, let's just use a hardcoded fan ID or create a simple profile entry
      // We'll use the same approach as before - just create a subscription for testing
      console.log('No fan users found, will create a test subscription with mock fan ID')
      
      // Create a mock fan ID for testing
      fanId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479' // Mock UUID for testing
      
      // Try to insert a basic profile for this fan
      const { data: newFan, error: fanError } = await supabase
        .from('profiles')
        .upsert({
          id: fanId,
          email: 'testfan@example.com',
          name: 'Test Fan User',
          role: 'fan'
        }, {
          onConflict: 'id'
        })
        .select()
        .single()
      
      if (!fanError) {
        console.log('Created test fan profile')
      } else {
        console.log('Could not create test fan profile:', fanError.message)
        // Try to find any user to use as a fan
        const { data: anyUser } = await supabase
          .from('profiles')
          .select('id, name, email')
          .neq('id', creatorId)
          .limit(1)
          .single()
        
        if (anyUser) {
          fanId = anyUser.id
          console.log('Using existing user as fan:', anyUser.email || anyUser.name)
        }
      }
    }
    
    if (!fanId) {
      console.log('❌ Could not find or create a fan user for testing')
      return
    }
    
    // Create a subscription
    const { data: subscription, error: subError } = await supabase
      .from('creator_subscriptions')
      .upsert({
        subscriber_id: fanId,
        creator_id: creatorId,
        tier_id: tiers.id,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }, {
        onConflict: 'subscriber_id,creator_id,status'
      })
      .select()
      .single()
    
    if (subError) {
      console.error('❌ Error creating subscription:', subError.message)
    } else {
      console.log('✅ Created subscription:', {
        id: subscription.id,
        subscriber_id: subscription.subscriber_id,
        creator_id: subscription.creator_id,
        tier: tiers.tier_name,
        status: subscription.status
      })
    }
    
    // Verify subscription exists
    const { data: allSubs } = await supabase
      .from('creator_subscriptions')
      .select('*, creator:profiles!creator_id(name), subscriber:profiles!subscriber_id(name, email)')
      .eq('status', 'active')
    
    console.log('\n📊 Active subscriptions:', allSubs?.length || 0)
    allSubs?.forEach(sub => {
      console.log(`  - ${sub.subscriber?.email || sub.subscriber?.name || 'Unknown fan'} → ${sub.creator?.name || 'Unknown creator'}`)
    })
    
  } catch (error) {
    console.error('❌ Error setting up subscription system:', error)
  }
}

createSubscriptionSystem().catch(console.error)