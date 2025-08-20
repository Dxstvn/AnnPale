'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  Gift,
  Crown,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Award,
  Percent,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Star,
  Heart,
  Coins,
  CreditCard,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Bell,
  Settings,
  Plus,
  Minus,
  RefreshCw,
  Eye,
  ArrowUp,
  ArrowDown,
  Timer,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Revenue model data structure following Phase 4.1.6 spec
export interface RevenueModel {
  method: string;
  viewerCost: string;
  creatorRevenue: string;
  platformFee: string;
  engagement: string;
  description: string;
  isEnabled: boolean;
  totalEarnings: number;
  percentageOfTotal: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export const REVENUE_MODELS: RevenueModel[] = [
  {
    method: 'Tips',
    viewerCost: '$1-500',
    creatorRevenue: '80%',
    platformFee: '20%',
    engagement: 'Direct support',
    description: 'Direct donations from viewers',
    isEnabled: true,
    totalEarnings: 1250.75,
    percentageOfTotal: 35,
    trend: 'up',
    trendPercentage: 12.5
  },
  {
    method: 'Virtual Gifts',
    viewerCost: '$0.99-99',
    creatorRevenue: '70%',
    platformFee: '30%',
    engagement: 'Fun interaction',
    description: 'Animated gifts with effects',
    isEnabled: true,
    totalEarnings: 875.50,
    percentageOfTotal: 24,
    trend: 'up',
    trendPercentage: 8.3
  },
  {
    method: 'Super Chat',
    viewerCost: '$2-100',
    creatorRevenue: '70%',
    platformFee: '30%',
    engagement: 'Highlighted message',
    description: 'Premium chat messages',
    isEnabled: true,
    totalEarnings: 650.25,
    percentageOfTotal: 18,
    trend: 'stable',
    trendPercentage: 0
  },
  {
    method: 'Subscriptions',
    viewerCost: '$4.99/mo',
    creatorRevenue: '70%',
    platformFee: '30%',
    engagement: 'Ongoing support',
    description: 'Monthly recurring revenue',
    isEnabled: true,
    totalEarnings: 498.00,
    percentageOfTotal: 14,
    trend: 'up',
    trendPercentage: 15.2
  },
  {
    method: 'Paid Access',
    viewerCost: '$5-50',
    creatorRevenue: '80%',
    platformFee: '20%',
    engagement: 'Exclusive streams',
    description: 'Premium stream access',
    isEnabled: false,
    totalEarnings: 320.00,
    percentageOfTotal: 9,
    trend: 'down',
    trendPercentage: -5.1
  },
  {
    method: 'Goals/Campaigns',
    viewerCost: 'Variable',
    creatorRevenue: '85%',
    platformFee: '15%',
    engagement: 'Community achievement',
    description: 'Crowdfunding goals',
    isEnabled: true,
    totalEarnings: 0,
    percentageOfTotal: 0,
    trend: 'stable',
    trendPercentage: 0
  }
];

interface GoalTracker {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'tips' | 'gifts' | 'subscribers' | 'views' | 'custom';
  deadline?: Date;
  reward?: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface IncentiveSystem {
  id: string;
  name: string;
  type: 'tip-matching' | 'gift-multiplier' | 'subscriber-benefits' | 'loyalty-rewards' | 'special-events';
  description: string;
  multiplier: number;
  isActive: boolean;
  duration: number; // minutes
  requirements: string;
}

interface RevenueModelsDashboardProps {
  totalEarnings: number;
  goals: GoalTracker[];
  incentives: IncentiveSystem[];
  onToggleRevenueModel: (method: string, enabled: boolean) => void;
  onCreateGoal: (goal: Omit<GoalTracker, 'id' | 'current' | 'isCompleted'>) => void;
  onToggleIncentive: (incentiveId: string, active: boolean) => void;
  className?: string;
}

export function RevenueModelsDashboard({
  totalEarnings,
  goals,
  incentives,
  onToggleRevenueModel,
  onCreateGoal,
  onToggleIncentive,
  className
}: RevenueModelsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: 100,
    type: 'tips' as GoalTracker['type'],
    reward: ''
  });

