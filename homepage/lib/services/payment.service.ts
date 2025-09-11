import { BaseService, ServiceResult } from './base.service'
import type { Database } from '@/types/supabase'

type PaymentIntent = Database['public']['Tables']['payment_intents']['Row']
type PaymentIntentInsert = Database['public']['Tables']['payment_intents']['Insert']
type Payment = Database['public']['Tables']['payments']['Row']

export interface CreatePaymentIntentParams {
  creatorId: string
  videoRequestId: string
  amount: number
  currency?: string
  metadata?: Record<string, any>
}

export interface PaymentIntentResult {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
  metadata?: Record<string, any>
}

export interface PaymentSplit {
  totalAmount: number
  platformFee: number // 30%
  creatorEarnings: number // 70%
  stripeFee?: number
  netPlatformFee?: number
}

export interface UpdatePaymentIntentStatusParams {
  paymentIntentId: string
  status: string
  metadata?: Record<string, any>
}

export interface CreatePaymentRecordParams {
  orderId: string
  stripePaymentId: string
  amount: number
  platformFee: number
  creatorEarnings: number
  stripeFee?: number
  status: string
}

export class PaymentService extends BaseService {
  private readonly PLATFORM_FEE_PERCENTAGE = 0.30 // 30% platform fee
  private readonly CREATOR_EARNINGS_PERCENTAGE = 0.70 // 70% creator earnings

  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<ServiceResult<PaymentIntentResult>> {
    try {
      this.validateRequired(params.creatorId, 'Creator ID')
      this.validateRequired(params.videoRequestId, 'Video request ID')
      this.validateAmount(params.amount, 'Payment amount')
      this.validateUUID(params.creatorId, 'Creator ID')
      this.validateUUID(params.videoRequestId, 'Video request ID')

      const user = await this.getCurrentUser()
      
      // Verify the creator exists and has Stripe Connect setup
      const { data: creator } = await this.supabase
        .from('profiles')
        .select('id, display_name')
        .eq('id', params.creatorId)
        .eq('user_type', 'creator')
        .single()

      if (!creator) {
        return this.handleError(new Error('Creator not found'), 'createPaymentIntent')
      }

      // Check if creator has Stripe account
      const { data: stripeAccount } = await this.supabase
        .from('stripe_accounts')
        .select('stripe_account_id, onboarding_complete')
        .eq('creator_id', params.creatorId)
        .single()

      if (!stripeAccount?.onboarding_complete) {
        return {
          success: false,
          error: 'Creator has not completed Stripe onboarding'
        }
      }

      // Verify the video request exists and belongs to current user
      const { data: videoRequest } = await this.supabase
        .from('video_requests')
        .select('id, user_id, creator_id, status, price')
        .eq('id', params.videoRequestId)
        .eq('user_id', user.id)
        .eq('creator_id', params.creatorId)
        .single()

      if (!videoRequest) {
        return {
          success: false,
          error: 'Video request not found or access denied'
        }
      }

      if (videoRequest.status !== 'pending') {
        return {
          success: false,
          error: 'Video request is not in pending status'
        }
      }

      // Calculate payment split
      const paymentSplit = this.calculatePaymentSplit(params.amount)

      // Create Stripe payment intent
      const stripeResponse = await this.createStripePaymentIntent({
        amount: params.amount,
        currency: params.currency || 'usd',
        connectedAccountId: stripeAccount.stripe_account_id,
        applicationFeeAmount: paymentSplit.platformFee,
        metadata: {
          userId: user.id,
          creatorId: params.creatorId,
          videoRequestId: params.videoRequestId,
          platformFee: paymentSplit.platformFee.toString(),
          creatorEarnings: paymentSplit.creatorEarnings.toString(),
          ...params.metadata
        }
      })

      if (!stripeResponse.success || !stripeResponse.data) {
        return stripeResponse
      }

      // Store payment intent in database
      const paymentIntentData: PaymentIntentInsert = {
        id: stripeResponse.data.id,
        user_id: user.id,
        creator_id: params.creatorId,
        amount: params.amount,
        currency: params.currency || 'usd',
        status: stripeResponse.data.status,
        metadata: stripeResponse.data.metadata
      }

      const { error: dbError } = await this.supabase
        .from('payment_intents')
        .insert(paymentIntentData)

      if (dbError) {
        return this.handleError(dbError, 'createPaymentIntent - database insert')
      }

      return {
        success: true,
        data: stripeResponse.data
      }

    } catch (error) {
      return this.handleError(error, 'createPaymentIntent')
    }
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<ServiceResult<PaymentIntent>> {
    try {
      this.validateRequired(paymentIntentId, 'Payment intent ID')

      const user = await this.getCurrentUser()

      // Get payment intent from database
      const { data: paymentIntent, error } = await this.supabase
        .from('payment_intents')
        .select('*')
        .eq('id', paymentIntentId)
        .eq('user_id', user.id)
        .single()

      if (error || !paymentIntent) {
        return {
          success: false,
          error: 'Payment intent not found'
        }
      }

      // Verify payment with Stripe
      const stripePayment = await this.retrieveStripePaymentIntent(paymentIntentId)
      
      if (!stripePayment.success) {
        return stripePayment
      }

      // Update payment intent status
      const { data: updatedIntent, error: updateError } = await this.supabase
        .from('payment_intents')
        .update({ 
          status: stripePayment.data!.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentIntentId)
        .select()
        .single()

      if (updateError) {
        return this.handleError(updateError, 'confirmPaymentIntent')
      }

      return {
        success: true,
        data: updatedIntent
      }

    } catch (error) {
      return this.handleError(error, 'confirmPaymentIntent')
    }
  }

  async updatePaymentIntentStatus(params: UpdatePaymentIntentStatusParams): Promise<ServiceResult<PaymentIntent>> {
    try {
      this.validateRequired(params.paymentIntentId, 'Payment intent ID')
      this.validateRequired(params.status, 'Status')

      const updateData: any = {
        status: params.status,
        updated_at: new Date().toISOString()
      }

      if (params.metadata) {
        updateData.metadata = params.metadata
      }

      const { data: updatedIntent, error } = await this.supabase
        .from('payment_intents')
        .update(updateData)
        .eq('id', params.paymentIntentId)
        .select()
        .single()

      if (error) {
        return this.handleError(error, 'updatePaymentIntentStatus')
      }

      return {
        success: true,
        data: updatedIntent
      }

    } catch (error) {
      return this.handleError(error, 'updatePaymentIntentStatus')
    }
  }

  async createPaymentRecord(params: CreatePaymentRecordParams): Promise<ServiceResult<Payment>> {
    try {
      this.validateRequired(params.orderId, 'Order ID')
      this.validateRequired(params.stripePaymentId, 'Stripe payment ID')
      this.validateAmount(params.amount, 'Amount')
      this.validateAmount(params.platformFee, 'Platform fee')
      this.validateAmount(params.creatorEarnings, 'Creator earnings')

      const netPlatformFee = params.stripeFee 
        ? params.platformFee - params.stripeFee 
        : params.platformFee

      const { data: payment, error } = await this.supabase
        .from('payments')
        .insert({
          order_id: params.orderId,
          stripe_payment_id: params.stripePaymentId,
          amount: params.amount,
          platform_fee: params.platformFee,
          creator_earnings: params.creatorEarnings,
          stripe_fee: params.stripeFee || null,
          net_platform_fee: netPlatformFee,
          status: params.status,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return this.handleError(error, 'createPaymentRecord')
      }

      return {
        success: true,
        data: payment
      }

    } catch (error) {
      return this.handleError(error, 'createPaymentRecord')
    }
  }

  calculatePaymentSplit(totalAmount: number): PaymentSplit {
    const platformFee = Math.round(totalAmount * this.PLATFORM_FEE_PERCENTAGE)
    const creatorEarnings = totalAmount - platformFee

    return {
      totalAmount,
      platformFee,
      creatorEarnings
    }
  }

  private async createStripePaymentIntent(params: {
    amount: number
    currency: string
    connectedAccountId: string
    applicationFeeAmount: number
    metadata: Record<string, string>
  }): Promise<ServiceResult<PaymentIntentResult>> {
    try {
      // Call our internal Stripe API
      const response = await fetch('/api/stripe/payment-intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Stripe API error: ${error}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data: {
          id: data.id,
          clientSecret: data.client_secret,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          metadata: data.metadata
        }
      }

    } catch (error) {
      return this.handleError(error, 'createStripePaymentIntent')
    }
  }

  private async retrieveStripePaymentIntent(paymentIntentId: string): Promise<ServiceResult<{ status: string }>> {
    try {
      const response = await fetch(`/api/stripe/payment-intents/${paymentIntentId}`)
      
      if (!response.ok) {
        throw new Error('Failed to retrieve payment intent from Stripe')
      }

      const data = await response.json()
      
      return {
        success: true,
        data: {
          status: data.status
        }
      }

    } catch (error) {
      return this.handleError(error, 'retrieveStripePaymentIntent')
    }
  }

  async getPaymentHistory(userId?: string): Promise<ServiceResult<PaymentIntent[]>> {
    try {
      const user = userId ? { id: userId } : await this.getCurrentUser()

      const { data: payments, error } = await this.supabase
        .from('payment_intents')
        .select(`
          *,
          creator:profiles!creator_id(display_name, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return this.handleError(error, 'getPaymentHistory')
      }

      return {
        success: true,
        data: payments || []
      }

    } catch (error) {
      return this.handleError(error, 'getPaymentHistory')
    }
  }

  async getCreatorEarnings(creatorId?: string): Promise<ServiceResult<Payment[]>> {
    try {
      const user = creatorId ? { id: creatorId } : await this.getCurrentUser()

      const { data: earnings, error } = await this.supabase
        .from('payments')
        .select(`
          *,
          order:orders!order_id(
            id,
            user:profiles!user_id(display_name, avatar_url),
            video_request:video_requests(title, description)
          )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return this.handleError(error, 'getCreatorEarnings')
      }

      return {
        success: true,
        data: earnings || []
      }

    } catch (error) {
      return this.handleError(error, 'getCreatorEarnings')
    }
  }
}