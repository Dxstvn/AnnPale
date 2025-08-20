"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/lib/utils/toast"
import {
  Lock,
  Unlock,
  Ban,
  UserCheck,
  UserX,
  XCircle,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  Shield,
  FileWarning,
  DollarSign,
  Video,
  Pause,
  Play,
  Trash2,
  Edit,
  Eye,
  Send,
  Clock,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuickAction {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: (params?: any) => Promise<void> | void
  variant?: "default" | "destructive" | "secondary" | "ghost" | "outline"
  requireConfirmation?: boolean
  requireInput?: boolean
  inputType?: "text" | "email" | "number" | "textarea"
  inputPlaceholder?: string
  inputLabel?: string
  category?: "user" | "content" | "system" | "financial"
  shortcut?: string
  enabled?: boolean
}

interface MobileQuickActionsProps {
  actions?: QuickAction[]
  onActionComplete?: (actionId: string, result?: any) => void
  className?: string
  gridCols?: 2 | 3 | 4
  showCategories?: boolean
  showShortcuts?: boolean
}

const defaultActions: QuickAction[] = [
  {
    id: "lock-user",
    label: "Lock User",
    description: "Temporarily lock a user account",
    icon: <Lock className="h-5 w-5" />,
    action: async (params) => {
      console.log("Locking user:", params)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    variant: "destructive",
    requireInput: true,
    inputType: "email",
    inputPlaceholder: "user@example.com",
    inputLabel: "User Email",
    category: "user",
    shortcut: "⌘L",
  },
  {
    id: "unlock-user",
    label: "Unlock User",
    description: "Unlock a locked user account",
    icon: <Unlock className="h-5 w-5" />,
    action: async (params) => {
      console.log("Unlocking user:", params)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    variant: "default",
    requireInput: true,
    inputType: "email",
    inputPlaceholder: "user@example.com",
    inputLabel: "User Email",
    category: "user",
    shortcut: "⌘U",
  },
  {
    id: "ban-user",
    label: "Ban User",
    description: "Permanently ban a user from the platform",
    icon: <Ban className="h-5 w-5" />,
    action: async (params) => {
      console.log("Banning user:", params)
      await new Promise(resolve => setTimeout(resolve, 1500))
    },
    variant: "destructive",
    requireConfirmation: true,
    requireInput: true,
    inputType: "email",
    inputPlaceholder: "user@example.com",
    inputLabel: "User Email",
    category: "user",
  },
  {
    id: "approve-creator",
    label: "Approve Creator",
    description: "Approve a pending creator application",
    icon: <UserCheck className="h-5 w-5" />,
    action: async (params) => {
      console.log("Approving creator:", params)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    variant: "default",
    requireInput: true,
    inputType: "text",
    inputPlaceholder: "Creator ID or username",
    inputLabel: "Creator",
    category: "user",
    shortcut: "⌘A",
  },
  {
    id: "reject-creator",
    label: "Reject Creator",
    description: "Reject a creator application",
    icon: <UserX className="h-5 w-5" />,
    action: async (params) => {
      console.log("Rejecting creator:", params)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    variant: "destructive",
    requireInput: true,
    inputType: "textarea",
    inputPlaceholder: "Reason for rejection...",
    inputLabel: "Rejection Reason",
    category: "user",
  },
  {
    id: "remove-content",
    label: "Remove Content",
    description: "Remove inappropriate content",
    icon: <XCircle className="h-5 w-5" />,
    action: async (params) => {
      console.log("Removing content:", params)
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    variant: "destructive",
    requireConfirmation: true,
    requireInput: true,
    inputType: "text",
    inputPlaceholder: "Content ID or URL",
    inputLabel: "Content",
    category: "content",
    shortcut: "⌘D",
  },
  {
    id: "approve-content",
    label: "Approve Content",
    description: "Approve pending content",
    icon: <CheckCircle className="h-5 w-5" />,
    action: async (params) => {
      console.log("Approving content:", params)
      await new Promise(resolve => setTimeout(resolve, 800))
    },
    variant: "default",
    requireInput: true,
    inputType: "text",
    inputPlaceholder: "Content ID",
    inputLabel: "Content",
    category: "content",
  },
  {
    id: "flag-content",
    label: "Flag Content",
    description: "Flag content for review",
    icon: <FileWarning className="h-5 w-5" />,
    action: async (params) => {
      console.log("Flagging content:", params)
      await new Promise(resolve => setTimeout(resolve, 800))
    },
    variant: "secondary",
    requireInput: true,
    inputType: "textarea",
    inputPlaceholder: "Reason for flagging...",
    inputLabel: "Flag Reason",
    category: "content",
  },
  {
    id: "pause-video",
    label: "Pause Video",
    description: "Pause video processing",
    icon: <Pause className="h-5 w-5" />,
    action: async (params) => {
      console.log("Pausing video:", params)
      await new Promise(resolve => setTimeout(resolve, 500))
    },
    variant: "secondary",
    requireInput: true,
    inputType: "text",
    inputPlaceholder: "Video ID",
    inputLabel: "Video",
    category: "content",
  },
  {
    id: "send-notification",
    label: "Send Notification",
    description: "Send a platform-wide notification",
    icon: <MessageSquare className="h-5 w-5" />,
    action: async (params) => {
      console.log("Sending notification:", params)
      await new Promise(resolve => setTimeout(resolve, 1500))
    },
    variant: "default",
    requireInput: true,
    inputType: "textarea",
    inputPlaceholder: "Notification message...",
    inputLabel: "Message",
    category: "system",
    shortcut: "⌘N",
  },
  {
    id: "refresh-cache",
    label: "Refresh Cache",
    description: "Clear and refresh system cache",
    icon: <RefreshCw className="h-5 w-5" />,
    action: async () => {
      console.log("Refreshing cache")
      await new Promise(resolve => setTimeout(resolve, 2000))
    },
    variant: "secondary",
    requireConfirmation: true,
    category: "system",
    shortcut: "⌘R",
  },
  {
    id: "enable-maintenance",
    label: "Maintenance Mode",
    description: "Enable maintenance mode",
    icon: <Shield className="h-5 w-5" />,
    action: async () => {
      console.log("Enabling maintenance mode")
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    variant: "destructive",
    requireConfirmation: true,
    category: "system",
  },
  {
    id: "process-refund",
    label: "Process Refund",
    description: "Process a refund request",
    icon: <DollarSign className="h-5 w-5" />,
    action: async (params) => {
      console.log("Processing refund:", params)
      await new Promise(resolve => setTimeout(resolve, 2000))
    },
    variant: "default",
    requireConfirmation: true,
    requireInput: true,
    inputType: "text",
    inputPlaceholder: "Order ID",
    inputLabel: "Order",
    category: "financial",
  },
]

export function MobileQuickActions({
  actions = defaultActions,
  onActionComplete,
  className,
  gridCols = 2,
  showCategories = false,
  showShortcuts = false,
}: MobileQuickActionsProps) {
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [recentActions, setRecentActions] = useState<string[]>([])

  // Load recent actions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("admin-recent-actions")
    if (stored) {
      setRecentActions(JSON.parse(stored))
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const action = actions.find(a => 
          a.shortcut?.toLowerCase().includes(e.key.toLowerCase())
        )
        if (action) {
          e.preventDefault()
          handleActionClick(action)
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [actions])

  const handleActionClick = (action: QuickAction) => {
    if (action.enabled === false) {
      toast({
        title: "Action Disabled",
        description: "This action is currently disabled",
        variant: "destructive",
      })
      return
    }

    setSelectedAction(action)
    setInputValue("")

    if (action.requireConfirmation && !action.requireInput) {
      setIsConfirmDialogOpen(true)
    } else if (action.requireInput) {
      setIsInputDialogOpen(true)
    } else {
      executeAction(action)
    }
  }

  const executeAction = async (action: QuickAction, params?: any) => {
    setIsProcessing(true)
    
    try {
      await action.action(params)
      
      // Update recent actions
      const newRecent = [action.id, ...recentActions.filter(id => id !== action.id)].slice(0, 5)
      setRecentActions(newRecent)
      localStorage.setItem("admin-recent-actions", JSON.stringify(newRecent))
      
      toast({
        title: "Action Completed",
        description: `${action.label} executed successfully`,
      })
      
      if (onActionComplete) {
        onActionComplete(action.id, params)
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to execute ${action.label}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setIsConfirmDialogOpen(false)
      setIsInputDialogOpen(false)
      setSelectedAction(null)
    }
  }

  const handleInputSubmit = () => {
    if (!selectedAction) return
    
    if (selectedAction.requireConfirmation) {
      setIsInputDialogOpen(false)
      setIsConfirmDialogOpen(true)
    } else {
      executeAction(selectedAction, inputValue)
    }
  }

  const handleConfirm = () => {
    if (!selectedAction) return
    executeAction(selectedAction, inputValue || undefined)
  }

  const groupedActions = showCategories
    ? actions.reduce((acc, action) => {
        const category = action.category || "other"
        if (!acc[category]) acc[category] = []
        acc[category].push(action)
        return acc
      }, {} as Record<string, QuickAction[]>)
    : { all: actions }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      user: "User Management",
      content: "Content Control",
      system: "System Operations",
      financial: "Financial Actions",
      other: "Other Actions",
      all: "Quick Actions",
    }
    return labels[category] || category
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      user: <UserCheck className="h-4 w-4" />,
      content: <Video className="h-4 w-4" />,
      system: <Shield className="h-4 w-4" />,
      financial: <DollarSign className="h-4 w-4" />,
    }
    return icons[category] || null
  }

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {Object.entries(groupedActions).map(([category, categoryActions]) => (
          <div key={category}>
            {showCategories && category !== "all" && (
              <div className="flex items-center space-x-2 mb-3">
                {getCategoryIcon(category)}
                <h3 className="text-sm font-medium text-gray-700">
                  {getCategoryLabel(category)}
                </h3>
              </div>
            )}
            
            <div className={cn(
              "grid gap-3",
              gridCols === 2 && "grid-cols-2",
              gridCols === 3 && "grid-cols-3",
              gridCols === 4 && "grid-cols-4"
            )}>
              {categoryActions.map((action) => {
                const isRecent = recentActions.includes(action.id)
                
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || "outline"}
                    className={cn(
                      "h-auto flex-col py-3 px-2 relative",
                      action.enabled === false && "opacity-50 cursor-not-allowed",
                      isRecent && "ring-2 ring-purple-500 ring-offset-2"
                    )}
                    onClick={() => handleActionClick(action)}
                    disabled={isProcessing}
                  >
                    {isRecent && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        <Clock className="h-3 w-3" />
                      </Badge>
                    )}
                    {showShortcuts && action.shortcut && (
                      <Badge
                        variant="secondary"
                        className="absolute top-1 right-1 text-xs px-1 py-0"
                      >
                        {action.shortcut}
                      </Badge>
                    )}
                    <div className="flex flex-col items-center space-y-1">
                      {action.icon}
                      <span className="text-xs font-medium">{action.label}</span>
                      {action.description && (
                        <span className="text-xs text-gray-500 text-center line-clamp-2">
                          {action.description}
                        </span>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ))}

        {recentActions.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Recent Actions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRecentActions([])
                  localStorage.removeItem("admin-recent-actions")
                }}
              >
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentActions.map((actionId) => {
                const action = actions.find(a => a.id === actionId)
                if (!action) return null
                
                return (
                  <Button
                    key={actionId}
                    variant="outline"
                    size="sm"
                    onClick={() => handleActionClick(action)}
                    disabled={isProcessing}
                  >
                    {action.icon}
                    <span className="ml-1">{action.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Input Dialog */}
      <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAction?.label}</DialogTitle>
            <DialogDescription>
              {selectedAction?.description || "Enter the required information"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="action-input">
                {selectedAction?.inputLabel || "Input"}
              </Label>
              {selectedAction?.inputType === "textarea" ? (
                <Textarea
                  id="action-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedAction?.inputPlaceholder}
                  className="mt-1"
                  rows={4}
                />
              ) : (
                <Input
                  id="action-input"
                  type={selectedAction?.inputType || "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedAction?.inputPlaceholder}
                  className="mt-1"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInputDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInputSubmit}
              disabled={!inputValue || isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {selectedAction?.requireConfirmation ? "Next" : "Execute"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedAction?.label.toLowerCase()}?
              {inputValue && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                  <strong>Input:</strong> {inputValue}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={selectedAction?.variant || "default"}
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}