  // Calculate metrics
  const enabledModels = REVENUE_MODELS.filter(model => model.isEnabled);
  const topEarningModel = REVENUE_MODELS.reduce((top, current) => 
    current.totalEarnings > top.totalEarnings ? current : top
  );
  const activeGoals = goals.filter(goal => goal.isActive && !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);
  const activeIncentives = incentives.filter(incentive => incentive.isActive);

  // Goal completion prediction
  const getGoalCompletionPrediction = (goal: GoalTracker) => {
    const progress = goal.current / goal.target;
    if (progress >= 0.8) return { likelihood: 'high', percentage: 85 };
    if (progress >= 0.5) return { likelihood: 'medium', percentage: 60 };
    if (progress >= 0.2) return { likelihood: 'low', percentage: 35 };
    return { likelihood: 'very-low', percentage: 15 };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'tips': return <DollarSign className="w-4 h-4" />;
      case 'virtual gifts': return <Gift className="w-4 h-4" />;
      case 'super chat': return <Zap className="w-4 h-4" />;
      case 'subscriptions': return <Crown className="w-4 h-4" />;
      case 'paid access': return <Lock className="w-4 h-4" />;
      case 'goals/campaigns': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Activity className="w-3 h-3 text-gray-500" />;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revenue Models</h2>
          <p className="text-gray-600">Multiple income streams for creator success</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Streams</p>
                <p className="text-2xl font-bold">{enabledModels.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              of {REVENUE_MODELS.length} available
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Earner</p>
                <p className="text-lg font-bold">{topEarningModel.method}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                {getMethodIcon(topEarningModel.method)}
              </div>
            </div>
            <div className="mt-2 text-sm text-purple-600">
              {formatCurrency(topEarningModel.totalEarnings)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-orange-600">
              {completedGoals.length} completed
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Revenue Models</TabsTrigger>
          <TabsTrigger value="goals">Goal Tracking</TabsTrigger>
          <TabsTrigger value="incentives">Incentives</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Revenue Breakdown Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Earnings by method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {REVENUE_MODELS.filter(model => model.totalEarnings > 0).map((model) => (
                    <div key={model.method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(model.method)}
                          <span className="text-sm font-medium">{model.method}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(model.trend, model.trendPercentage)}
                          <span className="text-sm font-bold">{formatCurrency(model.totalEarnings)}</span>
                        </div>
                      </div>
                      <Progress value={model.percentageOfTotal} className="h-2" />
                      <div className="text-xs text-gray-500 text-right">
                        {model.percentageOfTotal}% of total
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-700">Strong tip performance</div>
                      <div className="text-sm text-blue-600">
                        Tips are your top earner. Consider setting tip goals during peak hours.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-700">Untapped potential</div>
                      <div className="text-sm text-yellow-600">
                        Enable paid access for exclusive content and boost revenue by an estimated 25%.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-700">Diversified income</div>
                      <div className="text-sm text-green-600">
                        Great job! You have multiple active revenue streams for stability.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Revenue Actions</CardTitle>
              <CardDescription>Boost your earnings with these actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-4 flex flex-col items-center gap-2">
                  <Target className="w-6 h-6" />
                  <span className="font-medium">Create Goal</span>
                  <span className="text-xs text-center">Set targets to engage viewers</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  <span className="font-medium">Launch Incentive</span>
                  <span className="text-xs text-center">Multipliers and bonuses</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Bell className="w-6 h-6" />
                  <span className="font-medium">Send Reminder</span>
                  <span className="text-xs text-center">Gentle support nudge</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6 mt-6">
          {/* Revenue Models Table */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Model Management</CardTitle>
              <CardDescription>Configure your income streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {REVENUE_MODELS.map((model) => (
                  <div key={model.method} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getMethodIcon(model.method)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{model.method}</h4>
                        <p className="text-sm text-gray-600">{model.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Cost: {model.viewerCost}</span>
                          <span>You earn: {model.creatorRevenue}</span>
                          <span>Platform: {model.platformFee}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(model.totalEarnings)}</div>
                        <div className="flex items-center gap-1 text-xs">
                          {getTrendIcon(model.trend, model.trendPercentage)}
                          <span className={cn(
                            model.trend === 'up' ? 'text-green-600' :
                            model.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          )}>
                            {model.trend === 'stable' ? 'Stable' : `${model.trendPercentage > 0 ? '+' : ''}${model.trendPercentage}%`}
                          </span>
                        </div>
                      </div>
                      
                      <Switch
                        checked={model.isEnabled}
                        onCheckedChange={(checked) => onToggleRevenueModel(model.method, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6 mt-6">
          {/* Goal Creation */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Goal Tracking</h3>
              <p className="text-sm text-gray-600">Set targets to engage your audience</p>
            </div>
            <Button onClick={() => setShowGoalDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </div>

          {/* Active Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const prediction = getGoalCompletionPrediction(goal);
              return (
                <Card key={goal.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {goal.type}
                      </Badge>
                    </div>
                    <CardDescription>{goal.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.current} / {goal.target}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                      <div className="text-xs text-gray-600 text-right">
                        {((goal.current / goal.target) * 100).toFixed(1)}% complete
                      </div>
                    </div>

                    {goal.reward && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="text-sm font-medium text-yellow-700">
                          🎁 Reward: {goal.reward}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span>Completion likelihood</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          prediction.likelihood === 'high' ? 'border-green-500 text-green-700' :
                          prediction.likelihood === 'medium' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        )}
                      >
                        {prediction.percentage}%
                      </Badge>
                    </div>

                    {goal.deadline && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {goal.deadline.toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  Completed Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {completedGoals.slice(0, 6).map((goal) => (
                    <div key={goal.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-sm">{goal.title}</span>
                      </div>
                      <div className="text-xs text-green-600">
                        Achieved {goal.target} {goal.type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="incentives" className="space-y-6 mt-6">
          {/* Incentive Systems */}
          <Card>
            <CardHeader>
              <CardTitle>Active Incentive Systems</CardTitle>
              <CardDescription>Multipliers and rewards to boost engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incentives.map((incentive) => (
                  <div key={incentive.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{incentive.name}</h4>
                        <p className="text-sm text-gray-600">{incentive.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Multiplier: {incentive.multiplier}x</span>
                          <span>Duration: {incentive.duration}min</span>
                          <span>{incentive.requirements}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant="outline" 
                        className={incentive.isActive ? 'border-green-500 text-green-700' : 'border-gray-300'}
                      >
                        {incentive.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      
                      <Switch
                        checked={incentive.isActive}
                        onCheckedChange={(checked) => onToggleIncentive(incentive.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6 mt-6">
          {/* Revenue Optimization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
                <CardDescription>AI-powered revenue suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-blue-700">Peak Hour Optimization</span>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">
                    Your audience is most active between 7-9 PM. Launch special offers during these hours.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Schedule Incentive
                  </Button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700">Goal Strategy</span>
                  </div>
                  <p className="text-sm text-green-600 mb-3">
                    Set a $200 tip goal to increase engagement by 40% based on similar creators.
                  </p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Create Goal
                  </Button>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-purple-500" />
                    <span className="font-medium text-purple-700">Gift Promotion</span>
                  </div>
                  <p className="text-sm text-purple-600 mb-3">
                    Promote cultural gifts during Haitian holidays for 3x higher engagement.
                  </p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Plan Promotion
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecasting</CardTitle>
                <CardDescription>Predicted earnings based on current trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(totalEarnings * 1.15)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Projected monthly earnings (+15%)
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">With all models enabled</span>
                      <span className="font-medium">+25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Peak hour optimization</span>
                      <span className="font-medium">+18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Goal-based engagement</span>
                      <span className="font-medium">+12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cultural content focus</span>
                      <span className="font-medium">+8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}