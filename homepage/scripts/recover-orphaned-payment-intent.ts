import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const stripeSecretKey = process.env.STRIPE_SANDBOX_SECRET_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
})

async function recoverOrphanedPaymentIntent() {
  const orphanedPaymentIntentId = 'pi_3SBJ2TENu9K8Thcg0ZqAXVLc'

  console.log('🔍 Investigating orphaned payment intent:', orphanedPaymentIntentId)

  try {
    // Step 1: Get payment intent details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(orphanedPaymentIntentId)
    console.log('💳 Payment Intent Details:')
    console.log('  Amount:', paymentIntent.amount / 100, 'USD')
    console.log('  Status:', paymentIntent.status)
    console.log('  Created:', new Date(paymentIntent.created * 1000).toISOString())
    console.log('  Customer email:', paymentIntent.metadata?.userEmail || 'Not set')
    console.log('  Creator ID:', paymentIntent.metadata?.creatorId || 'Not set')
    console.log('  Request Details:', paymentIntent.metadata?.requestDetails || 'Not set')

    // Step 2: Try to find matching video request
    const amount = paymentIntent.amount / 100 // Convert from cents
    const createdAt = new Date(paymentIntent.created * 1000)
    const userEmail = paymentIntent.metadata?.userEmail
    const creatorId = paymentIntent.metadata?.creatorId

    // Create a time window around payment intent creation (±30 minutes)
    const timeWindowStart = new Date(createdAt.getTime() - 30 * 60 * 1000)
    const timeWindowEnd = new Date(createdAt.getTime() + 30 * 60 * 1000)

    console.log('\n🔍 Searching for matching video requests...')
    console.log('  Time window:', timeWindowStart.toISOString(), 'to', timeWindowEnd.toISOString())
    console.log('  Expected amount: $', amount)
    console.log('  Creator ID:', creatorId)

    let query = supabase
      .from('video_requests')
      .select(`
        *,
        creator:creator_id (
          id,
          display_name,
          username,
          avatar_url
        ),
        fan:fan_id (
          id,
          email
        )
      `)
      .eq('price', amount)
      .gte('created_at', timeWindowStart.toISOString())
      .lte('created_at', timeWindowEnd.toISOString())
      .is('payment_intent_id', null)

    // Add creator filter if available
    if (creatorId) {
      query = query.eq('creator_id', creatorId)
    }

    const { data: candidateRequests, error: searchError } = await query

    if (searchError) {
      console.error('❌ Error searching for candidate requests:', searchError)
      return
    }

    console.log(`📋 Found ${candidateRequests?.length || 0} candidate video requests`)

    if (candidateRequests && candidateRequests.length > 0) {
      candidateRequests.forEach((request, index) => {
        console.log(`\n  Candidate ${index + 1}:`)
        console.log('    ID:', request.id)
        console.log('    Fan email:', request.fan?.email || 'N/A')
        console.log('    Creator:', request.creator?.display_name || request.creator?.username || 'N/A')
        console.log('    Amount: $', request.price)
        console.log('    Status:', request.status)
        console.log('    Created:', request.created_at)
        console.log('    Current payment intent:', request.payment_intent_id || 'Not set')
      })

      // Step 3: Find the best match
      let bestMatch = null

      // Priority 1: Email match (if available)
      if (userEmail) {
        bestMatch = candidateRequests.find(req => req.fan?.email === userEmail)
        if (bestMatch) {
          console.log('\n✅ Found match by email:', userEmail)
        }
      }

      // Priority 2: Creator match + first chronologically
      if (!bestMatch && creatorId) {
        const creatorMatches = candidateRequests.filter(req => req.creator_id === creatorId)
        if (creatorMatches.length > 0) {
          bestMatch = creatorMatches.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
          console.log('\n✅ Found match by creator and time:', creatorId)
        }
      }

      // Priority 3: First match by amount and time
      if (!bestMatch) {
        bestMatch = candidateRequests.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
        console.log('\n⚠️ Using best guess match by amount and time')
      }

      if (bestMatch) {
        console.log('\n🎯 Selected video request for recovery:')
        console.log('  Request ID:', bestMatch.id)
        console.log('  Fan email:', bestMatch.fan?.email || 'N/A')
        console.log('  Creator:', bestMatch.creator?.display_name || bestMatch.creator?.username || 'N/A')
        console.log('  Amount: $', bestMatch.price)
        console.log('  Status:', bestMatch.status)

        // Step 4: Update the video request with the payment intent ID
        console.log('\n🔄 Updating video request with payment intent ID...')

        const { data: updateResult, error: updateError } = await supabase
          .from('video_requests')
          .update({
            payment_intent_id: orphanedPaymentIntentId,
            status: 'pending_payment' // Ensure status is correct
          })
          .eq('id', bestMatch.id)
          .select()

        if (updateError) {
          console.error('❌ Failed to update video request:', updateError)
          return
        }

        if (updateResult && updateResult.length > 0) {
          console.log('✅ Successfully linked orphaned payment intent to video request!')
          console.log('  Updated record:', updateResult[0])
          console.log(`\n📱 The order should now be accessible at:`)
          console.log(`  http://localhost:3000/en/fan/orders/${orphanedPaymentIntentId}`)
          console.log(`  http://localhost:3000/en/fan/orders/${bestMatch.id}`)
        } else {
          console.error('❌ Update succeeded but no records were affected')
        }
      }

    } else {
      console.log('❌ No matching video requests found for this payment intent')
      console.log('   This payment intent may be for a different type of transaction')
      console.log('   or the video request may have been deleted/modified')
    }

  } catch (error) {
    console.error('❌ Error recovering orphaned payment intent:', error)
  }
}

