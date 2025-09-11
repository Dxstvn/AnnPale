const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🔐 Testing login with testfan@annpale.test...\n');

  try {
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'testfan@annpale.test',
      password: 'testpassword123'
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('   Error details:', error);
      return;
    }

    console.log('✅ Login successful!');
    console.log('   User ID:', data.user?.id);
    console.log('   Email:', data.user?.email);
    console.log('   Session:', data.session ? 'Created' : 'Not created');
    
    // Sign out
    await supabase.auth.signOut();
    console.log('✅ Signed out successfully');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testLogin();