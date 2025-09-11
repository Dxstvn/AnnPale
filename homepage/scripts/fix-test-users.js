const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTestUsers() {
  console.log('🔧 Fixing test user roles and IDs...\n');

  // Fix testcreator@annpale.test to have creator role
  const { data: testCreator, error: creatorError } = await supabase
    .from('profiles')
    .update({ 
      user_role: 'creator',
      display_name: 'Test Creator',
      bio: 'Test creator account for E2E testing',
      price: 50,
      response_time: '24 hours',
      categories: ['Music', 'Entertainment']
    })
    .eq('email', 'testcreator@annpale.test')
    .select()
    .single();

  if (creatorError) {
    console.error('❌ Failed to update testcreator role:', creatorError);
  } else {
    console.log('✅ Fixed testcreator@annpale.test to have creator role');
    
    // Ensure creator_stats exists
    const { data: stats } = await supabase
      .from('creator_stats')
      .select('creator_id')
      .eq('creator_id', testCreator.id)
      .single();

    if (!stats) {
      const { error: statsError } = await supabase
        .from('creator_stats')
        .insert({
          creator_id: testCreator.id,
          total_earnings: 0,
          total_orders: 0,
          pending_orders: 0,
          completed_orders: 0,
          average_rating: 0,
          completion_rate: 0
        });

      if (statsError) {
        console.log('  ⚠️  Could not create creator_stats:', statsError.message);
      } else {
        console.log('  ✅ Creator stats initialized');
      }
    }
  }

  // Update Wyclef Jean's ID to be '1' (numeric string)
  // First check if he exists
  const { data: wyclef } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('email', 'wyclef.jean@annpale.demo')
    .single();

  if (wyclef) {
    console.log(`\nWyclef Jean current ID: ${wyclef.id}`);
    console.log('Note: We use his UUID (${wyclef.id}) in tests, not "1"');
    
    // Update him to be a creator with proper pricing
    const { error: wyclefError } = await supabase
      .from('profiles')
      .update({
        user_role: 'creator',
        price: 150,
        rush_price: 75,
        response_time: '48 hours',
        categories: ['Music', 'Hip Hop', 'Inspirational']
      })
      .eq('id', wyclef.id);

    if (wyclefError) {
      console.error('❌ Failed to update Wyclef:', wyclefError);
    } else {
      console.log('✅ Updated Wyclef Jean to creator with proper pricing');
      
      // Ensure creator_stats exists
      const { data: wyclefStats } = await supabase
        .from('creator_stats')
        .select('creator_id')
        .eq('creator_id', wyclef.id)
        .single();

      if (!wyclefStats) {
        const { error: statsError } = await supabase
          .from('creator_stats')
          .insert({
            creator_id: wyclef.id,
            total_earnings: 0,
            total_orders: 0,
            pending_orders: 0,
            completed_orders: 0,
            average_rating: 0,
            completion_rate: 0
          });

        if (statsError) {
          console.log('  ⚠️  Could not create creator_stats for Wyclef:', statsError.message);
        } else {
          console.log('  ✅ Creator stats initialized for Wyclef');
        }
      }
    }
  }

  // Verify all test users
  console.log('\n📊 Final Verification:');
  
  const testUsers = [
    'testfan@annpale.test',
    'testcreator@annpale.test',
    'testadmin@annpale.test',
    'wyclef.jean@annpale.demo'
  ];

  for (const email of testUsers) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, user_role, display_name, price')
      .eq('email', email)
      .single();

    if (profile) {
      console.log(`✅ ${profile.user_role}: ${profile.email}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Name: ${profile.display_name || 'No name'}`);
      if (profile.user_role === 'creator' && profile.price) {
        console.log(`   Price: $${profile.price}`);
      }
    } else {
      console.log(`❌ Missing: ${email}`);
    }
  }

  console.log('\n✨ Test user fixes complete!');
}

fixTestUsers().catch(console.error);