// Also create a function to find all orphaned payment intents
async function findAllOrphanedPaymentIntents() {
  console.log('\n🔍 Searching for all orphaned payment intents...')

  try {
    // Get recent payment intents from Stripe (last 100)
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60) // Last 7 days
      }
    })

    console.log(`📋 Found ${paymentIntents.data.length} recent payment intents`)

    const orphanedIntents = []

    for (const pi of paymentIntents.data) {
      // Check if this payment intent exists in our database
      const { data: existingRequest } = await supabase
        .from('video_requests')
        .select('id, payment_intent_id')
        .eq('payment_intent_id', pi.id)
        .maybeSingle()

      if (!existingRequest) {
        orphanedIntents.push({
          id: pi.id,
          amount: pi.amount / 100,
          status: pi.status,
          created: new Date(pi.created * 1000).toISOString(),
          userEmail: pi.metadata?.userEmail,
          creatorId: pi.metadata?.creatorId
        })
      }
    }

    if (orphanedIntents.length > 0) {
      console.log(`\n⚠️ Found ${orphanedIntents.length} orphaned payment intents:`)
      orphanedIntents.forEach((pi, index) => {
        console.log(`\n  ${index + 1}. ${pi.id}`)
        console.log(`     Amount: $${pi.amount}`)
        console.log(`     Status: ${pi.status}`)
        console.log(`     Created: ${pi.created}`)
        console.log(`     User email: ${pi.userEmail || 'Not set'}`)
        console.log(`     Creator ID: ${pi.creatorId || 'Not set'}`)
      })
    } else {
      console.log('✅ No orphaned payment intents found')
    }

  } catch (error) {
    console.error('❌ Error searching for orphaned payment intents:', error)
  }
}

async function main() {
  console.log('🚀 Payment Intent Recovery Tool')
  console.log('================================')

  // First, try to recover the specific orphaned payment intent
  await recoverOrphanedPaymentIntent()

  // Then, search for all orphaned payment intents
  await findAllOrphanedPaymentIntents()
}

main().catch(console.error)