const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY environment variable is not set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCreators() {
  console.log('Checking creators in database...\n')
  
  // First check all profiles
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('id, name, email, role, is_demo_account, created_at')
    .order('created_at', { ascending: false })
  
  if (allError) {
    console.error('Error fetching all profiles:', allError)
  } else {
    console.log(`Total profiles in database: ${allProfiles?.length || 0}`)
    if (allProfiles && allProfiles.length > 0) {
      const creators = allProfiles.filter(p => p.role === 'creator')
      const fans = allProfiles.filter(p => p.role === 'fan')
      console.log(`  - Creators: ${creators.length}`)
      console.log(`  - Fans: ${fans.length}`)
      console.log(`  - Others: ${allProfiles.length - creators.length - fans.length}\n`)
    }
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, is_demo_account, created_at')
    .eq('role', 'creator')
    .order('created_at', { ascending: false })
    .limit(25)
  
  if (error) {
    console.error('Error fetching creators:', error)
    return
  }
  
  console.log(`Found ${data.length} creators:\n`)
  
  // Group by demo vs non-demo
  const demoCreators = data.filter(c => c.is_demo_account)
  const nonDemoCreators = data.filter(c => !c.is_demo_account)
  
  console.log(`Demo creators (${demoCreators.length}):`)
  demoCreators.forEach(c => {
    console.log(`  - ${c.name} (${c.email}) - Created: ${new Date(c.created_at).toLocaleDateString()}`)
  })
  
  console.log(`\nNon-demo creators (${nonDemoCreators.length}):`)
  nonDemoCreators.forEach(c => {
    console.log(`  - ${c.name} (${c.email}) - Created: ${new Date(c.created_at).toLocaleDateString()}`)
  })
  
  // Check for test accounts
  const testAccounts = data.filter(c => 
    c.email.includes('test') || 
    c.email.includes('example.com') ||
    c.name.includes('Test')
  )
  
  if (testAccounts.length > 0) {
    console.log(`\n⚠️  Found ${testAccounts.length} test accounts:`)
    testAccounts.forEach(c => {
      console.log(`  - ${c.name} (${c.email}) - ID: ${c.id}`)
    })
  }
}

checkCreators().then(() => process.exit(0))