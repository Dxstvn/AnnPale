'use client';

import { useState } from 'react';
import { CreatorMotivation, CREATOR_MOTIVATIONS } from '@/lib/types/live-streaming';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  Users,
  DollarSign,
  MessageSquare,
  Video,
  Award,
  TrendingUp,
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorMotivationDashboardProps {
  currentMotivation?: CreatorMotivation;
  onMotivationChange?: (motivation: CreatorMotivation) => void;
  metrics?: {
    followerGrowth: number;
    revenueGrowth: number;
    engagementRate: number;
    contentQuality: number;
    brandScore: number;
  };
  className?: string;
}

const motivationIcons: Record<CreatorMotivation, React.ElementType> = {
  'audience-building': Users,
  'revenue-generation': DollarSign,
  'community-building': MessageSquare,
  'content-creation': Video,
  'brand-building': Award
};

const motivationColors: Record<CreatorMotivation, string> = {
  'audience-building': 'text-blue-500',
  'revenue-generation': 'text-green-500',
  'community-building': 'text-purple-500',
  'content-creation': 'text-orange-500',
  'brand-building': 'text-pink-500'
};

export function CreatorMotivationDashboard({
  currentMotivation = 'audience-building',
  onMotivationChange,
  metrics = {
    followerGrowth: 75,
    revenueGrowth: 60,
    engagementRate: 85,
    contentQuality: 90,
    brandScore: 70
  },
  className
}: CreatorMotivationDashboardProps) {
  const [selectedMotivation, setSelectedMotivation] = useState<CreatorMotivation>(currentMotivation);
  const strategy = CREATOR_MOTIVATIONS[selectedMotivation];

  const handleMotivationSelect = (motivation: CreatorMotivation) => {
    setSelectedMotivation(motivation);
    onMotivationChange?.(motivation);
  };

  const getMetricForMotivation = (motivation: CreatorMotivation): number => {
    switch (motivation) {
      case 'audience-building':
        return metrics.followerGrowth;
      case 'revenue-generation':
        return metrics.revenueGrowth;
      case 'community-building':
        return metrics.engagementRate;
      case 'content-creation':
        return metrics.contentQuality;
      case 'brand-building':
        return metrics.brandScore;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Creator Strategy Center</CardTitle>
              <CardDescription>
                Optimize your streaming approach based on your goals
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {(Object.keys(CREATOR_MOTIVATIONS) as CreatorMotivation[]).map((motivation) => {
              const Icon = motivationIcons[motivation];
              const isSelected = selectedMotivation === motivation;
              const metric = getMetricForMotivation(motivation);
              
              return (
                <Card
                  key={motivation}
                  className={cn(
                    'cursor-pointer transition-all hover:scale-105',
                    isSelected && 'ring-2 ring-purple-500'
                  )}
                  onClick={() => handleMotivationSelect(motivation)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Icon className={cn('w-8 h-8', motivationColors[motivation])} />
                      <h4 className="text-sm font-medium capitalize">
                        {motivation.replace('-', ' ')}
                      </h4>
                      <Progress value={metric} className="h-2 w-full" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {metric}% optimized
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Current Strategy
            </CardTitle>
            <CardDescription className="capitalize">
              {selectedMotivation.replace('-', ' ')} Focus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Approach</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {strategy.strategy}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Required Features</h4>
              <div className="flex flex-wrap gap-2">
                {strategy.featuresNeeded.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Success Metrics</h4>
              <div className="space-y-2">
                {strategy.successMetrics.map((metric) => (
                  <div key={metric} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily" className="space-y-4 mt-4">
                <MetricItem label="Stream Views" value="+324" trend="up" />
                <MetricItem label="New Followers" value="+12" trend="up" />
                <MetricItem label="Revenue" value="$45" trend="neutral" />
                <MetricItem label="Engagement" value="4.2%" trend="down" />
              </TabsContent>
              
              <TabsContent value="weekly" className="space-y-4 mt-4">
                <MetricItem label="Stream Views" value="+2.1K" trend="up" />
                <MetricItem label="New Followers" value="+89" trend="up" />
                <MetricItem label="Revenue" value="$312" trend="up" />
                <MetricItem label="Engagement" value="5.8%" trend="up" />
              </TabsContent>
              
              <TabsContent value="monthly" className="space-y-4 mt-4">
                <MetricItem label="Stream Views" value="+8.5K" trend="up" />
                <MetricItem label="New Followers" value="+342" trend="up" />
                <MetricItem label="Revenue" value="$1,245" trend="up" />
                <MetricItem label="Engagement" value="6.1%" trend="up" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>
            Based on your {selectedMotivation.replace('-', ' ')} strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getRecommendations(selectedMotivation).map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <Badge className="mt-0.5">{index + 1}</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{recommendation.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {recommendation.description}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricItem({ 
  label, 
  value, 
  trend 
}: { 
  label: string; 
  value: string; 
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value}</span>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
        {trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
      </div>
    </div>
  );
}

function getRecommendations(motivation: CreatorMotivation) {
  const recommendations: Record<CreatorMotivation, Array<{ title: string; description: string }>> = {
    'audience-building': [
      {
        title: 'Stream at consistent times',
        description: 'Build a regular schedule so viewers know when to find you'
      },
      {
        title: 'Collaborate with other creators',
        description: 'Cross-promote with creators in similar niches'
      },
      {
        title: 'Optimize your stream titles',
        description: 'Use searchable keywords and trending topics'
      }
    ],
    'revenue-generation': [
      {
        title: 'Enable super chat features',
        description: 'Make it easy for viewers to support you financially'
      },
      {
        title: 'Offer exclusive perks',
        description: 'Create member-only content and benefits'
      },
      {
        title: 'Run limited-time promotions',
        description: 'Create urgency with special offers'
      }
    ],
    'community-building': [
      {
        title: 'Engage with chat actively',
        description: 'Respond to messages and create conversations'
      },
      {
        title: 'Create community events',
        description: 'Host Q&As, game nights, or watch parties'
      },
      {
        title: 'Recognize regular viewers',
        description: 'Acknowledge and appreciate your loyal community'
      }
    ],
    'content-creation': [
      {
        title: 'Invest in better equipment',
        description: 'Improve audio and video quality for professional streams'
      },
      {
        title: 'Plan content in advance',
        description: 'Create content calendars and prepare segments'
      },
      {
        title: 'Experiment with formats',
        description: 'Try tutorials, performances, or interviews'
      }
    ],
    'brand-building': [
      {
        title: 'Develop consistent branding',
        description: 'Use consistent colors, overlays, and messaging'
      },
      {
        title: 'Cross-platform promotion',
        description: 'Share clips on social media to expand reach'
      },
      {
        title: 'Partner with brands',
        description: 'Seek sponsorship opportunities aligned with your values'
      }
    ]
  };

  return recommendations[motivation] || [];
}