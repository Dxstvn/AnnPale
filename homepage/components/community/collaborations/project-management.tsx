'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Edit,
  Send,
  Share2,
  Flag,
  Star,
  Trophy,
  Target,
  Briefcase,
  Video,
  Phone,
  Mail,
  Link,
  Filter,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Settings,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Archive,
  Trash2,
  UserPlus,
  UserMinus,
  Bell,
  BellOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  skills: string[];
  joinedAt: Date;
  lastActive: Date;
  hoursLogged: number;
  tasksCompleted: number;
  isOnline: boolean;
  permissions: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: ProjectMember;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
  tags: string[];
  files: ProjectFile[];
  comments: TaskComment[];
}

interface TaskComment {
  id: string;
  author: ProjectMember;
  content: string;
  timestamp: Date;
  edited: boolean;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: ProjectMember;
  uploadedAt: Date;
  url: string;
  version: number;
  isShared: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'upcoming' | 'active' | 'completed' | 'overdue';
  tasks: string[];
  completionPercentage: number;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  budget?: number;
  currency: string;
  owner: ProjectMember;
  members: ProjectMember[];
  tasks: Task[];
  milestones: Milestone[];
  files: ProjectFile[];
  totalHours: number;
  completionPercentage: number;
  lastActivity: Date;
  isPrivate: boolean;
  categories: string[];
  tags: string[];
}

interface ProjectManagementProps {
  projectId: string;
  currentUserId: string;
  userRole: 'owner' | 'admin' | 'member' | 'guest';
  onUpdateProject?: (projectData: Partial<ProjectData>) => void;
  onInviteMember?: (email: string, role: string) => void;
  onRemoveMember?: (memberId: string) => void;
  onCreateTask?: (task: Partial<Task>) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onUploadFile?: (file: File) => void;
  onScheduleMeeting?: (meeting: any) => void;
}

