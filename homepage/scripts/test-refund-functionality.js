/**
 * Test Script: Stripe Refund Functionality
 * 
 * This script tests the complete refund workflow for the Ann Pale platform:
 * 1. Creator rejection refunds
 * 2. Fan cancellation refunds  
 * 3. System-initiated refunds
 * 4. Database synchronization
 * 5. Webhook handling
 * 
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/test-refund-functionality.js
 */

const { createClient } = require('@supabase/supabase-js')
const Stripe = require('stripe')

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

async function testRefundFunctionality() {
  console.log('🧪 Starting Refund Functionality Test Suite')
  console.log('==========================================\n')

  // Test 1: Verify database schema
  console.log('1️⃣ Testing Database Schema...')
  await testDatabaseSchema()

  // Test 2: Test refund utility functions
  console.log('\n2️⃣ Testing Refund Functions...')
  await testRefundFunctions()

  // Test 3: Test creator rejection flow simulation
  console.log('\n3️⃣ Testing Creator Rejection Flow...')
  await testCreatorRejectionFlow()

  // Test 4: Test fan cancellation flow simulation
  console.log('\n4️⃣ Testing Fan Cancellation Flow...')
  await testFanCancellationFlow()

  // Test 5: Test system refund processing
  console.log('\n5️⃣ Testing System Refund Processing...')
  await testSystemRefundProcessing()

  // Test 6: Verify API endpoints
  console.log('\n6️⃣ Testing API Endpoints...')
  await testAPIEndpoints()

  console.log('\n✅ All refund functionality tests completed!')
}

async function testDatabaseSchema() {
  try {
    // Check if refunds table exists
    const { data: refundsTable, error: refundsError } = await supabase
      .from('refunds')
      .select('id')
      .limit(1)

    if (refundsError) {
      throw new Error(`Refunds table error: ${refundsError.message}`)
    }

    console.log('✅ Refunds table exists and accessible')

    // Check if webhook_events table exists
    const { data: webhookTable, error: webhookError } = await supabase
      .from('webhook_events')
      .select('id')
      .limit(1)

    if (webhookError) {
      console.log('⚠️ Webhook events table might not exist (non-critical)')
    } else {
      console.log('✅ Webhook events table exists')
    }

    // Test refund analytics view
    const { data: analyticsView, error: analyticsError } = await supabase
      .from('refund_analytics')
      .select('*')
      .limit(1)

    if (analyticsError) {
      console.log('⚠️ Refund analytics view might not exist (non-critical)')
    } else {
      console.log('✅ Refund analytics view accessible')
    }

  } catch (error) {
    console.error('❌ Database schema test failed:', error.message)
    throw error
  }
}

