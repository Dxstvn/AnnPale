"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Shield,
  Users,
  MessageSquare,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Zap,
  Database,
  Server,
  Globe,
  DollarSign,
  FileText,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  TrendingUp,
  Bell,
  Siren,
  Eye,
  User,
  Calendar,
  ArrowRight,
  Warning,
} from "lucide-react"
import Link from "next/link"

const mockIncidents = [
  {
    id: "INC-2024-001",
    type: "Security Breach",
    severity: "Critical",
    status: "Active",
    reportedAt: "2024-01-16 14:30:00",
    description: "Unauthorized access detected in user authentication system",
    assignedTo: "Security Team Alpha",
    affectedSystems: ["Authentication", "User Database", "Payment System"],
    timeline: [
      { time: "14:30", event: "Incident detected by monitoring system", user: "System" },
      { time: "14:32", event: "Security team notified", user: "AutoAlert" },
      { time: "14:35", event: "Incident confirmed and escalated", user: "Jean Baptiste" },
      { time: "14:40", event: "Emergency response team activated", user: "Marie Celeste" },
    ]
  },
  {
    id: "INC-2024-002", 
    type: "Service Outage",
    severity: "High",
    status: "Resolved",
    reportedAt: "2024-01-15 09:15:00",
    description: "Video streaming service experiencing intermittent failures",
    assignedTo: "Operations Team",
    affectedSystems: ["Video Service", "CDN", "Load Balancer"],
    timeline: [
      { time: "09:15", event: "Multiple user reports received", user: "Support" },
      { time: "09:18", event: "Issue confirmed - 30% failure rate", user: "Pierre Morel" },
      { time: "09:25", event: "CDN configuration rolled back", user: "DevOps" },
      { time: "09:45", event: "Service fully restored", user: "DevOps" },
      { time: "10:00", event: "Incident closed", user: "Pierre Morel" },
    ]
  }
]

const responseTeams = [
  { name: "Security Team Alpha", members: 4, status: "Active", lead: "Jean Baptiste" },
  { name: "Operations Team", members: 6, status: "Standby", lead: "Marie Celeste" },
  { name: "Communications Team", members: 3, status: "Standby", lead: "Nadege Joseph" },
  { name: "Legal Response", members: 2, status: "Available", lead: "Pierre Morel" },
]

const emergencyContacts = [
  { name: "Jean Baptiste", role: "CTO", phone: "+1-555-0101", email: "jean.b@annpale.com", priority: "Primary" },
  { name: "Marie Celeste", role: "DevOps Lead", phone: "+1-555-0102", email: "marie.c@annpale.com", priority: "Primary" },
  { name: "Nadege Joseph", role: "CEO", phone: "+1-555-0103", email: "nadege.j@annpale.com", priority: "Executive" },
  { name: "Pierre Morel", role: "Security Lead", phone: "+1-555-0104", email: "pierre.m@annpale.com", priority: "Secondary" },
]

