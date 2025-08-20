'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Star,
  Zap,
  Flame,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Gift,
  Target,
  Coins,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  Sparkles,
  Heart,
  MessageSquare,
  Share2,
  Users,
  Video,
  Camera,
  Bookmark,
  ThumbsUp,
  Eye,
  DollarSign,
  Timer,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PointAction {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'engagement' | 'content' | 'community' | 'special';
  icon: React.ElementType;
  multiplier?: number;
  cooldown?: number;
  maxDaily?: number;
  conditions?: string[];
}

interface PointTransaction {
  id: string;
  action: string;
  points: number;
  multiplier?: number;
  timestamp: Date;
  category: string;
  details?: string;
}

interface StreakBonus {
  days: number;
  multiplier: number;
  bonus: number;
  badge?: string;
}

interface SpecialEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  multiplier: number;
  bonusActions?: string[];
  badge?: string;
}

interface UserPoints {
  total: number;
  available: number;
  pending: number;
  lifetime: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  nextLevelProgress: number;
  multiplier: number;
}

interface PointsSystemProps {
  userId?: string;
  userPoints?: UserPoints;
  transactions?: PointTransaction[];
  onEarnPoints?: (actionId: string) => void;
  onRedeemPoints?: (amount: number, item: any) => void;
  onViewHistory?: () => void;
  showBreakdown?: boolean;
  showActions?: boolean;
}

