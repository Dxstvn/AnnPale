const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpamx6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTIzNjIsImV4cCI6MjA3Mzc4ODM2Mn0.E43M1YJz2NJKq6aJPJrYwGVaEJD3EJrvQ-3KQMOEqkE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNotificationSystem() {
  console.log('Testing notification system...\n');

  // Test 1: Check authentication
  console.log('1. Checking authentication...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) {
    console.log('   ❌ Not authenticated. Please log in first.\n');
    console.log('   To test: Visit http://localhost:3000/login and sign in');
    return;
  }

  console.log(`   ✅ Authenticated as user: ${user.id}\n`);

  // Test 2: Query existing notifications
  console.log('2. Querying existing notifications...');
  const { data: notifications, error: queryError } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (queryError) {
    console.log(`   ❌ Error querying notifications: ${queryError.message}\n`);
  } else {
    console.log(`   ✅ Found ${notifications.length} existing notifications`);
    if (notifications.length > 0) {
      console.log('   Most recent:', {
        id: notifications[0].id.substring(0, 8) + '...',
        message: notifications[0].message,
        is_read: notifications[0].is_read,
        created_at: new Date(notifications[0].created_at).toLocaleString()
      });
    }
    console.log('');
  }

  // Test 3: Check real-time subscription
  console.log('3. Testing real-time subscription...');
  console.log('   Setting up listener for new notifications...');

  const channel = supabase
    .channel(`test-notifications-${user.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        console.log('   🔔 Real-time notification received!', {
          id: payload.new.id.substring(0, 8) + '...',
          message: payload.new.message
        });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('   ✅ Real-time subscription active\n');

        // Test 4: Create a test notification
        console.log('4. Creating a test notification...');
        createTestNotification(user.id);
      } else {
        console.log(`   ⚠️ Subscription status: ${status}\n`);
      }
    });

  // Keep the script running to receive real-time updates
  console.log('\n📡 Listening for real-time updates... (Press Ctrl+C to exit)\n');
}

async function createTestNotification(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'system',
      message: `Test notification created at ${new Date().toLocaleTimeString()}`,
      data: {
        test: true,
        timestamp: Date.now()
      },
      is_read: false
    })
    .select()
    .single();

  if (error) {
    console.log(`   ❌ Error creating notification: ${error.message}\n`);
  } else {
    console.log(`   ✅ Test notification created successfully!`);
    console.log('   Notification ID:', data.id.substring(0, 8) + '...\n');
    console.log('   If real-time is working, you should see a "Real-time notification received!" message above.\n');
  }
}

// Run the test
testNotificationSystem().catch(console.error);