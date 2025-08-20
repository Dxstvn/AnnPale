'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Crown,
  Star,
  Shield,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Calculator,
  Calendar,
  DollarSign,
  Zap,
  Clock,
  Info,
  AlertCircle,
  Gift,
  ChevronRight,
  Lock,
  Unlock,
  TrendingUp,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TierInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  price: number;
  originalPrice?: number;
  color: string;
  benefits: string[];
  limits: {
    videos: number | 'unlimited';
    messages: number | 'unlimited';
    liveEvents: number | 'unlimited';
    exclusiveContent: boolean;
    directMessages: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

interface MigrationDetails {
  currentTier: string;
  targetTier: string;
  direction: 'upgrade' | 'downgrade';
  priceDifference: number;
  prorationAmount: number;
  nextBillingDate: Date;
  instantActivation: boolean;
  features: {
    gained?: string[];
    lost?: string[];
    maintained?: string[];
  };
}

interface TierMigrationInterfaceProps {
  currentTier?: string;
  availableTiers?: TierInfo[];
  migrationDetails?: MigrationDetails;
  onTierSelect?: (tierId: string) => void;
  onConfirmMigration?: (details: MigrationDetails) => void;
  onCancelMigration?: () => void;
  showProration?: boolean;
  allowDowngrade?: boolean;
}

export function TierMigrationInterface({
  currentTier = 'bronze',
  availableTiers = [],
  migrationDetails,
  onTierSelect,
  onConfirmMigration,
  onCancelMigration,
  showProration = true,
  allowDowngrade = true
}: TierMigrationInterfaceProps) {
  const [selectedTier, setSelectedTier] = React.useState<string | null>(null);
  const [showComparison, setShowComparison] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default tier information
  const defaultTiers: TierInfo[] = availableTiers.length > 0 ? availableTiers : [
    {
      id: 'bronze',
      name: 'Bronze',
      icon: Shield,
      price: 9.99,
      color: 'from-amber-400 to-amber-600',
      benefits: [
        '20 videos per month',
        '50 creator messages',
        '5 live events access',
        'Basic community access',
        'Standard support'
      ],
      limits: {
        videos: 20,
        messages: 50,
        liveEvents: 5,
        exclusiveContent: false,
        directMessages: false,
        prioritySupport: false
      }
    },
    {
      id: 'silver',
      name: 'Silver',
      icon: Star,
      price: 19.99,
      color: 'from-slate-400 to-slate-600',
      benefits: [
        'Unlimited videos',
        'Unlimited creator messages',
        'Unlimited live events',
        'Exclusive content access',
        'Direct messaging',
        'Priority support'
      ],
      limits: {
        videos: 'unlimited',
        messages: 'unlimited',
        liveEvents: 'unlimited',
        exclusiveContent: true,
        directMessages: true,
        prioritySupport: false
      },
      popular: true
    },
    {
      id: 'gold',
      name: 'Gold',
      icon: Crown,
      price: 39.99,
      color: 'from-yellow-400 to-yellow-600',
      benefits: [
        'All Silver benefits',
        'Monthly 1-on-1 video call',
        'Custom video requests',
        'VIP community access',
        'Priority support',
        'Exclusive merchandise'
      ],
      limits: {
        videos: 'unlimited',
        messages: 'unlimited',
        liveEvents: 'unlimited',
        exclusiveContent: true,
        directMessages: true,
        prioritySupport: true
      }
    }
  ];

  // Get current tier info
  const currentTierInfo = defaultTiers.find(tier => tier.id === currentTier);
  const selectedTierInfo = selectedTier ? defaultTiers.find(tier => tier.id === selectedTier) : null;

  // Calculate migration details
  const calculateMigrationDetails = (targetTierId: string): MigrationDetails | null => {
    if (!currentTierInfo) return null;
    
    const targetTier = defaultTiers.find(tier => tier.id === targetTierId);
    if (!targetTier) return null;

    const priceDifference = targetTier.price - currentTierInfo.price;
    const direction = priceDifference > 0 ? 'upgrade' : 'downgrade';
    
    // Calculate proration (assuming 15 days left in billing cycle)
    const daysRemaining = 15;
    const prorationAmount = Math.abs(priceDifference) * (daysRemaining / 30);

    return {
      currentTier: currentTier,
      targetTier: targetTierId,
      direction,
      priceDifference: Math.abs(priceDifference),
      prorationAmount: direction === 'upgrade' ? prorationAmount : -prorationAmount,
      nextBillingDate: new Date(currentTime + 15 * 24 * 60 * 60 * 1000),
      instantActivation: true,
      features: {
        gained: direction === 'upgrade' ? getAdditionalFeatures(currentTier, targetTierId) : undefined,
        lost: direction === 'downgrade' ? getAdditionalFeatures(targetTierId, currentTier) : undefined,
        maintained: getSharedFeatures(currentTier, targetTierId)
      }
    };
  };

  // Get additional features when upgrading from tier A to tier B
  const getAdditionalFeatures = (fromTier: string, toTier: string): string[] => {
    const fromTierInfo = defaultTiers.find(t => t.id === fromTier);
    const toTierInfo = defaultTiers.find(t => t.id === toTier);
    
    if (!fromTierInfo || !toTierInfo) return [];
    
    return toTierInfo.benefits.filter(benefit => 
      !fromTierInfo.benefits.some(existingBenefit => 
        existingBenefit.toLowerCase().includes(benefit.toLowerCase().split(' ')[0])
      )
    );
  };

  // Get shared features between tiers
  const getSharedFeatures = (tierA: string, tierB: string): string[] => {
    const tierAInfo = defaultTiers.find(t => t.id === tierA);
    const tierBInfo = defaultTiers.find(t => t.id === tierB);
    
    if (!tierAInfo || !tierBInfo) return [];
    
    return tierAInfo.benefits.filter(benefit => 
      tierBInfo.benefits.some(otherBenefit => 
        otherBenefit.toLowerCase().includes(benefit.toLowerCase().split(' ')[0])
      )
    );
  };

  // Handle tier selection
  const handleTierSelect = (tierId: string) => {
    if (tierId === currentTier) return;
    
    setSelectedTier(tierId);
    setShowComparison(true);
    onTierSelect?.(tierId);
  };

  // Handle confirm migration
  const handleConfirmMigration = () => {
    if (!selectedTier) return;
    
    const details = calculateMigrationDetails(selectedTier);
    if (details) {
      onConfirmMigration?.(details);
      setShowConfirmation(true);
    }
  };

  // Get tier order index for comparison
  const getTierOrder = (tierId: string) => {
    const order = { bronze: 0, silver: 1, gold: 2 };
    return order[tierId as keyof typeof order] || 0;
  };

  const currentMigrationDetails = selectedTier ? calculateMigrationDetails(selectedTier) : null;

  return (
    <div className="space-y-6">
      {/* Current Tier Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentTierInfo && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center",
                  currentTierInfo.color
                )}>
                  <currentTierInfo.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentTierInfo.name}</h3>
                  <p className="text-gray-600">${currentTierInfo.price}/month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Next billing</p>
                <p className="font-medium">
                  {new Date(currentTime + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Tiers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Your New Tier</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {defaultTiers.map(tier => {
            const Icon = tier.icon;
            const isCurrentTier = tier.id === currentTier;
            const isSelected = tier.id === selectedTier;
            const canSelect = !isCurrentTier && (allowDowngrade || getTierOrder(tier.id) > getTierOrder(currentTier));
            const isUpgrade = getTierOrder(tier.id) > getTierOrder(currentTier);
            const isDowngrade = getTierOrder(tier.id) < getTierOrder(currentTier);

            return (
              <Card 
                key={tier.id}
                className={cn(
                  "transition-all cursor-pointer",
                  isCurrentTier && "border-blue-500 bg-blue-50",
                  isSelected && "border-purple-500 bg-purple-50 ring-2 ring-purple-200",
                  !canSelect && !isCurrentTier && "opacity-50 cursor-not-allowed",
                  tier.popular && "border-green-500"
                )}
                onClick={() => canSelect && handleTierSelect(tier.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        tier.color
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {tier.name}
                          {tier.popular && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Popular
                            </Badge>
                          )}
                        </h4>
                        <p className="text-lg font-bold">${tier.price}/month</p>
                      </div>
                    </div>
                    
                    {isCurrentTier && (
                      <Badge className="bg-blue-100 text-blue-700">
                        Current
                      </Badge>
                    )}
                    {isUpgrade && canSelect && (
                      <ArrowUp className="h-5 w-5 text-green-600" />
                    )}
                    {isDowngrade && canSelect && (
                      <ArrowDown className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {tier.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        {benefit}
                      </li>
                    ))}
                    {tier.benefits.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{tier.benefits.length - 3} more benefits
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Migration Details */}
      <AnimatePresence>
        {showComparison && currentMigrationDetails && selectedTierInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {currentMigrationDetails.direction === 'upgrade' ? 'Upgrade' : 'Downgrade'} Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tier Comparison */}
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2",
                      currentTierInfo?.color
                    )}>
                      {currentTierInfo && <currentTierInfo.icon className="h-8 w-8 text-white" />}
                    </div>
                    <p className="font-medium">{currentTierInfo?.name}</p>
                    <p className="text-sm text-gray-600">${currentTierInfo?.price}/month</p>
                  </div>
                  
                  <ArrowRight className="h-8 w-8 text-purple-600" />
                  
                  <div className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center mx-auto mb-2",
                      selectedTierInfo.color
                    )}>
                      <selectedTierInfo.icon className="h-8 w-8 text-white" />
                    </div>
                    <p className="font-medium">{selectedTierInfo.name}</p>
                    <p className="text-sm text-gray-600">${selectedTierInfo.price}/month</p>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4 bg-gray-50">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Pricing Impact
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly difference:</span>
                        <span className={cn(
                          "font-medium",
                          currentMigrationDetails.direction === 'upgrade' ? "text-green-600" : "text-orange-600"
                        )}>
                          {currentMigrationDetails.direction === 'upgrade' ? '+' : '-'}
                          ${currentMigrationDetails.priceDifference}
                        </span>
                      </div>
                      {showProration && (
                        <div className="flex justify-between">
                          <span>Proration:</span>
                          <span className={cn(
                            "font-medium",
                            currentMigrationDetails.prorationAmount > 0 ? "text-green-600" : "text-orange-600"
                          )}>
                            {currentMigrationDetails.prorationAmount > 0 ? '+' : ''}
                            ${Math.abs(currentMigrationDetails.prorationAmount).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total today:</span>
                        <span>${Math.abs(currentMigrationDetails.prorationAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gray-50">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Billing Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Activation:</span>
                        <span className="font-medium text-green-600">
                          {currentMigrationDetails.instantActivation ? 'Instant' : 'Next billing cycle'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next billing:</span>
                        <span className="font-medium">
                          {currentMigrationDetails.nextBillingDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>New amount:</span>
                        <span className="font-medium">${selectedTierInfo.price}/month</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Feature Changes */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    What Changes
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {currentMigrationDetails.features.gained && currentMigrationDetails.features.gained.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-2">✓ You'll gain:</p>
                        <ul className="space-y-1">
                          {currentMigrationDetails.features.gained.map((feature, idx) => (
                            <li key={idx} className="text-sm text-green-600 flex items-center gap-1">
                              <Unlock className="h-3 w-3" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {currentMigrationDetails.features.lost && currentMigrationDetails.features.lost.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-2">✗ You'll lose:</p>
                        <ul className="space-y-1">
                          {currentMigrationDetails.features.lost.map((feature, idx) => (
                            <li key={idx} className="text-sm text-red-600 flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {currentMigrationDetails.features.maintained && currentMigrationDetails.features.maintained.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-blue-700 mb-2">→ You'll keep:</p>
                        <ul className="space-y-1">
                          {currentMigrationDetails.features.maintained.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-blue-600 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proration Explanation */}
                {showProration && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">Proration Explanation</p>
                        <p>
                          You'll be {currentMigrationDetails.direction === 'upgrade' ? 'charged' : 'credited'} for 
                          the remaining 15 days at the new tier rate. Your next full billing cycle starts on{' '}
                          {currentMigrationDetails.nextBillingDate.toLocaleDateString()}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleConfirmMigration}
                    className="flex-1"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Confirm {currentMigrationDetails.direction === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowComparison(false);
                      setSelectedTier(null);
                      onCancelMigration?.();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Success */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="border-green-300 bg-green-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  {currentMigrationDetails?.direction === 'upgrade' ? 'Upgrade' : 'Downgrade'} Confirmed!
                </h3>
                <p className="text-green-700 mb-4">
                  Your {selectedTierInfo?.name} tier is now active. 
                  {currentMigrationDetails?.instantActivation && ' You can start enjoying your new benefits immediately.'}
                </p>
                <Button variant="outline" className="border-green-300">
                  <Heart className="h-4 w-4 mr-2" />
                  Explore New Features
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}