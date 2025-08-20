'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Calculator,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { SubscriberPersonaJourney } from './subscriber-persona-journey';
import { SubscriptionValueLadder } from './value-ladder';
import { PricingPsychology } from './pricing-psychology';
import { ConversionTriggers } from './conversion-triggers';
import { RetentionDrivers } from './retention-drivers';

interface SubscriptionEconomicsLayoutProps {
  userId?: string;
  isAdmin?: boolean;
  onMetricClick?: (metric: any) => void;
}

export function SubscriptionEconomicsLayout({
  userId,
  isAdmin = false,
  onMetricClick
}: SubscriptionEconomicsLayoutProps) {
  const [activeTab, setActiveTab] = React.useState('personas');

  // Summary metrics
  const summaryMetrics = [
    {
      label: 'Conversion Rate',
      value: '3.5%',
      change: '+0.5%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600'
    },
    {
      label: 'Avg LTV',
      value: '$287',
      change: '+$23',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      label: 'Retention Rate',
      value: '78%',
      change: '+2%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      label: 'Churn Rate',
      value: '3.2%',
      change: '-0.3%',
      trend: 'down',
      icon: Activity,
      color: 'text-orange-600'
    }
  ];

  // Tab configurations
  const tabs = [
    {
      id: 'personas',
      label: 'Personas',
      icon: Users,
      description: 'Subscriber profiles and journeys'
    },
    {
      id: 'value-ladder',
      label: 'Value Ladder',
      icon: TrendingUp,
      description: 'Progressive value stages'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      icon: DollarSign,
      description: 'Psychology and optimization'
    },
    {
      id: 'triggers',
      label: 'Triggers',
      icon: Zap,
      description: 'Conversion catalysts'
    },
    {
      id: 'retention',
      label: 'Retention',
      icon: BarChart3,
      description: 'Drivers and churn analysis'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Psychology & Economics</h1>
          <p className="text-gray-600">
            Understanding the psychological and economic drivers of subscription success
          </p>
        </div>
        {isAdmin && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Admin View
          </Badge>
        )}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={metric.label}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => onMetricClick?.(metric)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className={`text-xs mt-1 ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' && metric.label === 'Churn Rate' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {metric.change} from last month
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${metric.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Psychology Score Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Subscription Psychology Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-purple-600">82/100</div>
              <p className="text-sm text-gray-600 mt-1">
                Overall psychological optimization score
              </p>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm text-gray-600">Persona Alignment</span>
                <Badge className="bg-green-100 text-green-700">Strong</Badge>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm text-gray-600">Value Perception</span>
                <Badge className="bg-blue-100 text-blue-700">High</Badge>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm text-gray-600">Trigger Effectiveness</span>
                <Badge className="bg-yellow-100 text-yellow-700">Moderate</Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {['Personas', 'Value', 'Pricing', 'Triggers', 'Retention'].map((category, idx) => (
              <div key={category} className="text-center">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                    style={{ width: `${75 + idx * 5}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analysis Components</CardTitle>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                Interactive analysis tools for subscription optimization
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="personas" className="mt-6">
              <SubscriberPersonaJourney 
                showMetrics={true}
                showRecommendations={true}
              />
            </TabsContent>

            <TabsContent value="value-ladder" className="mt-6">
              <SubscriptionValueLadder
                showMetrics={true}
                showPathways={true}
              />
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <PricingPsychology
                showAnalytics={true}
                showRecommendations={true}
              />
            </TabsContent>

            <TabsContent value="triggers" className="mt-6">
              <ConversionTriggers
                showAnalytics={true}
                showOptimization={true}
              />
            </TabsContent>

            <TabsContent value="retention" className="mt-6">
              <RetentionDrivers
                showCohorts={true}
                showStrategies={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  LTV Calculator
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Cohort Analysis
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  A/B Test Results
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}