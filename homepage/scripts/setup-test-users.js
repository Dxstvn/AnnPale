const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  {
    email: 'testfan@annpale.test',
    password: 'testpassword123',
    role: 'fan',
    display_name: 'Test Fan User',
    bio: 'Test fan account for E2E testing'
  },
  {
    email: 'testcreator@annpale.test',
    password: 'testpassword123',
    role: 'creator',
    display_name: 'Test Creator',
    bio: 'Test creator account for E2E testing',
    price: 50,
    response_time: '24 hours',
    categories: ['Music', 'Entertainment']
  },
  {
    email: 'testadmin@annpale.test',
    password: 'testpassword123',
    role: 'admin',
    display_name: 'Test Admin',
    bio: 'Test admin account for E2E testing'
  }
];

async function setupTestUsers() {
  console.log('🔧 Setting up test users for E2E testing...\n');

  for (const userData of testUsers) {
    const { email, password, role, display_name, bio, price, response_time, categories } = userData;
    
    console.log(`\n📝 Processing ${role}: ${email}`);

    try {
      // Check if user exists in profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email, user_role')
        .eq('email', email)
        .single();

      if (existingProfile) {
        console.log(`  ✅ User already exists with ID: ${existingProfile.id}`);
        
        // Update profile to ensure correct role and data
        const updateData = {
          user_role: role,
          display_name,
          bio,
          ...(role === 'creator' && { price, response_time, categories })
        };

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', existingProfile.id);

        if (updateError) {
          console.log(`  ⚠️  Could not update profile: ${updateError.message}`);
        } else {
          console.log(`  ✅ Profile updated with correct role and data`);
        }

        // If creator, ensure creator_stats entry exists
        if (role === 'creator') {
          const { data: stats } = await supabase
            .from('creator_stats')
            .select('creator_id')
            .eq('creator_id', existingProfile.id)
            .single();

          if (!stats) {
            const { error: statsError } = await supabase
              .from('creator_stats')
              .insert({
                creator_id: existingProfile.id,
                total_earnings: 0,
                total_orders: 0,
                pending_orders: 0,
                completed_orders: 0,
                average_rating: 0,
                completion_rate: 0
              });

            if (statsError) {
              console.log(`  ⚠️  Could not create creator_stats: ${statsError.message}`);
            } else {
              console.log(`  ✅ Creator stats initialized`);
            }
          }
        }
        continue;
      }

      // User doesn't exist, create it
      console.log(`  🆕 Creating new user...`);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) {
        console.log(`  ❌ Failed to create auth user: ${authError.message}`);
        continue;
      }

      console.log(`  ✅ Auth user created with ID: ${authData.user.id}`);

      // Create/update profile
      const profileData = {
        id: authData.user.id,
        email,
        user_role: role,
        display_name,
        bio,
        ...(role === 'creator' && { price, response_time, categories }),
        created_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.log(`  ❌ Failed to create profile: ${profileError.message}`);
        continue;
      }

      console.log(`  ✅ Profile created`);

      // Initialize creator stats if creator
      if (role === 'creator') {
        const { error: statsError } = await supabase
          .from('creator_stats')
          .insert({
            creator_id: authData.user.id,
            total_earnings: 0,
            total_orders: 0,
            pending_orders: 0,
            completed_orders: 0,
            average_rating: 0,
            completion_rate: 0
          });

        if (statsError) {
          console.log(`  ⚠️  Could not create creator_stats: ${statsError.message}`);
        } else {
          console.log(`  ✅ Creator stats initialized`);
        }
      }

    } catch (error) {
      console.log(`  ❌ Error processing user: ${error.message}`);
    }
  }

  // Verify all users exist
  console.log('\n\n📊 Final Verification:');
  for (const userData of testUsers) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, user_role, display_name')
      .eq('email', userData.email)
      .single();

    if (profile) {
      console.log(`✅ ${profile.user_role}: ${profile.email} (${profile.id})`);
    } else {
      console.log(`❌ Missing: ${userData.email}`);
    }
  }

  console.log('\n✨ Test user setup complete!');
}

setupTestUsers().catch(console.error);