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

    // Skip storing payment intent in database due to RLS policy issues
    // This will be handled via webhook processing instead
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