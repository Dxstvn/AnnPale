'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DiscoveryStep } from './discovery-step';
import { EducationStep } from './education-step';
import { SelectionStep } from './selection-step';
import { AccountSetupStep } from './account-setup-step';
import { ConfirmationActivationStep } from './confirmation-activation-step';
import { motion, AnimatePresence } from 'framer-motion';

export type OnboardingStep = 
  | 'discovery' 
  | 'education' 
  | 'selection' 
  | 'account-setup' 
  | 'confirmation';

interface OnboardingFlowProps {
  creatorName?: string;
  subscriberCount?: number;
  initialStep?: OnboardingStep;
  onComplete?: (data: any) => void;
  onStepChange?: (step: OnboardingStep, data?: any) => void;
  isNewUser?: boolean;
}

export function OnboardingFlow({
  creatorName = 'Creator',
  subscriberCount = 5234,
  initialStep = 'discovery',
  onComplete,
  onStepChange,
  isNewUser = true
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = React.useState<OnboardingStep>(initialStep);
  const [flowData, setFlowData] = React.useState<any>({
    tier: 'silver',
    billingCycle: 'monthly',
    addOns: [],
    isGift: false,
    promoCode: undefined,
    accountData: null,
    selectionData: null
  });

  const handleStepTransition = (nextStep: OnboardingStep, data?: any) => {
    if (data) {
      setFlowData(prev => ({ ...prev, ...data }));
    }
    setCurrentStep(nextStep);
    onStepChange?.(nextStep, data);
  };

  const handleDiscoveryContinue = () => {
    handleStepTransition('education');
  };

  const handleDiscoveryLearnMore = () => {
    handleStepTransition('education');
  };

  const handleEducationContinue = () => {
    handleStepTransition('selection');
  };

  const handleEducationBack = () => {
    handleStepTransition('discovery');
  };

  const handleSelectionContinue = (selectionData: any) => {
    handleStepTransition('account-setup', { selectionData });
  };

  const handleSelectionBack = () => {
    handleStepTransition('education');
  };

  const handleAccountSetupContinue = (accountData: any) => {
    handleStepTransition('confirmation', { accountData });
  };

  const handleAccountSetupBack = () => {
    handleStepTransition('selection');
  };

  const handleComplete = () => {
    onComplete?.(flowData);
  };

  const handleExplore = () => {
    onComplete?.(flowData);
  };

  const getTierIcon = () => {
    if (flowData.selectionData?.tier === 'bronze') return Shield;
    if (flowData.selectionData?.tier === 'gold') return Crown;
    return Star;
  };

  const getOrderSummary = () => {
    if (!flowData.selectionData) return null;
    
    const tierPrices = {
      bronze: { monthly: 9.99, annual: 99.90 },
      silver: { monthly: 24.99, annual: 249.90 },
      gold: { monthly: 49.99, annual: 499.90 }
    };
    
    const tier = flowData.selectionData.tier;
    const billingCycle = flowData.selectionData.billingCycle;
    const price = billingCycle === 'monthly' 
      ? tierPrices[tier].monthly 
      : tierPrices[tier].annual / 12;
    
    return {
      tier: tier.charAt(0).toUpperCase() + tier.slice(1),
      price: parseFloat(price.toFixed(2)),
      billingCycle
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'discovery' && (
              <DiscoveryStep
                creatorName={creatorName}
                subscriberCount={subscriberCount}
                onContinue={handleDiscoveryContinue}
                onLearnMore={handleDiscoveryLearnMore}
                showPreview={true}
              />
            )}

            {currentStep === 'education' && (
              <EducationStep
                onContinue={handleEducationContinue}
                onBack={handleEducationBack}
                showCalculator={true}
                showTestimonials={true}
              />
            )}

            {currentStep === 'selection' && (
              <SelectionStep
                onContinue={handleSelectionContinue}
                onBack={handleSelectionBack}
                defaultTier={flowData.tier}
                showAddOns={true}
              />
            )}

            {currentStep === 'account-setup' && (
              <AccountSetupStep
                onContinue={handleAccountSetupContinue}
                onBack={handleAccountSetupBack}
                isNewUser={isNewUser}
                orderSummary={getOrderSummary()}
              />
            )}

            {currentStep === 'confirmation' && (
              <ConfirmationActivationStep
                onComplete={handleComplete}
                onExplore={handleExplore}
                tierName={flowData.selectionData?.tier ? 
                  flowData.selectionData.tier.charAt(0).toUpperCase() + flowData.selectionData.tier.slice(1) : 
                  'Silver'}
                tierIcon={getTierIcon()}
                creatorName={creatorName}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Add missing imports
import { Shield, Star, Crown } from 'lucide-react';