import { BaseService, ServiceResult } from './base.service'
import type { Database } from '@/types/supabase'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

export interface CreateOrderParams {
  videoRequestId: string
  paymentIntentId: string
  amount: number
  platformFee: number
  creatorEarnings: number
  currency?: string
  metadata?: Record<string, any>
}

export interface CreateOrderFromWebhookParams {
  videoRequestId: string
  paymentIntentId: string
  userId: string
  creatorId: string
  amount: number
  platformFee: number
  creatorEarnings: number
  currency?: string
  metadata?: Record<string, any>
}

export interface UpdateOrderStatusParams {
  orderId: string
  status: OrderStatus
  metadata?: Record<string, any>
}

export interface OrderWithDetails extends Order {
  user: {
    id: string
    display_name: string
    avatar_url?: string
    email?: string
  }
  creator: {
    id: string
    display_name: string
    avatar_url?: string
  }
  video_request: {
    id: string
    title: string
    description?: string
    occasion?: string
    recipient_name?: string
  }
  video_upload?: {
    id: string
    video_url?: string
    thumbnail_url?: string
    duration?: number
    processing_status: string
  }
}

export type OrderStatus = 
  | 'pending'           // Just created, awaiting creator acceptance
  | 'accepted'          // Creator accepted, video in progress
  | 'in_progress'       // Creator is working on video
  | 'completed'         // Video delivered
  | 'rejected'          // Creator rejected the request
  | 'refunded'          // Order was refunded
  | 'disputed'          // Order is in dispute

