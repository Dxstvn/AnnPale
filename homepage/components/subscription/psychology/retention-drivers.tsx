'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart,
  Users,
  Trophy,
  Star,
  Gift,
  Lock,
  Shield,
  Zap,
  TrendingUp,
  Target,
  Award,
  Crown,
  Sparkles,
  Calendar,
  MessageSquare,
  Video,
  DollarSign,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  Info,
  BarChart3,
  Clock,
  Repeat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RetentionDriver {
  id: string;
  driver: string;
  category: 'emotional' | 'functional' | 'social' | 'economic';
  description: string;
  impact: number;
  implementation: string[];
  icon: React.ElementType;
  color: string;
  metrics: {
    retention30Day: number;
    retention90Day: number;
    retention180Day: number;
  };
  risk: string;
}

interface ChurnReason {
  reason: string;
  percentage: number;
  preventable: boolean;
  solution: string;
}

interface RetentionCohort {
  cohort: string;
  month1: number;
  month3: number;
  month6: number;
  month12: number;
  ltv: number;
}

interface RetentionMetric {
  metric: string;
  value: string | number;
  target: string | number;
  performance: 'below' | 'meeting' | 'exceeding';
  trend: 'up' | 'down' | 'stable';
}

interface RetentionDriversProps {
  onDriverClick?: (driver: RetentionDriver) => void;
  onChurnReasonClick?: (reason: ChurnReason) => void;
  showCohorts?: boolean;
  showStrategies?: boolean;
}

