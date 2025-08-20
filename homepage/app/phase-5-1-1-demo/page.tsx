'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown,
  Shield,
  Users,
  Settings,
  Brain,
  Network,
  GitBranch,
  Target,
  RotateCcw,
  Play,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Eye,
  Lightbulb,
  Activity,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.1 components
import { AdminUserPsychology } from '@/components/admin/admin-user-psychology';
import { AdminAuthorityHierarchy } from '@/components/admin/admin-authority-hierarchy';
import { AdminDecisionPatterns } from '@/components/admin/admin-decision-patterns';

type DemoComponent = 
  | 'user-psychology'
  | 'authority-hierarchy' 
  | 'decision-patterns';

interface ComponentDemo {
  id: DemoComponent;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  features: string[];
  category: 'psychology' | 'hierarchy' | 'workflow';
}

export default function Phase511Demo() {
  const [activeComponent, setActiveComponent] = React.useState<DemoComponent>('user-psychology');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  // Component demos configuration
  const componentDemos: ComponentDemo[] = [
    {
      id: 'user-psychology',
      name: 'Admin User Psychology',
      description: 'Understanding administrative user mental models, decision patterns, and psychological profiles',
      icon: Brain,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      category: 'psychology',
      features: [
        'Admin persona profiles and mental models',
        'Psychological profiling and work styles',
        'Daily tasks and concern mapping',
        'Success metrics and motivations',
        'Workflow preferences analysis',
        'Actionable insights generation'
      ]
    },
    {
      id: 'authority-hierarchy',
      name: 'Authority Hierarchy',
      description: 'Administrative authority structure visualization and access control management',
      icon: Network,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      category: 'hierarchy',
      features: [
        'Authority level visualization',
        'Permission mapping and control',
        'Reporting structure display',
        'Decision scope definitions',
        'User role assignments',
        'Access control enforcement'
      ]
    },
    {
      id: 'decision-patterns',
      name: 'Decision Patterns',
      description: 'Administrative decision-making workflows and pattern automation',
      icon: GitBranch,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      category: 'workflow',
      features: [
        'Decision type categorization',
        'Workflow automation mapping',
        'SLA and urgency management',
        'Process step visualization',
        'Active case tracking',
        'Escalation trigger management'
      ]
    }
  ];

  // Get current demo and related info
  const currentDemo = componentDemos.find(demo => demo.id === activeComponent);

  // Show component demo
  const showComponent = () => {
    setIsComponentVisible(true);
  };

  // Hide component demo
  const hideComponent = () => {
    setIsComponentVisible(false);
  };

  // Reset demo
  const resetDemo = () => {
    hideComponent();
    setTimeout(() => {
      setActiveComponent('user-psychology');
    }, 300);
  };

  // Render component demo
  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'user-psychology':
        return <AdminUserPsychology showInsights={true} showWorkflows={true} />;
      case 'authority-hierarchy':
        return <AdminAuthorityHierarchy showUsers={true} showPermissions={true} />;
      case 'decision-patterns':
        return <AdminDecisionPatterns showWorkflow={true} showCases={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Phase 5.1.1 Demo</h1>
                <p className="text-sm text-gray-600">Admin User Psychology & Access Control</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-100 text-purple-700">
                3 Components
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                Admin Psychology
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                Access Control
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phase Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phase 5.1.1 Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Understanding the psychological needs and workflows of different administrative users to design 
                  interfaces that enable efficient platform management while maintaining security and oversight.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Focus Areas:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Administrative user mental models</li>
                    <li>• Authority hierarchy and access control</li>
                    <li>• Decision-making pattern automation</li>
                    <li>• Psychological profiling and preferences</li>
                    <li>• Workflow optimization strategies</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={resetDemo} variant="outline">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Component List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {componentDemos.map((demo) => {
                  const Icon = demo.icon;
                  const isActive = activeComponent === demo.id;
                  
                  return (
                    <Card 
                      key={demo.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        isActive && "border-purple-500 ring-2 ring-purple-200"
                      )}
                      onClick={() => setActiveComponent(demo.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", demo.gradient)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{demo.name}</p>
                              <Badge className={cn(
                                "text-xs",
                                demo.category === 'psychology' ? "bg-purple-100 text-purple-700" :
                                demo.category === 'hierarchy' ? "bg-blue-100 text-blue-700" :
                                "bg-green-100 text-green-700"
                              )}>
                                {demo.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{demo.description}</p>
                          </div>
                          {isActive && (
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Feature Breakdown */}
            {currentDemo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <currentDemo.icon className={cn("h-5 w-5", currentDemo.color)} />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentDemo.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Demo Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Demo Header */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {currentDemo && (
                      <>
                        <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", currentDemo.gradient)}>
                          <currentDemo.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{currentDemo.name}</h3>
                          <p className="text-sm text-gray-600">{currentDemo.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button onClick={showComponent} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Demo
                  </Button>
                </div>

                {/* Category Badge */}
                {currentDemo && (
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      currentDemo.category === 'psychology' ? "bg-purple-100 text-purple-700" :
                      currentDemo.category === 'hierarchy' ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    )}>
                      {currentDemo.category.charAt(0).toUpperCase() + currentDemo.category.slice(1)} Focus
                    </Badge>
                    <Badge variant="outline">
                      Phase 5.1.1
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Component Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Component Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  {currentDemo && (
                    <div className="space-y-4">
                      <div className={cn("w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center", currentDemo.gradient)}>
                        <currentDemo.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{currentDemo.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">{currentDemo.description}</p>
                      </div>
                      <Button 
                        onClick={showComponent}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Launch Interactive Demo
                      </Button>
                      <p className="text-xs text-gray-500">
                        Click to explore the full interactive interface
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Psychology Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Understand admin mental models</li>
                      <li>• Optimize workflow preferences</li>
                      <li>• Reduce cognitive load</li>
                      <li>• Improve decision efficiency</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Access Control
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Clear authority hierarchies</li>
                      <li>• Granular permission control</li>
                      <li>• Secure decision workflows</li>
                      <li>• Audit trail compliance</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      Process Automation
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Automated decision routing</li>
                      <li>• SLA compliance tracking</li>
                      <li>• Escalation management</li>
                      <li>• Workflow optimization</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      Business Impact
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Faster decision making</li>
                      <li>• Reduced administrative burden</li>
                      <li>• Improved compliance</li>
                      <li>• Enhanced user satisfaction</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Component Architecture</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• React 19 with TypeScript</li>
                      <li>• Modular component design</li>
                      <li>• Framer Motion animations</li>
                      <li>• shadcn/ui component library</li>
                      <li>• Responsive mobile-first design</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Management</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Type-safe interfaces</li>
                      <li>• Real-time state management</li>
                      <li>• Permission-based access</li>
                      <li>• Audit trail logging</li>
                      <li>• Workflow automation engine</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Component Demo Overlay */}
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
              className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentDemo && (
                      <>
                        <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", currentDemo.gradient)}>
                          <currentDemo.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h2 className="font-semibold">{currentDemo.name}</h2>
                          <p className="text-sm text-gray-600">Interactive Demo</p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button variant="ghost" onClick={hideComponent}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                {renderComponentDemo()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}