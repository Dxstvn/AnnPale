"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Coffee, 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  MessageCircle, 
  Video, 
  Upload, 
  TrendingUp,
  Wallet,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkflowStage {
  id: string
  label: string
  icon: React.ElementType
  status: 'completed' | 'current' | 'upcoming' | 'skipped'
  action?: string
  count?: number
  time?: string
}

interface WorkflowStagesProps {
  currentStage: string
  pendingRequests: number
  todayEarnings: number
  onStageAction?: (stageId: string) => void
}

export function WorkflowStages({ 
  currentStage, 
  pendingRequests, 
  todayEarnings,
  onStageAction 
}: WorkflowStagesProps) {
  const stages: WorkflowStage[] = [
    {
      id: 'check-in',
      label: 'Morning Check-in',
      icon: Coffee,
      status: currentStage === 'check-in' ? 'current' : 'completed',
      time: '8:00 AM'
    },
    {
      id: 'review',
      label: 'Review Requests',
      icon: FileText,
      status: pendingRequests > 0 ? 'current' : 'completed',
      count: pendingRequests,
      action: 'Review Now'
    },
    {
      id: 'plan',
      label: 'Plan Recordings',
      icon: Calendar,
      status: currentStage === 'plan' ? 'current' : 'upcoming',
      action: 'Open Calendar'
    },
    {
      id: 'earnings',
      label: 'Check Earnings',
      icon: DollarSign,
      status: 'completed',
      count: todayEarnings
    },
    {
      id: 'accept',
      label: 'Accept/Decline',
      icon: CheckCircle,
      status: pendingRequests > 0 ? 'current' : 'upcoming',
      action: 'Manage Requests'
    },
    {
      id: 'batch',
      label: 'Batch Similar',
      icon: FileText,
      status: 'upcoming',
      action: 'Group Requests'
    },
    {
      id: 'respond',
      label: 'Respond to Messages',
      icon: MessageCircle,
      status: 'upcoming',
      count: 3,
      action: 'Open Messages'
    },
    {
      id: 'expectations',
      label: 'Set Expectations',
      icon: MessageCircle,
      status: 'upcoming'
    },
    {
      id: 'record',
      label: 'Record Videos',
      icon: Video,
      status: currentStage === 'record' ? 'current' : 'upcoming',
      action: 'Start Recording'
    },
    {
      id: 'upload',
      label: 'Upload & Deliver',
      icon: Upload,
      status: 'upcoming',
      action: 'Upload Videos'
    },
    {
      id: 'track',
      label: 'Track Performance',
      icon: TrendingUp,
      status: 'upcoming',
      action: 'View Analytics'
    },
    {
      id: 'withdraw',
      label: 'Withdraw Earnings',
      icon: Wallet,
      status: 'upcoming',
      action: 'Manage Payouts'
    }
  ]

  // Group stages by workflow phase
  const workflowPhases = [
    {
      name: 'Morning Routine',
      stages: stages.slice(0, 4)
    },
    {
      name: 'Request Management',
      stages: stages.slice(4, 8)
    },
    {
      name: 'Content Creation',
      stages: stages.slice(8, 10)
    },
    {
      name: 'Business Management',
      stages: stages.slice(10, 12)
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {workflowPhases.map((phase, phaseIndex) => (
            <div key={phaseIndex}>
              <h3 className="text-sm font-medium text-gray-600 mb-3">{phase.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {phase.stages.map((stage, index) => {
                  const Icon = stage.icon
                  const isActive = stage.status === 'current'
                  const isCompleted = stage.status === 'completed'
                  
                  return (
                    <div
                      key={stage.id}
                      className={cn(
                        "relative p-3 rounded-lg border transition-all",
                        isActive && "border-purple-500 bg-purple-50",
                        isCompleted && "border-green-500 bg-green-50",
                        !isActive && !isCompleted && "border-gray-200 bg-white"
                      )}
                    >
                      {/* Connection line to next stage */}
                      {index < phase.stages.length - 1 && (
                        <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hidden lg:block" />
                      )}
                      
                      <div className="flex items-start justify-between mb-2">
                        <Icon className={cn(
                          "h-5 w-5",
                          isActive && "text-purple-600",
                          isCompleted && "text-green-600",
                          !isActive && !isCompleted && "text-gray-400"
                        )} />
                        {stage.count !== undefined && (
                          <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                            {stage.count}
                          </Badge>
                        )}
                      </div>
                      
                      <p className={cn(
                        "text-sm font-medium mb-1",
                        isActive && "text-purple-900",
                        isCompleted && "text-green-900",
                        !isActive && !isCompleted && "text-gray-600"
                      )}>
                        {stage.label}
                      </p>
                      
                      {stage.time && (
                        <p className="text-xs text-gray-500">{stage.time}</p>
                      )}
                      
                      {stage.action && isActive && (
                        <Button
                          size="sm"
                          className="w-full mt-2 h-7 text-xs"
                          onClick={() => onStageAction?.(stage.id)}
                        >
                          {stage.action}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Today's Progress</p>
              <p className="text-xs text-gray-600 mt-1">
                {stages.filter(s => s.status === 'completed').length} of {stages.length} tasks completed
              </p>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((stages.filter(s => s.status === 'completed').length / stages.length) * 100)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}