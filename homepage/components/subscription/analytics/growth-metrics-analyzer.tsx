'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserMinus,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  LineChart,
  Calendar,
  Clock,
  Zap,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Info,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface GrowthMetric {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  icon: React.ElementType;
  color: string;
  description: string;
  target?: number;
  benchmark?: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  trend: 'accelerating' | 'steady' | 'decelerating';
  insights?: string[];
}

interface GrowthCohort {
  month: string;
  newSubscribers: number;
  month1Retention: number;
  month3Retention: number;
  month6Retention: number;
  month12Retention: number;
  avgRevenue: number;
}

interface GrowthDriver {
  driver: string;
  impact: number;
  change: number;
  contribution: number;
  color: string;
}

interface GrowthMetricsAnalyzerProps {
  metrics?: GrowthMetric[];
  cohorts?: GrowthCohort[];
  drivers?: GrowthDriver[];
  timeRange?: string;
  onMetricClick?: (metricId: string) => void;
  onCohortAnalyze?: (cohort: GrowthCohort) => void;
  showCohortAnalysis?: boolean;
  showGrowthDrivers?: boolean;
}

export function GrowthMetricsAnalyzer({
  metrics = [],
  cohorts = [],
  drivers = [],
  timeRange = '30d',
  onMetricClick,
  onCohortAnalyze,
  showCohortAnalysis = true,
  showGrowthDrivers = true
}: GrowthMetricsAnalyzerProps) {
  const [expandedMetric, setExpandedMetric] = React.useState<string | null>(null);
  const [selectedCohort, setSelectedCohort] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default growth metrics based on specification
  const defaultMetrics: GrowthMetric[] = metrics.length > 0 ? metrics : [
    {
      id: 'new_subscribers',
      name: 'New Subscribers',
      value: 284,
      formattedValue: '284',
      change: 18.9,
      changeType: 'increase',
      period: 'vs last month',
      icon: UserPlus,
      color: 'text-green-600',
      description: 'New subscription activations this period',
      target: 350,
      benchmark: 200,
      status: 'good',
      trend: 'accelerating',
      insights: [
        'Strong organic growth from referrals',
        'Social media campaigns driving 32% of acquisitions',
        'Weekend signups 40% higher than weekdays'
      ]
    },
    {
      id: 'churn_rate',
      name: 'Monthly Churn Rate',
      value: 4.2,
      formattedValue: '4.2%',
      change: -1.8,
      changeType: 'decrease',
      period: 'vs last month',
      icon: UserMinus,
      color: 'text-red-600',
      description: 'Percentage of subscribers who cancelled this period',
      target: 3.0,
      benchmark: 5.0,
      status: 'good',
      trend: 'steady',
      insights: [
        'Churn rate improving due to retention campaigns',
        'Bronze tier showing highest churn at 6.2%',
        'Exit surveys indicate price sensitivity as main factor'
      ]
    },
    {
      id: 'net_revenue_retention',
      name: 'Net Revenue Retention',
      value: 112,
      formattedValue: '112%',
      change: 3.4,
      changeType: 'increase',
      period: 'vs last quarter',
      icon: TrendingUp,
      color: 'text-emerald-600',
      description: 'Revenue retention including expansions and contractions',
      target: 120,
      benchmark: 100,
      status: 'excellent',
      trend: 'accelerating',
      insights: [
        'Strong upselling to Silver and Gold tiers',
        'Expansion revenue contributing 18% to growth',
        'Best-in-class retention for creator economy'
      ]
    },
    {
      id: 'upgrade_rate',
      name: 'Tier Upgrade Rate',
      value: 12.8,
      formattedValue: '12.8%',
      change: 5.2,
      changeType: 'increase',
      period: 'vs last month',
      icon: ArrowUpRight,
      color: 'text-blue-600',
      description: 'Percentage of users who upgraded their tier',
      target: 15.0,
      benchmark: 8.0,
      status: 'good',
      trend: 'accelerating',
      insights: [
        'Bronze to Silver upgrades most common (78%)',
        'Upgrade incentives increasing conversion by 23%',
        'Feature limitations driving upgrade decisions'
      ]
    },
    {
      id: 'downgrade_rate',
      name: 'Tier Downgrade Rate',
      value: 2.1,
      formattedValue: '2.1%',
      change: -0.8,
      changeType: 'decrease',
      period: 'vs last month',
      icon: ArrowDownRight,
      color: 'text-orange-600',
      description: 'Percentage of users who downgraded their tier',
      target: 1.5,
      benchmark: 3.0,
      status: 'average',
      trend: 'steady',
      insights: [
        'Downgrades primarily from Gold to Silver',
        'Price sensitivity main downgrade reason',
        'Retention offers preventing 40% of downgrades'
      ]
    },
    {
      id: 'reactivation_rate',
      name: 'Reactivation Rate',
      value: 8.6,
      formattedValue: '8.6%',
      change: 2.3,
      changeType: 'increase',
      period: 'vs last month',
      icon: RotateCcw,
      color: 'text-purple-600',
      description: 'Percentage of churned users who resubscribed',
      target: 12.0,
      benchmark: 6.0,
      status: 'good',
      trend: 'accelerating',
      insights: [
        'Win-back campaigns showing strong results',
        'Average reactivation time: 45 days',
        'Reactivated users show 25% higher LTV'
      ]
    }
  ];

  // Default cohort data
  const defaultCohorts: GrowthCohort[] = cohorts.length > 0 ? cohorts : [
    {
      month: 'Jan 2024',
      newSubscribers: 245,
      month1Retention: 92,
      month3Retention: 78,
      month6Retention: 65,
      month12Retention: 0, // Too recent
      avgRevenue: 18.50
    },
    {
      month: 'Feb 2024',
      newSubscribers: 267,
      month1Retention: 89,
      month3Retention: 74,
      month6Retention: 62,
      month12Retention: 0,
      avgRevenue: 19.80
    },
    {
      month: 'Mar 2024',
      newSubscribers: 298,
      month1Retention: 94,
      month3Retention: 81,
      month6Retention: 0, // Too recent
      month12Retention: 0,
      avgRevenue: 21.20
    },
    {
      month: 'Apr 2024',
      newSubscribers: 284,
      month1Retention: 91,
      month3Retention: 0, // Too recent
      month6Retention: 0,
      month12Retention: 0,
      avgRevenue: 22.40
    }
  ];

  // Default growth drivers
  const defaultDrivers: GrowthDriver[] = drivers.length > 0 ? drivers : [
    {
      driver: 'Organic Referrals',
      impact: 32,
      change: 8.5,
      contribution: 91,
      color: 'text-green-600'
    },
    {
      driver: 'Social Media Ads',
      impact: 28,
      change: 12.3,
      contribution: 80,
      color: 'text-blue-600'
    },
    {
      driver: 'Content Marketing',
      impact: 18,
      change: -2.1,
      contribution: 51,
      color: 'text-purple-600'
    },
    {
      driver: 'Influencer Partnerships',
      impact: 12,
      change: 15.7,
      contribution: 34,
      color: 'text-orange-600'
    },
    {
      driver: 'Email Campaigns',
      impact: 7,
      change: -5.2,
      contribution: 20,
      color: 'text-pink-600'
    },
    {
      driver: 'Paid Search',
      impact: 3,
      change: -8.1,
      contribution: 8,
      color: 'text-gray-600'
    }
  ];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'accelerating': return TrendingUp;
      case 'decelerating': return TrendingDown;
      default: return Activity;
    }
  };

  // Get change icon
  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return ArrowUpRight;
      case 'decrease': return ArrowDownRight;
      default: return ArrowRight;
    }
  };

  // Calculate overall growth score
  const calculateGrowthScore = () => {
    const scores = defaultMetrics.map(metric => {
      switch (metric.status) {
        case 'excellent': return 100;
        case 'good': return 75;
        case 'average': return 50;
        case 'poor': return 25;
        default: return 0;
      }
    });
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const growthScore = calculateGrowthScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Metrics Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Growth Score</p>
              <p className={cn(
                "text-2xl font-bold",
                growthScore >= 80 ? "text-green-600" :
                growthScore >= 60 ? "text-yellow-600" :
                "text-red-600"
              )}>
                {growthScore}/100
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">New Subscribers</p>
              <p className="text-2xl font-bold text-green-600">
                +{defaultMetrics.find(m => m.id === 'new_subscribers')?.value}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-red-600">
                {defaultMetrics.find(m => m.id === 'churn_rate')?.formattedValue}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Net Retention</p>
              <p className="text-2xl font-bold text-emerald-600">
                {defaultMetrics.find(m => m.id === 'net_revenue_retention')?.formattedValue}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {defaultMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.changeType);
          const TrendIcon = getTrendIcon(metric.trend);
          const isExpanded = expandedMetric === metric.id;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="transition-all cursor-pointer hover:shadow-md">
                <CardHeader 
                  onClick={() => {
                    setExpandedMetric(isExpanded ? null : metric.id);
                    onMetricClick?.(metric.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        "bg-gray-100"
                      )}>
                        <Icon className={cn("h-5 w-5", metric.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{metric.name}</CardTitle>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getStatusColor(metric.status))}>
                        {metric.status}
                      </Badge>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">{metric.formattedValue}</div>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          metric.changeType === 'increase' ? "text-green-600" : "text-red-600"
                        )}>
                          <ChangeIcon className="h-4 w-4" />
                          <span>{Math.abs(metric.change)}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <TrendIcon className="h-4 w-4" />
                          <span>{metric.trend}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress to Target */}
                    {metric.target && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress to target</span>
                          <span className="font-medium">
                            {Math.round((metric.value / metric.target) * 100)}%
                          </span>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      </div>
                    )}

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4"
                        >
                          {/* Benchmarks */}
                          <div className="grid grid-cols-2 gap-4">
                            {metric.target && (
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Target</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {metric.target}{metric.formattedValue.includes('%') ? '%' : ''}
                                </p>
                              </div>
                            )}
                            {metric.benchmark && (
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Benchmark</p>
                                <p className="text-lg font-bold text-purple-600">
                                  {metric.benchmark}{metric.formattedValue.includes('%') ? '%' : ''}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Insights */}
                          {metric.insights && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Key Insights:</p>
                              <ul className="space-y-1">
                                {metric.insights.map((insight, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Cohort Analysis */}
      {showCohortAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cohort Retention Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Cohort</th>
                      <th className="text-center p-2">Size</th>
                      <th className="text-center p-2">Month 1</th>
                      <th className="text-center p-2">Month 3</th>
                      <th className="text-center p-2">Month 6</th>
                      <th className="text-center p-2">Avg Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaultCohorts.map((cohort, index) => (
                      <tr 
                        key={index} 
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedCohort(selectedCohort === cohort.month ? null : cohort.month);
                          onCohortAnalyze?.(cohort);
                        }}
                      >
                        <td className="p-2 font-medium">{cohort.month}</td>
                        <td className="text-center p-2">{cohort.newSubscribers}</td>
                        <td className="text-center p-2">
                          <Badge className={cn(
                            "text-xs",
                            cohort.month1Retention >= 90 ? "bg-green-100 text-green-700" :
                            cohort.month1Retention >= 80 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {cohort.month1Retention}%
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          {cohort.month3Retention > 0 ? (
                            <Badge className={cn(
                              "text-xs",
                              cohort.month3Retention >= 75 ? "bg-green-100 text-green-700" :
                              cohort.month3Retention >= 65 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {cohort.month3Retention}%
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="text-center p-2">
                          {cohort.month6Retention > 0 ? (
                            <Badge className={cn(
                              "text-xs",
                              cohort.month6Retention >= 60 ? "bg-green-100 text-green-700" :
                              cohort.month6Retention >= 50 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {cohort.month6Retention}%
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="text-center p-2 font-medium">${cohort.avgRevenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Cohort Insights</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Recent cohorts showing improved month 1 retention (94% vs 89%)</li>
                  <li>• Average revenue per user trending upward across cohorts</li>
                  <li>• Strong correlation between early engagement and long-term retention</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Drivers */}
      {showGrowthDrivers && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Growth Driver Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defaultDrivers.map((driver, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{driver.driver}</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {driver.impact}% impact
                      </Badge>
                      <Badge className={cn(
                        "text-xs",
                        driver.change > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {driver.change > 0 ? '+' : ''}{driver.change}%
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={driver.impact} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{driver.contribution} new subscribers</span>
                      <span className={driver.color}>●</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Health Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Growth Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {defaultMetrics.filter(m => m.status === 'excellent' || m.status === 'good').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Healthy Metrics</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {defaultMetrics.filter(m => m.trend === 'accelerating').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Accelerating Trends</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">
                  {defaultMetrics.filter(m => m.status === 'average' || m.status === 'poor').length}
                </span>
              </div>
              <p className="text-sm text-gray-600">Needs Attention</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-6 w-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{growthScore}</span>
              </div>
              <p className="text-sm text-gray-600">Overall Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}