import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PaymentService } from '@/lib/services'

// POST /api/payments/create-intent - Create payment intent for video request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { creatorId, videoRequestId, amount, currency } = body

    if (!creatorId || !videoRequestId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: creatorId, videoRequestId, amount' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const paymentService = new PaymentService(supabase)

    // Create payment intent
    const paymentResult = await paymentService.createPaymentIntent({
      creatorId,
      videoRequestId,
      amount,
      currency: currency || 'usd',
      metadata: {
        source: 'video_request',
        timestamp: new Date().toISOString()
      }
    })

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paymentResult.data,
      message: 'Payment intent created successfully'
    })

  } catch (error) {
    console.error('Create payment intent error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}