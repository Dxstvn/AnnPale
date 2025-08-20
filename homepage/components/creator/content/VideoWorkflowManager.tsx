"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  ArrowRight,
  Camera,
  Eye,
  Edit3,
  Upload,
  Cog,
  CheckCircle,
  Send,
  PlayCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  FileVideo,
  Zap,
  Target,
  Users,
  Star,
  TrendingUp,
  Settings,
  Play,
  Pause,
  Square
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkflowStage {
  id: string
  name: string
  description: string
  icon: React.ElementType
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'needs-attention'
  estimatedTime: number // in minutes
  completedAt?: string
  requirements?: string[]
  outputs?: string[]
  nextStages?: string[]
}

interface VideoProject {
  id: string
  title: string
  customer: string
  occasion: string
  currentStage: string
  progress: number
  createdAt: string
  dueDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  stages: Record<string, WorkflowStage>
  metadata: {
    recordingAttempts: number
    qualityScore?: number
    customerFeedback?: string
    earnings: number
  }
}

interface VideoWorkflowManagerProps {
  projects: VideoProject[]
  onStageUpdate?: (projectId: string, stageId: string, updates: Partial<WorkflowStage>) => void
  onProjectAction?: (projectId: string, action: string) => void
  onBulkStatusUpdate?: (projectIds: string[], status: string) => void
}

