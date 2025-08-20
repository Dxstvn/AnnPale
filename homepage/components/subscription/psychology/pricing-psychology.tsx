'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
  Gift,
  Users,
  Clock,
  Percent,
  Award,
  Target,
  ChevronRight,
  Info,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingFactor {
  id: string;
  factor: string;
  principle: string;
  implementation: string;
  conversionImpact: number;
  retentionEffect: number;
  icon: React.ElementType;
  color: string;
  examples: string[];
  bestPractices: string[];
}

interface PricingStrategy {
  id: string;
  name: string;
  description: string;
  effectiveness: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: string;
  roi: number;
}

interface PriceTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

interface PricingPsychologyProps {
  onFactorClick?: (factor: PricingFactor) => void;
  onStrategySelect?: (strategy: PricingStrategy) => void;
  showAnalytics?: boolean;
  showRecommendations?: boolean;
}

export function PricingPsychology({
  onFactorClick,
  onStrategySelect,
  showAnalytics = true,
  showRecommendations = true
}: PricingPsychologyProps) {
  const [selectedFactor, setSelectedFactor] = React.useState<string>('anchoring');
  const [expandedStrategy, setExpandedStrategy] = React.useState<string | null>(null);

  // Pricing psychology factors
  const pricingFactors: PricingFactor[] = [
    {
      id: 'anchoring',
      factor: 'Anchoring',
      principle: 'First price sets reference point',
      implementation: 'Show premium tier first',
      conversionImpact: 35,
      retentionEffect: 15,
      icon: Target,
      color: 'text-purple-600 bg-purple-100',
      examples: ['$99 crossed out, now $29', 'Compare to competitor at $150'],
      bestPractices: ['Lead with highest value', 'Create stark contrasts', 'Use visual hierarchy']
    },
    {
      id: 'social-proof',
      factor: 'Social Proof',
      principle: 'Others\' choices influence decisions',
      implementation: 'Show popularity indicators',
      conversionImpact: 28,
      retentionEffect: 22,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      examples: ['Most popular badge', '10,000+ subscribers', 'Creator\'s choice'],
      bestPractices: ['Real-time counters', 'Testimonials near price', 'Peer comparisons']
    },
    {
      id: 'loss-aversion',
      factor: 'Loss Aversion',
      principle: 'Fear of missing out drives action',
      implementation: 'Limited time offers',
      conversionImpact: 42,
      retentionEffect: 8,
      icon: Clock,
      color: 'text-red-600 bg-red-100',
      examples: ['24-hour flash sale', 'Only 5 spots left', 'Price increases tomorrow'],
      bestPractices: ['Authentic scarcity', 'Clear deadlines', 'Visual countdowns']
    },
    {
      id: 'decoy-effect',
      factor: 'Decoy Effect',
      principle: 'Third option makes target attractive',
      implementation: 'Strategic tier positioning',
      conversionImpact: 31,
      retentionEffect: 18,
      icon: Sparkles,
      color: 'text-yellow-600 bg-yellow-100',
      examples: ['Basic $19, Pro $29, Plus $27', 'Make middle tier obvious choice'],
      bestPractices: ['3-tier structure', 'Asymmetric features', 'Clear value gaps']
    },
    {
      id: 'bundling',
      factor: 'Bundling',
      principle: 'Package deals feel valuable',
      implementation: 'Group complementary items',
      conversionImpact: 26,
      retentionEffect: 35,
      icon: Gift,
      color: 'text-green-600 bg-green-100',
      examples: ['All-access pass', 'Creator bundle deals', 'Annual savings'],
      bestPractices: ['Logical groupings', 'Clear savings display', 'Exclusive bundles']
    },
    {
      id: 'reciprocity',
      factor: 'Reciprocity',
      principle: 'Free value creates obligation',
      implementation: 'Free trials and samples',
      conversionImpact: 23,
      retentionEffect: 28,
      icon: Award,
      color: 'text-pink-600 bg-pink-100',
      examples: ['7-day free trial', 'Free first video', 'Bonus content'],
      bestPractices: ['Quality samples', 'No credit card trials', 'Surprise bonuses']
    }
  ];

  // Pricing strategies
  const pricingStrategies: PricingStrategy[] = [
    {
      id: 'freemium',
      name: 'Freemium Model',
      description: 'Free tier with premium upgrades',
      effectiveness: 72,
      difficulty: 'medium',
      timeToImplement: '2-4 weeks',
      roi: 180
    },
    {
      id: 'tiered',
      name: 'Tiered Pricing',
      description: 'Multiple subscription levels',
      effectiveness: 85,
      difficulty: 'easy',
      timeToImplement: '1 week',
      roi: 220
    },
    {
      id: 'usage-based',
      name: 'Usage-Based',
      description: 'Pay for what you consume',
      effectiveness: 68,
      difficulty: 'hard',
      timeToImplement: '4-6 weeks',
      roi: 165
    },
    {
      id: 'value-based',
      name: 'Value-Based',
      description: 'Price based on perceived value',
      effectiveness: 78,
      difficulty: 'medium',
      timeToImplement: '2-3 weeks',
      roi: 195
    }
  ];

  // Sample pricing tiers
  const priceTiers: PriceTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 19,
      features: ['5 videos/month', 'Standard delivery', 'Community access']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      originalPrice: 39,
      features: ['Unlimited videos', 'Priority delivery', 'Direct messages', 'Exclusive content'],
      highlighted: true,
      badge: 'Most Popular'
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 99,
      features: ['Everything in Pro', 'Custom requests', '1-on-1 calls', 'Merchandise'],
      badge: 'Best Value'
    }
  ];

  const selectedFactorData = pricingFactors.find(f => f.id === selectedFactor);

  const handleFactorSelect = (factor: PricingFactor) => {
    setSelectedFactor(factor.id);
    onFactorClick?.(factor);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Pricing Psychology Dashboard</h2>
        <p className="text-gray-600">
          Psychological principles driving subscription pricing optimization
        </p>
      </div>

      {/* Key Metrics */}
      {showAnalytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-500">Avg Price</span>
              </div>
              <div className="text-2xl font-bold">$49</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="h-3 w-3" />
                <span>12% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-500">Conversion</span>
              </div>
              <div className="text-2xl font-bold">3.8%</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="h-3 w-3" />
                <span>0.5% improvement</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-500">Subscribers</span>
              </div>
              <div className="text-2xl font-bold">2,847</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUp className="h-3 w-3" />
                <span>234 new this month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-500">LTV</span>
              </div>
              <div className="text-2xl font-bold">$287</div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <ArrowDown className="h-3 w-3" />
                <span>3% decrease</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pricing Psychology Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Psychological Pricing Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingFactors.map((factor) => {
              const Icon = factor.icon;
              const isSelected = selectedFactor === factor.id;
              
              return (
                <Card
                  key={factor.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    isSelected && "ring-2 ring-purple-500"
                  )}
                  onClick={() => handleFactorSelect(factor)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        factor.color
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{factor.factor}</h3>
                        <p className="text-xs text-gray-600 mb-2">{factor.principle}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Conversion Impact</span>
                              <span className="text-xs font-bold">{factor.conversionImpact}%</span>
                            </div>
                            <Progress value={factor.conversionImpact} className="h-1" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Retention Effect</span>
                              <span className="text-xs font-bold">{factor.retentionEffect}%</span>
                            </div>
                            <Progress value={factor.retentionEffect} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Factor Details */}
      {selectedFactorData && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <selectedFactorData.icon className="h-6 w-6" />
              {selectedFactorData.factor} Implementation Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Examples</h4>
                <div className="space-y-2">
                  {selectedFactorData.examples.map((example, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Best Practices</h4>
                <div className="space-y-2">
                  {selectedFactorData.bestPractices.map((practice, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm">
                <strong>Implementation:</strong> {selectedFactorData.implementation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Strategy Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pricingStrategies.map((strategy) => {
              const isExpanded = expandedStrategy === strategy.id;
              
              return (
                <div key={strategy.id}>
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setExpandedStrategy(isExpanded ? null : strategy.id);
                      onStrategySelect?.(strategy);
                    }}
                  >
                    <div>
                      <h3 className="font-semibold">{strategy.name}</h3>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{strategy.effectiveness}%</div>
                        <div className="text-xs text-gray-500">Effectiveness</div>
                      </div>
                      <Badge className={cn("text-xs", getDifficultyColor(strategy.difficulty))}>
                        {strategy.difficulty}
                      </Badge>
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
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-sm text-gray-600">Time to Implement</div>
                              <div className="font-bold">{strategy.timeToImplement}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Expected ROI</div>
                              <div className="font-bold text-green-600">{strategy.roi}%</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Effectiveness</div>
                              <Progress value={strategy.effectiveness} className="mt-2" />
                            </div>
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

      {/* Sample Pricing Display */}
      <Card>
        <CardHeader>
          <CardTitle>Optimized Pricing Display</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {priceTiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative p-6 rounded-lg border-2 transition-all",
                  tier.highlighted ? "border-purple-500 shadow-lg scale-105" : "border-gray-200"
                )}
              >
                {tier.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                    {tier.badge}
                  </Badge>
                )}
                
                <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                
                <div className="mb-4">
                  {tier.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">${tier.originalPrice}</span>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${tier.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={cn("w-full", tier.highlighted && "bg-purple-600 hover:bg-purple-700")}
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  Choose {tier.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {showRecommendations && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Pricing Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Implement Anchoring</h4>
                  <p className="text-xs text-gray-600">
                    Show your premium tier first to establish a high reference point
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Add Social Proof</h4>
                  <p className="text-xs text-gray-600">
                    Display subscriber counts and testimonials near pricing
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Create Urgency</h4>
                  <p className="text-xs text-gray-600">
                    Use limited-time offers to trigger loss aversion
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