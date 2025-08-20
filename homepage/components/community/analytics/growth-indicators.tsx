'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart,
  Calendar,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GrowthMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType: 'positive' | 'negative' | 'neutral';
  unit?: string;
  target?: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface CohortAnalysis {
  cohort: string;
  size: number;
  retention: {
    week1: number;
    month1: number;
    month3: number;
    month6: number;
  };
  ltv?: number;
  status: 'strong' | 'average' | 'weak';
}

interface ChurnReason {
  reason: string;
  count: number;
  percentage: number;
  preventable: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface GrowthIndicatorsProps {
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  onMetricClick?: (metric: GrowthMetric) => void;
  onExportData?: () => void;
  showProjections?: boolean;
  showCohorts?: boolean;
}

export function GrowthIndicators({
  timeRange = 'month',
  onMetricClick,
  onExportData,
  showProjections = true,
  showCohorts = true
}: GrowthIndicatorsProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [showChurnAnalysis, setShowChurnAnalysis] = React.useState(false);

  // Growth metrics
  const growthMetrics: GrowthMetric[] = [
    {
      id: 'new-members',
      name: 'New Members',
      value: 456,
      previousValue: 398,
      change: 14.6,
      changeType: 'positive',
      unit: 'users',
      target: 500,
      icon: UserPlus,
      color: 'text-green-600 bg-green-100',
      description: 'New registrations this period'
    },
    {
      id: 'retention-rate',
      name: 'Retention Rate',
      value: 68,
      previousValue: 65,
      change: 4.6,
      changeType: 'positive',
      unit: '%',
      target: 70,
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-100',
      description: '3-month user retention'
    },
    {
      id: 'referral-rate',
      name: 'Referral Rate',
      value: 23,
      previousValue: 19,
      change: 21.1,
      changeType: 'positive',
      unit: '%',
      target: 25,
      icon: Share2,
      color: 'text-purple-600 bg-purple-100',
      description: 'Users who referred others'
    },
    {
      id: 'reactivation',
      name: 'Reactivation',
      value: 134,
      previousValue: 98,
      change: 36.7,
      changeType: 'positive',
      unit: 'users',
      icon: RefreshCw,
      color: 'text-orange-600 bg-orange-100',
      description: 'Dormant users who returned'
    },
    {
      id: 'churn-rate',
      name: 'Churn Rate',
      value: 8.2,
      previousValue: 9.5,
      change: -13.7,
      changeType: 'positive',
      unit: '%',
      target: 7,
      icon: UserMinus,
      color: 'text-red-600 bg-red-100',
      description: 'Monthly user churn'
    },
    {
      id: 'net-growth',
      name: 'Net Growth',
      value: 312,
      previousValue: 245,
      change: 27.3,
      changeType: 'positive',
      unit: 'users',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
      description: 'New members minus churn'
    }
  ];

  // Cohort analysis data
  const cohortData: CohortAnalysis[] = [
    {
      cohort: 'Jan 2024',
      size: 523,
      retention: { week1: 85, month1: 72, month3: 68, month6: 65 },
      ltv: 125,
      status: 'strong'
    },
    {
      cohort: 'Feb 2024',
      size: 467,
      retention: { week1: 82, month1: 69, month3: 65, month6: 62 },
      ltv: 118,
      status: 'average'
    },
    {
      cohort: 'Mar 2024',
      size: 612,
      retention: { week1: 88, month1: 75, month3: 70, month6: 0 },
      ltv: 95,
      status: 'strong'
    },
    {
      cohort: 'Apr 2024',
      size: 489,
      retention: { week1: 79, month1: 66, month3: 0, month6: 0 },
      ltv: 0,
      status: 'weak'
    }
  ];

  // Churn reasons
  const churnReasons: ChurnReason[] = [
    { reason: 'Lack of engagement', count: 234, percentage: 35, preventable: true, priority: 'high' },
    { reason: 'Found alternative', count: 167, percentage: 25, preventable: false, priority: 'medium' },
    { reason: 'Technical issues', count: 134, percentage: 20, preventable: true, priority: 'high' },
    { reason: 'Content quality', count: 87, percentage: 13, preventable: true, priority: 'medium' },
    { reason: 'Time constraints', count: 47, percentage: 7, preventable: false, priority: 'low' }
  ];

  // Growth funnel
  const growthFunnel = [
    { stage: 'Visitors', count: 12450, conversion: 8.2 },
    { stage: 'Registrations', count: 1020, conversion: 78.4 },
    { stage: 'First Action', count: 800, conversion: 65.0 },
    { stage: 'Active Users', count: 520, conversion: 86.5 },
    { stage: 'Contributors', count: 450, conversion: 100 }
  ];

  // Member lifecycle stages
  const lifecycleStages = [
    { stage: 'New (0-7 days)', count: 456, percentage: 8, trend: 'up' },
    { stage: 'Learning (8-30 days)', count: 892, percentage: 16, trend: 'stable' },
    { stage: 'Active (31-90 days)', count: 1567, percentage: 28, trend: 'up' },
    { stage: 'Established (90+ days)', count: 2345, percentage: 42, trend: 'up' },
    { stage: 'At Risk', count: 334, percentage: 6, trend: 'down' }
  ];

  const getChangeIcon = (changeType: string) => {
    return changeType === 'positive' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  const renderMetricCard = (metric: GrowthMetric) => {
    const Icon = metric.icon;
    const progress = metric.target ? (metric.value / metric.target) * 100 : 0;
    const isSelected = selectedMetric === metric.id;

    return (
      <Card
        key={metric.id}
        className={cn(
          "hover:shadow-lg transition-all cursor-pointer",
          isSelected && "ring-2 ring-purple-500"
        )}
        onClick={() => {
          setSelectedMetric(isSelected ? null : metric.id);
          onMetricClick?.(metric);
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              metric.color
            )}>
              <Icon className="h-5 w-5" />
            </div>
            {metric.change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                getChangeColor(metric.changeType)
              )}>
                {getChangeIcon(metric.changeType)}
                <span>{Math.abs(metric.change).toFixed(1)}%</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.unit && (
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                )}
              </div>
              <div className="text-sm font-medium text-gray-900">{metric.name}</div>
            </div>

            {metric.previousValue && (
              <div className="text-xs text-gray-500">
                Previous: {metric.previousValue}{metric.unit || ''}
              </div>
            )}

            {metric.target && (
              <>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Target: {metric.target}{metric.unit || ''}</span>
                  <span className={cn(
                    "font-medium",
                    progress >= 100 ? "text-green-600" : 
                    progress >= 75 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </>
            )}

            <p className="text-xs text-gray-500 pt-2 border-t">{metric.description}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Growth Indicators</h2>
          <p className="text-gray-600">Track community growth and retention metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={showChurnAnalysis ? "default" : "outline"}
            size="sm"
            onClick={() => setShowChurnAnalysis(!showChurnAnalysis)}
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Churn Analysis
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Growth Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {growthMetrics.map(renderMetricCard)}
      </div>

      {/* Growth Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Growth Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Growth Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {growthFunnel.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm">
                      <span className="font-bold">{stage.count.toLocaleString()}</span>
                      {index < growthFunnel.length - 1 && (
                        <span className="text-gray-500 ml-2">({stage.conversion}%)</span>
                      )}
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / growthFunnel[0].count) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Lifecycle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Member Lifecycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lifecycleStages.map((stage) => (
                <div 
                  key={stage.stage}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      stage.trend === 'up' ? "bg-green-500" :
                      stage.trend === 'down' ? "bg-red-500" : "bg-gray-500"
                    )} />
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm">{stage.count.toLocaleString()}</span>
                    <span className="text-gray-500 text-xs ml-1">({stage.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <div className="font-medium">At-Risk Alert</div>
                  <div>334 members showing signs of disengagement</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Analysis */}
      {showCohorts && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cohort Retention Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Cohort</th>
                    <th className="text-right py-2">Size</th>
                    <th className="text-right py-2">Week 1</th>
                    <th className="text-right py-2">Month 1</th>
                    <th className="text-right py-2">Month 3</th>
                    <th className="text-right py-2">Month 6</th>
                    <th className="text-right py-2">LTV</th>
                    <th className="text-right py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((cohort) => (
                    <tr key={cohort.cohort} className="border-b">
                      <td className="py-2 font-medium">{cohort.cohort}</td>
                      <td className="text-right py-2">{cohort.size}</td>
                      <td className="text-right py-2">
                        <span className={cn(
                          cohort.retention.week1 >= 85 ? "text-green-600" :
                          cohort.retention.week1 >= 80 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {cohort.retention.week1}%
                        </span>
                      </td>
                      <td className="text-right py-2">
                        <span className={cn(
                          cohort.retention.month1 >= 70 ? "text-green-600" :
                          cohort.retention.month1 >= 65 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {cohort.retention.month1}%
                        </span>
                      </td>
                      <td className="text-right py-2">
                        {cohort.retention.month3 > 0 ? (
                          <span className={cn(
                            cohort.retention.month3 >= 65 ? "text-green-600" :
                            cohort.retention.month3 >= 60 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {cohort.retention.month3}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="text-right py-2">
                        {cohort.retention.month6 > 0 ? (
                          <span>{cohort.retention.month6}%</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="text-right py-2">
                        {cohort.ltv ? `$${cohort.ltv}` : '-'}
                      </td>
                      <td className="text-right py-2">
                        <Badge className={cn(
                          "text-xs",
                          cohort.status === 'strong' ? "bg-green-100 text-green-700" :
                          cohort.status === 'average' ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {cohort.status}
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

      {/* Churn Analysis */}
      {showChurnAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5" />
              Churn Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {churnReasons.map((reason) => (
                <div key={reason.reason} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-8 rounded-full",
                      reason.priority === 'high' ? "bg-red-500" :
                      reason.priority === 'medium' ? "bg-yellow-500" : "bg-gray-500"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{reason.reason}</div>
                      <div className="text-xs text-gray-500">
                        {reason.count} users ({reason.percentage}%)
                        {reason.preventable && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Preventable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    reason.priority === 'high' ? "bg-red-100 text-red-700" :
                    reason.priority === 'medium' ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {reason.priority} priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Projections */}
      {showProjections && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Growth Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">8,234</div>
                <div className="text-sm text-gray-600">End of Quarter</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">12,450</div>
                <div className="text-sm text-gray-600">End of Year</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">+42%</div>
                <div className="text-sm text-gray-600">Annual Growth Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-gray-600">Confidence Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}