export function VideoWorkflowManager({
  projects,
  onStageUpdate,
  onProjectAction,
  onBulkStatusUpdate
}: VideoWorkflowManagerProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'pipeline' | 'kanban' | 'timeline'>('pipeline')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())

  // Workflow pipeline definition
  const workflowStages: Record<string, Omit<WorkflowStage, 'status' | 'completedAt'>> = {
    'start-recording': {
      id: 'start-recording',
      name: 'Start Recording',
      description: 'Begin video recording session',
      icon: Camera,
      estimatedTime: 5,
      requirements: ['Request details reviewed', 'Recording setup ready'],
      outputs: ['Recording session started'],
      nextStages: ['preview-edit']
    },
    'preview-edit': {
      id: 'preview-edit',
      name: 'Preview & Edit',
      description: 'Review recording and make basic edits',
      icon: Eye,
      estimatedTime: 10,
      requirements: ['Recording completed'],
      outputs: ['Video previewed', 'Basic edits applied'],
      nextStages: ['add-effects']
    },
    'add-effects': {
      id: 'add-effects',
      name: 'Add Effects',
      description: 'Apply filters, transitions, and enhancements',
      icon: Edit3,
      estimatedTime: 15,
      requirements: ['Preview approved'],
      outputs: ['Effects applied', 'Final touches added'],
      nextStages: ['upload-progress']
    },
    'upload-progress': {
      id: 'upload-progress',
      name: 'Upload Progress',
      description: 'Upload video file to servers',
      icon: Upload,
      estimatedTime: 8,
      requirements: ['Video finalized'],
      outputs: ['File uploaded'],
      nextStages: ['processing']
    },
    'processing': {
      id: 'processing',
      name: 'Processing',
      description: 'Server-side video processing and encoding',
      icon: Cog,
      estimatedTime: 12,
      requirements: ['Upload completed'],
      outputs: ['Video processed', 'Multiple formats generated'],
      nextStages: ['quality-check']
    },
    'quality-check': {
      id: 'quality-check',
      name: 'Quality Check',
      description: 'Automated and manual quality verification',
      icon: CheckCircle,
      estimatedTime: 5,
      requirements: ['Processing completed'],
      outputs: ['Quality approved'],
      nextStages: ['ready-to-send']
    },
    'ready-to-send': {
      id: 'ready-to-send',
      name: 'Ready to Send',
      description: 'Video ready for delivery to customer',
      icon: Send,
      estimatedTime: 2,
      requirements: ['Quality check passed'],
      outputs: ['Ready for delivery'],
      nextStages: ['delivered']
    },
    'delivered': {
      id: 'delivered',
      name: 'Delivered',
      description: 'Video sent to customer',
      icon: PlayCircle,
      estimatedTime: 1,
      requirements: ['Final approval'],
      outputs: ['Customer notified', 'Download link sent'],
      nextStages: ['customer-viewed']
    },
    'customer-viewed': {
      id: 'customer-viewed',
      name: 'Customer Viewed',
      description: 'Customer has accessed and viewed the video',
      icon: Star,
      estimatedTime: 0,
      requirements: ['Video delivered'],
      outputs: ['View tracking', 'Feedback collection'],
      nextStages: []
    }
  }

  const getStageStatus = (project: VideoProject, stageId: string): WorkflowStage['status'] => {
    const stage = project.stages[stageId]
    if (!stage) return 'not-started'
    
    if (project.currentStage === stageId) return 'in-progress'
    if (stage.completedAt) return 'completed'
    
    const stageIndex = Object.keys(workflowStages).indexOf(stageId)
    const currentStageIndex = Object.keys(workflowStages).indexOf(project.currentStage)
    
    if (stageIndex < currentStageIndex) return 'completed'
    if (stageIndex === currentStageIndex) return 'in-progress'
    return 'not-started'
  }

  const getStatusColor = (status: WorkflowStage['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getPriorityColor = (priority: VideoProject['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const calculateTotalTime = (project: VideoProject) => {
    return Object.keys(workflowStages).reduce((total, stageId) => {
      const status = getStageStatus(project, stageId)
      if (status === 'not-started') return total + workflowStages[stageId].estimatedTime
      return total
    }, 0)
  }

  const getProjectsInStage = (stageId: string) => {
    return projects.filter(p => p.currentStage === stageId)
  }

  const filteredProjects = projects.filter(project => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'in-progress') return project.progress > 0 && project.progress < 100
    if (filterStatus === 'completed') return project.progress === 100
    if (filterStatus === 'urgent') return project.priority === 'urgent'
    if (filterStatus === 'blocked') return Object.values(project.stages).some(s => s.status === 'blocked')
    return true
  })

  const handleProjectSelect = (projectId: string) => {
    const newSelected = new Set(selectedProjects)
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId)
    } else {
      newSelected.add(projectId)
    }
    setSelectedProjects(newSelected)
  }

  const handleStageAction = (projectId: string, stageId: string, action: string) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return

    switch (action) {
      case 'start':
        onStageUpdate?.(projectId, stageId, { 
          status: 'in-progress'
        })
        break
      case 'complete':
        onStageUpdate?.(projectId, stageId, { 
          status: 'completed',
          completedAt: new Date().toISOString()
        })
        // Move to next stage
        const nextStages = workflowStages[stageId].nextStages
        if (nextStages && nextStages.length > 0) {
          onProjectAction?.(projectId, `move-to-${nextStages[0]}`)
        }
        break
      case 'block':
        onStageUpdate?.(projectId, stageId, { 
          status: 'blocked'
        })
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video Workflow</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track your video production pipeline across {projects.length} active projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">All Projects</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="urgent">Urgent</option>
            <option value="blocked">Blocked</option>
          </select>
          {selectedProjects.size > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkStatusUpdate?.(Array.from(selectedProjects), 'priority-high')}
            >
              Bulk Actions ({selectedProjects.size})
            </Button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        {[
          { id: 'pipeline', name: 'Pipeline View', icon: TrendingUp },
          { id: 'kanban', name: 'Kanban Board', icon: Target },
          { id: 'timeline', name: 'Timeline', icon: Clock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors",
              activeTab === tab.id
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const isSelected = selectedProjects.has(project.id)
            const totalTime = calculateTotalTime(project)
            
            return (
              <Card 
                key={project.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  isSelected && "ring-2 ring-purple-500 bg-purple-50"
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleProjectSelect(project.id)}
                        className="rounded border-gray-300"
                      />
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {project.customer} • {project.occasion}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                      <Badge variant="outline">
                        {project.progress}% complete
                      </Badge>
                      <Badge variant="outline">
                        {formatTime(totalTime)} remaining
                      </Badge>
                    </div>
                  </div>
                  
                  <Progress value={project.progress} className="mt-4" />
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Workflow Stages */}
                    <div className="lg:col-span-2">
                      <h4 className="font-medium mb-3">Production Pipeline</h4>
                      <div className="space-y-3">
                        {Object.entries(workflowStages).map(([stageId, stage], index) => {
                          const status = getStageStatus(project, stageId)
                          const Icon = stage.icon
                          const isActive = project.currentStage === stageId
                          
                          return (
                            <div key={stageId} className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                status === 'completed' ? "bg-green-100 text-green-600" :
                                status === 'in-progress' ? "bg-blue-100 text-blue-600" :
                                status === 'blocked' ? "bg-red-100 text-red-600" :
                                "bg-gray-100 text-gray-400"
                              )}>
                                <Icon className="h-4 w-4" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className={cn(
                                      "font-medium",
                                      isActive && "text-blue-600"
                                    )}>
                                      {stage.name}
                                    </h5>
                                    <p className="text-xs text-gray-600">{stage.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(status)} variant="secondary">
                                      {status.replace('-', ' ')}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatTime(stage.estimatedTime)}
                                    </span>
                                  </div>
                                </div>
                                
                                {isActive && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleStageAction(project.id, stageId, 'start')}
                                    >
                                      <Play className="h-3 w-3 mr-1" />
                                      Start
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleStageAction(project.id, stageId, 'complete')}
                                    >
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Complete
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleStageAction(project.id, stageId, 'block')}
                                    >
                                      <Square className="h-3 w-3 mr-1" />
                                      Block
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              {index < Object.keys(workflowStages).length - 1 && (
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Project Details */}
                    <div>
                      <h4 className="font-medium mb-3">Project Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Attempts:</span>
                          <span>{project.metadata.recordingAttempts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Earnings:</span>
                          <span className="font-medium text-green-600">
                            ${project.metadata.earnings}
                          </span>
                        </div>
                        {project.metadata.qualityScore && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quality:</span>
                            <span className="font-medium">{project.metadata.qualityScore}/100</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => onProjectAction?.(project.id, 'view-details')}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Manage Project
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Kanban View */}
      {activeTab === 'kanban' && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {Object.entries(workflowStages).map(([stageId, stage]) => {
              const projectsInStage = getProjectsInStage(stageId)
              const Icon = stage.icon
              
              return (
                <div key={stageId} className="w-72 flex-shrink-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-purple-600" />
                        <CardTitle className="text-sm">{stage.name}</CardTitle>
                        <Badge variant="secondary">{projectsInStage.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {projectsInStage.map((project) => (
                        <Card key={project.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm truncate">{project.title}</h4>
                            <p className="text-xs text-gray-600">{project.customer}</p>
                            <div className="flex items-center justify-between">
                              <Badge className={getPriorityColor(project.priority)} variant="secondary">
                                {project.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                ${project.metadata.earnings}
                              </span>
                            </div>
                            <Progress value={project.progress} className="h-1" />
                          </div>
                        </Card>
                      ))}
                      
                      {projectsInStage.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-sm">No projects in this stage</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .map((project) => (
                    <div key={project.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.customer} • {project.occasion}</p>
                        <Progress value={project.progress} className="mt-2 w-full max-w-sm" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-600">Stage: {workflowStages[project.currentStage]?.name}</p>
                      </div>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}