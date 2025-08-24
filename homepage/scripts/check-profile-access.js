const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test with anon key (what middleware uses)
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfileAccess() {
  const userId = 'df123755-fd7d-46a1-b4aa-161a6f4eecdb';
  
  console.log('Testing profile access for user:', userId);
  console.log('');
  
  // Test with admin client
  console.log('1. Testing with SERVICE ROLE key:');
  const { data: adminData, error: adminError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (adminError) {
    console.log('   Error:', adminError.message);
  } else {
    console.log('   Success! Role:', adminData?.role);
  }
  
  console.log('');
  console.log('2. Testing with ANON key (no auth):');
  const { data: anonData, error: anonError } = await supabaseAnon
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (anonError) {
    console.log('   Error:', anonError.message);
    console.log('   This is expected if RLS is enabled and requires authentication');
  } else {
    console.log('   Success! Role:', anonData?.role);
  }
  
  console.log('');
  console.log('3. Checking RLS policies on profiles table...');
  
  const { data: policies, error: policyError } = await supabaseAdmin
    .rpc('get_policies_for_table', { table_name: 'profiles' });
  
  if (!policyError && policies) {
    console.log('   Found', policies.length, 'policies');
  }
  
  process.exit(0);
}

checkProfileAccess();