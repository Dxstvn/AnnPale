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

async function generateSQL() {
  console.log('Generate SQL to fix RLS issue:');
  console.log('=====================================\n');
  console.log('Copy and paste this SQL in Supabase Dashboard SQL Editor:');
  console.log('https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql/new\n');
  console.log('--- START SQL ---\n');
  
  const sql = `
-- Temporarily disable RLS to remove all policies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (safe to run even if they don't exist)
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
DROP POLICY IF EXISTS "Authenticated can read profiles" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Anyone can read profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
USING (auth.uid() = id);

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
`;

  console.log(sql);
  console.log('\n--- END SQL ---\n');
  console.log('After running this SQL, the RLS recursion issue should be fixed.');
  
  process.exit(0);
}

generateSQL();