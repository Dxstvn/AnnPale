/**
 * Order utility functions for the Fan Dashboard
 * These functions handle order management, status tracking, and validations
 */

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'recording' 
  | 'processing' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded'

export interface Order {
  id: string
  status: OrderStatus
  creatorResponseTime: string // e.g., "24h", "48h"
  rushOrder: boolean
  orderedAt: string
  acceptedAt?: string
  recordingStartedAt?: string
  processingStartedAt?: string
  completedAt?: string
  cancelledAt?: string
  expectedDelivery?: string
}

export interface DeliveryEstimate {
  estimatedDate: Date
  timeRemaining: string
  isOverdue: boolean
}

export interface OrderValidation {
  isValid: boolean
  error?: string
}

/**
 * Calculate estimated delivery time based on creator response time and rush order
 */
export function calculateDeliveryTime(
  creatorResponseTime: string,
  rushOrder: boolean,
  orderDate: Date = new Date()
): Date {
  // Parse response time (e.g., "24h", "48h", "3d")
  const match = creatorResponseTime.match(/(\d+)([hd])/)
  if (!match) {
    // Default to 48 hours if format is invalid
    return new Date(orderDate.getTime() + 48 * 60 * 60 * 1000)
  }

  const [, amount, unit] = match
  const hours = unit === 'd' ? parseInt(amount) * 24 : parseInt(amount)
  
  // Rush orders get 50% faster delivery (minimum 12 hours)
  const deliveryHours = rushOrder ? Math.max(12, hours * 0.5) : hours
  
  return new Date(orderDate.getTime() + deliveryHours * 60 * 60 * 1000)
}

/**
 * Get current order status based on timestamps
 */
export function getOrderStatus(order: Order): OrderStatus {
  if (order.cancelledAt) return 'cancelled'
  if (order.completedAt) return 'completed'
  if (order.processingStartedAt) return 'processing'
  if (order.recordingStartedAt) return 'recording'
  if (order.acceptedAt) return 'accepted'
  return 'pending'
}

/**
 * Calculate refund amount based on order details
 */
export function calculateRefundAmount(
  order: Order,
  reason: string,
  originalAmount: number
): number {
  // Full refund for creator-cancelled or system errors
  if (reason === 'creator_cancelled' || reason === 'system_error') {
    return originalAmount
  }

  const status = getOrderStatus(order)

  // Partial refund based on status
  switch (status) {
    case 'pending':
      return originalAmount // Full refund if not accepted yet
    case 'accepted':
      return originalAmount * 0.9 // 90% refund if accepted but not started
    case 'recording':
      return originalAmount * 0.5 // 50% refund if recording started
    case 'processing':
    case 'completed':
      return 0 // No refund once processing or completed
    case 'cancelled':
    case 'refunded':
      return 0 // Already cancelled/refunded
    default:
      return originalAmount // Default to full refund
  }
}

/**
 * Validate order request data
 */
export function validateOrderRequest(formData: {
  creatorId: string
  occasion: string
  recipientName: string
  instructions: string
  amount: number
}): OrderValidation {
  if (!formData.creatorId) {
    return { isValid: false, error: 'Creator is required' }
  }

  if (!formData.occasion) {
    return { isValid: false, error: 'Occasion is required' }
  }

  if (!formData.recipientName || formData.recipientName.trim().length === 0) {
    return { isValid: false, error: 'Recipient name is required' }
  }

  if (formData.recipientName.length > 100) {
    return { isValid: false, error: 'Recipient name is too long (max 100 characters)' }
  }

  if (!formData.instructions || formData.instructions.trim().length === 0) {
    return { isValid: false, error: 'Instructions are required' }
  }

  if (formData.instructions.length < 10) {
    return { isValid: false, error: 'Instructions must be at least 10 characters' }
  }

  if (formData.instructions.length > 500) {
    return { isValid: false, error: 'Instructions are too long (max 500 characters)' }
  }

  if (formData.amount <= 0) {
    return { isValid: false, error: 'Invalid amount' }
  }

  return { isValid: true }
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(prefix: string = 'ORD'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${timestamp}${random}`.toUpperCase()
}

/**
 * Calculate time remaining until delivery
 */
export function calculateTimeRemaining(expectedDelivery: string | Date): DeliveryEstimate {
  const now = new Date()
  const delivery = typeof expectedDelivery === 'string' 
    ? new Date(expectedDelivery) 
    : expectedDelivery
    
  const diff = delivery.getTime() - now.getTime()
  const isOverdue = diff < 0
  
  if (isOverdue) {
    const overdueDiff = Math.abs(diff)
    const days = Math.floor(overdueDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((overdueDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    let timeRemaining = 'Overdue by '
    if (days > 0) {
      timeRemaining += `${days}d ${hours}h`
    } else if (hours > 0) {
      timeRemaining += `${hours}h`
    } else {
      timeRemaining += 'less than 1 hour'
    }
    
    return {
      estimatedDate: delivery,
      timeRemaining,
      isOverdue: true
    }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  let timeRemaining = ''
  if (days > 0) {
    timeRemaining = `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    timeRemaining = `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    timeRemaining = `${minutes}m`
  } else {
    timeRemaining = 'Less than 1 minute'
  }
  
  return {
    estimatedDate: delivery,
    timeRemaining,
    isOverdue: false
  }
}

/**
 * Get order progress percentage based on status
 */
export function getOrderProgress(order: Order): number {
  const status = getOrderStatus(order)
  
  switch (status) {
    case 'pending':
      return 10
    case 'accepted':
      return 25
    case 'recording':
      // If we have more granular progress, use it
      // For now, return 50% for recording
      return 50
    case 'processing':
      return 75
    case 'completed':
      return 100
    case 'cancelled':
    case 'refunded':
      return 0
    default:
      return 0
  }
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(order: Order): boolean {
  const status = getOrderStatus(order)
  
  // Can cancel if pending, accepted, or early recording
  if (['pending', 'accepted', 'recording'].includes(status)) {
    // Check if recording just started (less than 30 minutes)
    if (status === 'recording' && order.recordingStartedAt) {
      const recordingStartTime = new Date(order.recordingStartedAt).getTime()
      const now = Date.now()
      const thirtyMinutes = 30 * 60 * 1000
      return (now - recordingStartTime) < thirtyMinutes
    }
    return true
  }
  
  return false
}

/**
 * Format order status for display
 */
export function formatOrderStatus(status: OrderStatus): {
  label: string
  color: string
  icon: string
} {
  const statusMap = {
    pending: {
      label: 'Pending Acceptance',
      color: 'yellow',
      icon: 'clock'
    },
    accepted: {
      label: 'Accepted',
      color: 'blue',
      icon: 'check'
    },
    recording: {
      label: 'Recording',
      color: 'purple',
      icon: 'video'
    },
    processing: {
      label: 'Processing',
      color: 'indigo',
      icon: 'refresh'
    },
    completed: {
      label: 'Delivered',
      color: 'green',
      icon: 'check-circle'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'gray',
      icon: 'x-circle'
    },
    refunded: {
      label: 'Refunded',
      color: 'purple',
      icon: 'refresh'
    }
  }
  
  return statusMap[status] || statusMap.pending
}

/**
 * Calculate estimated processing time after recording
 */
export function estimateProcessingTime(videoDuration: number): number {
  // Base processing time: 5 minutes
  let processingMinutes = 5
  
  // Add 2 minutes for every minute of video
  processingMinutes += Math.ceil(videoDuration / 60) * 2
  
  // Cap at 30 minutes
  return Math.min(processingMinutes, 30)
}