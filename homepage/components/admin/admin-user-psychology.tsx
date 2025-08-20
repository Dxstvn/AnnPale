'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown,
  Shield,
  Users,
  Settings,
  DollarSign,
  BarChart3,
  MessageSquare,
  FileText,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Brain,
  Lightbulb,
  Activity,
  Heart,
  Star,
  Zap,
  Award,
  UserCheck,
  CreditCard,
  HeadphonesIcon,
  Megaphone,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AdminPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  dailyTasks: string[];
  keyConcerns: string[];
  successMetrics: string[];
  mentalModel: {
    primaryFocus: string;
    decisionStyle: string;
    informationNeeds: string[];
    stressFactors: string[];
    motivations: string[];
  };
  workflowPreferences: {
    preferredInterface: string;
    taskPrioritization: string;
    communicationStyle: string;
    reportingFrequency: string;
  };
  psychologicalProfile: {
    personalityType: string;
    workStyle: string;
    stressTolerance: number;
    adaptability: number;
    detailOrientation: number;
    collaborationPreference: number;
  };
}

interface PersonaInsight {
  category: string;
  insight: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations: string[];
}

interface AdminUserPsychologyProps {
  selectedPersona?: string;
  onPersonaSelect?: (personaId: string) => void;
  showInsights?: boolean;
  showWorkflows?: boolean;
}

