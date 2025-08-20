'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Users,
  Trophy,
  Heart,
  Gamepad2,
  Target,
  BookOpen,
  Handshake,
  Headphones,
  Compass,
  TrendingUp,
  Star,
  MessageSquare,
  Calendar,
  Award,
  Zap,
  Eye,
  ThumbsUp,
  Share2,
  HelpCircle,
  Lightbulb,
  Gift,
  Shield,
  Globe,
  Activity,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ValueDriver {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  memberBenefit: string;
  creatorBenefit: string;
  platformBenefit: string;
  priority: 'high' | 'medium' | 'low';
  satisfaction: number;
  engagement: number;
  retention: number;
  trend: 'up' | 'down' | 'stable';
}

interface UserValueProfile {
  userId: string;
  primaryDrivers: string[];
  secondaryDrivers: string[];
  satisfactionScores: Record<string, number>;
  engagementMetrics: Record<string, number>;
  preferences: {
    contentType: 'educational' | 'entertainment' | 'networking' | 'support';
    interactionStyle: 'active' | 'passive' | 'mixed';
    timeCommitment: 'light' | 'moderate' | 'heavy';
    motivation: 'learning' | 'connecting' | 'achieving' | 'helping';
  };
}

interface CommunityValueMetrics {
  totalValue: number;
  memberSatisfaction: number;
  creatorRetention: number;
  platformGrowth: number;
  networkEffects: number;
  contentQuality: number;
  supportEffectiveness: number;
}

interface ValueDriversProps {
  userProfile?: UserValueProfile;
  showPersonalInsights?: boolean;
  showCommunityMetrics?: boolean;
  onDriverUpdate?: (driverId: string, satisfaction: number) => void;
}

