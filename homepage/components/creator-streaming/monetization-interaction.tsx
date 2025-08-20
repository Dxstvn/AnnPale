'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DollarSign,
  Gift,
  Star,
  Crown,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  Award,
  Sparkles,
  Plus,
  Settings,
  Eye,
  ThumbsUp,
  Share2,
  Trophy,
  Coins,
  PiggyBank,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Percent,
  Timer,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MonetizationSettings,
  StreamGoal,
  LiveMetrics
} from '@/lib/types/creator-streaming';
import { VirtualGift } from '@/lib/types/live-viewer';

interface MonetizationInteractionProps {
  monetization: MonetizationSettings;
  goals: StreamGoal[];
  metrics: LiveMetrics;
  onMonetizationChange: (settings: Partial<MonetizationSettings>) => void;
  onCreateGoal: (goal: Omit<StreamGoal, 'id' | 'current' | 'isCompleted'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<StreamGoal>) => void;
  onDeleteGoal: (goalId: string) => void;
  isLive: boolean;
  className?: string;
}

export function MonetizationInteraction({
  monetization,
  goals,
  metrics,
  onMonetizationChange,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  isLive,
  className
}: MonetizationInteractionProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'tips' as StreamGoal['type'],
    title: '',
    description: '',
    target: 100,
    reward: '',
    deadline: undefined as Date | undefined
  });
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    price: 0,
    duration: 60,
    available: 10
  });

  // Calculate goal progress
  const activeGoals = goals.filter(goal => goal.isActive && !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);
  const totalGoalProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + (goal.current / goal.target), 0) / goals.length * 100
    : 0;

  // Recent earnings breakdown
  const recentEarnings = {
    hourly: 25.50,
    daily: 186.75,
    weekly: 1250.30,
    monthly: 4890.25
  };

  // Top supporters (mock data)
  const topSupporters = [
    { name: 'Haiti_Music_Fan', amount: 125, avatar: '/api/placeholder/40/40' },
    { name: 'CreoleVibes', amount: 89, avatar: '/api/placeholder/40/40' },
    { name: 'PortAuPrince_Lover', amount: 67, avatar: '/api/placeholder/40/40' },
    { name: 'KompaKing', amount: 45, avatar: '/api/placeholder/40/40' }
  ];

  // Handle creating new goal
  const handleCreateGoal = () => {
    if (newGoal.title.trim() && newGoal.target > 0) {
      onCreateGoal({
        type: newGoal.type,
        title: newGoal.title,
        description: newGoal.description,
        target: newGoal.target,
        reward: newGoal.reward || undefined,
        deadline: newGoal.deadline,
        isActive: true
      });
      
      setShowGoalDialog(false);
      setNewGoal({
        type: 'tips',
        title: '',
        description: '',
        target: 100,
        reward: '',
        deadline: undefined
      });
    }
  };

  // Handle creating special offer
  const handleCreateOffer = () => {
    if (newOffer.title.trim() && newOffer.price > 0) {
      const offer = {
        id: Date.now().toString(),
        title: newOffer.title,
        description: newOffer.description,
        price: newOffer.price,
        duration: newOffer.duration,
        available: newOffer.available
      };

      onMonetizationChange({
        specialOffers: [...(monetization.specialOffers || []), offer]
      });

      setShowOfferDialog(false);
      setNewOffer({
        title: '',
        description: '',
        price: 0,
        duration: 60,
        available: 10
      });
    }
  };

  // Get goal icon
  const getGoalIcon = (type: StreamGoal['type']) => {
    switch (type) {
      case 'tips': return <DollarSign className="w-4 h-4" />;
      case 'followers': return <Users className="w-4 h-4" />;
      case 'subscribers': return <Crown className="w-4 h-4" />;
      case 'views': return <Eye className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monetization & Engagement</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your revenue streams and audience engagement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isLive ? "default" : "secondary"} className="bg-green-500">
            {isLive ? '🔴 Live Earnings' : '⏸️ Earnings Paused'}
          </Badge>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="offers">Special Offers</TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Session Earnings
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.earnings.total)}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span>+12.5% from last stream</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tips
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.earnings.tips)}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {Math.round((metrics.earnings.tips / metrics.earnings.total) * 100)}% of total
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Gifts
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.earnings.gifts)}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {Math.round((metrics.earnings.gifts / metrics.earnings.total) * 100)}% of total
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Subscriptions
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.earnings.subscriptions)}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Crown className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {Math.round((metrics.earnings.subscriptions / metrics.earnings.total) * 100)}% of total
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Revenue Actions</CardTitle>
                <CardDescription>Boost your earnings during the stream</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowGoalDialog(true)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create New Goal
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowOfferDialog(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Launch Special Offer
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Tip Reminder
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Stream for Tips
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Goals Progress</CardTitle>
                <CardDescription>Track your current stream goals</CardDescription>
              </CardHeader>
              <CardContent>
                {activeGoals.length > 0 ? (
                  <div className="space-y-4">
                    {activeGoals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getGoalIcon(goal.type)}
                            <span className="font-medium">{goal.title}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {goal.current} / {goal.target}
                          </span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      </div>
                    ))}
                    
                    {activeGoals.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full">
                        View {activeGoals.length - 3} more goals
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">No active goals</p>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowGoalDialog(true)}
                    >
                      Create Your First Goal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monetization Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Monetization Features</CardTitle>
              <CardDescription>Enable or disable revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Tips</div>
                      <div className="text-xs text-gray-600">Direct donations</div>
                    </div>
                  </div>
                  <Switch
                    checked={monetization.enableTips}
                    onCheckedChange={(checked) => onMonetizationChange({ enableTips: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">Gifts</div>
                      <div className="text-xs text-gray-600">Virtual presents</div>
                    </div>
                  </div>
                  <Switch
                    checked={monetization.enableGifts}
                    onCheckedChange={(checked) => onMonetizationChange({ enableGifts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Super Chat</div>
                      <div className="text-xs text-gray-600">Highlighted messages</div>
                    </div>
                  </div>
                  <Switch
                    checked={monetization.enableSuperChat}
                    onCheckedChange={(checked) => onMonetizationChange({ enableSuperChat: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Subscriptions</div>
                      <div className="text-xs text-gray-600">Monthly supporters</div>
                    </div>
                  </div>
                  <Switch
                    checked={monetization.enableSubscriptions}
                    onCheckedChange={(checked) => onMonetizationChange({ enableSubscriptions: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6 mt-6">
          {/* Goals Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Stream Goals</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set targets to engage your audience and increase earnings
              </p>
            </div>
            <Button onClick={() => setShowGoalDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className={cn(
                'relative',
                goal.isCompleted && 'border-green-500 bg-green-50 dark:bg-green-900/20',
                !goal.isActive && 'opacity-60'
              )}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getGoalIcon(goal.type)}
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {goal.isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                      <Badge variant={goal.isActive ? "default" : "secondary"}>
                        {goal.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {goal.current} / {goal.target}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-3"
                    />
                    <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
                      {((goal.current / goal.target) * 100).toFixed(1)}% complete
                    </div>
                  </div>

                  {goal.reward && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        🎁 Reward: {goal.reward}
                      </div>
                    </div>
                  )}

                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        Deadline: {goal.deadline.toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateGoal(goal.id, { isActive: !goal.isActive })}
                      className="flex-1"
                    >
                      {goal.isActive ? 'Pause' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {goals.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first goal to start engaging your audience and tracking progress
                </p>
                <Button onClick={() => setShowGoalDialog(true)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offers" className="space-y-6 mt-6">
          {/* Special Offers */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Special Offers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Limited-time offers to boost engagement and revenue
              </p>
            </div>
            <Button onClick={() => setShowOfferDialog(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monetization.specialOffers?.map((offer) => (
              <Card key={offer.id} className="border-2 border-dashed border-purple-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <Badge className="bg-purple-500">
                      {formatCurrency(offer.price)}
                    </Badge>
                  </div>
                  <CardDescription>{offer.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="font-medium">{offer.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Available</p>
                      <p className="font-medium">{offer.available} left</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) || []}

            {(!monetization.specialOffers || monetization.specialOffers.length === 0) && (
              <Card className="md:col-span-2">
                <CardContent className="text-center py-12">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Special Offers</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Create special offers to provide exclusive content and boost your earnings
                  </p>
                  <Button onClick={() => setShowOfferDialog(true)} size="lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Your First Offer
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="supporters" className="space-y-6 mt-6">
          {/* Top Supporters */}
          <Card>
            <CardHeader>
              <CardTitle>Top Supporters This Stream</CardTitle>
              <CardDescription>Your biggest supporters during this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSupporters.map((supporter, index) => (
                  <div key={supporter.name} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    <img
                      src={supporter.avatar}
                      alt={supporter.name}
                      className="w-10 h-10 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="font-medium">{supporter.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Supporter
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {formatCurrency(supporter.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        contributed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest tips, gifts, and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock transactions */}
                {[
                  { type: 'tip', user: 'Haiti_Music_Fan', amount: 25, time: '2 minutes ago' },
                  { type: 'gift', user: 'CreoleVibes', amount: 15, time: '5 minutes ago' },
                  { type: 'subscription', user: 'KompaKing', amount: 9.99, time: '8 minutes ago' },
                  { type: 'super-chat', user: 'PortAuPrince_Lover', amount: 50, time: '12 minutes ago' }
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                      {transaction.type === 'tip' && <DollarSign className="w-4 h-4 text-white" />}
                      {transaction.type === 'gift' && <Gift className="w-4 h-4 text-white" />}
                      {transaction.type === 'subscription' && <Crown className="w-4 h-4 text-white" />}
                      {transaction.type === 'super-chat' && <Zap className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{transaction.user}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {transaction.type.replace('-', ' ')} • {transaction.time}
                      </div>
                    </div>
                    
                    <div className="font-bold text-green-600">
                      +{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Revenue Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Earnings over different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Hour</span>
                    <span className="font-medium">{formatCurrency(recentEarnings.hourly)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Today</span>
                    <span className="font-medium">{formatCurrency(recentEarnings.daily)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-medium">{formatCurrency(recentEarnings.weekly)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">{formatCurrency(recentEarnings.monthly)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>How your audience interacts with monetization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tip Conversion Rate</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Tip Amount</span>
                    <span className="font-medium">{formatCurrency(18.75)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gift Frequency</span>
                    <span className="font-medium">2.3 per minute</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subscriber Growth</span>
                    <span className="font-medium">+12 this stream</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>AI-powered recommendations to boost your earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      Great engagement today!
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Your tip rate is 23% higher than your average. Consider setting a higher goal.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-700 dark:text-yellow-300">
                      Peak hours approaching
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">
                      Your audience is most active in the next 2 hours. Perfect time for special offers.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-700 dark:text-green-300">
                      Goal completion likely
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      You're on track to reach your $100 tip goal. 85% chance of completion.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Goal Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Set a goal to engage your audience and track progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select
                value={newGoal.type}
                onValueChange={(value: StreamGoal['type']) => setNewGoal(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tips">Tips</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="subscribers">Subscribers</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g., Reach $100 in tips"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your goal..."
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Amount</Label>
              <Input
                type="number"
                placeholder="100"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Reward (Optional)</Label>
              <Input
                placeholder="e.g., Special song request"
                value={newGoal.reward}
                onChange={(e) => setNewGoal(prev => ({ ...prev, reward: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowGoalDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateGoal} className="flex-1">
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Special Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Special Offer</DialogTitle>
            <DialogDescription>
              Launch a limited-time offer to boost engagement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Offer Title</Label>
              <Input
                placeholder="e.g., Exclusive Song Request"
                value={newOffer.title}
                onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what supporters get..."
                value={newOffer.description}
                onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={newOffer.price}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  value={newOffer.duration}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Available Quantity</Label>
              <Input
                type="number"
                placeholder="10"
                value={newOffer.available}
                onChange={(e) => setNewOffer(prev => ({ ...prev, available: parseInt(e.target.value) || 10 }))}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowOfferDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateOffer} className="flex-1">
                Launch Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}