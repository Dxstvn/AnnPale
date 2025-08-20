'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Star,
  Gift,
  Crown,
  Award,
  Coins,
  TrendingUp,
  Users,
  Heart,
  Flame,
  Target,
  Zap,
  Calendar,
  Clock,
  Bell,
  Settings,
  Menu,
  X,
  ChevronRight,
  Home,
  ShoppingCart,
  BarChart3,
  Shield,
  Sparkles,
  Medal,
  CheckCircle,
  ArrowUp,
  Info,
  Download,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import reward components
import { PointsSystem } from './points-system';
import { BadgeSystem } from './badge-system';
import { MemberLevels } from './member-levels';
import { RecognitionLeaderboards } from './recognition-leaderboards';
import { RewardsStore } from './rewards-store';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: number | string;
}

interface RecognitionStats {
  totalPoints: number;
  availablePoints: number;
  currentLevel: string;
  levelProgress: number;
  totalBadges: number;
  unlockedBadges: number;
  currentRank: number;
  currentStreak: number;
  rewardsRedeemed: number;
}

interface RecognitionLayoutProps {
  initialView?: 'dashboard' | 'points' | 'badges' | 'levels' | 'leaderboards' | 'store';
  userId?: string;
  isAuthenticated?: boolean;
  onNavigate?: (view: string, params?: any) => void;
}

export function RecognitionLayout({
  initialView = 'dashboard',
  userId = 'user1',
  isAuthenticated = true,
  onNavigate
}: RecognitionLayoutProps) {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  // User stats
  const recognitionStats: RecognitionStats = {
    totalPoints: 2450,
    availablePoints: 1850,
    currentLevel: 'Contributor',
    levelProgress: 62.5,
    totalBadges: 120,
    unlockedBadges: 45,
    currentRank: 156,
    currentStreak: 14,
    rewardsRedeemed: 8
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: Home,
      description: 'Your rewards summary'
    },
    {
      id: 'points',
      label: 'Points',
      icon: Coins,
      description: 'Earn and track points',
      badge: recognitionStats.availablePoints
    },
    {
      id: 'badges',
      label: 'Badges',
      icon: Award,
      description: 'Achievement collection',
      badge: `${recognitionStats.unlockedBadges}/${recognitionStats.totalBadges}`
    },
    {
      id: 'levels',
      label: 'Levels',
      icon: Crown,
      description: 'Member progression',
      badge: recognitionStats.currentLevel
    },
    {
      id: 'leaderboards',
      label: 'Leaderboards',
      icon: Trophy,
      description: 'Rankings & recognition',
      badge: `#${recognitionStats.currentRank}`
    },
    {
      id: 'store',
      label: 'Rewards Store',
      icon: Gift,
      description: 'Redeem your points',
      badge: 'New'
    }
  ];

  // Recent achievements
  const recentAchievements = [
    {
      id: 'ach1',
      type: 'badge',
      title: 'Helper Badge Unlocked',
      description: 'Helped 5 community members',
      icon: Heart,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      points: 50
    },
    {
      id: 'ach2',
      type: 'level',
      title: 'Level Up!',
      description: 'Advanced to Contributor',
      icon: Crown,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      points: 100
    },
    {
      id: 'ach3',
      type: 'streak',
      title: '14 Day Streak',
      description: 'Login streak milestone',
      icon: Flame,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      points: 75
    }
  ];

  // Quick actions
  const quickActions = [
    {
      id: 'daily-bonus',
      label: 'Claim Daily Bonus',
      icon: Calendar,
      action: () => console.log('Claim daily bonus'),
      available: true
    },
    {
      id: 'refer-friend',
      label: 'Refer a Friend',
      icon: Users,
      action: () => console.log('Refer friend'),
      available: true
    },
    {
      id: 'complete-profile',
      label: 'Complete Profile',
      icon: CheckCircle,
      action: () => console.log('Complete profile'),
      available: false
    }
  ];

  const handleNavigation = (view: string, params?: any) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    onNavigate?.(view, params);
  };

  const renderSidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Rewards & Recognition</h2>
          <p className="text-sm text-gray-600">Earn, collect, and redeem</p>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{recognitionStats.availablePoints}</div>
                <div className="text-xs text-gray-600">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">{recognitionStats.currentStreak}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">#{recognitionStats.currentRank}</div>
                <div className="text-xs text-gray-600">Rank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{recognitionStats.unlockedBadges}</div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  {item.description && (
                    <div className="text-xs opacity-70 truncate">{item.description}</div>
                  )}
                </div>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs",
                      item.badge === 'New' && "bg-green-100 text-green-700"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Current Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Current Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{recognitionStats.currentLevel}</span>
                <Badge variant="outline">Level 3</Badge>
              </div>
              <Progress value={recognitionStats.levelProgress} className="h-2" />
              <div className="text-xs text-gray-500">
                {recognitionStats.levelProgress}% to next level
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <Icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{achievement.title}</div>
                      <div className="text-xs text-gray-500 truncate">{achievement.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          +{achievement.points} pts
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {Math.floor((Date.now() - achievement.timestamp.getTime()) / (1000 * 60 * 60))}h ago
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled={!action.available}
                  onClick={action.action}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-medium text-sm mb-1">Rewards Available!</h4>
            <p className="text-xs text-gray-600 mb-3">
              You have enough points for 3 rewards
            </p>
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600"
              onClick={() => handleNavigation('store')}
            >
              Browse Store
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Rewards & Recognition
              </h1>
              <p className="text-gray-600">
                Earn points, unlock badges, and climb the leaderboard!
              </p>
            </div>
            <Trophy className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{recognitionStats.totalPoints}</div>
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
                <div className="text-2xl font-bold text-blue-600">{recognitionStats.unlockedBadges}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <Award className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">#{recognitionStats.currentRank}</div>
                <div className="text-sm text-gray-600">Global Rank</div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{recognitionStats.rewardsRedeemed}</div>
                <div className="text-sm text-gray-600">Rewards Claimed</div>
              </div>
              <Gift className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleNavigation('points')}
            >
              <Coins className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Earn Points</div>
                <div className="text-xs text-gray-500">Complete actions for rewards</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleNavigation('badges')}
            >
              <Award className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Collect Badges</div>
                <div className="text-xs text-gray-500">Unlock achievements</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => handleNavigation('store')}
            >
              <Gift className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Redeem Rewards</div>
                <div className="text-xs text-gray-500">Spend your points</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {recognitionStats.currentStreak} Days
              </div>
              <Progress value={(recognitionStats.currentStreak / 30) * 100} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">
                Keep it up! {30 - recognitionStats.currentStreak} days to next milestone
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Next Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Reach Expert Level</span>
                <Badge variant="secondary">750 pts needed</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Unlock 50 Badges</span>
                <Badge variant="secondary">5 more</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Top 100 Rank</span>
                <Badge variant="secondary">56 positions</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      
      case 'points':
        return <PointsSystem userId={userId} />;
      
      case 'badges':
        return <BadgeSystem userId={userId} />;
      
      case 'levels':
        return <MemberLevels userId={userId} />;
      
      case 'leaderboards':
        return <RecognitionLeaderboards currentUserId={userId} />;
      
      case 'store':
        return <RewardsStore userId={userId} />;
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">Rewards</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-white"
            >
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left",
                        currentView === item.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          {renderSidebar()}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}