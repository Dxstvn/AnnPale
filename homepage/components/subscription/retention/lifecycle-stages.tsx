'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  XCircle,
  Calendar,
  Clock,
  User,
  Users,
  Target,
  ChevronRight,
  Info,
  CheckCircle,
  Activity,
  Gift,
  Mail,
  MessageSquare,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LifecycleStage {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  duration: string;
  dayRange: { start: number; end: number | null };
  color: string;
  characteristics: string[];
  goals: string[];
  risks: string[];
  interventions: string[];
  retentionRate: number;
}

interface UserLifecycle {
  userId: string;
  currentStage: string;
  daysAsSubscriber: number;
  stageProgress: number;
  previousStages: {
    stage: string;
    duration: number;
    completed: boolean;
  }[];
  riskFactors: string[];
  opportunities: string[];
}

interface LifecycleStagesProps {
  userLifecycle?: UserLifecycle;
  onStageAction?: (stage: LifecycleStage, action: string) => void;
  onInterventionTrigger?: (intervention: string) => void;
  showRecommendations?: boolean;
}

export function LifecycleStages({
  userLifecycle,
  onStageAction,
  onInterventionTrigger,
  showRecommendations = true
}: LifecycleStagesProps) {
  const [selectedStage, setSelectedStage] = React.useState<string | null>(null);
  const [expandedStage, setExpandedStage] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Lifecycle stages definition
  const lifecycleStages: LifecycleStage[] = [
    {
      id: 'honeymoon',
      name: 'Honeymoon Phase',
      description: 'New subscriber excitement and exploration',
      icon: Heart,
      duration: '0-30 days',
      dayRange: { start: 0, end: 30 },
      color: 'from-pink-400 to-pink-600',
      characteristics: [
        'High engagement levels',
        'Exploring all features',
        'Frequent logins',
        'High content consumption'
      ],
      goals: [
        'Establish usage habits',
        'Complete onboarding',
        'First value realization',
        'Community integration'
      ],
      risks: [
        'Overwhelm from too many features',
        'Unclear value proposition',
        'Technical difficulties'
      ],
      interventions: [
        'Welcome series emails',
        'Onboarding checklist',
        'Personal welcome message',
        'Feature tutorials'
      ],
      retentionRate: 85
    },
    {
      id: 'establishment',
      name: 'Establishment Phase',
      description: 'Building routine and finding value',
      icon: Sparkles,
      duration: '30-90 days',
      dayRange: { start: 30, end: 90 },
      color: 'from-blue-400 to-blue-600',
      characteristics: [
        'Stabilizing usage patterns',
        'Favorite features identified',
        'Regular engagement',
        'Community participation'
      ],
      goals: [
        'Deepen engagement',
        'Increase feature adoption',
        'Build social connections',
        'Establish routines'
      ],
      risks: [
        'Initial excitement wearing off',
        'Unmet expectations',
        'Competing priorities'
      ],
      interventions: [
        'Success stories sharing',
        'Feature deep-dives',
        'Community challenges',
        'Exclusive content releases'
      ],
      retentionRate: 75
    },
    {
      id: 'mature',
      name: 'Mature Phase',
      description: 'Established subscriber with consistent usage',
      icon: TrendingUp,
      duration: '90-365 days',
      dayRange: { start: 90, end: 365 },
      color: 'from-green-400 to-green-600',
      characteristics: [
        'Predictable usage patterns',
        'Strong value perception',
        'Active community member',
        'Feature mastery'
      ],
      goals: [
        'Maintain engagement',
        'Prevent monotony',
        'Increase advocacy',
        'Upsell opportunities'
      ],
      risks: [
        'Content fatigue',
        'Taking value for granted',
        'Life changes affecting usage'
      ],
      interventions: [
        'Loyalty rewards',
        'Beta feature access',
        'Ambassador programs',
        'Surprise benefits'
      ],
      retentionRate: 82
    },
    {
      id: 'veteran',
      name: 'Veteran Phase',
      description: 'Long-term loyal subscriber',
      icon: Award,
      duration: '365+ days',
      dayRange: { start: 365, end: null },
      color: 'from-purple-400 to-purple-600',
      characteristics: [
        'Deep platform integration',
        'High lifetime value',
        'Brand advocate',
        'Influencer potential'
      ],
      goals: [
        'Recognition and rewards',
        'Maintain enthusiasm',
        'Leverage for growth',
        'VIP treatment'
      ],
      risks: [
        'Complacency',
        'Feeling undervalued',
        'Market alternatives'
      ],
      interventions: [
        'VIP perks',
        'Anniversary celebrations',
        'Exclusive access',
        'Personal relationship'
      ],
      retentionRate: 90
    },
    {
      id: 'at_risk',
      name: 'At-Risk Phase',
      description: 'Showing signs of potential churn',
      icon: AlertTriangle,
      duration: 'Variable',
      dayRange: { start: -1, end: -1 },
      color: 'from-orange-400 to-orange-600',
      characteristics: [
        'Declining engagement',
        'Reduced login frequency',
        'Support complaints',
        'Payment issues'
      ],
      goals: [
        'Re-engage subscriber',
        'Address pain points',
        'Restore value perception',
        'Prevent cancellation'
      ],
      risks: [
        'Imminent cancellation',
        'Negative word-of-mouth',
        'Lost lifetime value'
      ],
      interventions: [
        'Personal outreach',
        'Special offers',
        'Problem resolution',
        'Win-back campaigns'
      ],
      retentionRate: 45
    },
    {
      id: 'churned',
      name: 'Churned Phase',
      description: 'Subscription cancelled',
      icon: XCircle,
      duration: 'Post-cancellation',
      dayRange: { start: -2, end: -2 },
      color: 'from-red-400 to-red-600',
      characteristics: [
        'Subscription ended',
        'Access restricted',
        'Potential for return',
        'Feedback opportunity'
      ],
      goals: [
        'Understand reasons',
        'Maintain relationship',
        'Win-back opportunity',
        'Learn and improve'
      ],
      risks: [
        'Permanent loss',
        'Negative reviews',
        'Competitor gain'
      ],
      interventions: [
        'Exit survey',
        'Win-back offers',
        'Keep in touch emails',
        'Special return incentives'
      ],
      retentionRate: 20
    }
  ];

  // Sample user lifecycle data
  const defaultUserLifecycle: UserLifecycle = userLifecycle || {
    userId: 'user_123',
    currentStage: 'establishment',
    daysAsSubscriber: 45,
    stageProgress: 50,
    previousStages: [
      { stage: 'honeymoon', duration: 30, completed: true }
    ],
    riskFactors: [
      'Login frequency decreased by 40%',
      'Haven\'t used key features in 2 weeks',
      'Opened support ticket'
    ],
    opportunities: [
      'Eligible for loyalty program',
      'New content matching interests',
      'Community event participation'
    ]
  };

  // Get current stage details
  const currentStage = lifecycleStages.find(s => s.id === defaultUserLifecycle.currentStage);

  // Calculate days until next stage
  const getDaysUntilNextStage = () => {
    if (!currentStage || currentStage.dayRange.end === null) return null;
    return currentStage.dayRange.end - defaultUserLifecycle.daysAsSubscriber;
  };

  // Get stage by days
  const getStageByDays = (days: number) => {
    return lifecycleStages.find(stage => {
      if (stage.dayRange.start === -1) return false; // Skip at-risk
      if (stage.dayRange.start === -2) return false; // Skip churned
      if (stage.dayRange.end === null) return days >= stage.dayRange.start;
      return days >= stage.dayRange.start && days < stage.dayRange.end;
    });
  };

  // Check if user is at risk
  const isAtRisk = defaultUserLifecycle.riskFactors.length >= 2;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Subscriber Lifecycle Status
            </CardTitle>
            {isAtRisk && (
              <Badge className="bg-orange-100 text-orange-700">
                <AlertTriangle className="h-3 w-3 mr-1" />
                At Risk
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Current Stage */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Stage</p>
              {currentStage && (
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                    currentStage.color
                  )}>
                    <currentStage.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{currentStage.name}</p>
                    <p className="text-sm text-gray-600">Day {defaultUserLifecycle.daysAsSubscriber}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Progress */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Stage Progress</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{defaultUserLifecycle.stageProgress}%</span>
                  {getDaysUntilNextStage() && (
                    <span className="text-sm text-gray-500">
                      {getDaysUntilNextStage()} days to next stage
                    </span>
                  )}
                </div>
                <Progress value={defaultUserLifecycle.stageProgress} className="h-2" />
              </div>
            </div>

            {/* Retention Probability */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Retention Probability</p>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">
                  {currentStage ? currentStage.retentionRate : 0}%
                </div>
                <Badge variant="outline">
                  Based on stage
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors & Opportunities */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Risk Factors */}
        <Card className={cn(
          "border",
          defaultUserLifecycle.riskFactors.length > 0 && "border-orange-300"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {defaultUserLifecycle.riskFactors.length > 0 ? (
              <div className="space-y-2">
                {defaultUserLifecycle.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5" />
                    <p className="text-sm text-gray-700">{risk}</p>
                  </div>
                ))}
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => onInterventionTrigger?.('risk_mitigation')}
                >
                  Address Risks
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No risk factors detected</p>
            )}
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card className="border-green-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-green-600" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {defaultUserLifecycle.opportunities.length > 0 ? (
              <div className="space-y-2">
                {defaultUserLifecycle.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                    <p className="text-sm text-gray-700">{opportunity}</p>
                  </div>
                ))}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => onInterventionTrigger?.('opportunity_activation')}
                >
                  Activate Opportunities
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No opportunities available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lifecycle Journey */}
      <Card>
        <CardHeader>
          <CardTitle>Lifecycle Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {lifecycleStages
                .filter(stage => stage.dayRange.start >= 0)
                .map((stage, index) => {
                  const Icon = stage.icon;
                  const isCurrentStage = stage.id === defaultUserLifecycle.currentStage;
                  const isPastStage = defaultUserLifecycle.previousStages.some(ps => ps.stage === stage.id);
                  const isExpanded = expandedStage === stage.id;
                  
                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline Node */}
                      <div className={cn(
                        "absolute left-3 w-6 h-6 rounded-full border-4 bg-white",
                        isCurrentStage && "border-purple-500",
                        isPastStage && "border-green-500",
                        !isCurrentStage && !isPastStage && "border-gray-300"
                      )}>
                        {isPastStage && (
                          <CheckCircle className="h-4 w-4 text-green-500 -ml-0.5 -mt-0.5" />
                        )}
                      </div>
                      
                      {/* Stage Card */}
                      <div 
                        className={cn(
                          "ml-12 p-4 rounded-lg border cursor-pointer transition-all",
                          isCurrentStage && "border-purple-300 bg-purple-50",
                          isPastStage && "border-green-200 bg-green-50",
                          !isCurrentStage && !isPastStage && "border-gray-200"
                        )}
                        onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                              stage.color
                            )}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{stage.name}</h4>
                                {isCurrentStage && (
                                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{stage.duration}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {stage.retentionRate}% retention
                            </Badge>
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
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 space-y-3"
                            >
                              <p className="text-sm text-gray-600">{stage.description}</p>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-medium text-gray-700 mb-2">Characteristics</p>
                                  <ul className="space-y-1">
                                    {stage.characteristics.map((char, idx) => (
                                      <li key={idx} className="text-xs text-gray-600">• {char}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {showRecommendations && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-700 mb-2">Interventions</p>
                                    <ul className="space-y-1">
                                      {stage.interventions.slice(0, 3).map((intervention, idx) => (
                                        <li key={idx} className="text-xs text-gray-600">• {intervention}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              
                              {isCurrentStage && (
                                <Button 
                                  size="sm" 
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStageAction?.(stage, 'optimize');
                                  }}
                                >
                                  Optimize This Stage
                                </Button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      {showRecommendations && currentStage && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Recommended Actions for {currentStage.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Mail, action: 'Send targeted email', description: 'Personalized content based on stage' },
                { icon: Gift, action: 'Offer stage benefit', description: 'Unlock exclusive perks' },
                { icon: MessageSquare, action: 'Personal message', description: 'Direct creator interaction' },
                { icon: Star, action: 'Recognition', description: 'Celebrate milestones' }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex-col items-center text-center"
                  onClick={() => onInterventionTrigger?.(item.action)}
                >
                  <item.icon className="h-8 w-8 mb-2 text-purple-600" />
                  <p className="font-medium text-sm">{item.action}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}