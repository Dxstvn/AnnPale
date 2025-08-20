'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Eye,
  EyeOff,
  Radio,
  MessageSquareOff,
  Gift,
  ShoppingCart,
  XCircle,
  TrendingDown,
  AlertTriangle,
  Activity,
  BarChart3,
  Target,
  Info,
  ChevronRight,
  Calendar,
  Clock,
  MousePointer,
  Search,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BehaviorPattern {
  id: string;
  type: 'content' | 'engagement' | 'navigation' | 'economic';
  name: string;
  description: string;
  icon: React.ElementType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  lastOccurrence: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
  predictedOutcome: {
    action: string;
    probability: number;
    timeframe: string;
  };
}

interface PatternInsight {
  id: string;
  title: string;
  description: string;
  patterns: string[];
  riskScore: number;
  recommendation: string;
}

interface BehavioralPatternsProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d';
  onPatternClick?: (pattern: BehaviorPattern) => void;
  onInsightAction?: (insight: PatternInsight) => void;
  showPredictions?: boolean;
}

export function BehavioralPatterns({
  userId,
  timeRange = '30d',
  onPatternClick,
  onInsightAction,
  showPredictions = true
}: BehavioralPatternsProps) {
  const [selectedPattern, setSelectedPattern] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Sample behavior patterns
  const behaviorPatterns: BehaviorPattern[] = [
    {
      id: 'skipped_content',
      type: 'content',
      name: 'Content Skipping',
      description: 'User frequently skips videos before completion',
      icon: EyeOff,
      severity: 'high',
      frequency: 8,
      lastOccurrence: new Date(currentTime - 2 * 24 * 60 * 60 * 1000),
      trend: 'increasing',
      predictedOutcome: {
        action: 'Subscription cancellation',
        probability: 65,
        timeframe: '30 days'
      }
    },
    {
      id: 'no_live_attendance',
      type: 'engagement',
      name: 'No Live Stream Attendance',
      description: 'Has not attended any live streams in 60 days',
      icon: Radio,
      severity: 'critical',
      frequency: 0,
      lastOccurrence: new Date(currentTime - 60 * 24 * 60 * 60 * 1000),
      trend: 'stable',
      predictedOutcome: {
        action: 'Tier downgrade',
        probability: 75,
        timeframe: '14 days'
      }
    },
    {
      id: 'ignored_messages',
      type: 'engagement',
      name: 'Message Ignoring',
      description: 'Not opening or responding to creator messages',
      icon: MessageSquareOff,
      severity: 'medium',
      frequency: 5,
      lastOccurrence: new Date(currentTime - 7 * 24 * 60 * 60 * 1000),
      trend: 'increasing',
      predictedOutcome: {
        action: 'Engagement drop',
        probability: 55,
        timeframe: '21 days'
      }
    },
    {
      id: 'benefit_underuse',
      type: 'economic',
      name: 'Benefit Underutilization',
      description: 'Using less than 20% of available benefits',
      icon: Gift,
      severity: 'high',
      frequency: 1,
      lastOccurrence: new Date(currentTime - 30 * 24 * 60 * 60 * 1000),
      trend: 'stable',
      predictedOutcome: {
        action: 'Value perception decline',
        probability: 80,
        timeframe: '45 days'
      }
    },
    {
      id: 'comparison_shopping',
      type: 'navigation',
      name: 'Comparison Shopping',
      description: 'Frequently viewing other creator profiles',
      icon: ShoppingCart,
      severity: 'medium',
      frequency: 12,
      lastOccurrence: new Date(currentTime - 1 * 24 * 60 * 60 * 1000),
      trend: 'increasing',
      predictedOutcome: {
        action: 'Switch to competitor',
        probability: 45,
        timeframe: '30 days'
      }
    },
    {
      id: 'cancel_page_visits',
      type: 'navigation',
      name: 'Cancellation Page Visits',
      description: 'Visited cancellation page 3 times this week',
      icon: XCircle,
      severity: 'critical',
      frequency: 3,
      lastOccurrence: new Date(currentTime - 12 * 60 * 60 * 1000),
      trend: 'increasing',
      predictedOutcome: {
        action: 'Immediate cancellation',
        probability: 90,
        timeframe: '7 days'
      }
    },
    {
      id: 'search_alternatives',
      type: 'navigation',
      name: 'Alternative Searching',
      description: 'Searching for similar content elsewhere',
      icon: Search,
      severity: 'high',
      frequency: 6,
      lastOccurrence: new Date(currentTime - 3 * 24 * 60 * 60 * 1000),
      trend: 'increasing',
      predictedOutcome: {
        action: 'Platform switch',
        probability: 60,
        timeframe: '14 days'
      }
    },
    {
      id: 'session_decline',
      type: 'engagement',
      name: 'Session Time Decline',
      description: 'Average session time decreased by 70%',
      icon: Clock,
      severity: 'high',
      frequency: 10,
      lastOccurrence: new Date(currentTime),
      trend: 'increasing',
      predictedOutcome: {
        action: 'Disengagement',
        probability: 70,
        timeframe: '21 days'
      }
    }
  ];

  // Pattern insights
  const patternInsights: PatternInsight[] = [
    {
      id: 'high_churn_risk',
      title: 'High Churn Risk Detected',
      description: 'Multiple critical behavior patterns indicate imminent cancellation',
      patterns: ['cancel_page_visits', 'no_live_attendance', 'benefit_underuse'],
      riskScore: 92,
      recommendation: 'Immediate intervention required - Send personal message from creator'
    },
    {
      id: 'value_perception',
      title: 'Low Value Perception',
      description: 'User is not utilizing subscription benefits effectively',
      patterns: ['benefit_underuse', 'skipped_content'],
      riskScore: 75,
      recommendation: 'Send benefit utilization guide and offer onboarding session'
    },
    {
      id: 'competitive_threat',
      title: 'Competitive Interest',
      description: 'User showing interest in alternative options',
      patterns: ['comparison_shopping', 'search_alternatives'],
      riskScore: 60,
      recommendation: 'Highlight unique value propositions and exclusive content'
    }
  ];

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return TrendingDown;
      case 'decreasing': return TrendingDown;
      default: return Activity;
    }
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((currentTime - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Group patterns by type
  const groupedPatterns = behaviorPatterns.reduce((acc, pattern) => {
    if (!acc[pattern.type]) acc[pattern.type] = [];
    acc[pattern.type].push(pattern);
    return acc;
  }, {} as Record<string, BehaviorPattern[]>);

  const typeIcons = {
    content: Eye,
    engagement: Activity,
    navigation: MousePointer,
    economic: Gift
  };

  const typeNames = {
    content: 'Content Behavior',
    engagement: 'Engagement Patterns',
    navigation: 'Navigation Behavior',
    economic: 'Economic Behavior'
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Behavioral Pattern Analysis
            </CardTitle>
            <Badge variant="outline">
              Last {timeRange}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Critical Patterns</p>
              <p className="text-2xl font-bold text-red-600">
                {behaviorPatterns.filter(p => p.severity === 'critical').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">High Risk Patterns</p>
              <p className="text-2xl font-bold text-orange-600">
                {behaviorPatterns.filter(p => p.severity === 'high').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Increasing Trends</p>
              <p className="text-2xl font-bold text-yellow-600">
                {behaviorPatterns.filter(p => p.trend === 'increasing').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Risk Score</p>
              <p className="text-2xl font-bold">
                {Math.round(patternInsights.reduce((sum, i) => sum + i.riskScore, 0) / patternInsights.length)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Insights */}
      {patternInsights.filter(i => i.riskScore >= 75).length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Critical Insights Requiring Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patternInsights
                .filter(i => i.riskScore >= 75)
                .map(insight => (
                  <div key={insight.id} className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge className="bg-red-100 text-red-700">
                            Risk: {insight.riskScore}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <div className="p-3 bg-blue-50 rounded">
                          <p className="text-sm font-medium text-blue-900 mb-1">Recommendation:</p>
                          <p className="text-sm text-blue-700">{insight.recommendation}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => onInsightAction?.(insight)}
                      >
                        Take Action
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Behavior Patterns by Type */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(groupedPatterns).map(([type, patterns]) => {
          const TypeIcon = typeIcons[type as keyof typeof typeIcons];
          
          return (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TypeIcon className="h-4 w-4" />
                  {typeNames[type as keyof typeof typeNames]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patterns.map(pattern => {
                    const Icon = pattern.icon;
                    const TrendIcon = getTrendIcon(pattern.trend);
                    const isSelected = selectedPattern === pattern.id;
                    
                    return (
                      <motion.div
                        key={pattern.id}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setSelectedPattern(isSelected ? null : pattern.id);
                          onPatternClick?.(pattern);
                        }}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          pattern.severity === 'critical' && "border-red-300 bg-red-50",
                          pattern.severity === 'high' && "border-orange-300 bg-orange-50",
                          isSelected && "ring-2 ring-purple-500"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded flex items-center justify-center",
                            pattern.severity === 'critical' && "bg-red-100",
                            pattern.severity === 'high' && "bg-orange-100",
                            pattern.severity === 'medium' && "bg-yellow-100",
                            pattern.severity === 'low' && "bg-blue-100"
                          )}>
                            <Icon className={cn("h-4 w-4", getSeverityColor(pattern.severity))} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{pattern.name}</h4>
                              <Badge className={cn("text-xs", getSeverityBadge(pattern.severity))}>
                                {pattern.severity}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2">{pattern.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Frequency: {pattern.frequency}x</span>
                              <span>Last: {formatTimeAgo(pattern.lastOccurrence)}</span>
                              <span className="flex items-center gap-1">
                                <TrendIcon className="h-3 w-3" />
                                {pattern.trend}
                              </span>
                            </div>
                            
                            {showPredictions && pattern.predictedOutcome && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                <p className="font-medium text-gray-700">
                                  {pattern.predictedOutcome.probability}% chance of {pattern.predictedOutcome.action}
                                </p>
                                <p className="text-gray-500">
                                  Within {pattern.predictedOutcome.timeframe}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Prediction Summary */}
      {showPredictions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Predicted Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {behaviorPatterns
                .filter(p => p.predictedOutcome.probability >= 60)
                .sort((a, b) => b.predictedOutcome.probability - a.predictedOutcome.probability)
                .map(pattern => (
                  <div key={pattern.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        pattern.predictedOutcome.probability >= 80 ? "bg-red-100" :
                        pattern.predictedOutcome.probability >= 60 ? "bg-orange-100" :
                        "bg-yellow-100"
                      )}>
                        <span className={cn(
                          "text-lg font-bold",
                          pattern.predictedOutcome.probability >= 80 ? "text-red-600" :
                          pattern.predictedOutcome.probability >= 60 ? "text-orange-600" :
                          "text-yellow-600"
                        )}>
                          {pattern.predictedOutcome.probability}%
                        </span>
                      </div>
                      
                      <div>
                        <p className="font-medium">{pattern.predictedOutcome.action}</p>
                        <p className="text-sm text-gray-600">
                          Based on: {pattern.name} • {pattern.predictedOutcome.timeframe}
                        </p>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}