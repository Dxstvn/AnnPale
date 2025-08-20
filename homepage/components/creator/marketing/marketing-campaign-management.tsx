"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Target,
  Users,
  MessageSquare,
  Calendar,
  Send,
  Mail,
  Eye,
  Heart,
  Gift,
  Repeat,
  Star,
  Zap,
  Plus,
  Search,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

// Campaign types and configuration
export interface CampaignType {
  id: string
  name: string
  purpose: string
  targetAudience: string
  frequency: string
  expectedROI: string
  color: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  metrics: {
    openRate: number
    clickRate: number
    conversionRate: number
  }
}

export const campaignTypes: CampaignType[] = [
  {
    id: "welcome",
    name: "Welcome Series",
    purpose: "Onboarding",
    targetAudience: "New customers",
    frequency: "Once",
    expectedROI: "35% activation",
    color: "bg-blue-500",
    icon: Heart,
    description: "Introduce new fans to your content and services",
    metrics: { openRate: 85, clickRate: 45, conversionRate: 35 }
  },
  {
    id: "seasonal",
    name: "Seasonal",
    purpose: "Holiday bookings",
    targetAudience: "All fans",
    frequency: "Quarterly",
    expectedROI: "250% ROI",
    color: "bg-green-500",
    icon: Gift,
    description: "Leverage holidays and special occasions for bookings",
    metrics: { openRate: 72, clickRate: 38, conversionRate: 28 }
  },
  {
    id: "vip",
    name: "VIP Exclusive",
    purpose: "Loyalty reward",
    targetAudience: "Top 20%",
    frequency: "Bi-monthly",
    expectedROI: "400% ROI",
    color: "bg-purple-500",
    icon: Star,
    description: "Special offers for your most loyal supporters",
    metrics: { openRate: 92, clickRate: 65, conversionRate: 52 }
  }
]

// Campaign goals
export const campaignGoals = [
  { id: "bookings", label: "Increase bookings", icon: Target, description: "Drive more video message requests" },
  { id: "awareness", label: "Build awareness", icon: Eye, description: "Expand your reach and visibility" },
  { id: "loyalty", label: "Reward loyalty", icon: Heart, description: "Strengthen relationships with top fans" },
  { id: "referrals", label: "Generate referrals", icon: Users, description: "Grow your fan base through existing fans" }
]

// Fan segments for targeting
export interface FanSegment {
  id: string
  name: string
  description: string
  size: number
  engagementRate: number
  avgSpend: number
  criteria: string[]
}

export const fanSegments: FanSegment[] = [
  {
    id: "new_fans",
    name: "New Fans",
    description: "Recently discovered your content",
    size: 1245,
    engagementRate: 65,
    avgSpend: 45,
    criteria: ["Joined within 30 days", "0-1 bookings"]
  },
  {
    id: "active_fans",
    name: "Active Fans",
    description: "Regular engagers and bookers",
    size: 3892,
    engagementRate: 82,
    avgSpend: 125,
    criteria: ["Active within 7 days", "2+ bookings", "High engagement"]
  },
  {
    id: "super_fans",
    name: "Super Fans",
    description: "Your most dedicated supporters",
    size: 567,
    engagementRate: 95,
    avgSpend: 285,
    criteria: ["5+ bookings", "Shares content", "Premium tier"]
  }
]

// Campaign interface
export interface Campaign {
  id: string
  name: string
  type: string
  goal: string
  status: "draft" | "scheduled" | "active" | "paused" | "completed"
  targetSegments: string[]
  audienceSize: number
  performance: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
    unsubscribed: number
  }
  createdAt: Date
  updatedAt: Date
}

