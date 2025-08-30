#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Use service role key for admin operations from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('Please ensure your .env.local file contains these variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

// Since we can't execute raw SQL directly through Supabase JS client,
// we'll use the REST API with the service role key
async function executeSQL(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: sql })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SQL execution failed: ${error}`)
  }
  
  return response.json()
}

async function applyMigration() {
  console.log('🚀 Applying OAuth Authentication Fix Migration\n')
  console.log('=' .repeat(50))
  
  try {
    // Since we can't execute raw SQL directly, let's use programmatic approach
    
    // Step 1: Check and update RLS policies
    console.log('\n📋 Step 1: Checking RLS policies...')
    
    // We can't directly execute DDL through the JS client, so we'll check what we can
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (profileError && profileError.message.includes('row-level security')) {
      console.log('   ❌ RLS is blocking access to profiles table')
    } else {
      console.log('   ✅ Can access profiles table')
    }
    
    // Step 2: Check for users without profiles
    console.log('\n📋 Step 2: Checking for users without profiles...')
    
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('   ❌ Error fetching users:', usersError.message)
      return
    }
    
    console.log(`   Found ${users.length} total users`)
    
    // Get existing profiles
    const userIds = users.map(u => u.id)
    const { data: existingProfiles, error: existingError } = await supabase
      .from('profiles')
      .select('id')
      .in('id', userIds)
    
    if (existingError) {
      console.log('   ⚠️  Could not fetch existing profiles:', existingError.message)
      console.log('   Will attempt to create profiles for all users...')
    }
    
    const existingIds = new Set((existingProfiles || []).map(p => p.id))
    const usersNeedingProfiles = users.filter(u => !existingIds.has(u.id))
    
    console.log(`   Found ${usersNeedingProfiles.length} users without profiles`)
    
    // Step 3: Create missing profiles
    if (usersNeedingProfiles.length > 0) {
      console.log('\n📋 Step 3: Creating missing profiles...')
      
      for (const user of usersNeedingProfiles) {
        const isAdmin = ['jasmindustin@gmail.com', 'loicjasmin@gmail.com'].includes(user.email || '')
        
        const profileData = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 
                user.user_metadata?.name || 
                user.user_metadata?.user_name ||
                user.email?.split('@')[0] || 
                'User',
          role: isAdmin ? 'admin' : 'fan',
          avatar_url: user.user_metadata?.avatar_url || 
                      user.user_metadata?.picture || 
                      user.user_metadata?.profile_image_url_https ||
                      user.user_metadata?.profile_image_url ||
                      null,
          email_verified: user.email_confirmed_at !== null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' })
        
        if (insertError) {
          console.error(`   ❌ Failed to create profile for ${user.email}:`, insertError.message)
        } else {
          console.log(`   ✅ Created/updated profile for ${user.email} (role: ${profileData.role})`)
        }
      }
    } else {
      console.log('\n✅ All users already have profiles!')
    }
    
    // Step 4: Provide instructions for manual SQL execution
    console.log('\n' + '=' .repeat(50))
    console.log('\n📝 IMPORTANT: Manual Steps Required\n')
    console.log('The RLS policies and trigger function need to be created manually.')
    console.log('\n1. Go to Supabase SQL Editor:')
    console.log('   https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql\n')
    console.log('2. Copy and run the following SQL:\n')
    
    // Read and display the key parts of the SQL
    const sqlPath = path.join(__dirname, '..', 'supabase', 'fix_oauth_authentication.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Extract just the critical parts
    const criticalSQL = `
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Enable insert for authentication" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles;
DROP POLICY IF EXISTS "Users can only update own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create new policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
  ON profiles FOR DELETE 
  USING (auth.uid() = id);
`
    
    console.log('```sql')
    console.log(criticalSQL)
    console.log('```')
    
    console.log('\n3. Also run the trigger function from:')
    console.log('   supabase/fix_oauth_authentication.sql (lines 37-96)')
    
    console.log('\n✨ Profile creation completed!')
    console.log('   Please complete the manual SQL steps above.')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  }
}

applyMigration().catch(console.error)