"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Shield,
  Users,
  MessageSquare,
  RefreshCw,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  Server,
  Database,
  CreditCard,
  UserX,
  FileWarning,
  Gavel,
  TrendingUp,
  Bell,
  Zap,
  Radio
} from "lucide-react"

interface ActiveIncident {
  id: string
  type: string
  severity: "critical" | "high" | "medium" | "low"
  status: "declared" | "responding" | "resolving" | "monitoring" | "resolved"
  startTime: Date
  affectedServices: string[]
  responseTeam: string[]
  impact: {
    users: number
    services: string[]
    revenue: number
  }
}

export default function EmergencyResponsePage() {
  const [activeIncident, setActiveIncident] = useState<ActiveIncident | null>(null)
  const [selectedTab, setSelectedTab] = useState("overview")

  const incidentTypes = [
    { id: "security", label: "Security Breach", icon: Shield, color: "destructive" },
    { id: "data", label: "Data Loss", icon: Database, color: "destructive" },
    { id: "payment", label: "Payment Issues", icon: CreditCard, color: "warning" },
    { id: "service", label: "Service Outage", icon: Server, color: "warning" },
    { id: "content", label: "Content Crisis", icon: FileWarning, color: "secondary" },
    { id: "legal", label: "Legal Issues", icon: Gavel, color: "secondary" }
  ]

  const severityLevels = [
    { level: "critical", label: "Critical", color: "bg-red-500", response: "Immediate" },
    { level: "high", label: "High", color: "bg-orange-500", response: "<15 min" },
    { level: "medium", label: "Medium", color: "bg-yellow-500", response: "<45 min" },
    { level: "low", label: "Low", color: "bg-blue-500", response: "<2 hours" }
  ]

  const responseTeams = [
    { id: "security", name: "Security Team", members: 5, status: "ready" },
    { id: "tech", name: "Technical Team", members: 8, status: "ready" },
    { id: "management", name: "Management", members: 3, status: "ready" },
    { id: "pr", name: "PR Team", members: 4, status: "ready" },
    { id: "legal", name: "Legal Team", members: 2, status: "on-call" },
    { id: "finance", name: "Finance Team", members: 3, status: "ready" }
  ]

  const recentIncidents = [
    { id: "INC-001", type: "Service Outage", severity: "medium", date: "2024-01-15", duration: "45m", status: "resolved" },
    { id: "INC-002", type: "Payment Issues", severity: "high", date: "2024-01-10", duration: "2h", status: "resolved" },
    { id: "INC-003", type: "Content Crisis", severity: "low", date: "2024-01-05", duration: "30m", status: "resolved" }
  ]

  const communicationChannels = [
    { id: "internal", label: "Internal Team", icon: Users, status: "active" },
    { id: "users", label: "User Notifications", icon: Bell, status: "ready" },
    { id: "media", label: "Media Statements", icon: Globe, status: "ready" },
    { id: "social", label: "Social Media", icon: MessageSquare, status: "ready" },
    { id: "email", label: "Email Updates", icon: Mail, status: "ready" },
    { id: "phone", label: "Hotline", icon: Phone, status: "on-call" }
  ]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            Emergency Response Center
          </h1>
          <p className="text-muted-foreground mt-1">Crisis management and incident response coordination</p>
        </div>
        {!activeIncident && (
          <Badge variant="outline" className="px-4 py-2 text-green-600 border-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            All Systems Operational
          </Badge>
        )}
        {activeIncident && (
          <Badge variant="destructive" className="px-4 py-2 animate-pulse">
            <AlertCircle className="h-4 w-4 mr-2" />
            Active Incident: {activeIncident.type}
          </Badge>
        )}
      </div>

      {activeIncident && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertTitle className="text-red-700">Active Emergency Response</AlertTitle>
          <AlertDescription className="text-red-600">
            Incident #{activeIncident.id} declared at {activeIncident.startTime.toLocaleTimeString()}.
            Response teams have been activated. All hands on deck.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="declare">Declare</TabsTrigger>
          <TabsTrigger value="coordinate">Coordinate</TabsTrigger>
          <TabsTrigger value="communicate">Communicate</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <Badge variant="outline" className="text-green-600">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="outline" className="text-green-600">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN</span>
                    <Badge variant="outline" className="text-green-600">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Gateway</span>
                    <Badge variant="outline" className="text-green-600">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Response Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {responseTeams.slice(0, 4).map(team => (
                    <div key={team.id} className="flex items-center justify-between">
                      <span className="text-sm">{team.name}</span>
                      <Badge variant={team.status === "ready" ? "default" : "secondary"}>
                        {team.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentIncidents.map(incident => (
                    <div key={incident.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{incident.id}</p>
                        <p className="text-xs text-muted-foreground">{incident.type}</p>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {incident.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Rapid response capabilities for common scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto flex-col p-4">
                  <Zap className="h-8 w-8 mb-2 text-yellow-500" />
                  <span className="text-sm">Emergency Shutdown</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col p-4">
                  <Shield className="h-8 w-8 mb-2 text-blue-500" />
                  <span className="text-sm">Security Lockdown</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col p-4">
                  <Radio className="h-8 w-8 mb-2 text-purple-500" />
                  <span className="text-sm">Broadcast Alert</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col p-4">
                  <RefreshCw className="h-8 w-8 mb-2 text-green-500" />
                  <span className="text-sm">System Rollback</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declare" className="space-y-6">
          <IncidentDeclaration 
            incidentTypes={incidentTypes}
            severityLevels={severityLevels}
            responseTeams={responseTeams}
            onDeclare={(incident) => setActiveIncident(incident)}
          />
        </TabsContent>

        <TabsContent value="coordinate" className="space-y-6">
          <ResponseCoordination 
            activeIncident={activeIncident}
            responseTeams={responseTeams}
          />
        </TabsContent>

        <TabsContent value="communicate" className="space-y-6">
          <CommunicationCenter 
            channels={communicationChannels}
            activeIncident={activeIncident}
          />
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <RecoveryOperations 
            activeIncident={activeIncident}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <PostIncidentAnalysis 
            recentIncidents={recentIncidents}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Incident Declaration Component
function IncidentDeclaration({ incidentTypes, severityLevels, responseTeams, onDeclare }: any) {
  const [selectedType, setSelectedType] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("")
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Declare Emergency Incident</CardTitle>
          <CardDescription>Initiate emergency response procedures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Incident Type Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Incident Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {incidentTypes.map((type: any) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="h-auto flex-col p-4"
                  onClick={() => setSelectedType(type.id)}
                >
                  <type.icon className="h-8 w-8 mb-2" />
                  <span className="text-sm">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Severity Level */}
          <div>
            <label className="text-sm font-medium mb-3 block">Severity Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {severityLevels.map((level: any) => (
                <Button
                  key={level.level}
                  variant={selectedSeverity === level.level ? "default" : "outline"}
                  className="h-auto p-4"
                  onClick={() => setSelectedSeverity(level.level)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${level.color} mb-2`} />
                    <span className="text-sm font-medium">{level.label}</span>
                    <span className="text-xs text-muted-foreground">{level.response}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Response Teams */}
          <div>
            <label className="text-sm font-medium mb-3 block">Activate Response Teams</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {responseTeams.map((team: any) => (
                <div key={team.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={team.id}
                    checked={selectedTeams.includes(team.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTeams([...selectedTeams, team.id])
                      } else {
                        setSelectedTeams(selectedTeams.filter(t => t !== team.id))
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={team.id} className="text-sm">
                    {team.name} ({team.members})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="destructive"
              size="lg"
              disabled={!selectedType || !selectedSeverity || selectedTeams.length === 0}
              onClick={() => {
                onDeclare({
                  id: `INC-${Date.now()}`,
                  type: selectedType,
                  severity: selectedSeverity,
                  status: "declared",
                  startTime: new Date(),
                  affectedServices: [],
                  responseTeam: selectedTeams,
                  impact: { users: 0, services: [], revenue: 0 }
                })
              }}
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Declare Emergency
            </Button>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Response Coordination Component
function ResponseCoordination({ activeIncident, responseTeams }: any) {
  const tasks = [
    { id: 1, task: "Isolate affected systems", assignee: "Tech Team", status: "in-progress", priority: "high" },
    { id: 2, task: "Notify stakeholders", assignee: "Management", status: "completed", priority: "high" },
    { id: 3, task: "Prepare user communication", assignee: "PR Team", status: "pending", priority: "medium" },
    { id: 4, task: "Enable backup systems", assignee: "Tech Team", status: "in-progress", priority: "high" },
    { id: 5, task: "Monitor system metrics", assignee: "Security Team", status: "in-progress", priority: "medium" }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Response Coordination</CardTitle>
          <CardDescription>Track and manage incident response activities</CardDescription>
        </CardHeader>
        <CardContent>
          {activeIncident ? (
            <div className="space-y-6">
              {/* Response Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>

              {/* Task Management */}
              <div>
                <h3 className="font-medium mb-4">Active Tasks</h3>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {task.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {task.status === "in-progress" && <Clock className="h-5 w-5 text-yellow-500" />}
                        {task.status === "pending" && <AlertCircle className="h-5 w-5 text-gray-400" />}
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                        </div>
                      </div>
                      <Badge variant={
                        task.priority === "high" ? "destructive" : 
                        task.priority === "medium" ? "default" : "secondary"
                      }>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Status */}
              <div>
                <h3 className="font-medium mb-4">Team Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {responseTeams.map((team: any) => (
                    <Card key={team.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{team.name}</span>
                          <Badge variant="default" className="text-xs">Active</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {team.members} members engaged
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Active Incident</AlertTitle>
              <AlertDescription>
                Response coordination will be available when an incident is declared.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Communication Center Component
function CommunicationCenter({ channels, activeIncident }: any) {
  const templates = [
    { id: "initial", label: "Initial Alert", description: "First communication to users" },
    { id: "update", label: "Status Update", description: "Progress update template" },
    { id: "resolution", label: "Resolution Notice", description: "Issue resolved notification" },
    { id: "apology", label: "Apology Statement", description: "Formal apology template" }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Center</CardTitle>
          <CardDescription>Manage internal and external communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Communication Channels */}
          <div>
            <h3 className="font-medium mb-4">Communication Channels</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {channels.map((channel: any) => (
                <Card key={channel.id} className={channel.status === "active" ? "border-green-500" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <channel.icon className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{channel.label}</p>
                        <Badge variant={channel.status === "active" ? "default" : "secondary"} className="mt-1">
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Message Templates */}
          <div>
            <h3 className="font-medium mb-4">Message Templates</h3>
            <div className="space-y-3">
              {templates.map(template => (
                <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{template.label}</p>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Send Communication */}
          <div className="flex gap-4">
            <Button className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Internal Update
            </Button>
            <Button variant="outline" className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Publish Public Statement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Recovery Operations Component
function RecoveryOperations({ activeIncident }: any) {
  const recoverySteps = [
    { id: 1, step: "Backup validation", status: "completed", duration: "5 min" },
    { id: 2, step: "Service restoration", status: "in-progress", duration: "15 min" },
    { id: 3, step: "Data integrity check", status: "pending", duration: "10 min" },
    { id: 4, step: "System validation", status: "pending", duration: "20 min" },
    { id: 5, step: "User access restoration", status: "pending", duration: "5 min" }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recovery Operations</CardTitle>
          <CardDescription>System restoration and recovery procedures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recovery Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Recovery Progress</span>
              <span className="text-sm text-muted-foreground">20%</span>
            </div>
            <Progress value={20} className="h-2" />
          </div>

          {/* Recovery Steps */}
          <div>
            <h3 className="font-medium mb-4">Recovery Checklist</h3>
            <div className="space-y-3">
              {recoverySteps.map(step => (
                <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {step.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {step.status === "in-progress" && <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />}
                    {step.status === "pending" && <Clock className="h-5 w-5 text-gray-400" />}
                    <div>
                      <p className="font-medium">{step.step}</p>
                      <p className="text-sm text-muted-foreground">Est. duration: {step.duration}</p>
                    </div>
                  </div>
                  <Badge variant={
                    step.status === "completed" ? "default" : 
                    step.status === "in-progress" ? "secondary" : "outline"
                  }>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Restore from Backup
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Rollback Changes
            </Button>
            <Button variant="outline">
              <Server className="h-4 w-4 mr-2" />
              Failover to Secondary
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Enable Safe Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Post-Incident Analysis Component
function PostIncidentAnalysis({ recentIncidents }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post-Incident Analysis</CardTitle>
          <CardDescription>Review and learn from past incidents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Incident Timeline */}
          <div>
            <h3 className="font-medium mb-4">Recent Incident Analysis</h3>
            <div className="space-y-4">
              {recentIncidents.map((incident: any) => (
                <Card key={incident.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{incident.id}: {incident.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {incident.date} • Duration: {incident.duration}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {incident.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        View Metrics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg Response Time</span>
                </div>
                <p className="text-2xl font-bold">12 min</p>
                <p className="text-xs text-green-600">↓ 25% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg Resolution Time</span>
                </div>
                <p className="text-2xl font-bold">1.5 hrs</p>
                <p className="text-xs text-green-600">↓ 15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Users Affected</span>
                </div>
                <p className="text-2xl font-bold">2.3k</p>
                <p className="text-xs text-red-600">↑ 5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Generate Report */}
          <Button className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Generate Comprehensive Incident Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}