export function ProjectManagement({
  projectId,
  currentUserId,
  userRole,
  onUpdateProject,
  onInviteMember,
  onRemoveMember,
  onCreateTask,
  onUpdateTask,
  onUploadFile,
  onScheduleMeeting
}: ProjectManagementProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'tasks' | 'team' | 'files' | 'timeline'>('overview');
  const [showCreateTask, setShowCreateTask] = React.useState(false);
  const [showInviteMember, setShowInviteMember] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskDescription, setNewTaskDescription] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState<ProjectMember | null>(null);
  const [taskFilter, setTaskFilter] = React.useState<'all' | 'todo' | 'in-progress' | 'review' | 'completed'>('all');

  // Sample project data
  const projectData: ProjectData = {
    id: projectId,
    title: 'Haiti Heritage Documentary Series',
    description: 'Creating a 6-part documentary series about Haitian heritage in the diaspora, featuring interviews, historical footage, and cultural celebrations.',
    status: 'active',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 160 * 24 * 60 * 60 * 1000),
    budget: 10000,
    currency: 'USD',
    owner: {
      id: 'owner1',
      name: 'Marie Delacroix',
      avatar: '👩🏾‍🎨',
      role: 'owner',
      skills: ['Video Production', 'Creative Direction'],
      joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
      hoursLogged: 45,
      tasksCompleted: 8,
      isOnline: true,
      permissions: ['all']
    },
    members: [
      {
        id: 'member1',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍💻',
        role: 'admin',
        skills: ['Video Editing', 'Sound Design'],
        joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        hoursLogged: 32,
        tasksCompleted: 6,
        isOnline: true,
        permissions: ['edit', 'invite', 'manage_tasks']
      },
      {
        id: 'member2',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍🏫',
        role: 'member',
        skills: ['Research', 'Translation'],
        joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
        hoursLogged: 28,
        tasksCompleted: 5,
        isOnline: false,
        permissions: ['view', 'comment', 'upload']
      }
    ],
    tasks: [
      {
        id: 'task1',
        title: 'Research historical archives',
        description: 'Gather historical footage and photographs from Haitian archives and museums',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        estimatedHours: 20,
        actualHours: 18,
        assignee: {
          id: 'member2',
          name: 'Sophia Laurent',
          avatar: '👩🏾‍🏫',
          role: 'member',
          skills: ['Research'],
          joinedAt: new Date(),
          lastActive: new Date(),
          hoursLogged: 0,
          tasksCompleted: 0,
          isOnline: false,
          permissions: []
        },
        dependencies: [],
        tags: ['research', 'archives'],
        files: [],
        comments: []
      },
      {
        id: 'task2',
        title: 'Interview community elders',
        description: 'Conduct and record interviews with elderly members of the Haitian community about their experiences',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        estimatedHours: 40,
        actualHours: 15,
        dependencies: ['task1'],
        tags: ['interviews', 'recording'],
        files: [],
        comments: []
      },
      {
        id: 'task3',
        title: 'Edit Episode 1',
        description: 'Compile and edit footage for the first episode focusing on immigration stories',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        estimatedHours: 30,
        dependencies: ['task2'],
        tags: ['editing', 'episode-1'],
        files: [],
        comments: []
      }
    ],
    milestones: [
      {
        id: 'milestone1',
        title: 'Pre-production Complete',
        description: 'All research, interviews, and planning completed',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        tasks: ['task1', 'task2'],
        completionPercentage: 75
      },
      {
        id: 'milestone2',
        title: 'First Three Episodes',
        description: 'Episodes 1-3 edited and ready for review',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'upcoming',
        tasks: ['task3'],
        completionPercentage: 0
      }
    ],
    files: [],
    totalHours: 105,
    completionPercentage: 35,
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isPrivate: false,
    categories: ['Creative', 'Documentary'],
    tags: ['haiti', 'heritage', 'documentary', 'culture']
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'on-hold': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const canEdit = userRole === 'owner' || userRole === 'admin';
  const canInvite = userRole === 'owner' || userRole === 'admin';

  const filteredTasks = projectData.tasks.filter(task => 
    taskFilter === 'all' || task.status === taskFilter
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{projectData.title}</CardTitle>
              <p className="text-gray-600 mb-4">{projectData.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className={getStatusColor(projectData.status)}>
                  {projectData.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Started {Math.floor((Date.now() - projectData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                </span>
                {projectData.budget && (
                  <span className="text-sm text-gray-500">
                    Budget: ${projectData.budget.toLocaleString()} {projectData.currency}
                  </span>
                )}
              </div>
            </div>
            {canEdit && (
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{projectData.completionPercentage}%</div>
              <div className="text-sm text-gray-600">Complete</div>
              <Progress value={projectData.completionPercentage} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{projectData.members.length + 1}</div>
              <div className="text-sm text-gray-600">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{projectData.tasks.length}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{projectData.totalHours}</div>
              <div className="text-sm text-gray-600">Hours Logged</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['todo', 'in-progress', 'review', 'completed'].map((status) => {
                const count = projectData.tasks.filter(t => t.status === status).length;
                const percentage = (count / projectData.tasks.length) * 100;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getTaskStatusColor(status)}>
                        {status.replace('-', ' ')}
                      </Badge>
                      <span className="text-sm">{count} tasks</span>
                    </div>
                    <div className="w-24">
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectData.milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <Badge variant="outline" className={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Due: {milestone.dueDate.toLocaleDateString()}
                  </div>
                  <Progress value={milestone.completionPercentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src="👩🏾‍🏫" />
                <AvatarFallback>SL</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium">Sophia Laurent</span> completed task "Research historical archives"
                </div>
                <div className="text-xs text-gray-500">3 days ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src="👨🏾‍💻" />
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium">Marcus Thompson</span> joined the project
                </div>
                <div className="text-xs text-gray-500">5 days ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      {/* Task Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">Tasks</h3>
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value as any)}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {canEdit && (
          <Button onClick={() => setShowCreateTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={task.assignee.avatar} />
                          <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{task.assignee.name}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due {task.dueDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.estimatedHours && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.estimatedHours}h estimated</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {canEdit && (
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="max-w-lg w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create New Task</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowCreateTask(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Task Title</label>
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Describe the task..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => {
                      if (newTaskTitle.trim()) {
                        onCreateTask?.({
                          title: newTaskTitle,
                          description: newTaskDescription,
                          status: 'todo',
                          priority: 'medium'
                        });
                        setNewTaskTitle('');
                        setNewTaskDescription('');
                        setShowCreateTask(false);
                      }
                    }}
                    className="flex-1"
                  >
                    Create Task
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Team Members</h3>
        {canInvite && (
          <Button onClick={() => setShowInviteMember(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Team Members */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Project Owner */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={projectData.owner.avatar} />
                  <AvatarFallback>{projectData.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {projectData.owner.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{projectData.owner.name}</h4>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    Owner
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">{projectData.owner.skills.join(', ')}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {projectData.owner.hoursLogged}h logged • {projectData.owner.tasksCompleted} tasks completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        {projectData.members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{member.name}</h4>
                    <Badge variant="outline" className={
                      member.role === 'admin' 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-gray-100 text-gray-700"
                    }>
                      {member.role}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">{member.skills.join(', ')}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {member.hoursLogged}h logged • {member.tasksCompleted} tasks completed
                  </div>
                </div>
                {canEdit && member.role !== 'owner' && (
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Project Management</h2>
          <p className="text-gray-600">Collaborate effectively with your team</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Briefcase },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'files', label: 'Files', icon: FileText },
            { id: 'timeline', label: 'Timeline', icon: Calendar }
          ].map((tab) => (
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
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'files' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">File Management</h3>
              <p className="text-gray-600">Share files and documents with your team</p>
            </div>
          )}
          {activeTab === 'timeline' && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Timeline</h3>
              <p className="text-gray-600">Track milestones and deadlines</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}