export default function Phase519Demo() {
  const [selectedIncident, setSelectedIncident] = useState(mockIncidents[0])
  const [newIncidentForm, setNewIncidentForm] = useState({
    type: "",
    severity: "",
    description: "",
    affectedSystems: ""
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200"
      case "High": return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-red-100 text-red-800"
      case "Investigating": return "bg-yellow-100 text-yellow-800"
      case "Resolved": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <span>Phase 5.1.9 Demo - Emergency Response & Incidents</span>
            </h1>
            <p className="text-gray-600 mt-2">Crisis Management Interface for Platform Emergencies</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/admin/mobile">
              <Button variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                Phase 5.1.10 Demo
              </Button>
            </Link>
            <Button variant="destructive">
              <Siren className="h-4 w-4 mr-2" />
              Declare Emergency
            </Button>
          </div>
        </div>

        {/* Emergency Status Banner */}
        <Card className="border-red-500 bg-red-50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Emergency Mode: ACTIVE</h3>
                  <p className="text-sm text-red-700">1 Critical incident active - Security Team Alpha responding</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-red-600 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  1h 45m active
                </Badge>
                <Button size="sm" variant="outline" className="border-red-300">
                  <Bell className="h-4 w-4 mr-1" />
                  Send Alert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
          <TabsTrigger value="response">Response Teams</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Active Incidents */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                    <p className="text-3xl font-bold text-red-600">1</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            {/* Response Teams Active */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teams Active</p>
                    <p className="text-3xl font-bold text-blue-600">1</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-3xl font-bold text-green-600">2.3m</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-3xl font-bold text-yellow-600">85%</p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Incident Details */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Emergency: {selectedIncident.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getSeverityColor(selectedIncident.severity)}>
                        {selectedIncident.severity}
                      </Badge>
                      <Badge className={getStatusColor(selectedIncident.status)}>
                        {selectedIncident.status}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">{selectedIncident.type}</h4>
                      <p className="text-gray-600">{selectedIncident.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Affected Systems</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedIncident.affectedSystems.map((system) => (
                          <Badge key={system} variant="outline">{system}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Response Timeline</h4>
                      <div className="space-y-2">
                        {selectedIncident.timeline.map((event, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <Badge variant="outline" className="w-16 justify-center">
                              {event.time}
                            </Badge>
                            <span className="flex-1">{event.event}</span>
                            <span className="text-gray-500">{event.user}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4 border-t">
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Add Update
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Contact Team
                      </Button>
                      <Button size="sm" variant="outline">
                        <Globe className="h-4 w-4 mr-1" />
                        Public Update
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="destructive" className="w-full justify-start">
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Enable Maintenance Mode
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Freeze All Payments
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rollback Last Deploy
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Backup User Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Send User Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {emergencyContacts.slice(0, 3).map((contact) => (
                      <div key={contact.name} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.role}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Active Incidents */}
        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Incident Management</CardTitle>
              <Button>
                <Siren className="h-4 w-4 mr-2" />
                Declare New Incident
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIncidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedIncident.id === incident.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                        <span className="font-semibold">{incident.id}</span>
                      </div>
                      <span className="text-sm text-gray-500">{incident.reportedAt}</span>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{incident.type}</h3>
                    <p className="text-gray-600 text-sm mb-3">{incident.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{incident.assignedTo}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Teams */}
        <TabsContent value="response" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {responseTeams.map((team) => (
                  <div key={team.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{team.name}</h3>
                      <Badge className={
                        team.status === 'Active' ? 'bg-green-100 text-green-800' :
                        team.status === 'Standby' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {team.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Team Lead:</span>
                        <span className="font-medium">{team.lead}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Members:</span>
                        <span>{team.members}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Zap className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Center */}
        <TabsContent value="communication" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Communications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Incident Status Update</label>
                    <Textarea 
                      placeholder="Draft public statement about incident status..."
                      className="h-32"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button>
                      <Globe className="h-4 w-4 mr-2" />
                      Publish Update
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Internal Communications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Update</label>
                    <Textarea 
                      placeholder="Internal team communication..."
                      className="h-32"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Send to Teams
                    </Button>
                    <Button variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Alert All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recovery Operations */}
        <TabsContent value="recovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Recovery Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Server className="h-6 w-6 text-blue-600" />
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <h3 className="font-semibold">Application Servers</h3>
                    <p className="text-sm text-gray-600">All instances operational</p>
                    <Button size="sm" className="w-full mt-3">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Restart Services
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Database className="h-6 w-6 text-green-600" />
                      <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
                    </div>
                    <h3 className="font-semibold">Database Cluster</h3>
                    <p className="text-sm text-gray-600">Read replicas affected</p>
                    <Button size="sm" className="w-full mt-3">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restore Backup
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Globe className="h-6 w-6 text-orange-600" />
                      <Badge className="bg-red-100 text-red-800">Critical</Badge>
                    </div>
                    <h3 className="font-semibold">CDN Services</h3>
                    <p className="text-sm text-gray-600">Video delivery impacted</p>
                    <Button size="sm" className="w-full mt-3">
                      <Zap className="h-4 w-4 mr-1" />
                      Switch Provider
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-8 p-4 border-t bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Phase 5.1.9 Demo</span> - Emergency Response & Incidents Management
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Monitoring Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}