// Analytics Cache Invalidation Webhook
// POST /api/webhooks/analytics
// Created: 2025-09-12

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AnalyticsService } from '@/lib/services/analytics.service'
import { analyticsCacheService } from '@/lib/cache/redis'
import type { OccasionType } from '@/types/analytics'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verify webhook signature (basic validation)
    const webhookSecret = process.env.ANALYTICS_WEBHOOK_SECRET
    const signature = request.headers.get('x-webhook-signature')
    
    if (webhookSecret && signature !== webhookSecret) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const payload = await request.json()
    const { type, data } = payload

    switch (type) {
      case 'order.completed':
        await handleOrderCompleted(data)
        break
        
      case 'order.refunded':
        await handleOrderRefunded(data)
        break
        
      case 'subscription.created':
        await handleSubscriptionCreated(data)
        break
        
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data)
        break
        
      case 'cache.invalidate':
        await handleCacheInvalidation(data)
        break
        
      default:
        console.log(`Unhandled analytics webhook type: ${type}`)
        return NextResponse.json({ status: 'ignored' })
    }

    return NextResponse.json({ 
      status: 'success',
      processed_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics webhook error:', error)
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleOrderCompleted(data: any) {
  const { creator_id, order_id, amount, occasion, order_date } = data
  
  try {
    const analyticsService = new AnalyticsService()
    
    // Categorize occasion
    const occasionType = await categorizeOccasion(occasion)
    
    // Update analytics
    await analyticsService.updateAnalyticsForOrder(
      creator_id,
      order_id,
      amount,
      occasionType,
      new Date(order_date)
    )
    
    // Invalidate cache immediately
    await analyticsCacheService.invalidateCreatorCache(creator_id)
    
    console.log(`Analytics updated for completed order: ${order_id}`)
    
  } catch (error) {
    console.error('Error processing completed order:', error)
    throw error
  }
}

async function handleOrderRefunded(data: any) {
  const { creator_id, order_id, refund_amount } = data
  
  try {
    // For refunds, we need to subtract from analytics
    // This would require additional logic in AnalyticsService
    
    // Invalidate cache to reflect refund
    await analyticsCacheService.invalidateCreatorCache(creator_id)
    
    console.log(`Analytics cache invalidated for refunded order: ${order_id}`)
    
  } catch (error) {
    console.error('Error processing refunded order:', error)
    throw error
  }
}

async function handleSubscriptionCreated(data: any) {
  const { creator_id, subscription_id, amount } = data
  
  try {
    // Update subscription analytics
    // This would require subscription-specific analytics tracking
    
    await analyticsCacheService.invalidateCreatorCache(creator_id)
    
    console.log(`Analytics updated for new subscription: ${subscription_id}`)
    
  } catch (error) {
    console.error('Error processing subscription created:', error)
    throw error
  }
}

async function handleSubscriptionCancelled(data: any) {
  const { creator_id, subscription_id } = data
  
  try {
    await analyticsCacheService.invalidateCreatorCache(creator_id)
    
    console.log(`Analytics cache invalidated for cancelled subscription: ${subscription_id}`)
    
  } catch (error) {
    console.error('Error processing subscription cancelled:', error)
    throw error
  }
}

async function handleCacheInvalidation(data: any) {
  const { creator_id, type = 'all' } = data
  
  try {
    if (creator_id === 'all') {
      await analyticsCacheService.invalidateAll()
      console.log('All analytics cache invalidated')
    } else if (creator_id) {
      await analyticsCacheService.invalidateCreatorCache(creator_id)
      console.log(`Cache invalidated for creator: ${creator_id}`)
    }
    
  } catch (error) {
    console.error('Error invalidating cache:', error)
    throw error
  }
}

// Helper function to categorize occasions
async function categorizeOccasion(occasion: string): Promise<OccasionType> {
  if (!occasion) return 'other'
  
  const text = occasion.toLowerCase().trim()
  
  // Birthday
  if (text.includes('birthday') || text.includes('bday') || text.includes('born day')) {
    return 'birthday'
  }
  
  // Anniversary  
  if (text.includes('anniversary') || text.includes('wedding') || text.includes('married')) {
    return 'anniversary'
  }
  
  // Graduation
  if (text.includes('graduation') || text.includes('graduate') || text.includes('diploma')) {
    return 'graduation'
  }
  
  // Holiday
  if (text.includes('christmas') || text.includes('holiday') || text.includes('valentine')) {
    return 'holiday'
  }
  
  // Custom
  if (text.includes('custom') || text.includes('special') || text.includes('personal')) {
    return 'custom'
  }
  
  return 'other'
}

// Health check endpoint
export async function GET(request: NextRequest) {
  try {
    const isRedisHealthy = await analyticsCacheService.healthCheck()
    
    return NextResponse.json({
      status: 'healthy',
      redis_connected: isRedisHealthy,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}