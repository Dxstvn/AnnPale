import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      amount, 
      currency = 'usd', 
      metadata = {},
      creatorId,
      requestDetails,
      idempotencyKey 
    } = body

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get creator's Stripe Connect account ID
    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      )
    }

    const { data: creatorProfile, error: creatorError } = await supabase
      .from('profiles')
      .select('stripe_account_id, display_name, username')
      .eq('id', creatorId)
      .single()

    if (creatorError || !creatorProfile) {
      console.error('Creator not found:', creatorError)
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }

    if (!creatorProfile.stripe_account_id) {
      console.error('Creator has no Stripe Connect account:', creatorId)
      return NextResponse.json(
        { error: 'Creator has not set up payments yet' },
        { status: 400 }
      )
    }

    // Calculate 70/30 split (amounts in cents)
    const totalAmount = Math.round(amount * 100) // Convert to cents
    const creatorAmount = Math.round(totalAmount * 0.70) // 70% to creator
    const platformFee = totalAmount - creatorAmount // 30% to platform

    console.log(`💰 Payment setup for ${creatorProfile.display_name || creatorProfile.username}:`);
    console.log(`  Total: $${totalAmount / 100}`);
    console.log(`  → Creator receives: $${creatorAmount / 100} (70% after platform fee)`);
    console.log(`  → Platform fee: $${platformFee / 100} (30% application fee)`);

    // Create payment intent with Stripe Connect (destination charge with application fee)
    // Customer pays full amount, goes to creator, platform takes 30% application fee
    const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
      amount: totalAmount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      // Destination charge: payment goes to creator's account
      transfer_data: {
        destination: creatorProfile.stripe_account_id,
      },
      // Platform automatically receives 30% as application fee
      application_fee_amount: platformFee,
      metadata: {
        userId: user.id,
        userEmail: user.email || '',
        creatorId: creatorId || '',
        creatorStripeAccount: creatorProfile.stripe_account_id,
        totalAmount: totalAmount.toString(),
        creatorAmount: creatorAmount.toString(),
        platformFee: platformFee.toString(),
        requestDetails: JSON.stringify(requestDetails || {}),
        source: 'ann-pale-video-request',
        ...metadata,
      },
      description: requestDetails?.occasion ? 
        `Video request: ${requestDetails.occasion}` : 
        'Ann Pale video request',
    }

    // Add idempotency options if key is provided
    const requestOptions: Stripe.RequestOptions = {}
    if (idempotencyKey) {
      requestOptions.idempotencyKey = idempotencyKey
      console.log('🔑 Using idempotency key:', idempotencyKey)
    }

    const paymentIntent = await stripe.paymentIntents.create(
      paymentIntentOptions,
      requestOptions
    )

    // Update video_request with payment_intent_id if this is a video request
    console.log('🔍 Checking requestDetails for video request ID:', {
      requestDetails: requestDetails,
      requestId: requestDetails?.requestId,
      hasRequestId: !!requestDetails?.requestId
    })

    if (requestDetails?.requestId) {
      console.log('🔄 Attempting to update video request with payment intent ID:', {
        videoRequestId: requestDetails.requestId,
        paymentIntentId: paymentIntent.id,
        userId: user.id,
        userEmail: user.email
      })

      // First, verify the video request exists and belongs to the user
      const { data: existingRequest, error: checkError } = await supabase
        .from('video_requests')
        .select('id, fan_id, status, payment_intent_id, created_at')
        .eq('id', requestDetails.requestId)
        .single()

      console.log('🔍 Pre-update check:', {
        requestExists: !!existingRequest,
        checkError: checkError?.message,
        existingRequest: existingRequest
      })

      if (checkError) {
        console.error('❌ Video request verification failed:', checkError)
      } else if (!existingRequest) {
        console.error('❌ Video request not found:', requestDetails.requestId)
      } else if (existingRequest.fan_id !== user.id) {
        console.error('❌ Video request does not belong to user:', {
          requestFanId: existingRequest.fan_id,
          currentUserId: user.id
        })
      } else if (existingRequest.payment_intent_id) {
        console.warn('⚠️ Video request already has a payment intent:', existingRequest.payment_intent_id)
      } else {
        // Proceed with update
        console.log('✅ Video request verification passed, proceeding with update')

        const { data: updateResult, error: updateError } = await supabase
          .from('video_requests')
          .update({
            payment_intent_id: paymentIntent.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', requestDetails.requestId)
          .eq('fan_id', user.id) // Double-check user ownership
          .select()

        if (updateError) {
          console.error('❌ Failed to update video request with payment intent ID:', updateError)
          console.error('Update error details:', {
            message: updateError.message,
            code: updateError.code,
            details: updateError.details,
            hint: updateError.hint,
            requestId: requestDetails.requestId,
            userId: user.id,
            paymentIntentId: paymentIntent.id
          })
          // Don't fail the payment, just log the error
        } else if (updateResult && updateResult.length > 0) {
          console.log('✅ Successfully updated video request with payment intent ID:', paymentIntent.id)
          console.log('Updated record:', updateResult[0])
        } else {
          console.error('❌ Update succeeded but no records were affected - this indicates a potential RLS or constraint issue')
          console.error('Debug info:', {
            requestId: requestDetails.requestId,
            userId: user.id,
            paymentIntentId: paymentIntent.id
          })
        }
      }
    } else {
      console.warn('⚠️ No requestId found in requestDetails - payment intent will not be linked to video request')
      console.warn('RequestDetails received:', requestDetails)
    }

    console.log('✅ Payment intent created with Stripe Connect destination charge + application fee')
    console.log(`   Payment ID: ${paymentIntent.id}`)
    console.log(`   Amount: $${paymentIntent.amount / 100}`)
    console.log(`   Goes to creator: ${creatorProfile.stripe_account_id}`)
    console.log(`   Creator receives: $${creatorAmount / 100} (after $${platformFee / 100} application fee)`)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}