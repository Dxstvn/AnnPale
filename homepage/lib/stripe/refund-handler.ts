/**
 * Stripe Connect Refund Handler
 * 
 * Handles proper refund distribution for destination charges with application fees.
 * Ensures refunds are split correctly between creator and platform accounts.
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export interface RefundRequest {
  paymentIntentId: string
  refundAmount: number // In dollars
  originalAmount: number // In dollars  
  creatorAmount: number // In dollars (70% of original)
  platformFee: number // In dollars (30% of original)
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  metadata?: Record<string, string>
}

export interface RefundResult {
  success: boolean
  mainRefund?: Stripe.Refund
  applicationFeeRefund?: Stripe.ApplicationFeeRefund
  totalRefunded: number
  creatorRefunded: number
  platformRefunded: number
  error?: string
}

/**
 * Process a refund for a Stripe Connect destination charge with application fee
 * 
 * This handles the complex case where money needs to be refunded from both:
 * 1. Creator's account (the destination of the transfer)
 * 2. Platform's account (the application fee portion)
 */
export async function processConnectRefund(request: RefundRequest): Promise<RefundResult> {
  try {
    const {
      paymentIntentId,
      refundAmount,
      originalAmount,
      creatorAmount,
      platformFee,
      reason,
      metadata = {}
    } = request

    console.log('🔄 Processing Connect refund:', {
      paymentIntentId,
      refundAmount,
      originalAmount,
      creatorAmount,
      platformFee
    })

    // Calculate proportional refund amounts
    const refundRatio = refundAmount / originalAmount
    const creatorRefundAmount = Math.round(creatorAmount * refundRatio * 100) // Convert to cents
    const platformRefundAmount = Math.round(platformFee * refundRatio * 100) // Convert to cents
    
    console.log('💰 Refund distribution:', {
      refundRatio,
      creatorRefund: creatorRefundAmount / 100,
      platformRefund: platformRefundAmount / 100,
      total: (creatorRefundAmount + platformRefundAmount) / 100
    })

    // Step 1: Get the original charge to find the application fee
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (!paymentIntent.charges?.data?.[0]) {
      throw new Error('No charge found for payment intent')
    }

    const charge = paymentIntent.charges.data[0]
    const applicationFeeId = charge.application_fee as string

    console.log('📋 Charge details:', {
      chargeId: charge.id,
      applicationFeeId,
      amount: charge.amount / 100
    })

    let mainRefund: Stripe.Refund | undefined
    let applicationFeeRefund: Stripe.ApplicationFeeRefund | undefined

    // Step 2: Refund the main charge (this comes from creator's account)
    if (creatorRefundAmount > 0) {
      console.log('🔄 Creating main refund from creator account...')
      
      mainRefund = await stripe.refunds.create({
        charge: charge.id,
        amount: creatorRefundAmount,
        reason,
        metadata: {
          ...metadata,
          refund_type: 'creator_portion',
          creator_refund_amount: (creatorRefundAmount / 100).toString(),
          platform_refund_amount: (platformRefundAmount / 100).toString()
        }
      })

      console.log('✅ Main refund created:', mainRefund.id)
    }

    // Step 3: Refund the application fee (this comes from platform account) 
    if (platformRefundAmount > 0 && applicationFeeId) {
      console.log('🔄 Creating application fee refund from platform account...')
      
      try {
        applicationFeeRefund = await stripe.applicationFees.createRefund(
          applicationFeeId,
          {
            amount: platformRefundAmount,
            metadata: {
              ...metadata,
              refund_type: 'platform_fee_portion',
              original_payment_intent: paymentIntentId
            }
          }
        )

        console.log('✅ Application fee refund created:', applicationFeeRefund.id)
      } catch (feeRefundError: any) {
        console.error('❌ Application fee refund failed:', feeRefundError.message)
        
        // If we can't refund the application fee, we should reverse the main refund
        if (mainRefund) {
          console.log('🔄 Attempting to reverse main refund due to fee refund failure...')
          try {
            await stripe.refunds.cancel(mainRefund.id)
            console.log('✅ Main refund cancelled successfully')
          } catch (cancelError) {
            console.error('❌ Could not cancel main refund:', cancelError)
          }
        }
        
        throw new Error(`Application fee refund failed: ${feeRefundError.message}`)
      }
    }

    const result: RefundResult = {
      success: true,
      mainRefund,
      applicationFeeRefund,
      totalRefunded: refundAmount,
      creatorRefunded: creatorRefundAmount / 100,
      platformRefunded: platformRefundAmount / 100
    }

    console.log('✅ Connect refund completed successfully:', {
      totalRefunded: result.totalRefunded,
      creatorRefunded: result.creatorRefunded,
      platformRefunded: result.platformRefunded
    })

    return result

  } catch (error: any) {
    console.error('❌ Connect refund failed:', error)
    
    return {
      success: false,
      totalRefunded: 0,
      creatorRefunded: 0,
      platformRefunded: 0,
      error: error.message
    }
  }
}

/**
 * Helper function to calculate refund amounts based on original payment split
 */
export function calculateRefundSplit(
  originalAmount: number,
  refundAmount: number,
  creatorPercentage: number = 0.70
): {
  creatorAmount: number
  platformAmount: number
  creatorRefund: number
  platformRefund: number
} {
  const creatorAmount = originalAmount * creatorPercentage
  const platformAmount = originalAmount * (1 - creatorPercentage)
  
  const refundRatio = refundAmount / originalAmount
  const creatorRefund = creatorAmount * refundRatio
  const platformRefund = platformAmount * refundRatio
  
  return {
    creatorAmount,
    platformAmount, 
    creatorRefund,
    platformRefund
  }
}

/**
 * Validate that a refund request is valid for the given payment
 */
export async function validateRefundRequest(
  paymentIntentId: string,
  requestedAmount: number
): Promise<{ valid: boolean; error?: string; maxRefundable?: number }> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return { valid: false, error: 'Payment not completed' }
    }
    
    // Calculate how much has already been refunded
    const alreadyRefunded = paymentIntent.charges?.data?.[0]?.amount_refunded || 0
    const maxRefundable = (paymentIntent.amount - alreadyRefunded) / 100
    
    if (requestedAmount > maxRefundable) {
      return { 
        valid: false, 
        error: `Refund amount ($${requestedAmount}) exceeds refundable amount ($${maxRefundable})`,
        maxRefundable
      }
    }
    
    return { valid: true, maxRefundable }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}