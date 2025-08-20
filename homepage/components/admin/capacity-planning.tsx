"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  HardDrive,
  Cpu,
  Database,
  Cloud,
  DollarSign,
  AlertTriangle,
  Info,
  Zap,
  BarChart3,
  Settings,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ResourceUsage {
  resource: string
  current: number
  projected30: number
  projected60: number
  projected90: number
  capacity: number
  unit: string
  costPerUnit: number
  scaleThreshold: number
}

const resourceUsage: ResourceUsage[] = [
  {
    resource: "Storage",
    current: 1.2,
    projected30: 1.5,
    projected60: 1.8,
    projected90: 2.2,
    capacity: 3,
    unit: "TB",
    costPerUnit: 50,
    scaleThreshold: 2.5
  },
  {
    resource: "Compute",
    current: 16,
    projected30: 20,
    projected60: 24,
    projected90: 28,
    capacity: 32,
    unit: "vCPUs",
    costPerUnit: 40,
    scaleThreshold: 28
  },
  {
    resource: "Memory",
    current: 48,
    projected30: 56,
    projected60: 62,
    projected90: 68,
    capacity: 96,
    unit: "GB",
    costPerUnit: 10,
    scaleThreshold: 80
  },
  {
    resource: "Bandwidth",
    current: 4.5,
    projected30: 5.2,
    projected60: 6.1,
    projected90: 7.2,
    capacity: 10,
    unit: "Gbps",
    costPerUnit: 100,
    scaleThreshold: 8
  }
]

export function CapacityPlanning() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("90days")

  const getUtilizationColor = (current: number, capacity: number, threshold: number) => {
    const utilization = (current / capacity) * 100
    const thresholdPercent = (threshold / capacity) * 100
    
    if (utilization >= thresholdPercent) return "text-red-600"
    if (utilization >= thresholdPercent * 0.8) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Capacity Planning</h2>
          <p className="text-gray-600">Resource usage trends and scaling recommendations</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription>
          Based on current growth trends, storage capacity will need expansion within 60 days.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resourceUsage.map((resource) => (
          <Card key={resource.resource}>
            <CardHeader>
              <CardTitle>{resource.resource}</CardTitle>
              <CardDescription>
                Current: {resource.current}{resource.unit} / {resource.capacity}{resource.unit}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Usage</span>
                    <span className={cn(
                      "font-medium",
                      getUtilizationColor(resource.current, resource.capacity, resource.scaleThreshold)
                    )}>
                      {Math.round((resource.current / resource.capacity) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(resource.current / resource.capacity) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">30 Days</p>
                    <p className="font-medium">{resource.projected30}{resource.unit}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((resource.projected30 / resource.capacity) * 100)}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">60 Days</p>
                    <p className="font-medium">{resource.projected60}{resource.unit}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((resource.projected60 / resource.capacity) * 100)}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">90 Days</p>
                    <p className="font-medium">{resource.projected90}{resource.unit}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((resource.projected90 / resource.capacity) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scale Threshold</span>
                    <span>{resource.scaleThreshold}{resource.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Monthly Cost</span>
                    <span>${(resource.current * resource.costPerUnit).toLocaleString()}</span>
                  </div>
                </div>

                {resource.projected60 >= resource.scaleThreshold && (
                  <Alert className="border-yellow-500 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Will reach scaling threshold in ~60 days
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}