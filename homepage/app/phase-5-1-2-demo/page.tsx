'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown,
  Shield,
  Settings,
  Monitor,
  Search,
  Bell,
  BarChart3,
  Activity,
  Users,
  CheckCircle,
  Eye,
  Play,
  RotateCcw,
  Network,
  Database,
  Zap,
  Target,
  Lightbulb,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.2 components
import { EnhancedAdminLayout } from '@/components/admin/enhanced-admin-layout';
import { DashboardOverview } from '@/components/admin/dashboard-overview';
import { EnhancedAdminHeader } from '@/components/admin/enhanced-admin-header';
import { SystemHealthSidebar } from '@/components/admin/system-health-sidebar';

type DemoComponent = 
  | 'enhanced-layout'
  | 'admin-header' 
  | 'dashboard-overview'
  | 'system-sidebar'
  | 'full-demo';

interface ComponentDemo {
  id: DemoComponent;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  features: string[];
  category: 'layout' | 'navigation' | 'overview' | 'monitoring' | 'integration';
}

export default function Phase512Demo() {
  const [activeComponent, setActiveComponent] = React.useState<DemoComponent>('enhanced-layout');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  // Mock user for demos
  const mockUser = {
    name: "Sarah Chen",
    email: "sarah.chen@annpale.com", 
    avatar: "/placeholder-user.jpg",
    role: "super_admin",
    permissions: [
      "user_view", "user_edit", "user_delete", "user_suspend",
      "creator_approve", "creator_verify", "creator_edit", "creator_suspend",
      "content_review", "content_remove", "content_flag",
      "payment_view", "payment_process", "financial_reports",
      "settings_view", "settings_edit", "analytics_full"
    ]
  };

  // Component demos configuration
  const componentDemos: ComponentDemo[] = [
    {
      id: 'enhanced-layout',
      name: 'Enhanced Admin Layout',
      description: 'Comprehensive admin interface with sidebar navigation and system health monitoring',
      icon: Network,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      category: 'layout',
      features: [
        'Three-column layout architecture',
        'Collapsible sidebar navigation',
        'Real-time system health sidebar',
        'Responsive mobile-first design',
        'Role-based navigation access',
        'Emergency contact integration'
      ]
    },
    {
      id: 'admin-header',
      name: 'Enhanced Admin Header',
      description: 'Command center top navigation with comprehensive search, notifications, and emergency actions',
      icon: Monitor,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      category: 'navigation',
      features: [
        'Global search functionality',
        'Real-time notification system',
        'Emergency action controls',
        'Multi-language support',
        'System status indicators',
        'Admin profile management'
      ]
    },
    {
      id: 'dashboard-overview',
      name: 'Dashboard Command Center',
      description: 'Real-time metrics overview with alerts, activity timeline, and quick actions',
      icon: BarChart3,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      category: 'overview',
      features: [
        'Key metrics visualization',
        'Real-time alert system',
        'Activity timeline tracking',
        'Quick action panels',
        'Performance monitoring',
        'Trend analysis display'
      ]
    },
    {
      id: 'system-sidebar',
      name: 'System Health Sidebar',
      description: 'Live system monitoring with pending approvals, active admins, and emergency contacts',
      icon: Activity,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      category: 'monitoring',
      features: [
        'Real-time system metrics',
        'Active admin monitoring',
        'Pending approval queue',
        'Quick action shortcuts',
        'Recent changes log',
        'Emergency contact access'
      ]
    },
    {
      id: 'full-demo',
      name: 'Complete Integration',
      description: 'Full Phase 5.1.2 dashboard with all components working together seamlessly',
      icon: Target,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      category: 'integration',
      features: [
        'Complete admin command center',
        'Integrated component ecosystem',
        'Real-time data synchronization',
        'Unified user experience',
        'Cross-component communication',
        'Production-ready interface'
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
      setActiveComponent('enhanced-layout');
    }, 300);
  };

  // Render component demo
  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'enhanced-layout':
        return (
          <div className="h-[600px] border rounded-lg bg-gray-50 relative overflow-hidden">
            <EnhancedAdminLayout user={mockUser} showRightSidebar={false}>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Enhanced Admin Layout Demo</h2>
                <p className="text-gray-600">
                  This demonstrates the three-column layout architecture with sidebar navigation, 
                  main content area, and integrated system health monitoring.
                </p>
              </div>
            </EnhancedAdminLayout>
          </div>
        );
      
      case 'admin-header':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enhanced Admin Header</h3>
            <div className="border rounded-lg overflow-hidden">
              <EnhancedAdminHeader user={mockUser} notifications={5} />
            </div>
            <p className="text-sm text-gray-600">
              Command center navigation with search, notifications, emergency actions, and system status.
            </p>
          </div>
        );
      
      case 'dashboard-overview':
        return (
          <div className="h-[600px] overflow-y-auto border rounded-lg bg-white p-6">
            <DashboardOverview />
          </div>
        );
      
      case 'system-sidebar':
        return (
          <div className="h-[600px] border rounded-lg bg-gray-50 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full">
              <SystemHealthSidebar />
            </div>
            <div className="p-6 mr-80">
              <h3 className="text-lg font-semibold mb-4">System Health Sidebar Demo</h3>
              <p className="text-gray-600">
                The right sidebar provides real-time system monitoring, active admin tracking,
                pending approvals, and emergency contact information.
              </p>
            </div>
          </div>
        );
      
      case 'full-demo':
        return (
          <div className="h-[700px] border rounded-lg bg-gray-50 relative overflow-hidden">
            <EnhancedAdminLayout user={mockUser} showRightSidebar={true}>
              <DashboardOverview />
            </EnhancedAdminLayout>
          </div>
        );
      
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Phase 5.1.2 Demo</h1>
                <p className="text-sm text-gray-600">Dashboard Overview & Navigation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-700">
                5 Components
              </Badge>
              <Badge className="bg-purple-100 text-purple-700">
                Command Center
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                Real-time
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
                <CardTitle className="text-lg">Phase 5.1.2 Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Administrative Command Center Design - Create an intuitive dashboard interface that provides 
                  comprehensive platform oversight while enabling quick access to critical functions and information.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Architecture Components:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Top Navigation with search & notifications</li>
                    <li>• Sidebar Navigation with role-based access</li>
                    <li>• Main Content Area with metrics & alerts</li>
                    <li>• Right Sidebar with system health</li>
                    <li>• Footer with version & status info</li>
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
                  const isSelected = activeComponent === demo.id;
                  
                  return (
                    <Card 
                      key={demo.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        isSelected && "border-2 border-blue-500 ring-2 ring-blue-200"
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
                                demo.category === 'layout' ? "bg-blue-100 text-blue-700" :
                                demo.category === 'navigation' ? "bg-purple-100 text-purple-700" :
                                demo.category === 'overview' ? "bg-green-100 text-green-700" :
                                demo.category === 'monitoring' ? "bg-orange-100 text-orange-700" :
                                "bg-indigo-100 text-indigo-700"
                              )}>
                                {demo.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{demo.description}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
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
                      currentDemo.category === 'layout' ? "bg-blue-100 text-blue-700" :
                      currentDemo.category === 'navigation' ? "bg-purple-100 text-purple-700" :
                      currentDemo.category === 'overview' ? "bg-green-100 text-green-700" :
                      currentDemo.category === 'monitoring' ? "bg-orange-100 text-orange-700" :
                      "bg-indigo-100 text-indigo-700"
                    )}>
                      {currentDemo.category.charAt(0).toUpperCase() + currentDemo.category.slice(1)} Component
                    </Badge>
                    <Badge variant="outline">
                      Phase 5.1.2
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
                        className="bg-blue-600 hover:bg-blue-700"
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
                <CardTitle className="text-lg">Phase 5.1.2 Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Command Center Design
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Comprehensive platform oversight</li>
                      <li>• Quick access to critical functions</li>
                      <li>• Intuitive dashboard interface</li>
                      <li>• Real-time monitoring capabilities</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Navigation Structure
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Role-based sidebar navigation</li>
                      <li>• Emergency action controls</li>
                      <li>• Global search functionality</li>
                      <li>• Multi-language support</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      Real-time Monitoring
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Live system health metrics</li>
                      <li>• Active admin tracking</li>
                      <li>• Pending approval alerts</li>
                      <li>• Activity timeline display</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      Operational Efficiency
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Quick action panels</li>
                      <li>• Automated alert system</li>
                      <li>• Performance analytics</li>
                      <li>• Emergency contact access</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Architecture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Layout Structure</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Three-column responsive layout</li>
                      <li>• Collapsible sidebar navigation</li>
                      <li>• Sticky header positioning</li>
                      <li>• Real-time sidebar monitoring</li>
                      <li>• Mobile-first responsive design</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Component Integration</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Enhanced AdminLayout wrapper</li>
                      <li>• AdminHeader with search & alerts</li>
                      <li>• DashboardOverview with metrics</li>
                      <li>• SystemHealthSidebar monitoring</li>
                      <li>• Cross-component communication</li>
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
              className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
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