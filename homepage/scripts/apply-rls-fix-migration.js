const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create the SQL content
const sqlContent = `
-- Fix infinite recursion in profiles RLS policies
BEGIN;

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
DROP POLICY IF EXISTS "authenticated_read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_delete_own_profile" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies that avoid recursion
CREATE POLICY "anyone_can_read_profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "users_insert_own_profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete_own_profile"
ON profiles FOR DELETE
USING (auth.uid() = id);

COMMIT;

-- Verify the policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
`;

// Write to temporary file
const tempFile = path.join(__dirname, 'temp_rls_fix.sql');
fs.writeFileSync(tempFile, sqlContent);

console.log('Applying RLS fix to production database...\n');

try {
  // Use psql command with the connection string
  const command = `PGPASSWORD=EhvPKtjRDjattpdq psql -h aws-1-us-east-1.pooler.supabase.com -U postgres.yijizsscwkvepljqojkz -d postgres -p 6543 -f ${tempFile}`;
  
  console.log('Executing SQL migration...');
  const output = execSync(command, { encoding: 'utf8' });
  console.log(output);
  console.log('\n✅ RLS fix applied successfully!');
  
} catch (error) {
  console.error('Error applying migration:', error.message);
  console.log('\nTrying alternative approach...');
  
  // Try using echo and pipe
  try {
    const altCommand = `echo "${sqlContent.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" | PGPASSWORD=EhvPKtjRDjattpdq psql -h aws-1-us-east-1.pooler.supabase.com -U postgres.yijizsscwkvepljqojkz -d postgres -p 6543`;
    const output = execSync(altCommand, { encoding: 'utf8', shell: '/bin/bash' });
    console.log(output);
    console.log('\n✅ RLS fix applied successfully via alternative method!');
  } catch (altError) {
    console.error('Alternative approach also failed:', altError.message);
  }
} finally {
  // Clean up temp file
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}

process.exit(0);