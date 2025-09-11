import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requireAuth } from './auth.dal'

/**
 * Data Access Layer for Orders
 * Server-only operations with proper authorization
 */

export interface OrderDTO {
  id: string
  userId: string
  creatorId: string
  videoRequestId: string
  amount: number
  platformFee: number
  creatorEarnings: number
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
  createdAt: string
  completedAt?: string
  creator?: {
    displayName: string
    avatarUrl?: string
  }
  videoRequest?: {
    occasion: string
    recipientName: string
    instructions?: string
    dueDate?: string
    videoUrl?: string
  }
}

/**
 * Get orders for the current user
 */
export const getUserOrders = cache(async (
  status?: string,
  limit: number = 50
): Promise<OrderDTO[]> => {
  const user = await requireAuth()
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select(`
      *,
      creator:profiles!orders_creator_id_fkey(display_name, avatar_url),
      video_request:video_requests!orders_video_request_id_fkey(
        occasion,
        recipient_name,
        instructions,
        due_date,
        video_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching user orders:', error)
    return []
  }

  // Map to DTOs
  return (data || []).map(order => ({
    id: order.id,
    userId: order.user_id,
    creatorId: order.creator_id,
    videoRequestId: order.video_request_id,
    amount: order.amount,
    platformFee: order.platform_fee,
    creatorEarnings: order.creator_earnings,
    status: order.status,
    createdAt: order.created_at,
    completedAt: order.completed_at,
    creator: order.creator ? {
      displayName: order.creator.display_name,
      avatarUrl: order.creator.avatar_url,
    } : undefined,
    videoRequest: order.video_request ? {
      occasion: order.video_request.occasion,
      recipientName: order.video_request.recipient_name,
      instructions: order.video_request.instructions,
      dueDate: order.video_request.due_date,
      videoUrl: order.video_request.video_url,
    } : undefined,
  }))
})

/**
 * Get orders for a creator
 */
export const getCreatorOrders = cache(async (
  creatorId?: string,
  status?: string,
  limit: number = 50
): Promise<OrderDTO[]> => {
  const user = await requireAuth()
  const supabase = await createClient()

  // Use current user's ID if creator ID not provided
  const targetCreatorId = creatorId || user.id

  // Verify user has access to these orders
  if (targetCreatorId !== user.id && user.role !== 'admin') {
    return []
  }

  let query = supabase
    .from('orders')
    .select(`
      *,
      user:profiles!orders_user_id_fkey(display_name, avatar_url),
      video_request:video_requests!orders_video_request_id_fkey(
        occasion,
        recipient_name,
        instructions,
        due_date,
        video_url
      )
    `)
    .eq('creator_id', targetCreatorId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching creator orders:', error)
    return []
  }

  // Map to DTOs
  return (data || []).map(order => ({
    id: order.id,
    userId: order.user_id,
    creatorId: order.creator_id,
    videoRequestId: order.video_request_id,
    amount: order.amount,
    platformFee: order.platform_fee,
    creatorEarnings: order.creator_earnings,
    status: order.status,
    createdAt: order.created_at,
    completedAt: order.completed_at,
    videoRequest: order.video_request ? {
      occasion: order.video_request.occasion,
      recipientName: order.video_request.recipient_name,
      instructions: order.video_request.instructions,
      dueDate: order.video_request.due_date,
      videoUrl: order.video_request.video_url,
    } : undefined,
  }))
})

/**
 * Get a specific order by ID
 */
export const getOrderById = cache(async (orderId: string): Promise<OrderDTO | null> => {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      creator:profiles!orders_creator_id_fkey(display_name, avatar_url),
      video_request:video_requests!orders_video_request_id_fkey(
        occasion,
        recipient_name,
        instructions,
        due_date,
        video_url
      )
    `)
    .eq('id', orderId)
    .single()

  if (error || !data) {
    return null
  }

  // Verify user has access to this order
  if (data.user_id !== user.id && data.creator_id !== user.id && user.role !== 'admin') {
    return null
  }

  return {
    id: data.id,
    userId: data.user_id,
    creatorId: data.creator_id,
    videoRequestId: data.video_request_id,
    amount: data.amount,
    platformFee: data.platform_fee,
    creatorEarnings: data.creator_earnings,
    status: data.status,
    createdAt: data.created_at,
    completedAt: data.completed_at,
    creator: data.creator ? {
      displayName: data.creator.display_name,
      avatarUrl: data.creator.avatar_url,
    } : undefined,
    videoRequest: data.video_request ? {
      occasion: data.video_request.occasion,
      recipientName: data.video_request.recipient_name,
      instructions: data.video_request.instructions,
      dueDate: data.video_request.due_date,
      videoUrl: data.video_request.video_url,
    } : undefined,
  }
})

/**
 * Update order status (creator only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'accepted' | 'in_progress' | 'completed' | 'cancelled'
): Promise<boolean> {
  const user = await requireAuth()
  const supabase = await createClient()

  // Verify order belongs to creator
  const { data: order } = await supabase
    .from('orders')
    .select('creator_id, status')
    .eq('id', orderId)
    .single()

  if (!order || order.creator_id !== user.id) {
    return false
  }

  // Validate status transitions
  const validTransitions: Record<string, string[]> = {
    pending: ['accepted', 'cancelled'],
    accepted: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
    refunded: [],
  }

  if (!validTransitions[order.status]?.includes(status)) {
    return false
  }

  const updateData: any = { status }
  
  if (status === 'accepted') {
    updateData.accepted_at = new Date().toISOString()
  } else if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  return !error
}

/**
 * Get order statistics for a user
 */
export const getOrderStats = cache(async () => {
  const user = await requireAuth()
  const supabase = await createClient()

  if (user.role === 'creator') {
    const { data } = await supabase
      .from('creator_stats')
      .select('*')
      .eq('creator_id', user.id)
      .single()

    return data
  }

  // For fans, calculate stats from orders
  const { data: orders } = await supabase
    .from('orders')
    .select('amount, status')
    .eq('user_id', user.id)

  if (!orders) return null

  return {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + (o.amount || 0), 0),
    pendingOrders: orders.filter(o => ['pending', 'accepted', 'in_progress'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
  }
})

/**
 * Cancel an order (user only, within time limit)
 */
export async function cancelOrder(orderId: string): Promise<boolean> {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('user_id, status, created_at')
    .eq('id', orderId)
    .single()

  if (!order || order.user_id !== user.id) {
    return false
  }

  // Can only cancel pending orders within 24 hours
  if (order.status !== 'pending') {
    return false
  }

  const orderDate = new Date(order.created_at)
  const now = new Date()
  const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)

  if (hoursSinceOrder > 24) {
    return false
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)

  return !error
}