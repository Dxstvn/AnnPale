'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  BarChart3,
  Calculator,
  Lightbulb,
  Settings,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OptimizationMetric {
  metric: string;
  current: number;
  optimized: number;
  change: number;
  impact: 'high' | 'medium' | 'low';
}

interface PricingScenario {
  bronze: number;
  silver: number;
  gold: number;
  projectedRevenue: number;
  projectedConversion: number;
  projectedChurn: number;
}

interface PackagingOptimizerProps {
  onOptimizationApply?: (scenario: PricingScenario) => void;
  showAnalytics?: boolean;
  showRecommendations?: boolean;
}

export function PackagingOptimizer({
  onOptimizationApply,
  showAnalytics = true,
  showRecommendations = true
}: PackagingOptimizerProps) {
  // Current pricing
  const [currentPricing, setCurrentPricing] = React.useState<PricingScenario>({
    bronze: 9.99,
    silver: 24.99,
    gold: 49.99,
    projectedRevenue: 28500,
    projectedConversion: 3.5,
    projectedChurn: 3.2
  });

  // Optimization controls
  const [priceElasticity, setPriceElasticity] = React.useState(50); // 0-100
  const [valueEmphasis, setValueEmphasis] = React.useState(70); // 0-100
  const [competitivePosition, setCompetitivePosition] = React.useState(60); // 0-100
  
  // Feature toggles
  const [features, setFeatures] = React.useState({
    annualDiscount: true,
    familyPlan: false,
    studentDiscount: false,
    referralProgram: true,
    pauseOption: true,
    customTier: false
  });

  // Calculate optimized pricing based on controls
  const calculateOptimizedPricing = (): PricingScenario => {
    const elasticityFactor = priceElasticity / 100;
    const valueFactor = valueEmphasis / 100;
    const competitiveFactor = competitivePosition / 100;
    
    // Base adjustments
    const bronzeBase = 9.99;
    const silverBase = 24.99;
    const goldBase = 49.99;
    
    // Apply factors
    const bronzeOptimized = bronzeBase * (1 - elasticityFactor * 0.2 + valueFactor * 0.1);
    const silverOptimized = silverBase * (1 - elasticityFactor * 0.15 + valueFactor * 0.15 + competitiveFactor * 0.1);
    const goldOptimized = goldBase * (1 - elasticityFactor * 0.1 + valueFactor * 0.2 + competitiveFactor * 0.15);
    
    // Calculate projected metrics
    const avgPrice = (bronzeOptimized * 0.35 + silverOptimized * 0.52 + goldOptimized * 0.13);
    const conversionBoost = (100 - priceElasticity) / 100 * 0.5 + valueFactor * 0.3;
    const churnReduction = features.pauseOption ? 0.3 : 0;
    
    return {
      bronze: Math.round(bronzeOptimized * 100) / 100,
      silver: Math.round(silverOptimized * 100) / 100,
      gold: Math.round(goldOptimized * 100) / 100,
      projectedRevenue: Math.round(avgPrice * 1200 * (1 + conversionBoost)),
      projectedConversion: Math.round((3.5 * (1 + conversionBoost)) * 10) / 10,
      projectedChurn: Math.round((3.2 * (1 - churnReduction)) * 10) / 10
    };
  };

  const optimizedPricing = calculateOptimizedPricing();

  // Optimization metrics
  const optimizationMetrics: OptimizationMetric[] = [
    {
      metric: 'Monthly Revenue',
      current: currentPricing.projectedRevenue,
      optimized: optimizedPricing.projectedRevenue,
      change: ((optimizedPricing.projectedRevenue - currentPricing.projectedRevenue) / currentPricing.projectedRevenue) * 100,
      impact: 'high'
    },
    {
      metric: 'Conversion Rate',
      current: currentPricing.projectedConversion,
      optimized: optimizedPricing.projectedConversion,
      change: ((optimizedPricing.projectedConversion - currentPricing.projectedConversion) / currentPricing.projectedConversion) * 100,
      impact: 'high'
    },
    {
      metric: 'Churn Rate',
      current: currentPricing.projectedChurn,
      optimized: optimizedPricing.projectedChurn,
      change: ((optimizedPricing.projectedChurn - currentPricing.projectedChurn) / currentPricing.projectedChurn) * 100,
      impact: 'medium'
    },
    {
      metric: 'Customer LTV',
      current: 287,
      optimized: Math.round(287 * (1 + (optimizedPricing.projectedConversion - currentPricing.projectedConversion) / 10)),
      change: ((287 * (1 + (optimizedPricing.projectedConversion - currentPricing.projectedConversion) / 10) - 287) / 287) * 100,
      impact: 'high'
    }
  ];

  // A/B test scenarios
  const testScenarios = [
    {
      name: 'Aggressive Entry',
      description: 'Lower Bronze price to increase funnel entry',
      bronze: 6.99,
      silver: 24.99,
      gold: 49.99,
      expectedImpact: '+15% conversion, -5% revenue'
    },
    {
      name: 'Value Focus',
      description: 'Emphasize Silver tier value proposition',
      bronze: 12.99,
      silver: 19.99,
      gold: 49.99,
      expectedImpact: '+8% Silver uptake, +12% revenue'
    },
    {
      name: 'Premium Push',
      description: 'Create larger gap to Gold tier',
      bronze: 9.99,
      silver: 24.99,
      gold: 59.99,
      expectedImpact: '+20% Gold LTV, -3% conversion'
    },
    {
      name: 'Simplified Pricing',
      description: 'Round numbers for psychological impact',
      bronze: 10,
      silver: 25,
      gold: 50,
      expectedImpact: '+2% conversion, neutral revenue'
    }
  ];

  const handleFeatureToggle = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Packaging Optimizer</h2>
        <p className="text-gray-600">
          Fine-tune your subscription tiers for maximum conversion and revenue
        </p>
      </div>

      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Optimization Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Elasticity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Price Elasticity</Label>
              <span className="text-sm font-medium">{priceElasticity}%</span>
            </div>
            <Slider
              value={[priceElasticity]}
              onValueChange={([value]) => setPriceElasticity(value)}
              max={100}
              step={5}
              className="mb-2"
            />
            <p className="text-xs text-gray-500">
              How sensitive are customers to price changes?
            </p>
          </div>

          {/* Value Emphasis */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Value Emphasis</Label>
              <span className="text-sm font-medium">{valueEmphasis}%</span>
            </div>
            <Slider
              value={[valueEmphasis]}
              onValueChange={([value]) => setValueEmphasis(value)}
              max={100}
              step={5}
              className="mb-2"
            />
            <p className="text-xs text-gray-500">
              How much to emphasize value over price?
            </p>
          </div>

          {/* Competitive Position */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Competitive Position</Label>
              <span className="text-sm font-medium">{competitivePosition}%</span>
            </div>
            <Slider
              value={[competitivePosition]}
              onValueChange={([value]) => setCompetitivePosition(value)}
              max={100}
              step={5}
              className="mb-2"
            />
            <p className="text-xs text-gray-500">
              Position relative to competitors (0=cheaper, 100=premium)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label htmlFor={key} className="cursor-pointer">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={() => handleFeatureToggle(key as keyof typeof features)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Optimized Pricing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {['bronze', 'silver', 'gold'].map((tier) => {
              const current = currentPricing[tier as keyof PricingScenario] as number;
              const optimized = optimizedPricing[tier as keyof PricingScenario] as number;
              const change = ((optimized - current) / current) * 100;
              
              return (
                <div key={tier} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold capitalize mb-2">{tier}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Current</span>
                      <div className="text-lg">${current}</div>
                    </div>
                    <div className="flex justify-center">
                      {change > 0 ? (
                        <ArrowUp className="h-4 w-4 text-red-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Optimized</span>
                      <div className="text-xl font-bold text-purple-600">${optimized}</div>
                    </div>
                    <Badge variant={change > 0 ? "destructive" : "secondary"} className="text-xs">
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Impact */}
      {showAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Projected Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizationMetrics.map((metric) => (
                <div key={metric.metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{metric.metric}</span>
                      <Badge className={cn("text-xs", getImpactColor(metric.impact))}>
                        {metric.impact} impact
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="text-gray-500">
                        Current: {typeof metric.current === 'number' && metric.metric.includes('Rate') 
                          ? `${metric.current}%` 
                          : metric.metric.includes('Revenue') || metric.metric.includes('LTV')
                          ? `$${metric.current.toLocaleString()}`
                          : metric.current}
                      </span>
                      <span className="text-purple-600 font-medium">
                        Optimized: {typeof metric.optimized === 'number' && metric.metric.includes('Rate')
                          ? `${metric.optimized}%`
                          : metric.metric.includes('Revenue') || metric.metric.includes('LTV')
                          ? `$${metric.optimized.toLocaleString()}`
                          : metric.optimized}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "text-xl font-bold",
                    metric.change > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* A/B Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            A/B Test Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {testScenarios.map((scenario) => (
              <div key={scenario.name} className="p-4 border rounded-lg hover:shadow-md transition-all">
                <h4 className="font-semibold mb-1">{scenario.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <Badge variant="outline">B: ${scenario.bronze}</Badge>
                  <Badge variant="outline">S: ${scenario.silver}</Badge>
                  <Badge variant="outline">G: ${scenario.gold}</Badge>
                </div>
                <p className="text-xs text-purple-600 font-medium">{scenario.expectedImpact}</p>
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
              <Lightbulb className="h-5 w-5" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Implement Annual Pricing</h4>
                  <p className="text-xs text-gray-600">
                    Offer 2 months free on annual plans to improve retention and cash flow
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Test Silver Price Point</h4>
                  <p className="text-xs text-gray-600">
                    Current Silver tier may be underpriced - test $29.99 price point
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Add Pause Option</h4>
                  <p className="text-xs text-gray-600">
                    Reduce churn by 30% by allowing temporary subscription pauses
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apply Optimization */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Projected Monthly Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                ${optimizedPricing.projectedRevenue.toLocaleString()}
              </p>
            </div>
            <Button 
              size="lg"
              onClick={() => onOptimizationApply?.(optimizedPricing)}
            >
              Apply Optimization
              <Calculator className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            Changes will be tested with 10% of new users first
          </p>
        </CardContent>
      </Card>
    </div>
  );
}