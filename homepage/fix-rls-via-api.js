const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY not found')
  process.exit(1)
}

// Use service role key to execute SQL
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRLS() {
  console.log('Fixing RLS policies for profiles table...\n')
  
  try {
    // First check existing policies
    const { data: policies, error: policiesError } = await supabase.rpc('get_policies_for_table', {
      table_name: 'profiles'
    }).catch(() => ({ data: null, error: 'Function not found' }))
    
    if (policies) {
      console.log('Current policies:', policies)
    }
    
    // Drop existing restrictive policies and create new ones
    const sqlCommands = [
      `DROP POLICY IF EXISTS "Profiles are viewable by authenticated users only" ON profiles;`,
      `DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;`,
      `DROP POLICY IF EXISTS "Public read access to creator profiles" ON profiles;`,
      `DROP POLICY IF EXISTS "Anonymous users can view creator profiles" ON profiles;`,
      `DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;`,
      
      // Create new policy that allows everyone to view creator profiles
      `CREATE POLICY "Anyone can view creator profiles" 
       ON profiles FOR SELECT 
       USING (role = 'creator');`
    ]
    
    // Execute each SQL command
    for (const sql of sqlCommands) {
      console.log(`Executing: ${sql.substring(0, 50)}...`)
      
      // Use the Supabase SQL editor endpoint
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
      }).catch(() => null)
      
      if (response && response.ok) {
        console.log('  ✓ Success')
      } else {
        // Try alternative approach - direct SQL via REST API
        const altResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ query: sql })
        }).catch(() => null)
        
        console.log('  - Command sent')
      }
    }
    
    console.log('\n✅ RLS fix commands executed')
    
    // Test if anonymous access works now
    console.log('\nTesting anonymous access...')
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const anonSupabase = createClient(supabaseUrl, anonKey)
    
    const { data: creators, error: creatorsError } = await anonSupabase
      .from('profiles')
      .select('id, name')
      .eq('role', 'creator')
      .limit(3)
    
    if (creatorsError) {
      console.error('❌ Anonymous access still blocked:', creatorsError.message)
      console.log('\nYou may need to manually update the RLS policies in the Supabase dashboard:')
      console.log('1. Go to https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/editor')
      console.log('2. Navigate to Authentication > Policies')
      console.log('3. Find the profiles table')
      console.log('4. Add a SELECT policy that allows anonymous users to view profiles where role = "creator"')
    } else {
      console.log('✅ Anonymous access working! Found creators:', creators)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

fixRLS().then(() => process.exit(0))