export function RetentionDrivers({
  onDriverClick,
  onChurnReasonClick,
  showCohorts = true,
  showStrategies = true
}: RetentionDriversProps) {
  const [selectedDriver, setSelectedDriver] = React.useState<string>('exclusive-content');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [expandedStrategy, setExpandedStrategy] = React.useState<string | null>(null);

  // Retention drivers
  const retentionDrivers: RetentionDriver[] = [
    {
      id: 'exclusive-content',
      driver: 'Exclusive Content',
      category: 'functional',
      description: 'Unique value not available elsewhere',
      impact: 85,
      implementation: [
        'Behind-the-scenes videos',
        'Members-only live streams',
        'Early access releases',
        'Exclusive interviews'
      ],
      icon: Lock,
      color: 'text-purple-600 bg-purple-100',
      metrics: {
        retention30Day: 92,
        retention90Day: 78,
        retention180Day: 65
      },
      risk: 'Content quality decline'
    },
    {
      id: 'community-belonging',
      driver: 'Community Belonging',
      category: 'social',
      description: 'Strong peer connections and identity',
      impact: 78,
      implementation: [
        'Active forums',
        'Member events',
        'Shared experiences',
        'Recognition systems'
      ],
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      metrics: {
        retention30Day: 88,
        retention90Day: 72,
        retention180Day: 61
      },
      risk: 'Community toxicity'
    },
    {
      id: 'creator-connection',
      driver: 'Creator Connection',
      category: 'emotional',
      description: 'Personal relationship with creator',
      impact: 82,
      implementation: [
        'Direct messages',
        'Personal shoutouts',
        'Fan appreciation',
        'Regular interaction'
      ],
      icon: Heart,
      color: 'text-red-600 bg-red-100',
      metrics: {
        retention30Day: 90,
        retention90Day: 75,
        retention180Day: 68
      },
      risk: 'Creator burnout'
    },
    {
      id: 'habit-formation',
      driver: 'Habit Formation',
      category: 'functional',
      description: 'Regular usage patterns established',
      impact: 74,
      implementation: [
        'Daily content drops',
        'Scheduled events',
        'Streak rewards',
        'Push notifications'
      ],
      icon: Calendar,
      color: 'text-green-600 bg-green-100',
      metrics: {
        retention30Day: 85,
        retention90Day: 69,
        retention180Day: 58
      },
      risk: 'Routine disruption'
    },
    {
      id: 'sunk-cost',
      driver: 'Sunk Cost',
      category: 'economic',
      description: 'Investment in platform and content',
      impact: 68,
      implementation: [
        'Progress tracking',
        'Collection building',
        'Achievement systems',
        'Loyalty points'
      ],
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100',
      metrics: {
        retention30Day: 82,
        retention90Day: 66,
        retention180Day: 55
      },
      risk: 'Value perception decline'
    },
    {
      id: 'status-identity',
      driver: 'Status & Identity',
      category: 'emotional',
      description: 'Social status and self-expression',
      impact: 71,
      implementation: [
        'VIP badges',
        'Tier systems',
        'Public recognition',
        'Exclusive perks'
      ],
      icon: Crown,
      color: 'text-pink-600 bg-pink-100',
      metrics: {
        retention30Day: 86,
        retention90Day: 70,
        retention180Day: 59
      },
      risk: 'Status devaluation'
    }
  ];

  // Churn reasons
  const churnReasons: ChurnReason[] = [
    {
      reason: 'Price sensitivity',
      percentage: 28,
      preventable: true,
      solution: 'Flexible pricing tiers, pause options'
    },
    {
      reason: 'Content fatigue',
      percentage: 24,
      preventable: true,
      solution: 'Content variety, creator collaborations'
    },
    {
      reason: 'Lack of engagement',
      percentage: 19,
      preventable: true,
      solution: 'Personalization, re-engagement campaigns'
    },
    {
      reason: 'Technical issues',
      percentage: 12,
      preventable: true,
      solution: 'Platform stability, better support'
    },
    {
      reason: 'Life changes',
      percentage: 9,
      preventable: false,
      solution: 'Pause/resume options, win-back campaigns'
    },
    {
      reason: 'Competition',
      percentage: 8,
      preventable: true,
      solution: 'Unique value proposition, exclusive features'
    }
  ];

  // Retention cohorts
  const retentionCohorts: RetentionCohort[] = [
    { cohort: 'Jan 2024', month1: 85, month3: 68, month6: 52, month12: 41, ltv: 287 },
    { cohort: 'Feb 2024', month1: 88, month3: 71, month6: 55, month12: 43, ltv: 312 },
    { cohort: 'Mar 2024', month1: 82, month3: 65, month6: 48, month12: 38, ltv: 265 },
    { cohort: 'Apr 2024', month1: 90, month3: 74, month6: 58, month12: 45, ltv: 334 },
    { cohort: 'May 2024', month1: 87, month3: 70, month6: 54, month12: 42, ltv: 298 }
  ];

  // Key retention metrics
  const retentionMetrics: RetentionMetric[] = [
    { metric: 'Monthly Retention', value: '78%', target: '80%', performance: 'below', trend: 'up' },
    { metric: 'Churn Rate', value: '3.2%', target: '2.5%', performance: 'below', trend: 'down' },
    { metric: 'Avg Lifetime', value: '8.5mo', target: '12mo', performance: 'below', trend: 'up' },
    { metric: 'Reactivation Rate', value: '15%', target: '20%', performance: 'below', trend: 'stable' }
  ];

  const selectedDriverData = retentionDrivers.find(d => d.id === selectedDriver);

  const handleDriverSelect = (driver: RetentionDriver) => {
    setSelectedDriver(driver.id);
    onDriverClick?.(driver);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotional':
        return 'text-red-600 bg-red-100';
      case 'functional':
        return 'text-blue-600 bg-blue-100';
      case 'social':
        return 'text-green-600 bg-green-100';
      case 'economic':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'exceeding':
        return 'text-green-600';
      case 'meeting':
        return 'text-blue-600';
      case 'below':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredDrivers = selectedCategory === 'all' 
    ? retentionDrivers 
    : retentionDrivers.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Retention Drivers Analysis</h2>
        <p className="text-gray-600">
          Key factors driving subscriber retention and lifetime value
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {retentionMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-gray-500">{metric.metric}</span>
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : 
                   metric.trend === 'down' ? <ArrowDown className="h-3 w-3" /> : null}
                </div>
              </div>
              <div className={cn("text-2xl font-bold", getPerformanceColor(metric.performance))}>
                {metric.value}
              </div>
              <div className="text-xs text-gray-500">Target: {metric.target}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {['all', 'emotional', 'functional', 'social', 'economic'].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Retention Drivers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => {
          const Icon = driver.icon;
          const isSelected = selectedDriver === driver.id;
          
          return (
            <Card
              key={driver.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                isSelected && "ring-2 ring-purple-500"
              )}
              onClick={() => handleDriverSelect(driver)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    driver.color
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className={cn("text-xs", getCategoryColor(driver.category))}>
                    {driver.category}
                  </Badge>
                </div>

                <h3 className="font-semibold text-sm mb-1">{driver.driver}</h3>
                <p className="text-xs text-gray-600 mb-3">{driver.description}</p>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Impact Score</span>
                      <span className="text-xs font-bold">{driver.impact}%</span>
                    </div>
                    <Progress value={driver.impact} className="h-1" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">30-day</span>
                    <span className="font-medium">{driver.metrics.retention30Day}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Driver Details */}
      {selectedDriverData && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <selectedDriverData.icon className="h-6 w-6" />
              {selectedDriverData.driver} Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-sm mb-3">Implementation Tactics</h4>
                <div className="space-y-2">
                  {selectedDriverData.implementation.map((tactic, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-3">Retention Curve</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">30 Days</span>
                      <span className="font-bold">{selectedDriverData.metrics.retention30Day}%</span>
                    </div>
                    <Progress value={selectedDriverData.metrics.retention30Day} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">90 Days</span>
                      <span className="font-bold">{selectedDriverData.metrics.retention90Day}%</span>
                    </div>
                    <Progress value={selectedDriverData.metrics.retention90Day} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">180 Days</span>
                      <span className="font-bold">{selectedDriverData.metrics.retention180Day}%</span>
                    </div>
                    <Progress value={selectedDriverData.metrics.retention180Day} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Risk Factor</h4>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">{selectedDriverData.risk}</p>
                      <p className="text-xs text-red-700 mt-1">
                        Monitor and mitigate to maintain effectiveness
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Churn Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Churn Reasons & Prevention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {churnReasons.map((reason) => (
              <div 
                key={reason.reason}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
                onClick={() => onChurnReasonClick?.(reason)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-sm">{reason.reason}</h4>
                    <Badge 
                      variant={reason.preventable ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {reason.preventable ? "Preventable" : "Unavoidable"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{reason.solution}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{reason.percentage}%</div>
                  <div className="text-xs text-gray-500">of churn</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cohort Analysis */}
      {showCohorts && (
        <Card>
          <CardHeader>
            <CardTitle>Cohort Retention Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 text-sm font-medium">Cohort</th>
                    <th className="py-2 text-sm font-medium text-right">Month 1</th>
                    <th className="py-2 text-sm font-medium text-right">Month 3</th>
                    <th className="py-2 text-sm font-medium text-right">Month 6</th>
                    <th className="py-2 text-sm font-medium text-right">Month 12</th>
                    <th className="py-2 text-sm font-medium text-right">LTV</th>
                  </tr>
                </thead>
                <tbody>
                  {retentionCohorts.map((cohort) => (
                    <tr key={cohort.cohort} className="border-b">
                      <td className="py-2 text-sm font-medium">{cohort.cohort}</td>
                      <td className="py-2 text-sm text-right">
                        <span className={cn(
                          "font-medium",
                          cohort.month1 >= 85 ? "text-green-600" : "text-gray-600"
                        )}>
                          {cohort.month1}%
                        </span>
                      </td>
                      <td className="py-2 text-sm text-right">
                        <span className={cn(
                          "font-medium",
                          cohort.month3 >= 70 ? "text-green-600" : "text-gray-600"
                        )}>
                          {cohort.month3}%
                        </span>
                      </td>
                      <td className="py-2 text-sm text-right">
                        <span className={cn(
                          "font-medium",
                          cohort.month6 >= 55 ? "text-green-600" : "text-gray-600"
                        )}>
                          {cohort.month6}%
                        </span>
                      </td>
                      <td className="py-2 text-sm text-right">
                        <span className={cn(
                          "font-medium",
                          cohort.month12 >= 40 ? "text-green-600" : "text-gray-600"
                        )}>
                          {cohort.month12}%
                        </span>
                      </td>
                      <td className="py-2 text-sm text-right">
                        <Badge variant="outline" className="text-xs">
                          ${cohort.ltv}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Retention Strategies */}
      {showStrategies && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Retention Optimization Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Repeat className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Re-engagement Campaigns</h4>
                  <p className="text-xs text-gray-600">
                    Automated campaigns for declining engagement patterns
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Surprise & Delight</h4>
                  <p className="text-xs text-gray-600">
                    Unexpected rewards to reinforce positive behavior
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Pause Options</h4>
                  <p className="text-xs text-gray-600">
                    Allow temporary breaks instead of full cancellation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Loyalty Programs</h4>
                  <p className="text-xs text-gray-600">
                    Reward long-term subscribers with increasing benefits
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}