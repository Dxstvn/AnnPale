'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield,
  Mail,
  MessageSquare,
  Video,
  Gift,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  Zap,
  Heart,
  Star,
  ArrowRight,
  PlayCircle,
  Send,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RetentionStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'churned';
  intervention: string;
  timing: string;
  channel: string[];
  successRate: number;
  icon: React.ElementType;
  cost: 'low' | 'medium' | 'high';
  automationLevel: 'manual' | 'semi-auto' | 'full-auto';
  prerequisites?: string[];
  bestPractices?: string[];
  examples?: {
    title: string;
    content: string;
  }[];
}

interface StrategyPerformance {
  strategyId: string;
  attempts: number;
  successes: number;
  failures: number;
  avgResponseTime: number;
  roi: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface ActiveCampaign {
  id: string;
  strategyId: string;
  startDate: Date;
  targetUsers: number;
  currentProgress: number;
  conversions: number;
  status: 'active' | 'scheduled' | 'completed' | 'paused';
}

interface RetentionStrategiesProps {
  strategies?: RetentionStrategy[];
  performance?: StrategyPerformance[];
  campaigns?: ActiveCampaign[];
  onStrategySelect?: (strategy: RetentionStrategy) => void;
  onCampaignCreate?: (strategy: RetentionStrategy) => void;
  onStrategyTest?: (strategy: RetentionStrategy) => void;
  showPerformance?: boolean;
}

export function RetentionStrategies({
  strategies = [],
  performance = [],
  campaigns = [],
  onStrategySelect,
  onCampaignCreate,
  onStrategyTest,
  showPerformance = true
}: RetentionStrategiesProps) {
  const [selectedRiskLevel, setSelectedRiskLevel] = React.useState<string>('all');
  const [expandedStrategy, setExpandedStrategy] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default strategies based on specification
  const defaultStrategies: RetentionStrategy[] = strategies.length > 0 ? strategies : [
    {
      id: 'engagement_email',
      name: 'Engagement Email Campaign',
      description: 'Monthly engagement emails highlighting new content and features',
      riskLevel: 'low',
      intervention: 'Automated email series',
      timing: 'Monthly',
      channel: ['Email'],
      successRate: 85,
      icon: Mail,
      cost: 'low',
      automationLevel: 'full-auto',
      prerequisites: ['Valid email', 'Opt-in consent'],
      bestPractices: [
        'Personalize content based on viewing history',
        'Include exclusive previews',
        'Highlight community achievements'
      ],
      examples: [
        {
          title: 'Subject: Your monthly creator update!',
          content: 'See what you missed this month, including 5 exclusive videos...'
        }
      ]
    },
    {
      id: 'personal_message',
      name: 'Personal Creator Message',
      description: 'Direct message from creator to re-engage subscriber',
      riskLevel: 'medium',
      intervention: 'Personal outreach',
      timing: 'Weekly',
      channel: ['In-app', 'Email'],
      successRate: 70,
      icon: MessageSquare,
      cost: 'medium',
      automationLevel: 'semi-auto',
      prerequisites: ['Creator availability', 'Message templates'],
      bestPractices: [
        'Reference specific user interests',
        'Mention missed content',
        'Offer exclusive interaction'
      ]
    },
    {
      id: 'special_offer',
      name: 'Special Retention Offer',
      description: 'Time-limited discount or bonus to prevent cancellation',
      riskLevel: 'high',
      intervention: 'Discount/Bonus',
      timing: 'Immediate',
      channel: ['Email', 'In-app', 'SMS'],
      successRate: 50,
      icon: Gift,
      cost: 'high',
      automationLevel: 'full-auto',
      prerequisites: ['Offer approval', 'Budget allocation'],
      bestPractices: [
        'Create urgency with time limits',
        'Bundle with exclusive content',
        'Show value comparison'
      ]
    },
    {
      id: 'creator_video',
      name: 'Personal Creator Video',
      description: 'Custom video message from creator for at-risk subscriber',
      riskLevel: 'critical',
      intervention: 'Direct video',
      timing: 'Real-time',
      channel: ['Direct', 'Email'],
      successRate: 40,
      icon: Video,
      cost: 'high',
      automationLevel: 'manual',
      prerequisites: ['Creator agreement', 'Recording capability'],
      bestPractices: [
        'Keep under 2 minutes',
        'Address by name',
        'Express genuine appreciation'
      ]
    },
    {
      id: 'winback_campaign',
      name: 'Win-back Campaign',
      description: 'Re-engagement campaign for churned subscribers',
      riskLevel: 'churned',
      intervention: 'Multi-touch campaign',
      timing: '30 days post-churn',
      channel: ['Email'],
      successRate: 20,
      icon: Heart,
      cost: 'medium',
      automationLevel: 'full-auto',
      prerequisites: ['Churn reason data', 'Win-back offer'],
      bestPractices: [
        'Address churn reason directly',
        'Show what\'s new since they left',
        'Offer comeback incentive'
      ]
    },
    {
      id: 'vip_upgrade',
      name: 'VIP Status Upgrade',
      description: 'Complimentary upgrade to higher tier for loyal users',
      riskLevel: 'low',
      intervention: 'Status upgrade',
      timing: 'Quarterly',
      channel: ['In-app', 'Email'],
      successRate: 90,
      icon: Award,
      cost: 'medium',
      automationLevel: 'semi-auto',
      prerequisites: ['Tenure > 6 months', 'Good standing'],
      bestPractices: [
        'Celebrate milestones',
        'Include exclusive perks',
        'Create social proof'
      ]
    },
    {
      id: 'community_event',
      name: 'Exclusive Community Event',
      description: 'Live event or Q&A session for engaged subscribers',
      riskLevel: 'low',
      intervention: 'Live interaction',
      timing: 'Monthly',
      channel: ['Live', 'In-app'],
      successRate: 75,
      icon: Users,
      cost: 'low',
      automationLevel: 'manual',
      prerequisites: ['Event scheduling', 'Creator availability'],
      bestPractices: [
        'Announce well in advance',
        'Create FOMO for non-attendees',
        'Record for replay value'
      ]
    },
    {
      id: 'payment_recovery',
      name: 'Payment Recovery Flow',
      description: 'Automated payment retry and update flow',
      riskLevel: 'critical',
      intervention: 'Payment assistance',
      timing: 'Immediate',
      channel: ['Email', 'In-app', 'SMS'],
      successRate: 65,
      icon: DollarSign,
      cost: 'low',
      automationLevel: 'full-auto',
      prerequisites: ['Payment processor integration', 'Retry logic'],
      bestPractices: [
        'Multiple retry attempts',
        'Clear update instructions',
        'Grace period offer'
      ]
    }
  ];

  // Sample performance data
  const defaultPerformance: StrategyPerformance[] = performance.length > 0 ? performance : [
    {
      strategyId: 'engagement_email',
      attempts: 1250,
      successes: 1062,
      failures: 188,
      avgResponseTime: 24,
      roi: 320,
      trend: 'stable'
    },
    {
      strategyId: 'personal_message',
      attempts: 450,
      successes: 315,
      failures: 135,
      avgResponseTime: 48,
      roi: 280,
      trend: 'improving'
    },
    {
      strategyId: 'special_offer',
      attempts: 320,
      successes: 160,
      failures: 160,
      avgResponseTime: 2,
      roi: 150,
      trend: 'declining'
    },
    {
      strategyId: 'creator_video',
      attempts: 45,
      successes: 18,
      failures: 27,
      avgResponseTime: 72,
      roi: 120,
      trend: 'stable'
    },
    {
      strategyId: 'winback_campaign',
      attempts: 890,
      successes: 178,
      failures: 712,
      avgResponseTime: 168,
      roi: 85,
      trend: 'improving'
    }
  ];

  // Sample active campaigns
  const defaultCampaigns: ActiveCampaign[] = campaigns.length > 0 ? campaigns : [
    {
      id: 'camp_1',
      strategyId: 'engagement_email',
      startDate: new Date(currentTime - 5 * 24 * 60 * 60 * 1000),
      targetUsers: 500,
      currentProgress: 75,
      conversions: 85,
      status: 'active'
    },
    {
      id: 'camp_2',
      strategyId: 'special_offer',
      startDate: new Date(currentTime - 2 * 24 * 60 * 60 * 1000),
      targetUsers: 120,
      currentProgress: 40,
      conversions: 24,
      status: 'active'
    },
    {
      id: 'camp_3',
      strategyId: 'winback_campaign',
      startDate: new Date(currentTime + 2 * 24 * 60 * 60 * 1000),
      targetUsers: 300,
      currentProgress: 0,
      conversions: 0,
      status: 'scheduled'
    }
  ];

  // Filter strategies by risk level
  const filteredStrategies = selectedRiskLevel === 'all'
    ? defaultStrategies
    : defaultStrategies.filter(s => s.riskLevel === selectedRiskLevel);

  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'from-green-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-yellow-600';
      case 'high': return 'from-orange-400 to-orange-600';
      case 'critical': return 'from-red-400 to-red-600';
      case 'churned': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Get risk level badge
  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      case 'churned': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get cost color
  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Calculate overall retention rate
  const overallRetentionRate = Math.round(
    defaultStrategies.reduce((sum, s) => sum + s.successRate, 0) / defaultStrategies.length
  );

  // Get strategy performance
  const getStrategyPerformance = (strategyId: string) => {
    return defaultPerformance.find(p => p.strategyId === strategyId);
  };

  return (
    <div className="space-y-6">
      {/* Overview Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Retention Strategies Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Strategies</p>
              <p className="text-2xl font-bold">{defaultStrategies.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Success Rate</p>
              <p className="text-2xl font-bold">{overallRetentionRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold">
                {defaultCampaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Users Saved (30d)</p>
              <p className="text-2xl font-bold">
                {defaultPerformance.reduce((sum, p) => sum + p.successes, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Level Filter */}
      <div className="flex gap-2">
        {['all', 'low', 'medium', 'high', 'critical', 'churned'].map(level => (
          <Button
            key={level}
            size="sm"
            variant={selectedRiskLevel === level ? 'default' : 'outline'}
            onClick={() => setSelectedRiskLevel(level)}
            className={selectedRiskLevel === level && level !== 'all' ? getRiskLevelBadge(level) : ''}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
            {level !== 'all' && (
              <Badge className="ml-2 text-xs" variant="secondary">
                {defaultStrategies.filter(s => s.riskLevel === level).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Strategies Grid/List */}
      <div className={cn(
        viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'
      )}>
        {filteredStrategies.map(strategy => {
          const Icon = strategy.icon;
          const perf = getStrategyPerformance(strategy.id);
          const isExpanded = expandedStrategy === strategy.id;
          const activeCampaigns = defaultCampaigns.filter(c => c.strategyId === strategy.id && c.status === 'active');

          return (
            <Card 
              key={strategy.id}
              className={cn(
                "transition-all cursor-pointer",
                strategy.riskLevel === 'critical' && "border-red-300"
              )}
              onClick={() => setExpandedStrategy(isExpanded ? null : strategy.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      getRiskLevelColor(strategy.riskLevel)
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{strategy.name}</h3>
                        <Badge className={cn("text-xs", getRiskLevelBadge(strategy.riskLevel))}>
                          {strategy.riskLevel} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {strategy.timing}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {strategy.successRate}% success
                        </span>
                        <span className={cn("flex items-center gap-1", getCostColor(strategy.cost))}>
                          <DollarSign className="h-3 w-3" />
                          {strategy.cost} cost
                        </span>
                      </div>

                      {/* Channel badges */}
                      <div className="flex gap-1 mt-2">
                        {strategy.channel.map(channel => (
                          <Badge key={channel} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Automation level */}
                  <Badge variant="outline" className="text-xs">
                    {strategy.automationLevel === 'full-auto' && <Zap className="h-3 w-3 mr-1" />}
                    {strategy.automationLevel === 'full-auto' ? 'Auto' :
                     strategy.automationLevel === 'semi-auto' ? 'Semi' : 'Manual'}
                  </Badge>
                </div>
              </CardHeader>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CardContent className="space-y-4">
                      {/* Performance metrics */}
                      {showPerformance && perf && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium mb-2">Performance Metrics</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-gray-600">Attempts</p>
                              <p className="font-medium">{perf.attempts}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Success Rate</p>
                              <p className="font-medium">
                                {Math.round((perf.successes / perf.attempts) * 100)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">ROI</p>
                              <p className="font-medium">{perf.roi}%</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {strategy.prerequisites && (
                        <div>
                          <p className="text-sm font-medium mb-2">Prerequisites</p>
                          <ul className="space-y-1">
                            {strategy.prerequisites.map((prereq, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Best practices */}
                      {strategy.bestPractices && (
                        <div>
                          <p className="text-sm font-medium mb-2">Best Practices</p>
                          <ul className="space-y-1">
                            {strategy.bestPractices.map((practice, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                <Star className="h-3 w-3 text-yellow-500 mt-0.5" />
                                {practice}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Examples */}
                      {strategy.examples && (
                        <div>
                          <p className="text-sm font-medium mb-2">Examples</p>
                          {strategy.examples.map((example, idx) => (
                            <div key={idx} className="p-2 bg-blue-50 rounded text-xs">
                              <p className="font-medium text-blue-900">{example.title}</p>
                              <p className="text-blue-700 mt-1">{example.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Active campaigns */}
                      {activeCampaigns.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium mb-2">Active Campaigns</p>
                          {activeCampaigns.map(campaign => (
                            <div key={campaign.id} className="text-xs">
                              <div className="flex items-center justify-between">
                                <span>{campaign.targetUsers} users targeted</span>
                                <span className="font-medium">{campaign.conversions} converted</span>
                              </div>
                              <Progress value={campaign.currentProgress} className="h-1 mt-1" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCampaignCreate?.(strategy);
                          }}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Launch Campaign
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStrategyTest?.(strategy);
                          }}
                        >
                          Test Strategy
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Retention Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Mail, label: 'Send Bulk Email', description: 'Reach all at-risk users' },
              { icon: Phone, label: 'Call High-Value', description: 'Personal outreach to VIPs' },
              { icon: Gift, label: 'Deploy Offers', description: 'Activate retention offers' },
              { icon: BarChart3, label: 'View Analytics', description: 'Detailed retention metrics' }
            ].map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto p-4 flex-col items-center text-center bg-white"
              >
                <action.icon className="h-8 w-8 mb-2 text-purple-600" />
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}