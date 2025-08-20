'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Award,
  Filter,
  Search,
  Eye,
  Ban,
  MessageSquare,
  FileText,
  Settings,
  ChevronRight,
  Flag,
  UserCheck,
  UserX,
  Timer,
  BarChart3,
  Hash,
  Zap,
  Target,
  Calendar,
  Bell,
  Info,
  RefreshCw,
  Download,
  Upload,
  Star,
  Gavel,
  Scale,
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ModeratorStats {
  totalReports: number;
  resolvedToday: number;
  pendingReview: number;
  escalatedCases: number;
  averageResponseTime: string;
  accuracyRate: number;
  activeModeratorActions: number;
  communityHealth: number;
}

interface ModeratorAction {
  id: string;
  type: 'warn' | 'timeout' | 'ban' | 'content-removal' | 'escalate' | 'dismiss';
  targetUser?: string;
  targetContent?: string;
  reason: string;
  timestamp: Date;
  moderator: string;
  duration?: number;
  notes?: string;
  appealable: boolean;
  appealed?: boolean;
}

interface ActiveCase {
  id: string;
  reportId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'awaiting-response' | 'resolved';
  assignedTo?: string;
  reportCount: number;
  lastActivity: Date;
  priority: number;
}

interface ModeratorTeam {
  id: string;
  name: string;
  avatar: string;
  role: 'volunteer' | 'staff' | 'senior' | 'admin';
  status: 'online' | 'away' | 'offline';
  casesHandled: number;
  responseTime: string;
  accuracy: number;
  specialties: string[];
  currentLoad: number;
  maxLoad: number;
}

interface ModeratorDashboardProps {
  moderatorId?: string;
  role?: 'volunteer' | 'staff' | 'senior' | 'admin';
  onTakeAction?: (action: ModeratorAction) => void;
  onAssignCase?: (caseId: string, moderatorId: string) => void;
  onEscalateCase?: (caseId: string, reason: string) => void;
  onUpdateSettings?: (settings: any) => void;
  showAnalytics?: boolean;
  showTeam?: boolean;
}