export class OrderService extends BaseService {
  async createOrderFromWebhook(params: CreateOrderFromWebhookParams): Promise<ServiceResult<Order>> {
    try {
      this.validateRequired(params.videoRequestId, 'Video request ID')
      this.validateRequired(params.paymentIntentId, 'Payment intent ID')
      this.validateRequired(params.userId, 'User ID')
      this.validateRequired(params.creatorId, 'Creator ID')
      this.validateAmount(params.amount, 'Order amount')
      this.validateAmount(params.platformFee, 'Platform fee')
      this.validateAmount(params.creatorEarnings, 'Creator earnings')
      this.validateUUID(params.videoRequestId, 'Video request ID')
      this.validateUUID(params.userId, 'User ID')
      this.validateUUID(params.creatorId, 'Creator ID')

      // Verify payment amounts
      const expectedSplit = this.calculatePaymentSplit(params.amount)
      if (params.platformFee !== expectedSplit.platformFee || 
          params.creatorEarnings !== expectedSplit.creatorEarnings) {
        return {
          success: false,
          error: 'Invalid payment split amounts'
        }
      }

      // Create the order directly - webhook already validated payment
      const orderData: OrderInsert = {
        user_id: params.userId,
        creator_id: params.creatorId,
        video_request_id: params.videoRequestId,
        payment_intent_id: params.paymentIntentId,
        amount: params.amount,
        currency: params.currency || 'usd',
        platform_fee: params.platformFee,
        creator_earnings: params.creatorEarnings,
        status: 'pending',
        metadata: params.metadata || {}
      }

      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) {
        return this.handleError(orderError, 'createOrderFromWebhook')
      }

      // Update video request status to 'paid'
      await this.supabase
        .from('video_requests')
        .update({ status: 'paid' })
        .eq('id', params.videoRequestId)

      return {
        success: true,
        data: order
      }

    } catch (error) {
      return this.handleError(error, 'createOrderFromWebhook')
    }
  }

  async createOrder(params: CreateOrderParams): Promise<ServiceResult<Order>> {
    try {
      this.validateRequired(params.videoRequestId, 'Video request ID')
      this.validateRequired(params.paymentIntentId, 'Payment intent ID')
      this.validateAmount(params.amount, 'Order amount')
      this.validateAmount(params.platformFee, 'Platform fee')
      this.validateAmount(params.creatorEarnings, 'Creator earnings')
      this.validateUUID(params.videoRequestId, 'Video request ID')

      const user = await this.getCurrentUser()

      // Get video request details
      const { data: videoRequest, error: vrError } = await this.supabase
        .from('video_requests')
        .select('id, user_id, creator_id, price, status')
        .eq('id', params.videoRequestId)
        .single()

      if (vrError || !videoRequest) {
        return {
          success: false,
          error: 'Video request not found'
        }
      }

      if (videoRequest.user_id !== user.id) {
        return {
          success: false,
          error: 'Access denied: Video request does not belong to user'
        }
      }

      if (videoRequest.status !== 'pending') {
        return {
          success: false,
          error: 'Video request must be in pending status to create order'
        }
      }

      // Verify payment intent exists and is successful
      const { data: paymentIntent, error: piError } = await this.supabase
        .from('payment_intents')
        .select('id, status, user_id, creator_id')
        .eq('id', params.paymentIntentId)
        .eq('user_id', user.id)
        .eq('creator_id', videoRequest.creator_id)
        .single()

      if (piError || !paymentIntent) {
        return {
          success: false,
          error: 'Payment intent not found or invalid'
        }
      }

      if (paymentIntent.status !== 'succeeded') {
        return {
          success: false,
          error: 'Payment must be completed before creating order'
        }
      }

      // Validate payment amounts
      if (params.amount !== videoRequest.price) {
        return {
          success: false,
          error: 'Order amount does not match video request price'
        }
      }

      const expectedSplit = this.calculatePaymentSplit(params.amount)
      if (params.platformFee !== expectedSplit.platformFee || 
          params.creatorEarnings !== expectedSplit.creatorEarnings) {
        return {
          success: false,
          error: 'Invalid payment split amounts'
        }
      }

      // Create the order
      const orderData: OrderInsert = {
        user_id: user.id,
        creator_id: videoRequest.creator_id,
        video_request_id: params.videoRequestId,
        payment_intent_id: params.paymentIntentId,
        amount: params.amount,
        currency: params.currency || 'usd',
        platform_fee: params.platformFee,
        creator_earnings: params.creatorEarnings,
        status: 'pending',
        metadata: params.metadata || {}
      }

      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) {
        return this.handleError(orderError, 'createOrder')
      }

      // Update video request status to 'paid'
      await this.supabase
        .from('video_requests')
        .update({ status: 'paid' })
        .eq('id', params.videoRequestId)

      // Send real-time notification to creator
      await this.sendOrderNotification(order.id, 'new_order')

      return {
        success: true,
        data: order
      }

    } catch (error) {
      return this.handleError(error, 'createOrder')
    }
  }

  async updateOrderStatus(params: UpdateOrderStatusParams): Promise<ServiceResult<Order>> {
    try {
      this.validateRequired(params.orderId, 'Order ID')
      this.validateRequired(params.status, 'Order status')
      this.validateUUID(params.orderId, 'Order ID')

      const user = await this.getCurrentUser()

      // Get current order
      const { data: currentOrder, error } = await this.supabase
        .from('orders')
        .select('*')
        .eq('id', params.orderId)
        .single()

      if (error || !currentOrder) {
        return {
          success: false,
          error: 'Order not found'
        }
      }

      // Check permissions - either the user or creator can update status
      if (currentOrder.user_id !== user.id && currentOrder.creator_id !== user.id) {
        return {
          success: false,
          error: 'Access denied: Cannot update this order'
        }
      }

      // Validate status transitions
      const isValidTransition = this.isValidStatusTransition(
        currentOrder.status as OrderStatus,
        params.status,
        user.id === currentOrder.creator_id
      )

      if (!isValidTransition) {
        return {
          success: false,
          error: `Invalid status transition from ${currentOrder.status} to ${params.status}`
        }
      }

      // Prepare update data
      const updateData: OrderUpdate = {
        status: params.status,
        updated_at: new Date().toISOString(),
        metadata: params.metadata ? { ...currentOrder.metadata, ...params.metadata } : currentOrder.metadata
      }

      // Add timestamp fields for specific status changes
      if (params.status === 'accepted') {
        updateData.accepted_at = new Date().toISOString()
      } else if (params.status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      // Update the order
      const { data: updatedOrder, error: updateError } = await this.supabase
        .from('orders')
        .update(updateData)
        .eq('id', params.orderId)
        .select()
        .single()

      if (updateError) {
        return this.handleError(updateError, 'updateOrderStatus')
      }

      // Send notifications based on status change
      await this.sendOrderNotification(params.orderId, `order_${params.status}`)

      return {
        success: true,
        data: updatedOrder
      }

    } catch (error) {
      return this.handleError(error, 'updateOrderStatus')
    }
  }

  async getOrder(orderId: string): Promise<ServiceResult<OrderWithDetails>> {
    try {
      this.validateRequired(orderId, 'Order ID')
      this.validateUUID(orderId, 'Order ID')

      const user = await this.getCurrentUser()

      const { data: order, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          user:profiles!user_id(id, display_name, avatar_url, email),
          creator:profiles!creator_id(id, display_name, avatar_url),
          video_request:video_requests(id, title, description, occasion, recipient_name),
          video_upload:video_uploads(id, video_url, thumbnail_url, duration, processing_status)
        `)
        .eq('id', orderId)
        .single()

      if (error || !order) {
        return {
          success: false,
          error: 'Order not found'
        }
      }

      // Check access permissions
      if (order.user_id !== user.id && order.creator_id !== user.id) {
        return {
          success: false,
          error: 'Access denied'
        }
      }

      return {
        success: true,
        data: order as OrderWithDetails
      }

    } catch (error) {
      return this.handleError(error, 'getOrder')
    }
  }

  async getUserOrders(userId?: string): Promise<ServiceResult<OrderWithDetails[]>> {
    try {
      const user = userId ? { id: userId } : await this.getCurrentUser()

      const { data: orders, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          user:profiles!user_id(id, display_name, avatar_url),
          creator:profiles!creator_id(id, display_name, avatar_url),
          video_request:video_requests(id, title, description, occasion, recipient_name),
          video_upload:video_uploads(id, video_url, thumbnail_url, duration, processing_status)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return this.handleError(error, 'getUserOrders')
      }

      return {
        success: true,
        data: (orders || []) as OrderWithDetails[]
      }

    } catch (error) {
      return this.handleError(error, 'getUserOrders')
    }
  }

  async getCreatorOrders(creatorId?: string): Promise<ServiceResult<OrderWithDetails[]>> {
    try {
      const user = creatorId ? { id: creatorId } : await this.getCurrentUser()

      const { data: orders, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          user:profiles!user_id(id, display_name, avatar_url, email),
          creator:profiles!creator_id(id, display_name, avatar_url),
          video_request:video_requests(id, title, description, occasion, recipient_name),
          video_upload:video_uploads(id, video_url, thumbnail_url, duration, processing_status)
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return this.handleError(error, 'getCreatorOrders')
      }

      return {
        success: true,
        data: (orders || []) as OrderWithDetails[]
      }

    } catch (error) {
      return this.handleError(error, 'getCreatorOrders')
    }
  }

  private calculatePaymentSplit(totalAmount: number) {
    const platformFee = Math.round(totalAmount * 0.30) // 30%
    const creatorEarnings = totalAmount - platformFee   // 70%
    
    return { platformFee, creatorEarnings }
  }

  private isValidStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
    isCreator: boolean
  ): boolean {
    const transitions: Record<OrderStatus, { creator: OrderStatus[], user: OrderStatus[] }> = {
      'pending': {
        creator: ['accepted', 'rejected'],
        user: ['refunded'] // User can request refund if creator doesn't respond
      },
      'accepted': {
        creator: ['in_progress', 'completed'],
        user: ['disputed'] // User can dispute if needed
      },
      'in_progress': {
        creator: ['completed'],
        user: ['disputed']
      },
      'completed': {
        creator: [],
        user: ['disputed'] // User can dispute completed orders within timeframe
      },
      'rejected': {
        creator: [],
        user: ['refunded'] // Automatic refund flow
      },
      'refunded': {
        creator: [],
        user: []
      },
      'disputed': {
        creator: [],
        user: []
      }
    }

    const allowedTransitions = transitions[currentStatus]
    if (!allowedTransitions) return false

    const validStatuses = isCreator 
      ? allowedTransitions.creator 
      : allowedTransitions.user

    return validStatuses.includes(newStatus)
  }

  private async sendOrderNotification(orderId: string, type: string) {
    try {
      // Get order details to determine who to notify
      const { data: order } = await this.supabase
        .from('orders')
        .select('creator_id, user_id, amount')
        .eq('id', orderId)
        .single()

      if (!order) return

      // Use Supabase Broadcast to send real-time notification
      // Different channels for creators and fans
      const channelId = type.includes('accepted') || type.includes('rejected') 
        ? `fan-${order.user_id}` 
        : `creator-${order.creator_id}`
      
      const channel = this.supabase.channel(channelId)
      
      await channel.send({
        type: 'broadcast',
        event: type,
        payload: {
          orderId,
          amount: order.amount,
          timestamp: new Date().toISOString()
        }
      })

      console.log(`📢 Order notification sent: ${type} for order ${orderId}`)
    } catch (error) {
      console.warn('Failed to send order notification:', error)
      // Don't throw error - notifications are non-critical
    }
  }
}