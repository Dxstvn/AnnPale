'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EngagementMetrics } from '@/components/subscription/retention/engagement-metrics';
import { BehavioralPatterns } from '@/components/subscription/retention/behavioral-patterns';
import { LifecycleStages } from '@/components/subscription/retention/lifecycle-stages';
import { InterventionTriggers } from '@/components/subscription/retention/intervention-triggers';
import { RetentionStrategies } from '@/components/subscription/retention/retention-strategies';
import { 
  Shield,
  TrendingUp,
  Users,
  AlertTriangle,
  Target,
  ChevronLeft,
  BarChart3,
  Activity,
  Brain,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function Phase457DemoPage() {
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
              Phase 4.5.7: Retention & Churn Prevention
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive subscriber lifecycle management and proactive churn prevention system
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 px-4 py-2">
            Completed ✓
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold">Engagement Metrics</p>
              <p className="text-sm text-gray-600">6 metric categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold">Behavioral Patterns</p>
              <p className="text-sm text-gray-600">8 pattern types</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold">Lifecycle Stages</p>
              <p className="text-sm text-gray-600">6 distinct phases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="font-semibold">Intervention Triggers</p>
              <p className="text-sm text-gray-600">6 trigger types</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Retention System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Real-time engagement monitoring across 6 metric categories
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Behavioral pattern analysis with churn prediction
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Subscriber lifecycle tracking from honeymoon to veteran
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    Automated intervention triggers for at-risk accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Retention strategies matrix with success rate tracking
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Success Metrics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-2xl font-bold text-green-600">85%</p>
                    <p className="text-gray-600">Avg Retention Rate</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-2xl font-bold text-blue-600">65%</p>
                    <p className="text-gray-600">Early Detection</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-2xl font-bold text-purple-600">40%</p>
                    <p className="text-gray-600">Critical Recovery</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <p className="text-2xl font-bold text-orange-600">20%</p>
                    <p className="text-gray-600">Win-back Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Tabs */}
        <Tabs defaultValue="engagement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="lifecycle" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lifecycle
            </TabsTrigger>
            <TabsTrigger value="triggers" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="strategies" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Strategies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Engagement Metrics Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Monitor subscriber engagement across 6 key metric categories with real-time alerts
              </p>
            </div>
            <EngagementMetrics
              onMetricClick={(metric) => console.log('Metric clicked:', metric)}
              onAlertTrigger={(metric) => console.log('Alert triggered:', metric)}
            />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Behavioral Pattern Analysis</h2>
              <p className="text-gray-600 mb-6">
                AI-powered analysis of user behavior patterns with churn prediction capabilities
              </p>
            </div>
            <BehavioralPatterns
              onPatternClick={(pattern) => console.log('Pattern clicked:', pattern)}
              onInsightAction={(insight) => console.log('Insight action:', insight)}
            />
          </TabsContent>

          <TabsContent value="lifecycle" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Subscriber Lifecycle Management</h2>
              <p className="text-gray-600 mb-6">
                Track subscriber journey through 6 distinct lifecycle stages with targeted interventions
              </p>
            </div>
            <LifecycleStages
              onStageAction={(stage, action) => console.log('Stage action:', stage, action)}
              onInterventionTrigger={(intervention) => console.log('Intervention trigger:', intervention)}
            />
          </TabsContent>

          <TabsContent value="triggers" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Intervention Triggers System</h2>
              <p className="text-gray-600 mb-6">
                Automated intervention system with 6 trigger types for proactive churn prevention
              </p>
            </div>
            <InterventionTriggers
              onTriggerActivate={(trigger) => console.log('Trigger activated:', trigger)}
              onTriggerConfigure={(trigger) => console.log('Trigger configured:', trigger)}
              onManualIntervention={(type) => console.log('Manual intervention:', type)}
            />
          </TabsContent>

          <TabsContent value="strategies" className="space-y-4">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Retention Strategies Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Comprehensive retention strategies matrix with success rate tracking and campaign management
              </p>
            </div>
            <RetentionStrategies
              onStrategySelect={(strategy) => console.log('Strategy selected:', strategy)}
              onCampaignCreate={(strategy) => console.log('Campaign created:', strategy)}
              onStrategyTest={(strategy) => console.log('Strategy tested:', strategy)}
            />
          </TabsContent>
        </Tabs>

        {/* Implementation Notes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Implementation Highlights</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Technical Features</h4>
                <ul className="space-y-1">
                  <li>• Real-time metric monitoring with threshold alerts</li>
                  <li>• Predictive churn analysis using behavioral patterns</li>
                  <li>• Automated intervention trigger system</li>
                  <li>• Comprehensive retention strategy framework</li>
                  <li>• Interactive lifecycle stage management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">User Experience</h4>
                <ul className="space-y-1">
                  <li>• Expandable component views with detailed metrics</li>
                  <li>• Color-coded risk levels and status indicators</li>
                  <li>• Smooth animations and responsive design</li>
                  <li>• Actionable insights with intervention recommendations</li>
                  <li>• Performance tracking and success rate monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600">
            Phase 4.5.7 completed successfully with comprehensive retention and churn prevention system
          </p>
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