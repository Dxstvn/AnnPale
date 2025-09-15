// Revenue Analytics API Endpoint
// GET /api/creator/analytics/revenue
// Created: 2025-09-12

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AnalyticsService } from '@/lib/services/analytics.service'
import { analyticsCacheService } from '@/lib/cache/redis'
import type { AnalyticsFilters } from '@/types/analytics'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Verify user is a creator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_creator')
      .eq('id', user.id)
      .single()

    if (profileError || (!profile?.is_creator && profile?.role !== 'creator')) {
      return NextResponse.json(
        { error: 'Access denied. Creator role required.' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const occasionType = searchParams.get('occasionType') as any
    const includeSubscriptions = searchParams.get('includeSubscriptions') !== 'false'

    // Validate period parameter
    const validPeriods = ['7d', '30d', '90d', '1y', 'custom']
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period parameter. Must be one of: ' + validPeriods.join(', ') },
        { status: 400 }
      )
    }

    // Validate custom period dates
    if (period === 'custom') {
      if (!startDate || !endDate) {
        return NextResponse.json(
          { error: 'startDate and endDate are required for custom period' },
          { status: 400 }
        )
      }

      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD' },
          { status: 400 }
        )
      }

      if (start >= end) {
        return NextResponse.json(
          { error: 'startDate must be before endDate' },
          { status: 400 }
        )
      }

      // Limit custom range to 1 year max
      const maxRange = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
      if (end.getTime() - start.getTime() > maxRange) {
        return NextResponse.json(
          { error: 'Custom date range cannot exceed 1 year' },
          { status: 400 }
        )
      }
    }

    // Validate occasion type
    const validOccasions = ['birthday', 'anniversary', 'graduation', 'holiday', 'custom', 'other']
    if (occasionType && !validOccasions.includes(occasionType)) {
      return NextResponse.json(
        { error: 'Invalid occasion type. Must be one of: ' + validOccasions.join(', ') },
        { status: 400 }
      )
    }

    // Build filters object
    const filters: AnalyticsFilters = {
      period: period as any,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      occasionType: occasionType || undefined,
      includeSubscriptions
    }

    // Initialize analytics service and get data
    const startTime = Date.now()
    const analyticsService = new AnalyticsService()
    const analyticsData = await analyticsService.getRevenueAnalytics(user.id, filters)
    const processingTime = Date.now() - startTime

    // Determine cache duration based on period and data freshness
    let cacheMaxAge = 300 // Default 5 minutes
    let staleWhileRevalidate = 60 // Default 1 minute
    
    if (period === '7d' || period === '30d') {
      cacheMaxAge = 180  // 3 minutes for recent data
      staleWhileRevalidate = 30
    } else if (period === '90d' || period === '1y') {
      cacheMaxAge = 600  // 10 minutes for longer periods
      staleWhileRevalidate = 120
    }

    const response = NextResponse.json(analyticsData)
    
    // Enhanced caching headers
    response.headers.set('Cache-Control', 
      `public, max-age=${cacheMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`)
    response.headers.set('Vary', 'Accept, Authorization')
    response.headers.set('X-Processing-Time', `${processingTime}ms`)
    response.headers.set('X-Cache-Strategy', 'redis-db')
    
    // Add ETag for conditional requests
    const etag = `"${user.id}-${period}-${JSON.stringify(analyticsData).length}"`
    response.headers.set('ETag', etag)
    
    // Check if client has current version
    const ifNoneMatch = request.headers.get('If-None-Match')
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 })
    }
    
    return response

  } catch (error) {
    console.error('Revenue analytics API error:', error)
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}