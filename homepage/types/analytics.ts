// Analytics Types for Revenue Tracking
// Created: 2025-09-12

export interface CreatorRevenueAnalytics {
  id: string
  creator_id: string
  date: string // YYYY-MM-DD format
  total_revenue: number
  total_orders: number
  video_request_revenue: number
  subscription_revenue: number
  platform_fees: number
  net_earnings: number
  created_at: string
  updated_at: string
}

export interface CreatorOccasionAnalytics {
  id: string
  creator_id: string
  occasion_type: OccasionType
  date: string
  revenue: number
  order_count: number
  avg_order_value: number
  created_at: string
  updated_at: string
}

export interface CreatorMonthlyAnalytics {
  id: string
  creator_id: string
  month: string // YYYY-MM-01 format
  total_revenue: number
  total_orders: number
  avg_order_value: number
  revenue_growth_percentage: number
  order_growth_percentage: number
  previous_month_revenue: number
  previous_month_orders: number
  created_at: string
  updated_at: string
}

export type OccasionType = 
  | 'birthday'
  | 'anniversary' 
  | 'graduation'
  | 'holiday'
  | 'custom'
  | 'other'

export interface DailyRevenueData {
  date: string
  revenue: number
  orders: number
}

export interface MonthlyRevenueData {
  month: string
  revenue: number
  orders: number
  growth: number
}

export interface OccasionBreakdown {
  occasion: OccasionType
  revenue: number
  percentage: number
  order_count: number
  avg_order_value: number
  color: string
}

// Customer analytics types
export interface TopCustomer {
  customerId: string
  customerName: string
  customerEmail?: string
  avatarUrl?: string
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
  lastOrderDate?: string
  firstOrderDate?: string
}

export interface LoyalSubscriber {
  customerId: string
  customerName: string
  customerEmail?: string
  avatarUrl?: string
  subscriptionDuration: number // in days
  tierName: string
  tierPrice: number
  totalRevenue: number
  startDate: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  nextBillingDate?: string
}

export interface RevenueAnalyticsResponse {
  // Top level stats
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  revenueGrowth: number
  orderGrowth: number
  
  // Subscription stats
  totalSubscribers: number
  activeSubscribers: number
  monthlyRecurringRevenue: number
  subscriptionGrowth: number
  
  // Comparative stats
  monthlyStats: {
    thisMonth: {
      revenue: number
      orders: number
    }
    lastMonth: {
      revenue: number
      orders: number
    }
  }
  
  // Chart data
  dailyRevenue: DailyRevenueData[]
  monthlyRevenue: MonthlyRevenueData[]
  occasionBreakdown: OccasionBreakdown[]
  
  // Customer analytics
  topCustomers: TopCustomer[]
  loyalSubscribers: LoyalSubscriber[]
  
  // Time period info
  period: AnalyticsPeriod
  startDate: string
  endDate: string
}

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y' | 'custom'

export interface AnalyticsFilters {
  period: AnalyticsPeriod
  startDate?: string
  endDate?: string
  occasionType?: OccasionType
  includeSubscriptions?: boolean
}

export interface ExportDataRequest {
  format: 'csv' | 'json'
  filters: AnalyticsFilters
  includeDetails?: boolean
}

export interface AnalyticsExport {
  filename: string
  url: string
  format: 'csv' | 'json'
  generated_at: string
  expires_at: string
  size_bytes: number
}

// Chart configuration types
export interface ChartConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    gradient: {
      from: string
      to: string
    }
  }
  occasions: Record<OccasionType, {
    color: string
    label: string
  }>
}

// Growth calculation helpers
export interface GrowthMetrics {
  current: number
  previous: number
  change: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

// Real-time analytics update
export interface AnalyticsUpdate {
  creator_id: string
  type: 'revenue' | 'order' | 'refund'
  amount: number
  occasion_type?: OccasionType
  timestamp: string
  order_id: string
}

// Hook return types
export interface UseAnalyticsReturn {
  data: RevenueAnalyticsResponse | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  exportData: (request: ExportDataRequest) => Promise<AnalyticsExport>
  updateFilters: (filters: Partial<AnalyticsFilters>) => void
  performance: {
    fetchTime: number
    cacheHit: boolean
    lastFetch: Date
  } | null
}

// Analytics summary for dashboard cards
export interface AnalyticsSummary {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  revenueGrowth: GrowthMetrics
  orderGrowth: GrowthMetrics
  topOccasion: {
    type: OccasionType
    revenue: number
    percentage: number
  }
  periodLabel: string
}

// Occasion category mappings
export const OCCASION_CATEGORIES: Record<OccasionType, {
  label: string
  color: string
  keywords: string[]
}> = {
  birthday: {
    label: 'Birthday',
    color: '#9333EA',
    keywords: ['birthday', 'bday', 'born day', 'birth day']
  },
  anniversary: {
    label: 'Anniversary',
    color: '#EC4899',
    keywords: ['anniversary', 'wedding', 'marriage', 'married']
  },
  graduation: {
    label: 'Graduation',
    color: '#F59E0B',
    keywords: ['graduation', 'graduate', 'diploma', 'degree']
  },
  holiday: {
    label: 'Holiday',
    color: '#10B981',
    keywords: ['christmas', 'holiday', 'thanksgiving', 'valentine', 'easter']
  },
  custom: {
    label: 'Custom',
    color: '#3B82F6',
    keywords: ['custom', 'special', 'personal', 'congratulation']
  },
  other: {
    label: 'Other',
    color: '#6B7280',
    keywords: ['other', 'misc', 'general']
  }
}

// Period display labels
export const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days', 
  '90d': 'Last 90 Days',
  '1y': 'Last Year',
  'custom': 'Custom Range'
}

// Utility type for database row transformations
export interface AnalyticsRow {
  creator_id: string
  date: string
  revenue: number
  orders: number
  occasion_type?: OccasionType
}