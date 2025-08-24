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

async function fixRLS() {
  console.log('Fixing RLS policies via Supabase service role...\n');

  const policies = [
    // Drop existing policies
    `DROP POLICY IF EXISTS "Users can view all profiles" ON profiles`,
    `DROP POLICY IF EXISTS "Users can read all profiles" ON profiles`,
    `DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles`,
    `DROP POLICY IF EXISTS "Users can insert own profile" ON profiles`,
    `DROP POLICY IF EXISTS "Users can update own profile" ON profiles`,
    `DROP POLICY IF EXISTS "Users can delete own profile" ON profiles`,
    `DROP POLICY IF EXISTS "Service role bypass" ON profiles`,
    `DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles`,
    `DROP POLICY IF EXISTS "Service role has full access" ON profiles`,
    `DROP POLICY IF EXISTS "Authenticated can read profiles" ON profiles`,
    
    // Create new policies
    `CREATE POLICY "authenticated_read_all_profiles" ON profiles FOR SELECT TO authenticated USING (true)`,
    `CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id)`,
    `CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`,
    `CREATE POLICY "users_delete_own_profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id)`
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const sql of policies) {
    const isDropPolicy = sql.includes('DROP POLICY');
    const policyName = sql.match(/POLICY "([^"]+)"/)?.[1] || 'unknown';
    
    console.log(`${isDropPolicy ? 'Dropping' : 'Creating'} policy: ${policyName}`);
    
    try {
      // Use rpc to execute raw SQL
      const { error } = await supabase.rpc('exec_sql', { 
        query: sql 
      });
      
      if (error) {
        // Try alternative approach - direct execution via Supabase management API
        // Since we can't directly execute DDL, we'll need to use the Supabase Dashboard
        console.log(`  ⚠ Cannot execute DDL directly via API`);
        errorCount++;
      } else {
        console.log(`  ✓ Success`);
        successCount++;
      }
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\nSummary: ${successCount} successful, ${errorCount} errors`);

  // Test if the fix worked
  console.log('\nTesting profile access...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .limit(1);

  if (error) {
    console.log('Error accessing profiles:', error.message);
    
    if (error.message.includes('infinite recursion')) {
      console.log('\n⚠️  RLS recursion issue still exists!');
      console.log('\nTo fix this, please:');
      console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/editor');
      console.log('2. Run the following SQL:');
      console.log('\n--- Copy and paste this SQL ---\n');
      console.log('-- First, temporarily disable RLS to clear all policies');
      console.log('ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;');
      console.log('');
      console.log('-- Drop all existing policies');
      policies.filter(p => p.includes('DROP')).forEach(p => console.log(p + ';'));
      console.log('');
      console.log('-- Re-enable RLS');
      console.log('ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;');
      console.log('');
      console.log('-- Create new policies');
      policies.filter(p => p.includes('CREATE')).forEach(p => console.log(p + ';'));
      console.log('\n--- End of SQL ---\n');
    }
  } else {
    console.log('✅ Profile access working! Found', data?.length || 0, 'profiles');
  }

  process.exit(0);
}

fixRLS();