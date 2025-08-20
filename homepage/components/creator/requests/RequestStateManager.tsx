"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  PlayCircle, 
  PauseCircle, 
  Edit, 
  Send,
  Download,
  AlertCircle,
  RefreshCw,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export type RequestState = 'new' | 'accepted' | 'recording' | 'in-review' | 'delivered' | 'expired'

interface RequestStateConfig {
  label: string
  icon: React.ElementType
  visual: {
    badge: string
    indicator: string
    progress?: number
  }
  actions: {
    primary?: string
    secondary?: string
    tertiary?: string
  }
  timePressure: 'none' | 'low' | 'medium' | 'high'
  bulkSupport: boolean
  countdown?: {
    type: 'response' | 'delivery'
    deadline: string
  }
}

interface RequestStateManagerProps {
  state: RequestState
  hoursRemaining?: number
  deliveryDeadline?: string
  onStateAction?: (action: string) => void
  onBulkSelect?: (selected: boolean) => void
  isSelected?: boolean
  showBulkSelect?: boolean
}

export function RequestStateManager({
  state,
  hoursRemaining,
  deliveryDeadline,
  onStateAction,
  onBulkSelect,
  isSelected,
  showBulkSelect
}: RequestStateManagerProps) {
  const stateConfigs: Record<RequestState, RequestStateConfig> = {
    new: {
      label: 'New Request',
      icon: Circle,
      visual: {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        indicator: 'bg-yellow-500',
        progress: 0
      },
      actions: {
        primary: 'Accept',
        secondary: 'Decline',
        tertiary: 'Message'
      },
      timePressure: hoursRemaining && hoursRemaining <= 24 ? 'high' : 'medium',
      bulkSupport: true,
      countdown: hoursRemaining ? {
        type: 'response',
        deadline: `${hoursRemaining}h remaining to respond`
      } : undefined
    },
    accepted: {
      label: 'Accepted',
      icon: CheckCircle,
      visual: {
        badge: 'bg-green-100 text-green-800 border-green-300',
        indicator: 'bg-green-500',
        progress: 25
      },
      actions: {
        primary: 'Record',
        secondary: 'Cancel',
        tertiary: 'Message'
      },
      timePressure: deliveryDeadline ? 'medium' : 'low',
      bulkSupport: true,
      countdown: deliveryDeadline ? {
        type: 'delivery',
        deadline: `Due ${deliveryDeadline}`
      } : undefined
    },
    recording: {
      label: 'Recording',
      icon: PlayCircle,
      visual: {
        badge: 'bg-red-100 text-red-800 border-red-300',
        indicator: 'bg-red-500 animate-pulse',
        progress: 50
      },
      actions: {
        primary: 'Complete',
        secondary: 'Pause',
        tertiary: 'Preview'
      },
      timePressure: 'none',
      bulkSupport: false
    },
    'in-review': {
      label: 'In Review',
      icon: Edit,
      visual: {
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        indicator: 'bg-orange-500',
        progress: 75
      },
      actions: {
        primary: 'Submit',
        secondary: 'Edit',
        tertiary: 'Preview'
      },
      timePressure: 'none',
      bulkSupport: true
    },
    delivered: {
      label: 'Delivered',
      icon: Send,
      visual: {
        badge: 'bg-gray-100 text-gray-800 border-gray-300',
        indicator: 'bg-gray-500',
        progress: 100
      },
      actions: {
        primary: 'View',
        secondary: 'Download',
        tertiary: 'Stats'
      },
      timePressure: 'none',
      bulkSupport: false
    },
    expired: {
      label: 'Expired',
      icon: XCircle,
      visual: {
        badge: 'bg-red-100 text-red-800 border-red-300 line-through',
        indicator: 'bg-red-500',
        progress: 0
      },
      actions: {
        primary: 'Explain',
        secondary: 'Refund',
        tertiary: 'Contact'
      },
      timePressure: 'high',
      bulkSupport: true
    }
  }

  const config = stateConfigs[state]
  const StateIcon = config.icon

  const getTimePressureColor = (pressure: string) => {
    switch (pressure) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-3">
      {/* State Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBulkSelect && config.bulkSupport && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onBulkSelect?.(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
          )}
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", config.visual.indicator)} />
            <StateIcon className="h-4 w-4 text-gray-600" />
            <Badge className={config.visual.badge}>
              {config.label}
            </Badge>
          </div>
        </div>
        
        {config.countdown && (
          <div className={cn(
            "px-2 py-1 rounded text-xs border",
            getTimePressureColor(config.timePressure)
          )}>
            <Clock className="h-3 w-3 inline mr-1" />
            {config.countdown.deadline}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {config.visual.progress !== undefined && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>{config.visual.progress}%</span>
          </div>
          <Progress value={config.visual.progress} className="h-2" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {config.actions.primary && (
          <Button
            size="sm"
            className={cn(
              state === 'new' ? 'bg-green-600 hover:bg-green-700' :
              state === 'recording' ? 'bg-blue-600 hover:bg-blue-700' :
              state === 'expired' ? 'bg-red-600 hover:bg-red-700' :
              ''
            )}
            onClick={() => onStateAction?.(config.actions.primary!)}
          >
            {getActionIcon(config.actions.primary)}
            {config.actions.primary}
          </Button>
        )}
        
        {config.actions.secondary && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStateAction?.(config.actions.secondary!)}
          >
            {getActionIcon(config.actions.secondary)}
            {config.actions.secondary}
          </Button>
        )}
        
        {config.actions.tertiary && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onStateAction?.(config.actions.tertiary!)}
          >
            {getActionIcon(config.actions.tertiary)}
            {config.actions.tertiary}
          </Button>
        )}
      </div>

      {/* Time Pressure Indicator */}
      {config.timePressure === 'high' && (
        <div className="flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>Immediate attention required</span>
        </div>
      )}
    </div>
  )
}

function getActionIcon(action: string) {
  const iconClass = "h-3 w-3 mr-1"
  
  switch (action.toLowerCase()) {
    case 'accept': return <CheckCircle className={iconClass} />
    case 'decline': return <XCircle className={iconClass} />
    case 'record': return <PlayCircle className={iconClass} />
    case 'complete': return <CheckCircle className={iconClass} />
    case 'pause': return <PauseCircle className={iconClass} />
    case 'edit': return <Edit className={iconClass} />
    case 'submit': return <Send className={iconClass} />
    case 'view': return <Circle className={iconClass} />
    case 'download': return <Download className={iconClass} />
    case 'cancel': return <XCircle className={iconClass} />
    case 'explain': return <AlertCircle className={iconClass} />
    case 'refund': return <RefreshCw className={iconClass} />
    default: return null
  }
}