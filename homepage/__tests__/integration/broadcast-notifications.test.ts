/**
 * Broadcast Notification System Integration Tests
 * Tests the Supabase Broadcast channel implementation for real-time notifications
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { NotificationServiceServer } from '@/lib/services/notification-service-server'

// Test configuration
const TEST_CONFIG = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}

// Initialize clients
const supabaseAdmin = createClient(
  TEST_CONFIG.supabaseUrl,
  TEST_CONFIG.supabaseServiceKey
)

const supabaseClient = createClient(
  TEST_CONFIG.supabaseUrl,
  TEST_CONFIG.supabaseAnonKey
)

// Test data
const TEST_CREATOR_ID = 'test-creator-' + Date.now()
const TEST_FAN_ID = 'test-fan-' + Date.now()
const TEST_ORDER_ID = 'test-order-' + Date.now()

describe('Broadcast Notification System', () => {
  let notificationService: NotificationServiceServer
  let creatorChannel: any
  let fanChannel: any
  let adminChannel: any

  beforeAll(() => {
    // Initialize notification service
    notificationService = new NotificationServiceServer(supabaseAdmin)
  })

  afterAll(async () => {
    // Cleanup channels
    if (creatorChannel) await creatorChannel.unsubscribe()
    if (fanChannel) await fanChannel.unsubscribe()
    if (adminChannel) await adminChannel.unsubscribe()
  })

  describe('Creator Notifications', () => {
    let receivedMessages: any[] = []

    beforeEach(async () => {
      receivedMessages = []
      
      // Set up creator channel listener
      creatorChannel = supabaseClient.channel(`creator-${TEST_CREATOR_ID}`)
      
      creatorChannel.on('broadcast', { event: '*' }, (payload: any) => {
        receivedMessages.push(payload)
      })
      
      await creatorChannel.subscribe()
      
      // Wait for subscription to be ready
      await new Promise(resolve => setTimeout(resolve, 500))
    })

    afterEach(async () => {
      if (creatorChannel) {
        await creatorChannel.unsubscribe()
        creatorChannel = null
      }
    })

    it('should send new order notification to creator', async () => {
      // Send notification using service
      const result = await notificationService.sendCreatorNotification({
        creatorId: TEST_CREATOR_ID,
        type: 'new_order',
        title: 'New Video Request!',
        message: 'You have a new video request worth $100',
        data: {
          orderId: TEST_ORDER_ID,
          amount: 100,
          fanName: 'Test Fan'
        }
      })

      expect(result.success).toBe(true)

      // Wait for message to be received
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verify message was received
      expect(receivedMessages).toHaveLength(1)
      expect(receivedMessages[0].event).toBe('new_order')
      expect(receivedMessages[0].payload.title).toBe('New Video Request!')
      expect(receivedMessages[0].payload.orderId).toBe(TEST_ORDER_ID)
      expect(receivedMessages[0].payload.amount).toBe(100)
    })

    it('should send order accepted notification', async () => {
      const result = await notificationService.sendCreatorNotification({
        creatorId: TEST_CREATOR_ID,
        type: 'order_accepted',
        title: 'Order Accepted',
        message: 'Your order has been accepted',
        data: {
          orderId: TEST_ORDER_ID,
          estimatedDelivery: '2025-01-15'
        }
      })

      expect(result.success).toBe(true)

      await new Promise(resolve => setTimeout(resolve, 1000))

      expect(receivedMessages).toHaveLength(1)
      expect(receivedMessages[0].event).toBe('order_accepted')
      expect(receivedMessages[0].payload.estimatedDelivery).toBe('2025-01-15')
    })

    it('should handle multiple notifications in sequence', async () => {
      // Send multiple notifications
      await notificationService.sendCreatorNotification({
        creatorId: TEST_CREATOR_ID,
        type: 'new_order',
        title: 'Order 1',
        message: 'First order',
        data: { orderId: 'order-1' }
      })

      await notificationService.sendCreatorNotification({
        creatorId: TEST_CREATOR_ID,
        type: 'new_order',
        title: 'Order 2',
        message: 'Second order',
        data: { orderId: 'order-2' }
      })

      await notificationService.sendCreatorNotification({
        creatorId: TEST_CREATOR_ID,
        type: 'new_order',
        title: 'Order 3',
        message: 'Third order',
        data: { orderId: 'order-3' }
      })

      // Wait for all messages
      await new Promise(resolve => setTimeout(resolve, 1500))

      expect(receivedMessages).toHaveLength(3)
      expect(receivedMessages[0].payload.orderId).toBe('order-1')
      expect(receivedMessages[1].payload.orderId).toBe('order-2')
      expect(receivedMessages[2].payload.orderId).toBe('order-3')
    })
  })

  describe('Fan Notifications', () => {
    let receivedMessages: any[] = []

    beforeEach(async () => {
      receivedMessages = []
      
      // Set up fan channel listener
      fanChannel = supabaseClient.channel(`fan-${TEST_FAN_ID}`)
      
      fanChannel.on('broadcast', { event: '*' }, (payload: any) => {
        receivedMessages.push(payload)
      })
      
      await fanChannel.subscribe()
      
      // Wait for subscription to be ready
      await new Promise(resolve => setTimeout(resolve, 500))
    })

    afterEach(async () => {
      if (fanChannel) {
        await fanChannel.unsubscribe()
        fanChannel = null
      }
    })

    it('should send order status update to fan', async () => {
      const result = await notificationService.sendFanNotification({
        fanId: TEST_FAN_ID,
        type: 'order_status_update',
        title: 'Order Update',
        message: 'Your order has been accepted by the creator',
        data: {
          orderId: TEST_ORDER_ID,
          status: 'accepted',
          creatorName: 'Test Creator'
        }
      })

      expect(result.success).toBe(true)

      await new Promise(resolve => setTimeout(resolve, 1000))

      expect(receivedMessages).toHaveLength(1)
      expect(receivedMessages[0].event).toBe('order_status_update')
      expect(receivedMessages[0].payload.status).toBe('accepted')
      expect(receivedMessages[0].payload.creatorName).toBe('Test Creator')
    })

    it('should send video delivery notification to fan', async () => {
      const result = await notificationService.sendFanNotification({
        fanId: TEST_FAN_ID,
        type: 'video_delivered',
        title: 'Your Video is Ready!',
        message: 'Your personalized video has been delivered',
        data: {
          orderId: TEST_ORDER_ID,
          videoUrl: 'https://example.com/video.mp4',
          thumbnailUrl: 'https://example.com/thumb.jpg'
        }
      })

      expect(result.success).toBe(true)

      await new Promise(resolve => setTimeout(resolve, 1000))

      expect(receivedMessages).toHaveLength(1)
      expect(receivedMessages[0].event).toBe('video_delivered')
      expect(receivedMessages[0].payload.videoUrl).toBe('https://example.com/video.mp4')
    })
  })

  describe('Order Status Updates', () => {
    it('should send status update to correct user type', async () => {
      const creatorMessages: any[] = []
      const fanMessages: any[] = []

      // Set up both channels
      const creatorChan = supabaseClient.channel(`creator-${TEST_CREATOR_ID}`)
      const fanChan = supabaseClient.channel(`fan-${TEST_FAN_ID}`)

      creatorChan.on('broadcast', { event: '*' }, (payload: any) => {
        creatorMessages.push(payload)
      })

      fanChan.on('broadcast', { event: '*' }, (payload: any) => {
        fanMessages.push(payload)
      })

      await creatorChan.subscribe()
      await fanChan.subscribe()
      await new Promise(resolve => setTimeout(resolve, 500))

      // Send update to creator
      await notificationService.sendOrderStatusUpdate({
        orderId: TEST_ORDER_ID,
        userId: TEST_CREATOR_ID,
        userType: 'creator',
        status: 'new',
        message: 'New order received'
      })

      // Send update to fan
      await notificationService.sendOrderStatusUpdate({
        orderId: TEST_ORDER_ID,
        userId: TEST_FAN_ID,
        userType: 'fan',
        status: 'accepted',
        message: 'Order accepted'
      })

      await new Promise(resolve => setTimeout(resolve, 1500))

      // Verify correct routing
      expect(creatorMessages).toHaveLength(1)
      expect(creatorMessages[0].payload.status).toBe('new')

      expect(fanMessages).toHaveLength(1)
      expect(fanMessages[0].payload.status).toBe('accepted')

      // Cleanup
      await creatorChan.unsubscribe()
      await fanChan.unsubscribe()
    })
  })

  describe('Platform-wide Broadcasts', () => {
    it('should broadcast to all creators', async () => {
      const messages1: any[] = []
      const messages2: any[] = []

      // Set up multiple creator channels
      const channel1 = supabaseClient.channel('all-creators')
      const channel2 = supabaseClient.channel('all-creators')

      channel1.on('broadcast', { event: '*' }, (payload: any) => {
        messages1.push(payload)
      })

      channel2.on('broadcast', { event: '*' }, (payload: any) => {
        messages2.push(payload)
      })

      await channel1.subscribe()
      await channel2.subscribe()
      await new Promise(resolve => setTimeout(resolve, 500))

      // Send platform-wide broadcast
      const result = await notificationService.broadcastToCreators({
        event: 'platform_announcement',
        title: 'New Feature Available',
        message: 'Check out our new analytics dashboard',
        data: {
          featureId: 'analytics-v2',
          releaseDate: '2025-01-06'
        }
      })

      expect(result.success).toBe(true)

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Both channels should receive the message
      expect(messages1.length).toBeGreaterThan(0)
      expect(messages1[0].event).toBe('platform_announcement')
      expect(messages1[0].payload.featureId).toBe('analytics-v2')

      // Cleanup
      await channel1.unsubscribe()
      await channel2.unsubscribe()
    })
  })

  describe('System Alerts', () => {
    let consoleErrorSpy: any
    let consoleWarnSpy: any
    let consoleInfoSpy: any

    beforeEach(() => {
      // Spy on console methods
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    })

    afterEach(() => {
      // Restore console methods
      consoleErrorSpy.mockRestore()
      consoleWarnSpy.mockRestore()
      consoleInfoSpy.mockRestore()
    })

    it('should log critical alerts to console', async () => {
      const result = await notificationService.sendSystemAlert({
        type: 'payment_failure',
        severity: 'critical',
        data: {
          orderId: TEST_ORDER_ID,
          error: 'Payment processing failed',
          amount: 100
        }
      })

      expect(result.success).toBe(true)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL ALERT'),
        expect.objectContaining({
          type: 'payment_failure',
          severity: 'critical'
        })
      )
    })

    it('should broadcast critical alerts to admin channel', async () => {
      const adminMessages: any[] = []
      
      // Set up admin channel
      adminChannel = supabaseClient.channel('admin-alerts')
      
      adminChannel.on('broadcast', { event: 'system_alert' }, (payload: any) => {
        adminMessages.push(payload)
      })
      
      await adminChannel.subscribe()
      await new Promise(resolve => setTimeout(resolve, 500))

      // Send critical alert
      await notificationService.sendSystemAlert({
        type: 'database_error',
        severity: 'critical',
        data: {
          error: 'Connection timeout',
          timestamp: new Date().toISOString()
        }
      })

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Admin channel should receive the alert
      expect(adminMessages).toHaveLength(1)
      expect(adminMessages[0].payload.type).toBe('database_error')
      expect(adminMessages[0].payload.severity).toBe('critical')
    })

    it('should handle different severity levels correctly', async () => {
      // Test info level
      await notificationService.sendSystemAlert({
        type: 'info_event',
        severity: 'info',
        data: { message: 'Information' }
      })
      expect(consoleInfoSpy).toHaveBeenCalled()

      // Test warning level
      await notificationService.sendSystemAlert({
        type: 'warning_event',
        severity: 'warning',
        data: { message: 'Warning' }
      })
      expect(consoleWarnSpy).toHaveBeenCalled()

      // Test error level
      await notificationService.sendSystemAlert({
        type: 'error_event',
        severity: 'error',
        data: { message: 'Error' }
      })
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('ERROR ALERT'),
        expect.any(Object)
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle channel send failures gracefully', async () => {
      // Create a notification service with a mock client that fails
      const mockSupabase = {
        ...supabaseAdmin,
        channel: () => ({
          send: async () => {
            throw new Error('Network error')
          }
        })
      }

      const failingService = new NotificationServiceServer(mockSupabase as any)

      const result = await failingService.sendCreatorNotification({
        creatorId: TEST_CREATOR_ID,
        type: 'test',
        title: 'Test',
        message: 'This should fail',
        data: {}
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to send notification')
    })

    it('should handle missing channel subscriptions', async () => {
      // Send notification without any listeners
      const result = await notificationService.sendCreatorNotification({
        creatorId: 'non-existent-creator',
        type: 'test',
        title: 'No listeners',
        message: 'This has no subscribers',
        data: {}
      })

      // Should still succeed even with no listeners
      expect(result.success).toBe(true)
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle multiple simultaneous broadcasts', async () => {
      const promises = []

      // Send 10 notifications simultaneously
      for (let i = 0; i < 10; i++) {
        promises.push(
          notificationService.sendCreatorNotification({
            creatorId: `creator-${i}`,
            type: 'bulk_test',
            title: `Notification ${i}`,
            message: `Message ${i}`,
            data: { index: i }
          })
        )
      }

      const results = await Promise.all(promises)

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true)
      })
    })

    it('should maintain message order within a channel', async () => {
      const messages: any[] = []
      
      const channel = supabaseClient.channel(`creator-order-test`)
      
      channel.on('broadcast', { event: '*' }, (payload: any) => {
        messages.push(payload)
      })
      
      await channel.subscribe()
      await new Promise(resolve => setTimeout(resolve, 500))

      // Send messages in rapid succession
      for (let i = 0; i < 5; i++) {
        await channel.send({
          type: 'broadcast',
          event: 'test',
          payload: { index: i }
        })
      }

      await new Promise(resolve => setTimeout(resolve, 1500))

      // Messages should be received in order
      expect(messages.length).toBeGreaterThan(0)
      messages.forEach((msg, index) => {
        if (messages[index + 1]) {
          expect(msg.payload.index).toBeLessThan(messages[index + 1].payload.index)
        }
      })

      await channel.unsubscribe()
    })
  })
})