export function AdminUserPsychology({
  selectedPersona,
  onPersonaSelect,
  showInsights = true,
  showWorkflows = true
}: AdminUserPsychologyProps) {
  const [activePersona, setActivePersona] = React.useState<string>(selectedPersona || 'platform-owner');
  const [selectedInsight, setSelectedInsight] = React.useState<string | null>(null);

  // Admin persona data based on Phase 5.1.1 specifications
  const adminPersonas: AdminPersona[] = [
    {
      id: 'platform-owner',
      name: 'Platform Owner',
      role: 'Strategic oversight',
      description: 'Focuses on business success, user satisfaction, and long-term platform growth',
      icon: Crown,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      dailyTasks: [
        'Revenue reviews and financial analysis',
        'Growth metrics evaluation',
        'Strategic planning sessions',
        'Stakeholder meetings',
        'Market trend analysis'
      ],
      keyConcerns: [
        'Business success and profitability',
        'User satisfaction and retention',
        'Competitive positioning',
        'Platform scalability',
        'Regulatory compliance'
      ],
      successMetrics: [
        'Platform KPIs and growth rates',
        'Profitability margins',
        'User acquisition costs',
        'Customer lifetime value',
        'Market share expansion'
      ],
      mentalModel: {
        primaryFocus: 'Strategic long-term vision',
        decisionStyle: 'Data-driven with intuition',
        informationNeeds: ['Executive dashboards', 'Trend analysis', 'Competitive intelligence', 'Financial reports'],
        stressFactors: ['Revenue decline', 'Security breaches', 'Regulatory issues', 'Team conflicts'],
        motivations: ['Platform success', 'Innovation leadership', 'Team achievement', 'User impact']
      },
      workflowPreferences: {
        preferredInterface: 'Executive dashboard with high-level metrics',
        taskPrioritization: 'Impact and urgency matrix',
        communicationStyle: 'Brief, action-oriented summaries',
        reportingFrequency: 'Weekly strategic reviews'
      },
      psychologicalProfile: {
        personalityType: 'Visionary Leader',
        workStyle: 'Strategic and collaborative',
        stressTolerance: 85,
        adaptability: 90,
        detailOrientation: 70,
        collaborationPreference: 85
      }
    },
    {
      id: 'operations-manager',
      name: 'Operations Manager',
      role: 'Day-to-day management',
      description: 'Ensures efficient platform operations, quality control, and team coordination',
      icon: Settings,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      dailyTasks: [
        'User support coordination',
        'Content moderation oversight',
        'Team performance monitoring',
        'Process optimization',
        'Quality assurance reviews'
      ],
      keyConcerns: [
        'Operational efficiency',
        'Quality control standards',
        'Team productivity',
        'System reliability',
        'Customer satisfaction'
      ],
      successMetrics: [
        'Response times and SLA compliance',
        'Resolution rates and quality scores',
        'Team utilization and efficiency',
        'Process improvement metrics',
        'Customer satisfaction scores'
      ],
      mentalModel: {
        primaryFocus: 'Operational excellence',
        decisionStyle: 'Process-oriented and systematic',
        informationNeeds: ['Operational dashboards', 'Performance metrics', 'Team reports', 'System health'],
        stressFactors: ['System downtime', 'Team conflicts', 'Process breakdowns', 'Quality issues'],
        motivations: ['Team success', 'Process improvement', 'Quality achievement', 'Efficiency gains']
      },
      workflowPreferences: {
        preferredInterface: 'Detailed operational dashboards',
        taskPrioritization: 'Systematic workflow management',
        communicationStyle: 'Detailed and structured',
        reportingFrequency: 'Daily operational reviews'
      },
      psychologicalProfile: {
        personalityType: 'Systematic Organizer',
        workStyle: 'Methodical and detail-oriented',
        stressTolerance: 75,
        adaptability: 70,
        detailOrientation: 95,
        collaborationPreference: 80
      }
    },
    {
      id: 'content-moderator',
      name: 'Content Moderator',
      role: 'Safety enforcement',
      description: 'Maintains platform safety through consistent policy enforcement and content review',
      icon: Shield,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      dailyTasks: [
        'Review flagged content',
        'Enforce community policies',
        'Document policy violations',
        'Escalate complex cases',
        'Update safety guidelines'
      ],
      keyConcerns: [
        'User safety and protection',
        'Fair policy enforcement',
        'Content quality standards',
        'Legal compliance',
        'Community trust'
      ],
      successMetrics: [
        'Review accuracy and consistency',
        'Response time to reports',
        'Policy violation detection rate',
        'User appeal success rate',
        'Community safety scores'
      ],
      mentalModel: {
        primaryFocus: 'Safety and compliance',
        decisionStyle: 'Policy-based with context consideration',
        informationNeeds: ['Content queues', 'Policy guidelines', 'Case precedents', 'User context'],
        stressFactors: ['Difficult content', 'Ambiguous cases', 'Time pressure', 'User appeals'],
        motivations: ['User protection', 'Fair enforcement', 'Community safety', 'Policy clarity']
      },
      workflowPreferences: {
        preferredInterface: 'Content review tools with context',
        taskPrioritization: 'Severity and urgency-based',
        communicationStyle: 'Clear and policy-focused',
        reportingFrequency: 'Regular case summaries'
      },
      psychologicalProfile: {
        personalityType: 'Guardian Protector',
        workStyle: 'Careful and thorough',
        stressTolerance: 60,
        adaptability: 65,
        detailOrientation: 90,
        collaborationPreference: 70
      }
    },
    {
      id: 'customer-support',
      name: 'Customer Support',
      role: 'User assistance',
      description: 'Provides helpful, empathetic support to resolve user issues and improve satisfaction',
      icon: HeadphonesIcon,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      dailyTasks: [
        'Resolve support tickets',
        'Handle user disputes',
        'Provide technical assistance',
        'Document common issues',
        'Follow up on resolutions'
      ],
      keyConcerns: [
        'User satisfaction and happiness',
        'Quick issue resolution',
        'Clear communication',
        'Problem prevention',
        'Service quality'
      ],
      successMetrics: [
        'Ticket resolution time',
        'Customer satisfaction ratings',
        'First-contact resolution rate',
        'Follow-up quality scores',
        'User retention after support'
      ],
      mentalModel: {
        primaryFocus: 'User experience and satisfaction',
        decisionStyle: 'Empathy-driven with solution focus',
        informationNeeds: ['User history', 'Issue context', 'Solution database', 'Escalation paths'],
        stressFactors: ['Angry users', 'Complex technical issues', 'Unresolvable problems', 'Time constraints'],
        motivations: ['User happiness', 'Problem solving', 'Skill development', 'Team collaboration']
      },
      workflowPreferences: {
        preferredInterface: 'Unified support workspace',
        taskPrioritization: 'User impact and urgency',
        communicationStyle: 'Empathetic and solution-focused',
        reportingFrequency: 'Weekly performance summaries'
      },
      psychologicalProfile: {
        personalityType: 'Helper Advocate',
        workStyle: 'People-focused and responsive',
        stressTolerance: 70,
        adaptability: 85,
        detailOrientation: 75,
        collaborationPreference: 90
      }
    },
    {
      id: 'finance-manager',
      name: 'Finance Manager',
      role: 'Financial oversight',
      description: 'Ensures financial accuracy, compliance, and strategic financial planning',
      icon: DollarSign,
      color: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-500',
      dailyTasks: [
        'Payment monitoring and processing',
        'Creator payout management',
        'Financial report generation',
        'Audit compliance checks',
        'Budget planning and analysis'
      ],
      keyConcerns: [
        'Financial accuracy and integrity',
        'Regulatory compliance',
        'Fraud prevention',
        'Cost optimization',
        'Revenue protection'
      ],
      successMetrics: [
        'Financial accuracy rates',
        'Audit compliance scores',
        'Payment processing efficiency',
        'Fraud detection rates',
        'Cost reduction achievements'
      ],
      mentalModel: {
        primaryFocus: 'Financial integrity and compliance',
        decisionStyle: 'Data-driven and risk-aware',
        informationNeeds: ['Financial dashboards', 'Transaction data', 'Compliance reports', 'Risk assessments'],
        stressFactors: ['Financial discrepancies', 'Audit findings', 'Fraud alerts', 'Regulatory changes'],
        motivations: ['Financial accuracy', 'Compliance achievement', 'Risk mitigation', 'Process improvement']
      },
      workflowPreferences: {
        preferredInterface: 'Financial analytics dashboard',
        taskPrioritization: 'Risk and compliance-based',
        communicationStyle: 'Precise and data-focused',
        reportingFrequency: 'Monthly financial reviews'
      },
      psychologicalProfile: {
        personalityType: 'Analytical Guardian',
        workStyle: 'Precise and systematic',
        stressTolerance: 65,
        adaptability: 60,
        detailOrientation: 98,
        collaborationPreference: 65
      }
    },
    {
      id: 'marketing-manager',
      name: 'Marketing Manager',
      role: 'Growth initiatives',
      description: 'Drives user acquisition, engagement, and platform growth through strategic marketing',
      icon: Megaphone,
      color: 'text-pink-600',
      gradient: 'from-pink-500 to-rose-500',
      dailyTasks: [
        'Campaign management and optimization',
        'Analytics and performance tracking',
        'User acquisition strategy',
        'Content marketing coordination',
        'Growth experiment design'
      ],
      keyConcerns: [
        'User acquisition and growth',
        'Campaign effectiveness',
        'Brand reputation',
        'Competitive positioning',
        'ROI optimization'
      ],
      successMetrics: [
        'Conversion rates and CAC',
        'Growth and retention metrics',
        'Campaign performance ROI',
        'Brand awareness scores',
        'Engagement rate improvements'
      ],
      mentalModel: {
        primaryFocus: 'Growth and user engagement',
        decisionStyle: 'Creative with data validation',
        informationNeeds: ['Growth metrics', 'Campaign analytics', 'User insights', 'Market trends'],
        stressFactors: ['Poor campaign performance', 'Budget constraints', 'Competitive pressure', 'Attribution challenges'],
        motivations: ['Growth achievement', 'Creative success', 'User engagement', 'Innovation']
      },
      workflowPreferences: {
        preferredInterface: 'Marketing analytics dashboard',
        taskPrioritization: 'Impact and opportunity-based',
        communicationStyle: 'Visual and story-driven',
        reportingFrequency: 'Campaign-based reporting'
      },
      psychologicalProfile: {
        personalityType: 'Creative Strategist',
        workStyle: 'Creative and analytical',
        stressTolerance: 80,
        adaptability: 90,
        detailOrientation: 75,
        collaborationPreference: 85
      }
    }
  ];

  // Generate persona insights
  const generatePersonaInsights = (persona: AdminPersona): PersonaInsight[] => {
    return [
      {
        category: 'Mental Model',
        insight: `${persona.name} primarily focuses on ${persona.mentalModel.primaryFocus.toLowerCase()}`,
        impact: 'high',
        actionable: true,
        recommendations: [
          `Design interfaces that emphasize ${persona.mentalModel.primaryFocus.toLowerCase()}`,
          'Provide relevant metrics and KPIs prominently',
          'Streamline workflows for their decision style'
        ]
      },
      {
        category: 'Stress Factors',
        insight: `Key stress points include ${persona.mentalModel.stressFactors.slice(0, 2).join(' and ').toLowerCase()}`,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Implement early warning systems',
          'Provide stress-reduction tools',
          'Design calm, clear interfaces'
        ]
      },
      {
        category: 'Workflow Preferences',
        insight: `Prefers ${persona.workflowPreferences.preferredInterface.toLowerCase()} with ${persona.workflowPreferences.taskPrioritization.toLowerCase()}`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Customize dashboard layouts',
          'Implement smart prioritization',
          'Provide workflow customization options'
        ]
      },
      {
        category: 'Psychological Profile',
        insight: `${persona.psychologicalProfile.personalityType} with ${persona.psychologicalProfile.detailOrientation}% detail orientation`,
        impact: 'medium',
        actionable: false,
        recommendations: [
          'Adapt information density accordingly',
          'Provide appropriate level of detail',
          'Consider cognitive load factors'
        ]
      }
    ];
  };

  const currentPersona = adminPersonas.find(p => p.id === activePersona);
  const insights = currentPersona ? generatePersonaInsights(currentPersona) : [];

  const handlePersonaChange = (personaId: string) => {
    setActivePersona(personaId);
    onPersonaSelect?.(personaId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin User Psychology</h2>
          <p className="text-gray-600">Understanding administrative user mental models and decision patterns</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          Phase 5.1.1
        </Badge>
      </div>

      {/* Persona Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Administrative Personas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminPersonas.map((persona) => {
              const Icon = persona.icon;
              const isSelected = activePersona === persona.id;
              
              return (
                <motion.div
                  key={persona.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected && "border-2 border-purple-500 ring-2 ring-purple-200"
                    )}
                    onClick={() => handlePersonaChange(persona.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                          persona.gradient
                        )}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{persona.name}</h3>
                          <p className="text-sm text-gray-600">{persona.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{persona.description}</p>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-700">Active Persona</span>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Persona Details */}
      {currentPersona && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mental Model */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Mental Model: {currentPersona.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Primary Focus</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {currentPersona.mentalModel.primaryFocus}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Decision Style</h4>
                <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                  {currentPersona.mentalModel.decisionStyle}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Information Needs</h4>
                <div className="space-y-1">
                  {currentPersona.mentalModel.informationNeeds.map((need, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Info className="h-3 w-3 text-blue-500" />
                      <span className="text-sm text-gray-700">{need}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Motivations</h4>
                <div className="space-y-1">
                  {currentPersona.mentalModel.motivations.map((motivation, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Heart className="h-3 w-3 text-pink-500" />
                      <span className="text-sm text-gray-700">{motivation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Psychological Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Psychological Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Personality Type</h4>
                <Badge className="bg-purple-100 text-purple-700">
                  {currentPersona.psychologicalProfile.personalityType}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-2">Work Style</h4>
                <p className="text-sm text-gray-700">{currentPersona.psychologicalProfile.workStyle}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Stress Tolerance</span>
                    <span className="text-sm text-gray-600">{currentPersona.psychologicalProfile.stressTolerance}%</span>
                  </div>
                  <Progress value={currentPersona.psychologicalProfile.stressTolerance} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Adaptability</span>
                    <span className="text-sm text-gray-600">{currentPersona.psychologicalProfile.adaptability}%</span>
                  </div>
                  <Progress value={currentPersona.psychologicalProfile.adaptability} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Detail Orientation</span>
                    <span className="text-sm text-gray-600">{currentPersona.psychologicalProfile.detailOrientation}%</span>
                  </div>
                  <Progress value={currentPersona.psychologicalProfile.detailOrientation} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Collaboration Preference</span>
                    <span className="text-sm text-gray-600">{currentPersona.psychologicalProfile.collaborationPreference}%</span>
                  </div>
                  <Progress value={currentPersona.psychologicalProfile.collaborationPreference} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Tasks & Concerns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Tasks & Concerns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Daily Tasks</h4>
                <div className="space-y-1">
                  {currentPersona.dailyTasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Concerns</h4>
                <div className="space-y-1">
                  {currentPersona.keyConcerns.map((concern, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      <span className="text-sm text-gray-700">{concern}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Success Metrics</h4>
                <div className="space-y-1">
                  {currentPersona.successMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-blue-500" />
                      <span className="text-sm text-gray-700">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Workflow Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Preferred Interface</h5>
                  <p className="text-sm text-gray-700">{currentPersona.workflowPreferences.preferredInterface}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Task Prioritization</h5>
                  <p className="text-sm text-gray-700">{currentPersona.workflowPreferences.taskPrioritization}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Communication Style</h5>
                  <p className="text-sm text-gray-700">{currentPersona.workflowPreferences.communicationStyle}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Reporting Frequency</h5>
                  <p className="text-sm text-gray-700">{currentPersona.workflowPreferences.reportingFrequency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Persona Insights */}
      {showInsights && currentPersona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Actionable Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{insight.category}</h4>
                    <Badge 
                      className={cn(
                        insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      )}
                    >
                      {insight.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{insight.insight}</p>
                  
                  {insight.actionable && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-900 mb-1">Recommendations:</h5>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-xs text-gray-600 flex items-center gap-1">
                            <ChevronRight className="h-3 w-3" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}