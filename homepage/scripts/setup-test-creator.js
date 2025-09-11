const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupTestCreator() {
  console.log('Setting up test creator profile...')
  
  // Test creator ID from auth helper
  const creatorId = '0f3753a3-029c-473a-9aee-fc107d10c569'
  
  try {
    // Check if profile exists
    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', creatorId)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError)
      return
    }
    
    if (existing) {
      console.log('Existing profile found:', existing)
      
      // Update to ensure it's a creator
      const { data, error } = await supabase
        .from('profiles')
        .update({
          role: 'creator',
          name: 'Test Creator',
          bio: 'Test creator for E2E testing',
          category: 'Entertainment',
          public_figure_verified: true
        })
        .eq('id', creatorId)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating profile:', error)
      } else {
        console.log('✅ Profile updated successfully:', data)
      }
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: creatorId,
          email: 'testcreator@annpale.test',
          name: 'Test Creator',
          role: 'creator',
          bio: 'Test creator for E2E testing',
          category: 'Entertainment',
          public_figure_verified: true,
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testcreator'
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating profile:', error)
      } else {
        console.log('✅ Profile created successfully:', data)
      }
    }
    
    // Also ensure test fan exists
    const fanId = '8f8d7143-99e8-4ca6-868f-38df513e2264'
    
    const { data: fanProfile, error: fanError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', fanId)
      .single()
    
    if (fanError && fanError.code !== 'PGRST116') {
      console.error('Error fetching fan profile:', fanError)
      return
    }
    
    if (fanProfile) {
      console.log('Fan profile exists:', fanProfile)
      
      // Ensure it's a fan
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'fan' })
        .eq('id', fanId)
      
      if (error) {
        console.error('Error updating fan role:', error)
      } else {
        console.log('✅ Fan role confirmed')
      }
    } else {
      // Create fan profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: fanId,
          email: 'testfan@annpale.test',
          name: 'Test Fan',
          role: 'fan',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testfan'
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating fan profile:', error)
      } else {
        console.log('✅ Fan profile created:', data)
      }
    }
    
    // Verify both profiles exist with correct roles
    console.log('\n🔍 Verifying test users...')
    
    const { data: creators, error: creatorsError } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('role', 'creator')
    
    console.log(`Found ${creators?.length || 0} creators:`)
    creators?.forEach(c => console.log(`  - ${c.name} (${c.email})`))
    
    const { data: fans, error: fansError } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('role', 'fan')
    
    console.log(`Found ${fans?.length || 0} fans:`)
    fans?.forEach(f => console.log(`  - ${f.name} (${f.email})`))
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

setupTestCreator()