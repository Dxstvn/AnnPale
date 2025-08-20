'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle,
  Shield,
  Clock,
  Users,
  DollarSign,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  Timer,
  User,
  Zap,
  Eye,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  ArrowRight,
  GitBranch,
  Activity,
  Bell,
  Calendar,
  Target,
  Star,
  TrendingUp,
  BarChart3,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DecisionType {
  id: string;
  name: string;
  urgency: 'immediate' | 'high' | 'medium' | 'low';
  dataRequired: string[];
  authorityLevel: string;
  process: DecisionProcess;
  examples: string[];
  averageTime: string;
  escalationTriggers: string[];
  approvalRequired: boolean;
  icon: React.ElementType;
  color: string;
}

interface DecisionProcess {
  id: string;
  steps: DecisionStep[];
  automationLevel: 'manual' | 'semi-automated' | 'automated';
  slaTarget: string;
  rollbackPossible: boolean;
}

interface DecisionStep {
  id: string;
  name: string;
  description: string;
  responsible: string;
  estimatedTime: string;
  required: boolean;
  canAutomate: boolean;
  dependencies: string[];
}

interface DecisionCase {
  id: string;
  type: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'escalated';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  currentStep: string;
  stepsCompleted: number;
  totalSteps: number;
  context: {
    affectedUsers?: number;
    financialImpact?: number;
    riskLevel?: 'high' | 'medium' | 'low';
    precedent?: boolean;
  };
}

interface AdminDecisionPatternsProps {
  selectedDecisionType?: string;
  onDecisionTypeSelect?: (typeId: string) => void;
  showWorkflow?: boolean;
  showCases?: boolean;
}

