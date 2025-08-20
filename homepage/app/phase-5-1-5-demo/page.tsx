'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  Flag,
  Eye,
  Bot,
  Users,
  Gavel,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Award,
  Target,
  Activity,
  Play,
  RotateCcw,
  Lightbulb,
  X,
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.5 components
import { EnhancedContentModeration } from '@/components/admin/enhanced-content-moderation';
import { ModerationQualityAssurance } from '@/components/admin/moderation-quality-assurance';
import { ContentModeration } from '@/components/admin/content-moderation';

export default function Phase515Demo() {
  const [activeComponent, setActiveComponent] = React.useState('enhanced-moderation');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  const showComponent = () => {
    setIsComponentVisible(true);
  };

  const hideComponent = () => {
    setIsComponentVisible(false);
  };

  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'enhanced-moderation':
        return <EnhancedContentModeration />;
      case 'quality-assurance':
        return <ModerationQualityAssurance />;
      case 'basic-moderation':
        return <ContentModeration />;
      default:
        return <div>Select a component</div>;
    }
  };

  const components = [
    {
      id: 'enhanced-moderation',
      name: 'Enhanced Content Moderation',
      description: 'Review queues with automated flagging and decision interface',
      icon: Shield,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'Priority queue management',
        'Automated content flagging',
        'User report handling',
        'Content analysis tools',
        'Policy violation tracking',
        'Bulk moderation actions'
      ]
    },
    {
      id: 'quality-assurance',
      name: 'Quality Assurance',
      description: 'Monitor moderator performance and decision consistency',
      icon: BarChart3,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Moderator performance tracking',
        'Decision consistency analysis',
        'Training recommendations',
        'Policy update tracking',
        'Overturn rate monitoring',
        'Quality metrics dashboard'
      ]
    },
    {
      id: 'basic-moderation',
      name: 'Basic Moderation View',
      description: 'Original content moderation interface',
      icon: Flag,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      features: [
        'Basic content review',
        'Simple approve/reject',
        'Flag management',
        'Basic reporting',
        'Standard workflow',
        'Essential features'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Phase 5.1.5 - Content Moderation Dashboard</h1>
          <p className="text-gray-600">
            Automated & manual content review with intelligent flagging and policy enforcement
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
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

            {/* Workflow Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Video Content</span>
                    <Badge variant="outline">24h SLA</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Profile Info</span>
                    <Badge variant="outline">12h SLA</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Messages</span>
                    <Badge variant="outline">6h SLA</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>User Reports</span>
                    <Badge variant="outline">24h SLA</Badge>
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
                  {activeComponent === 'enhanced-moderation' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Content Moderation System</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 border rounded">
                          <Bot className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="font-medium">Automated Detection</p>
                          <p className="text-sm text-gray-600">AI-powered content screening</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <Flag className="h-8 w-8 mx-auto mb-2 text-red-600" />
                          <p className="font-medium">User Reports</p>
                          <p className="text-sm text-gray-600">Community-driven moderation</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <Gavel className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <p className="font-medium">Decision Interface</p>
                          <p className="text-sm text-gray-600">Policy-based actions</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                          <p className="font-medium">Priority Queue</p>
                          <p className="text-sm text-gray-600">Urgent content review</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeComponent === 'quality-assurance' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Quality Assurance System</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Target className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="font-medium">Accuracy Tracking</p>
                              <p className="text-sm text-gray-600">Monitor decision quality</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">94.5%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Activity className="h-6 w-6 text-blue-600" />
                            <div>
                              <p className="font-medium">Consistency Score</p>
                              <p className="text-sm text-gray-600">Decision alignment</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">88%</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-6 w-6 text-purple-600" />
                            <div>
                              <p className="font-medium">Training Needs</p>
                              <p className="text-sm text-gray-600">Personalized recommendations</p>
                            </div>
                          </div>
                          <Badge variant="outline">3 modules</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'basic-moderation' && (
                    <div className="text-center space-y-4">
                      <Flag className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <p className="font-medium">Basic Moderation Interface</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Standard content review and moderation tools
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Phase 5.1.5 Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Intelligent Detection
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• AI-powered content analysis</li>
                      <li>• Pattern recognition</li>
                      <li>• Confidence scoring</li>
                      <li>• Automated flagging</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      SLA Management
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Priority queue system</li>
                      <li>• Time-based escalation</li>
                      <li>• Review time tracking</li>
                      <li>• Automated reminders</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      Policy Enforcement
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Consistent decisions</li>
                      <li>• Policy violation tracking</li>
                      <li>• Appeal process</li>
                      <li>• Audit trail</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      Quality Improvement
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Performance tracking</li>
                      <li>• Training recommendations</li>
                      <li>• Consistency monitoring</li>
                      <li>• Continuous improvement</li>
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