/**
 * Unit tests for order utility functions
 */

import {
  calculateDeliveryTime,
  getOrderStatus,
  calculateRefundAmount,
  validateOrderRequest,
  generateOrderNumber,
  calculateTimeRemaining,
  getOrderProgress,
  canCancelOrder,
  formatOrderStatus,
  estimateProcessingTime,
  type Order,
  type OrderStatus
} from '@/lib/utils/order'

describe('Order Utilities', () => {
  describe('calculateDeliveryTime', () => {
    const baseDate = new Date('2024-03-20T10:00:00')

    it('should calculate delivery for 24h response time', () => {
      const result = calculateDeliveryTime('24h', false, baseDate)
      const expected = new Date('2024-03-21T10:00:00')
      expect(result.getTime()).toBe(expected.getTime())
    })

    it('should calculate delivery for 48h response time', () => {
      const result = calculateDeliveryTime('48h', false, baseDate)
      const expected = new Date('2024-03-22T10:00:00')
      expect(result.getTime()).toBe(expected.getTime())
    })

    it('should calculate delivery for days format', () => {
      const result = calculateDeliveryTime('3d', false, baseDate)
      const expected = new Date('2024-03-23T10:00:00')
      expect(result.getTime()).toBe(expected.getTime())
    })

    it('should apply rush order 50% reduction', () => {
      const result = calculateDeliveryTime('48h', true, baseDate)
      const expected = new Date('2024-03-21T10:00:00') // 24h instead of 48h
      expect(result.getTime()).toBe(expected.getTime())
    })

    it('should enforce minimum 12h for rush orders', () => {
      const result = calculateDeliveryTime('12h', true, baseDate)
      const expected = new Date('2024-03-20T22:00:00') // Still 12h
      expect(result.getTime()).toBe(expected.getTime())
    })

    it('should default to 48h for invalid format', () => {
      const result = calculateDeliveryTime('invalid', false, baseDate)
      const expected = new Date('2024-03-22T10:00:00')
      expect(result.getTime()).toBe(expected.getTime())
    })

    it('should use current date if not provided', () => {
      const result = calculateDeliveryTime('24h', false)
      const now = new Date()
      const expected = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      expect(Math.abs(result.getTime() - expected.getTime())).toBeLessThan(1000)
    })
  })

  describe('getOrderStatus', () => {
    const baseOrder: Order = {
      id: '123',
      status: 'pending',
      creatorResponseTime: '24h',
      rushOrder: false,
      orderedAt: '2024-03-20T10:00:00'
    }

    it('should return pending for new order', () => {
      expect(getOrderStatus(baseOrder)).toBe('pending')
    })

    it('should return accepted when accepted', () => {
      const order = { ...baseOrder, acceptedAt: '2024-03-20T11:00:00' }
      expect(getOrderStatus(order)).toBe('accepted')
    })

    it('should return recording when recording started', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00'
      }
      expect(getOrderStatus(order)).toBe('recording')
    })

    it('should return processing when processing started', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00',
        processingStartedAt: '2024-03-20T13:00:00'
      }
      expect(getOrderStatus(order)).toBe('processing')
    })

    it('should return completed when completed', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00',
        processingStartedAt: '2024-03-20T13:00:00',
        completedAt: '2024-03-20T14:00:00'
      }
      expect(getOrderStatus(order)).toBe('completed')
    })

    it('should prioritize cancelled status', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        cancelledAt: '2024-03-20T12:00:00'
      }
      expect(getOrderStatus(order)).toBe('cancelled')
    })
  })

  describe('calculateRefundAmount', () => {
    const baseOrder: Order = {
      id: '123',
      status: 'pending',
      creatorResponseTime: '24h',
      rushOrder: false,
      orderedAt: '2024-03-20T10:00:00'
    }

    it('should give full refund for creator cancelled', () => {
      const order = { ...baseOrder, recordingStartedAt: '2024-03-20T12:00:00' }
      expect(calculateRefundAmount(order, 'creator_cancelled', 100)).toBe(100)
    })

    it('should give full refund for system error', () => {
      const order = { ...baseOrder, processingStartedAt: '2024-03-20T13:00:00' }
      expect(calculateRefundAmount(order, 'system_error', 100)).toBe(100)
    })

    it('should give full refund for pending orders', () => {
      expect(calculateRefundAmount(baseOrder, 'customer_request', 100)).toBe(100)
    })

    it('should give 90% refund for accepted orders', () => {
      const order = { ...baseOrder, acceptedAt: '2024-03-20T11:00:00' }
      expect(calculateRefundAmount(order, 'customer_request', 100)).toBe(90)
    })

    it('should give 50% refund for recording orders', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00'
      }
      expect(calculateRefundAmount(order, 'customer_request', 100)).toBe(50)
    })

    it('should give no refund for processing orders', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00',
        processingStartedAt: '2024-03-20T13:00:00'
      }
      expect(calculateRefundAmount(order, 'customer_request', 100)).toBe(0)
    })

    it('should give no refund for completed orders', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        completedAt: '2024-03-20T14:00:00'
      }
      expect(calculateRefundAmount(order, 'customer_request', 100)).toBe(0)
    })

    it('should handle different amounts', () => {
      const order = { ...baseOrder, acceptedAt: '2024-03-20T11:00:00' }
      expect(calculateRefundAmount(order, 'customer_request', 50)).toBe(45)
      expect(calculateRefundAmount(order, 'customer_request', 200)).toBe(180)
    })
  })

  describe('validateOrderRequest', () => {
    const validData = {
      creatorId: 'creator-123',
      occasion: 'Birthday',
      recipientName: 'John Doe',
      instructions: 'Please wish John a happy birthday!',
      amount: 50
    }

    it('should validate valid order request', () => {
      const result = validateOrderRequest(validData)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject missing creator', () => {
      const result = validateOrderRequest({ ...validData, creatorId: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Creator is required')
    })

    it('should reject missing occasion', () => {
      const result = validateOrderRequest({ ...validData, occasion: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Occasion is required')
    })

    it('should reject missing recipient name', () => {
      const result = validateOrderRequest({ ...validData, recipientName: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Recipient name is required')
    })

    it('should reject whitespace-only recipient name', () => {
      const result = validateOrderRequest({ ...validData, recipientName: '   ' })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Recipient name is required')
    })

    it('should reject too long recipient name', () => {
      const result = validateOrderRequest({
        ...validData,
        recipientName: 'a'.repeat(101)
      })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('too long')
    })

    it('should reject missing instructions', () => {
      const result = validateOrderRequest({ ...validData, instructions: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Instructions are required')
    })

    it('should reject too short instructions', () => {
      const result = validateOrderRequest({ ...validData, instructions: 'Hi!' })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least 10 characters')
    })

    it('should reject too long instructions', () => {
      const result = validateOrderRequest({
        ...validData,
        instructions: 'a'.repeat(501)
      })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('too long')
    })

    it('should reject invalid amount', () => {
      const result = validateOrderRequest({ ...validData, amount: 0 })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Invalid amount')
    })

    it('should reject negative amount', () => {
      const result = validateOrderRequest({ ...validData, amount: -10 })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Invalid amount')
    })
  })

  describe('generateOrderNumber', () => {
    it('should generate unique order numbers', () => {
      const order1 = generateOrderNumber()
      const order2 = generateOrderNumber()
      expect(order1).not.toBe(order2)
    })

    it('should use default prefix', () => {
      const orderNumber = generateOrderNumber()
      expect(orderNumber).toMatch(/^ORD-\d{4}-\d+$/)
    })

    it('should use custom prefix', () => {
      const orderNumber = generateOrderNumber('VID')
      expect(orderNumber).toMatch(/^VID-\d{4}-\d+$/)
    })

    it('should include current year', () => {
      const year = new Date().getFullYear()
      const orderNumber = generateOrderNumber()
      expect(orderNumber).toContain(`-${year}-`)
    })

    it('should be uppercase', () => {
      const orderNumber = generateOrderNumber('test')
      expect(orderNumber).toBe(orderNumber.toUpperCase())
    })
  })

  describe('calculateTimeRemaining', () => {
    beforeEach(() => {
      // Mock current time
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-03-20T10:00:00'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should calculate days remaining', () => {
      const result = calculateTimeRemaining('2024-03-23T10:00:00')
      expect(result.timeRemaining).toBe('3d 0h 0m')
      expect(result.isOverdue).toBe(false)
    })

    it('should calculate hours remaining', () => {
      const result = calculateTimeRemaining('2024-03-20T20:30:00')
      expect(result.timeRemaining).toBe('10h 30m')
      expect(result.isOverdue).toBe(false)
    })

    it('should calculate minutes remaining', () => {
      const result = calculateTimeRemaining('2024-03-20T10:45:00')
      expect(result.timeRemaining).toBe('45m')
      expect(result.isOverdue).toBe(false)
    })

    it('should handle less than 1 minute', () => {
      const result = calculateTimeRemaining('2024-03-20T10:00:30')
      expect(result.timeRemaining).toBe('Less than 1 minute')
      expect(result.isOverdue).toBe(false)
    })

    it('should handle overdue by days', () => {
      const result = calculateTimeRemaining('2024-03-17T10:00:00')
      expect(result.timeRemaining).toBe('Overdue by 3d 0h')
      expect(result.isOverdue).toBe(true)
    })

    it('should handle overdue by hours', () => {
      const result = calculateTimeRemaining('2024-03-20T05:00:00')
      expect(result.timeRemaining).toBe('Overdue by 5h')
      expect(result.isOverdue).toBe(true)
    })

    it('should handle overdue by less than 1 hour', () => {
      const result = calculateTimeRemaining('2024-03-20T09:30:00')
      expect(result.timeRemaining).toBe('Overdue by less than 1 hour')
      expect(result.isOverdue).toBe(true)
    })

    it('should handle Date objects', () => {
      const futureDate = new Date('2024-03-21T10:00:00')
      const result = calculateTimeRemaining(futureDate)
      expect(result.timeRemaining).toBe('1d 0h 0m')
      expect(result.isOverdue).toBe(false)
    })
  })

  describe('getOrderProgress', () => {
    const baseOrder: Order = {
      id: '123',
      status: 'pending',
      creatorResponseTime: '24h',
      rushOrder: false,
      orderedAt: '2024-03-20T10:00:00'
    }

    it('should return 10% for pending', () => {
      expect(getOrderProgress(baseOrder)).toBe(10)
    })

    it('should return 25% for accepted', () => {
      const order = { ...baseOrder, acceptedAt: '2024-03-20T11:00:00' }
      expect(getOrderProgress(order)).toBe(25)
    })

    it('should return 50% for recording', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00'
      }
      expect(getOrderProgress(order)).toBe(50)
    })

    it('should return 75% for processing', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00',
        processingStartedAt: '2024-03-20T13:00:00'
      }
      expect(getOrderProgress(order)).toBe(75)
    })

    it('should return 100% for completed', () => {
      const order = {
        ...baseOrder,
        completedAt: '2024-03-20T14:00:00'
      }
      expect(getOrderProgress(order)).toBe(100)
    })

    it('should return 0% for cancelled', () => {
      const order = { ...baseOrder, cancelledAt: '2024-03-20T11:00:00' }
      expect(getOrderProgress(order)).toBe(0)
    })
  })

  describe('canCancelOrder', () => {
    const baseOrder: Order = {
      id: '123',
      status: 'pending',
      creatorResponseTime: '24h',
      rushOrder: false,
      orderedAt: '2024-03-20T10:00:00'
    }

    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-03-20T13:00:00'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should allow cancelling pending orders', () => {
      expect(canCancelOrder(baseOrder)).toBe(true)
    })

    it('should allow cancelling accepted orders', () => {
      const order = { ...baseOrder, acceptedAt: '2024-03-20T11:00:00' }
      expect(canCancelOrder(order)).toBe(true)
    })

    it('should allow cancelling early recording orders', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:45:00' // 15 minutes ago
      }
      expect(canCancelOrder(order)).toBe(true)
    })

    it('should not allow cancelling late recording orders', () => {
      const order = {
        ...baseOrder,
        acceptedAt: '2024-03-20T11:00:00',
        recordingStartedAt: '2024-03-20T12:00:00' // 1 hour ago
      }
      expect(canCancelOrder(order)).toBe(false)
    })

    it('should not allow cancelling processing orders', () => {
      const order = {
        ...baseOrder,
        processingStartedAt: '2024-03-20T13:00:00'
      }
      expect(canCancelOrder(order)).toBe(false)
    })

    it('should not allow cancelling completed orders', () => {
      const order = {
        ...baseOrder,
        completedAt: '2024-03-20T14:00:00'
      }
      expect(canCancelOrder(order)).toBe(false)
    })

    it('should not allow cancelling already cancelled orders', () => {
      const order = {
        ...baseOrder,
        cancelledAt: '2024-03-20T11:00:00'
      }
      expect(canCancelOrder(order)).toBe(false)
    })
  })

  describe('formatOrderStatus', () => {
    it('should format pending status', () => {
      const result = formatOrderStatus('pending')
      expect(result.label).toBe('Pending Acceptance')
      expect(result.color).toBe('yellow')
      expect(result.icon).toBe('clock')
    })

    it('should format accepted status', () => {
      const result = formatOrderStatus('accepted')
      expect(result.label).toBe('Accepted')
      expect(result.color).toBe('blue')
      expect(result.icon).toBe('check')
    })

    it('should format recording status', () => {
      const result = formatOrderStatus('recording')
      expect(result.label).toBe('Recording')
      expect(result.color).toBe('purple')
      expect(result.icon).toBe('video')
    })

    it('should format processing status', () => {
      const result = formatOrderStatus('processing')
      expect(result.label).toBe('Processing')
      expect(result.color).toBe('indigo')
      expect(result.icon).toBe('refresh')
    })

    it('should format completed status', () => {
      const result = formatOrderStatus('completed')
      expect(result.label).toBe('Delivered')
      expect(result.color).toBe('green')
      expect(result.icon).toBe('check-circle')
    })

    it('should format cancelled status', () => {
      const result = formatOrderStatus('cancelled')
      expect(result.label).toBe('Cancelled')
      expect(result.color).toBe('gray')
      expect(result.icon).toBe('x-circle')
    })

    it('should format refunded status', () => {
      const result = formatOrderStatus('refunded')
      expect(result.label).toBe('Refunded')
      expect(result.color).toBe('purple')
      expect(result.icon).toBe('refresh')
    })

    it('should handle unknown status', () => {
      const result = formatOrderStatus('unknown' as OrderStatus)
      expect(result.label).toBe('Pending Acceptance')
      expect(result.color).toBe('yellow')
      expect(result.icon).toBe('clock')
    })
  })

  describe('estimateProcessingTime', () => {
    it('should calculate processing time for short videos', () => {
      expect(estimateProcessingTime(30)).toBe(7) // 5 + (1 * 2)
      expect(estimateProcessingTime(60)).toBe(7) // 5 + (1 * 2)
    })

    it('should calculate processing time for medium videos', () => {
      expect(estimateProcessingTime(120)).toBe(9) // 5 + (2 * 2)
      expect(estimateProcessingTime(180)).toBe(11) // 5 + (3 * 2)
    })

    it('should calculate processing time for long videos', () => {
      expect(estimateProcessingTime(300)).toBe(15) // 5 + (5 * 2)
      expect(estimateProcessingTime(600)).toBe(25) // 5 + (10 * 2)
    })

    it('should cap at 30 minutes', () => {
      expect(estimateProcessingTime(1800)).toBe(30) // Would be 65, capped at 30
      expect(estimateProcessingTime(3600)).toBe(30) // Would be 125, capped at 30
    })

    it('should handle zero duration', () => {
      expect(estimateProcessingTime(0)).toBe(5) // Base processing time
    })
  })
})