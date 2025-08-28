#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { demoProfiles, demoAuthAccounts } from '../profiles';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateDemoProfiles() {
  console.log('🔄 Starting demo profile update process...\n');

  try {
    // First, get existing auth users by email
    console.log('🔍 Finding existing authentication accounts...');
    const authResults = [];
    
    for (const authData of demoAuthAccounts) {
      console.log(`   Looking up ${authData.email}...`);
      
      const { data: users, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error(`   ❌ Error listing users:`, error.message);
        continue;
      }

      const user = users.users.find(u => u.email === authData.email);
      if (user) {
        console.log(`   ✅ Found ${authData.email} (ID: ${user.id})`);
        authResults.push({ ...authData, auth_id: user.id });
      } else {
        console.log(`   ❌ User not found: ${authData.email}`);
      }
    }

    // Update profile records
    console.log('\n👤 Updating profile records...');
    const profileResults = [];
    
    for (let i = 0; i < demoProfiles.length; i++) {
      const profile = demoProfiles[i];
      const authResult = authResults[i];
      
      if (!authResult) {
        console.error(`   ❌ No auth result for profile ${profile.id}, skipping...`);
        continue;
      }

      console.log(`   Updating profile for ${profile.name}...`);
      
      const profileData = {
        id: authResult.auth_id,
        email: authResult.email,
        name: profile.full_name,
        display_name: profile.name,
        bio: profile.bio,
        location: profile.location,
        avatar_url: profile.avatar_url,
        role: 'creator' as const,
        user_role: 'creator' as const,
        is_creator: true,
        language_preference: 'en',
        updated_at: new Date().toISOString()
      };

      const { data: profileRecord, error: profileError } = await supabase
        .from('profiles')
        .upsert([profileData], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (profileError) {
        console.error(`   ❌ Error updating profile for ${profile.name}:`, profileError.message);
        continue;
      }

      console.log(`   ✅ Profile updated for ${profile.name}`);
      profileResults.push({ ...profile, database_id: profileRecord.id });
    }

    console.log('\n🎉 Demo profile update completed successfully!');
    console.log('\nSummary:');
    console.log(`- ${authResults.length} authentication accounts found`);
    console.log(`- ${profileResults.length} profile records updated`);
    
    console.log('\n📋 Demo Account Credentials:');
    authResults.forEach(auth => {
      console.log(`${auth.email} | ${auth.password} | ${auth.role}`);
    });

  } catch (error) {
    console.error('💥 Fatal error during demo profile update:', error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  updateDemoProfiles().then(() => {
    console.log('\n✨ Demo profile update process completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export default updateDemoProfiles;