export function ValueDrivers({
  userProfile,
  showPersonalInsights = true,
  showCommunityMetrics = true,
  onDriverUpdate
}: ValueDriversProps) {
  const [selectedDriver, setSelectedDriver] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState('overview');

  // Define the 6 core value drivers
  const valueDrivers: ValueDriver[] = [
    {
      id: 'information',
      name: 'Information & Knowledge',
      description: 'Access to valuable insights, news, and learning opportunities',
      icon: BookOpen,
      color: 'bg-blue-500',
      memberBenefit: 'Stay informed, learn new skills, access expert knowledge',
      creatorBenefit: 'Receive feedback, gather ideas, understand audience needs',
      platformBenefit: 'High-quality content generation and knowledge sharing',
      priority: 'high',
      satisfaction: 85,
      engagement: 78,
      retention: 82,
      trend: 'up'
    },
    {
      id: 'connection',
      name: 'Relationships & Networking',
      description: 'Building meaningful connections with like-minded individuals',
      icon: Users,
      color: 'bg-green-500',
      memberBenefit: 'Form friendships, professional networks, find mentors',
      creatorBenefit: 'Build loyal fanbase, collaborate with peers, gain advocates',
      platformBenefit: 'Strong network effects, increased user lifetime value',
      priority: 'high',
      satisfaction: 79,
      engagement: 85,
      retention: 88,
      trend: 'up'
    },
    {
      id: 'recognition',
      name: 'Status & Recognition',
      description: 'Acknowledgment for contributions and achievements',
      icon: Trophy,
      color: 'bg-yellow-500',
      memberBenefit: 'Earn badges, build reputation, gain peer respect',
      creatorBenefit: 'Develop brand advocates, increase visibility, social proof',
      platformBenefit: 'Gamification drives engagement and quality content',
      priority: 'medium',
      satisfaction: 72,
      engagement: 68,
      retention: 75,
      trend: 'stable'
    },
    {
      id: 'support',
      name: 'Help & Emotional Support',
      description: 'Assistance with problems and emotional connection',
      icon: Heart,
      color: 'bg-red-500',
      memberBenefit: 'Get help with challenges, feel understood and supported',
      creatorBenefit: 'Reduce support workload, build community goodwill',
      platformBenefit: 'Self-service support, increased member satisfaction',
      priority: 'high',
      satisfaction: 88,
      engagement: 82,
      retention: 90,
      trend: 'up'
    },
    {
      id: 'entertainment',
      name: 'Fun & Entertainment',
      description: 'Enjoyable experiences and engaging content',
      icon: Gamepad2,
      color: 'bg-purple-500',
      memberBenefit: 'Enjoy content, have fun, relax and unwind',
      creatorBenefit: 'Generate content ideas, understand what resonates',
      platformBenefit: 'Increased time on platform, viral content potential',
      priority: 'medium',
      satisfaction: 76,
      engagement: 89,
      retention: 73,
      trend: 'up'
    },
    {
      id: 'purpose',
      name: 'Shared Mission & Purpose',
      description: 'Contributing to meaningful causes and shared values',
      icon: Compass,
      color: 'bg-indigo-500',
      memberBenefit: 'Feel part of something bigger, make meaningful impact',
      creatorBenefit: 'Build strong community identity, passionate supporters',
      platformBenefit: 'Strong cultural identity, member loyalty, word-of-mouth growth',
      priority: 'high',
      satisfaction: 91,
      engagement: 77,
      retention: 93,
      trend: 'stable'
    }
  ];

  // Sample user profile
  const sampleUserProfile: UserValueProfile = {
    userId: 'user-123',
    primaryDrivers: ['information', 'connection', 'purpose'],
    secondaryDrivers: ['support', 'recognition'],
    satisfactionScores: {
      information: 82,
      connection: 88,
      recognition: 65,
      support: 79,
      entertainment: 71,
      purpose: 94
    },
    engagementMetrics: {
      information: 85,
      connection: 92,
      recognition: 58,
      support: 76,
      entertainment: 64,
      purpose: 89
    },
    preferences: {
      contentType: 'educational',
      interactionStyle: 'active',
      timeCommitment: 'moderate',
      motivation: 'learning'
    }
  };

  const displayUserProfile = userProfile || sampleUserProfile;

  // Community value metrics
  const communityMetrics: CommunityValueMetrics = {
    totalValue: 82,
    memberSatisfaction: 84,
    creatorRetention: 78,
    platformGrowth: 91,
    networkEffects: 87,
    contentQuality: 79,
    supportEffectiveness: 88
  };

  const getDriverIcon = (driver: ValueDriver) => {
    const Icon = driver.icon;
    return <Icon className="h-5 w-5" />;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getPersonalDrivers = () => {
    const primary = valueDrivers.filter(d => displayUserProfile.primaryDrivers.includes(d.id));
    const secondary = valueDrivers.filter(d => displayUserProfile.secondaryDrivers.includes(d.id));
    return { primary, secondary };
  };

  const { primary: primaryDrivers, secondary: secondaryDrivers } = getPersonalDrivers();

  const calculateOverallSatisfaction = () => {
    const scores = Object.values(displayUserProfile.satisfactionScores);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  return (
    <div className="space-y-6">
      {/* Personal Value Profile */}
      {showPersonalInsights && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Your Value Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Primary Value Drivers</h4>
                <div className="space-y-2">
                  {primaryDrivers.map(driver => {
                    const satisfaction = displayUserProfile.satisfactionScores[driver.id] || 0;
                    const engagement = displayUserProfile.engagementMetrics[driver.id] || 0;
                    
                    return (
                      <div key={driver.id} className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", driver.color)}>
                            {getDriverIcon(driver)}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{driver.name}</h5>
                            <p className="text-xs text-gray-600">{driver.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Satisfaction</span>
                              <span>{satisfaction}%</span>
                            </div>
                            <Progress value={satisfaction} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Engagement</span>
                              <span>{engagement}%</span>
                            </div>
                            <Progress value={engagement} className="h-1" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Overall Satisfaction</h4>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-3xl font-bold text-blue-600">{calculateOverallSatisfaction().toFixed(0)}%</div>
                    <p className="text-sm text-gray-600">Average across all value drivers</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Your Preferences</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Content Type:</span>
                      <Badge variant="secondary" className="capitalize">
                        {displayUserProfile.preferences.contentType}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Interaction Style:</span>
                      <Badge variant="secondary" className="capitalize">
                        {displayUserProfile.preferences.interactionStyle}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Commitment:</span>
                      <Badge variant="secondary" className="capitalize">
                        {displayUserProfile.preferences.timeCommitment}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Motivation:</span>
                      <Badge variant="secondary" className="capitalize">
                        {displayUserProfile.preferences.motivation}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Value Drivers Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Community Value Drivers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {valueDrivers.map(driver => (
                  <motion.div
                    key={driver.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      selectedDriver === driver.id ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", driver.color)}>
                        {getDriverIcon(driver)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{driver.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs border", getPriorityColor(driver.priority))}>
                            {driver.priority} priority
                          </Badge>
                          {getTrendIcon(driver.trend)}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">{driver.description}</p>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold">{driver.satisfaction}%</div>
                        <div className="text-gray-500">Satisfaction</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{driver.engagement}%</div>
                        <div className="text-gray-500">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{driver.retention}%</div>
                        <div className="text-gray-500">Retention</div>
                      </div>
                    </div>

                    {selectedDriver === driver.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-4 pt-4 border-t border-gray-200 space-y-2"
                      >
                        <div>
                          <h5 className="font-medium text-xs mb-1">Member Benefit</h5>
                          <p className="text-xs text-gray-600">{driver.memberBenefit}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-xs mb-1">Creator Benefit</h5>
                          <p className="text-xs text-gray-600">{driver.creatorBenefit}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-xs mb-1">Platform Benefit</h5>
                          <p className="text-xs text-gray-600">{driver.platformBenefit}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {valueDrivers.map(driver => (
                  <Card key={driver.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", driver.color)}>
                          {getDriverIcon(driver)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{driver.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs border", getPriorityColor(driver.priority))}>
                              {driver.priority}
                            </Badge>
                            {getTrendIcon(driver.trend)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{driver.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Member Satisfaction</span>
                            <span>{driver.satisfaction}%</span>
                          </div>
                          <Progress value={driver.satisfaction} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Engagement Level</span>
                            <span>{driver.engagement}%</span>
                          </div>
                          <Progress value={driver.engagement} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Retention Impact</span>
                            <span>{driver.retention}%</span>
                          </div>
                          <Progress value={driver.retention} className="h-2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <Users className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                          <div className="text-xs font-medium">Members</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <Star className="h-4 w-4 mx-auto mb-1 text-green-600" />
                          <div className="text-xs font-medium">Creators</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <Globe className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                          <div className="text-xs font-medium">Platform</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6 mt-6">
              {showCommunityMetrics && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{communityMetrics.totalValue}%</div>
                      <div className="text-sm text-gray-600">Overall Value Score</div>
                      <div className="text-xs text-green-600 mt-1">↑ 5% this month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{communityMetrics.memberSatisfaction}%</div>
                      <div className="text-sm text-gray-600">Member Satisfaction</div>
                      <div className="text-xs text-green-600 mt-1">↑ 3% this month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{communityMetrics.networkEffects}%</div>
                      <div className="text-sm text-gray-600">Network Effects</div>
                      <div className="text-xs text-green-600 mt-1">↑ 8% this month</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{communityMetrics.platformGrowth}%</div>
                      <div className="text-sm text-gray-600">Platform Growth</div>
                      <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Value Driver Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {valueDrivers.map(driver => (
                        <div key={driver.id} className="flex items-center gap-3">
                          <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white", driver.color)}>
                            {getDriverIcon(driver)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{driver.name}</span>
                              <span>{((driver.satisfaction + driver.engagement + driver.retention) / 3).toFixed(0)}%</span>
                            </div>
                            <Progress value={(driver.satisfaction + driver.engagement + driver.retention) / 3} className="h-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Trend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Value Driver Trends</p>
                        <p className="text-xs">Last 6 months performance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}