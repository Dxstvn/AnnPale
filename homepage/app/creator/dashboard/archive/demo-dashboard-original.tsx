"use client"

import { useState, useMemo } from "react"
import { CreatorRealDashboard } from "@/components/creator/real-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Video, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Activity,
  Target
} from "lucide-react"
import { CreatorPersona } from "@/components/creator/dashboard/CreatorPersona"
import { WorkflowStages } from "@/components/creator/dashboard/WorkflowStages"
import { EmotionalJourney, type EmotionalStage } from "@/components/creator/dashboard/EmotionalJourney"
import { OrderManagement } from "@/components/creator/order-management"
import { ImmediateStatus } from "@/components/creator/dashboard/ImmediateStatus"
import { PerformanceOverview } from "@/components/creator/dashboard/PerformanceOverview"
import { ManagementTools } from "@/components/creator/dashboard/ManagementTools"
import { InsightsGrowth } from "@/components/creator/dashboard/InsightsGrowth"
import { useLanguage } from "@/contexts/language-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { useCreatorStats } from "@/hooks/use-stats"

// Comprehensive mock data structure
const dashboardData = {
  creator: {
    name: "Ti Jo",
    avatar: "/images/creator-avatar.jpg",
    level: "Rising Star",
    memberSince: "2024-01-01"
  },
  stats: {
    totalEarnings: 2450,
    pendingRequests: 8,
    completedVideos: 156,
    averageRating: 4.8,
    thisMonthEarnings: 890,
    monthlyEarnings: 890,
    responseTime: "24hr",
    accountAge: 45,
    followerCount: 2500,
    todayEarnings: 245,
    weekGrowth: 15.3,
    monthGrowth: 28.7,
    completionRate: 96,
    customerSatisfaction: 94
  },
  pendingRequests: [
    { id: 1, recipient: "Sarah", occasion: "Birthday", price: 85, hoursUntilDue: 6, isUrgent: true },
    { id: 2, recipient: "Marcus", occasion: "Graduation", price: 85, hoursUntilDue: 18, isUrgent: false },
    { id: 3, recipient: "Lisa & David", occasion: "Anniversary", price: 85, hoursUntilDue: 30, isUrgent: false },
  ],
  weeklyEarnings: [
    { day: "Mon", amount: 120, change: 5 },
    { day: "Tue", amount: 85, change: -10 },
    { day: "Wed", amount: 170, change: 25 },
    { day: "Thu", amount: 95, change: -5 },
    { day: "Fri", amount: 200, change: 15 },
    { day: "Sat", amount: 150, change: 10 },
    { day: "Sun", amount: 180, change: 20 },
  ],
  topVideos: [
    { id: 1, title: "Birthday message for Sarah", views: 1250, likes: 98, earnings: 85, rating: 4.9 },
    { id: 2, title: "Graduation congratulations", views: 890, likes: 67, earnings: 85, rating: 4.8 },
    { id: 3, title: "Anniversary wishes", views: 750, likes: 52, earnings: 85, rating: 4.7 },
  ],
  todayEvents: [
    { id: 1, time: "9:00 AM", title: "Record birthday messages (3)", type: 'recording' as const, priority: 'high' as const },
    { id: 2, time: "2:00 PM", title: "Response deadline - Marcus graduation", type: 'deadline' as const, priority: 'medium' as const },
    { id: 3, time: "4:00 PM", title: "Customer call with Marie L.", type: 'meeting' as const, priority: 'low' as const },
  ],
  recentMessages: [
    { id: 1, sender: "Marie L.", preview: "Thank you so much for the wonderful birthday message!", time: "10 min ago", unread: true, type: 'customer' as const },
    { id: 2, sender: "Support Team", preview: "Your payment for this week has been processed", time: "1 hour ago", unread: false, type: 'system' as const },
    { id: 3, sender: "Jean P.", preview: "Could you record the graduation message by tomorrow?", time: "3 hours ago", unread: true, type: 'customer' as const },
  ],
  contentLibrary: [
    { id: 1, name: "Birthday Template v2.mp4", type: 'video' as const, size: "25.4 MB", lastModified: "2 days ago", tags: ["birthday", "template"] },
    { id: 2, name: "Graduation Script.txt", type: 'script' as const, size: "2.1 KB", lastModified: "1 week ago", tags: ["graduation", "script"] },
    { id: 3, name: "Anniversary Background.jpg", type: 'template' as const, size: "1.8 MB", lastModified: "3 days ago", tags: ["anniversary", "background"] },
  ],
  audienceInsights: [
    { metric: "Avg Age", value: "28-34", change: 2, trend: 'up' as const },
    { metric: "Repeat Rate", value: "45%", change: 8, trend: 'up' as const },
    { metric: "Booking Time", value: "2.3 days", change: -5, trend: 'down' as const },
    { metric: "Satisfaction", value: "94%", change: 1, trend: 'stable' as const },
  ],
  revenueOptimizations: [
    { strategy: "Increase price for rush orders", impact: "+$300/month", difficulty: 'easy' as const, description: "Add 50% surcharge for requests due within 24 hours" },
    { strategy: "Offer package deals", impact: "+$500/month", difficulty: 'medium' as const, description: "Bundle multiple videos at discounted rate" },
    { strategy: "Premium tier pricing", impact: "+$800/month", difficulty: 'hard' as const, description: "Create VIP service with faster delivery" },
  ],
  growthRecommendations: [
    { title: "Optimize your response time", priority: 'high' as const, category: 'efficiency' as const, description: "Reduce average response time from 24hr to 12hr to increase bookings", expectedImpact: "+20% conversion rate" },
    { title: "Expand to wedding category", priority: 'medium' as const, category: 'content' as const, description: "High demand category with 40% higher average price", expectedImpact: "+$400/month potential" },
    { title: "Social media promotion", priority: 'medium' as const, category: 'marketing' as const, description: "Share success stories and behind-the-scenes content", expectedImpact: "+15% organic bookings" },
  ]
}

