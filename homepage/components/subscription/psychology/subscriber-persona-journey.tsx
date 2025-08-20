'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart,
  DollarSign,
  Package,
  Users,
  Globe,
  Briefcase,
  Star,
  TrendingUp,
  Gift,
  Zap,
  Target,
  Award,
  ChevronRight,
  ArrowRight,
  Info,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonaProfile {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  entryPoint: string;
  trigger: string;
  expectation: string;
  retention: string;
  avgLTV: number;
  conversionRate: number;
  churnRisk: 'low' | 'medium' | 'high';
}

interface JourneyStage {
  stage: string;
  description: string;
  touchpoints: string[];
  conversion: number;
  timeframe: string;
}

interface SubscriberPersonaJourneyProps {
  onPersonaSelect?: (persona: PersonaProfile) => void;
  onStageClick?: (stage: JourneyStage) => void;
  showMetrics?: boolean;
  showRecommendations?: boolean;
}

export function SubscriberPersonaJourney({
  onPersonaSelect,
  onStageClick,
  showMetrics = true,
  showRecommendations = true
}: SubscriberPersonaJourneyProps) {
  const [selectedPersona, setSelectedPersona] = React.useState<string>('super-fan');
  const [expandedStage, setExpandedStage] = React.useState<string | null>(null);

  // Subscriber personas
  const personas: PersonaProfile[] = [
    {
      id: 'super-fan',
      name: 'Super Fan',
      icon: Heart,
      color: 'text-red-600 bg-red-100',
      entryPoint: 'Multiple purchases',
      trigger: 'Exclusive access desire',
      expectation: 'Behind-the-scenes content',
      retention: 'Creator connection',
      avgLTV: 450,
      conversionRate: 68,
      churnRisk: 'low'
    },
    {
      id: 'value-seeker',
      name: 'Value Seeker',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
      entryPoint: 'Price comparison',
      trigger: 'Bundle economics',
      expectation: 'Cost savings',
      retention: 'Content volume',
      avgLTV: 280,
      conversionRate: 45,
      churnRisk: 'medium'
    },
    {
      id: 'collector',
      name: 'Collector',
      icon: Package,
      color: 'text-purple-600 bg-purple-100',
      entryPoint: 'Limited content',
      trigger: 'Completionist drive',
      expectation: 'Full catalog access',
      retention: 'FOMO prevention',
      avgLTV: 380,
      conversionRate: 52,
      churnRisk: 'low'
    },
    {
      id: 'supporter',
      name: 'Supporter',
      icon: Gift,
      color: 'text-pink-600 bg-pink-100',
      entryPoint: 'Creator advocacy',
      trigger: 'Direct support desire',
      expectation: 'Creator success',
      retention: 'Impact visibility',
      avgLTV: 320,
      conversionRate: 58,
      churnRisk: 'low'
    },
    {
      id: 'community',
      name: 'Community Member',
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      entryPoint: 'Group participation',
      trigger: 'Belonging need',
      expectation: 'Social connection',
      retention: 'Peer relationships',
      avgLTV: 295,
      conversionRate: 42,
      churnRisk: 'medium'
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Briefcase,
      color: 'text-orange-600 bg-orange-100',
      entryPoint: 'Business needs',
      trigger: 'Regular content needs',
      expectation: 'Reliability',
      retention: 'Business value',
      avgLTV: 520,
      conversionRate: 72,
      churnRisk: 'low'
    }
  ];

  // Journey stages
  const journeyStages: JourneyStage[] = [
    {
      stage: 'Discovery',
      description: 'Initial exposure to creator content',
      touchpoints: ['Social media', 'Search results', 'Recommendations', 'Word of mouth'],
      conversion: 100,
      timeframe: '0-7 days'
    },
    {
      stage: 'Engagement',
      description: 'Active interaction with free content',
      touchpoints: ['Video views', 'Likes/comments', 'Profile visits', 'Follow actions'],
      conversion: 45,
      timeframe: '7-30 days'
    },
    {
      stage: 'First Purchase',
      description: 'Initial transaction commitment',
      touchpoints: ['Special occasion', 'Quality test', 'Impulse buy', 'Gift purchase'],
      conversion: 18,
      timeframe: '30-60 days'
    },
    {
      stage: 'Repeat Customer',
      description: 'Multiple individual purchases',
      touchpoints: ['Different occasions', 'Loyalty forming', 'Value recognition', 'Trust building'],
      conversion: 8,
      timeframe: '60-120 days'
    },
    {
      stage: 'Subscription Convert',
      description: 'Commits to recurring payment',
      touchpoints: ['Tier selection', 'Exclusive access', 'Community join', 'Bulk savings'],
      conversion: 3.5,
      timeframe: '120-180 days'
    },
    {
      stage: 'Premium Upgrade',
      description: 'Moves to higher tiers',
      touchpoints: ['Additional benefits', 'VIP status', 'Direct access', 'Business needs'],
      conversion: 1.2,
      timeframe: '180+ days'
    }
  ];

  const selectedPersonaData = personas.find(p => p.id === selectedPersona);

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePersonaSelect = (persona: PersonaProfile) => {
    setSelectedPersona(persona.id);
    onPersonaSelect?.(persona);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscriber Persona Journey</h2>
        <p className="text-gray-600">
          Understanding the psychological and economic drivers of subscription conversion
        </p>
      </div>

      {/* Persona Selector */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
        {personas.map((persona) => {
          const Icon = persona.icon;
          const isSelected = selectedPersona === persona.id;
          
          return (
            <Card
              key={persona.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                isSelected && "ring-2 ring-purple-500"
              )}
              onClick={() => handlePersonaSelect(persona)}
            >
              <CardContent className="p-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                  persona.color
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{persona.name}</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Conv</span>
                    <span className="font-medium">{persona.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">LTV</span>
                    <span className="font-medium">${persona.avgLTV}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Persona Details */}
      {selectedPersonaData && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                selectedPersonaData.color
              )}>
                <selectedPersonaData.icon className="h-5 w-5" />
              </div>
              {selectedPersonaData.name} Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Entry Point</label>
                <p className="text-sm font-medium mt-1">{selectedPersonaData.entryPoint}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Subscription Trigger</label>
                <p className="text-sm font-medium mt-1">{selectedPersonaData.trigger}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Value Expectation</label>
                <p className="text-sm font-medium mt-1">{selectedPersonaData.expectation}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Retention Driver</label>
                <p className="text-sm font-medium mt-1">{selectedPersonaData.retention}</p>
              </div>
            </div>

            {showMetrics && (
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${selectedPersonaData.avgLTV}
                  </div>
                  <div className="text-xs text-gray-500">Avg Lifetime Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedPersonaData.conversionRate}%
                  </div>
                  <div className="text-xs text-gray-500">Conversion Rate</div>
                </div>
                <div className="text-center">
                  <Badge className={cn("text-xs", getChurnRiskColor(selectedPersonaData.churnRisk))}>
                    {selectedPersonaData.churnRisk} churn risk
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">Risk Level</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Journey Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Journey Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeyStages.map((stage, index) => {
              const isExpanded = expandedStage === stage.stage;
              const isLast = index === journeyStages.length - 1;
              
              return (
                <div key={stage.stage}>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setExpandedStage(isExpanded ? null : stage.stage);
                      onStageClick?.(stage);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Progress Line */}
                      <div className="relative">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white",
                          index === 0 ? "bg-purple-600" :
                          index <= 2 ? "bg-blue-600" :
                          index <= 4 ? "bg-green-600" : "bg-orange-600"
                        )}>
                          {index + 1}
                        </div>
                        {!isLast && (
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300" />
                        )}
                      </div>

                      {/* Stage Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{stage.stage}</h4>
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">
                              {stage.conversion}%
                            </div>
                            <div className="text-xs text-gray-500">{stage.timeframe}</div>
                          </div>
                        </div>

                        {/* Conversion Bar */}
                        <div className="mt-2">
                          <Progress 
                            value={stage.conversion} 
                            className="h-2"
                          />
                        </div>
                      </div>

                      <ChevronRight className={cn(
                        "h-5 w-5 text-gray-400 transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-16 mt-3"
                      >
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">Key Touchpoints:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {stage.touchpoints.map((touchpoint, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{touchpoint}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isLast && <div className="h-4" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Optimization Tips */}
      {showRecommendations && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Optimization Recommendations for {selectedPersonaData?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Entry Point Optimization</h4>
                  <p className="text-xs text-gray-600">
                    Focus on {selectedPersonaData?.entryPoint.toLowerCase()} to attract more {selectedPersonaData?.name} personas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Trigger Enhancement</h4>
                  <p className="text-xs text-gray-600">
                    Emphasize {selectedPersonaData?.trigger.toLowerCase()} in marketing messages
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Value Communication</h4>
                  <p className="text-xs text-gray-600">
                    Highlight {selectedPersonaData?.expectation.toLowerCase()} in subscription benefits
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Retention Strategy</h4>
                  <p className="text-xs text-gray-600">
                    Strengthen {selectedPersonaData?.retention.toLowerCase()} to reduce churn
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