import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkVideoRequest() {
  const paymentIntentId = process.argv[2]

  if (!paymentIntentId) {
    console.error('Usage: pnpm tsx scripts/check-video-request.ts <payment_intent_id>')
    process.exit(1)
  }

  console.log('Checking video request for payment intent:', paymentIntentId)
  console.log('---')

  // Check by payment_intent_id
  const { data: byPaymentIntent, error: error1 } = await supabase
    .from('video_requests')
    .select('*')
    .eq('payment_intent_id', paymentIntentId)
    .single()

  if (error1) {
    console.log('Error fetching by payment_intent_id:', error1.message)
  } else if (byPaymentIntent) {
    console.log('Found by payment_intent_id:')
    console.log('  ID:', byPaymentIntent.id)
    console.log('  Status:', byPaymentIntent.status)
    console.log('  Creator ID:', byPaymentIntent.creator_id)
    console.log('  Fan ID:', byPaymentIntent.fan_id)
    console.log('  Payment Intent ID:', byPaymentIntent.payment_intent_id)
    console.log('  Created:', byPaymentIntent.created_at)
  } else {
    console.log('No video request found with payment_intent_id:', paymentIntentId)
  }

  console.log('---')

  // Also try as regular ID
  const { data: byId, error: error2 } = await supabase
    .from('video_requests')
    .select('*')
    .eq('id', paymentIntentId)
    .single()

  if (error2) {
    console.log('Error fetching by id:', error2.message)
  } else if (byId) {
    console.log('Found by ID:')
    console.log('  ID:', byId.id)
    console.log('  Status:', byId.status)
    console.log('  Creator ID:', byId.creator_id)
    console.log('  Fan ID:', byId.fan_id)
    console.log('  Payment Intent ID:', byId.payment_intent_id)
    console.log('  Created:', byId.created_at)
  } else {
    console.log('No video request found with id:', paymentIntentId)
  }

  console.log('---')

  // Get all recent video requests to see what's in the table
  const { data: recentRequests, error: error3 } = await supabase
    .from('video_requests')
    .select('id, status, payment_intent_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error3) {
    console.log('Error fetching recent requests:', error3.message)
  } else {
    console.log('Recent video requests:')
    recentRequests?.forEach(req => {
      console.log(`  ${req.id.slice(0, 8)}... | ${req.status} | PI: ${req.payment_intent_id || 'none'} | ${req.created_at}`)
    })
  }
}

checkVideoRequest().catch(console.error)