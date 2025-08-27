// Script to apply the profile insert policy fix to Supabase
// Run with: node scripts/apply-profile-fix.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyProfileFix() {
  console.log('Applying profile insert policy fix...')
  
  const migration = `
    -- Fix profiles table INSERT policy to allow new users to create their profiles
    
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
    
    -- Enable RLS on profiles table if not already enabled
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policy to allow authenticated users to insert their own profile
    CREATE POLICY "Users can create their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
      -- User can only create a profile for their own user ID
      auth.uid() = id
    );
    
    -- Ensure service role can manage profiles
    DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
    CREATE POLICY "Service role can manage all profiles"
    ON public.profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  `
  
  try {
    // Use service role to execute SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migration
    }).single()
    
    if (error) {
      // If RPC doesn't exist, show instructions
      console.log('\n❗ Cannot apply migration automatically.')
      console.log('\n📋 Please run this SQL in your Supabase SQL Editor:')
      console.log('----------------------------------------')
      console.log(migration)
      console.log('----------------------------------------')
      console.log('\nOr go to: https://supabase.com/dashboard/project/_/sql/new')
    } else {
      console.log('✅ Profile insert policy fix applied successfully!')
    }
  } catch (err) {
    console.log('\n📋 Please run this SQL in your Supabase SQL Editor:')
    console.log('----------------------------------------')
    console.log(migration)
    console.log('----------------------------------------')
    console.log('\nGo to: https://supabase.com/dashboard/project/_/sql/new')
  }
  
  // Test if profiles table is accessible
  console.log('\n🔍 Testing profiles table access...')
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)
  
  if (profileError) {
    console.error('❌ Error accessing profiles table:', profileError.message)
  } else {
    console.log('✅ Profiles table is accessible')
  }
}

applyProfileFix().catch(console.error)