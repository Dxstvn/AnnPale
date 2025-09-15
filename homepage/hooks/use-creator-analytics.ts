// Creator Analytics Hook
// Created: 2025-09-12

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { 
  RevenueAnalyticsResponse, 
  AnalyticsFilters, 
  AnalyticsSummary,
  ExportDataRequest,
  AnalyticsExport,
  UseAnalyticsReturn
} from '@/types/analytics'

export function useCreatorAnalytics(
  initialFilters: AnalyticsFilters = { period: '30d' }
): UseAnalyticsReturn {
  const [data, setData] = useState<RevenueAnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters)
  const [performance, setPerformance] = useState<{
    fetchTime: number
    cacheHit: boolean
    lastFetch: Date
  } | null>(null)

  const fetchAnalytics = useCallback(async (fetchFilters = filters) => {
    const startTime = typeof window !== 'undefined' && window.performance 
      ? window.performance.now() 
      : Date.now()
    setLoading(true)
    setError(null)

    try {
      // Build query params
      const params = new URLSearchParams({
        period: fetchFilters.period,
        includeSubscriptions: String(fetchFilters.includeSubscriptions !== false)
      })

      if (fetchFilters.startDate) params.set('startDate', fetchFilters.startDate)
      if (fetchFilters.endDate) params.set('endDate', fetchFilters.endDate)
      if (fetchFilters.occasionType) params.set('occasionType', fetchFilters.occasionType)

      const response = await fetch(`/api/creator/analytics/revenue?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add conditional headers for caching
          'If-None-Match': localStorage.getItem(`analytics-etag-${JSON.stringify(fetchFilters)}`) || ''
        }
      })

      // Handle 304 Not Modified
      if (response.status === 304) {
        console.log('Analytics data not modified, using cached version')
        const cachedData = localStorage.getItem(`analytics-data-${JSON.stringify(fetchFilters)}`)
        if (cachedData) {
          setData(JSON.parse(cachedData))
          return
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const analyticsData = await response.json()
      setData(analyticsData)

      // Cache data and ETag in localStorage
      const etag = response.headers.get('ETag')
      if (etag) {
        localStorage.setItem(`analytics-etag-${JSON.stringify(fetchFilters)}`, etag)
        localStorage.setItem(`analytics-data-${JSON.stringify(fetchFilters)}`, JSON.stringify(analyticsData))
      }

      // Track performance
      const endTime = typeof window !== 'undefined' && window.performance 
        ? window.performance.now() 
        : Date.now()
      const fetchTime = endTime - startTime
      const processingTime = response.headers.get('X-Processing-Time')
      const cacheStrategy = response.headers.get('X-Cache-Strategy')
      
      setPerformance({
        fetchTime: Math.round(fetchTime),
        cacheHit: cacheStrategy?.includes('redis') || false,
        lastFetch: new Date()
      })

      // Log performance for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`Analytics fetch completed in ${Math.round(fetchTime)}ms`, {
          serverProcessing: processingTime,
          cacheStrategy,
          dataSize: JSON.stringify(analyticsData).length
        })
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics'
      setError(errorMessage)
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const refetch = useCallback(async () => {
    await fetchAnalytics()
  }, [fetchAnalytics])

  const exportData = useCallback(async (request: ExportDataRequest): Promise<AnalyticsExport> => {
    try {
      const response = await fetch('/api/creator/analytics/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Export failed')
      }

      // For file downloads, handle differently
      if (request.format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 
                        `analytics_export_${Date.now()}.csv`
        
        // Trigger download
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return {
          filename,
          url,
          format: 'csv',
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          size_bytes: blob.size
        }
      } else {
        // JSON format
        const jsonData = await response.json()
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const filename = `analytics_export_${Date.now()}.json`
        
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return {
          filename,
          url,
          format: 'json',
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          size_bytes: blob.size
        }
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Export failed')
    }
  }, [])

  // Update filters and refetch
  const updateFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchAnalytics(updatedFilters)
  }, [filters, fetchAnalytics])

  // Initial fetch
  useEffect(() => {
    fetchAnalytics()
  }, []) // Only run on mount

  return {
    data,
    loading,
    error,
    refetch,
    exportData,
    updateFilters,
    performance
  }
}

// Hook for analytics summary (for dashboard cards)
export function useAnalyticsSummary(period: string = '30d') {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/creator/analytics/revenue?period=${period}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: RevenueAnalyticsResponse = await response.json()
      
      // Transform to summary format
      const topOccasion = data.occasionBreakdown.reduce(
        (max, current) => current.revenue > max.revenue ? current : max,
        { occasion: 'other' as any, revenue: 0, percentage: 0 }
      )

      const revenueGrowth = {
        current: data.totalRevenue,
        previous: data.monthlyStats.lastMonth.revenue,
        change: data.totalRevenue - data.monthlyStats.lastMonth.revenue,
        percentage: data.revenueGrowth,
        trend: data.revenueGrowth > 0 ? 'up' as const : 
               data.revenueGrowth < 0 ? 'down' as const : 'stable' as const
      }

      const orderGrowth = {
        current: data.totalOrders,
        previous: data.monthlyStats.lastMonth.orders,
        change: data.totalOrders - data.monthlyStats.lastMonth.orders,
        percentage: data.orderGrowth,
        trend: data.orderGrowth > 0 ? 'up' as const : 
               data.orderGrowth < 0 ? 'down' as const : 'stable' as const
      }

      setSummary({
        totalRevenue: data.totalRevenue,
        totalOrders: data.totalOrders,
        avgOrderValue: data.avgOrderValue,
        revenueGrowth,
        orderGrowth,
        topOccasion: {
          type: topOccasion.occasion,
          revenue: topOccasion.revenue,
          percentage: topOccasion.percentage
        },
        periodLabel: getPeriodLabel(period)
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch summary'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary
  }
}

// Helper function to get period labels
function getPeriodLabel(period: string): string {
  const labels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    '1y': 'Last Year',
    'custom': 'Custom Range'
  }
  return labels[period as keyof typeof labels] || 'Last 30 Days'
}

// Hook for real-time analytics updates (WebSocket integration)
export function useAnalyticsRealtime(creatorId: string) {
  const [updates, setUpdates] = useState<any[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time updates
    // This would connect to a WebSocket endpoint that broadcasts
    // analytics updates when new orders are completed
    
    // For now, we'll simulate with periodic polling
    const interval = setInterval(() => {
      // Could trigger refresh of analytics data
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [creatorId])

  return {
    updates,
    connected
  }
}