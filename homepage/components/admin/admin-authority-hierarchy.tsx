'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  CheckCircle,
  AlertTriangle,
  Eye,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Lock,
  Unlock,
  Star,
  Award,
  Target,
  Zap,
  Activity,
  TrendingUp,
  Building,
  Network,
  GitBranch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthorityLevel {
  id: string;
  name: string;
  level: number;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  permissions: AuthorityPermission[];
  responsibilities: string[];
  reportingStructure: {
    reportsTo?: string;
    manages: string[];
  };
  decisionScope: {
    financial: string;
    operational: string;
    strategic: string;
    personnel: string;
  };
}

interface AuthorityPermission {
  id: string;
  name: string;
  category: 'system' | 'financial' | 'user' | 'content' | 'operational';
  critical: boolean;
  requiresApproval: boolean;
  description: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authorityLevel: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  permissions: string[];
}

interface AdminAuthorityHierarchyProps {
  selectedLevel?: string;
  onLevelSelect?: (levelId: string) => void;
  showUsers?: boolean;
  showPermissions?: boolean;
}

export function AdminAuthorityHierarchy({
  selectedLevel,
  onLevelSelect,
  showUsers = true,
  showPermissions = true
}: AdminAuthorityHierarchyProps) {
  const [activeLevel, setActiveLevel] = React.useState<string>(selectedLevel || 'super-admin');
  const [expandedLevels, setExpandedLevels] = React.useState<Set<string>>(new Set(['super-admin']));
  const [viewMode, setViewMode] = React.useState<'hierarchy' | 'permissions' | 'users'>('hierarchy');

  // Authority hierarchy data based on Phase 5.1.1 specifications
  const authorityLevels: AuthorityLevel[] = [
    {
      id: 'super-admin',
      name: 'Super Admin (Platform Owner)',
      level: 1,
      description: 'Ultimate platform authority with full system access and strategic control',
      icon: Crown,
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-500',
      permissions: [
        { id: 'system_config', name: 'System Configuration', category: 'system', critical: true, requiresApproval: false, description: 'Full system settings control' },
        { id: 'user_role_management', name: 'User Role Management', category: 'user', critical: true, requiresApproval: false, description: 'Create and modify admin roles' },
        { id: 'financial_oversight', name: 'Financial Oversight', category: 'financial', critical: true, requiresApproval: false, description: 'Complete financial control' },
        { id: 'legal_compliance', name: 'Legal Compliance', category: 'operational', critical: true, requiresApproval: false, description: 'Legal and regulatory oversight' },
        { id: 'platform_strategy', name: 'Platform Strategy', category: 'operational', critical: true, requiresApproval: false, description: 'Strategic direction setting' }
      ],
      responsibilities: [
        'Full system access and configuration',
        'User role and permission management',
        'Financial oversight and approval',
        'Legal compliance and governance',
        'Platform strategy and direction',
        'Emergency response coordination'
      ],
      reportingStructure: {
        manages: ['operations-admin', 'department-managers']
      },
      decisionScope: {
        financial: 'Unlimited financial authority',
        operational: 'Complete operational control',
        strategic: 'Full strategic decision-making',
        personnel: 'All hiring and role changes'
      }
    },
    {
      id: 'operations-admin',
      name: 'Operations Admin',
      level: 2,
      description: 'Daily operational management with broad system access',
      icon: Settings,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      permissions: [
        { id: 'user_management', name: 'User Management', category: 'user', critical: true, requiresApproval: false, description: 'Manage regular users and creators' },
        { id: 'content_moderation', name: 'Content Moderation', category: 'content', critical: true, requiresApproval: false, description: 'Content review and enforcement' },
        { id: 'support_oversight', name: 'Support Oversight', category: 'operational', critical: false, requiresApproval: false, description: 'Customer support management' },
        { id: 'performance_monitoring', name: 'Performance Monitoring', category: 'operational', critical: false, requiresApproval: false, description: 'System and team performance tracking' },
        { id: 'policy_enforcement', name: 'Policy Enforcement', category: 'operational', critical: true, requiresApproval: false, description: 'Platform policy implementation' }
      ],
      responsibilities: [
        'User account management and support',
        'Content moderation and policy enforcement',
        'Support team oversight and coordination',
        'Performance monitoring and reporting',
        'Operational metrics and quality assurance',
        'Policy implementation and updates'
      ],
      reportingStructure: {
        reportsTo: 'super-admin',
        manages: ['specialists', 'support-staff']
      },
      decisionScope: {
        financial: 'Operational budget authority up to $10,000',
        operational: 'Day-to-day operational decisions',
        strategic: 'Operational strategy within guidelines',
        personnel: 'Team management and scheduling'
      }
    },
    {
      id: 'department-managers',
      name: 'Department Managers',
      level: 3,
      description: 'Specialized department leadership with focused authority',
      icon: Building,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-indigo-500',
      permissions: [
        { id: 'team_management', name: 'Team Management', category: 'user', critical: false, requiresApproval: true, description: 'Manage department team members' },
        { id: 'department_metrics', name: 'Department Metrics', category: 'operational', critical: false, requiresApproval: false, description: 'Access department analytics' },
        { id: 'resource_allocation', name: 'Resource Allocation', category: 'operational', critical: false, requiresApproval: true, description: 'Allocate department resources' },
        { id: 'process_optimization', name: 'Process Optimization', category: 'operational', critical: false, requiresApproval: false, description: 'Improve department processes' },
        { id: 'quality_assurance', name: 'Quality Assurance', category: 'operational', critical: false, requiresApproval: false, description: 'Ensure quality standards' }
      ],
      responsibilities: [
        'Team management and development',
        'Department performance tracking',
        'Resource allocation and budgeting',
        'Process optimization and improvement',
        'Quality assurance and standards',
        'Department reporting and analytics'
      ],
      reportingStructure: {
        reportsTo: 'super-admin',
        manages: ['specialists']
      },
      decisionScope: {
        financial: 'Department budget authority up to $5,000',
        operational: 'Department-specific decisions',
        strategic: 'Department strategy alignment',
        personnel: 'Department team management'
      }
    },
    {
      id: 'specialists',
      name: 'Specialists',
      level: 4,
      description: 'Domain experts with specialized tools and focused responsibilities',
      icon: Star,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-yellow-500',
      permissions: [
        { id: 'domain_expertise', name: 'Domain Expertise', category: 'operational', critical: false, requiresApproval: false, description: 'Specialized domain knowledge' },
        { id: 'specific_tools_access', name: 'Specific Tools Access', category: 'system', critical: false, requiresApproval: false, description: 'Access to specialized tools' },
        { id: 'data_analysis', name: 'Data Analysis', category: 'operational', critical: false, requiresApproval: false, description: 'Analyze domain-specific data' },
        { id: 'process_execution', name: 'Process Execution', category: 'operational', critical: false, requiresApproval: false, description: 'Execute specialized processes' },
        { id: 'quality_control', name: 'Quality Control', category: 'operational', critical: false, requiresApproval: false, description: 'Quality control in domain' }
      ],
      responsibilities: [
        'Domain expertise and knowledge application',
        'Specialized tool usage and management',
        'Data analysis and insights generation',
        'Process execution and optimization',
        'Quality control and assurance',
        'Documentation and knowledge sharing'
      ],
      reportingStructure: {
        reportsTo: 'operations-admin',
        manages: []
      },
      decisionScope: {
        financial: 'Limited financial authority up to $1,000',
        operational: 'Domain-specific operational decisions',
        strategic: 'Domain-specific recommendations',
        personnel: 'Individual contributor role'
      }
    },
    {
      id: 'support-staff',
      name: 'Support Staff',
      level: 5,
      description: 'Frontline support with user-focused responsibilities',
      icon: MessageSquare,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      permissions: [
        { id: 'ticket_resolution', name: 'Ticket Resolution', category: 'user', critical: false, requiresApproval: false, description: 'Resolve user support tickets' },
        { id: 'user_assistance', name: 'User Assistance', category: 'user', critical: false, requiresApproval: false, description: 'Provide user assistance' },
        { id: 'basic_moderation', name: 'Basic Moderation', category: 'content', critical: false, requiresApproval: true, description: 'Basic content moderation' },
        { id: 'data_entry', name: 'Data Entry', category: 'operational', critical: false, requiresApproval: false, description: 'System data entry and updates' },
        { id: 'communication', name: 'Communication', category: 'operational', critical: false, requiresApproval: false, description: 'User communication and outreach' }
      ],
      responsibilities: [
        'User ticket resolution and support',
        'Customer assistance and guidance',
        'Basic content moderation tasks',
        'Data entry and system updates',
        'User communication and outreach',
        'Issue escalation to higher levels'
      ],
      reportingStructure: {
        reportsTo: 'operations-admin',
        manages: []
      },
      decisionScope: {
        financial: 'No financial authority',
        operational: 'Basic operational tasks only',
        strategic: 'No strategic authority',
        personnel: 'Individual contributor role'
      }
    }
  ];

  // Sample admin users
  const adminUsers: AdminUser[] = [
    {
      id: 'user-1',
      name: 'Alexandre Dubois',
      email: 'alexandre@annpale.com',
      avatar: '/placeholder.svg?height=40&width=40',
      authorityLevel: 'super-admin',
      department: 'Executive',
      status: 'active',
      joinDate: '2023-01-15',
      lastActive: '2 minutes ago',
      permissions: ['system_config', 'user_role_management', 'financial_oversight']
    },
    {
      id: 'user-2',
      name: 'Marie-Claire Jean',
      email: 'marie.claire@annpale.com',
      avatar: '/placeholder.svg?height=40&width=40',
      authorityLevel: 'operations-admin',
      department: 'Operations',
      status: 'active',
      joinDate: '2023-02-20',
      lastActive: '15 minutes ago',
      permissions: ['user_management', 'content_moderation', 'support_oversight']
    },
    {
      id: 'user-3',
      name: 'Jean-Baptiste Pierre',
      email: 'jean.baptiste@annpale.com',
      avatar: '/placeholder.svg?height=40&width=40',
      authorityLevel: 'department-managers',
      department: 'Finance',
      status: 'active',
      joinDate: '2023-03-10',
      lastActive: '1 hour ago',
      permissions: ['team_management', 'department_metrics', 'resource_allocation']
    },
    {
      id: 'user-4',
      name: 'Fabienne Moïse',
      email: 'fabienne@annpale.com',
      avatar: '/placeholder.svg?height=40&width=40',
      authorityLevel: 'specialists',
      department: 'Content Moderation',
      status: 'active',
      joinDate: '2023-04-05',
      lastActive: '30 minutes ago',
      permissions: ['domain_expertise', 'specific_tools_access', 'data_analysis']
    },
    {
      id: 'user-5',
      name: 'Patrick Moreau',
      email: 'patrick@annpale.com',
      avatar: '/placeholder.svg?height=40&width=40',
      authorityLevel: 'support-staff',
      department: 'Customer Support',
      status: 'active',
      joinDate: '2023-05-12',
      lastActive: '5 minutes ago',
      permissions: ['ticket_resolution', 'user_assistance', 'basic_moderation']
    }
  ];

  const toggleExpanded = (levelId: string) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(levelId)) {
      newExpanded.delete(levelId);
    } else {
      newExpanded.add(levelId);
    }
    setExpandedLevels(newExpanded);
  };

  const handleLevelSelect = (levelId: string) => {
    setActiveLevel(levelId);
    onLevelSelect?.(levelId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsersByLevel = (levelId: string) => {
    return adminUsers.filter(user => user.authorityLevel === levelId);
  };

  const renderHierarchyTree = () => {
    return (
      <div className="space-y-4">
        {authorityLevels.map((level, index) => {
          const Icon = level.icon;
          const isExpanded = expandedLevels.has(level.id);
          const isSelected = activeLevel === level.id;
          const levelUsers = getUsersByLevel(level.id);
          const hasSubLevels = level.reportingStructure.manages.length > 0;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "cursor-pointer transition-all",
                isSelected && "border-2 border-purple-500 ring-2 ring-purple-200"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-4 flex-1"
                      onClick={() => handleLevelSelect(level.id)}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        level.gradient
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">{level.name}</h3>
                          <Badge className="bg-gray-100 text-gray-700">
                            Level {level.level}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700">
                            {levelUsers.length} users
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{level.description}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{level.permissions.length} permissions</span>
                          <span>•</span>
                          <span>{level.responsibilities.length} responsibilities</span>
                          {level.decisionScope.financial !== 'No financial authority' && (
                            <>
                              <span>•</span>
                              <span>{level.decisionScope.financial}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasSubLevels && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(level.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && hasSubLevels && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pl-8 border-l-2 border-gray-200"
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Manages:</h4>
                          {level.reportingStructure.manages.map(managedId => {
                            const managedLevel = authorityLevels.find(l => l.id === managedId);
                            if (!managedLevel) return null;
                            
                            const ManagedIcon = managedLevel.icon;
                            const managedUsers = getUsersByLevel(managedId);
                            
                            return (
                              <div 
                                key={managedId}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => handleLevelSelect(managedId)}
                              >
                                <div className={cn(
                                  "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                                  managedLevel.gradient
                                )}>
                                  <ManagedIcon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{managedLevel.name}</p>
                                  <p className="text-xs text-gray-600">{managedUsers.length} users</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const selectedLevelData = authorityLevels.find(l => l.id === activeLevel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Administrative Authority Hierarchy</h2>
          <p className="text-gray-600">Platform authority structure and access control management</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'hierarchy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('hierarchy')}
          >
            <Network className="h-4 w-4 mr-2" />
            Hierarchy
          </Button>
          <Button
            variant={viewMode === 'permissions' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('permissions')}
          >
            <Lock className="h-4 w-4 mr-2" />
            Permissions
          </Button>
          <Button
            variant={viewMode === 'users' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hierarchy Tree */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Authority Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderHierarchyTree()}
            </CardContent>
          </Card>
        </div>

        {/* Selected Level Details */}
        <div className="space-y-4">
          {selectedLevelData && (
            <>
              {/* Level Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedLevelData.icon className="h-5 w-5" />
                    {selectedLevelData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Authority Level</h4>
                    <Badge className="bg-purple-100 text-purple-700">
                      Level {selectedLevelData.level}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{selectedLevelData.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Decision Scope</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-green-50 rounded">
                        <span className="text-xs font-medium text-green-800">Financial:</span>
                        <p className="text-xs text-green-700">{selectedLevelData.decisionScope.financial}</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <span className="text-xs font-medium text-blue-800">Operational:</span>
                        <p className="text-xs text-blue-700">{selectedLevelData.decisionScope.operational}</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <span className="text-xs font-medium text-purple-800">Strategic:</span>
                        <p className="text-xs text-purple-700">{selectedLevelData.decisionScope.strategic}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              {showPermissions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedLevelData.permissions.map((permission, index) => (
                        <div key={permission.id} className="p-2 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{permission.name}</span>
                            <div className="flex gap-1">
                              {permission.critical && (
                                <Badge className="bg-red-100 text-red-700 text-xs">Critical</Badge>
                              )}
                              {permission.requiresApproval && (
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">Approval Required</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{permission.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Users at Level */}
              {showUsers && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Users ({getUsersByLevel(selectedLevelData.id).length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getUsersByLevel(selectedLevelData.id).map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 border rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{user.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-600">{user.department}</p>
                              <Badge className={cn("text-xs", getStatusColor(user.status))}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
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