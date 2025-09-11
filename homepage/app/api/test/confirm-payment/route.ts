import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  // Only allow in test environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in test environment' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { paymentIntentId } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      )
    }

    console.log(`[TEST] Manually confirming payment intent: ${paymentIntentId}`)

    // Get the payment intent details first
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    console.log(`[TEST] Payment intent status: ${paymentIntent.status}`)
    
    // Use Stripe's test payment method token instead of raw card data
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: 'tok_visa', // Stripe's test token for Visa 4242424242424242
      },
    })
    
    // Attach the payment method to the payment intent
    const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      payment_method: paymentMethod.id,
    })

    // Then confirm the payment (no return_url needed since it's not a redirect method)
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId)

    console.log(`[TEST] Payment intent confirmed with status: ${confirmedPaymentIntent.status}`)

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: confirmedPaymentIntent.id,
        status: confirmedPaymentIntent.status,
        amount: confirmedPaymentIntent.amount,
        currency: confirmedPaymentIntent.currency,
      }
    })
  } catch (error) {
    console.error('[TEST] Error confirming payment:', error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}