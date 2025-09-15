// Redis Cache Service for Analytics
// Created: 2025-09-12

import { Redis } from '@upstash/redis'

class AnalyticsCacheService {
  private redis: Redis
  private readonly CACHE_PREFIX = 'analytics:'
  private readonly TTL = {
    DAILY: 60 * 60 * 6,    // 6 hours for daily aggregates
    MONTHLY: 60 * 60 * 24, // 24 hours for monthly aggregates
    SUMMARY: 60 * 5,       // 5 minutes for summary stats
    EXPORT: 60 * 30        // 30 minutes for export data
  }

  constructor() {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      // Fallback to in-memory cache for development
      this.redis = null as any
    } else {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    }
  }

  private getKey(type: string, creatorId: string, identifier: string): string {
    return `${this.CACHE_PREFIX}${type}:${creatorId}:${identifier}`
  }

  async getRevenueAnalytics(
    creatorId: string, 
    period: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<any | null> {
    if (!this.redis) return null

    const identifier = `${period}:${startDate || ''}:${endDate || ''}`
    const key = this.getKey('revenue', creatorId, identifier)
    
    try {
      const cached = await this.redis.get(key)
      return cached
    } catch (error) {
      console.error('Redis cache get error:', error)
      return null
    }
  }

  async setRevenueAnalytics(
    creatorId: string, 
    period: string, 
    data: any,
    startDate?: string, 
    endDate?: string
  ): Promise<void> {
    if (!this.redis) return

    const identifier = `${period}:${startDate || ''}:${endDate || ''}`
    const key = this.getKey('revenue', creatorId, identifier)
    const ttl = this.getTTL(period)
    
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error('Redis cache set error:', error)
    }
  }

  async getDailySummary(creatorId: string, date: string): Promise<any | null> {
    if (!this.redis) return null

    const key = this.getKey('daily', creatorId, date)
    
    try {
      const cached = await this.redis.get(key)
      return cached
    } catch (error) {
      console.error('Redis cache get error:', error)
      return null
    }
  }

  async setDailySummary(creatorId: string, date: string, data: any): Promise<void> {
    if (!this.redis) return

    const key = this.getKey('daily', creatorId, date)
    
    try {
      await this.redis.setex(key, this.TTL.DAILY, JSON.stringify(data))
    } catch (error) {
      console.error('Redis cache set error:', error)
    }
  }

  async getMonthlySummary(creatorId: string, month: string): Promise<any | null> {
    if (!this.redis) return null

    const key = this.getKey('monthly', creatorId, month)
    
    try {
      const cached = await this.redis.get(key)
      return cached
    } catch (error) {
      console.error('Redis cache get error:', error)
      return null
    }
  }

  async setMonthlySummary(creatorId: string, month: string, data: any): Promise<void> {
    if (!this.redis) return

    const key = this.getKey('monthly', creatorId, month)
    
    try {
      await this.redis.setex(key, this.TTL.MONTHLY, JSON.stringify(data))
    } catch (error) {
      console.error('Redis cache set error:', error)
    }
  }

  async getOccasionBreakdown(creatorId: string, period: string): Promise<any | null> {
    if (!this.redis) return null

    const key = this.getKey('occasion', creatorId, period)
    
    try {
      const cached = await this.redis.get(key)
      return cached
    } catch (error) {
      console.error('Redis cache get error:', error)
      return null
    }
  }

  async setOccasionBreakdown(creatorId: string, period: string, data: any): Promise<void> {
    if (!this.redis) return

    const key = this.getKey('occasion', creatorId, period)
    
    try {
      await this.redis.setex(key, this.TTL.SUMMARY, JSON.stringify(data))
    } catch (error) {
      console.error('Redis cache set error:', error)
    }
  }

  async invalidateCreatorCache(creatorId: string): Promise<void> {
    if (!this.redis) return

    try {
      // Get all keys for this creator
      const pattern = `${this.CACHE_PREFIX}*:${creatorId}:*`
      const keys = await this.redis.keys(pattern)
      
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis cache invalidation error:', error)
    }
  }

  async invalidateAll(): Promise<void> {
    if (!this.redis) return

    try {
      const keys = await this.redis.keys(`${this.CACHE_PREFIX}*`)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis cache flush error:', error)
    }
  }

  private getTTL(period: string): number {
    switch (period) {
      case '7d':
      case '30d':
        return this.TTL.SUMMARY
      case '90d':
      case '1y':
        return this.TTL.MONTHLY
      case 'custom':
        return this.TTL.DAILY
      default:
        return this.TTL.SUMMARY
    }
  }

  // Method to warm cache for active creators
  async warmCache(creatorIds: string[]): Promise<void> {
    if (!this.redis) return

    // This would be called during off-peak hours
    // to pre-populate cache for frequently accessed creators
    console.log(`Warming cache for ${creatorIds.length} creators`)
    
    // Implementation would fetch and cache common queries
    // for each creator to improve response times
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    if (!this.redis) return false

    try {
      await this.redis.ping()
      return true
    } catch (error) {
      console.error('Redis health check failed:', error)
      return false
    }
  }
}

// Singleton instance
export const analyticsCacheService = new AnalyticsCacheService()

// Helper function for cache keys
export function getCacheKey(prefix: string, ...parts: string[]): string {
  return `analytics:${prefix}:${parts.join(':')}`
}