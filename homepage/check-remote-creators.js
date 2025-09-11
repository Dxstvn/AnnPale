const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  process.exit(1)
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkRemoteCreators() {
  console.log('Checking REMOTE Supabase database for creators...\n')
  
  // Check all profiles without RLS restrictions
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('id, name, email, role, is_demo_account, created_at')
    .order('created_at', { ascending: false })
  
  if (allError) {
    console.error('Error fetching profiles:', allError)
    return
  }
  
  console.log(`Total profiles in REMOTE database: ${allProfiles?.length || 0}`)
  
  if (allProfiles && allProfiles.length > 0) {
    const creators = allProfiles.filter(p => p.role === 'creator')
    const fans = allProfiles.filter(p => p.role === 'fan')
    
    console.log(`  - Creators: ${creators.length}`)
    console.log(`  - Fans: ${fans.length}`)
    console.log(`  - Others: ${allProfiles.length - creators.length - fans.length}\n`)
    
    if (creators.length > 0) {
      console.log('Creators found:')
      creators.slice(0, 10).forEach(c => {
        console.log(`  - ${c.name} (${c.email}) - ID: ${c.id}`)
      })
      if (creators.length > 10) {
        console.log(`  ... and ${creators.length - 10} more`)
      }
    }
  }
}

checkRemoteCreators().then(() => process.exit(0))