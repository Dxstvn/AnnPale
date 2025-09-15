// Analytics Export API Endpoint
// GET/POST /api/creator/analytics/export
// Created: 2025-09-12

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AnalyticsService } from '@/lib/services/analytics.service'
import type { ExportDataRequest, AnalyticsExport } from '@/types/analytics'
import { format } from 'date-fns'

export async function GET(request: NextRequest) {
  return handleExport(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleExport(request, 'POST')
}

async function handleExport(request: NextRequest, method: 'GET' | 'POST') {
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
      .select('role, is_creator, name, email')
      .eq('id', user.id)
      .single()

    if (profileError || (!profile?.is_creator && profile?.role !== 'creator')) {
      return NextResponse.json(
        { error: 'Access denied. Creator role required.' },
        { status: 403 }
      )
    }

    // Parse request data
    let exportRequest: ExportDataRequest
    
    if (method === 'GET') {
      const { searchParams } = new URL(request.url)
      exportRequest = {
        format: (searchParams.get('format') as 'csv' | 'json') || 'csv',
        filters: {
          period: (searchParams.get('period') as any) || '30d',
          startDate: searchParams.get('startDate') || undefined,
          endDate: searchParams.get('endDate') || undefined,
          occasionType: searchParams.get('occasionType') as any,
          includeSubscriptions: searchParams.get('includeSubscriptions') !== 'false'
        },
        includeDetails: searchParams.get('includeDetails') === 'true'
      }
    } else {
      const body = await request.json()
      exportRequest = body
    }

    // Validate format
    if (!['csv', 'json'].includes(exportRequest.format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be csv or json' },
        { status: 400 }
      )
    }

    // Get analytics data
    const analyticsService = new AnalyticsService()
    const analyticsData = await analyticsService.getRevenueAnalytics(user.id, exportRequest.filters)

    // Generate export data
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
    const creatorName = profile.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'creator'
    const filename = `${creatorName}_revenue_analytics_${timestamp}.${exportRequest.format}`

    if (exportRequest.format === 'csv') {
      const csvData = generateCSV(analyticsData, exportRequest.includeDetails)
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache'
        }
      })
    } else {
      const jsonData = generateJSON(analyticsData, exportRequest.includeDetails, profile)
      
      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache'
        }
      })
    }

  } catch (error) {
    console.error('Analytics export API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to export analytics data' },
      { status: 500 }
    )
  }
}

function generateCSV(analyticsData: any, includeDetails: boolean = false): string {
  const lines: string[] = []
  
  // Header
  lines.push('# Revenue Analytics Export')
  lines.push(`# Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
  lines.push(`# Period: ${analyticsData.period} (${analyticsData.startDate} to ${analyticsData.endDate})`)
  lines.push('')

  // Summary stats
  lines.push('# Summary Statistics')
  lines.push('Metric,Value,Growth')
  lines.push(`Total Revenue,$${analyticsData.totalRevenue},${analyticsData.revenueGrowth}%`)
  lines.push(`Total Orders,${analyticsData.totalOrders},${analyticsData.orderGrowth}%`)
  lines.push(`Average Order Value,$${analyticsData.avgOrderValue.toFixed(2)},`)
  lines.push('')

  // Daily revenue data
  if (includeDetails && analyticsData.dailyRevenue?.length > 0) {
    lines.push('# Daily Revenue')
    lines.push('Date,Revenue,Orders')
    analyticsData.dailyRevenue.forEach((day: any) => {
      lines.push(`${day.date},$${day.revenue},${day.orders}`)
    })
    lines.push('')
  }

  // Monthly revenue data  
  if (analyticsData.monthlyRevenue?.length > 0) {
    lines.push('# Monthly Revenue')
    lines.push('Month,Revenue,Orders,Growth %')
    analyticsData.monthlyRevenue.forEach((month: any) => {
      lines.push(`${month.month},$${month.revenue},${month.orders},${month.growth}%`)
    })
    lines.push('')
  }

  // Occasion breakdown
  if (analyticsData.occasionBreakdown?.length > 0) {
    lines.push('# Revenue by Occasion Type')
    lines.push('Occasion,Revenue,Percentage,Orders,Avg Order Value')
    analyticsData.occasionBreakdown.forEach((occasion: any) => {
      lines.push(`${occasion.occasion},$${occasion.revenue},${occasion.percentage}%,${occasion.order_count},$${occasion.avg_order_value.toFixed(2)}`)
    })
  }

  return lines.join('\n')
}

function generateJSON(analyticsData: any, includeDetails: boolean = false, profile: any): any {
  const exportData = {
    metadata: {
      generated_at: new Date().toISOString(),
      creator: {
        id: profile.id,
        name: profile.name,
        email: profile.email
      },
      period: analyticsData.period,
      date_range: {
        start: analyticsData.startDate,
        end: analyticsData.endDate
      },
      include_details: includeDetails
    },
    summary: {
      total_revenue: analyticsData.totalRevenue,
      total_orders: analyticsData.totalOrders,
      avg_order_value: analyticsData.avgOrderValue,
      revenue_growth: analyticsData.revenueGrowth,
      order_growth: analyticsData.orderGrowth
    },
    monthly_stats: analyticsData.monthlyStats,
    monthly_revenue: analyticsData.monthlyRevenue,
    occasion_breakdown: analyticsData.occasionBreakdown
  }

  if (includeDetails && analyticsData.dailyRevenue?.length > 0) {
    exportData.daily_revenue = analyticsData.dailyRevenue
  }

  return exportData
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}