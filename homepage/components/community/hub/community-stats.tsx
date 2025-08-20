'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Activity,
  TrendingUp,
  Globe,
  Heart,
  Star,
  Trophy,
  Zap,
  Clock,
  Eye,
  UserPlus,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CommunityStatItem {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  bgColor: string;
  format: 'number' | 'percentage' | 'duration' | 'currency';
  description?: string;
  target?: number;
}

interface CommunityGoal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  deadline: Date;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface CommunityStatsProps {
  layout?: 'grid' | 'compact';
  showGoals?: boolean;
  showTrends?: boolean;
  timeframe?: '24h' | '7d' | '30d';
  onStatClick?: (stat: CommunityStatItem) => void;
}

export function CommunityStats({
  layout = 'grid',
  showGoals = true,
  showTrends = true,
  timeframe = '24h',
  onStatClick
}: CommunityStatsProps) {
  // Sample community statistics
  const stats: CommunityStatItem[] = [
    {
      id: 'total_members',
      label: 'Total Members',
      value: 12847,
      change: 3.2,
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: 'number',
      description: 'Registered community members'
    },
    {
      id: 'active_today',
      label: 'Active Today',
      value: 2341,
      change: 8.7,
      changeType: 'increase',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      format: 'number',
      description: 'Members active in the last 24 hours'
    },
    {
      id: 'posts_today',
      label: 'Posts Today',
      value: 89,
      change: -5.3,
      changeType: 'decrease',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: 'number',
      description: 'New posts created today'
    },
    {
      id: 'engagement_rate',
      label: 'Engagement Rate',
      value: 76.8,
      change: 2.1,
      changeType: 'increase',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      format: 'percentage',
      description: 'Average member engagement'
    },
    {
      id: 'events_this_week',
      label: 'Events This Week',
      value: 12,
      change: 0,
      changeType: 'neutral',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      format: 'number',
      description: 'Scheduled community events'
    },
    {
      id: 'new_members',
      label: 'New This Week',
      value: 234,
      change: 12.5,
      changeType: 'increase',
      icon: UserPlus,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      format: 'number',
      description: 'New members joined this week'
    },
    {
      id: 'response_time',
      label: 'Avg Response Time',
      value: 23,
      change: -15.2,
      changeType: 'increase',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      format: 'duration',
      description: 'Average time to get a response'
    },
    {
      id: 'satisfaction_score',
      label: 'Satisfaction Score',
      value: 94.2,
      change: 1.8,
      changeType: 'increase',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      format: 'percentage',
      description: 'Member satisfaction rating',
      target: 95
    }
  ];

  // Sample community goals
  const goals: CommunityGoal[] = [
    {
      id: 'members_15k',
      title: '15K Members',
      description: 'Reach 15,000 community members',
      current: 12847,
      target: 15000,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      category: 'Growth',
      priority: 'high'
    },
    {
      id: 'events_monthly',
      title: '50 Monthly Events',
      description: 'Host 50 events per month',
      current: 38,
      target: 50,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      category: 'Engagement',
      priority: 'medium'
    },
    {
      id: 'satisfaction_95',
      title: '95% Satisfaction',
      description: 'Achieve 95% member satisfaction',
      current: 94.2,
      target: 95,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      category: 'Quality',
      priority: 'high'
    }
  ];

  const formatValue = (value: number, format: string): string => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'duration':
        return `${value}min`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'number':
      default:
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    }
  };

  const getChangeIcon = (changeType: string, change: number) => {
    if (changeType === 'neutral' || change === 0) {
      return <Activity className="h-3 w-3 text-gray-500" />;
    }
    return (
      <TrendingUp 
        className={cn(
          "h-3 w-3",
          changeType === 'increase' ? "text-green-500" : "text-red-500 rotate-180"
        )} 
      />
    );
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 7) {
      return `${diffInDays} days left`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks left`;
    } else {
      return `${Math.floor(diffInDays / 30)} months left`;
    }
  };

  const StatCard = ({ stat, index }: { stat: CommunityStatItem; index: number }) => {
    const Icon = stat.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card 
          className="hover:shadow-md transition-all cursor-pointer h-full"
          onClick={() => onStatClick?.(stat)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bgColor)}>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className="flex items-center gap-1">
                {getChangeIcon(stat.changeType, stat.change)}
                <span className={cn("text-xs font-medium", getChangeColor(stat.changeType))}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(stat.value, stat.format)}
              </div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              {stat.description && (
                <div className="text-xs text-gray-500">{stat.description}</div>
              )}
            </div>

            {stat.target && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress to target</span>
                  <span>{formatValue(stat.target, stat.format)}</span>
                </div>
                <Progress value={(stat.value / stat.target) * 100} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (layout === 'compact') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.slice(0, 4).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.id} className="text-center">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2", stat.bgColor)}>
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                  <div className="text-lg font-bold">{formatValue(stat.value, stat.format)}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                  <div className={cn("text-xs flex items-center justify-center gap-1 mt-1", getChangeColor(stat.changeType))}>
                    {getChangeIcon(stat.changeType, stat.change)}
                    <span>{stat.change > 0 ? '+' : ''}{stat.change}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Community Analytics</h2>
          <Badge variant="secondary">{timeframe}</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>

      {/* Community Goals */}
      {showGoals && goals.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Community Goals</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={cn("border-l-4", getPriorityColor(goal.priority))}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{goal.title}</h4>
                          <p className="text-xs text-gray-600">{goal.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {goal.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{goal.current.toLocaleString()}</span>
                          <span>{goal.target.toLocaleString()}</span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        <div className="text-xs text-gray-500 flex items-center justify-between">
                          <span>{((goal.current / goal.target) * 100).toFixed(1)}% complete</span>
                          <span>{formatTimeRemaining(goal.deadline)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Insights */}
      {showTrends && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-blue-800">🎉 Achievements</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Most active day this month with 89 posts</li>
                  <li>• 234 new members joined this week (+12.5%)</li>
                  <li>• Engagement rate reached 76.8% (+2.1%)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-blue-800">🎯 Focus Areas</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Response time improvement needed</li>
                  <li>• 2,153 members away from 15K goal</li>
                  <li>• Weekend events show higher engagement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}