export function ModeratorDashboard({
  moderatorId = 'mod1',
  role = 'staff',
  onTakeAction,
  onAssignCase,
  onEscalateCase,
  onUpdateSettings,
  showAnalytics = true,
  showTeam = true
}: ModeratorDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'cases' | 'actions' | 'team' | 'analytics'>('overview');
  const [selectedCase, setSelectedCase] = React.useState<ActiveCase | null>(null);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [timeRange, setTimeRange] = React.useState('today');

  // Moderator statistics
  const stats: ModeratorStats = {
    totalReports: 234,
    resolvedToday: 45,
    pendingReview: 23,
    escalatedCases: 5,
    averageResponseTime: '12 min',
    accuracyRate: 96.5,
    activeModeratorActions: 8,
    communityHealth: 85
  };

  // Active cases
  const activeCases: ActiveCase[] = [
    {
      id: 'case1',
      reportId: 'report123',
      type: 'harassment',
      severity: 'high',
      status: 'investigating',
      assignedTo: moderatorId,
      reportCount: 5,
      lastActivity: new Date(Date.now() - 10 * 60 * 1000),
      priority: 9
    },
    {
      id: 'case2',
      reportId: 'report124',
      type: 'spam',
      severity: 'medium',
      status: 'new',
      reportCount: 3,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      priority: 5
    },
    {
      id: 'case3',
      reportId: 'report125',
      type: 'misinformation',
      severity: 'critical',
      status: 'awaiting-response',
      assignedTo: moderatorId,
      reportCount: 12,
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      priority: 10
    }
  ];

  // Recent actions
  const recentActions: ModeratorAction[] = [
    {
      id: 'action1',
      type: 'timeout',
      targetUser: 'user123',
      reason: 'Repeated harassment of community members',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      moderator: 'John Doe',
      duration: 24 * 60 * 60,
      appealable: true
    },
    {
      id: 'action2',
      type: 'content-removal',
      targetContent: 'post456',
      reason: 'Explicit content violation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      moderator: 'Jane Smith',
      appealable: true,
      appealed: true
    },
    {
      id: 'action3',
      type: 'warn',
      targetUser: 'user789',
      reason: 'First offense - spam posting',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      moderator: 'Mike Johnson',
      appealable: false
    }
  ];

  // Moderator team
  const moderatorTeam: ModeratorTeam[] = [
    {
      id: 'mod1',
      name: 'Sarah Martinez',
      avatar: '👩🏾‍💼',
      role: 'senior',
      status: 'online',
      casesHandled: 156,
      responseTime: '8 min',
      accuracy: 98.2,
      specialties: ['harassment', 'hate-speech'],
      currentLoad: 5,
      maxLoad: 10
    },
    {
      id: 'mod2',
      name: 'Jean Baptiste',
      avatar: '👨🏾‍💻',
      role: 'staff',
      status: 'online',
      casesHandled: 89,
      responseTime: '15 min',
      accuracy: 94.5,
      specialties: ['spam', 'misinformation'],
      currentLoad: 3,
      maxLoad: 8
    },
    {
      id: 'mod3',
      name: 'Marie Claire',
      avatar: '👩🏾‍🎨',
      role: 'volunteer',
      status: 'away',
      casesHandled: 34,
      responseTime: '20 min',
      accuracy: 92.1,
      specialties: ['copyright', 'nsfw'],
      currentLoad: 2,
      maxLoad: 5
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'investigating': return 'bg-yellow-100 text-yellow-700';
      case 'awaiting-response': return 'bg-orange-100 text-orange-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'warn': return AlertTriangle;
      case 'timeout': return Timer;
      case 'ban': return Ban;
      case 'content-removal': return XCircle;
      case 'escalate': return TrendingUp;
      case 'dismiss': return CheckCircle;
      default: return Flag;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalReports}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <FileText className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.resolvedToday}</div>
                <div className="text-sm text-gray-600">Resolved Today</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.pendingReview}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.escalatedCases}</div>
                <div className="text-sm text-gray-600">Escalated</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="font-medium">{stats.averageResponseTime}</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Accuracy Rate</span>
                <span className="font-medium">{stats.accuracyRate}%</span>
              </div>
              <Progress value={stats.accuracyRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Community Health</span>
                <span className="font-medium">{stats.communityHealth}%</span>
              </div>
              <Progress value={stats.communityHealth} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Priority Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeCases
              .filter(c => c.priority >= 8)
              .map((case_) => (
              <div key={case_.id} className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={getSeverityColor(case_.severity)}>
                      {case_.severity}
                    </Badge>
                    <span className="font-medium">{case_.type}</span>
                    <Badge variant="outline" className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{case_.reportCount} reports</span>
                    <span>Priority: {case_.priority}/10</span>
                    <span>{Math.floor((Date.now() - case_.lastActivity.getTime()) / 60000)} min ago</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedCase(case_)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Moderator Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.slice(0, 3).map((action) => {
              const ActionIcon = getActionIcon(action.type);
              return (
                <div key={action.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <ActionIcon className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {action.type === 'timeout' && `Timeout: ${action.targetUser} for ${action.duration / 3600}h`}
                      {action.type === 'content-removal' && `Removed content: ${action.targetContent}`}
                      {action.type === 'warn' && `Warning issued to ${action.targetUser}`}
                    </div>
                    <div className="text-xs text-gray-500">{action.reason}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.floor((Date.now() - action.timestamp.getTime()) / 60000)} min ago
                  </div>
                  {action.appealed && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                      Appealed
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCases = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Cases</option>
              <option value="new">New</option>
              <option value="investigating">Investigating</option>
              <option value="awaiting-response">Awaiting Response</option>
              <option value="resolved">Resolved</option>
            </select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {activeCases
          .filter(c => filterStatus === 'all' || c.status === filterStatus)
          .map((case_) => (
          <Card key={case_.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className={getSeverityColor(case_.severity)}>
                      {case_.severity}
                    </Badge>
                    <span className="font-medium">Case #{case_.id}</span>
                    <Badge variant="outline" className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                    {case_.assignedTo && (
                      <Badge variant="secondary" className="text-xs">
                        Assigned to: {case_.assignedTo}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="font-medium mb-1">Type: {case_.type}</div>
                    <div className="text-sm text-gray-600">Report ID: {case_.reportId}</div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{case_.reportCount} reports</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>Priority: {case_.priority}/10</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor((Date.now() - case_.lastActivity.getTime()) / 60000)} min ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => setSelectedCase(case_)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  {!case_.assignedTo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAssignCase?.(case_.id, moderatorId)}
                    >
                      Assign to Me
                    </Button>
                  )}
                  {case_.severity === 'critical' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onEscalateCase?.(case_.id, 'Critical severity')}
                    >
                      Escalate
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moderator Team Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {moderatorTeam.map((mod) => (
              <Card key={mod.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={mod.avatar} />
                        <AvatarFallback>{mod.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                        mod.status === 'online' && "bg-green-500",
                        mod.status === 'away' && "bg-yellow-500",
                        mod.status === 'offline' && "bg-gray-400"
                      )} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{mod.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {mod.role}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Cases:</span>
                          <span className="ml-1 font-medium">{mod.casesHandled}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Response:</span>
                          <span className="ml-1 font-medium">{mod.responseTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Accuracy:</span>
                          <span className="ml-1 font-medium text-green-600">{mod.accuracy}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Load:</span>
                          <span className="ml-1 font-medium">{mod.currentLoad}/{mod.maxLoad}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Specialties:</div>
                        <div className="flex flex-wrap gap-1">
                          {mod.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress 
                          value={(mod.currentLoad / mod.maxLoad) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">324</div>
                <div className="text-sm text-gray-600">Cases Resolved Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">95.8%</div>
                <div className="text-sm text-gray-600">Team Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">11 min</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Moderation Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Report Categories</h4>
              <div className="space-y-2">
                {['Harassment', 'Spam', 'NSFW', 'Misinformation', 'Copyright'].map((category) => {
                  const percentage = Math.floor(Math.random() * 40) + 10;
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div className="w-24 text-sm">{category}</div>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <div className="text-sm font-medium">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Action Types</h4>
              <div className="space-y-2">
                {['Warnings', 'Timeouts', 'Content Removal', 'Bans', 'Escalations'].map((action) => {
                  const count = Math.floor(Math.random() * 50) + 5;
                  return (
                    <div key={action} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{action}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Moderator Dashboard</h2>
          <p className="text-gray-600">Manage community safety and content moderation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            {role}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'cases', label: 'Active Cases', icon: FileText },
            { id: 'actions', label: 'Recent Actions', icon: Gavel },
            { id: 'team', label: 'Team', icon: Users, show: showTeam },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, show: showAnalytics }
          ].filter(tab => tab.show !== false).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'cases' && renderCases()}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              {recentActions.map((action) => {
                const ActionIcon = getActionIcon(action.type);
                return (
                  <Card key={action.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <ActionIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <div className="font-medium">
                            {action.type.charAt(0).toUpperCase() + action.type.slice(1).replace('-', ' ')}
                          </div>
                          <div className="text-sm text-gray-600">{action.reason}</div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>By {action.moderator}</span>
                            <span>{Math.floor((Date.now() - action.timestamp.getTime()) / 60000)} min ago</span>
                            {action.duration && <span>Duration: {action.duration / 3600}h</span>}
                          </div>
                        </div>
                        {action.appealable && (
                          <Badge variant="outline" className={action.appealed ? "bg-orange-50 text-orange-700" : ""}>
                            {action.appealed ? "Appealed" : "Appealable"}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {activeTab === 'team' && showTeam && renderTeam()}
          {activeTab === 'analytics' && showAnalytics && renderAnalytics()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}