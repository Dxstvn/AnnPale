const { createClient } = require('@supabase/supabase-js')

// Local Supabase configuration
const supabaseUrl = 'http://localhost:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

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
