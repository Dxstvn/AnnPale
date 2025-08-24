const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

async function checkAdminUser() {
  console.log('Checking user jasmindustin@gmail.com...\n');
  
  // Check by email
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'jasmindustin@gmail.com');
  
  if (error) {
    console.error('Error fetching profile:', error);
    return;
  }
  
  if (profiles && profiles.length > 0) {
    console.log('Found profiles for jasmindustin@gmail.com:');
    profiles.forEach(profile => {
      console.log('\nProfile:');
      console.log('  ID:', profile.id);
      console.log('  Email:', profile.email);
      console.log('  Name:', profile.name);
      console.log('  Role:', profile.role);
      console.log('  Created:', profile.created_at);
    });
    
    // Ensure admin role
    const needsUpdate = profiles.filter(p => p.role !== 'admin');
    if (needsUpdate.length > 0) {
      console.log('\nUpdating role to admin...');
      for (const profile of needsUpdate) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', profile.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
        } else {
          console.log('✓ Updated profile', profile.id, 'to admin role');
        }
      }
    } else {
      console.log('\n✓ User already has admin role');
    }
  } else {
    console.log('No profile found for jasmindustin@gmail.com');
  }
  
  process.exit(0);
}

checkAdminUser();