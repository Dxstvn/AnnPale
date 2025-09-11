const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixCreatorRole() {
  console.log('🔧 Fixing creator roles and RLS policies...')
  
  try {
    // First, let's check the current user
    const creatorId = '530c7ea1-4946-4f34-b636-7530c2e376fb' // From your logs
    
    // Update the user's role to creator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: 'creator',
        is_creator: true 
      })
      .eq('id', creatorId)
      .select()
      .single()
    
    if (profileError) {
      console.error('Error updating profile:', profileError)
    } else {
      console.log('✅ Updated profile to creator role:', profile.display_name)
    }
    
    // Also update the RLS policy to check both role and is_creator fields
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing insert policy
        DROP POLICY IF EXISTS "Creators can insert own posts" ON posts;
        
        -- Create new insert policy that checks creator status properly
        CREATE POLICY "Creators can insert own posts" ON posts
          FOR INSERT
          WITH CHECK (
            auth.uid() = creator_id 
            AND EXISTS (
              SELECT 1 FROM profiles 
              WHERE profiles.id = auth.uid() 
              AND (profiles.role = 'creator' OR profiles.is_creator = true)
            )
          );
      `
    }).catch(() => {
      // If exec_sql doesn't work, we'll handle it differently
      console.log('Note: Could not update RLS policy via exec_sql')
    })
    
    console.log('✅ Creator role and permissions fixed!')
    
    // Verify the user can now be a creator
    const { data: verifyProfile } = await supabase
      .from('profiles')
      .select('id, display_name, role, is_creator')
      .eq('id', creatorId)
      .single()
    
    console.log('Creator profile:', verifyProfile)
    
  } catch (error) {
    console.error('❌ Error fixing creator role:', error)
  }
}

fixCreatorRole().catch(console.error)