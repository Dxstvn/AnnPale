import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function testSubscriptionQuery() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const testUserId = 'c948265a-fb81-4c40-be8d-8dd536433738'
  const testCreatorId = '87d14b76-c359-42eb-9d1b-f148a82cf62e'

  console.log('Testing subscription query...')
  console.log('User ID:', testUserId)
  console.log('Creator ID:', testCreatorId)

  // Test 1: Simple query without joins
  console.log('\n--- Test 1: Simple query without joins ---')
  const { data: simple, error: simpleError } = await supabase
    .from('subscription_orders')
    .select('tier_id, status')
    .eq('user_id', testUserId)
    .eq('creator_id', testCreatorId)
    .eq('status', 'active')

  console.log('Simple query result:', simple)
  if (simpleError) {
    console.error('Simple query error:', simpleError)
  }

  // Test 2: Query with foreign key expansion (original method)
  console.log('\n--- Test 2: Query with foreign key expansion ---')
  const { data: withJoin, error: joinError } = await supabase
    .from('subscription_orders')
    .select('tier_id, status, creator_subscription_tiers(tier_name, price)')
    .eq('user_id', testUserId)
    .eq('creator_id', testCreatorId)
    .eq('status', 'active')

  console.log('Join query result:', withJoin)
  if (joinError) {
    console.error('Join query error:', joinError)
  }

  // Test 3: Check if table exists and is accessible
  console.log('\n--- Test 3: Check table accessibility ---')
  const { data: anyData, error: anyError } = await supabase
    .from('subscription_orders')
    .select('id')
    .limit(1)

  console.log('Table accessibility test:', anyData ? 'Table is accessible' : 'Table is not accessible')
  if (anyError) {
    console.error('Table accessibility error:', anyError)
  }

  // Test 4: Check creator_subscription_tiers table
  console.log('\n--- Test 4: Check creator_subscription_tiers table ---')
  const { data: tierData, error: tierError } = await supabase
    .from('creator_subscription_tiers')
    .select('id, tier_name')
    .eq('creator_id', testCreatorId)
    .limit(1)

  console.log('Tier table result:', tierData)
  if (tierError) {
    console.error('Tier table error:', tierError)
  }
}

testSubscriptionQuery().catch(console.error)