// Sample campaigns data
const sampleCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Holiday Special - Christmas Messages",
    type: "seasonal",
    goal: "bookings",
    status: "active",
    targetSegments: ["active_fans", "super_fans"],
    audienceSize: 4459,
    performance: {
      sent: 4459,
      delivered: 4398,
      opened: 3168,
      clicked: 1267,
      converted: 354,
      revenue: 8850,
      unsubscribed: 12
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Welcome New Fans Series",
    type: "welcome",
    goal: "awareness",
    status: "scheduled",
    targetSegments: ["new_fans"],
    audienceSize: 1245,
    performance: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      unsubscribed: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Performance metrics data
const performanceData = [
  { name: "Sent", value: 5351, change: "+12%" },
  { name: "Delivered", value: 5277, change: "+11%" },
  { name: "Opened", value: 3678, change: "+18%" },
  { name: "Clicked", value: 1485, change: "+22%" },
  { name: "Converted", value: 452, change: "+15%" },
  { name: "Revenue", value: 11300, change: "+28%" }
]

const campaignAnalytics = [
  { month: "Oct", campaigns: 12, revenue: 8500, roi: 250 },
  { month: "Nov", campaigns: 15, revenue: 11200, roi: 280 },
  { month: "Dec", campaigns: 18, revenue: 15800, roi: 320 },
  { month: "Jan", campaigns: 14, revenue: 9800, roi: 245 },
  { month: "Feb", campaigns: 16, revenue: 12500, roi: 295 }
]

// Campaign wizard component
function CampaignWizard({ onComplete }: { onComplete: (campaign: Partial<Campaign>) => void }) {
  const [currentStep, setCurrentStep] = React.useState(1)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Campaign Creation Wizard</h3>
        <p className="text-gray-600">Step {currentStep} of 5</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Campaign Name</Label>
              <Input placeholder="Enter campaign name..." />
            </div>
            <div>
              <Label>Campaign Type</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {campaignTypes.map((type) => (
                  <div key={type.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded text-white text-xs", type.color)}>
                        <type.icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{type.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled>Back</Button>
          <Button>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Campaign card component
function CampaignCard({ campaign }: { campaign: Campaign }) {
  const campaignType = campaignTypes.find(t => t.id === campaign.type)
  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    scheduled: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    completed: "bg-purple-100 text-purple-700"
  }

  const openRate = campaign.performance.sent > 0 
    ? (campaign.performance.opened / campaign.performance.sent * 100).toFixed(1)
    : '0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {campaignType && (
                <div className={cn("p-2 rounded-lg text-white", campaignType.color)}>
                  <campaignType.icon className="h-4 w-4" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <p className="text-sm text-gray-600">{campaignType?.name}</p>
              </div>
            </div>
            <Badge className={statusColors[campaign.status]}>
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Audience:</span>
              <p className="font-medium">{campaign.audienceSize.toLocaleString()} fans</p>
            </div>
            <div>
              <span className="text-gray-600">Revenue:</span>
              <p className="font-medium">${campaign.performance.revenue.toLocaleString()}</p>
            </div>
          </div>

          {campaign.status !== 'draft' && campaign.performance.sent > 0 && (
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{openRate}%</div>
              <p className="text-gray-600 text-xs">Open Rate</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Main marketing campaign management component
export function MarketingCampaignManagement() {
  const [campaigns] = React.useState<Campaign[]>(sampleCampaigns)
  const [showWizard, setShowWizard] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState("overview")

  const handleCreateCampaign = () => {
    setShowWizard(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
          <p className="text-gray-600">Design and execute targeted campaigns to grow your audience</p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {performanceData.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{metric.name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {metric.name === "Revenue" ? "$" : ""}{metric.value.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600">{metric.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Campaign types overview */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Types & Performance</CardTitle>
              <CardDescription>Expected performance metrics for different campaign types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaignTypes.map((type) => (
                  <div key={type.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg text-white", type.color)}>
                        <type.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Open Rate:</span>
                            <span className="font-medium">{type.metrics.openRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Click Rate:</span>
                            <span className="font-medium">{type.metrics.clickRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Conversion:</span>
                            <span className="font-medium">{type.metrics.conversionRate}%</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {type.expectedROI}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaigns grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Campaign performance charts */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={campaignAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="roi" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          {/* Fan segments */}
          <Card>
            <CardHeader>
              <CardTitle>Fan Segments</CardTitle>
              <CardDescription>Target your campaigns to specific audience segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fanSegments.map((segment) => (
                  <Card key={segment.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium">{segment.name}</h3>
                          <p className="text-sm text-gray-600">{segment.description}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-bold text-purple-600">{segment.size.toLocaleString()}</div>
                            <p className="text-gray-600">Fans</p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-600">{segment.engagementRate}%</div>
                            <p className="text-gray-600">Engaged</p>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-blue-600">${segment.avgSpend}</div>
                            <p className="text-gray-600">Avg Spend</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {segment.criteria.map((criterion, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {criterion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Message templates */}
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Pre-built templates for common campaign types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaignTypes.map((type) => (
                  <Card key={type.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-2 rounded-lg text-white", type.color)}>
                            <type.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium">{type.name} Template</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                          <p className="font-medium mb-1">Expected Performance:</p>
                          <div className="flex gap-4 text-xs">
                            <span>{type.metrics.openRate}% open</span>
                            <span>{type.metrics.clickRate}% click</span>
                            <span>{type.metrics.conversionRate}% conversion</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign wizard dialog */}
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Use our step-by-step wizard to create targeted marketing campaigns
            </DialogDescription>
          </DialogHeader>
          <CampaignWizard onComplete={handleCreateCampaign} />
        </DialogContent>
      </Dialog>
    </div>
  )
}