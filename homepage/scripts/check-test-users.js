const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTestUsers() {
  console.log('🔍 Checking existing test users in database...\n');

  // Check for users with test patterns
  const { data: testUsers, error } = await supabase
    .from('profiles')
    .select('id, email, display_name, user_role, created_at')
    .or('email.ilike.%test%,email.ilike.%e2e%,email.ilike.%demo%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(`Found ${testUsers.length} test/demo users:\n`);

  // Group by role
  const byRole = {
    fan: [],
    creator: [],
    admin: []
  };

  testUsers.forEach(user => {
    const role = user.user_role || 'fan';
    byRole[role].push(user);
  });

  // Display by role
  Object.entries(byRole).forEach(([role, users]) => {
    console.log(`\n${role.toUpperCase()}S (${users.length}):`);
    users.forEach(user => {
      console.log(`  📧 ${user.email}`);
      console.log(`     ID: ${user.id}`);
      console.log(`     Name: ${user.display_name || 'No name'}`);
      console.log(`     Created: ${new Date(user.created_at).toLocaleDateString()}`);
    });
  });

  // Check creator stats for creators
  console.log('\n📊 Creator Stats:');
  for (const creator of byRole.creator) {
    const { data: stats } = await supabase
      .from('creator_stats')
      .select('total_earnings, total_orders, completed_orders, pending_orders')
      .eq('creator_id', creator.id)
      .single();

    if (stats) {
      console.log(`  ${creator.email}:`);
      console.log(`    Earnings: $${stats.total_earnings || 0}`);
      console.log(`    Orders: ${stats.total_orders || 0} total, ${stats.completed_orders || 0} completed, ${stats.pending_orders || 0} pending`);
    }
  }

  // Check for recent orders
  console.log('\n📦 Recent Test Orders:');
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, amount, status, created_at, user:profiles!orders_user_id_fkey(email), creator:profiles!orders_creator_id_fkey(email)')
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentOrders && recentOrders.length > 0) {
    recentOrders.forEach(order => {
      console.log(`  Order ${order.id.slice(0, 8)}:`);
      console.log(`    Amount: $${order.amount}`);
      console.log(`    Status: ${order.status}`);
      console.log(`    Fan: ${order.user?.email || 'Unknown'}`);
      console.log(`    Creator: ${order.creator?.email || 'Unknown'}`);
      console.log(`    Date: ${new Date(order.created_at).toLocaleString()}`);
    });
  } else {
    console.log('  No recent orders found');
  }
}

checkTestUsers().catch(console.error);