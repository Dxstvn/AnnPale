#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js'

// Remote Supabase configuration
const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA2NDYzOCwiZXhwIjoyMDcxNjQwNjM4fQ.k0i4A5KPwi7ec6HqJO8-iTfdOYvwHtoFXRiCPsyx-9Y'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateMusicianDisplayNames() {
  console.log('🎵 Updating musician display names in remote database...\n')

  const musicians = [
    {
      id: 'd963aa48-879d-461c-9df3-7dc557b545f9',
      email: 'wyclef.jean@annpale.demo',
      display_name: 'Wyclef Jean',
      full_name: 'Nel Ust Wyclef Jean'
    },
    {
      id: '819421cf-9437-4d10-bb09-bca4e0c12cba', 
      email: 'michael.brun@annpale.demo',
      display_name: 'Michael Brun',
      full_name: 'Michaël Brun'
    },
    {
      id: 'cbce25c9-04e0-45c7-b872-473fed4eeb1d',
      email: 'rutshelle.guillaume@annpale.demo', 
      display_name: 'Rutshelle Guillaume',
      full_name: 'Rutshelle Guillaume'
    }
  ]

  for (const musician of musicians) {
    try {
      console.log(`Updating ${musician.display_name}...`)

      // Update auth.users metadata
      const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
        musician.id,
        {
          user_metadata: {
            full_name: musician.full_name,
            display_name: musician.display_name,
            name: musician.display_name,
            role: 'creator'
          }
        }
      )

      if (authError) {
        console.error(`  ❌ Auth update failed:`, authError.message)
      } else {
        console.log(`  ✅ Auth metadata updated`)
      }

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: musician.display_name,
          bio: `${musician.display_name} - Haitian music superstar on Ann Pale platform`
        })
        .eq('id', musician.id)

      if (profileError) {
        console.error(`  ❌ Profile update failed:`, profileError.message)
      } else {
        console.log(`  ✅ Profile updated`)
      }

    } catch (error) {
      console.error(`❌ Failed to update ${musician.display_name}:`, error)
    }
  }

  // Verify the updates
  console.log('\n📊 Verifying updates...')
  
  const { data: users, error: verifyError } = await supabase
    .from('profiles')
    .select('id, email, name')
    .in('email', musicians.map(m => m.email))

  if (verifyError) {
    console.error('❌ Verification failed:', verifyError.message)
  } else {
    console.log('\n✅ Current display names:')
    users?.forEach(user => {
      console.log(`   ${user.email}: ${user.name || '(no display name)'}`)
    })
  }

  console.log('\n🎉 Display name update completed!')
}

// Run the update
updateMusicianDisplayNames().catch(console.error)