#!/usr/bin/env tsx
/**
 * Test pausing a subscription
 */

import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') })

async function testPause() {
  const subscriptionId = 'b134b161-3318-4a68-8c58-68ffb90737bc' // Your active subscription

  console.log('🧪 Testing subscription pause functionality\n')
  console.log(`Subscription ID: ${subscriptionId}`)

  const url = 'http://localhost:3000/api/stripe/subscriptions/manage'

  // Create a mock auth token (you'd need real auth in production)
  const mockHeaders = {
    'Content-Type': 'application/json',
    // In a real scenario, you'd need proper authentication headers
  }

  console.log('\n📋 Testing pause action...')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: mockHeaders,
      body: JSON.stringify({
        subscriptionOrderId: subscriptionId,
        action: 'pause'
      })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Pause request successful!')
      console.log('Response:', JSON.stringify(result, null, 2))
    } else {
      console.log(`❌ Pause request failed with status ${response.status}`)
      console.log('Error:', result)
    }
  } catch (error) {
    console.error('❌ Failed to test pause:', error)
  }

  console.log('\n💡 Note: This test requires authentication. Please test through the UI instead.')
  console.log('Go to: http://localhost:3000/fan/subscriptions')
  console.log('And try pausing the "Basic Fan" subscription')
}

testPause()