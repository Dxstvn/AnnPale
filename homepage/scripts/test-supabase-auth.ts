import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env.development') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function runTests() {
  console.log('Environment check:')
  console.log('SUPABASE_URL:', supabaseUrl)
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey?.substring(0, 50) + '...')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration')
    process.exit(1)
  }

  // Test 1: Basic client creation
  console.log('\n1. Testing basic client creation...')
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✓ Client created successfully')
    
    // Test 2: Check if we can fetch the session (should be null)
    console.log('\n2. Testing session check...')
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('✗ Session check failed:', error.message)
    } else {
      console.log('✓ Session check successful (session:', session ? 'exists' : 'null', ')')
    }
    
    // Test 3: Test OAuth URL generation
    console.log('\n3. Testing OAuth URL generation...')
    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: 'http://localhost:3001/auth/callback'
      }
    })
    
    if (oauthError) {
      console.error('✗ OAuth URL generation failed:', oauthError.message)
    } else if (oauthData?.url) {
      console.log('✓ OAuth URL generated:', oauthData.url.substring(0, 100) + '...')
      
      // Parse the URL to check if it's pointing to the right place
      const url = new URL(oauthData.url)
      console.log('  - Host:', url.host)
      console.log('  - Provider param:', url.searchParams.get('provider'))
    }
    
    // Test 4: Check if we can access the profiles table (public read)
    console.log('\n4. Testing database access...')
    const { data: profiles, error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (dbError) {
      console.error('✗ Database access failed:', dbError.message)
    } else {
      console.log('✓ Database access successful')
    }
    
    console.log('\n✅ All tests completed!')
    
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

runTests()