"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/lib/utils/toast"
import {
  AlertTriangle,
  ShieldAlert,
  Power,
  RefreshCw,
  Ban,
  Lock,
  Unlock,
  PauseCircle,
  PlayCircle,
  Shield,
  UserX,
  MessageCircle,
  Clock,
  Zap,
  Settings,
  Activity,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Timer,
  Siren,
  Phone,
  Mail,
  ExternalLink,
  FileText,
  Users,
  DollarSign,
  Video,
  Database,
  Globe,
  Server,
  HardDrive,
  Wifi,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface EmergencyControl {
  id: string
  name: string
  description: string
  enabled: boolean
  critical: boolean
  category: "platform" | "security" | "content" | "financial" | "infrastructure"
  affectedSystems: string[]
  estimatedImpact: "low" | "medium" | "high" | "critical"
  autoRevert?: boolean
  revertTime?: number // in minutes
}

export interface EmergencyIncident {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "investigating" | "mitigating" | "resolved"
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
  affectedSystems: string[]
  timeline: IncidentEvent[]
  actions: EmergencyAction[]
}

export interface IncidentEvent {
  id: string
  timestamp: Date
  type: "detected" | "escalated" | "action_taken" | "update" | "resolved"
  message: string
  user?: string
}

export interface EmergencyAction {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  action: () => Promise<void>
  variant?: "default" | "destructive" | "secondary"
  requiresConfirmation: boolean
  estimatedTime?: string
}

export interface EmergencyContact {
  id: string
  name: string
  role: string
  phone: string
  email: string
  priority: "primary" | "secondary" | "escalation"
  available24x7: boolean
}

interface EmergencyResponseProps {
  className?: string
  onIncidentDeclared?: (incident: EmergencyIncident) => void
  onControlToggled?: (controlId: string, enabled: boolean) => void
  onActionExecuted?: (actionId: string) => void
}

const defaultControls: EmergencyControl[] = [
  {
    id: "maintenance-mode",
    name: "Maintenance Mode",
    description: "Enable platform-wide maintenance mode with custom message",
    enabled: false,
    critical: true,
    category: "platform",
    affectedSystems: ["Web App", "Mobile App", "API"],
    estimatedImpact: "critical",
    autoRevert: true,
    revertTime: 60,
  },
  {
    id: "freeze-payments",
    name: "Freeze All Payments",
    description: "Stop all payment processing immediately",
    enabled: false,
    critical: true,
    category: "financial",
    affectedSystems: ["Payment Gateway", "Stripe", "PayPal"],
    estimatedImpact: "critical",
  },
  {
    id: "disable-uploads",
    name: "Disable Video Uploads",
    description: "Prevent all new video uploads",
    enabled: false,
    critical: false,
    category: "content",
    affectedSystems: ["Upload Service", "CDN"],
    estimatedImpact: "medium",
  },
  {
    id: "disable-registrations",
    name: "Disable New Registrations",
    description: "Stop new user and creator signups",
    enabled: false,
    critical: false,
    category: "security",
    affectedSystems: ["Auth Service", "User Service"],
    estimatedImpact: "low",
  },
  {
    id: "read-only-mode",
    name: "Read-Only Mode",
    description: "Disable all write operations",
    enabled: false,
    critical: true,
    category: "infrastructure",
    affectedSystems: ["Database", "API", "File Storage"],
    estimatedImpact: "high",
  },
  {
    id: "rate-limit-aggressive",
    name: "Aggressive Rate Limiting",
    description: "Implement strict rate limits to reduce load",
    enabled: false,
    critical: false,
    category: "security",
    affectedSystems: ["API Gateway", "Load Balancer"],
    estimatedImpact: "medium",
  },
]

const emergencyActions: EmergencyAction[] = [
  {
    id: "emergency-shutdown",
    name: "Emergency Shutdown",
    description: "Immediately shut down all services",
    icon: <Power className="h-5 w-5" />,
    action: async () => {
      await new Promise(resolve => setTimeout(resolve, 3000))
    },
    variant: "destructive",
    requiresConfirmation: true,
    estimatedTime: "30 seconds",
  },
  {
    id: "restart-services",
    name: "Restart All Services",
    description: "Restart all platform services",
    icon: <RefreshCw className="h-5 w-5" />,
    action: async () => {
      await new Promise(resolve => setTimeout(resolve, 5000))
    },
    variant: "secondary",
    requiresConfirmation: true,
    estimatedTime: "2-3 minutes",
  },
  {
    id: "clear-cache-all",
    name: "Clear All Caches",
    description: "Clear all system caches",
    icon: <Database className="h-5 w-5" />,
    action: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
    },
    variant: "secondary",
    requiresConfirmation: true,
    estimatedTime: "1 minute",
  },
  {
    id: "scale-up-servers",
    name: "Scale Up Servers",
    description: "Increase server capacity",
    icon: <Server className="h-5 w-5" />,
    action: async () => {
      await new Promise(resolve => setTimeout(resolve, 4000))
    },
    variant: "default",
    requiresConfirmation: true,
    estimatedTime: "3-5 minutes",
  },
]

