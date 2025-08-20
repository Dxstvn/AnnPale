'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Shield,
  Search,
  Filter,
  Settings,
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Eye,
  Play,
  RotateCcw,
  Target,
  Lightbulb,
  ChevronRight,
  X,
  MessageSquare,
  Download,
  Clock,
  DollarSign,
  FileText,
  History,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.3 components
import { EnhancedUserManagement } from '@/components/admin/enhanced-user-management';

type DemoComponent = 
  | 'enhanced-search'
  | 'bulk-operations' 
  | 'user-profiles'
  | 'activity-timeline'
  | 'risk-assessment'
  | 'admin-controls'
  | 'full-demo';

interface ComponentDemo {
  id: DemoComponent;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  features: string[];
  category: 'search' | 'operations' | 'profiles' | 'monitoring' | 'security' | 'integration';
}

export default function Phase513Demo() {
  const [activeComponent, setActiveComponent] = React.useState<DemoComponent>('enhanced-search');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  // Component demos configuration
  const componentDemos: ComponentDemo[] = [
    {
      id: 'enhanced-search',
      name: 'Advanced Search & Filters',
      description: 'Global search with date ranges, location filters, verification status, and custom query builder',
      icon: Search,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      category: 'search',
      features: [
        'Global search across all user data',
        'Date range filtering for registration',
        'Location and timezone filters',
        'Verification status filtering',
        'Activity level assessment',
        'Custom query builder for complex searches'
      ]
    },
    {
      id: 'bulk-operations',
      name: 'Bulk Operations & Actions',
      description: 'Mass user management with email campaigns, status updates, and verification actions',
      icon: Settings,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      category: 'operations',
      features: [
        'Mass status updates (activate/suspend/ban)',
        'Bulk email verification',
        'Mass communication campaigns',
        'Export selected user data',
        'Batch cleanup operations',
        'Permission-based action controls'
      ]
    },
    {
      id: 'user-profiles',
      name: 'Comprehensive User Profiles',
      description: 'Detailed user profiles with complete history, financial data, and administrative notes',
      icon: Users,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      category: 'profiles',
      features: [
        'Complete user information display',
        'Financial transaction history',
        'Account security settings',
        'Device and login information',
        'Social media connections',
        'Administrative notes and tags'
      ]
    },
    {
      id: 'activity-timeline',
      name: 'Activity Timeline & Tracking',
      description: 'Real-time activity monitoring with detailed timeline and engagement metrics',
      icon: Activity,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      category: 'monitoring',
      features: [
        'Real-time activity timeline',
        'Login and session tracking',
        'Content interaction history',
        'Support ticket integration',
        'Engagement level assessment',
        'Behavioral pattern analysis'
      ]
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment & Security',
      description: 'Advanced risk scoring with violation tracking and security monitoring',
      icon: Shield,
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-500',
      category: 'security',
      features: [
        'Automated risk scoring algorithm',
        'Violation history tracking',
        'Security breach monitoring',
        'Suspicious activity detection',
        'Account safety recommendations',
        'Automated alert system'
      ]
    },
    {
      id: 'admin-controls',
      name: 'Administrative Controls',
      description: 'Permission-based workflows, audit trails, and communication tools',
      icon: Shield,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      category: 'security',
      features: [
        'Role-based permission system',
        'Comprehensive audit trail',
        'Direct communication tools',
        'Administrative workflow management',
        'Action approval processes',
        'Emergency contact integration'
      ]
    },
    {
      id: 'full-demo',
      name: 'Complete Integration',
      description: 'Full Phase 5.1.3 user management system with all components working together',
      icon: Target,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      category: 'integration',
      features: [
        'Complete user management ecosystem',
        'Integrated component workflow',
        'Real-time data synchronization',
        'Unified administrative interface',
        'Cross-component communication',
        'Production-ready implementation'
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
      setActiveComponent('enhanced-search');
    }, 300);
  };

  // Render component demo
  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'enhanced-search':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Search & Filter Panel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Global Search</h4>
                  <p className="text-sm text-gray-600">
                    Search across names, emails, IDs, locations, and custom fields with real-time results.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Advanced Filters</h4>
                  <p className="text-sm text-gray-600">
                    Filter by verification status, activity level, registration date, and risk score.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Date Range Selection</h4>
                  <p className="text-sm text-gray-600">
                    Filter users by registration date, last activity, or custom date ranges.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Custom Query Builder</h4>
                  <p className="text-sm text-gray-600">
                    Build complex queries with multiple criteria and save filter presets.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'bulk-operations':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bulk Operations Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <Settings className="h-8 w-8 text-green-600 mb-2" />
                  <h4 className="font-medium mb-2">Mass Status Updates</h4>
                  <p className="text-sm text-gray-600">
                    Activate, suspend, or ban multiple users with confirmation workflows.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-medium mb-2">Email Campaigns</h4>
                  <p className="text-sm text-gray-600">
                    Send targeted messages to selected user groups with templates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Download className="h-8 w-8 text-purple-600 mb-2" />
                  <h4 className="font-medium mb-2">Data Export</h4>
                  <p className="text-sm text-gray-600">
                    Export user data in multiple formats with privacy controls.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'user-profiles':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comprehensive User Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Profile Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Personal Details</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Contact Information</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Account Settings</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Security Preferences</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Financial Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Transaction History</span>
                      <span className="text-blue-600">View Details</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Methods</span>
                      <span className="text-blue-600">Manage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Earnings/Spending</span>
                      <span className="text-green-600">$1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Balance</span>
                      <span className="text-green-600">$50.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'activity-timeline':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Activity Timeline & Tracking</h3>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    {[
                      { action: "User logged in", time: "2 hours ago", icon: Activity, color: "text-green-600" },
                      { action: "Profile updated", time: "1 day ago", icon: Users, color: "text-blue-600" },
                      { action: "Message sent", time: "3 days ago", icon: MessageSquare, color: "text-purple-600" },
                      { action: "Order placed", time: "1 week ago", icon: DollarSign, color: "text-green-600" }
                    ].map((activity, index) => {
                      const ActivityIcon = activity.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                          <ActivityIcon className={`h-4 w-4 ${activity.color}`} />
                          <div className="flex-1">
                            <span className="font-medium">{activity.action}</span>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'risk-assessment':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Risk Assessment & Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Risk Score Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Account Security</span>
                      <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment History</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Activity Pattern</span>
                      <Badge className="bg-green-100 text-green-800">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Overall Score</span>
                      <span className="font-bold text-green-600">25/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Security Monitoring</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>2FA Enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Email Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Phone Not Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>No Recent Violations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'admin-controls':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Administrative Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <FileText className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-medium mb-2">Audit Trail</h4>
                  <p className="text-sm text-gray-600">
                    Complete record of all administrative actions and user changes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
                  <h4 className="font-medium mb-2">Communication</h4>
                  <p className="text-sm text-gray-600">
                    Direct messaging, notifications, and support ticket integration.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Shield className="h-8 w-8 text-red-600 mb-2" />
                  <h4 className="font-medium mb-2">Permissions</h4>
                  <p className="text-sm text-gray-600">
                    Role-based access control with granular permission management.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'full-demo':
        return (
          <div className="h-[600px] border rounded-lg bg-white relative overflow-hidden">
            <EnhancedUserManagement />
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Phase 5.1.3 Demo</h1>
                <p className="text-sm text-gray-600">Enhanced User Management Interface</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-100 text-purple-700">
                7 Components
              </Badge>
              <Badge className="bg-blue-100 text-blue-700">
                User Management
              </Badge>
              <Badge className="bg-green-100 text-green-700">
                Advanced Features
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
                <CardTitle className="text-lg">Phase 5.1.3 Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enhanced User Management Interface - A comprehensive user administration system with 
                  advanced filtering, bulk operations, detailed user profiles, activity timelines, 
                  risk assessment, and administrative controls.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Advanced search with global filters</li>
                    <li>• Bulk operations for mass user management</li>
                    <li>• Comprehensive user profiles with timeline</li>
                    <li>• Real-time activity monitoring</li>
                    <li>• Risk assessment and security controls</li>
                    <li>• Administrative workflows and audit trails</li>
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
                <CardTitle className="text-lg">Feature Components</CardTitle>
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
                        isSelected && "border-2 border-purple-500 ring-2 ring-purple-200"
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
                                demo.category === 'search' ? "bg-blue-100 text-blue-700" :
                                demo.category === 'operations' ? "bg-green-100 text-green-700" :
                                demo.category === 'profiles' ? "bg-purple-100 text-purple-700" :
                                demo.category === 'monitoring' ? "bg-orange-100 text-orange-700" :
                                demo.category === 'security' ? "bg-red-100 text-red-700" :
                                "bg-indigo-100 text-indigo-700"
                              )}>
                                {demo.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{demo.description}</p>
                          </div>
                          {isSelected && (
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
                      currentDemo.category === 'search' ? "bg-blue-100 text-blue-700" :
                      currentDemo.category === 'operations' ? "bg-green-100 text-green-700" :
                      currentDemo.category === 'profiles' ? "bg-purple-100 text-purple-700" :
                      currentDemo.category === 'monitoring' ? "bg-orange-100 text-orange-700" :
                      currentDemo.category === 'security' ? "bg-red-100 text-red-700" :
                      "bg-indigo-100 text-indigo-700"
                    )}>
                      {currentDemo.category.charAt(0).toUpperCase() + currentDemo.category.slice(1)} Component
                    </Badge>
                    <Badge variant="outline">
                      Phase 5.1.3
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
                  Feature Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8">
                  {renderComponentDemo()}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phase 5.1.3 Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Enhanced Search & Discovery
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Global search across all user data fields</li>
                      <li>• Advanced filtering with multiple criteria</li>
                      <li>• Custom query builder for complex searches</li>
                      <li>• Saved filter presets for quick access</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4 text-blue-500" />
                      Bulk Operations
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Mass status updates with confirmations</li>
                      <li>• Bulk email verification processes</li>
                      <li>• Group communication campaigns</li>
                      <li>• Batch data export capabilities</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Comprehensive Profiles
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Complete user information display</li>
                      <li>• Financial transaction history</li>
                      <li>• Activity timeline with details</li>
                      <li>• Administrative notes and tags</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      Security & Risk Management
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Automated risk assessment scoring</li>
                      <li>• Violation tracking and history</li>
                      <li>• Security monitoring dashboard</li>
                      <li>• Administrative audit trails</li>
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
                    <h4 className="font-medium mb-2">Core Features</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Advanced search and filtering system</li>
                      <li>• Bulk operation workflows</li>
                      <li>• Real-time activity monitoring</li>
                      <li>• Comprehensive user profiles</li>
                      <li>• Risk assessment algorithms</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Administrative Tools</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Permission-based access controls</li>
                      <li>• Audit trail and logging system</li>
                      <li>• Communication and messaging tools</li>
                      <li>• Data export and reporting</li>
                      <li>• Emergency action protocols</li>
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