const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkAuthIssue() {
  console.log('Checking OAuth authentication issue...\n');

  // 1. Check auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error fetching auth users:', authError);
  } else {
    console.log(`Total auth.users: ${authUsers.users.length}`);
    const googleUsers = authUsers.users.filter(u => 
      u.app_metadata.provider === 'google' || 
      u.user_metadata.provider === 'google'
    );
    console.log(`Google OAuth users: ${googleUsers.length}`);
    
    if (googleUsers.length > 0) {
      console.log('\nGoogle users found:');
      googleUsers.forEach(u => {
        console.log(`  - ${u.email} (ID: ${u.id})`);
      });
    }
  }

  // 2. Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');
  
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
  } else {
    console.log(`\nTotal profiles: ${profiles.length}`);
    
    if (authUsers && profiles) {
      // Check for missing profiles
      const authUserIds = authUsers.users.map(u => u.id);
      const profileIds = profiles.map(p => p.id);
      const missingProfiles = authUserIds.filter(id => !profileIds.includes(id));
      
      if (missingProfiles.length > 0) {
        console.log(`\n⚠️  Found ${missingProfiles.length} auth users WITHOUT profiles!`);
        const missingUsers = authUsers.users.filter(u => missingProfiles.includes(u.id));
        missingUsers.forEach(u => {
          console.log(`  - ${u.email} (ID: ${u.id})`);
        });
        
        console.log('\nThis is likely causing the "Database error saving new user" issue.');
        console.log('The OAuth process finds an existing auth.user but no profile.');
      } else {
        console.log('\n✅ All auth users have corresponding profiles');
      }
    }
  }

  // 3. Test if we can manually create a profile
  console.log('\n--- Testing manual profile creation ---');
  const testId = 'test-' + Date.now();
  
  const { error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: '00000000-0000-0000-0000-000000000000',
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      role: 'fan',
      email_verified: true
    });
  
  if (insertError) {
    console.log('❌ Manual insert failed:', insertError.message);
    console.log('   This might indicate a permissions or constraint issue.');
  } else {
    console.log('✅ Manual insert would work (rolled back)');
  }

  process.exit(0);
}

checkAuthIssue().catch(console.error);