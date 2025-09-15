const { createClient } = require('@supabase/supabase-js')

// Local Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  console.log('Testing login with testfan@annpale.test...')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'testfan@annpale.test',
    password: 'testpassword123'
  })
  
  if (error) {
    console.error('Login failed:', error)
  } else {
    console.log('Login successful!')
    console.log('User:', data.user?.email)
    console.log('Session:', data.session ? 'Active' : 'None')
  }
}

testLogin()
