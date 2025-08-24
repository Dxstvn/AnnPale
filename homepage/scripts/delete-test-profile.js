const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role to bypass RLS
)

async function deleteTestProfile() {
  const email = 'daj353@nyu.edu'
  
  console.log(`Deleting profile for ${email}...`)
  
  // First, find the user
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, email, name, role')
    .eq('email', email)
    .single()
  
  if (fetchError) {
    console.error('Error fetching profile:', fetchError)
    return
  }
  
  if (!profile) {
    console.log('No profile found for this email')
    return
  }
  
  console.log('Found profile:', profile)
  
  // Delete the profile
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profile.id)
  
  if (deleteError) {
    console.error('Error deleting profile:', deleteError)
    return
  }
  
  console.log('Profile deleted successfully!')
  console.log('Now when you login with X, you should be redirected to role-selection')
}

deleteTestProfile()