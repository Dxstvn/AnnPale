'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Sparkles,
  Brain,
  Eye,
  Star,
  Award,
  RefreshCw,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ForecastData {
  period: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  metric: string;
  current: number;
  conservative: number;
  realistic: number;
  optimistic: number;
  confidence: number;
  factors: string[];
  trend: 'up' | 'down' | 'stable';
}

interface PredictiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  probability: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  action: string;
  priority: number;
  confidence: number;
}

interface ScenarioAnalysis {
  scenario: string;
  description: string;
  probability: number;
  revenue_impact: number;
  subscriber_impact: number;
  key_factors: string[];
  mitigation_strategies?: string[];
}

interface ForecastingInsightsProps {
  forecasts?: ForecastData[];
  insights?: PredictiveInsight[];
  scenarios?: ScenarioAnalysis[];
  timeRange?: string;
  onForecastUpdate?: (forecast: ForecastData) => void;
  onInsightAction?: (insightId: string) => void;
  onScenarioSelect?: (scenario: ScenarioAnalysis) => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ForecastingInsights({
  forecasts = [],
  insights = [],
  scenarios = [],
  timeRange = '90d',
  onForecastUpdate,
  onInsightAction,
  onScenarioSelect,
  onRefresh,
  onExport
}: ForecastingInsightsProps) {
  const [selectedScenario, setSelectedScenario] = React.useState<string>('realistic');
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<string>('month');
  const [expandedInsight, setExpandedInsight] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default forecast data
  const defaultForecasts: ForecastData[] = forecasts.length > 0 ? forecasts : [
    {
      period: 'Next Month',
      timeframe: 'month',
      metric: 'Monthly Recurring Revenue',
      current: 12450,
      conservative: 13200,
      realistic: 14100,
      optimistic: 15300,
      confidence: 85,
      factors: ['Seasonal trends', 'New subscriber growth', 'Tier upgrade rates'],
      trend: 'up'
    },
    {
      period: 'Next Quarter',
      timeframe: 'quarter',
      metric: 'Total Subscribers',
      current: 1247,
      conservative: 1380,
      realistic: 1520,
      optimistic: 1680,
      confidence: 78,
      factors: ['Marketing campaigns', 'Referral programs', 'Content quality'],
      trend: 'up'
    },
    {
      period: 'Next Year',
      timeframe: 'year',
      metric: 'Annual Recurring Revenue',
      current: 149400,
      conservative: 180000,
      realistic: 210000,
      optimistic: 250000,
      confidence: 65,
      factors: ['Market expansion', 'Feature development', 'Competition'],
      trend: 'up'
    },
    {
      period: 'Next Month',
      timeframe: 'month',
      metric: 'Churn Rate',
      current: 4.2,
      conservative: 3.8,
      realistic: 3.2,
      optimistic: 2.8,
      confidence: 72,
      factors: ['Retention campaigns', 'Content satisfaction', 'Price sensitivity'],
      trend: 'down'
    },
    {
      period: 'Next Quarter',
      timeframe: 'quarter',
      metric: 'Customer Lifetime Value',
      current: 186.40,
      conservative: 195.00,
      realistic: 215.00,
      optimistic: 240.00,
      confidence: 80,
      factors: ['Engagement improvements', 'Tier migration', 'Feature adoption'],
      trend: 'up'
    }
  ];

  // Default predictive insights
  const defaultInsights: PredictiveInsight[] = insights.length > 0 ? insights : [
    {
      id: 'insight_1',
      type: 'opportunity',
      title: 'Bronze Tier Upgrade Wave Predicted',
      description: 'Analysis indicates 18-25% of Bronze subscribers will likely upgrade within next 2 months based on engagement patterns',
      probability: 78,
      impact: 'high',
      timeframe: '2 months',
      action: 'Launch targeted upgrade campaign with personalized incentives',
      priority: 1,
      confidence: 82
    },
    {
      id: 'insight_2',
      type: 'risk',
      title: 'Seasonal Churn Risk in Q4',
      description: 'Historical data suggests 15% higher churn rate during holiday season, particularly in Bronze tier',
      probability: 65,
      impact: 'medium',
      timeframe: '3 months',
      action: 'Implement holiday retention strategy and special offers',
      priority: 2,
      confidence: 71
    },
    {
      id: 'insight_3',
      type: 'trend',
      title: 'Content Consumption Shift Detected',
      description: 'Behind-the-scenes content showing 35% higher engagement, indicating viewer preference evolution',
      probability: 88,
      impact: 'medium',
      timeframe: '1 month',
      action: 'Increase behind-the-scenes content production by 40%',
      priority: 3,
      confidence: 89
    },
    {
      id: 'insight_4',
      type: 'recommendation',
      title: 'Optimal Price Point Identified',
      description: 'Price elasticity analysis suggests Silver tier could support 8-12% increase without significant churn',
      probability: 72,
      impact: 'high',
      timeframe: '6 weeks',
      action: 'Conduct A/B test with 10% price increase for new Silver subscribers',
      priority: 4,
      confidence: 75
    },
    {
      id: 'insight_5',
      type: 'opportunity',
      title: 'Mobile Engagement Surge',
      description: 'Mobile usage up 45% with higher session times, indicating opportunity for mobile-specific features',
      probability: 91,
      impact: 'medium',
      timeframe: '2 weeks',
      action: 'Prioritize mobile app enhancements and push notifications',
      priority: 5,
      confidence: 93
    }
  ];

  // Default scenario analysis
  const defaultScenarios: ScenarioAnalysis[] = scenarios.length > 0 ? scenarios : [
    {
      scenario: 'Best Case',
      description: 'All growth initiatives succeed, minimal churn, strong market conditions',
      probability: 25,
      revenue_impact: 35,
      subscriber_impact: 42,
      key_factors: [
        'New feature adoption exceeds expectations',
        'Referral program drives 30% of new signups',
        'Premium tier uptake surpasses projections',
        'Market expansion successful'
      ]
    },
    {
      scenario: 'Realistic',
      description: 'Expected performance based on current trends and planned initiatives',
      probability: 50,
      revenue_impact: 18,
      subscriber_impact: 22,
      key_factors: [
        'Steady organic growth continues',
        'Tier migration rates remain stable',
        'Content quality drives retention',
        'Competitive landscape unchanged'
      ]
    },
    {
      scenario: 'Conservative',
      description: 'Slower growth due to market headwinds or execution challenges',
      probability: 20,
      revenue_impact: 8,
      subscriber_impact: 12,
      key_factors: [
        'Market saturation increases',
        'Economic pressures affect discretionary spending',
        'Competition intensifies',
        'Content production challenges'
      ],
      mitigation_strategies: [
        'Focus on retention over acquisition',
        'Optimize pricing strategy',
        'Enhance value proposition',
        'Streamline operations'
      ]
    },
    {
      scenario: 'Stress Test',
      description: 'Significant challenges requiring defensive strategies',
      probability: 5,
      revenue_impact: -5,
      subscriber_impact: -8,
      key_factors: [
        'Major competitor launches similar platform',
        'Economic downturn affects target market',
        'Technical issues impact user experience',
        'Key creator departures'
      ],
      mitigation_strategies: [
        'Activate emergency retention protocols',
        'Implement cost reduction measures',
        'Accelerate product differentiation',
        'Strengthen creator relationships'
      ]
    }
  ];

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  // Get insight type icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Star;
      case 'risk': return AlertTriangle;
      case 'trend': return TrendingUp;
      case 'recommendation': return Lightbulb;
      default: return Info;
    }
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate weighted forecast
  const getWeightedForecast = (forecast: ForecastData) => {
    return Math.round(
      (forecast.conservative * 0.2) + 
      (forecast.realistic * 0.6) + 
      (forecast.optimistic * 0.2)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Forecasting & Insights
          </h1>
          <p className="text-gray-600">
            AI-powered predictions and strategic recommendations for your subscription business
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Predictions Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Key Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                ${defaultForecasts.find(f => f.metric === 'Monthly Recurring Revenue')?.realistic.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Next Month MRR</p>
              <Badge className="text-xs text-green-600 mt-1">
                85% confidence
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {defaultForecasts.find(f => f.metric === 'Total Subscribers')?.realistic.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Q1 Subscribers</p>
              <Badge className="text-xs text-yellow-600 mt-1">
                78% confidence
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {defaultInsights.filter(i => i.type === 'opportunity').length}
              </div>
              <p className="text-sm text-gray-600">Growth Opportunities</p>
              <Badge className="text-xs text-blue-600 mt-1">
                High impact
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {Math.round(defaultInsights.reduce((sum, i) => sum + i.confidence, 0) / defaultInsights.length)}%
              </div>
              <p className="text-sm text-gray-600">Avg Confidence</p>
              <Badge className="text-xs text-green-600 mt-1">
                High accuracy
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Revenue & Growth Forecasts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {defaultForecasts.filter(f => f.timeframe === selectedTimeframe || selectedTimeframe === 'month').map((forecast, index) => {
              const TrendIcon = getTrendIcon(forecast.trend);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{forecast.metric}</h4>
                      <p className="text-sm text-gray-600">{forecast.period}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendIcon className={cn(
                        "h-4 w-4",
                        forecast.trend === 'up' ? "text-green-600" : 
                        forecast.trend === 'down' ? "text-red-600" : "text-gray-600"
                      )} />
                      <Badge className={cn("text-xs", getConfidenceColor(forecast.confidence))}>
                        {forecast.confidence}% confident
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="text-lg font-bold">
                        {forecast.metric.includes('Revenue') ? '$' : ''}
                        {forecast.current.toLocaleString()}
                        {forecast.metric.includes('Rate') ? '%' : ''}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Conservative</p>
                      <p className="text-lg font-bold text-red-600">
                        {forecast.metric.includes('Revenue') ? '$' : ''}
                        {forecast.conservative.toLocaleString()}
                        {forecast.metric.includes('Rate') ? '%' : ''}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Realistic</p>
                      <p className="text-lg font-bold text-blue-600">
                        {forecast.metric.includes('Revenue') ? '$' : ''}
                        {forecast.realistic.toLocaleString()}
                        {forecast.metric.includes('Rate') ? '%' : ''}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Optimistic</p>
                      <p className="text-lg font-bold text-green-600">
                        {forecast.metric.includes('Revenue') ? '$' : ''}
                        {forecast.optimistic.toLocaleString()}
                        {forecast.metric.includes('Rate') ? '%' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Confidence level</span>
                      <span className="font-medium">{forecast.confidence}%</span>
                    </div>
                    <Progress value={forecast.confidence} className="h-2" />
                  </div>

                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Key Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {forecast.factors.map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {defaultInsights.sort((a, b) => a.priority - b.priority).map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              const isExpanded = expandedInsight === insight.id;

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg"
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          "h-5 w-5",
                          insight.type === 'opportunity' ? "text-green-600" :
                          insight.type === 'risk' ? "text-red-600" :
                          insight.type === 'trend' ? "text-blue-600" :
                          "text-purple-600"
                        )} />
                        <h4 className="font-semibold">{insight.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", getImpactColor(insight.impact))}>
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.probability}% likely
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{insight.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Timeframe: {insight.timeframe}</span>
                      <span>Confidence: {insight.confidence}%</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t p-4 bg-gray-50"
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Recommended Action:</p>
                            <p className="text-sm text-gray-600">{insight.action}</p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <span className="text-gray-600">Priority: </span>
                              <span className="font-medium">#{insight.priority}</span>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => onInsightAction?.(insight.id)}
                            >
                              Take Action
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Scenario Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {defaultScenarios.map((scenario, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all",
                    selectedScenario === scenario.scenario.toLowerCase().replace(' ', '_') && "border-blue-500 bg-blue-50"
                  )}
                  onClick={() => {
                    setSelectedScenario(scenario.scenario.toLowerCase().replace(' ', '_'));
                    onScenarioSelect?.(scenario);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{scenario.scenario}</h4>
                    <Badge variant="outline" className="text-xs">
                      {scenario.probability}% chance
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Revenue Impact:</span>
                      <span className={cn(
                        "ml-2 font-medium",
                        scenario.revenue_impact > 0 ? "text-green-600" : 
                        scenario.revenue_impact < 0 ? "text-red-600" : "text-gray-600"
                      )}>
                        {scenario.revenue_impact > 0 ? '+' : ''}{scenario.revenue_impact}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Subscriber Impact:</span>
                      <span className={cn(
                        "ml-2 font-medium",
                        scenario.subscriber_impact > 0 ? "text-green-600" : 
                        scenario.subscriber_impact < 0 ? "text-red-600" : "text-gray-600"
                      )}>
                        {scenario.subscriber_impact > 0 ? '+' : ''}{scenario.subscriber_impact}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Key Factors & Mitigation</h4>
              {defaultScenarios.find(s => s.scenario.toLowerCase().replace(' ', '_') === selectedScenario) && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Factors:</p>
                    <ul className="space-y-1">
                      {defaultScenarios.find(s => s.scenario.toLowerCase().replace(' ', '_') === selectedScenario)?.key_factors.map((factor, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {defaultScenarios.find(s => s.scenario.toLowerCase().replace(' ', '_') === selectedScenario)?.mitigation_strategies && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Mitigation Strategies:</p>
                      <ul className="space-y-1">
                        {defaultScenarios.find(s => s.scenario.toLowerCase().replace(' ', '_') === selectedScenario)?.mitigation_strategies?.map((strategy, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <Zap className="h-3 w-3 text-blue-500" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="text-left">
                <div className="font-medium">Launch Upgrade Campaign</div>
                <div className="text-sm text-gray-600">Target Bronze subscribers with high engagement</div>
              </div>
            </Button>
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="text-left">
                <div className="font-medium">Implement Retention Strategy</div>
                <div className="text-sm text-gray-600">Prepare for seasonal churn patterns</div>
              </div>
            </Button>
            <Button className="justify-start h-auto p-4" variant="outline">
              <div className="text-left">
                <div className="font-medium">Optimize Content Mix</div>
                <div className="text-sm text-gray-600">Increase behind-the-scenes content production</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}