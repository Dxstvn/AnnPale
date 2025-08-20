"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, TrendingUp, Target, Download } from "lucide-react"
import Link from "next/link"
import { MetricsVisualization } from "@/components/creator/analytics/MetricsVisualization"
import { InsightCategories } from "@/components/creator/analytics/InsightCategories"
import { ActionableRecommendations } from "@/components/creator/analytics/ActionableRecommendations"

// Mock data for comprehensive analytics
const mockMetrics = {
  earnings: {
    current: 2450,
    previous: 2180,
    target: 3000,
    change: 12.4,
    trend: 'up' as const,
    benchmark: 2200,
    status: 'good' as const,
    series: [
      { period: 'Mon', value: 350 },
      { period: 'Tue', value: 280 },
      { period: 'Wed', value: 420 },
      { period: 'Thu', value: 380 },
      { period: 'Fri', value: 520 },
      { period: 'Sat', value: 380 },
      { period: 'Sun', value: 480 }
    ]
  },
  requests: {
    current: 45,
    previous: 38,
    target: 50,
    change: 18.4,
    trend: 'up' as const,
    benchmark: 40,
    status: 'good' as const,
    series: [
      { period: 'Mon', value: 6 },
      { period: 'Tue', value: 4 },
      { period: 'Wed', value: 8 },
      { period: 'Thu', value: 7 },
      { period: 'Fri', value: 9 },
      { period: 'Sat', value: 6 },
      { period: 'Sun', value: 5 }
    ]
  },
  rating: {
    current: 4.8,
    previous: 4.6,
    target: 4.9,
    change: 4.3,
    trend: 'up' as const,
    benchmark: 4.5,
    status: 'good' as const,
    series: [
      { period: 'W1', value: 4.7 },
      { period: 'W2', value: 4.6 },
      { period: 'W3', value: 4.8 },
      { period: 'W4', value: 4.8 }
    ]
  },
  responseTime: {
    current: 2.3,
    previous: 3.1,
    target: 3.0,
    change: -25.8,
    trend: 'up' as const,
    benchmark: 4.2,
    status: 'good' as const
  },
  completionRate: {
    current: 96,
    previous: 92,
    target: 95,
    change: 4.3,
    trend: 'up' as const,
    benchmark: 88,
    status: 'good' as const
  },
  views: {
    current: 15420,
    previous: 13200,
    target: 18000,
    change: 16.8,
    trend: 'up' as const,
    benchmark: 12500,
    status: 'good' as const,
    heatmap: [
      { day: 0, hour: 6, views: 120 },
      { day: 0, hour: 12, views: 180 },
      { day: 0, hour: 18, views: 150 },
      { day: 1, hour: 6, views: 200 },
      { day: 1, hour: 12, views: 250 },
      { day: 1, hour: 18, views: 220 },
      // ... more heatmap data
    ]
  }
}

const mockRevenueInsights = [
  {
    type: 'best-times' as const,
    title: 'Peak Performance Hours',
    value: 'Thu-Fri 2-6 PM',
    change: 35,
    description: 'Your videos get 35% more views and bookings during these hours.',
    actionable: 'Schedule your content releases during peak hours for maximum impact.',
    priority: 'high' as const,
    impact: '+ $300/month'
  },
  {
    type: 'optimal-pricing' as const,
    title: 'Price Optimization',
    value: '$95',
    change: 12,
    description: 'Increase your base price to $95 for 12% higher revenue without affecting bookings.',
    actionable: 'Test price increase with A/B split over 2 weeks.',
    priority: 'high' as const,
    impact: '+ $400/month'
  }
]

const mockPerformanceInsights = [
  {
    type: 'response-time' as const,
    title: 'Response Time Impact',
    current: 92,
    target: 95,
    description: 'Faster responses correlate with 23% higher customer satisfaction.',
    recommendations: [
      'Set up mobile notifications for new requests',
      'Create template responses for common inquiries',
      'Schedule specific times for checking messages'
    ],
    priority: 'medium' as const
  },
  {
    type: 'quality-balance' as const,
    title: 'Quality vs Quantity Balance',
    current: 88,
    target: 90,
    description: 'Your quality scores are high, but volume could increase efficiency.',
    recommendations: [
      'Batch similar video types together',
      'Create content templates for common occasions',
      'Optimize your recording setup for faster production'
    ],
    priority: 'medium' as const
  }
]

