import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { paymentIntentId } = body

    if (!paymentIntentId || !paymentIntentId.startsWith('pi_')) {
      return NextResponse.json(
        { error: 'Invalid payment intent ID', success: false },
        { status: 400 }
      )
    }

    console.log('🔄 Attempting automatic recovery for payment intent:', paymentIntentId)

    // Step 1: Get payment intent details from Stripe
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    } catch (stripeError) {
      console.error('Failed to retrieve payment intent from Stripe:', stripeError)
      return NextResponse.json(
        { error: 'Payment intent not found in Stripe', success: false },
        { status: 404 }
      )
    }

    console.log('💳 Payment intent found:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: paymentIntent.status,
      userEmail: paymentIntent.metadata?.userEmail,
      creatorId: paymentIntent.metadata?.creatorId,
      requestId: paymentIntent.metadata?.requestDetails ? JSON.parse(paymentIntent.metadata.requestDetails)?.requestId : null
    })

    // Step 2: Try to find matching video request
    const amount = paymentIntent.amount / 100 // Convert from cents
    const createdAt = new Date(paymentIntent.created * 1000)
    const userEmail = paymentIntent.metadata?.userEmail
    const creatorId = paymentIntent.metadata?.creatorId

    // First, try to find by the exact requestId in the metadata
    let videoRequest = null
    try {
      const requestDetails = paymentIntent.metadata?.requestDetails ? JSON.parse(paymentIntent.metadata.requestDetails) : null
      if (requestDetails?.requestId) {
        console.log('🔍 Trying to find video request by exact requestId:', requestDetails.requestId)

        const { data, error } = await supabase
          .from('video_requests')
          .select('*')
          .eq('id', requestDetails.requestId)
          .eq('fan_id', user.id)
          .maybeSingle()

        if (!error && data) {
          videoRequest = data
          console.log('✅ Found video request by exact requestId')
        }
      }
    } catch (metadataError) {
      console.warn('Could not parse request metadata:', metadataError)
    }

    // If not found by exact ID, search by criteria
    if (!videoRequest) {
      console.log('🔍 Searching by amount, creator, and time window')

      // Create a time window around payment intent creation (±30 minutes)
      const timeWindowStart = new Date(createdAt.getTime() - 30 * 60 * 1000)
      const timeWindowEnd = new Date(createdAt.getTime() + 30 * 60 * 1000)

      let query = supabase
        .from('video_requests')
        .select('*')
        .eq('fan_id', user.id) // Ensure it belongs to the current user
        .eq('price', amount)
        .gte('created_at', timeWindowStart.toISOString())
        .lte('created_at', timeWindowEnd.toISOString())
        .is('payment_intent_id', null) // Only orphaned requests

      // Add creator filter if available
      if (creatorId) {
        query = query.eq('creator_id', creatorId)
      }

      const { data: candidateRequests, error: searchError } = await query

      if (searchError) {
        console.error('Error searching for candidate requests:', searchError)
        return NextResponse.json(
          { error: 'Database search failed', success: false },
          { status: 500 }
        )
      }

      if (candidateRequests && candidateRequests.length > 0) {
        // Use the first matching request (they should all be from the same user)
        videoRequest = candidateRequests[0]
        console.log(`✅ Found ${candidateRequests.length} candidate(s), using first match`)
      }
    }

    if (!videoRequest) {
      console.log('❌ No matching video request found')
      return NextResponse.json(
        { error: 'No matching video request found', success: false },
        { status: 404 }
      )
    }

    // Step 3: Update the video request with the payment intent ID
    console.log('🔄 Linking payment intent to video request:', {
      paymentIntentId,
      videoRequestId: videoRequest.id
    })

    const { data: updateResult, error: updateError } = await supabase
      .from('video_requests')
      .update({
        payment_intent_id: paymentIntentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoRequest.id)
      .eq('fan_id', user.id) // Double-check ownership
      .select()

    if (updateError) {
      console.error('Failed to update video request:', updateError)
      return NextResponse.json(
        { error: 'Failed to link payment intent', success: false },
        { status: 500 }
      )
    }

    if (!updateResult || updateResult.length === 0) {
      console.error('Update succeeded but no records affected')
      return NextResponse.json(
        { error: 'Failed to update video request', success: false },
        { status: 500 }
      )
    }

    console.log('✅ Successfully recovered orphaned payment intent')

    return NextResponse.json({
      success: true,
      videoRequestId: videoRequest.id,
      paymentIntentId: paymentIntentId,
      message: 'Payment intent successfully linked to video request'
    })

  } catch (error) {
    console.error('Error recovering orphaned payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}