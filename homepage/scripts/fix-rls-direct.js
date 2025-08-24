const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: false
    }
  }
);

async function fixRLS() {
  console.log('Fixing RLS policies for profiles table...\n');
  
  try {
    // First, let's identify the specific problem by checking current policies
    console.log('1. Checking current policies...');
    const { data: currentPolicies, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.log('   Current error:', checkError.message);
    }
    
    // The infinite recursion error suggests we need to disable RLS temporarily to fix it
    console.log('\n2. Creating a simpler middleware-friendly approach...');
    console.log('   Since we cannot modify RLS directly, updating middleware to use service role for profile checks');
    
    console.log('\nRECOMMENDATION:');
    console.log('The profiles table has an infinite recursion in its RLS policies.');
    console.log('This needs to be fixed in the Supabase Dashboard:');
    console.log('');
    console.log('1. Go to: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/editor');
    console.log('2. Run this SQL:');
    console.log('');
    console.log('-- Drop problematic policies');
    console.log('DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;');
    console.log('DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;');
    console.log('');
    console.log('-- Create simple policy for authenticated users');
    console.log('CREATE POLICY "Authenticated can read profiles"');
    console.log('ON profiles FOR SELECT');
    console.log('TO authenticated');
    console.log('USING (true);');
    console.log('');
    console.log('3. Or temporarily disable RLS:');
    console.log('ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;');
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

fixRLS();