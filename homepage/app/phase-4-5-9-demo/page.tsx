'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionMetricsDashboard } from '@/components/subscription/analytics/subscription-metrics-dashboard';
import { RevenueMetricsTracker } from '@/components/subscription/analytics/revenue-metrics-tracker';
import { GrowthMetricsAnalyzer } from '@/components/subscription/analytics/growth-metrics-analyzer';
import { EngagementMetricsMonitor } from '@/components/subscription/analytics/engagement-metrics-monitor';
import { CohortAnalysis } from '@/components/subscription/analytics/cohort-analysis';
import { CreatorAnalyticsDashboard } from '@/components/subscription/analytics/creator-analytics-dashboard';
import { ForecastingInsights } from '@/components/subscription/analytics/forecasting-insights';
import { 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
  Eye,
  CheckCircle,
  Star,
  Zap,
  Award,
  ArrowRight,
  Calendar,
  Clock,
  Heart,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Phase459Demo() {
  const [selectedDemo, setSelectedDemo] = React.useState('overview');

  const demoSections = [
    {
      id: 'overview',
      name: 'Overview Dashboard',
      description: 'Comprehensive subscription metrics overview',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'revenue',
      name: 'Revenue Tracker',
      description: 'MRR, ARR, ARPU, LTV, CAC analysis',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'growth',
      name: 'Growth Analyzer',
      description: 'Growth metrics and cohort analysis',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      id: 'engagement',
      name: 'Engagement Monitor',
      description: 'User engagement and activity metrics',
      icon: Activity,
      color: 'text-orange-600'
    },
    {
      id: 'cohort',
      name: 'Cohort Analysis',
      description: 'Retention and revenue cohort tracking',
      icon: Users,
      color: 'text-indigo-600'
    },
    {
      id: 'creator',
      name: 'Creator Dashboard',
      description: 'Creator-specific analytics and insights',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 'forecasting',
      name: 'AI Forecasting',
      description: 'Predictive analytics and insights',
      icon: Star,
      color: 'text-pink-600'
    }
  ];

  const keyFeatures = [
    'Comprehensive subscription KPI tracking',
    'Revenue metrics (MRR, ARR, ARPU, LTV, CAC)',
    'Growth analysis with cohort retention',
    'Engagement monitoring across all tiers',
    'Creator performance analytics',
    'AI-powered forecasting and insights',
    'Real-time data visualization',
    'Actionable recommendations'
  ];

  const metrics = [
    { label: 'Total Components', value: '7', icon: Zap, color: 'text-blue-600' },
    { label: 'Key Metrics Tracked', value: '25+', icon: Target, color: 'text-green-600' },
    { label: 'Visualization Types', value: '12', icon: BarChart3, color: 'text-purple-600' },
    { label: 'AI Insights', value: '15+', icon: Zap, color: 'text-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Phase 4.5.9: Analytics & Reporting
              </h1>
              <p className="text-xl text-gray-600">
                Comprehensive Subscription Analytics Dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete
            </Badge>
            <Badge className="bg-blue-100 text-blue-700">
              7 Components
            </Badge>
            <Badge className="bg-purple-100 text-purple-700">
              AI-Powered Insights
            </Badge>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Icon className={cn("h-8 w-8 mx-auto mb-2", metric.color)} />
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Key Features Implemented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Interactive Demo Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {demoSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={selectedDemo === section.id ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => setSelectedDemo(section.id)}
                    >
                      <Icon className={cn("h-5 w-5", section.color)} />
                      <div className="text-center">
                        <div className="font-medium text-sm">{section.name}</div>
                        <div className="text-xs text-gray-600">{section.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Demo Component Display */}
              <div className="border rounded-lg p-6 bg-white">
                {selectedDemo === 'overview' && (
                  <SubscriptionMetricsDashboard 
                    onMetricClick={(id) => console.log('Metric clicked:', id)}
                    onTimeRangeChange={(range) => console.log('Time range changed:', range)}
                    onExportData={(format) => console.log('Export:', format)}
                    onRefreshData={() => console.log('Refresh data')}
                  />
                )}

                {selectedDemo === 'revenue' && (
                  <RevenueMetricsTracker 
                    onMetricClick={(id) => console.log('Revenue metric clicked:', id)}
                    onTimeRangeChange={(range) => console.log('Time range changed:', range)}
                  />
                )}

                {selectedDemo === 'growth' && (
                  <GrowthMetricsAnalyzer 
                    onMetricClick={(id) => console.log('Growth metric clicked:', id)}
                    onCohortAnalyze={(cohort) => console.log('Cohort analyzed:', cohort)}
                  />
                )}

                {selectedDemo === 'engagement' && (
                  <EngagementMetricsMonitor 
                    onMetricClick={(id) => console.log('Engagement metric clicked:', id)}
                    onTimeRangeChange={(range) => console.log('Time range changed:', range)}
                  />
                )}

                {selectedDemo === 'cohort' && (
                  <CohortAnalysis 
                    onCohortClick={(cohort) => console.log('Cohort clicked:', cohort)}
                    onTimeRangeChange={(range) => console.log('Time range changed:', range)}
                    onTierFilter={(tier) => console.log('Tier filtered:', tier)}
                    onExport={() => console.log('Export cohort data')}
                  />
                )}

                {selectedDemo === 'creator' && (
                  <CreatorAnalyticsDashboard 
                    onMetricClick={(id) => console.log('Creator metric clicked:', id)}
                    onContentClick={(id) => console.log('Content clicked:', id)}
                    onTimeRangeChange={(range) => console.log('Time range changed:', range)}
                    onExport={() => console.log('Export creator data')}
                    onRefresh={() => console.log('Refresh creator data')}
                  />
                )}

                {selectedDemo === 'forecasting' && (
                  <ForecastingInsights 
                    onForecastUpdate={(forecast) => console.log('Forecast updated:', forecast)}
                    onInsightAction={(id) => console.log('Insight action taken:', id)}
                    onScenarioSelect={(scenario) => console.log('Scenario selected:', scenario)}
                    onRefresh={() => console.log('Refresh forecasting data')}
                    onExport={() => console.log('Export forecasting data')}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Implementation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Technical Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Analytics Components Built:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-blue-500" />
                      Subscription Metrics Dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-green-500" />
                      Revenue Metrics Tracker
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-purple-500" />
                      Growth Metrics Analyzer
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-orange-500" />
                      Engagement Metrics Monitor
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-indigo-500" />
                      Cohort Analysis Component
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-yellow-500" />
                      Creator Analytics Dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-pink-500" />
                      AI Forecasting & Insights
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      Time-based filtering and comparison
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-green-500" />
                      Target tracking and progress indicators
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-purple-500" />
                      Trend analysis and forecasting
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-orange-500" />
                      Cohort retention analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="h-3 w-3 text-red-500" />
                      Engagement tracking across tiers
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-indigo-500" />
                      AI-powered insights and recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3 text-yellow-500" />
                      Interactive data exploration
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Phase Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Phase 4.5.9 Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  Successfully implemented comprehensive analytics and reporting system with 7 major components,
                  providing creators with detailed insights into subscription performance, revenue metrics, 
                  growth analysis, engagement tracking, and AI-powered forecasting.
                </p>
                <div className="flex justify-center gap-4">
                  <Badge className="bg-green-100 text-green-700">
                    ✅ 7/7 Components Complete
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    ✅ AI Insights Implemented
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700">
                    ✅ Real-time Analytics
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}