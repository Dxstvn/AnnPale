'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Zap,
  Heart,
  Trophy,
  Gift,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Info,
  Play,
  BarChart3,
  Calculator,
  Lightbulb
} from 'lucide-react';
import { SubscriptionEconomicsLayout } from '@/components/subscription/psychology/subscription-economics-layout';

export default function Phase451Demo() {
  const [activeDemo, setActiveDemo] = React.useState('overview');

  const demoSections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Subscription psychology introduction',
      icon: Brain
    },
    {
      id: 'live',
      title: 'Live Demo',
      description: 'Interactive psychology dashboard',
      icon: Play
    }
  ];

  const psychologyFactors = [
    {
      factor: 'Loss Aversion',
      impact: 'High',
      description: 'Fear of missing out on exclusive content',
      example: 'Limited-time offers, expiring benefits',
      icon: Clock,
      color: 'text-red-600 bg-red-100'
    },
    {
      factor: 'Social Proof',
      impact: 'High',
      description: 'Following community behavior patterns',
      example: '10,000+ subscribers, testimonials',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      factor: 'Reciprocity',
      impact: 'Medium',
      description: 'Obligation from free value received',
      example: 'Free trials, sample content',
      icon: Gift,
      color: 'text-green-600 bg-green-100'
    },
    {
      factor: 'Commitment',
      impact: 'High',
      description: 'Consistency with past behavior',
      example: 'Progress tracking, streaks',
      icon: Trophy,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      factor: 'Authority',
      impact: 'Medium',
      description: 'Trust in creator expertise',
      example: 'Creator credentials, achievements',
      icon: Shield,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      factor: 'Scarcity',
      impact: 'High',
      description: 'Limited availability increases desire',
      example: 'Exclusive tiers, member limits',
      icon: Sparkles,
      color: 'text-pink-600 bg-pink-100'
    }
  ];

  const economicDrivers = [
    {
      driver: 'Unit Economics',
      metric: 'CAC:LTV Ratio',
      value: '1:3.2',
      status: 'healthy',
      description: 'Customer acquisition cost vs lifetime value'
    },
    {
      driver: 'Pricing Elasticity',
      metric: 'Optimal Price Point',
      value: '$29/mo',
      status: 'optimized',
      description: 'Maximum revenue per subscriber'
    },
    {
      driver: 'Churn Economics',
      metric: 'Monthly Churn',
      value: '3.2%',
      status: 'improving',
      description: 'Percentage of subscribers canceling'
    },
    {
      driver: 'Expansion Revenue',
      metric: 'Upgrade Rate',
      value: '18%',
      status: 'growing',
      description: 'Subscribers moving to higher tiers'
    },
    {
      driver: 'Cohort Performance',
      metric: '6-Month Retention',
      value: '52%',
      status: 'stable',
      description: 'Subscribers active after 6 months'
    }
  ];

  const implementedComponents = [
    'Subscriber persona journey mapping',
    'Subscription value ladder visualization',
    'Pricing psychology dashboard',
    'Conversion triggers analysis',
    'Retention drivers assessment',
    'Subscription economics unified layout'
  ];

  const keyInsights = [
    {
      insight: 'Emotional Drivers',
      finding: 'Creator connection drives 82% retention impact',
      action: 'Enhance personal interaction features',
      icon: Heart
    },
    {
      insight: 'Value Perception',
      finding: 'Exclusive content has highest perceived value',
      action: 'Emphasize uniqueness in marketing',
      icon: Target
    },
    {
      insight: 'Pricing Sweet Spot',
      finding: '$29/month optimizes revenue and retention',
      action: 'Test tiered pricing around this point',
      icon: DollarSign
    },
    {
      insight: 'Trigger Timing',
      finding: 'Day 3-5 critical for conversion',
      action: 'Deploy targeted campaigns in this window',
      icon: Zap
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Subscription Psychology & Economics
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Phase 4.5.1: Understanding the psychological and economic drivers that 
              influence subscription decisions and lifetime value.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
                Sikoloji Abònman
              </Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-sm px-4 py-2">
                Psychology-Driven Growth
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Psychology Factors */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Psychological Factors</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {psychologyFactors.map((factor) => {
            const Icon = factor.icon;
            return (
              <Card key={factor.factor} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${factor.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {factor.factor}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                  <p className="text-xs text-gray-500 italic mb-3">{factor.example}</p>
                  <Badge className={
                    factor.impact === 'High' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }>
                    {factor.impact} Impact
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Economic Drivers */}
      <Card>
        <CardHeader>
          <CardTitle>Economic Performance Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Driver</th>
                  <th className="text-left py-2">Metric</th>
                  <th className="text-left py-2">Value</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {economicDrivers.map((driver) => (
                  <tr key={driver.driver} className="border-b">
                    <td className="py-2 font-medium">{driver.driver}</td>
                    <td className="py-2 text-sm text-gray-600">{driver.metric}</td>
                    <td className="py-2 font-bold text-purple-600">{driver.value}</td>
                    <td className="py-2">
                      <Badge variant="secondary" className={
                        driver.status === 'healthy' ? 'bg-green-100 text-green-700' :
                        driver.status === 'optimized' ? 'bg-blue-100 text-blue-700' :
                        driver.status === 'improving' ? 'bg-yellow-100 text-yellow-700' :
                        driver.status === 'growing' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {driver.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-sm text-gray-600">{driver.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Key Psychological Insights</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {keyInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.insight} className="hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{insight.insight}</h3>
                      <p className="text-sm text-gray-600 mb-2">{insight.finding}</p>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs font-medium text-gray-700">{insight.action}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Interactive Psychology Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Explore the full subscription psychology and economics dashboard with 
            persona mapping, value ladders, pricing optimization, and retention analysis.
          </p>
          <Button
            size="lg"
            className="w-full"
            onClick={() => setActiveDemo('live')}
          >
            Launch Psychology Dashboard
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Implementation Complete */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Implementation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Completed Components:</h4>
              <div className="space-y-2">
                {implementedComponents.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Key Features:</h4>
              <div className="space-y-2">
                {[
                  '6 subscriber personas with journey mapping',
                  '5-stage value ladder visualization',
                  '6 psychological pricing factors',
                  '6 conversion triggers with sequences',
                  '6 retention drivers with churn analysis',
                  'Unified economics dashboard'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLiveDemo = () => (
    <div className="space-y-4">
      {/* Demo Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Subscription Psychology Dashboard</h2>
              <p className="text-gray-600">Analyze psychological and economic drivers</p>
            </div>
            <Button variant="outline" onClick={() => setActiveDemo('overview')}>
              Back to Overview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Psychology Dashboard */}
      <SubscriptionEconomicsLayout
        userId="demo-user"
        isAdmin={true}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {demoSections.map((section) => (
              <Button
                key={section.id}
                variant={activeDemo === section.id ? 'default' : 'outline'}
                onClick={() => setActiveDemo(section.id)}
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeDemo === 'overview' ? renderOverview() : renderLiveDemo()}
      </div>
    </div>
  );
}