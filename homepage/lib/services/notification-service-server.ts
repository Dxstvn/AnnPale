/**
 * Server-side Notification Service using Supabase Broadcast
 * No custom tables required - uses Supabase Realtime Broadcast channels
 */

import { BaseService, ServiceResult } from './base.service'
import type { SupabaseClient } from '@supabase/supabase-js'

export class NotificationServiceServer extends BaseService {
  /**
   * Send a notification to a creator using Broadcast channel
   * No database tables required - uses Supabase Realtime
   */
  async sendCreatorNotification(params: {
    creatorId: string
    type: string
    title: string
    message: string
    data?: any
  }): Promise<ServiceResult<void>> {
    try {
      // Use Supabase Broadcast to send notification via channel
      const channel = this.supabase.channel(`creator-${params.creatorId}`)
      
      // Send broadcast message
      await channel.send({
        type: 'broadcast',
        event: params.type,
        payload: {
          title: params.title,
          message: params.message,
          timestamp: new Date().toISOString(),
          ...params.data
        }
      })

      // Log for debugging
      console.log(`📢 Broadcast notification sent to creator ${params.creatorId}:`, {
        type: params.type,
        title: params.title
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to send creator notification:', error)
      return { success: false, error: 'Failed to send notification' }
    }
  }

  /**
   * Send system alert - logs to console instead of database
   * For critical events that need monitoring
   */
  async sendSystemAlert(params: {
    type: string
    severity: 'info' | 'warning' | 'error' | 'critical'
    data: any
  }): Promise<ServiceResult<void>> {
    try {
      // Log system alerts to console with appropriate level
      const timestamp = new Date().toISOString()
      const alert = {
        timestamp,
        type: params.type,
        severity: params.severity,
        data: params.data
      }

      switch (params.severity) {
        case 'critical':
          console.error('🚨 CRITICAL ALERT:', alert)
          // In production, could send to monitoring service like Sentry
          break
        case 'error':
          console.error('❌ ERROR ALERT:', alert)
          break
        case 'warning':
          console.warn('⚠️ WARNING ALERT:', alert)
          break
        case 'info':
          console.info('ℹ️ INFO ALERT:', alert)
          break
      }

      // Optionally broadcast to admin channel for real-time monitoring
      if (params.severity === 'critical' || params.severity === 'error') {
        const adminChannel = this.supabase.channel('admin-alerts')
        await adminChannel.send({
          type: 'broadcast',
          event: 'system_alert',
          payload: alert
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Failed to send system alert:', error)
      return { success: false, error: 'Failed to send alert' }
    }
  }

  /**
   * Send notification to a fan using Broadcast channel
   */
  async sendFanNotification(params: {
    fanId: string
    type: string
    title: string
    message: string
    data?: any
  }): Promise<ServiceResult<void>> {
    try {
      // Use Supabase Broadcast to send notification via channel
      const channel = this.supabase.channel(`fan-${params.fanId}`)
      
      // Send broadcast message
      await channel.send({
        type: 'broadcast',
        event: params.type,
        payload: {
          title: params.title,
          message: params.message,
          timestamp: new Date().toISOString(),
          ...params.data
        }
      })

      console.log(`📢 Broadcast notification sent to fan ${params.fanId}:`, {
        type: params.type,
        title: params.title
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to send fan notification:', error)
      return { success: false, error: 'Failed to send notification' }
    }
  }

  /**
   * Broadcast to all creators (for platform-wide announcements)
   */
  async broadcastToCreators(params: {
    event: string
    title: string
    message: string
    data?: any
  }): Promise<ServiceResult<void>> {
    try {
      const channel = this.supabase.channel('all-creators')
      
      await channel.send({
        type: 'broadcast',
        event: params.event,
        payload: {
          title: params.title,
          message: params.message,
          timestamp: new Date().toISOString(),
          ...params.data
        }
      })

      console.log('📢 Broadcast sent to all creators:', params.title)
      return { success: true }
    } catch (error) {
      console.error('Failed to broadcast to creators:', error)
      return { success: false, error: 'Failed to broadcast' }
    }
  }

  /**
   * Send order status update notification
   */
  async sendOrderStatusUpdate(params: {
    orderId: string
    userId: string
    userType: 'creator' | 'fan'
    status: string
    message: string
  }): Promise<ServiceResult<void>> {
    const channel = `${params.userType}-${params.userId}`
    
    try {
      const supabaseChannel = this.supabase.channel(channel)
      
      await supabaseChannel.send({
        type: 'broadcast',
        event: 'order_status_update',
        payload: {
          orderId: params.orderId,
          status: params.status,
          message: params.message,
          timestamp: new Date().toISOString()
        }
      })

      console.log(`📢 Order status update sent to ${params.userType} ${params.userId}`)
      return { success: true }
    } catch (error) {
      console.error('Failed to send order status update:', error)
      return { success: false, error: 'Failed to send update' }
    }
  }
}

// Export for use in server-side code (API routes, webhooks)
export default NotificationServiceServer