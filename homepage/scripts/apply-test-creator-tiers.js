const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyTestCreatorTiers() {
  console.log('🚀 Applying test creator subscription tiers...');
  
  const testCreatorId = '0f3753a3-029c-473a-9aee-fc107d10c569';
  
  try {
    // First ensure the test creator profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', testCreatorId)
      .single();
    
    if (!existingProfile) {
      console.log('Creating test creator profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: testCreatorId,
          email: 'testcreator@annpale.test',
          name: 'Test Creator',
          display_name: 'Test Creator',
          bio: 'Test creator account for E2E testing',
          role: 'creator',
          stripe_account_id: 'acct_1S3TOyEM4K7HiodW',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
        console.error('Error creating profile:', profileError);
        return;
      }
    } else {
      // Update Stripe account ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          stripe_account_id: 'acct_1S3TOyEM4K7HiodW'
        })
        .eq('id', testCreatorId);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
      }
    }
    
    // Add subscription tiers
    const tiers = [
      {
        creator_id: testCreatorId,
        tier_name: 'Gold Tier',
        description: 'Premium subscription tier for testing',
        price: 9.99,
        benefits: ["Access to exclusive content", "Monthly video messages", "Priority support", "Behind-the-scenes access"],
        tier_type: 'premium',
        is_active: true
      },
      {
        creator_id: testCreatorId,
        tier_name: 'Silver Tier',
        description: 'Standard subscription tier for testing',
        price: 4.99,
        benefits: ["Access to exclusive content", "Community access", "Monthly updates"],
        tier_type: 'basic',
        is_active: true
      },
      {
        creator_id: testCreatorId,
        tier_name: 'Platinum Tier',
        description: 'VIP subscription tier for testing',
        price: 19.99,
        benefits: ["Everything in Gold Tier", "Weekly video calls", "Personal shoutouts", "VIP community access", "Early access to new content"],
        tier_type: 'vip',
        is_active: true
      }
    ];
    
    for (const tier of tiers) {
      console.log(`Adding ${tier.tier_name}...`);
      
      // Check if tier already exists
      const { data: existingTier } = await supabase
        .from('creator_subscription_tiers')
        .select('id')
        .eq('creator_id', tier.creator_id)
        .eq('tier_name', tier.tier_name)
        .single();
      
      if (existingTier) {
        // Update existing tier
        const { error } = await supabase
          .from('creator_subscription_tiers')
          .update({
            description: tier.description,
            price: tier.price,
            benefits: tier.benefits,
            tier_type: tier.tier_type,
            is_active: tier.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingTier.id);
        
        if (error) {
          console.error(`Error updating ${tier.tier_name}:`, error);
        } else {
          console.log(`✅ Updated ${tier.tier_name}`);
        }
      } else {
        // Insert new tier
        const { error } = await supabase
          .from('creator_subscription_tiers')
          .insert({
            ...tier,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error(`Error inserting ${tier.tier_name}:`, error);
        } else {
          console.log(`✅ Created ${tier.tier_name}`);
        }
      }
    }
    
    // Verify the tiers were created
    const { data: createdTiers, error: verifyError } = await supabase
      .from('creator_subscription_tiers')
      .select('tier_name, price')
      .eq('creator_id', testCreatorId)
      .eq('is_active', true)
      .order('price');
    
    if (verifyError) {
      console.error('Error verifying tiers:', verifyError);
    } else {
      console.log('\n✅ Test creator tiers configured:');
      createdTiers.forEach(tier => {
        console.log(`   - ${tier.tier_name}: $${tier.price}`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

applyTestCreatorTiers().then(() => {
  console.log('\n✅ Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});