// Dashboard translations
const dashboardTranslations: Record<string, Record<string, string>> = {
  welcome: {
    en: "Welcome back",
    fr: "Bon retour",
    ht: "Byenveni ankò"
  },
  dashboard_subtitle: {
    en: "Here's what's happening with your account today",
    fr: "Voici ce qui se passe avec votre compte aujourd'hui",
    ht: "Men sa k ap pase ak kont ou jodi a"
  },
  total_earnings: {
    en: "Total Earnings",
    fr: "Revenus totaux",
    ht: "Total kòb ou fè"
  },
  pending_requests: {
    en: "Pending Requests",
    fr: "Demandes en attente",
    ht: "Demann k ap tann"
  },
  videos_completed: {
    en: "Videos Completed",
    fr: "Vidéos complétées",
    ht: "Videyo ki fini"
  },
  average_rating: {
    en: "Average Rating",
    fr: "Note moyenne",
    ht: "Nòt mwayèn"
  },
  response_time: {
    en: "Response Time",
    fr: "Temps de réponse",
    ht: "Tan repons"
  },
  today_earnings: {
    en: "Today's Earnings",
    fr: "Revenus d'aujourd'hui",
    ht: "Kòb jodi a"
  },
  this_week: {
    en: "This Week",
    fr: "Cette semaine",
    ht: "Semèn sa a"
  },
  this_month: {
    en: "This Month",
    fr: "Ce mois",
    ht: "Mwa sa a"
  },
  completion_rate: {
    en: "Completion Rate",
    fr: "Taux de complétion",
    ht: "To konplesyon"
  },
  customer_satisfaction: {
    en: "Customer Satisfaction",
    fr: "Satisfaction client",
    ht: "Satisfaksyon kliyan"
  }
}

