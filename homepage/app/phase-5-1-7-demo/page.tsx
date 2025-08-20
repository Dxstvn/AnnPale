'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server,
  Activity,
  AlertTriangle,
  HardDrive,
  Calendar,
  Shield,
  Gauge,
  Bell,
  Cpu,
  Database,
  Network,
  Clock,
  Wrench,
  BarChart3,
  CheckCircle,
  XCircle,
  Play,
  X,
  CheckSquare,
  Info,
  Zap,
  RefreshCw,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.7 components
import { RealtimeStatusDisplay } from '@/components/admin/realtime-status-display';
import { PerformanceMetrics } from '@/components/admin/performance-metrics';
import { AlertManagement } from '@/components/admin/alert-management';
import { CapacityPlanning } from '@/components/admin/capacity-planning';
import { MaintenanceScheduling } from '@/components/admin/maintenance-scheduling';

export default function Phase517Demo() {
  const [activeComponent, setActiveComponent] = React.useState('status');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  const showComponent = () => {
    setIsComponentVisible(true);
  };

  const hideComponent = () => {
    setIsComponentVisible(false);
  };

  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'status':
        return <RealtimeStatusDisplay />;
      case 'performance':
        return <PerformanceMetrics />;
      case 'alerts':
        return <AlertManagement />;
      case 'capacity':
        return <CapacityPlanning />;
      case 'maintenance':
        return <MaintenanceScheduling />;
      default:
        return <div>Select a component</div>;
    }
  };

  const components = [
    {
      id: 'status',
      name: 'Real-time Status',
      description: 'Live system health and service monitoring',
      icon: Activity,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      features: [
        'Service status indicators',
        'Database performance',
        'CDN status monitoring',
        'Payment gateway health',
        'Video streaming status',
        'Real-time updates'
      ]
    },
    {
      id: 'performance',
      name: 'Performance Metrics',
      description: 'Response times and throughput analysis',
      icon: Gauge,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'Response time graphs',
        'Throughput measurements',
        'Error rate tracking',
        'Resource utilization',
        'User experience scores',
        'Scalability metrics'
      ]
    },
    {
      id: 'alerts',
      name: 'Alert Management',
      description: 'System alerts and incident response',
      icon: Bell,
      color: 'text-red-600',
      gradient: 'from-red-500 to-orange-500',
      features: [
        'Active alerts queue',
        'Alert history log',
        'Escalation procedures',
        'Response team assignments',
        'Resolution tracking',
        'Post-incident reviews'
      ]
    },
    {
      id: 'capacity',
      name: 'Capacity Planning',
      description: 'Resource usage and growth projections',
      icon: HardDrive,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Resource usage trends',
        'Growth projections',
        'Scaling recommendations',
        'Cost optimization',
        'Performance bottlenecks',
        'Infrastructure planning'
      ]
    },
    {
      id: 'maintenance',
      name: 'Maintenance Schedule',
      description: 'Planned updates and deployment windows',
      icon: Wrench,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-yellow-500',
      features: [
        'Maintenance windows',
        'Update deployment status',
        'Rollback procedures',
        'Impact assessments',
        'Communication plans',
        'Team assignments'
      ]
    }
  ];

  // Mock system health data
  const systemHealth = {
    overall: 98.5,
    services: {
      operational: 5,
      degraded: 1,
      down: 0
    },
    metrics: {
      uptime: 99.9,
      responseTime: 145,
      errorRate: 0.02,
      activeAlerts: 3
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Phase 5.1.7 - System Health Monitoring</h1>
          <p className="text-gray-600">
            Platform operations oversight and technical health monitoring
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Components</CardTitle>
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

            {/* System Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{systemHealth.overall}%</p>
                    <p className="text-sm text-gray-600">Overall Health Score</p>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Uptime</span>
                      <Badge className="bg-green-100 text-green-800">{systemHealth.metrics.uptime}%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Response Time</span>
                      <Badge variant="outline">{systemHealth.metrics.responseTime}ms</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Error Rate</span>
                      <Badge className="bg-green-100 text-green-800">{systemHealth.metrics.errorRate}%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Active Alerts</span>
                      <Badge variant="destructive">{systemHealth.metrics.activeAlerts}</Badge>
                    </div>
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
                  {activeComponent === 'status' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Service Status Overview</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 border rounded">
                          <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold">{systemHealth.services.operational}</p>
                          <p className="text-xs text-gray-600">Operational</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                          <p className="text-2xl font-bold">{systemHealth.services.degraded}</p>
                          <p className="text-xs text-gray-600">Degraded</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <XCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
                          <p className="text-2xl font-bold">{systemHealth.services.down}</p>
                          <p className="text-xs text-gray-600">Down</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeComponent === 'performance' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Performance Overview</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Gauge className="h-6 w-6 text-blue-600" />
                            <div>
                              <p className="font-medium">API Response Time</p>
                              <p className="text-sm text-gray-600">Average latency</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">145ms</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                            <div>
                              <p className="font-medium">Throughput</p>
                              <p className="text-sm text-gray-600">Requests per second</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">2,340 req/s</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'alerts' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Alert Status</h3>
                      <div className="space-y-2">
                        <div className="p-3 border border-red-200 bg-red-50 rounded">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-sm">High API Response Time</span>
                            <Badge className="ml-auto bg-red-100 text-red-800">Critical</Badge>
                          </div>
                        </div>
                        <div className="p-3 border border-yellow-200 bg-yellow-50 rounded">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-sm">Database Connection Pool Warning</span>
                            <Badge className="ml-auto bg-yellow-100 text-yellow-800">Medium</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'capacity' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Resource Utilization</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Storage</span>
                            <span className="text-sm">1.2TB / 3TB</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-green-500" />
                          </div>
                        </div>
                        <div className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Memory</span>
                            <span className="text-sm">48GB / 96GB</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'maintenance' && (
                    <div className="text-center space-y-4">
                      <Wrench className="h-12 w-12 mx-auto text-orange-600" />
                      <div>
                        <p className="font-medium">Next Maintenance Window</p>
                        <p className="text-sm text-gray-600 mt-1">
                          March 20, 2024 at 2:00 AM EST
                        </p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">Database Upgrade</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Phase 5.1.7 Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      Proactive Monitoring
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Real-time health checks</li>
                      <li>• Early issue detection</li>
                      <li>• Automated alerts</li>
                      <li>• Predictive analysis</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Fast Response
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Incident escalation</li>
                      <li>• Team assignments</li>
                      <li>• Resolution tracking</li>
                      <li>• Post-mortems</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      Performance Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Response time tracking</li>
                      <li>• Throughput analysis</li>
                      <li>• Error rate monitoring</li>
                      <li>• User experience scores</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      Capacity Management
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Growth projections</li>
                      <li>• Resource planning</li>
                      <li>• Cost optimization</li>
                      <li>• Scaling recommendations</li>
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