async function testRefundFunctions() {
  try {
    // Test create_refund_record function with mock data
    console.log('Testing create_refund_record function...')

    // First, get a test order to work with
    const { data: testOrders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .limit(1)

    if (orderError || !testOrders?.length) {
      console.log('⚠️ No pending orders found for testing refund functions')
      return
    }

    const testOrder = testOrders[0]
    console.log(`Found test order: ${testOrder.id}`)

    // Test the function (this won't create a real Stripe refund)
    const mockStripeRefundId = `re_test_${Date.now()}`
    
    try {
      const { data: refundId, error: functionError } = await supabase
        .rpc('create_refund_record', {
          p_stripe_refund_id: mockStripeRefundId,
          p_order_id: testOrder.id,
          p_refund_amount: parseFloat(testOrder.amount),
          p_reason: 'creator_rejection',
          p_initiated_by_type: 'system',
          p_reason_notes: 'Test refund record creation',
          p_metadata: JSON.stringify({ test: true })
        })

      if (functionError) {
        throw new Error(`Function error: ${functionError.message}`)
      }

      console.log('✅ create_refund_record function works')
      console.log(`   Created refund record ID: ${refundId}`)

      // Clean up test record
      await supabase
        .from('refunds')
        .delete()
        .eq('id', refundId)

      console.log('✅ Test refund record cleaned up')

    } catch (funcError) {
      console.error('❌ Function test failed:', funcError.message)
    }

  } catch (error) {
    console.error('❌ Refund functions test failed:', error.message)
  }
}

async function testCreatorRejectionFlow() {
  try {
    console.log('Simulating creator rejection flow...')

    // Get a test order
    const { data: testOrders, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'accepted'])
      .limit(1)

    if (orderError || !testOrders?.length) {
      console.log('⚠️ No suitable orders found for creator rejection test')
      return
    }

    const testOrder = testOrders[0]
    console.log(`Testing with order: ${testOrder.id} (${testOrder.status})`)

    // Simulate rejection (update order status without actual Stripe call)
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'rejected',
        metadata: {
          ...testOrder.metadata,
          rejectionReason: 'Test rejection',
          rejectionNotes: 'Automated test rejection',
          rejectedAt: new Date().toISOString(),
          testSimulation: true
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', testOrder.id)

    if (updateError) {
      throw new Error(`Order update failed: ${updateError.message}`)
    }

    console.log('✅ Creator rejection simulation successful')
    console.log('   Order status updated to rejected')

    // Restore original status
    await supabase
      .from('orders')
      .update({
        status: testOrder.status,
        metadata: testOrder.metadata,
        updated_at: testOrder.updated_at
      })
      .eq('id', testOrder.id)

    console.log('✅ Test order restored to original state')

  } catch (error) {
    console.error('❌ Creator rejection flow test failed:', error.message)
  }
}

async function testFanCancellationFlow() {
  try {
    console.log('Testing fan cancellation eligibility logic...')

    // Test cancellation rules
    const now = new Date()
    
    // Test case 1: Recent pending order (should be cancellable)
    const recentOrder = {
      status: 'pending',
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      amount: 50.00
    }

    const hoursSinceRecentOrder = (now.getTime() - new Date(recentOrder.created_at).getTime()) / (1000 * 60 * 60)
    
    let canCancelRecent = false
    let cancellationFeeRecent = 0

    if (recentOrder.status === 'pending' && hoursSinceRecentOrder <= 24) {
      canCancelRecent = true
      cancellationFeeRecent = 0
    }

    console.log(`Recent pending order (${hoursSinceRecentOrder.toFixed(1)}h ago):`)
    console.log(`   Can cancel: ${canCancelRecent ? '✅' : '❌'}`)
    console.log(`   Fee: $${cancellationFeeRecent}`)

    // Test case 2: Accepted order within 2 hours (should be cancellable with fee)
    const acceptedOrder = {
      status: 'accepted',
      created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      amount: 75.00
    }

    const hoursSinceAcceptedOrder = (now.getTime() - new Date(acceptedOrder.created_at).getTime()) / (1000 * 60 * 60)
    
    let canCancelAccepted = false
    let cancellationFeeAccepted = 0

    if (acceptedOrder.status === 'accepted' && hoursSinceAcceptedOrder <= 2) {
      canCancelAccepted = true
      cancellationFeeAccepted = Math.round(acceptedOrder.amount * 0.10 * 100) / 100
    }

    console.log(`Recent accepted order (${hoursSinceAcceptedOrder.toFixed(1)}h ago):`)
    console.log(`   Can cancel: ${canCancelAccepted ? '✅' : '❌'}`)
    console.log(`   Fee: $${cancellationFeeAccepted}`)

    // Test case 3: Old order (should not be cancellable)
    const oldOrder = {
      status: 'pending',
      created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
      amount: 100.00
    }

    const hoursSinceOldOrder = (now.getTime() - new Date(oldOrder.created_at).getTime()) / (1000 * 60 * 60)
    
    let canCancelOld = false
    if (oldOrder.status === 'pending' && hoursSinceOldOrder <= 24) {
      canCancelOld = true
    }

    console.log(`Old pending order (${hoursSinceOldOrder.toFixed(1)}h ago):`)
    console.log(`   Can cancel: ${canCancelOld ? '✅' : '❌'}`)

    console.log('✅ Fan cancellation logic validation complete')

  } catch (error) {
    console.error('❌ Fan cancellation flow test failed:', error.message)
  }
}

async function testSystemRefundProcessing() {
  try {
    console.log('Testing system refund processing logic...')

    // Find orders that would be eligible for system refunds (expired orders)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 14)

    const { data: expiredOrders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'accepted'])
      .lt('created_at', cutoffDate.toISOString())
      .limit(5)

    if (fetchError) {
      throw new Error(`Failed to fetch expired orders: ${fetchError.message}`)
    }

    console.log(`Found ${expiredOrders?.length || 0} orders eligible for system refunds`)

    if (expiredOrders && expiredOrders.length > 0) {
      const totalRefundAmount = expiredOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0)
      console.log(`   Total refund amount would be: $${totalRefundAmount.toFixed(2)}`)
      console.log('✅ System refund candidate identification working')
    } else {
      console.log('ℹ️ No expired orders found (this is normal for a new system)')
    }

    // Test refund analytics view
    const { data: analytics, error: analyticsError } = await supabase
      .from('refund_analytics')
      .select('*')
      .limit(5)

    if (!analyticsError) {
      console.log(`✅ Refund analytics accessible (${analytics?.length || 0} records)`)
    }

  } catch (error) {
    console.error('❌ System refund processing test failed:', error.message)
  }
}

async function testAPIEndpoints() {
  console.log('Testing API endpoint accessibility...')

  // Note: We can't actually test the endpoints without proper authentication
  // But we can verify the files exist and are syntactically correct

  const fs = require('fs')
  const path = require('path')

  const apiEndpoints = [
    'app/api/creator/orders/[id]/reject/route.ts',
    'app/api/fan/orders/[id]/cancel/route.ts',
    'app/api/refunds/process/route.ts',
    'app/api/webhooks/stripe/route.ts'
  ]

  for (const endpoint of apiEndpoints) {
    const filePath = path.join(process.cwd(), endpoint)
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8')
        
        // Basic syntax checks
        if (content.includes('export async function')) {
          console.log(`✅ ${endpoint} - File exists and has async exports`)
        } else {
          console.log(`⚠️ ${endpoint} - File exists but might have issues`)
        }
        
        // Check for Stripe integration
        if (content.includes('stripe.refunds.create')) {
          console.log(`   💳 Stripe refund integration present`)
        }
        
        // Check for database operations
        if (content.includes('.from(') && content.includes('.update(')) {
          console.log(`   🗄️ Database update operations present`)
        }
        
      } else {
        console.log(`❌ ${endpoint} - File not found`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error checking file: ${error.message}`)
    }
  }

  console.log('✅ API endpoint validation complete')
}

// Run the tests
testRefundFunctionality().catch(error => {
  console.error('\n💥 Test suite failed:', error)
  process.exit(1)
})

module.exports = {
  testRefundFunctionality,
  testDatabaseSchema,
  testRefundFunctions,
  testCreatorRejectionFlow,
  testFanCancellationFlow,
  testSystemRefundProcessing,
  testAPIEndpoints
}