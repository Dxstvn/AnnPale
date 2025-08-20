'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  DollarSign,
  Users,
  Video,
  TrendingUp,
  Brain,
  FileText,
  Activity,
  Target,
  PieChart,
  LineChart,
  Database,
  Zap,
  Shield,
  Calendar,
  Download,
  Settings,
  Play,
  X,
  CheckSquare,
  Info,
  Sparkles,
  Globe,
  Clock,
  Award,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.6 components
import { ExecutiveDashboard } from '@/components/admin/executive-dashboard';
import { FinancialReports } from '@/components/admin/financial-reports';
import { UserAnalytics } from '@/components/admin/user-analytics';
import { ContentPerformance } from '@/components/admin/content-performance';
import { CustomReportsBuilder } from '@/components/admin/custom-reports-builder';
import { PredictiveAnalytics } from '@/components/admin/predictive-analytics';

export default function Phase516Demo() {
  const [activeComponent, setActiveComponent] = React.useState('executive');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  const showComponent = () => {
    setIsComponentVisible(true);
  };

  const hideComponent = () => {
    setIsComponentVisible(false);
  };

  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'executive':
        return <ExecutiveDashboard />;
      case 'financial':
        return <FinancialReports />;
      case 'users':
        return <UserAnalytics />;
      case 'content':
        return <ContentPerformance />;
      case 'custom':
        return <CustomReportsBuilder />;
      case 'predictive':
        return <PredictiveAnalytics />;
      default:
        return <div>Select a component</div>;
    }
  };

  const components = [
    {
      id: 'executive',
      name: 'Executive Dashboard',
      description: 'KPIs, platform health, and strategic goals',
      icon: Activity,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'Key performance indicators',
        'Growth metrics overview',
        'Platform health monitoring',
        'Strategic goal tracking',
        'Real-time alerts',
        'Quick action buttons'
      ]
    },
    {
      id: 'financial',
      name: 'Financial Reports',
      description: 'Revenue analytics and P&L statements',
      icon: DollarSign,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      features: [
        'Revenue analytics',
        'Transaction volumes',
        'Creator earnings tracking',
        'Expense breakdown',
        'Profit & loss statements',
        'Financial projections'
      ]
    },
    {
      id: 'users',
      name: 'User Analytics',
      description: 'User behavior and retention insights',
      icon: Users,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Acquisition funnels',
        'Retention cohort analysis',
        'Engagement patterns',
        'Geographic distribution',
        'Device usage stats',
        'Behavioral segmentation'
      ]
    },
    {
      id: 'content',
      name: 'Content Performance',
      description: 'Video analytics and quality metrics',
      icon: Video,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      features: [
        'Video completion rates',
        'Category popularity',
        'Creator rankings',
        'Quality metrics',
        'Consumption patterns',
        'Trending content'
      ]
    },
    {
      id: 'custom',
      name: 'Custom Reports',
      description: 'Build and schedule custom reports',
      icon: FileText,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      features: [
        'Report builder interface',
        'Data source selection',
        'Visualization options',
        'Scheduled reports',
        'Export tools',
        'API integration'
      ]
    },
    {
      id: 'predictive',
      name: 'Predictive Analytics',
      description: 'AI-powered forecasting and insights',
      icon: Brain,
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-rose-500',
      features: [
        'Growth forecasting',
        'Churn prediction',
        'Revenue projections',
        'Capacity planning',
        'Risk assessments',
        'AI recommendations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Phase 5.1.6 - Platform Reports & Analytics</h1>
          <p className="text-gray-600">
            Comprehensive analytics and reporting for data-driven decision making
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {components.map((component) => {
                  const Icon = component.icon;
                  const isSelected = activeComponent === component.id;
                  
                  return (
                    <Card 
                      key={component.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        isSelected && "border-2 border-blue-500 ring-2 ring-blue-200"
                      )}
                      onClick={() => setActiveComponent(component.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", component.gradient)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{component.name}</p>
                            <p className="text-xs text-gray-600 mt-1">{component.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {components.find(c => c.id === activeComponent)?.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckSquare className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analytics Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Real-time Data</span>
                    <Badge variant="outline">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Historical Analysis</span>
                    <Badge variant="outline">2+ Years</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Export Formats</span>
                    <Badge variant="outline">PDF/Excel/CSV</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>API Access</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Demo Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Component Demo</CardTitle>
                  <Button onClick={showComponent}>
                    <Play className="h-4 w-4 mr-2" />
                    Launch Demo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8">
                  {activeComponent === 'executive' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Executive Dashboard</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 border rounded">
                          <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="font-medium">Strategic KPIs</p>
                          <p className="text-sm text-gray-600">Real-time performance metrics</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="font-medium">Platform Health</p>
                          <p className="text-sm text-gray-600">System performance monitoring</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeComponent === 'financial' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Financial Analytics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="font-medium">Monthly Revenue</p>
                              <p className="text-sm text-gray-600">Track income streams</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">$125K</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            <div>
                              <p className="font-medium">Growth Rate</p>
                              <p className="text-sm text-gray-600">Month-over-month</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">+15.3%</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'users' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">User Analytics</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 border rounded">
                          <Users className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                          <p className="text-2xl font-bold">45.9K</p>
                          <p className="text-xs text-gray-600">Total Users</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <Clock className="h-6 w-6 mx-auto mb-1 text-orange-600" />
                          <p className="text-2xl font-bold">7.3m</p>
                          <p className="text-xs text-gray-600">Avg Session</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <Globe className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                          <p className="text-2xl font-bold">15</p>
                          <p className="text-xs text-gray-600">Countries</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'content' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Content Performance</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="font-medium">Completion Rate</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="w-4/5 h-full bg-green-500" />
                            </div>
                            <span className="text-sm font-bold">87.8%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="font-medium">Average Rating</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("h-4 w-4", i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                            ))}
                            <span className="text-sm font-bold ml-1">4.7</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'custom' && (
                    <div className="text-center space-y-4">
                      <FileText className="h-12 w-12 mx-auto text-indigo-600" />
                      <div>
                        <p className="font-medium">Custom Report Builder</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Drag-and-drop interface for creating custom analytics dashboards
                        </p>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'predictive' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">AI-Powered Predictions</h3>
                      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Brain className="h-8 w-8 text-purple-600" />
                          <div>
                            <p className="font-medium">Machine Learning Models</p>
                            <p className="text-sm text-gray-600">84.3% accuracy rate</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white/80 p-2 rounded">
                            <Sparkles className="h-4 w-4 text-yellow-500 mb-1" />
                            Growth Forecast: +14% MoM
                          </div>
                          <div className="bg-white/80 p-2 rounded">
                            <Shield className="h-4 w-4 text-green-500 mb-1" />
                            Churn Risk: Low (5%)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Phase 5.1.6 Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      Data-Driven Decisions
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Real-time insights</li>
                      <li>• Performance tracking</li>
                      <li>• Trend analysis</li>
                      <li>• Strategic planning</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Automation
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Scheduled reports</li>
                      <li>• Automated alerts</li>
                      <li>• API integration</li>
                      <li>• Export capabilities</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Predictive analytics</li>
                      <li>• Anomaly detection</li>
                      <li>• Recommendations</li>
                      <li>• Risk assessment</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      Customization
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Custom dashboards</li>
                      <li>• Flexible reporting</li>
                      <li>• Multiple formats</li>
                      <li>• Role-based access</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Component Demo Modal */}
      <AnimatePresence>
        {isComponentVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={hideComponent}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {components.find(c => c.id === activeComponent)?.name}
                </h2>
                <Button variant="ghost" onClick={hideComponent}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {renderComponentDemo()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}