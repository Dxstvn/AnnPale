#!/usr/bin/env node

/**
 * Quick RLS Policy Fix Script
 * Uses Supabase service role to fix RLS policies
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Quick RLS policy fix...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

console.log('✅ Environment variables loaded')

// Initialize Supabase client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies...')
    
    // Execute RLS policy fixes via SQL
    const sqlStatements = [
      // Fix payment_intents policies
      `DROP POLICY IF EXISTS "payment_intents_insert_policy" ON payment_intents`,
      `DROP POLICY IF EXISTS "payment_intents_select_policy" ON payment_intents`,
      `DROP POLICY IF EXISTS "payment_intents_update_policy" ON payment_intents`,
      `DROP POLICY IF EXISTS "payment_intents_service_policy" ON payment_intents`,
      
      // Create service role policy for payment_intents
      `CREATE POLICY "payment_intents_service_policy" ON payment_intents 
       FOR ALL TO service_role USING (true) WITH CHECK (true)`,
      
      // Create user policy for payment_intents
      `CREATE POLICY "payment_intents_user_policy" ON payment_intents 
       FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`,
      
      // Fix orders policies
      `DROP POLICY IF EXISTS "orders_service_policy" ON orders`,
      `CREATE POLICY "orders_service_policy" ON orders 
       FOR ALL TO service_role USING (true) WITH CHECK (true)`,
      
      // Fix payments policies
      `DROP POLICY IF EXISTS "payments_service_policy" ON payments`,
      `CREATE POLICY "payments_service_policy" ON payments 
       FOR ALL TO service_role USING (true) WITH CHECK (true)`,
    ]
    
    for (const [i, sql] of sqlStatements.entries()) {
      console.log(`🔄 Executing statement ${i + 1}/${sqlStatements.length}...`)
      console.log(`📝 ${sql.substring(0, 60)}${sql.length > 60 ? '...' : ''}`)
      
      try {
        const { error } = await supabase.rpc('execute_sql', { query: sql })
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error)
          if (error.message.includes('already exists') || error.message.includes('does not exist')) {
            console.log('⚠️  Continuing (likely safe to ignore)...')
            continue
          }
          throw error
        }
        console.log(`✅ Statement ${i + 1} executed`)
      } catch (error) {
        console.error(`💥 Failed statement ${i + 1}:`, error)
        throw error
      }
    }
    
    console.log('🎉 RLS policies fixed successfully!')
    return true
    
  } catch (error) {
    console.error('💥 RLS policy fix failed:', error)
    return false
  }
}

async function testPaymentIntentCreation() {
  console.log('🧪 Testing payment intent creation...')
  
  try {
    const testPaymentIntent = {
      id: 'pi_test_rls_' + Date.now(),
      user_id: '00000000-0000-0000-0000-000000000000',
      amount: 50.00,
      currency: 'usd',
      status: 'requires_payment_method',
      metadata: { test: true }
    }
    
    const { data, error } = await supabase
      .from('payment_intents')
      .insert(testPaymentIntent)
      .select()
    
    if (error) {
      console.error('❌ Test insert failed:', error)
      return false
    }
    
    console.log('✅ Test payment intent created successfully')
    
    // Clean up
    const { error: deleteError } = await supabase
      .from('payment_intents')
      .delete()
      .eq('id', testPaymentIntent.id)
    
    if (deleteError) {
      console.error('⚠️  Error cleaning up:', deleteError)
    } else {
      console.log('✅ Test data cleaned up')
    }
    
    return true
    
  } catch (error) {
    console.error('💥 Test failed:', error)
    return false
  }
}

async function main() {
  console.log('🎬 Starting RLS policy fix...\n')
  
  const fixSuccess = await fixRLSPolicies()
  
  if (!fixSuccess) {
    console.error('\n💥 RLS policy fix failed - exiting')
    process.exit(1)
  }
  
  const testSuccess = await testPaymentIntentCreation()
  
  if (!testSuccess) {
    console.error('\n💥 Test failed - RLS policies may not be working')
    process.exit(1)
  }
  
  console.log('\n🎉 RLS policies fixed and tested successfully!')
  console.log('📝 Payment intent creation should now work in webhook handler')
  process.exit(0)
}

main().catch(error => {
  console.error('💥 Unexpected error:', error)
  process.exit(1)
})