"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Wrench,
  Calendar as CalendarIcon,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  FileText,
  Mail,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MaintenanceWindow {
  id: string
  title: string
  description: string
  type: "scheduled" | "emergency" | "routine"
  status: "planned" | "in_progress" | "completed" | "cancelled"
  startTime: string
  endTime: string
  affectedServices: string[]
  estimatedImpact: string
  assignedTeam: string[]
  communicationPlan: {
    notificationSent: boolean
    channels: string[]
    lastUpdate: string
  }
  rollbackPlan: string
}

const maintenanceWindows: MaintenanceWindow[] = [
  {
    id: "maint-001",
    title: "Database Upgrade",
    description: "PostgreSQL version upgrade from 14 to 15",
    type: "scheduled",
    status: "planned",
    startTime: "2024-03-20T02:00:00Z",
    endTime: "2024-03-20T04:00:00Z",
    affectedServices: ["Database", "API", "Web App"],
    estimatedImpact: "5 minutes of downtime during failover",
    assignedTeam: ["DBA Team", "SRE Team"],
    communicationPlan: {
      notificationSent: true,
      channels: ["Email", "Status Page", "In-app Banner"],
      lastUpdate: "2024-03-15T10:00:00Z"
    },
    rollbackPlan: "Automated rollback to PostgreSQL 14 if issues detected"
  },
  {
    id: "maint-002",
    title: "SSL Certificate Renewal",
    description: "Renew SSL certificates for all domains",
    type: "routine",
    status: "planned",
    startTime: "2024-03-22T00:00:00Z",
    endTime: "2024-03-22T00:30:00Z",
    affectedServices: ["Web App", "API"],
    estimatedImpact: "No downtime expected",
    assignedTeam: ["Security Team"],
    communicationPlan: {
      notificationSent: false,
      channels: ["Status Page"],
      lastUpdate: ""
    },
    rollbackPlan: "Revert to previous certificates if validation fails"
  }
]

export function MaintenanceScheduling() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned": return "bg-blue-100 text-blue-800"
      case "in_progress": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "emergency": return "bg-red-100 text-red-800"
      case "scheduled": return "bg-blue-100 text-blue-800"
      case "routine": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Maintenance Scheduling</h2>
          <p className="text-gray-600">Plan and track system maintenance windows</p>
        </div>
        <Button>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>Scheduled maintenance windows and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceWindows.map((window) => (
                  <div key={window.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {window.title}
                          <Badge className={getTypeColor(window.type)}>
                            {window.type}
                          </Badge>
                          <Badge className={getStatusColor(window.status)}>
                            {window.status}
                          </Badge>
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{window.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Schedule</p>
                        <p className="font-medium">
                          {new Date(window.startTime).toLocaleString()} - {new Date(window.endTime).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estimated Impact</p>
                        <p className="font-medium">{window.estimatedImpact}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Affected Services</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {window.affectedServices.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Communication</p>
                        <div className="flex items-center gap-1">
                          {window.communicationPlan.notificationSent ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-yellow-600" />
                          )}
                          <span className="text-xs">
                            {window.communicationPlan.notificationSent ? "Sent" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        View Plan
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Send Update
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Rollback Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Next Deployment Window</AlertTitle>
                <AlertDescription>
                  Friday, March 22, 2024 at 2:00 AM EST - Low traffic period identified for minimal impact
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <Badge>3 windows</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <Badge className="bg-green-100 text-green-800">2</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Upcoming</span>
                <Badge className="bg-blue-100 text-blue-800">1</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Duration</span>
                <span className="font-medium">1.5 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}