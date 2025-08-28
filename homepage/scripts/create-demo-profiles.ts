#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { demoProfiles, demoAuthAccounts, demoReviews, demoSampleVideos } from '../profiles';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDemoProfiles() {
  console.log('🚀 Starting demo profile creation process...\n');

  try {
    // Step 1: Create authentication accounts
    console.log('📝 Creating authentication accounts...');
    const authResults = [];
    
    for (const authData of demoAuthAccounts) {
      console.log(`   Creating auth for ${authData.email}...`);
      
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: authData.email,
        password: authData.password,
        email_confirm: true,
        user_metadata: {
          role: authData.role,
          demo_account: authData.demo_account,
          profile_id: authData.profile_id
        }
      });

      if (authError) {
        console.error(`   ❌ Error creating auth for ${authData.email}:`, authError.message);
        continue;
      }

      console.log(`   ✅ Auth created for ${authData.email} (ID: ${authUser.user.id})`);
      authResults.push({ ...authData, auth_id: authUser.user.id });
    }

    // Step 2: Create profile records
    console.log('\n👤 Creating profile records...');
    const profileResults = [];
    
    for (let i = 0; i < demoProfiles.length; i++) {
      const profile = demoProfiles[i];
      const authResult = authResults[i];
      
      if (!authResult) {
        console.error(`   ❌ No auth result for profile ${profile.id}, skipping...`);
        continue;
      }

      console.log(`   Creating profile for ${profile.name}...`);
      
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
        language_preference: 'en'
      };

      const { data: profileRecord, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        console.error(`   ❌ Error creating profile for ${profile.name}:`, profileError.message);
        continue;
      }

      console.log(`   ✅ Profile created for ${profile.name}`);
      profileResults.push({ ...profile, database_id: profileRecord.id });
    }

    // Step 3: Save profile data to local files (tables for reviews/videos don't exist yet)
    console.log('\n📁 Profile and review data saved to TypeScript files in profiles/ directory');
    console.log('   Reviews and sample videos will be available when those tables are created');

    console.log('\n🎉 Demo profile creation completed successfully!');
    console.log('\nSummary:');
    console.log(`- ${authResults.length} authentication accounts created`);
    console.log(`- ${profileResults.length} profile records created`);
    console.log(`- ${demoReviews.length} demo reviews available in TypeScript files`);
    console.log(`- ${demoSampleVideos.length} sample videos available in TypeScript files`);
    
    console.log('\n📋 Demo Account Credentials:');
    authResults.forEach(auth => {
      console.log(`${auth.email} | ${auth.password} | ${auth.role}`);
    });

  } catch (error) {
    console.error('💥 Fatal error during demo profile creation:', error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  createDemoProfiles().then(() => {
    console.log('\n✨ Demo profile creation process completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export default createDemoProfiles;