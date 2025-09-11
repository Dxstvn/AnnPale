/**
 * Test script to simulate a new video request for testing real-time notifications
 */

// Load environment variables first
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')
  console.error('This key is required to bypass RLS for testing')
  process.exit(1)
}

// Initialize Supabase client with service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTestVideoRequest() {
  try {
    console.log('Creating test video request...')
    
    // Use hardcoded test IDs for demonstration
    // These would normally come from authenticated users
    const testCreatorId = '8f1b8339-3ca7-4c84-8392-a7e83d534bcc' // The creator ID from the checkout page URL
    const testFanId = 'c948265a-fb81-4c40-be8d-8dd536433738' // A test fan ID
    
    console.log('Using test creator ID:', testCreatorId)
    console.log('Using test fan ID:', testFanId)
    
    // Create a test video request (matching actual database schema)
    const videoRequest = {
      fan_id: testFanId,
      creator_id: testCreatorId,
      request_type: 'personal', // Required field
      occasion: 'birthday', // Use lowercase to match existing data
      recipient_name: 'Test Recipient',
      instructions: 'This is a test video request to verify real-time notifications are working correctly! Please wish Test Recipient a happy birthday.',
      status: 'pending',
      price: 50, // Changed from price_usd to price
      platform_fee: 0
    }
    
    console.log('Inserting video request:', videoRequest)
    
    const { data, error } = await supabase
      .from('video_requests')
      .insert([videoRequest])
      .select()
    
    if (error) {
      console.error('Error creating video request:', error)
      return
    }
    
    console.log('✅ Successfully created test video request!')
    console.log('Request ID:', data[0].id)
    console.log('\n📌 Now check the creator dashboard to see if the notification appears!')
    console.log('Creator should be logged in with ID:', testCreatorId)
    console.log('\n🔔 To test:')
    console.log('1. Log in as a creator')
    console.log('2. Go to /creator/requests or any creator page')
    console.log('3. The notification should appear in real-time!')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    process.exit(0)
  }
}

// Run the test
createTestVideoRequest()