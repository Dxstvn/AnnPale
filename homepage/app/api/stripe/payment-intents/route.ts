import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// POST /api/stripe/payment-intents - Create a payment intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      amount, 
      currency, 
      connectedAccountId, 
      applicationFeeAmount, 
      metadata 
    } = body

    if (!amount || !currency || !connectedAccountId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency, connectedAccountId' },
        { status: 400 }
      )
    }

    // Create payment intent with Stripe Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      application_fee_amount: Math.round(applicationFeeAmount * 100), // 30% platform fee
      transfer_data: {
        destination: connectedAccountId,
      },
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    })

    return NextResponse.json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    })

  } catch (error: any) {
    console.error('Stripe payment intent creation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error.message 
      },
      { status: 500 }
    )
  }
}