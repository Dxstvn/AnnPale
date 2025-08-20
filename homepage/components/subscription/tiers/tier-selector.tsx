'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Crown,
  Star,
  Shield,
  ChevronRight,
  Check,
  Zap,
  Heart,
  Clock,
  Users,
  Gift,
  TrendingUp,
  AlertCircle,
  Info,
  Sparkles,
  ArrowUp,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TierRecommendation {
  tier: string;
  score: number;
  reasons: string[];
}

interface UserPreference {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    tierWeights: { bronze: number; silver: number; gold: number };
  }>;
}

interface TierSelectorProps {
  currentTier?: string;
  onTierSelect?: (tier: string) => void;
  onProceedToPayment?: (tier: string) => void;
  showRecommendation?: boolean;
  showPsychologyFactors?: boolean;
}

export function TierSelector({
  currentTier,
  onTierSelect,
  onProceedToPayment,
  showRecommendation = true,
  showPsychologyFactors = true
}: TierSelectorProps) {
  const [selectedTier, setSelectedTier] = React.useState<string>(currentTier || 'silver');
  const [userPreferences, setUserPreferences] = React.useState<Record<string, string>>({});
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [recommendation, setRecommendation] = React.useState<TierRecommendation | null>(null);

  // Psychology factors for each tier
  const psychologyFactors = {
    bronze: [
      { factor: 'Low Commitment', icon: Clock, description: 'Test the waters without major investment' },
      { factor: 'Basic Access', icon: Shield, description: 'Essential features to get started' },
      { factor: 'Community Entry', icon: Users, description: 'Join the fan community' }
    ],
    silver: [
      { factor: 'Optimal Value', icon: TrendingUp, description: 'Best features-to-price ratio' },
      { factor: 'Live Connection', icon: Zap, description: 'Real-time interaction with creator' },
      { factor: 'Social Proof', icon: Users, description: 'Most popular choice among fans' }
    ],
    gold: [
      { factor: 'VIP Status', icon: Crown, description: 'Exclusive recognition and privileges' },
      { factor: 'Personal Touch', icon: Heart, description: 'Direct 1-on-1 connections' },
      { factor: 'Complete Access', icon: Lock, description: 'Everything the creator offers' }
    ]
  };

  // Preference questions for tier recommendation
  const preferenceQuestions: UserPreference[] = [
    {
      id: 'budget',
      question: 'What\'s your monthly entertainment budget for this creator?',
      options: [
        { value: 'low', label: 'Under $15', tierWeights: { bronze: 10, silver: 3, gold: 0 } },
        { value: 'medium', label: '$15-35', tierWeights: { bronze: 3, silver: 10, gold: 5 } },
        { value: 'high', label: '$35+', tierWeights: { bronze: 0, silver: 5, gold: 10 } }
      ]
    },
    {
      id: 'engagement',
      question: 'How often do you want to interact with the creator?',
      options: [
        { value: 'casual', label: 'Occasionally', tierWeights: { bronze: 10, silver: 5, gold: 2 } },
        { value: 'regular', label: 'Weekly', tierWeights: { bronze: 2, silver: 10, gold: 7 } },
        { value: 'super', label: 'Daily', tierWeights: { bronze: 0, silver: 3, gold: 10 } }
      ]
    },
    {
      id: 'content',
      question: 'What type of content matters most to you?',
      options: [
        { value: 'basic', label: 'Exclusive videos', tierWeights: { bronze: 10, silver: 7, gold: 5 } },
        { value: 'live', label: 'Live streams', tierWeights: { bronze: 0, silver: 10, gold: 8 } },
        { value: 'personal', label: 'Personal interaction', tierWeights: { bronze: 0, silver: 3, gold: 10 } }
      ]
    },
    {
      id: 'value',
      question: 'What drives your subscription decision?',
      options: [
        { value: 'try', label: 'Want to try it out', tierWeights: { bronze: 10, silver: 3, gold: 0 } },
        { value: 'value', label: 'Best bang for buck', tierWeights: { bronze: 2, silver: 10, gold: 3 } },
        { value: 'exclusive', label: 'Maximum exclusivity', tierWeights: { bronze: 0, silver: 2, gold: 10 } }
      ]
    }
  ];

  const calculateRecommendation = () => {
    const scores = { bronze: 0, silver: 0, gold: 0 };
    const reasons: Record<string, string[]> = { bronze: [], silver: [], gold: [] };

    // Calculate scores based on preferences
    Object.entries(userPreferences).forEach(([questionId, answer]) => {
      const question = preferenceQuestions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === answer);
      
      if (option) {
        scores.bronze += option.tierWeights.bronze;
        scores.silver += option.tierWeights.silver;
        scores.gold += option.tierWeights.gold;

        // Add reasons
        if (option.tierWeights.bronze >= 7) reasons.bronze.push(option.label);
        if (option.tierWeights.silver >= 7) reasons.silver.push(option.label);
        if (option.tierWeights.gold >= 7) reasons.gold.push(option.label);
      }
    });

    // Find the highest scoring tier
    const maxScore = Math.max(scores.bronze, scores.silver, scores.gold);
    const recommendedTier = 
      scores.bronze === maxScore ? 'bronze' :
      scores.silver === maxScore ? 'silver' : 'gold';

    setRecommendation({
      tier: recommendedTier,
      score: (maxScore / (preferenceQuestions.length * 10)) * 100,
      reasons: reasons[recommendedTier]
    });

    setSelectedTier(recommendedTier);
  };

  const handlePreferenceChange = (questionId: string, value: string) => {
    setUserPreferences(prev => ({ ...prev, [questionId]: value }));
  };

  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    onTierSelect?.(tier);
  };

  const getTierDetails = (tier: string) => {
    const details = {
      bronze: {
        name: 'Bronze',
        price: 9.99,
        icon: Shield,
        color: 'from-orange-400 to-orange-600',
        highlight: 'Perfect for trying out',
        features: ['Monthly video', 'Community access', '10% discount'],
        psychology: 'Low-risk entry point'
      },
      silver: {
        name: 'Silver',
        price: 24.99,
        icon: Star,
        color: 'from-gray-400 to-gray-600',
        highlight: 'Most popular choice',
        features: ['Weekly content', 'Live streams', 'Direct messages'],
        psychology: 'Optimal value perception'
      },
      gold: {
        name: 'Gold VIP',
        price: 49.99,
        icon: Crown,
        color: 'from-yellow-400 to-yellow-600',
        highlight: 'Ultimate experience',
        features: ['Daily content', 'Video calls', 'All perks'],
        psychology: 'Premium status signal'
      }
    };
    return details[tier as keyof typeof details];
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Quiz */}
      {showRecommendation && !recommendation && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Find Your Perfect Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showQuiz ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Not sure which tier is right for you? Take our quick quiz to get a personalized recommendation.
                </p>
                <Button onClick={() => setShowQuiz(true)}>
                  Start Quiz
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {preferenceQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {index + 1}. {question.question}
                    </Label>
                    <RadioGroup
                      value={userPreferences[question.id]}
                      onValueChange={(value) => handlePreferenceChange(question.id, value)}
                    >
                      {question.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                          <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                
                {Object.keys(userPreferences).length === preferenceQuestions.length && (
                  <Button 
                    className="w-full"
                    onClick={calculateRecommendation}
                  >
                    Get My Recommendation
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendation Result */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-purple-500 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Your Recommended Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className={cn(
                  "w-20 h-20 rounded-full bg-gradient-to-r mx-auto mb-4 flex items-center justify-center",
                  getTierDetails(recommendation.tier)?.color
                )}>
                  {React.createElement(getTierDetails(recommendation.tier)?.icon || Star, {
                    className: "h-10 w-10 text-white"
                  })}
                </div>
                <h3 className="text-2xl font-bold capitalize">{recommendation.tier}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round(recommendation.score)}% match with your preferences
                </p>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">Based on your preferences:</p>
                {recommendation.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full"
                onClick={() => setShowQuiz(false)}
                variant="outline"
              >
                Retake Quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tier Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {['bronze', 'silver', 'gold'].map((tier) => {
          const details = getTierDetails(tier);
          const Icon = details?.icon || Star;
          const isSelected = selectedTier === tier;
          const isCurrent = currentTier === tier;
          const isRecommended = recommendation?.tier === tier;
          
          return (
            <motion.div
              key={tier}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={cn(
                  "relative cursor-pointer transition-all",
                  isSelected && "ring-2 ring-purple-500 shadow-lg",
                  isRecommended && "border-purple-500"
                )}
                onClick={() => handleTierSelect(tier)}
              >
                {isRecommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                    Recommended
                  </Badge>
                )}
                
                {tier === 'silver' && !isRecommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full bg-gradient-to-r mx-auto mb-3 flex items-center justify-center",
                    details?.color
                  )}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>{details?.name}</CardTitle>
                  <div className="text-2xl font-bold">
                    ${details?.price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-center text-gray-600">
                    {details?.highlight}
                  </p>
                  
                  <div className="space-y-1">
                    {details?.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {showPsychologyFactors && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 italic">
                        {details?.psychology}
                      </p>
                    </div>
                  )}

                  {isSelected && (
                    <div className="pt-2">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Psychology Factors */}
      {showPsychologyFactors && selectedTier && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Why {getTierDetails(selectedTier)?.name} Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {psychologyFactors[selectedTier as keyof typeof psychologyFactors].map((factor, idx) => {
                const FactorIcon = factor.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FactorIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{factor.factor}</h4>
                      <p className="text-xs text-gray-600">{factor.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Selected Tier:</p>
              <p className="text-xl font-bold capitalize">{selectedTier}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Monthly Price:</p>
              <p className="text-xl font-bold">${getTierDetails(selectedTier)?.price}</p>
            </div>
          </div>
          
          {currentTier && currentTier !== selectedTier && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-blue-600" />
                <span>
                  {currentTier === 'bronze' && selectedTier === 'silver' && 'Upgrading will unlock 12 new benefits'}
                  {currentTier === 'bronze' && selectedTier === 'gold' && 'Upgrading will unlock 29 new benefits'}
                  {currentTier === 'silver' && selectedTier === 'gold' && 'Upgrading will unlock 17 new benefits'}
                  {currentTier === 'silver' && selectedTier === 'bronze' && 'Downgrading will remove 12 benefits'}
                  {currentTier === 'gold' && selectedTier === 'silver' && 'Downgrading will remove 17 benefits'}
                  {currentTier === 'gold' && selectedTier === 'bronze' && 'Downgrading will remove 29 benefits'}
                </span>
              </div>
            </div>
          )}

          <Button 
            className="w-full"
            size="lg"
            onClick={() => onProceedToPayment?.(selectedTier)}
          >
            {currentTier === selectedTier ? 'Current Plan' : 
             currentTier && currentTier !== selectedTier ? 
             (selectedTier > currentTier ? 'Upgrade' : 'Downgrade') + ' to ' + getTierDetails(selectedTier)?.name :
             'Subscribe to ' + getTierDetails(selectedTier)?.name}
            {currentTier !== selectedTier && <ArrowUp className="h-4 w-4 ml-2" />}
          </Button>

          {!currentTier && (
            <p className="text-xs text-center text-gray-500 mt-3">
              Cancel anytime • No hidden fees • Instant access
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add Award import that was missing
import { Award } from 'lucide-react';