export default function CreatorDashboard() {
  const { language } = useLanguage()
  const { user, isLoading } = useSupabaseAuth()
  const { stats, weeklyEarnings, pendingRequests, topVideos, loading: statsLoading } = useCreatorStats()
  const [currentWorkflowStage, setCurrentWorkflowStage] = useState('review')
  const [useRealData, setUseRealData] = useState(false) // Toggle for real vs mock data
  
  // Get translated text
  const t = (key: string) => {
    return dashboardTranslations[key]?.[language] || dashboardTranslations[key]?.en || key
  }
  
  // Determine emotional journey stage based on stats
  const emotionalStage = useMemo((): EmotionalStage => {
    if (!stats) return 'onboarding'
    if (stats.completedVideos === 0) return 'first-request'
    if (stats.pendingRequests > 10) return 'busy'
    if (stats.completedVideos > 100 && stats.monthlyEarnings > 2000) return 'success'
    if (stats.completedVideos > 50 && stats.monthlyEarnings < 500) return 'plateau'
    return 'growing'
  }, [stats])

  const handleStageAction = (stageId: string) => {
    console.log('Stage action:', stageId)
  }

  const handleJourneyAction = (action: string) => {
    console.log('Journey action:', action)
  }

  const handleAcceptRequest = (id: number) => {
    console.log('Accept request:', id)
  }

  const handleDeclineRequest = (id: number) => {
    console.log('Decline request:', id)
  }

  const handleRecordVideo = (id: number) => {
    console.log('Record video for request:', id)
  }

  const handleViewAllRequests = () => {
    console.log('View all requests')
  }

  const handleSendMessage = (message: string) => {
    console.log('Send message:', message)
  }

  const handleBulkAction = (action: string, items: number[]) => {
    console.log('Bulk action:', action, items)
  }

  // If using real data, show the real dashboard
  if (useRealData) {
    return (
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="mb-4 flex justify-end">
          <Button 
            onClick={() => setUseRealData(false)}
            variant="outline"
            size="sm"
          >
            Switch to Demo Data
          </Button>
        </div>
        <CreatorRealDashboard />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Welcome Section with Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('welcome')}, {user?.display_name || user?.email?.split('@')[0] || 'Creator'}!
            </h1>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setUseRealData(true)}
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
              >
                Use Real Data 🚀
              </Button>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {stats?.completedVideos > 100 ? 'Star Creator' : stats?.completedVideos > 50 ? 'Rising Star' : 'New Creator'}
              </Badge>
            </div>
          </div>
          <p className="text-gray-600">{t('dashboard_subtitle')}</p>
        </div>

        {/* Key Metrics Grid - Responsive with auto-fit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {/* Today's Earnings */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t('today_earnings')}</p>
                {statsLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold text-gray-900">${stats?.todayEarnings || 0}</p>}
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats?.weekGrowth || 0}%</span>
                  <span className="text-xs text-gray-500 ml-1">{t('this_week')}</span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Pending Requests */}
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t('pending_requests')}</p>
                {statsLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold text-gray-900">{stats?.pendingRequests || 0}</p>}
                <div className="flex items-center mt-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">3 urgent</span>
                </div>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          {/* Completion Rate */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t('completion_rate')}</p>
                {statsLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold text-gray-900">{stats?.completionRate || 0}%</p>}
                <div className="flex items-center mt-2">
                  <Activity className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-gray-500">Excellent</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Average Rating */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t('average_rating')}</p>
                {statsLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold text-gray-900">{stats?.averageRating || 0}</p>}
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(stats?.averageRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          {/* Customer Satisfaction */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t('customer_satisfaction')}</p>
                {statsLoading ? <Skeleton className="h-8 w-24" /> : <p className="text-2xl font-bold text-gray-900">{stats?.customerSatisfaction || 0}%</p>}
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600">+{stats?.monthGrowth || 0}%</span>
                  <span className="text-xs text-gray-500 ml-1">{t('this_month')}</span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Level 1: Immediate Status (Above fold) - Fixed padding */}
        <section className="mb-8">
          <ImmediateStatus
            pendingRequests={dashboardData.pendingRequests}
            todayEarnings={dashboardData.stats.todayEarnings}
            urgentDeadlines={dashboardData.pendingRequests.filter(r => r.isUrgent).length}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onRecord={handleRecordVideo}
            onViewAll={handleViewAllRequests}
          />
        </section>

        {/* Order Management Section - Real orders from backend */}
        <section className="mb-8">
          <OrderManagement />
        </section>

        {/* Content Management Section */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Content Management
                  </CardTitle>
                  <CardDescription>
                    Create and manage your posts for subscribers
                  </CardDescription>
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                  onClick={() => window.location.href = '/creator/posts'}
                >
                  Create New Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Draft Posts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Published Posts</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
              </div>
              <div className="mt-4 text-center text-gray-500">
                Start creating content to engage your subscribers and grow your audience!
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Level 2: Performance Overview - Fixed chart spacing */}
        <section className="mb-8">
          <PerformanceOverview
            weeklyEarnings={weeklyEarnings || []}
            completionRate={stats?.completionRate || 0}
            ratingTrend={0.2}
            averageRating={stats?.averageRating || 0}
            topVideos={topVideos || []}
            totalViews={15420}
            repeatCustomers={45}
            onViewAnalytics={() => console.log('View analytics')}
          />
        </section>

        {/* Workflow & Journey Grid - Responsive grid with minmax */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workflow Stages - Fixed progress indicators */}
          <WorkflowStages 
            currentStage={currentWorkflowStage}
            pendingRequests={dashboardData.stats.pendingRequests}
            todayEarnings={dashboardData.stats.todayEarnings}
            onStageAction={handleStageAction}
          />
          
          {/* Right Column Grid */}
          <div className="grid grid-cols-1 gap-6">
            <EmotionalJourney 
              stage={emotionalStage}
              stats={dashboardData.stats}
              onAction={handleJourneyAction}
            />
            <CreatorPersona stats={dashboardData.stats} />
          </div>
        </div>

        {/* Level 3: Management Tools - Fixed action button alignment */}
        <section className="mb-8">
          <ManagementTools
            todayEvents={dashboardData.todayEvents}
            recentMessages={dashboardData.recentMessages}
            contentLibrary={dashboardData.contentLibrary}
            onScheduleEvent={() => console.log('Schedule event')}
            onSendMessage={handleSendMessage}
            onBulkAction={handleBulkAction}
          />
        </section>

        {/* Level 4: Insights & Growth */}
        <section>
          <InsightsGrowth
            audienceInsights={dashboardData.audienceInsights}
            revenueOptimizations={dashboardData.revenueOptimizations}
            growthRecommendations={dashboardData.growthRecommendations}
            marketTrends={{
              demandScore: 78,
              competitionLevel: 'Medium',
              trendingCategories: ['Birthday', 'Graduation', 'Holiday Greetings']
            }}
            onImplementRecommendation={(id) => console.log('Implement:', id)}
            onViewDetailedReport={() => console.log('View detailed report')}
          />
        </section>
      </div>
    </TooltipProvider>
  )
}