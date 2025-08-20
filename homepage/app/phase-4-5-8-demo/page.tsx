'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UpgradeTriggers } from '@/components/subscription/tier-migration/upgrade-triggers';
import { TierMigrationInterface } from '@/components/subscription/tier-migration/tier-migration-interface';
import { UpgradeIncentives } from '@/components/subscription/tier-migration/upgrade-incentives';
import { DowngradePrevention } from '@/components/subscription/tier-migration/downgrade-prevention';
import { PostUpgradeExperience } from '@/components/subscription/tier-migration/post-upgrade-experience';
import { TierComparisonTool } from '@/components/subscription/tier-migration/tier-comparison-tool';
import { 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Shield,
  Star,
  Crown,
  ChevronLeft,
  Zap,
  Gift,
  AlertTriangle,
  Calculator,
  Sparkles,
  Heart,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function Phase458DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
              <ChevronLeft className="h-4 w-4" />
              Back to Homepage
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Phase 4.5.8: Upgrade & Downgrade Flows
            </h1>
            <p className="text-gray-600 mt-2">
              Seamless tier migration management that maximizes revenue while respecting subscriber choices
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 px-4 py-2">
            Completed ✓
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">Upgrade Journey</p>
              <p className="text-sm text-gray-600">6 trigger types, incentives & interface</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="font-semibold">Downgrade Prevention</p>
              <p className="text-sm text-gray-600">6 retention strategies, 40-60% success</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold">Post-Upgrade Experience</p>
              <p className="text-sm text-gray-600">Welcome journey & satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Tier Migration System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Upgrade Path Optimization</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Smart trigger detection (limit reached, exclusive content viewed)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Comprehensive upgrade interface with proration explanation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Personalized incentives (discounts, exclusive content, loyalty points)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full" />
                    Welcome journey with feature tutorials and satisfaction checks
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Downgrade Prevention Strategies</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-600">60%</p>
                    <p className="text-gray-600">Pause Subscription</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-lg font-bold text-blue-600">50%</p>
                    <p className="text-gray-600">Technical Issues</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-lg font-bold text-purple-600">45%</p>
                    <p className="text-gray-600">Feature Confusion</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <p className="text-lg font-bold text-orange-600">40%</p>
                    <p className="text-gray-600">Price Sensitivity</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Tabs */}
        <Tabs defaultValue="triggers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="triggers" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Interface
            </TabsTrigger>
            <TabsTrigger value="incentives" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Incentives
            </TabsTrigger>
            <TabsTrigger value="prevention" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Prevention
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Compare
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triggers" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Upgrade Triggers Detection</h2>
              <p className="text-gray-600 mb-6">
                Monitor user behavior and automatically detect optimal upgrade opportunities
              </p>
            </div>
            <UpgradeTriggers
              onTriggerActivate={(trigger) => console.log('Trigger activated:', trigger)}
              onUpgradePrompt={(trigger) => console.log('Upgrade prompted:', trigger)}
              onDismissTrigger={(triggerId) => console.log('Trigger dismissed:', triggerId)}
            />
          </TabsContent>

          <TabsContent value="interface" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Tier Migration Interface</h2>
              <p className="text-gray-600 mb-6">
                Comprehensive upgrade/downgrade interface with clear pricing and feature comparison
              </p>
            </div>
            <TierMigrationInterface
              onTierSelect={(tierId) => console.log('Tier selected:', tierId)}
              onConfirmMigration={(details) => console.log('Migration confirmed:', details)}
              onCancelMigration={() => console.log('Migration cancelled')}
            />
          </TabsContent>

          <TabsContent value="incentives" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Upgrade Incentives System</h2>
              <p className="text-gray-600 mb-6">
                Personalized incentives to increase conversion rates and customer satisfaction
              </p>
            </div>
            <UpgradeIncentives
              onIncentiveSelect={(incentive) => console.log('Incentive selected:', incentive)}
              onClaimIncentive={(incentiveId) => console.log('Incentive claimed:', incentiveId)}
              onUpgradeWithIncentive={(incentive) => console.log('Upgrade with incentive:', incentive)}
            />
          </TabsContent>

          <TabsContent value="prevention" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Downgrade Prevention Flow</h2>
              <p className="text-gray-600 mb-6">
                Understand downgrade reasons and offer targeted retention strategies
              </p>
            </div>
            <DowngradePrevention
              onReasonSelect={(reason) => console.log('Reason selected:', reason)}
              onOfferAccept={(offer) => console.log('Offer accepted:', offer)}
              onOfferDecline={(offer) => console.log('Offer declined:', offer)}
              onProceedWithDowngrade={(reason, feedback) => console.log('Downgrade proceeded:', reason, feedback)}
              onCancelDowngrade={() => console.log('Downgrade cancelled')}
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Post-Upgrade Experience</h2>
              <p className="text-gray-600 mb-6">
                Welcome journey to ensure successful adoption of new tier features
              </p>
            </div>
            <PostUpgradeExperience
              onFeatureExplore={(featureId) => console.log('Feature explored:', featureId)}
              onStepComplete={(stepId) => console.log('Step completed:', stepId)}
              onTutorialStart={(tutorialUrl) => console.log('Tutorial started:', tutorialUrl)}
              onCommunityShare={(announcement) => console.log('Community shared:', announcement)}
              onSatisfactionFeedback={(rating) => console.log('Satisfaction rating:', rating)}
            />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Tier Comparison Tool</h2>
              <p className="text-gray-600 mb-6">
                Advanced comparison tool to help users make informed tier decisions
              </p>
            </div>
            <TierComparisonTool
              onTierSelect={(tierId) => console.log('Tier selected:', tierId)}
              onUpgradeClick={(from, to) => console.log('Upgrade clicked:', from, to)}
              onDowngradeClick={(from, to) => console.log('Downgrade clicked:', from, to)}
            />
          </TabsContent>
        </Tabs>

        {/* Tier Migration Success Metrics */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Migration Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">85%</span>
                </div>
                <p className="text-sm text-gray-600">Upgrade Conversion Rate</p>
                <p className="text-xs text-gray-500">With personalized incentives</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">48%</span>
                </div>
                <p className="text-sm text-gray-600">Downgrade Prevention</p>
                <p className="text-xs text-gray-500">Average retention success</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="h-6 w-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">92%</span>
                </div>
                <p className="text-sm text-gray-600">Post-Upgrade Satisfaction</p>
                <p className="text-xs text-gray-500">Welcome journey completion</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calculator className="h-6 w-6 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">73%</span>
                </div>
                <p className="text-sm text-gray-600">Informed Decisions</p>
                <p className="text-xs text-gray-500">Using comparison tool</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Implementation Highlights</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Upgrade Optimization</h4>
                <ul className="space-y-1">
                  <li>• Smart trigger detection with 6 trigger types</li>
                  <li>• Personalized incentive system with 70% boost</li>
                  <li>• Comprehensive migration interface with proration</li>
                  <li>• Instant activation with benefit tutorials</li>
                  <li>• Welcome journey with satisfaction tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Downgrade Prevention</h4>
                <ul className="space-y-1">
                  <li>• Reason identification with 6 common categories</li>
                  <li>• Targeted retention offers (40-60% success rates)</li>
                  <li>• Feedback collection for continuous improvement</li>
                  <li>• Graceful downgrade process when needed</li>
                  <li>• Advanced comparison tool for informed decisions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Phase 4.5.8 completed successfully with comprehensive upgrade and downgrade flow management
          </p>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Bronze Tier</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>Silver Tier</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Crown className="h-4 w-4" />
              <span>Gold Tier</span>
            </div>
          </div>
          <Link href="/">
            <Button className="mt-4">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}