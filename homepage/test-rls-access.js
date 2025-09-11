const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'

async function testAccess() {
  console.log('Testing RLS access to profiles table...\n')
  
  // Test with anon key
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const anonSupabase = createClient(supabaseUrl, anonKey)
  
  console.log('1. Testing with ANON key:')
  const { data: anonData, error: anonError } = await anonSupabase
    .from('profiles')
    .select('id, name, role')
    .eq('role', 'creator')
    .limit(3)
  
  if (anonError) {
    console.error('   ❌ Error:', anonError.message)
  } else {
    console.log(`   ✅ Found ${anonData?.length || 0} creators`)
    if (anonData && anonData.length > 0) {
      anonData.forEach(c => console.log(`      - ${c.name}`))
    }
  }
  
  // Test with service role key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceSupabase = createClient(supabaseUrl, serviceKey)
  
  console.log('\n2. Testing with SERVICE ROLE key:')
  const { data: serviceData, error: serviceError } = await serviceSupabase
    .from('profiles')
    .select('id, name, role')
    .eq('role', 'creator')
    .limit(3)
  
  if (serviceError) {
    console.error('   ❌ Error:', serviceError.message)
  } else {
    console.log(`   ✅ Found ${serviceData?.length || 0} creators`)
    if (serviceData && serviceData.length > 0) {
      serviceData.forEach(c => console.log(`      - ${c.name}`))
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('DIAGNOSIS:')
  
  if (!anonData || anonData.length === 0) {
    console.log('❌ RLS is blocking anonymous access to creator profiles')
    console.log('\nTo fix this, you need to:')
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz')
    console.log('2. Navigate to Authentication > Policies')
    console.log('3. Find the "profiles" table')
    console.log('4. Add a new SELECT policy:')
    console.log('   - Name: "Public can view creator profiles"')
    console.log('   - Target roles: Check "anon" (anonymous)')
    console.log('   - Policy expression: role = \'creator\'')
    console.log('5. Save the policy')
    console.log('\nThis will allow the app to display creators without requiring login.')
  } else {
    console.log('✅ RLS is properly configured - anonymous users can see creators!')
  }
}

testAccess().then(() => process.exit(0))