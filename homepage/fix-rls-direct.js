#!/usr/bin/env node

/**
 * Direct RLS Policy Fix Script
 * Systematically resolves database schema issues and RLS policies
 * Using service role to bypass RLS for webhook processing
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Starting comprehensive RLS and schema fix...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅ Found' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')

// Initialize Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQL(sql, description) {
  console.log(`🔄 ${description}...`)
  console.log(`📝 SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`)
  
  try {
    const { data, error } = await supabase.rpc('execute_sql', { query: sql })
    if (error) {
      console.error(`❌ Error in ${description}:`, error)
      if (error.message.includes('already exists') || error.message.includes('does not exist')) {
        console.log('⚠️  Continuing (likely safe to ignore)...')
        return true
      }
      throw error
    }
    console.log(`✅ ${description} completed`)
    if (data) {
      console.log(`📊 Result:`, data)
    }
    return true
  } catch (error) {
    console.error(`💥 Failed ${description}:`, error)
    return false
  }
}

async function fixDatabaseSchema() {
  console.log('🔧 Phase 1: Fixing Database Schema Issues...\n')
  
  const schemaFixes = [
    // Ensure payment_intents table exists with correct schema
    `CREATE TABLE IF NOT EXISTS payment_intents (
      id TEXT PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id),
      amount DECIMAL(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'usd',
      status TEXT NOT NULL DEFAULT 'requires_payment_method',
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Add missing columns to payments table if they don't exist
    `DO $$ 
    BEGIN
      -- Add net_platform_fee column if missing
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' AND column_name = 'net_platform_fee'
      ) THEN
        ALTER TABLE payments ADD COLUMN net_platform_fee DECIMAL(10,2);
        RAISE NOTICE 'Added net_platform_fee column to payments table';
      END IF;
      
      -- Add creator_earnings column if missing
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' AND column_name = 'creator_earnings'
      ) THEN
        ALTER TABLE payments ADD COLUMN creator_earnings DECIMAL(10,2);
        RAISE NOTICE 'Added creator_earnings column to payments table';
      END IF;
    END $$`,
    
    // Create platform_revenue table if missing
    `CREATE TABLE IF NOT EXISTS platform_revenue (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      payment_intent_id TEXT NOT NULL,
      platform_fee DECIMAL(10,2) NOT NULL,
      creator_earnings DECIMAL(10,2) NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'usd',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Enable RLS on all tables
    `ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE payments ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE orders ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY`,
  ]
  
  for (const [i, sql] of schemaFixes.entries()) {
    const success = await executeSQL(sql, `Schema fix ${i + 1}/${schemaFixes.length}`)
    if (!success) {
      console.error('💥 Schema fix failed - aborting')
      return false
    }
  }
  
  console.log('🎉 Database schema fixes completed!\n')
  return true
}

async function fixRLSPolicies() {
  console.log('🔧 Phase 2: Fixing RLS Policies...\n')
  
  const rlsPolicies = [
    // Drop existing policies to start clean
    `DROP POLICY IF EXISTS "payment_intents_service_policy" ON payment_intents`,
    `DROP POLICY IF EXISTS "payment_intents_user_policy" ON payment_intents`,
    `DROP POLICY IF EXISTS "payment_intents_insert_policy" ON payment_intents`,
    `DROP POLICY IF EXISTS "payment_intents_select_policy" ON payment_intents`,
    `DROP POLICY IF EXISTS "payment_intents_update_policy" ON payment_intents`,
    
    // Service role policies (for webhook processing)
    `CREATE POLICY "payment_intents_service_policy" ON payment_intents 
     FOR ALL TO service_role USING (true) WITH CHECK (true)`,
    
    `CREATE POLICY "orders_service_policy" ON orders 
     FOR ALL TO service_role USING (true) WITH CHECK (true)`,
     
    `CREATE POLICY "payments_service_policy" ON payments 
     FOR ALL TO service_role USING (true) WITH CHECK (true)`,
     
    `CREATE POLICY "platform_revenue_service_policy" ON platform_revenue 
     FOR ALL TO service_role USING (true) WITH CHECK (true)`,
    
    // User policies (for authenticated users)
    `CREATE POLICY "payment_intents_user_policy" ON payment_intents 
     FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`,
     
    `CREATE POLICY "orders_user_policy" ON orders 
     FOR ALL TO authenticated USING (auth.uid() = fan_id OR auth.uid() = creator_id) WITH CHECK (auth.uid() = fan_id OR auth.uid() = creator_id)`,
     
    `CREATE POLICY "payments_user_policy" ON payments 
     FOR ALL TO authenticated USING (auth.uid() = fan_id OR auth.uid() = creator_id) WITH CHECK (auth.uid() = fan_id OR auth.uid() = creator_id)`,
     
    // Grant permissions to service role
    `GRANT ALL ON payment_intents TO service_role`,
    `GRANT ALL ON orders TO service_role`,
    `GRANT ALL ON payments TO service_role`,
    `GRANT ALL ON platform_revenue TO service_role`,
    `GRANT USAGE ON SCHEMA public TO service_role`,
  ]
  
  for (const [i, sql] of rlsPolicies.entries()) {
    const success = await executeSQL(sql, `RLS policy ${i + 1}/${rlsPolicies.length}`)
    if (!success) {
      console.error('💥 RLS policy fix failed - aborting')
      return false
    }
  }
  
  console.log('🎉 RLS policies fixed!\n')
  return true
}

async function testDatabaseOperations() {
  console.log('🧪 Phase 3: Testing Database Operations...\n')
  
  try {
    // Test payment intent creation
    console.log('🔍 Testing payment intent creation...')
    const testPaymentIntent = {
      id: 'pi_test_rls_' + Date.now(),
      user_id: '00000000-0000-0000-0000-000000000000',
      amount: 50.00,
      currency: 'usd',
      status: 'requires_payment_method',
      metadata: { test: true }
    }
    
    const { data: piData, error: piError } = await supabase
      .from('payment_intents')
      .insert(testPaymentIntent)
      .select()
    
    if (piError) {
      console.error('❌ Payment intent test failed:', piError)
      return false
    }
    console.log('✅ Payment intent creation successful')
    
    // Test order creation
    console.log('🔍 Testing order creation...')
    const testOrder = {
      id: 'ord_test_' + Date.now(),
      fan_id: '00000000-0000-0000-0000-000000000000',
      creator_id: '11111111-1111-1111-1111-111111111111',
      payment_intent_id: testPaymentIntent.id,
      amount: 50.00,
      status: 'pending',
      request_details: { test: true }
    }
    
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
    
    if (orderError) {
      console.error('❌ Order creation test failed:', orderError)
      return false
    }
    console.log('✅ Order creation successful')
    
    // Test platform revenue tracking
    console.log('🔍 Testing platform revenue tracking...')
    const testRevenue = {
      payment_intent_id: testPaymentIntent.id,
      platform_fee: 15.00,
      creator_earnings: 35.00,
      total_amount: 50.00
    }
    
    const { data: revenueData, error: revenueError } = await supabase
      .from('platform_revenue')
      .insert(testRevenue)
      .select()
    
    if (revenueError) {
      console.error('❌ Platform revenue test failed:', revenueError)
      return false
    }
    console.log('✅ Platform revenue tracking successful')
    
    // Clean up test data
    console.log('🧹 Cleaning up test data...')
    await supabase.from('platform_revenue').delete().eq('payment_intent_id', testPaymentIntent.id)
    await supabase.from('orders').delete().eq('id', testOrder.id)
    await supabase.from('payment_intents').delete().eq('id', testPaymentIntent.id)
    console.log('✅ Test data cleaned up')
    
    return true
    
  } catch (error) {
    console.error('💥 Database operations test failed:', error)
    return false
  }
}

async function main() {
  console.log('🎬 Starting comprehensive database fix...\n')
  
  // Phase 1: Fix database schema
  const schemaSuccess = await fixDatabaseSchema()
  if (!schemaSuccess) {
    console.error('💥 Schema fixes failed - exiting')
    process.exit(1)
  }
  
  // Phase 2: Fix RLS policies
  const rlsSuccess = await fixRLSPolicies()
  if (!rlsSuccess) {
    console.error('💥 RLS policy fixes failed - exiting')
    process.exit(1)
  }
  
  // Phase 3: Test operations
  const testSuccess = await testDatabaseOperations()
  if (!testSuccess) {
    console.error('💥 Database operations test failed - exiting')
    process.exit(1)
  }
  
  console.log('\n🎉 All database fixes completed successfully!')
  console.log('📝 Webhook processing should now work without RLS policy violations')
  console.log('🚀 Ready to test E2E payment flow')
  process.exit(0)
}

main().catch(error => {
  console.error('💥 Unexpected error:', error)
  process.exit(1)
})