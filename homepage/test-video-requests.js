const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test video requests functionality
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testVideoRequests() {
  console.log('Testing video_requests functionality...\n');

  // First authenticate as a test user
  const email = process.env.TEST_USER_EMAIL || process.argv[2];
  const password = process.env.TEST_USER_PASSWORD || process.argv[3];

  if (!email || !password) {
    console.error('Please provide email and password as arguments or set TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.local');
    console.log('Usage: node test-video-requests.js <email> <password>');
    process.exit(1);
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error('Auth error:', authError);
    return;
  }

  console.log('✅ Authenticated as:', authData.user.id);

  // Test 1: Query video_requests table
  console.log('\n📊 Testing video_requests query...');
  const { data: requests, error: queryError, count } = await supabase
    .from('video_requests')
    .select('*', { count: 'exact' })
    .eq('creator_id', authData.user.id)
    .eq('status', 'pending')
    .filter('viewed_at', 'is', null)
    .limit(5);

  if (queryError) {
    console.error('❌ Query error:', queryError);
  } else {
    console.log('✅ Query successful!');
    console.log(`Found ${count || 0} unviewed pending video requests`);
    if (requests && requests.length > 0) {
      console.log('Sample request:', {
        id: requests[0].id,
        status: requests[0].status,
        viewed_at: requests[0].viewed_at,
        created_at: requests[0].created_at
      });
    }
  }

  // Test 2: Test marking as viewed (if there are any requests)
  if (requests && requests.length > 0) {
    console.log('\n📝 Testing mark as viewed...');
    const { error: updateError } = await supabase
      .from('video_requests')
      .update({ viewed_at: new Date().toISOString() })
      .eq('id', requests[0].id);

    if (updateError) {
      console.error('❌ Update error:', updateError);
    } else {
      console.log('✅ Successfully marked request as viewed');
    }

    // Verify the update
    const { data: updatedRequest, error: verifyError } = await supabase
      .from('video_requests')
      .select('id, viewed_at')
      .eq('id', requests[0].id)
      .single();

    if (!verifyError && updatedRequest) {
      console.log('Verified viewed_at:', updatedRequest.viewed_at);
    }
  } else {
    console.log('\n💡 No pending video requests to test marking as viewed');
  }

  console.log('\n✨ Video requests functionality test complete!');
}

testVideoRequests().catch(console.error);