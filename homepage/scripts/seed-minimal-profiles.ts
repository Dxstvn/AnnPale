/**
 * Minimal Profile Seeding for Entertainment Icons
 * Uses only the core columns that exist in the profiles table
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Get existing user IDs from the auth system
const userEmails = [
  'joseph.zenny@annpale.demo',
  'richard.cave@annpale.demo', 
  'carel.pedre@annpale.demo'
]

const minimalProfiles = [
  {
    email: 'joseph.zenny@annpale.demo',
    name: 'Joseph Zenny Junior',
    display_name: 'Ti Jo Zenny',
    role: 'creator',
    bio: `Joseph Zenny Junior, known as Ti Jo Zenny, is a beloved Haitian singer, actor, and cultural icon. Born in Jacmel on May 31, 1977, he first gained recognition as part of Konpa Kreyòl before founding the incredibly successful group Kreyòl La in 2005. His acting career took off with "I Love You Anne" (2003), cementing his status as a versatile entertainer. Beyond entertainment, Ti Jo is known for his social commitment and passionate advocacy for social change.`,
    verified: true,
    username: 'tijo_zenny_official'
  },
  {
    email: 'richard.cave@annpale.demo',
    name: 'Richard Cavé',
    display_name: 'Richard Cavé',
    role: 'creator',
    bio: `Richard Cavé is a legendary Haitian kompa musician, producer, and songwriter who revolutionized modern Haitian music. As a founding member of the internationally acclaimed group CARIMI, he co-created timeless hits like "Ayiti Bang Bang" that became anthems for the Haitian diaspora. In 2017, he founded KAÏ, which quickly became one of the most influential Haitian groups of the new generation. His innovative approach to kompa has earned him recognition as one of Haiti's most important contemporary artists.`,
    verified: true,
    username: 'richard_cave_official'
  },
  {
    email: 'carel.pedre@annpale.demo',
    name: 'Carel Pedre',
    display_name: 'Carel Pedre',
    role: 'creator',
    bio: `Carel Pedre is Haiti's most influential media personality, with over 25 years revolutionizing radio and television. As host of Radio One's "Chokarella" and TV shows "Kiyès Ki Towo A" and "Digicel Stars," he has shaped Haitian entertainment culture. During the devastating 2010 earthquake, his heroic reporting earned him international recognition as "The Eye of Haiti." As CEO of Chokarella media company and pioneer of Haiti's digital landscape, Carel combines entertainment with social impact.`,
    verified: true,
    username: 'carel_pedre_official'
  }
]

async function seedMinimalProfiles() {
  console.log('🎭 Seeding Minimal Entertainment Profiles...')
  
  try {
    // Get existing user IDs from auth
    console.log('\n🔍 Fetching existing user IDs...')
    
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      throw new Error(`Failed to fetch users: ${userError.message}`)
    }
    
    const userMap = new Map()
    userData.users.forEach(user => {
      if (userEmails.includes(user.email)) {
        userMap.set(user.email, user.id)
        console.log(`   ✅ Found user: ${user.email} (${user.id})`)
      }
    })
    
    // Insert minimal profiles
    console.log('\n👤 Inserting minimal profile data...')
    
    for (const profileData of minimalProfiles) {
      const userId = userMap.get(profileData.email)
      if (!userId) {
        console.log(`   ❌ No user ID found for: ${profileData.email}`)
        continue
      }
      
      console.log(`   Inserting minimal profile: ${profileData.display_name}`)
      
      const minimalData = {
        id: userId,
        email: profileData.email,
        name: profileData.name,
        display_name: profileData.display_name,
        role: 'creator',
        user_role: 'creator',
        is_creator: true,
        bio: profileData.bio,
        public_figure_verified: profileData.verified,
        is_demo_account: true,
        demo_tier: 'premium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(minimalData, { onConflict: 'id' })
      
      if (profileError) {
        console.error(`   ❌ Profile error for ${profileData.display_name}:`, profileError.message)
        continue
      }
      
      console.log(`   ✅ Profile created for ${profileData.display_name}`)
    }
    
    console.log('\n🎉 Minimal Entertainment Profiles Created!')
    console.log('\n📋 Summary:')
    console.log(`   • ${minimalProfiles.length} creator profiles`)
    console.log(`   • Basic profile data only (no demo-specific features)`)
    
    console.log('\n🔐 Test Login Credentials:')
    console.log('   Ti Jo Zenny: joseph.zenny@annpale.demo / AnnPale2024_Joseph')
    console.log('   Richard Cavé: richard.cave@annpale.demo / AnnPale2024_Richard')
    console.log('   Carel Pedre: carel.pedre@annpale.demo / AnnPale2024_Carel')
    
    console.log('\n✨ Profiles should now be visible on the platform!')
    console.log('🔗 Try visiting: /creator/[profile-id] or /browse to see them')
    
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding process
if (require.main === module) {
  seedMinimalProfiles()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

export { seedMinimalProfiles }