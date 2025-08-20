'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  Users,
  DollarSign,
  Gift,
  Star,
  Crown,
  Sparkles,
  Lock,
  Unlock,
  ChevronUp,
  ChevronRight,
  Info,
  CheckCircle,
  ArrowUp,
  Award,
  Zap,
  Target,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LadderStage {
  id: string;
  stage: string;
  level: number;
  value: string;
  description: string;
  content: string[];
  price: number | string;
  conversion: number;
  retention: number;
  icon: React.ElementType;
  color: string;
  features: string[];
}

interface ValueMetric {
  metric: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface SubscriptionValueLadderProps {
  onStageClick?: (stage: LadderStage) => void;
  onUpgradeClick?: (fromStage: string, toStage: string) => void;
  showMetrics?: boolean;
  showPathways?: boolean;
}

export function SubscriptionValueLadder({
  onStageClick,
  onUpgradeClick,
  showMetrics = true,
  showPathways = true
}: SubscriptionValueLadderProps) {
  const [selectedStage, setSelectedStage] = React.useState<string>('discovery');
  const [expandedPath, setExpandedPath] = React.useState<string | null>(null);

  // Value ladder stages
  const ladderStages: LadderStage[] = [
    {
      id: 'discovery',
      stage: 'Discovery',
      level: 1,
      value: 'Free',
      description: 'Building awareness and trust',
      content: ['Sample videos', 'Public posts', 'Social media', 'Guest appearances'],
      price: 'Free',
      conversion: 100,
      retention: 25,
      icon: Sparkles,
      color: 'bg-gray-100 text-gray-600',
      features: ['Limited content', 'Community access', 'Basic profile']
    },
    {
      id: 'first-transaction',
      stage: 'First Transaction',
      level: 2,
      value: '$',
      description: 'Initial commitment and quality assessment',
      content: ['Single video purchase', 'Special occasion', 'Quality test', 'Trust building'],
      price: 25,
      conversion: 18,
      retention: 45,
      icon: Gift,
      color: 'bg-blue-100 text-blue-600',
      features: ['One-time purchase', 'Standard delivery', 'Basic support']
    },
    {
      id: 'repeat-customer',
      stage: 'Repeat Customer',
      level: 3,
      value: '$$',
      description: 'Pattern recognition and loyalty forming',
      content: ['Multiple purchases', 'Different occasions', 'Referrals', 'Reviews'],
      price: 75,
      conversion: 8,
      retention: 62,
      icon: Heart,
      color: 'bg-green-100 text-green-600',
      features: ['Bulk discounts', 'Priority delivery', 'Loyalty points']
    },
    {
      id: 'subscription-convert',
      stage: 'Subscription Convert',
      level: 4,
      value: '$$$',
      description: 'Committed relationship with exclusive access',
      content: ['Monthly subscription', 'Exclusive content', 'Community membership', 'Direct messages'],
      price: 29,
      conversion: 3.5,
      retention: 78,
      icon: Star,
      color: 'bg-purple-100 text-purple-600',
      features: ['Unlimited access', 'Member benefits', 'Early access', 'Exclusive content']
    },
    {
      id: 'premium-upgrade',
      stage: 'Premium Upgrade',
      level: 5,
      value: '$$$$',
      description: 'Maximum value extraction and ambassador status',
      content: ['VIP tier', 'All add-ons', 'Direct access', 'Co-creation opportunities'],
      price: 99,
      conversion: 1.2,
      retention: 92,
      icon: Crown,
      color: 'bg-yellow-100 text-yellow-600',
      features: ['All features', 'VIP support', 'Custom content', 'Ambassador perks']
    }
  ];

  // Upgrade pathways
  const upgradePaths = [
    {
      from: 'discovery',
      to: 'first-transaction',
      trigger: 'Special occasion or curiosity',
      strategy: 'Limited-time offers, social proof',
      success: 65
    },
    {
      from: 'first-transaction',
      to: 'repeat-customer',
      trigger: 'Satisfaction with quality',
      strategy: 'Follow-up engagement, personalization',
      success: 44
    },
    {
      from: 'repeat-customer',
      to: 'subscription-convert',
      trigger: 'Economic benefit recognition',
      strategy: 'Bundle savings, exclusive content',
      success: 38
    },
    {
      from: 'subscription-convert',
      to: 'premium-upgrade',
      trigger: 'Desire for premium experience',
      strategy: 'VIP benefits, status symbols',
      success: 34
    }
  ];

  // Value metrics
  const valueMetrics: ValueMetric[] = [
    { metric: 'Avg Customer Value', value: '$125', change: 15, trend: 'up' },
    { metric: 'Lifetime Value', value: '$450', change: 22, trend: 'up' },
    { metric: 'Subscription Rate', value: '3.5%', change: -2, trend: 'down' },
    { metric: 'Upgrade Rate', value: '34%', change: 8, trend: 'up' }
  ];

  const selectedStageData = ladderStages.find(s => s.id === selectedStage);

  const handleStageSelect = (stage: LadderStage) => {
    setSelectedStage(stage.id);
    onStageClick?.(stage);
  };

  const getValueSymbol = (value: string) => {
    return value.split('').map((char, idx) => (
      <DollarSign key={idx} className="h-4 w-4" />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscription Value Ladder</h2>
        <p className="text-gray-600">
          Progressive value delivery driving customer lifetime value maximization
        </p>
      </div>

      {/* Value Metrics */}
      {showMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {valueMetrics.map((metric) => (
            <Card key={metric.metric}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-gray-500">{metric.metric}</span>
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  )}>
                    {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : 
                     metric.trend === 'down' ? <ArrowUp className="h-3 w-3 rotate-180" /> : null}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Value Ladder Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Value Evolution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Ladder Steps */}
            <div className="space-y-4">
              {ladderStages.reverse().map((stage, index) => {
                const Icon = stage.icon;
                const isSelected = selectedStage === stage.id;
                const isLast = index === ladderStages.length - 1;
                
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={cn(
                        "relative cursor-pointer transition-all",
                        isSelected && "scale-105"
                      )}
                      onClick={() => handleStageSelect(stage)}
                    >
                      <div className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border-2",
                        isSelected ? "border-purple-500 shadow-lg" : "border-gray-200",
                        stage.color
                      )}>
                        {/* Level Indicator */}
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-bold text-gray-300">
                            {stage.level}
                          </div>
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            stage.color
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>

                        {/* Stage Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg">{stage.stage}</h3>
                            <div className="flex items-center">
                              {stage.value === 'Free' ? (
                                <Badge variant="secondary">Free</Badge>
                              ) : (
                                getValueSymbol(stage.value)
                              )}
                            </div>
                            {typeof stage.price === 'number' && (
                              <Badge variant="outline">${stage.price}/mo</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-2">
                            {stage.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="text-right">
                          <div className="space-y-2">
                            <div>
                              <div className="text-xl font-bold">{stage.conversion}%</div>
                              <div className="text-xs text-gray-500">Conversion</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">{stage.retention}%</div>
                              <div className="text-xs text-gray-500">Retention</div>
                            </div>
                          </div>
                        </div>

                        {/* Upgrade Arrow */}
                        {!isLast && (
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="bg-white rounded-full p-1">
                              <ChevronUp className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Pathways */}
      {showPathways && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Pathways & Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upgradePaths.map((path, index) => {
                const isExpanded = expandedPath === `${path.from}-${path.to}`;
                
                return (
                  <div key={index}>
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => setExpandedPath(isExpanded ? null : `${path.from}-${path.to}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{path.from}</Badge>
                        <ChevronRight className="h-4 w-4" />
                        <Badge variant="outline">{path.to}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold">{path.success}%</div>
                          <div className="text-xs text-gray-500">Success Rate</div>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform",
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
                          className="mt-2 ml-4"
                        >
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                  <Zap className="h-4 w-4 text-yellow-600" />
                                  Trigger
                                </h4>
                                <p className="text-sm text-gray-600">{path.trigger}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                  <Target className="h-4 w-4 text-purple-600" />
                                  Strategy
                                </h4>
                                <p className="text-sm text-gray-600">{path.strategy}</p>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="mt-3"
                              onClick={() => onUpgradeClick?.(path.from, path.to)}
                            >
                              Optimize This Path
                            </Button>
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
      )}

      {/* Selected Stage Details */}
      {selectedStageData && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <selectedStageData.icon className="h-6 w-6" />
              {selectedStageData.stage} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Content & Features</h4>
                <div className="space-y-2">
                  {selectedStageData.content.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="text-sm font-bold">{selectedStageData.conversion}%</span>
                    </div>
                    <Progress value={selectedStageData.conversion} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Retention Rate</span>
                      <span className="text-sm font-bold">{selectedStageData.retention}%</span>
                    </div>
                    <Progress value={selectedStageData.retention} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}