const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createOrUpdateAuthUsers() {
  console.log('🔐 Creating/updating auth users...\n');

  const testUsers = [
    {
      email: 'testfan@annpale.test',
      password: 'TestPassword123!',
      role: 'fan',
      display_name: 'Test Fan User'
    },
    {
      email: 'testcreator@annpale.test',
      password: 'TestPassword123!',
      role: 'creator',
      display_name: 'Test Creator'
    },
    {
      email: 'testadmin@annpale.test',
      password: 'TestPassword123!',
      role: 'admin',
      display_name: 'Test Admin'
    }
  ];

  for (const userData of testUsers) {
    const { email, password, role, display_name } = userData;
    console.log(`\n📧 Processing ${email}...`);

    try {
      // First check if user exists in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profile) {
        console.log(`  Profile exists with ID: ${profile.id}`);
        
        // Try to update the auth user's password
        const { data: authUser, error: updateError } = await supabase.auth.admin.updateUserById(
          profile.id,
          { password }
        );

        if (updateError) {
          console.log(`  ⚠️  Could not update password: ${updateError.message}`);
          
          // If user doesn't exist in auth, create them
          if (updateError.message.includes('User not found')) {
            console.log('  Creating auth user...');
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: { display_name, role }
            });

            if (createError) {
              console.error(`  ❌ Failed to create auth user: ${createError.message}`);
            } else {
              console.log(`  ✅ Auth user created with ID: ${newUser.user.id}`);
            }
          }
        } else {
          console.log(`  ✅ Password updated successfully`);
        }
      } else {
        // No profile exists, create both auth user and profile
        console.log('  Creating new auth user and profile...');
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { display_name, role }
        });

        if (createError) {
          console.error(`  ❌ Failed to create auth user: ${createError.message}`);
        } else {
          console.log(`  ✅ Auth user created with ID: ${newUser.user.id}`);
          
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: newUser.user.id,
              email,
              user_role: role,
              display_name,
              bio: `${role} account for E2E testing`
            });

          if (profileError) {
            console.error(`  ❌ Failed to create profile: ${profileError.message}`);
          } else {
            console.log(`  ✅ Profile created`);
          }
        }
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  // Test login for each user
  console.log('\n\n🔑 Testing logins...');
  
  const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  for (const userData of testUsers) {
    const { email, password } = userData;
    
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error(`❌ ${email}: Login failed - ${error.message}`);
    } else {
      console.log(`✅ ${email}: Login successful`);
      await supabaseAnon.auth.signOut();
    }
  }

  console.log('\n✨ Done!');
}

createOrUpdateAuthUsers().catch(console.error);