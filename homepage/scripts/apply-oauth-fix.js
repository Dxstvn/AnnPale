#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Use service role key for admin operations
const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgxOTg5MCwiZXhwIjoyMDcxMzk1ODkwfQ.FojZ8HdiM4Ep-ijmE2OOwTMgj6XJ2dKBx6Yj-FmZ-1E'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  console.log('🚀 Starting OAuth authentication fix...\n')
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'fix_oauth_authentication.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Split SQL into individual statements (basic split, might need refinement)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)
    
    // Note: Supabase JS client doesn't support raw SQL execution directly
    // We'll need to use the REST API or connect via pg library
    
    console.log('⚠️  Direct SQL execution via Supabase JS client is limited.')
    console.log('   Please run the following SQL in Supabase SQL Editor:\n')
    console.log('   1. Go to: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql')
    console.log('   2. Copy and paste the contents of: supabase/fix_oauth_authentication.sql')
    console.log('   3. Click "Run"\n')
    
    // However, we can still check and create missing profiles programmatically
    console.log('📊 Checking for users without profiles...')
    
    // Get all auth users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }
    
    console.log(`   Found ${users.length} total users`)
    
    // Check which users don't have profiles
    const userIds = users.map(u => u.id)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .in('id', userIds)
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return
    }
    
    const profileIds = new Set(profiles.map(p => p.id))
    const usersWithoutProfiles = users.filter(u => !profileIds.has(u.id))
    
    console.log(`   Found ${usersWithoutProfiles.length} users without profiles`)
    
    if (usersWithoutProfiles.length > 0) {
      console.log('\n🔧 Creating missing profiles...')
      
      for (const user of usersWithoutProfiles) {
        const profileData = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 
                user.user_metadata?.name || 
                user.email?.split('@')[0] || 
                'User',
          role: ['jasmindustin@gmail.com', 'loicjasmin@gmail.com'].includes(user.email) 
                ? 'admin' 
                : 'fan',
          avatar_url: user.user_metadata?.avatar_url || 
                      user.user_metadata?.picture || 
                      null,
          email_verified: user.email_confirmed_at !== null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)
        
        if (insertError) {
          console.error(`   ❌ Failed to create profile for ${user.email}:`, insertError.message)
        } else {
          console.log(`   ✅ Created profile for ${user.email}`)
        }
      }
    }
    
    console.log('\n✨ OAuth fix process completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Run the SQL migration in Supabase SQL Editor')
    console.log('2. Configure OAuth providers in Supabase Dashboard:')
    console.log('   - Go to Authentication > Providers')
    console.log('   - Enable Google and Twitter')
    console.log('   - Add OAuth credentials')
    console.log('3. Set redirect URLs in Authentication > URL Configuration:')
    console.log('   - Site URL: https://www.annpale.com')
    console.log('   - Redirect URLs: https://www.annpale.com/auth/callback')
    console.log('4. Test OAuth login at: http://localhost:3000/login')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

applyMigration().catch(console.error)