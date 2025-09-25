"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Globe,
  Activity,
  Key,
  FileWarning
} from "lucide-react"
import { format } from "date-fns"

// Translations
const securityTranslations: Record<string, Record<string, string>> = {
  security_monitoring: {
    en: "Security Monitoring",
    fr: "Surveillance de sécurité",
    ht: "Siveyans sekirite"
  },
  platform_security: {
    en: "Monitor and manage platform security",
    fr: "Surveiller et gérer la sécurité",
    ht: "Siveye ak jere sekirite"
  }
}

// Mock security data
const securityEvents = [
  { id: "1", type: "Failed Login", user: "unknown@email.com", ip: "192.168.1.1", location: "New York, US", timestamp: new Date(), severity: "medium" },
  { id: "2", type: "Suspicious Activity", user: "user123", ip: "10.0.0.1", location: "Unknown", timestamp: new Date(), severity: "high" },
  { id: "3", type: "Password Reset", user: "john@example.com", ip: "172.16.0.1", location: "Miami, US", timestamp: new Date(), severity: "low" },
  { id: "4", type: "Account Locked", user: "spam@bot.com", ip: "1.2.3.4", location: "Russia", timestamp: new Date(), severity: "high" },
  { id: "5", type: "New Device Login", user: "sarah@example.com", ip: "192.168.0.1", location: "Boston, US", timestamp: new Date(), severity: "low" }
]

const threatLevel = {
  current: "Medium",
  score: 65,
  color: "text-yellow-600 bg-yellow-50"
}

export default function SecurityPage() {
  const tAdmin = useTranslations()

  const tAdmin = (key: string) => {
    return securityTranslations[key]?.['en'] || securityTranslations[key]?.en || key
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700"
      case "medium": return "bg-yellow-100 text-yellow-700"
      case "low": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{tAdmin('security_monitoring'}</h1>
        <p className="text-gray-600 mt-1">{tAdmin('platform_security'}</p>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Threat Level</p>
                <p className="text-2xl font-bold mt-1">{threatLevel.current}</p>
                <Progress value={threatLevel.score} className="mt-2 h-2" />
              </div>
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Logins (24h)</p>
                <p className="text-2xl font-bold mt-1">47</p>
                <p className="text-xs text-gray-500 mt-1">3 blocked IPs</p>
              </div>
              <Lock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold mt-1">1,234</p>
                <p className="text-xs text-gray-500 mt-1">12 suspicious</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SSL Status</p>
                <p className="text-2xl font-bold text-green-600 mt-1">Valid</p>
                <p className="text-xs text-gray-500 mt-1">Expires in 89 days</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Alert className="mb-8 bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle>Security Alert</AlertTitle>
        <AlertDescription>
          Multiple failed login attempts detected from IP 192.168.1.1. Consider blocking this IP address.
        </AlertDescription>
      </Alert>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Monitor suspicious activities and security incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>User/Email</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map(event => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.type}</TableCell>
                  <TableCell>{event.user}</TableCell>
                  <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{format(event.timestamp, 'MMM d, HH:mm')}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">Block IP</Button>
                      <Button variant="ghost" size="sm">Investigate</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}