import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// GET /api/stripe/payment-intents/[id] - Retrieve payment intent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentIntentId } = await params

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    })

  } catch (error: any) {
    console.error('Stripe payment intent retrieval error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve payment intent',
        details: error.message 
      },
      { status: 500 }
    )
  }
}