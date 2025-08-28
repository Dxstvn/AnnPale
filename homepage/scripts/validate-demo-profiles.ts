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

async function validateDemoProfiles() {
  console.log('✅ Starting demo profile validation...\n');

  let allValid = true;

  try {
    // Test 1: Verify authentication accounts exist
    console.log('🔐 Testing authentication accounts...');
    for (const authData of demoAuthAccounts) {
      console.log(`   Validating ${authData.email}...`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error || !data.user) {
        console.error(`   ❌ Authentication failed for ${authData.email}: ${error?.message}`);
        allValid = false;
      } else {
        console.log(`   ✅ Authentication successful for ${authData.email}`);
        
        // Sign out to clean up
        await supabase.auth.signOut();
      }
    }

    // Test 2: Verify profile records exist
    console.log('\n👤 Testing profile records...');
    for (const authData of demoAuthAccounts) {
      console.log(`   Checking profile for ${authData.email}...`);
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', authData.email)
        .eq('role', 'creator');

      if (error) {
        console.error(`   ❌ Error fetching profile for ${authData.email}: ${error.message}`);
        allValid = false;
      } else if (profiles.length === 0) {
        console.error(`   ❌ No profile found for ${authData.email}`);
        allValid = false;
      } else {
        const profile = profiles[0];
        console.log(`   ✅ Profile found: ${profile.display_name || profile.name} (${profile.role})`);
        
        // Validate key profile fields
        if (!profile.bio || !profile.avatar_url || !profile.location) {
          console.log(`   ⚠️  Profile incomplete for ${authData.email} - missing bio, avatar, or location`);
        }
      }
    }

    // Test 3: Verify image files exist
    console.log('\n🖼️  Testing image files...');
    for (const profile of demoProfiles) {
      const profileImagePath = `public${profile.avatar_url}`;
      const coverImagePath = `public${profile.cover_url}`;
      
      console.log(`   Checking images for ${profile.name}...`);
      
      try {
        const fs = await import('fs');
        if (!fs.existsSync(profileImagePath)) {
          console.error(`   ❌ Profile image missing: ${profileImagePath}`);
          allValid = false;
        } else {
          console.log(`   ✅ Profile image exists: ${profile.avatar_url}`);
        }
        
        if (!fs.existsSync(coverImagePath)) {
          console.error(`   ❌ Cover image missing: ${coverImagePath}`);
          allValid = false;
        } else {
          console.log(`   ✅ Cover image exists: ${profile.cover_url}`);
        }
      } catch (error) {
        console.error(`   ❌ Error checking images: ${error}`);
        allValid = false;
      }
    }

    // Test 4: Verify TypeScript data integrity
    console.log('\n📝 Testing TypeScript data integrity...');
    
    console.log(`   Profile data: ${demoProfiles.length} profiles defined`);
    console.log(`   Auth data: ${demoAuthAccounts.length} auth accounts defined`);
    
    if (demoProfiles.length !== demoAuthAccounts.length) {
      console.error(`   ❌ Mismatch: ${demoProfiles.length} profiles vs ${demoAuthAccounts.length} auth accounts`);
      allValid = false;
    } else {
      console.log(`   ✅ Data counts match: ${demoProfiles.length} complete sets`);
    }

    // Validate each profile has required fields
    for (const profile of demoProfiles) {
      const requiredFields = ['id', 'name', 'full_name', 'email', 'category', 'price', 'bio'];
      const missingFields = requiredFields.filter(field => !profile[field as keyof typeof profile]);
      
      if (missingFields.length > 0) {
        console.error(`   ❌ Profile ${profile.name} missing fields: ${missingFields.join(', ')}`);
        allValid = false;
      } else {
        console.log(`   ✅ Profile ${profile.name} has all required fields`);
      }
    }

    // Summary
    console.log('\n📊 Validation Summary:');
    if (allValid) {
      console.log('🎉 All demo profiles validated successfully!');
      console.log('\n✨ Ready for use:');
      console.log('- Authentication accounts working');
      console.log('- Profile records in database'); 
      console.log('- Images properly organized');
      console.log('- TypeScript data complete');
      console.log('\n🚀 Demo profiles are ready for integration!');
    } else {
      console.log('❌ Validation failed - see errors above');
      console.log('\n🔧 Issues need to be resolved before profiles can be used');
    }

  } catch (error) {
    console.error('💥 Fatal error during validation:', error);
    process.exit(1);
  }

  return allValid;
}

// Check if this script is being run directly
if (require.main === module) {
  validateDemoProfiles().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('💥 Validation script failed:', error);
    process.exit(1);
  });
}

export default validateDemoProfiles;