'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap,
  Clock,
  Gift,
  Heart,
  Star,
  Trophy,
  Shield,
  Users,
  TrendingUp,
  DollarSign,
  Sparkles,
  Award,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  ArrowUp,
  Eye,
  MousePointer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversionTrigger {
  id: string;
  name: string;
  type: 'emotional' | 'rational' | 'social' | 'urgency';
  description: string;
  effectiveness: number;
  timing: string;
  placement: string[];
  icon: React.ElementType;
  color: string;
  examples: string[];
  metrics: {
    conversionRate: number;
    avgTimeToConvert: string;
    successRate: number;
  };
}

interface TriggerSequence {
  id: string;
  name: string;
  stages: Array<{
    trigger: string;
    timing: string;
    action: string;
  }>;
  overallEffectiveness: number;
}

interface TriggerAnalytics {
  trigger: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
}

interface ConversionTriggersProps {
  onTriggerClick?: (trigger: ConversionTrigger) => void;
  onSequenceSelect?: (sequence: TriggerSequence) => void;
  showAnalytics?: boolean;
  showOptimization?: boolean;
}

export function ConversionTriggers({
  onTriggerClick,
  onSequenceSelect,
  showAnalytics = true,
  showOptimization = true
}: ConversionTriggersProps) {
  const [selectedTrigger, setSelectedTrigger] = React.useState<string>('exclusive-access');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [expandedSequence, setExpandedSequence] = React.useState<string | null>(null);

  // Conversion triggers
  const conversionTriggers: ConversionTrigger[] = [
    {
      id: 'exclusive-access',
      name: 'Exclusive Access',
      type: 'emotional',
      description: 'Behind-the-scenes content only for subscribers',
      effectiveness: 82,
      timing: 'After 3+ video views',
      placement: ['Video end screen', 'Profile page', 'Email follow-up'],
      icon: Star,
      color: 'text-purple-600 bg-purple-100',
      examples: [
        'Get exclusive behind-the-scenes content',
        'Members-only live streams',
        'Early access to new videos'
      ],
      metrics: {
        conversionRate: 4.2,
        avgTimeToConvert: '7 days',
        successRate: 68
      }
    },
    {
      id: 'limited-time',
      name: 'Limited Time Offer',
      type: 'urgency',
      description: 'Time-sensitive discounts and promotions',
      effectiveness: 75,
      timing: 'First 48 hours',
      placement: ['Landing page', 'Pop-up', 'Cart abandonment'],
      icon: Clock,
      color: 'text-red-600 bg-red-100',
      examples: [
        '50% off first month - 24 hours only',
        'Flash sale ending soon',
        'Special launch pricing'
      ],
      metrics: {
        conversionRate: 5.8,
        avgTimeToConvert: '2 days',
        successRate: 72
      }
    },
    {
      id: 'social-proof',
      name: 'Social Validation',
      type: 'social',
      description: 'Showcase community size and testimonials',
      effectiveness: 68,
      timing: 'Throughout journey',
      placement: ['Homepage', 'Pricing page', 'Checkout'],
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      examples: [
        'Join 10,000+ subscribers',
        'Rated 4.9★ by members',
        'Featured testimonials'
      ],
      metrics: {
        conversionRate: 3.5,
        avgTimeToConvert: '14 days',
        successRate: 61
      }
    },
    {
      id: 'value-bundle',
      name: 'Value Bundle',
      type: 'rational',
      description: 'Clear cost savings and bundled benefits',
      effectiveness: 71,
      timing: 'After price exposure',
      placement: ['Pricing table', 'Comparison chart', 'FAQ section'],
      icon: Gift,
      color: 'text-green-600 bg-green-100',
      examples: [
        'Save $50/month with annual plan',
        'All-inclusive package',
        'Bundle and save 40%'
      ],
      metrics: {
        conversionRate: 3.9,
        avgTimeToConvert: '10 days',
        successRate: 65
      }
    },
    {
      id: 'achievement',
      name: 'Achievement Unlock',
      type: 'emotional',
      description: 'Gamification and progress rewards',
      effectiveness: 64,
      timing: 'After engagement milestones',
      placement: ['Dashboard', 'Email campaigns', 'In-app notifications'],
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100',
      examples: [
        'Unlock VIP status',
        'Complete your collection',
        'Level up your membership'
      ],
      metrics: {
        conversionRate: 2.8,
        avgTimeToConvert: '21 days',
        successRate: 58
      }
    },
    {
      id: 'trust-signals',
      name: 'Trust & Security',
      type: 'rational',
      description: 'Risk reduction and guarantees',
      effectiveness: 59,
      timing: 'Pre-checkout',
      placement: ['Payment page', 'FAQ', 'Footer'],
      icon: Shield,
      color: 'text-orange-600 bg-orange-100',
      examples: [
        '30-day money-back guarantee',
        'Cancel anytime',
        'Secure payment processing'
      ],
      metrics: {
        conversionRate: 2.4,
        avgTimeToConvert: '5 days',
        successRate: 55
      }
    }
  ];

  // Trigger sequences
  const triggerSequences: TriggerSequence[] = [
    {
      id: 'awareness-to-trial',
      name: 'Awareness to Trial',
      stages: [
        { trigger: 'Social proof', timing: 'First visit', action: 'Show subscriber count' },
        { trigger: 'Free sample', timing: 'After 2 min', action: 'Offer free video' },
        { trigger: 'Limited time', timing: 'Exit intent', action: 'Show discount popup' }
      ],
      overallEffectiveness: 76
    },
    {
      id: 'trial-to-paid',
      name: 'Trial to Paid',
      stages: [
        { trigger: 'Value reminder', timing: 'Day 3', action: 'Send benefits email' },
        { trigger: 'Exclusive content', timing: 'Day 5', action: 'Preview locked content' },
        { trigger: 'Urgency', timing: 'Day 6', action: 'Trial ending reminder' }
      ],
      overallEffectiveness: 82
    },
    {
      id: 'retention-upgrade',
      name: 'Retention & Upgrade',
      stages: [
        { trigger: 'Achievement', timing: 'Month 1', action: 'Celebrate milestone' },
        { trigger: 'Exclusive offer', timing: 'Month 2', action: 'VIP upgrade prompt' },
        { trigger: 'Community', timing: 'Ongoing', action: 'Highlight connections' }
      ],
      overallEffectiveness: 71
    }
  ];

  // Trigger analytics
  const triggerAnalytics: TriggerAnalytics[] = [
    { trigger: 'Exclusive Access', impressions: 45678, clicks: 3421, conversions: 189, ctr: 7.5, conversionRate: 5.5 },
    { trigger: 'Limited Time', impressions: 34567, clicks: 4123, conversions: 198, ctr: 11.9, conversionRate: 4.8 },
    { trigger: 'Social Proof', impressions: 56789, clicks: 2345, conversions: 123, ctr: 4.1, conversionRate: 5.2 },
    { trigger: 'Value Bundle', impressions: 23456, clicks: 1876, conversions: 98, ctr: 8.0, conversionRate: 5.2 }
  ];

  const selectedTriggerData = conversionTriggers.find(t => t.id === selectedTrigger);

  const handleTriggerSelect = (trigger: ConversionTrigger) => {
    setSelectedTrigger(trigger.id);
    onTriggerClick?.(trigger);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emotional':
        return 'text-purple-600 bg-purple-100';
      case 'rational':
        return 'text-blue-600 bg-blue-100';
      case 'social':
        return 'text-green-600 bg-green-100';
      case 'urgency':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTriggers = selectedType === 'all' 
    ? conversionTriggers 
    : conversionTriggers.filter(t => t.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Conversion Triggers Analysis</h2>
        <p className="text-gray-600">
          Psychological triggers that drive subscription conversions
        </p>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2">
        {['all', 'emotional', 'rational', 'social', 'urgency'].map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Triggers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTriggers.map((trigger) => {
          const Icon = trigger.icon;
          const isSelected = selectedTrigger === trigger.id;
          
          return (
            <Card
              key={trigger.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                isSelected && "ring-2 ring-purple-500"
              )}
              onClick={() => handleTriggerSelect(trigger)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    trigger.color
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className={cn("text-xs", getTypeColor(trigger.type))}>
                    {trigger.type}
                  </Badge>
                </div>

                <h3 className="font-semibold text-sm mb-1">{trigger.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{trigger.description}</p>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Effectiveness</span>
                      <span className="text-xs font-bold">{trigger.effectiveness}%</span>
                    </div>
                    <Progress value={trigger.effectiveness} className="h-1" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Conv Rate</span>
                    <span className="font-medium">{trigger.metrics.conversionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Trigger Details */}
      {selectedTriggerData && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <selectedTriggerData.icon className="h-6 w-6" />
              {selectedTriggerData.name} Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-sm mb-3">Examples</h4>
                <div className="space-y-2">
                  {selectedTriggerData.examples.map((example, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-3">Placement</h4>
                <div className="space-y-2">
                  {selectedTriggerData.placement.map((place, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span>{place}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Performance</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Success Rate</span>
                      <span className="text-sm font-bold">{selectedTriggerData.metrics.successRate}%</span>
                    </div>
                    <Progress value={selectedTriggerData.metrics.successRate} className="h-2 mt-1" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Timing:</span>
                      <span className="font-medium">{selectedTriggerData.timing}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg Convert:</span>
                      <span className="font-medium">{selectedTriggerData.metrics.avgTimeToConvert}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trigger Sequences */}
      <Card>
        <CardHeader>
          <CardTitle>Optimized Trigger Sequences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {triggerSequences.map((sequence) => {
              const isExpanded = expandedSequence === sequence.id;
              
              return (
                <div key={sequence.id}>
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setExpandedSequence(isExpanded ? null : sequence.id);
                      onSequenceSelect?.(sequence);
                    }}
                  >
                    <div>
                      <h3 className="font-semibold">{sequence.name}</h3>
                      <p className="text-sm text-gray-600">{sequence.stages.length} stage sequence</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold">{sequence.overallEffectiveness}%</div>
                        <div className="text-xs text-gray-500">Effectiveness</div>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2"
                      >
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="space-y-3">
                            {sequence.stages.map((stage, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Trigger: </span>
                                    <span className="font-medium">{stage.trigger}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Timing: </span>
                                    <span className="font-medium">{stage.timing}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Action: </span>
                                    <span className="font-medium">{stage.action}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trigger Analytics */}
      {showAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Trigger Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 text-sm font-medium">Trigger</th>
                    <th className="py-2 text-sm font-medium text-right">Impressions</th>
                    <th className="py-2 text-sm font-medium text-right">Clicks</th>
                    <th className="py-2 text-sm font-medium text-right">CTR</th>
                    <th className="py-2 text-sm font-medium text-right">Conversions</th>
                    <th className="py-2 text-sm font-medium text-right">Conv Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {triggerAnalytics.map((data) => (
                    <tr key={data.trigger} className="border-b">
                      <td className="py-2 text-sm">{data.trigger}</td>
                      <td className="py-2 text-sm text-right">{data.impressions.toLocaleString()}</td>
                      <td className="py-2 text-sm text-right">{data.clicks.toLocaleString()}</td>
                      <td className="py-2 text-sm text-right font-medium">{data.ctr}%</td>
                      <td className="py-2 text-sm text-right">{data.conversions}</td>
                      <td className="py-2 text-sm text-right">
                        <Badge variant="outline" className="text-xs">
                          {data.conversionRate}%
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

      {/* Optimization Tips */}
      {showOptimization && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Trigger Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Timing Optimization</h4>
                  <p className="text-xs text-gray-600">
                    Deploy triggers at peak engagement moments for maximum impact
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Visibility Enhancement</h4>
                  <p className="text-xs text-gray-600">
                    Ensure triggers are prominently displayed without being intrusive
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MousePointer className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">A/B Testing</h4>
                  <p className="text-xs text-gray-600">
                    Continuously test trigger variations to improve conversion rates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Personalization</h4>
                  <p className="text-xs text-gray-600">
                    Tailor triggers based on user behavior and preferences
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}