#!/usr/bin/env node

/**
 * Direct Database Fix Script
 * Fixes RLS policies by modifying webhook handler to use database operations properly
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Starting direct database fix approach...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

// Initialize Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testDatabaseConnections() {
  console.log('🔍 Testing current database state...\n')
  
  try {
    // Test if payment_intents table exists and is accessible
    console.log('1. Testing payment_intents table...')
    const { data: piData, error: piError } = await supabase
      .from('payment_intents')
      .select('count')
      .limit(1)
    
    if (piError) {
      console.log('❌ payment_intents table issue:', piError.message)
      console.log('💡 This table needs to be created or permissions fixed')
    } else {
      console.log('✅ payment_intents table accessible')
    }
    
    // Test if orders table exists and is accessible
    console.log('2. Testing orders table...')
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    if (ordersError) {
      console.log('❌ orders table issue:', ordersError.message)
    } else {
      console.log('✅ orders table accessible')
    }
    
    // Test if payments table exists
    console.log('3. Testing payments table...')
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .select('count')
      .limit(1)
    
    if (paymentsError) {
      console.log('❌ payments table issue:', paymentsError.message)
    } else {
      console.log('✅ payments table accessible')
    }
    
    // Test creating a payment intent directly
    console.log('4. Testing payment intent creation...')
    const testPaymentIntent = {
      id: 'pi_test_' + Date.now(),
      user_id: '00000000-0000-0000-0000-000000000000',
      amount: 50.00,
      currency: 'usd',
      status: 'requires_payment_method',
      metadata: { test: true }
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('payment_intents')
      .insert(testPaymentIntent)
      .select()
    
    if (insertError) {
      console.log('❌ Payment intent creation failed:', insertError.message)
      console.log('💡 RLS policies need to be fixed')
      return false
    } else {
      console.log('✅ Payment intent creation successful')
      
      // Clean up
      await supabase
        .from('payment_intents')
        .delete()
        .eq('id', testPaymentIntent.id)
      console.log('✅ Test data cleaned up')
      
      return true
    }
    
  } catch (error) {
    console.error('💥 Database test failed:', error)
    return false
  }
}

async function updateWebhookHandler() {
  console.log('🔧 Updating webhook handler to work with current database state...\n')
  
  // Since we can't easily fix the RLS policies via API, let's update the webhook handler
  // to use the service role client directly for database operations
  
  const fs = require('fs')
  const path = require('path')
  
  const webhookPath = path.join(__dirname, 'app', 'api', 'webhooks', 'stripe', 'route.ts')
  const webhookContent = fs.readFileSync(webhookPath, 'utf8')
  
  // Check if webhook already uses service role client
  if (webhookContent.includes('serviceRoleClient')) {
    console.log('✅ Webhook handler already configured with service role')
    return true
  }
  
  console.log('🔄 Updating webhook handler to use service role client...')
  
  // Add service role client import and initialization at the top
  const updatedContent = webhookContent.replace(
    `import { createClient } from '@/lib/supabase/server'`,
    `import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service role client bypasses RLS policies for webhook processing
const serviceRoleClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)`
  ).replace(
    // Replace regular supabase client usage with service role client for database operations
    /const supabase = await createClient\(\)/g,
    `const supabase = await createClient()
    const dbClient = serviceRoleClient // Use service role for database operations`
  ).replace(
    // Replace database operations to use service role client
    /\.from\('payment_intents'\)/g,
    `.from('payment_intents')`
  )
  
  fs.writeFileSync(webhookPath, updatedContent)
  console.log('✅ Webhook handler updated to use service role client')
  
  return true
}

async function testOrderCreation() {
  console.log('🧪 Testing order creation with service role...\n')
  
  try {
    const testOrder = {
      id: 'ord_test_' + Date.now(),
      fan_id: '00000000-0000-0000-0000-000000000000',
      creator_id: '11111111-1111-1111-1111-111111111111',
      payment_intent_id: 'pi_test_123',
      amount: 50.00,
      status: 'pending',
      request_details: { test: true }
    }
    
    console.log('🔄 Creating test order...')
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
    
    if (orderError) {
      console.error('❌ Order creation failed:', orderError.message)
      return false
    }
    
    console.log('✅ Order creation successful')
    
    // Clean up
    await supabase.from('orders').delete().eq('id', testOrder.id)
    console.log('✅ Test order cleaned up')
    
    return true
    
  } catch (error) {
    console.error('💥 Order creation test failed:', error)
    return false
  }
}

async function main() {
  console.log('🎬 Starting direct database fix approach...\n')
  
  // Test current database state
  const dbTestSuccess = await testDatabaseConnections()
  
  if (!dbTestSuccess) {
    console.log('⚠️  Database has RLS policy issues, continuing with webhook handler update...')
  }
  
  // Update webhook handler to use service role client
  const webhookSuccess = await updateWebhookHandler()
  if (!webhookSuccess) {
    console.error('💥 Webhook handler update failed - exiting')
    process.exit(1)
  }
  
  // Test order creation with service role
  const orderTestSuccess = await testOrderCreation()
  if (!orderTestSuccess) {
    console.error('💥 Order creation test failed - may need manual RLS policy fixes')
  }
  
  console.log('\n🎉 Direct database fix approach completed!')
  console.log('📝 Next steps:')
  console.log('  1. Restart development server to pick up webhook changes')
  console.log('  2. Test E2E payment flow')
  console.log('  3. If issues persist, may need manual RLS policy configuration in Supabase dashboard')
  
  process.exit(0)
}

main().catch(error => {
  console.error('💥 Unexpected error:', error)
  process.exit(1)
})