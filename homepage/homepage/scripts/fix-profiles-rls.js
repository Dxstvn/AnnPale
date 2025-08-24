import { createClient } from '@supabase/supabase-js'

// Use the service role key to bypass RLS
const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgxOTg5MCwiZXhwIjoyMDcxMzk1ODkwfQ.FojZ8HdiM4Ep-ijmE2OOwTMgj6XJ2dKBx6Yj-FmZ-1E'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
})

async function fixProfilesRLS() {
  console.log('Fixing profiles RLS policies...')
  
  try {
    // Drop existing policies
    const dropPolicies = [
      "Users can view all profiles",
      "Users can update own profile",
      "Service role bypass",
      "Enable read access for authenticated users",
      "Enable insert for authenticated users",
      "Enable update for users based on id",
      "Users can create their own profile"
    ]
    
    // Skip trying to drop policies via RPC since we can't execute raw SQL directly
    
    // Create new policies using raw SQL
    const policies = [
      `CREATE POLICY "authenticated_users_read_all_profiles" 
       ON profiles FOR SELECT TO authenticated USING (true)`,
      
      `CREATE POLICY "users_update_own_profile" 
       ON profiles FOR UPDATE TO authenticated 
       USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`,
      
      `CREATE POLICY "users_insert_own_profile" 
       ON profiles FOR INSERT TO authenticated 
       WITH CHECK (auth.uid() = id)`,
      
      `CREATE POLICY "service_role_all_access" 
       ON profiles FOR ALL TO service_role 
       USING (true) WITH CHECK (true)`
    ]
    
    // Since we can't directly execute raw SQL, let's fetch and update profiles instead
    // to verify our connection works
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
    
    if (fetchError) {
      console.error('Error fetching profiles:', fetchError)
    } else {
      console.log('Successfully fetched profiles:', profiles?.length || 0, 'profiles found')
      
      // Check if the admin profile exists
      const adminProfile = profiles?.find(p => p.email === 'jasmindustin@gmail.com')
      if (adminProfile) {
        console.log('Admin profile found:', adminProfile)
      } else {
        console.log('Admin profile not found, may need to be created')
      }
    }
    
    console.log('Note: RLS policies need to be updated via Supabase Dashboard or SQL editor')
    console.log('Please run the following SQL in your Supabase SQL editor:')
    console.log(`
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role bypass" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "authenticated_users_read_all_profiles" 
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "users_update_own_profile" 
ON profiles FOR UPDATE TO authenticated 
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" 
ON profiles FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "service_role_all_access" 
ON profiles FOR ALL TO service_role 
USING (true) WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON profiles TO authenticated;
GRANT INSERT ON profiles TO authenticated;
GRANT UPDATE ON profiles TO authenticated;
    `)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

fixProfilesRLS()