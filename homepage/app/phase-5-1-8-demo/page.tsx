'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  FileText,
  Activity,
  Lock,
  Database,
  Archive,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Settings,
  BarChart3,
  Clock,
  Users,
  Server,
  Gavel,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Info,
  Play,
  X,
  CheckSquare,
  AlertCircle,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.8 components
import { ActivityLogViewer } from '@/components/admin/activity-log-viewer';
import { ComplianceReporting } from '@/components/admin/compliance-reporting';
import { SecurityMonitoring } from '@/components/admin/security-monitoring';
import { DataIntegrity } from '@/components/admin/data-integrity';
import { RetentionManagement } from '@/components/admin/retention-management';
import { AuditLogs } from '@/components/admin/audit-logs';

export default function Phase518Demo() {
  const [activeComponent, setActiveComponent] = React.useState('activity');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  const showComponent = () => {
    setIsComponentVisible(true);
  };

  const hideComponent = () => {
    setIsComponentVisible(false);
  };

  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'activity':
        return <ActivityLogViewer />;
      case 'compliance':
        return <ComplianceReporting />;
      case 'security':
        return <SecurityMonitoring />;
      case 'integrity':
        return <DataIntegrity />;
      case 'retention':
        return <RetentionManagement />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <div>Select a component</div>;
    }
  };

  const components = [
    {
      id: 'activity',
      name: 'Activity Log Viewer',
      description: 'Real-time activity stream and audit trails',
      icon: Activity,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        'Real-time activity stream',
        'Filtered log searches',
        'Date range selections',
        'User action tracking',
        'System event logging',
        'Change history tracking'
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance Reporting',
      description: 'Regulatory compliance tracking and reporting',
      icon: FileText,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      features: [
        'GDPR compliance tracking',
        'CCPA requirements',
        'SOX & PCI-DSS reporting',
        'Policy adherence monitoring',
        'Certification management',
        'Audit preparation tools'
      ]
    },
    {
      id: 'security',
      name: 'Security Monitoring',
      description: 'Access logs and threat detection',
      icon: Shield,
      color: 'text-red-600',
      gradient: 'from-red-500 to-orange-500',
      features: [
        'Access attempt logs',
        'Permission change tracking',
        'Failed login monitoring',
        'Suspicious activity alerts',
        'Data access monitoring',
        'Privacy breach detection'
      ]
    },
    {
      id: 'integrity',
      name: 'Data Integrity',
      description: 'Data consistency and backup verification',
      icon: Database,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Data change tracking',
        'Backup verification',
        'Consistency checks',
        'Corruption detection',
        'Recovery procedures',
        'Validation processes'
      ]
    },
    {
      id: 'retention',
      name: 'Retention Management',
      description: 'Data lifecycle and legal holds',
      icon: Archive,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-yellow-500',
      features: [
        'Retention policies',
        'Archive procedures',
        'Purge schedules',
        'Legal hold processes',
        'Compliance verification',
        'Storage optimization'
      ]
    },
    {
      id: 'audit',
      name: 'Audit Logs',
      description: 'Comprehensive audit trail system',
      icon: FileCheck,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      features: [
        'Administrative actions',
        'System changes',
        'User modifications',
        'Security events',
        'Financial transactions',
        'Export capabilities'
      ]
    }
  ];

  // Mock compliance metrics
  const complianceMetrics = {
    overallScore: 94,
    gdprCompliance: 96,
    ccpaCompliance: 92,
    pciCompliance: 98,
    activePolicies: 12,
    pendingAudits: 3,
    legalHolds: 2,
    dataRetention: '99.5%'
  };

  // Mock security metrics
  const securityMetrics = {
    blockedAttempts: 234,
    suspiciousActivities: 5,
    failedLogins: 45,
    activeThreats: 0,
    securityScore: 92,
    lastIncident: '72 hours ago'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Phase 5.1.8 - Audit Trail & Compliance</h1>
          <p className="text-gray-600">
            Comprehensive activity logging, compliance reporting, and data governance
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Components</CardTitle>
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

            {/* Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{complianceMetrics.overallScore}%</p>
                    <p className="text-sm text-gray-600">Overall Compliance</p>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>GDPR</span>
                      <Badge className="bg-green-100 text-green-800">{complianceMetrics.gdprCompliance}%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>CCPA</span>
                      <Badge className="bg-blue-100 text-blue-800">{complianceMetrics.ccpaCompliance}%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>PCI-DSS</span>
                      <Badge className="bg-green-100 text-green-800">{complianceMetrics.pciCompliance}%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>Active Policies</span>
                      <Badge variant="outline">{complianceMetrics.activePolicies}</Badge>
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
                  {activeComponent === 'activity' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Activity Monitoring</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 border rounded">
                          <Activity className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold">1,234</p>
                          <p className="text-xs text-gray-600">Activities Today</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold">89</p>
                          <p className="text-xs text-gray-600">Active Users</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold">234ms</p>
                          <p className="text-xs text-gray-600">Avg Response</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeComponent === 'compliance' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Compliance Dashboard</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="font-medium">Q1 2024 GDPR Report</p>
                              <p className="text-sm text-gray-600">Generated March 31, 2024</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-blue-600" />
                            <div>
                              <p className="font-medium">ISO 27001 Certification</p>
                              <p className="text-sm text-gray-600">Valid until July 2024</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'security' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Security Overview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border border-red-200 bg-red-50 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-sm">Blocked Attempts</span>
                          </div>
                          <p className="text-2xl font-bold text-red-600">{securityMetrics.blockedAttempts}</p>
                        </div>
                        <div className="p-3 border border-green-200 bg-green-50 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-sm">Security Score</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">{securityMetrics.securityScore}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'integrity' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Data Integrity Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm font-medium">Backup Verification</span>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm font-medium">Consistency Checks</span>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm font-medium">Recovery Points</span>
                          <Badge>3 Available</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'retention' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Data Retention</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded">
                          <Archive className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-xl font-bold">2.5TB</p>
                          <p className="text-xs text-gray-600">Total Data</p>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <Gavel className="h-6 w-6 mx-auto mb-2 text-red-600" />
                          <p className="text-xl font-bold">{complianceMetrics.legalHolds}</p>
                          <p className="text-xs text-gray-600">Legal Holds</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeComponent === 'audit' && (
                    <div className="text-center space-y-4">
                      <FileCheck className="h-12 w-12 mx-auto text-indigo-600" />
                      <div>
                        <p className="font-medium">Comprehensive Audit Trail</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Tracking all administrative actions and system changes
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Security Alert */}
            {activeComponent === 'security' && securityMetrics.suspiciousActivities > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-900">Security Alert</p>
                      <p className="text-sm text-orange-700">
                        {securityMetrics.suspiciousActivities} suspicious activities detected. Review immediately.
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Phase 5.1.8 Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Complete Accountability
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Full audit trail</li>
                      <li>• User action tracking</li>
                      <li>• Change history</li>
                      <li>• System events</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      Regulatory Compliance
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• GDPR compliance</li>
                      <li>• CCPA requirements</li>
                      <li>• SOX reporting</li>
                      <li>• PCI-DSS standards</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-red-500" />
                      Enhanced Security
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Threat detection</li>
                      <li>• Access monitoring</li>
                      <li>• Breach prevention</li>
                      <li>• Incident response</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Database className="h-4 w-4 text-purple-500" />
                      Data Governance
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Retention policies</li>
                      <li>• Legal holds</li>
                      <li>• Data integrity</li>
                      <li>• Recovery procedures</li>
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