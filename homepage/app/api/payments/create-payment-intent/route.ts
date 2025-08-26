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
      requestDetails 
    } = body

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.id,
        userEmail: user.email || '',
        creatorId: creatorId || '',
        ...metadata,
      },
      description: requestDetails?.occasion ? 
        `Video request: ${requestDetails.occasion}` : 
        'Ann Pale video request',
    })

    // Store payment intent in database
    const { error: dbError } = await supabase
      .from('payment_intents')
      .insert({
        id: paymentIntent.id,
        user_id: user.id,
        amount: amount,
        currency: currency,
        status: paymentIntent.status,
        creator_id: creatorId,
        metadata: { requestDetails, ...metadata },
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Error storing payment intent:', dbError)
      // Continue anyway - payment can still be processed
    }

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