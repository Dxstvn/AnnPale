const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthentication() {
  console.log('🧪 Testing Terminal 4 Profile Authentication...\n')

  const testCredentials = [
    { email: 'kenny.sinvil@annpale.demo', password: 'AnnPale2024_Kenny', name: 'Kenny Haiti' },
    { email: 'carlo.vieux@annpale.demo', password: 'AnnPale2024_Carimi', name: 'Carimi' },
    { email: 'jean.murat@annpale.demo', password: 'AnnPale2024_Belo', name: 'BelO' }
  ]

  for (const creds of testCredentials) {
    console.log(`Testing authentication for ${creds.name}...`)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password
      })

      if (error) {
        console.error(`❌ Authentication failed for ${creds.name}:`, error.message)
        continue
      }

      console.log(`✅ Authentication successful for ${creds.name}`)
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, bio, demo_tier, is_demo_account')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error(`❌ Profile fetch failed for ${creds.name}:`, profileError.message)
      } else {
        console.log(`   Display Name: ${profile.display_name}`)
        console.log(`   Demo Account: ${profile.is_demo_account}`)
        console.log(`   Demo Tier: ${profile.demo_tier}`)
        console.log(`   Bio Length: ${profile.bio ? profile.bio.length : 0} characters`)
      }

      // Sign out
      await supabase.auth.signOut()
      console.log(`✅ Sign out successful for ${creds.name}\n`)

    } catch (error) {
      console.error(`❌ Unexpected error for ${creds.name}:`, error.message, '\n')
    }
  }

  console.log('🎉 Authentication testing completed!')
}

testAuthentication().catch(console.error)