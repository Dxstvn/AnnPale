const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test direct Supabase real-time subscription
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealtime() {
  console.log('Testing Supabase real-time directly...\n');

  // First authenticate
  // You need to provide credentials via environment variables or command line
  const email = process.env.TEST_USER_EMAIL || process.argv[2];
  const password = process.env.TEST_USER_PASSWORD || process.argv[3];

  if (!email || !password) {
    console.error('Please provide email and password as arguments or set TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.local');
    console.log('Usage: node test-realtime-direct.js <email> <password>');
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
  const userId = authData.user.id;

  // Subscribe to notifications table
  console.log('\n📡 Setting up real-time subscription...');

  const channel = supabase
    .channel('test-notifications')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications'
      },
      (payload) => {
        console.log('\n🔔 Real-time event received!');
        console.log('Event type:', payload.eventType);
        console.log('Data:', payload);
      }
    )
    .subscribe((status, error) => {
      console.log('Subscription status:', status, error);

      if (status === 'SUBSCRIBED') {
        console.log('✅ Successfully subscribed to real-time changes\n');

        // Create a test notification after subscription
        console.log('Creating test notification...');
        createTestNotification(userId);
      }
    });

  // Keep the script running
  console.log('Listening for events... (Ctrl+C to exit)\n');
}

async function createTestNotification(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'system',
      message: `Direct real-time test at ${new Date().toLocaleTimeString()}`,
      data: { test: true },
      is_read: false
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating notification:', error);
  } else {
    console.log('✅ Notification created:', data.id);
    console.log('\nIf real-time is working, you should see an event above...\n');
  }
}

testRealtime().catch(console.error);