const mockGrowthInsights = [
  {
    type: 'market-trends' as const,
    title: 'Holiday Season Demand',
    trend: 'up' as const,
    confidence: 92,
    description: 'Holiday video requests are trending 40% higher than last year.',
    nextSteps: [
      'Create holiday-themed content packages',
      'Adjust pricing for peak season',
      'Promote early booking discounts'
    ],
    timeframe: '2-4 weeks'
  },
  {
    type: 'expansion-opportunities' as const,
    title: 'Wedding Market Potential',
    trend: 'up' as const,
    confidence: 85,
    description: 'Wedding congratulations have 60% higher average prices.',
    nextSteps: [
      'Add wedding category to your profile',
      'Create sample wedding content',
      'Partner with wedding planning services'
    ],
    timeframe: '1-2 months'
  }
]

const mockRecommendations = [
  {
    id: '1',
    title: 'Optimize Peak Hour Scheduling',
    category: 'revenue' as const,
    priority: 'high' as const,
    impact: 'high' as const,
    effort: 'low' as const,
    timeframe: '1-2 weeks',
    description: 'Schedule content releases during your peak performance hours for maximum engagement.',
    currentValue: 2450,
    projectedValue: 2750,
    confidence: 87,
    steps: [
      'Analyze your current posting schedule',
      'Identify top 3 peak performance time slots',
      'Create a content calendar for optimal timing',
      'Monitor performance for 2 weeks'
    ],
    metrics: ['Views', 'Engagement', 'Bookings', 'Revenue']
  },
  {
    id: '2',
    title: 'Implement Dynamic Pricing',
    category: 'revenue' as const,
    priority: 'high' as const,
    impact: 'high' as const,
    effort: 'medium' as const,
    timeframe: '2-3 weeks',
    description: 'Adjust pricing based on demand, urgency, and seasonal trends.',
    currentValue: 85,
    projectedValue: 105,
    confidence: 82,
    steps: [
      'Set up base, premium, and rush pricing tiers',
      'Create urgency-based pricing rules',
      'Implement seasonal price adjustments',
      'A/B test pricing strategies'
    ],
    metrics: ['Average Order Value', 'Conversion Rate', 'Revenue']
  }
]

export default function CreatorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30')
  const [activeTab, setActiveTab] = useState('overview')

  const handleAnalyzeMetric = (metric: string) => {
    console.log('Analyzing metric:', metric)
    // Navigate to detailed metric view
  }

  const handleTakeAction = (category: string, type: string) => {
    console.log('Taking action:', category, type)
    // Implement action based on insight
  }

  const handleViewDetails = (category: string, type: string) => {
    console.log('Viewing details:', category, type)
    // Show detailed view
  }

  const handleImplementRecommendation = (id: string) => {
    console.log('Implementing recommendation:', id)
    // Start implementation workflow
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/creator/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Analytics & Insights</h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Performance Visualization
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                +12.4% this month
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Benchmarks
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <MetricsVisualization
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              metrics={mockMetrics}
              onAnalyzeMetric={handleAnalyzeMetric}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightCategories
              revenueInsights={mockRevenueInsights}
              performanceInsights={mockPerformanceInsights}
              growthInsights={mockGrowthInsights}
              onTakeAction={handleTakeAction}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <ActionableRecommendations
              recommendations={mockRecommendations}
              onImplement={handleImplementRecommendation}
              onDismiss={(id) => console.log('Dismiss:', id)}
              onTrackProgress={(id, progress) => console.log('Track:', id, progress)}
              onViewDetails={(id) => console.log('Details:', id)}
            />
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Benchmark comparisons would go here */}
              <div className="col-span-full text-center py-12">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Benchmarking Dashboard
                </h3>
                <p className="text-gray-600">
                  Compare your performance against platform averages and top creators
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}