const emergencyContacts: EmergencyContact[] = [
  {
    id: "cto",
    name: "Jean Baptiste",
    role: "CTO",
    phone: "+1-555-0101",
    email: "jean.baptiste@annpale.com",
    priority: "primary",
    available24x7: true,
  },
  {
    id: "devops-lead",
    name: "Marie Celeste",
    role: "DevOps Lead",
    phone: "+1-555-0102",
    email: "marie.celeste@annpale.com",
    priority: "primary",
    available24x7: true,
  },
  {
    id: "security-lead",
    name: "Pierre Morel",
    role: "Security Lead",
    phone: "+1-555-0103",
    email: "pierre.morel@annpale.com",
    priority: "secondary",
    available24x7: false,
  },
  {
    id: "ceo",
    name: "Nadege Joseph",
    role: "CEO",
    phone: "+1-555-0104",
    email: "nadege.joseph@annpale.com",
    priority: "escalation",
    available24x7: false,
  },
]

export function EmergencyResponse({
  className,
  onIncidentDeclared,
  onControlToggled,
  onActionExecuted,
}: EmergencyResponseProps) {
  const [controls, setControls] = useState<EmergencyControl[]>(defaultControls)
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([])
  const [isNewIncidentDialogOpen, setIsNewIncidentDialogOpen] = useState(false)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<EmergencyAction | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium" as const,
    affectedSystems: [] as string[],
  })

  // Auto-revert controls
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    controls.forEach((control) => {
      if (control.enabled && control.autoRevert && control.revertTime) {
        const timer = setTimeout(() => {
          handleControlToggle(control.id)
          toast({
            title: "Auto-Revert",
            description: `${control.name} has been automatically disabled`,
          })
        }, control.revertTime * 60 * 1000)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [controls])

  const handleControlToggle = (controlId: string) => {
    setControls(prev =>
      prev.map(control =>
        control.id === controlId
          ? { ...control, enabled: !control.enabled }
          : control
      )
    )

    const control = controls.find(c => c.id === controlId)
    if (control) {
      onControlToggled?.(controlId, !control.enabled)
      
      toast({
        title: control.enabled ? "Control Disabled" : "Control Enabled",
        description: `${control.name} has been ${control.enabled ? "disabled" : "enabled"}`,
        variant: control.critical && !control.enabled ? "destructive" : "default",
      })
    }
  }

  const handleActionClick = (action: EmergencyAction) => {
    setSelectedAction(action)
    setIsActionDialogOpen(true)
  }

  const handleActionConfirm = async () => {
    if (!selectedAction) return

    setIsProcessing(true)
    try {
      await selectedAction.action()
      
      toast({
        title: "Action Completed",
        description: `${selectedAction.name} executed successfully`,
      })
      
      onActionExecuted?.(selectedAction.id)
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to execute ${selectedAction.name}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setIsActionDialogOpen(false)
      setSelectedAction(null)
    }
  }

  const handleDeclareIncident = () => {
    const incident: EmergencyIncident = {
      id: `INC-${Date.now()}`,
      title: newIncident.title,
      description: newIncident.description,
      severity: newIncident.severity,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      affectedSystems: newIncident.affectedSystems,
      timeline: [
        {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          type: "detected",
          message: "Incident declared",
        },
      ],
      actions: [],
    }

    setIncidents(prev => [incident, ...prev])
    setNewIncident({
      title: "",
      description: "",
      severity: "medium",
      affectedSystems: [],
    })
    setIsNewIncidentDialogOpen(false)
    
    onIncidentDeclared?.(incident)
    
    toast({
      title: "Incident Declared",
      description: `Incident ${incident.id} has been created`,
      variant: "destructive",
    })
  }

  const getCategoryIcon = (category: EmergencyControl["category"]) => {
    const icons = {
      platform: <Globe className="h-4 w-4" />,
      security: <Shield className="h-4 w-4" />,
      content: <Video className="h-4 w-4" />,
      financial: <DollarSign className="h-4 w-4" />,
      infrastructure: <Server className="h-4 w-4" />,
    }
    return icons[category]
  }

  const getImpactColor = (impact: EmergencyControl["estimatedImpact"]) => {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      critical: "text-red-600",
    }
    return colors[impact]
  }

  const getSeverityColor = (severity: EmergencyIncident["severity"]) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }
    return colors[severity]
  }

  const activeIncidents = incidents.filter(i => i.status === "active")
  const criticalControls = controls.filter(c => c.enabled && c.critical)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Emergency Status */}
      <Card className={cn(
        "border-2",
        activeIncidents.length > 0 || criticalControls.length > 0
          ? "border-red-500 bg-red-50"
          : "border-green-500 bg-green-50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {activeIncidents.length > 0 || criticalControls.length > 0 ? (
                <AlertOctagon className="h-6 w-6 text-red-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              <div>
                <h3 className="font-semibold">
                  {activeIncidents.length > 0 || criticalControls.length > 0
                    ? "Emergency Mode Active"
                    : "System Normal"
                  }
                </h3>
                <p className="text-sm text-gray-600">
                  {activeIncidents.length} active incidents, {criticalControls.length} critical controls enabled
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsNewIncidentDialogOpen(true)}
            >
              <Siren className="h-4 w-4 mr-2" />
              Declare Incident
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Incidents */}
      {activeIncidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Active Incidents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeIncidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <span className="font-medium">{incident.id}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round((Date.now() - incident.createdAt.getTime()) / 60000)}m ago
                    </span>
                  </div>
                  <h4 className="font-medium mb-1">{incident.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Status: {incident.status}</span>
                    <span>Systems: {incident.affectedSystems.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Emergency Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {controls.map((control) => (
              <div
                key={control.id}
                className={cn(
                  "border rounded-lg p-4",
                  control.enabled && control.critical
                    ? "border-red-500 bg-red-50"
                    : control.enabled
                    ? "border-yellow-500 bg-yellow-50"
                    : ""
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(control.category)}
                      <h4 className="font-medium">{control.name}</h4>
                      {control.critical && (
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      )}
                      {control.autoRevert && control.enabled && (
                        <Badge variant="outline" className="text-xs">
                          <Timer className="h-3 w-3 mr-1" />
                          Auto-revert: {control.revertTime}m
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{control.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Impact: <span className={getImpactColor(control.estimatedImpact)}>{control.estimatedImpact}</span></span>
                      <span>Systems: {control.affectedSystems.join(", ")}</span>
                    </div>
                  </div>
                  <Switch
                    checked={control.enabled}
                    onCheckedChange={() => handleControlToggle(control.id)}
                    className={cn(
                      control.enabled && control.critical && "data-[state=checked]:bg-red-600"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <span>Emergency Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || "outline"}
                className="h-auto p-4 flex flex-col space-y-2"
                onClick={() => handleActionClick(action)}
                disabled={isProcessing}
              >
                {action.icon}
                <div className="text-center">
                  <div className="font-medium">{action.name}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                  {action.estimatedTime && (
                    <div className="text-xs text-gray-400 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {action.estimatedTime}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-green-600" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{contact.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {contact.role}
                      </Badge>
                      <Badge
                        variant={contact.priority === "primary" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {contact.priority}
                      </Badge>
                      {contact.available24x7 && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          24/7
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <a href={`tel:${contact.phone}`} className="hover:underline">
                        <Phone className="h-3 w-3 inline mr-1" />
                        {contact.phone}
                      </a>
                      <a href={`mailto:${contact.email}`} className="hover:underline">
                        <Mail className="h-3 w-3 inline mr-1" />
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${contact.phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${contact.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Incident Dialog */}
      <Dialog open={isNewIncidentDialogOpen} onOpenChange={setIsNewIncidentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Declare Emergency Incident</DialogTitle>
            <DialogDescription>
              Create a new incident to track and coordinate response efforts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="incident-title">Incident Title</Label>
              <Input
                id="incident-title"
                value={newIncident.title}
                onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the incident"
              />
            </div>
            <div>
              <Label htmlFor="incident-description">Description</Label>
              <Textarea
                id="incident-description"
                value={newIncident.description}
                onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the incident"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="incident-severity">Severity</Label>
              <Select
                value={newIncident.severity}
                onValueChange={(value: any) => setNewIncident(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewIncidentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeclareIncident}
              disabled={!newIncident.title || !newIncident.description}
            >
              <Siren className="h-4 w-4 mr-2" />
              Declare Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Emergency Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to execute this emergency action?
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                {selectedAction.icon}
                <div>
                  <div className="font-medium">{selectedAction.name}</div>
                  <div className="text-sm text-gray-600">{selectedAction.description}</div>
                  {selectedAction.estimatedTime && (
                    <div className="text-xs text-gray-500 mt-1">
                      Estimated time: {selectedAction.estimatedTime}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    This action will affect critical system operations
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActionDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={selectedAction?.variant || "default"}
              onClick={handleActionConfirm}
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
                  Execute Action
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}