export function PointsSystem({
  userId,
  userPoints = {
    total: 2450,
    available: 1850,
    pending: 100,
    lifetime: 5230,
    currentStreak: 7,
    longestStreak: 21,
    level: 12,
    nextLevelProgress: 65,
    multiplier: 1.5
  },
  transactions = [],
  onEarnPoints,
  onRedeemPoints,
  onViewHistory,
  showBreakdown = true,
  showActions = true
}: PointsSystemProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'earn' | 'history' | 'redeem'>('overview');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Point earning actions
  const pointActions: PointAction[] = [
    // Engagement Actions
    {
      id: 'daily-login',
      name: 'Daily Login',
      description: 'Log in each day',
      points: 10,
      category: 'engagement',
      icon: Calendar,
      multiplier: userPoints.currentStreak > 7 ? 2 : 1,
      maxDaily: 1
    },
    {
      id: 'profile-complete',
      name: 'Complete Profile',
      description: 'Fill out all profile information',
      points: 100,
      category: 'engagement',
      icon: CheckCircle,
      maxDaily: 1
    },
    {
      id: 'watch-video',
      name: 'Watch Video',
      description: 'Watch a creator video',
      points: 5,
      category: 'engagement',
      icon: Video,
      maxDaily: 10
    },
    {
      id: 'like-content',
      name: 'Like Content',
      description: 'Like a post or video',
      points: 2,
      category: 'engagement',
      icon: ThumbsUp,
      maxDaily: 20
    },
    
    // Content Actions
    {
      id: 'create-post',
      name: 'Create Post',
      description: 'Share content with community',
      points: 20,
      category: 'content',
      icon: MessageSquare,
      maxDaily: 5
    },
    {
      id: 'upload-video',
      name: 'Upload Video',
      description: 'Share a video message',
      points: 50,
      category: 'content',
      icon: Camera,
      maxDaily: 2
    },
    {
      id: 'share-content',
      name: 'Share Content',
      description: 'Share creator content',
      points: 10,
      category: 'content',
      icon: Share2,
      maxDaily: 5
    },
    
    // Community Actions
    {
      id: 'help-member',
      name: 'Help Member',
      description: 'Answer a community question',
      points: 15,
      category: 'community',
      icon: Users,
      maxDaily: 10
    },
    {
      id: 'join-challenge',
      name: 'Join Challenge',
      description: 'Participate in a challenge',
      points: 25,
      category: 'community',
      icon: Trophy,
      maxDaily: 3
    },
    {
      id: 'refer-friend',
      name: 'Refer Friend',
      description: 'Invite a friend to join',
      points: 100,
      category: 'community',
      icon: Gift,
      maxDaily: 5
    },
    
    // Special Actions
    {
      id: 'birthday-bonus',
      name: 'Birthday Bonus',
      description: 'Annual birthday celebration',
      points: 500,
      category: 'special',
      icon: Gift,
      maxDaily: 1
    },
    {
      id: 'milestone-achievement',
      name: 'Milestone Achievement',
      description: 'Reach a special milestone',
      points: 250,
      category: 'special',
      icon: Award,
      maxDaily: 1
    }
  ];

  // Recent transactions
  const recentTransactions: PointTransaction[] = [
    {
      id: 'tx1',
      action: 'Daily Login',
      points: 20,
      multiplier: 2,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      category: 'engagement',
      details: '7 day streak bonus!'
    },
    {
      id: 'tx2',
      action: 'Help Member',
      points: 15,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      category: 'community',
      details: 'Answered question in forum'
    },
    {
      id: 'tx3',
      action: 'Join Challenge',
      points: 25,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      category: 'community',
      details: 'Joined "Kreyòl Poetry" challenge'
    },
    {
      id: 'tx4',
      action: 'Upload Video',
      points: 50,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: 'content',
      details: 'Shared cultural story'
    },
    {
      id: 'tx5',
      action: 'Reward Redeemed',
      points: -500,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      category: 'redemption',
      details: 'Exclusive creator meet & greet'
    }
  ];

  // Streak bonuses
  const streakBonuses: StreakBonus[] = [
    { days: 3, multiplier: 1.2, bonus: 25, badge: 'Starter' },
    { days: 7, multiplier: 1.5, bonus: 50, badge: 'Weekly Warrior' },
    { days: 14, multiplier: 1.75, bonus: 100, badge: 'Fortnight Fighter' },
    { days: 30, multiplier: 2.0, bonus: 250, badge: 'Monthly Master' },
    { days: 60, multiplier: 2.5, bonus: 500, badge: 'Commitment King' },
    { days: 100, multiplier: 3.0, bonus: 1000, badge: 'Century Champion' }
  ];

  // Special events
  const specialEvents: SpecialEvent[] = [
    {
      id: 'haitian-heritage',
      name: 'Haitian Heritage Month',
      description: 'Double points on all cultural content',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-31'),
      multiplier: 2,
      bonusActions: ['create-post', 'upload-video', 'share-content']
    },
    {
      id: 'community-week',
      name: 'Community Week',
      description: 'Triple points for helping others',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-22'),
      multiplier: 3,
      bonusActions: ['help-member']
    }
  ];

  const getCurrentStreakBonus = () => {
    const applicable = streakBonuses.filter(b => b.days <= userPoints.currentStreak);
    return applicable[applicable.length - 1] || null;
  };

  const getActiveEvents = () => {
    const now = new Date();
    return specialEvents.filter(event => 
      now >= event.startDate && now <= event.endDate
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement': return Heart;
      case 'content': return Camera;
      case 'community': return Users;
      case 'special': return Sparkles;
      default: return Star;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engagement': return 'text-pink-600 bg-pink-100';
      case 'content': return 'text-purple-600 bg-purple-100';
      case 'community': return 'text-blue-600 bg-blue-100';
      case 'special': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => {
    const currentStreakBonus = getCurrentStreakBonus();
    const activeEvents = getActiveEvents();

    return (
      <div className="space-y-6">
        {/* Points Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{userPoints.total}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <Coins className="h-8 w-8 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{userPoints.available}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <CreditCard className="h-8 w-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{userPoints.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <Flame className="h-8 w-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{userPoints.multiplier}x</div>
                  <div className="text-sm text-gray-600">Multiplier</div>
                </div>
                <Zap className="h-8 w-8 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Level {userPoints.level}
              </span>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {userPoints.lifetime} Lifetime Points
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress to Level {userPoints.level + 1}</span>
                <span className="font-medium">{userPoints.nextLevelProgress}%</span>
              </div>
              <Progress value={userPoints.nextLevelProgress} className="h-3" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{Math.floor(userPoints.nextLevelProgress * 10)} / 1000 points</span>
                <span>{1000 - Math.floor(userPoints.nextLevelProgress * 10)} points to go</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Bonus */}
        {currentStreakBonus && (
          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Flame className="h-5 w-5" />
                {userPoints.currentStreak} Day Streak!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Current Multiplier</div>
                  <div className="text-xl font-bold text-orange-600">{currentStreakBonus.multiplier}x</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Streak Badge</div>
                  <Badge className="mt-1 bg-orange-600">{currentStreakBonus.badge}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Next Milestone</div>
                  <div className="text-sm">
                    {streakBonuses.find(b => b.days > userPoints.currentStreak)?.days || '100'} days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Events */}
        {activeEvents.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Sparkles className="h-5 w-5" />
                Special Events Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <Badge className="bg-purple-600">{event.multiplier}x Points</Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Ends {event.endDate.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Points Breakdown */}
        {showBreakdown && (
          <Card>
            <CardHeader>
              <CardTitle>Points Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Available for redemption</span>
                  <span className="font-medium text-green-600">+{userPoints.available}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Pending verification</span>
                  <span className="font-medium text-yellow-600">{userPoints.pending}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Redeemed this month</span>
                  <span className="font-medium text-red-600">-600</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderEarnPoints = () => {
    const categories = ['all', 'engagement', 'content', 'community', 'special'];
    const filteredActions = selectedCategory === 'all' 
      ? pointActions 
      : pointActions.filter(a => a.category === selectedCategory);

    return (
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category}
              </Button>
            );
          })}
        </div>

        {/* Actions Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      getCategoryColor(action.category)
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{action.name}</h4>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-yellow-600" />
                          <span className="font-bold text-yellow-600">+{action.points}</span>
                          {action.multiplier && action.multiplier > 1 && (
                            <Badge variant="secondary" className="text-xs ml-1">
                              {action.multiplier}x
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {action.maxDaily && (
                          <span>Max {action.maxDaily}/day</span>
                        )}
                        {action.cooldown && (
                          <span>Cooldown: {action.cooldown}h</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => onEarnPoints?.(action.id)}
                      >
                        Complete Action
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const isPositive = transaction.points > 0;
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isPositive ? "bg-green-100" : "bg-red-100"
                    )}>
                      {isPositive ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{transaction.action}</div>
                      {transaction.details && (
                        <div className="text-xs text-gray-500">{transaction.details}</div>
                      )}
                      <div className="text-xs text-gray-400">
                        {Math.floor((Date.now() - transaction.timestamp.getTime()) / (1000 * 60 * 60))} hours ago
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "font-bold",
                      isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {isPositive ? '+' : ''}{transaction.points}
                    </div>
                    {transaction.multiplier && transaction.multiplier > 1 && (
                      <Badge variant="secondary" className="text-xs">
                        {transaction.multiplier}x
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={onViewHistory}
          >
            View Full History
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Points System</h2>
          <p className="text-gray-600">Earn points and unlock rewards</p>
        </div>
        
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Gift className="h-4 w-4 mr-2" />
          Rewards Store
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Star },
            { id: 'earn', label: 'Earn Points', icon: Plus },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'redeem', label: 'Redeem', icon: Gift }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'earn' && showActions && renderEarnPoints()}
          {activeTab === 'history' && renderHistory()}
          {activeTab === 'redeem' && (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rewards Store</h3>
              <p className="text-gray-600">Redeem your points for exclusive rewards</p>
              <Button className="mt-4">
                Browse Rewards
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}