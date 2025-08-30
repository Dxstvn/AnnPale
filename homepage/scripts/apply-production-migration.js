#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Production Supabase credentials from environment
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
  }
})

async function applyProductionMigration() {
  console.log('🚀 Applying OAuth Fix to Production Database\n')
  console.log('=' .repeat(50))
  
  try {
    // Since we can't execute DDL directly through the JS client,
    // we'll use the Management API with the service role key
    
    console.log('⚠️  IMPORTANT: Direct SQL execution is limited through the JS client.')
    console.log('\n📝 To apply the migration to production, you have two options:\n')
    
    console.log('Option 1: Supabase Dashboard (Recommended)')
    console.log('─────────────────────────────────────────')
    console.log('1. Go to: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql')
    console.log('2. Copy the SQL from: supabase/fix_oauth_authentication.sql')
    console.log('3. Click "Run"\n')
    
    console.log('Option 2: Use psql Command Line')
    console.log('────────────────────────────────')
    console.log('Run this command (requires psql installed):')
    console.log(`
PGPASSWORD="REDACTED" psql \\
  -h aws-1-us-east-1.pooler.supabase.com \\
  -p 6543 \\
  -U postgres.yijizsscwkvepljqojkz \\
  -d postgres \\
  -f supabase/fix_oauth_authentication.sql
`)
    
    // Check current production status
    console.log('\n📊 Checking Production Database Status...')
    
    // Check if we can access profiles table
    const { data: profileCheck, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (profileError) {
      console.log('❌ Cannot access profiles table:', profileError.message)
      console.log('   This indicates RLS policies need to be updated.')
    } else {
      console.log('✅ Can access profiles table')
    }
    
    // Check for any users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (!usersError && users) {
      console.log(`✅ Found ${users.length} users in auth.users table`)
      
      // Check for profiles
      const userIds = users.map(u => u.id)
      const { data: profiles, error: profError } = await supabase
        .from('profiles')
        .select('id')
        .in('id', userIds)
      
      if (!profError && profiles) {
        const missingProfiles = users.length - profiles.length
        if (missingProfiles > 0) {
          console.log(`⚠️  ${missingProfiles} users are missing profiles`)
          console.log('   The migration will create these automatically.')
        } else {
          console.log('✅ All users have profiles')
        }
      }
    }
    
    console.log('\n' + '=' .repeat(50))
    console.log('\n🎯 Summary:')
    console.log('The OAuth fix migration needs to be applied to production.')
    console.log('This will:')
    console.log('  • Update RLS policies for the profiles table')
    console.log('  • Create a trigger for automatic profile creation')
    console.log('  • Ensure OAuth users get profiles created automatically')
    console.log('\nPlease use one of the options above to apply the migration.')
    
    console.log('\n💡 After applying the migration:')
    console.log('1. Configure OAuth providers in Supabase Dashboard')
    console.log('2. Set redirect URLs for production')
    console.log('3. Test OAuth login at https://www.annpale.com/login')
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

applyProductionMigration().catch(console.error)