export function AdminDecisionPatterns({
  selectedDecisionType,
  onDecisionTypeSelect,
  showWorkflow = true,
  showCases = true
}: AdminDecisionPatternsProps) {
  const [activeDecisionType, setActiveDecisionType] = React.useState<string>(selectedDecisionType || 'emergency-response');
  const [selectedCase, setSelectedCase] = React.useState<string | null>(null);
  const [workflowView, setWorkflowView] = React.useState<'overview' | 'detailed' | 'automation'>('overview');

  // Decision types based on Phase 5.1.1 specifications
  const decisionTypes: DecisionType[] = [
    {
      id: 'emergency-response',
      name: 'Emergency Response',
      urgency: 'immediate',
      dataRequired: ['Real-time alerts', 'System status', 'Impact assessment', 'Response protocols'],
      authorityLevel: 'Super Admin',
      process: {
        id: 'emergency-process',
        steps: [
          {
            id: 'alert-assessment',
            name: 'Alert Assessment',
            description: 'Evaluate the severity and scope of the emergency',
            responsible: 'Super Admin',
            estimatedTime: '2-5 minutes',
            required: true,
            canAutomate: false,
            dependencies: []
          },
          {
            id: 'immediate-action',
            name: 'Immediate Action',
            description: 'Take immediate containment or response actions',
            responsible: 'Super Admin',
            estimatedTime: '5-15 minutes',
            required: true,
            canAutomate: false,
            dependencies: ['alert-assessment']
          },
          {
            id: 'team-notification',
            name: 'Team Notification',
            description: 'Alert relevant team members and stakeholders',
            responsible: 'Operations Admin',
            estimatedTime: '1-3 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['alert-assessment']
          },
          {
            id: 'status-communication',
            name: 'Status Communication',
            description: 'Communicate status to users and stakeholders',
            responsible: 'Operations Admin',
            estimatedTime: '10-30 minutes',
            required: false,
            canAutomate: true,
            dependencies: ['immediate-action']
          }
        ],
        automationLevel: 'semi-automated',
        slaTarget: '15 minutes',
        rollbackPossible: false
      },
      examples: [
        'System security breach',
        'Payment processing failure',
        'Data loss incident',
        'Platform outage'
      ],
      averageTime: '15-45 minutes',
      escalationTriggers: ['System-wide impact', 'Security compromise', 'Data breach'],
      approvalRequired: false,
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: 'policy-enforcement',
      name: 'Policy Enforcement',
      urgency: 'high',
      dataRequired: ['User reports', 'Evidence documentation', 'Policy guidelines', 'Precedent cases'],
      authorityLevel: 'Operations Admin',
      process: {
        id: 'policy-process',
        steps: [
          {
            id: 'evidence-review',
            name: 'Evidence Review',
            description: 'Review reported evidence and context',
            responsible: 'Content Moderator',
            estimatedTime: '10-30 minutes',
            required: true,
            canAutomate: false,
            dependencies: []
          },
          {
            id: 'policy-check',
            name: 'Policy Verification',
            description: 'Verify against platform policies',
            responsible: 'Content Moderator',
            estimatedTime: '5-15 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['evidence-review']
          },
          {
            id: 'decision-documentation',
            name: 'Decision Documentation',
            description: 'Document decision reasoning and evidence',
            responsible: 'Content Moderator',
            estimatedTime: '5-10 minutes',
            required: true,
            canAutomate: false,
            dependencies: ['policy-check']
          },
          {
            id: 'action-implementation',
            name: 'Action Implementation',
            description: 'Implement enforcement action',
            responsible: 'Operations Admin',
            estimatedTime: '2-5 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['decision-documentation']
          }
        ],
        automationLevel: 'semi-automated',
        slaTarget: '4 hours',
        rollbackPossible: true
      },
      examples: [
        'Content violation enforcement',
        'User behavior violations',
        'Creator policy violations',
        'Terms of service breaches'
      ],
      averageTime: '2-6 hours',
      escalationTriggers: ['Complex cases', 'High-profile users', 'Legal implications'],
      approvalRequired: true,
      icon: Shield,
      color: 'text-orange-600'
    },
    {
      id: 'user-account-actions',
      name: 'User Account Actions',
      urgency: 'medium',
      dataRequired: ['User history', 'Violation records', 'Account metrics', 'Impact assessment'],
      authorityLevel: 'Moderator+',
      process: {
        id: 'account-process',
        steps: [
          {
            id: 'account-review',
            name: 'Account Review',
            description: 'Review user account history and violations',
            responsible: 'Moderator',
            estimatedTime: '15-30 minutes',
            required: true,
            canAutomate: false,
            dependencies: []
          },
          {
            id: 'risk-assessment',
            name: 'Risk Assessment',
            description: 'Assess risk level and impact',
            responsible: 'Moderator',
            estimatedTime: '10-20 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['account-review']
          },
          {
            id: 'action-selection',
            name: 'Action Selection',
            description: 'Select appropriate enforcement action',
            responsible: 'Operations Admin',
            estimatedTime: '5-15 minutes',
            required: true,
            canAutomate: false,
            dependencies: ['risk-assessment']
          },
          {
            id: 'user-notification',
            name: 'User Notification',
            description: 'Notify user of action and appeal rights',
            responsible: 'Support Staff',
            estimatedTime: '5-10 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['action-selection']
          }
        ],
        automationLevel: 'semi-automated',
        slaTarget: '24 hours',
        rollbackPossible: true
      },
      examples: [
        'Account suspension decisions',
        'Verification status changes',
        'Access restriction implementations',
        'Account termination procedures'
      ],
      averageTime: '2-8 hours',
      escalationTriggers: ['Creator accounts', 'Revenue impact', 'Legal concerns'],
      approvalRequired: true,
      icon: User,
      color: 'text-blue-600'
    },
    {
      id: 'financial-adjustments',
      name: 'Financial Adjustments',
      urgency: 'high',
      dataRequired: ['Transaction data', 'Financial records', 'Approval chain', 'Compliance check'],
      authorityLevel: 'Finance Manager+',
      process: {
        id: 'financial-process',
        steps: [
          {
            id: 'transaction-verification',
            name: 'Transaction Verification',
            description: 'Verify transaction details and legitimacy',
            responsible: 'Finance Specialist',
            estimatedTime: '20-45 minutes',
            required: true,
            canAutomate: false,
            dependencies: []
          },
          {
            id: 'compliance-check',
            name: 'Compliance Check',
            description: 'Ensure regulatory compliance',
            responsible: 'Finance Manager',
            estimatedTime: '15-30 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['transaction-verification']
          },
          {
            id: 'multi-approval',
            name: 'Multi-Person Approval',
            description: 'Obtain required approvals from multiple parties',
            responsible: 'Finance Manager + Super Admin',
            estimatedTime: '30-120 minutes',
            required: true,
            canAutomate: false,
            dependencies: ['compliance-check']
          },
          {
            id: 'adjustment-execution',
            name: 'Adjustment Execution',
            description: 'Execute the financial adjustment',
            responsible: 'Finance Manager',
            estimatedTime: '10-30 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['multi-approval']
          }
        ],
        automationLevel: 'manual',
        slaTarget: '48 hours',
        rollbackPossible: true
      },
      examples: [
        'Payment reversals and refunds',
        'Creator payout adjustments',
        'Fee modifications',
        'Revenue corrections'
      ],
      averageTime: '4-24 hours',
      escalationTriggers: ['Large amounts', 'Fraud suspicion', 'Legal requirements'],
      approvalRequired: true,
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'system-changes',
      name: 'System Changes',
      urgency: 'low',
      dataRequired: ['Impact analysis', 'Testing results', 'Rollback plan', 'Stakeholder approval'],
      authorityLevel: 'Super Admin',
      process: {
        id: 'system-process',
        steps: [
          {
            id: 'impact-analysis',
            name: 'Impact Analysis',
            description: 'Analyze potential impact of system changes',
            responsible: 'Technical Lead',
            estimatedTime: '2-8 hours',
            required: true,
            canAutomate: false,
            dependencies: []
          },
          {
            id: 'testing-validation',
            name: 'Testing & Validation',
            description: 'Comprehensive testing and validation',
            responsible: 'QA Team',
            estimatedTime: '4-24 hours',
            required: true,
            canAutomate: true,
            dependencies: ['impact-analysis']
          },
          {
            id: 'stakeholder-approval',
            name: 'Stakeholder Approval',
            description: 'Obtain approval from key stakeholders',
            responsible: 'Super Admin',
            estimatedTime: '1-5 days',
            required: true,
            canAutomate: false,
            dependencies: ['testing-validation']
          },
          {
            id: 'rollout-execution',
            name: 'Rollout Execution',
            description: 'Execute planned rollout with monitoring',
            responsible: 'Technical Lead',
            estimatedTime: '2-12 hours',
            required: true,
            canAutomate: true,
            dependencies: ['stakeholder-approval']
          }
        ],
        automationLevel: 'semi-automated',
        slaTarget: '7 days',
        rollbackPossible: true
      },
      examples: [
        'Feature releases and updates',
        'Security policy changes',
        'Infrastructure modifications',
        'Integration implementations'
      ],
      averageTime: '3-14 days',
      escalationTriggers: ['High risk changes', 'User impact', 'Compliance requirements'],
      approvalRequired: true,
      icon: Settings,
      color: 'text-purple-600'
    },
    {
      id: 'content-decisions',
      name: 'Content Decisions',
      urgency: 'medium',
      dataRequired: ['Content context', 'Policy reference', 'Precedent cases', 'User impact'],
      authorityLevel: 'Content Moderator+',
      process: {
        id: 'content-process',
        steps: [
          {
            id: 'content-analysis',
            name: 'Content Analysis',
            description: 'Analyze content against community standards',
            responsible: 'Content Moderator',
            estimatedTime: '10-30 minutes',
            required: true,
            canAutomate: true,
            dependencies: []
          },
          {
            id: 'context-evaluation',
            name: 'Context Evaluation',
            description: 'Evaluate context and cultural sensitivity',
            responsible: 'Content Moderator',
            estimatedTime: '15-45 minutes',
            required: true,
            canAutomate: false,
            dependencies: ['content-analysis']
          },
          {
            id: 'precedent-review',
            name: 'Precedent Review',
            description: 'Review similar cases and precedents',
            responsible: 'Senior Moderator',
            estimatedTime: '10-20 minutes',
            required: false,
            canAutomate: true,
            dependencies: ['context-evaluation']
          },
          {
            id: 'decision-implementation',
            name: 'Decision Implementation',
            description: 'Implement content decision and notify affected parties',
            responsible: 'Content Moderator',
            estimatedTime: '5-15 minutes',
            required: true,
            canAutomate: true,
            dependencies: ['context-evaluation']
          }
        ],
        automationLevel: 'semi-automated',
        slaTarget: '6 hours',
        rollbackPossible: true
      },
      examples: [
        'Content approval/rejection',
        'Community guideline enforcement',
        'Cultural sensitivity decisions',
        'Creator content disputes'
      ],
      averageTime: '1-4 hours',
      escalationTriggers: ['Controversial content', 'Celebrity creators', 'Media attention'],
      approvalRequired: false,
      icon: FileText,
      color: 'text-indigo-600'
    }
  ];

  // Sample decision cases
  const decisionCases: DecisionCase[] = [
    {
      id: 'case-001',
      type: 'emergency-response',
      title: 'Payment System Outage',
      description: 'Critical payment processing system experiencing widespread failures',
      status: 'in-progress',
      priority: 'urgent',
      assignedTo: 'Alexandre Dubois',
      createdAt: '2024-01-15T14:30:00Z',
      dueDate: '2024-01-15T14:45:00Z',
      currentStep: 'immediate-action',
      stepsCompleted: 1,
      totalSteps: 4,
      context: {
        affectedUsers: 1250,
        financialImpact: 50000,
        riskLevel: 'high',
        precedent: false
      }
    },
    {
      id: 'case-002',
      type: 'policy-enforcement',
      title: 'Creator Content Violation',
      description: 'High-profile creator posted content violating community guidelines',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Marie-Claire Jean',
      createdAt: '2024-01-15T10:15:00Z',
      dueDate: '2024-01-15T18:15:00Z',
      currentStep: 'evidence-review',
      stepsCompleted: 0,
      totalSteps: 4,
      context: {
        affectedUsers: 0,
        riskLevel: 'medium',
        precedent: true
      }
    },
    {
      id: 'case-003',
      type: 'financial-adjustments',
      title: 'Large Refund Request',
      description: 'Customer requesting refund for $5,000 video message order',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Jean-Baptiste Pierre',
      createdAt: '2024-01-15T09:00:00Z',
      dueDate: '2024-01-17T09:00:00Z',
      currentStep: 'transaction-verification',
      stepsCompleted: 0,
      totalSteps: 4,
      context: {
        financialImpact: 5000,
        riskLevel: 'medium',
        precedent: false
      }
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'escalated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDecisionTypeSelect = (typeId: string) => {
    setActiveDecisionType(typeId);
    onDecisionTypeSelect?.(typeId);
  };

  const selectedDecisionTypeData = decisionTypes.find(dt => dt.id === activeDecisionType);
  const relatedCases = decisionCases.filter(dc => dc.type === activeDecisionType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Administrative Decision-Making Patterns</h2>
          <p className="text-gray-600">Workflow automation and decision process optimization</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={workflowView === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setWorkflowView('overview')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={workflowView === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setWorkflowView('detailed')}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Workflow
          </Button>
          <Button
            variant={workflowView === 'automation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setWorkflowView('automation')}
          >
            <Zap className="h-4 w-4 mr-2" />
            Automation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision Types */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Decision Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {decisionTypes.map((decisionType) => {
                  const Icon = decisionType.icon;
                  const isSelected = activeDecisionType === decisionType.id;
                  const typeCases = decisionCases.filter(dc => dc.type === decisionType.id);
                  
                  return (
                    <Card 
                      key={decisionType.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        isSelected && "border-2 border-blue-500 ring-2 ring-blue-200"
                      )}
                      onClick={() => handleDecisionTypeSelect(decisionType.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Icon className={cn("h-5 w-5", decisionType.color)} />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{decisionType.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={cn("text-xs", getUrgencyColor(decisionType.urgency))}>
                                {decisionType.urgency}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {typeCases.length} active
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDecisionTypeData && (
            <>
              {/* Decision Type Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedDecisionTypeData.icon className={cn("h-5 w-5", selectedDecisionTypeData.color)} />
                    {selectedDecisionTypeData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Urgency Level</h4>
                      <Badge className={cn(getUrgencyColor(selectedDecisionTypeData.urgency))}>
                        {selectedDecisionTypeData.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Authority Level</h4>
                      <p className="text-sm text-gray-700">{selectedDecisionTypeData.authorityLevel}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Average Time</h4>
                      <p className="text-sm text-gray-700">{selectedDecisionTypeData.averageTime}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">SLA Target</h4>
                      <p className="text-sm text-gray-700">{selectedDecisionTypeData.process.slaTarget}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required Data</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDecisionTypeData.dataRequired.map((data, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {data}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Common Examples</h4>
                    <ul className="space-y-1">
                      {selectedDecisionTypeData.examples.map((example, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <ChevronRight className="h-3 w-3" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Visualization */}
              {workflowView === 'detailed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Decision Workflow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDecisionTypeData.process.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                              step.required ? "bg-blue-500" : "bg-gray-400"
                            )}>
                              {index + 1}
                            </div>
                            {index < selectedDecisionTypeData.process.steps.length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                            )}
                          </div>
                          
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{step.name}</h4>
                              <div className="flex gap-2">
                                {step.canAutomate && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Automatable
                                  </Badge>
                                )}
                                {step.required && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{step.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span><User className="h-3 w-3 inline mr-1" />{step.responsible}</span>
                              <span><Clock className="h-3 w-3 inline mr-1" />{step.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Automation Level</p>
                          <Badge className="mt-1">
                            {selectedDecisionTypeData.process.automationLevel}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Rollback</p>
                          <Badge className={cn(
                            "mt-1",
                            selectedDecisionTypeData.process.rollbackPossible 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          )}>
                            {selectedDecisionTypeData.process.rollbackPossible ? 'Possible' : 'Not Possible'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Total Steps</p>
                          <Badge className="mt-1">
                            {selectedDecisionTypeData.process.steps.length}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Cases */}
              {showCases && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Active Cases ({relatedCases.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relatedCases.map((decisionCase) => (
                        <Card key={decisionCase.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{decisionCase.title}</h4>
                                <p className="text-sm text-gray-600">{decisionCase.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={cn("text-xs", getStatusColor(decisionCase.status))}>
                                  {decisionCase.status}
                                </Badge>
                                <Badge className={cn(
                                  "text-xs",
                                  decisionCase.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                  decisionCase.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                  decisionCase.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                )}>
                                  {decisionCase.priority}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress:</span>
                                <span>{decisionCase.stepsCompleted}/{decisionCase.totalSteps} steps</span>
                              </div>
                              <Progress 
                                value={(decisionCase.stepsCompleted / decisionCase.totalSteps) * 100} 
                                className="h-2"
                              />
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Assigned:</span>
                                  <span className="ml-1 font-medium">{decisionCase.assignedTo}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Due:</span>
                                  <span className="ml-1 font-medium">
                                    {new Date(decisionCase.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              {decisionCase.context && (
                                <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                                  {decisionCase.context.affectedUsers && (
                                    <span className="mr-3">👥 {decisionCase.context.affectedUsers} users affected</span>
                                  )}
                                  {decisionCase.context.financialImpact && (
                                    <span className="mr-3">💰 ${decisionCase.context.financialImpact.toLocaleString()} impact</span>
                                  )}
                                  {decisionCase.context.riskLevel && (
                                    <Badge className={cn(
                                      "text-xs",
                                      decisionCase.context.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                                      decisionCase.context.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-green-100 text-green-700'
                                    )}>
                                      {decisionCase.context.riskLevel} risk
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}