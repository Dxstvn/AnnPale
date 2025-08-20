"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import {
  Shield,
  Award,
  Star,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Tag,
  Camera,
  Video,
  Users,
  Settings,
  Activity,
  Eye,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  MessageSquare,
  FileText,
  BarChart3,
  Zap,
  Globe
} from "lucide-react"

interface CreatorProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  location: string
  languages: string[]
  joinDate: string
  verificationStatus: "pending" | "verified" | "rejected" | "suspended"
  verificationBadges: string[]
  featuredStatus: boolean
  featuredUntil?: string
  categories: string[]
  primaryCategory: string
  pricing: {
    basePrice: number
    rushPrice: number
    businessPrice: number
    currency: string
    customPricing: boolean
  }
  availability: {
    status: "available" | "busy" | "vacation" | "offline"
    turnaroundTime: number // in days
    acceptingOrders: boolean
    maxOrdersPerWeek: number
    vacationMode: {
      enabled: boolean
      startDate?: string
      endDate?: string
      message?: string
    }
  }
  qualityMetrics: {
    completionRate: number
    customerRating: number
    responseTime: number // in hours
    contentQuality: number
    policyCompliance: number
  }
  performance: {
    totalOrders: number
    completedOrders: number
    totalRevenue: number
    monthlyRevenue: number
    averageOrderValue: number
    repeatCustomerRate: number
  }
  settings: {
    autoApproveOrders: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    marketingOptIn: boolean
    showcaseProfile: boolean
    allowBusinessRequests: boolean
  }
  compliance: {
    contentViolations: number
    lastViolation?: string
    warningCount: number
    suspensionHistory: Array<{
      date: string
      reason: string
      duration: number
    }>
  }
  tags: string[]
  notes: string
}

const mockCreator: CreatorProfile = {
  id: "creator-001",
  name: "Marie-Claire Dubois",
  email: "marie.dubois@example.com",
  avatar: "/placeholder-avatar.jpg",
  bio: "Professional Haitian singer and entertainer with 15+ years of experience. Specializing in personalized birthday messages, wedding congratulations, and motivational content.",
  location: "Port-au-Prince, Haiti",
  languages: ["Kreyòl", "Français", "English"],
  joinDate: "2024-01-15",
  verificationStatus: "verified",
  verificationBadges: ["identity", "celebrity", "top-creator"],
  featuredStatus: true,
  featuredUntil: "2024-12-31",
  categories: ["Music", "Entertainment", "Motivation"],
  primaryCategory: "Music",
  pricing: {
    basePrice: 50,
    rushPrice: 100,
    businessPrice: 250,
    currency: "USD",
    customPricing: true
  },
  availability: {
    status: "available",
    turnaroundTime: 3,
    acceptingOrders: true,
    maxOrdersPerWeek: 20,
    vacationMode: {
      enabled: false
    }
  },
  qualityMetrics: {
    completionRate: 98.5,
    customerRating: 4.9,
    responseTime: 12,
    contentQuality: 95,
    policyCompliance: 100
  },
  performance: {
    totalOrders: 523,
    completedOrders: 515,
    totalRevenue: 45230,
    monthlyRevenue: 8500,
    averageOrderValue: 87,
    repeatCustomerRate: 35.5
  },
  settings: {
    autoApproveOrders: false,
    emailNotifications: true,
    smsNotifications: true,
    marketingOptIn: true,
    showcaseProfile: true,
    allowBusinessRequests: true
  },
  compliance: {
    contentViolations: 0,
    warningCount: 0,
    suspensionHistory: []
  },
  tags: ["premium", "fast-delivery", "popular", "rising-star"],
  notes: "Excellent creator with consistent high-quality content. Great communication with customers."
}

export function CreatorProfileManager() {
  const [creator, setCreator] = useState<CreatorProfile>(mockCreator)
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview")

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
    setHasChanges(false)
  }

  const handleCancel = () => {
    setCreator(mockCreator)
    setIsEditing(false)
    setHasChanges(false)
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "rejected": return "bg-red-100 text-red-800"
      case "suspended": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800"
      case "busy": return "bg-yellow-100 text-yellow-800"
      case "vacation": return "bg-blue-100 text-blue-800"
      case "offline": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar} />
            <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{creator.name}</h2>
            <p className="text-gray-600">{creator.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getVerificationColor(creator.verificationStatus)}>
                {creator.verificationStatus}
              </Badge>
              <Badge className={getAvailabilityColor(creator.availability.status)}>
                {creator.availability.status}
              </Badge>
              {creator.featuredStatus && (
                <Badge className="bg-purple-100 text-purple-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Basic creator profile details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input 
                    value={creator.name} 
                    disabled={!isEditing}
                    onChange={(e) => {
                      setCreator({...creator, name: e.target.value})
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    value={creator.email} 
                    disabled={!isEditing}
                    onChange={(e) => {
                      setCreator({...creator, email: e.target.value})
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input 
                    value={creator.location} 
                    disabled={!isEditing}
                    onChange={(e) => {
                      setCreator({...creator, location: e.target.value})
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label>Languages</Label>
                  <Input 
                    value={creator.languages.join(", ")} 
                    disabled={!isEditing}
                    placeholder="Comma separated"
                  />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea 
                  value={creator.bio} 
                  disabled={!isEditing}
                  rows={4}
                  onChange={(e) => {
                    setCreator({...creator, bio: e.target.value})
                    setHasChanges(true)
                  }}
                />
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {creator.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      {isEditing && (
                        <button className="ml-1 text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tag
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-semibold">{creator.qualityMetrics.completionRate}%</span>
                  </div>
                  <Progress value={creator.qualityMetrics.completionRate} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <span className="font-semibold">{creator.qualityMetrics.customerRating}/5</span>
                  </div>
                  <Progress value={creator.qualityMetrics.customerRating * 20} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Content Quality</span>
                    <span className="font-semibold">{creator.qualityMetrics.contentQuality}%</span>
                  </div>
                  <Progress value={creator.qualityMetrics.contentQuality} />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{creator.performance.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold">${creator.performance.monthlyRevenue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold">${creator.performance.averageOrderValue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Repeat Rate</p>
                  <p className="text-2xl font-bold">{creator.performance.repeatCustomerRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification & Badges</CardTitle>
              <CardDescription>Manage creator verification status and special badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Verification Status</Label>
                  <p className="text-sm text-gray-600">Current verification level and status</p>
                </div>
                <Select 
                  value={creator.verificationStatus} 
                  disabled={!isEditing}
                  onValueChange={(value: any) => {
                    setCreator({...creator, verificationStatus: value})
                    setHasChanges(true)
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Verification Badges</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {[
                    { id: "identity", label: "Identity Verified", icon: Shield },
                    { id: "celebrity", label: "Celebrity Status", icon: Star },
                    { id: "top-creator", label: "Top Creator", icon: Award },
                    { id: "trusted", label: "Trusted Partner", icon: CheckCircle },
                    { id: "premium", label: "Premium Creator", icon: Zap },
                    { id: "verified-business", label: "Business Verified", icon: Globe }
                  ].map(badge => (
                    <div key={badge.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Switch 
                        checked={creator.verificationBadges.includes(badge.id)}
                        disabled={!isEditing}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCreator({
                              ...creator, 
                              verificationBadges: [...creator.verificationBadges, badge.id]
                            })
                          } else {
                            setCreator({
                              ...creator,
                              verificationBadges: creator.verificationBadges.filter(b => b !== badge.id)
                            })
                          }
                          setHasChanges(true)
                        }}
                      />
                      <badge.icon className="h-4 w-4" />
                      <span className="text-sm">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Featured Creator Status</p>
                    <p className="text-sm text-gray-600">Display creator prominently on platform</p>
                  </div>
                </div>
                <Switch 
                  checked={creator.featuredStatus}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => {
                    setCreator({...creator, featuredStatus: checked})
                    setHasChanges(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Assignments</CardTitle>
              <CardDescription>Manage creator categories and specializations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Primary Category</Label>
                <Select 
                  value={creator.primaryCategory} 
                  disabled={!isEditing}
                  onValueChange={(value) => {
                    setCreator({...creator, primaryCategory: value})
                    setHasChanges(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Comedy">Comedy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Motivation">Motivation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Additional Categories</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    "Music", "Entertainment", "Sports", "Comedy", 
                    "Business", "Motivation", "Education", "Lifestyle"
                  ].map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Switch 
                        checked={creator.categories.includes(category)}
                        disabled={!isEditing}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCreator({
                              ...creator,
                              categories: [...creator.categories, category]
                            })
                          } else {
                            setCreator({
                              ...creator,
                              categories: creator.categories.filter(c => c !== category)
                            })
                          }
                          setHasChanges(true)
                        }}
                      />
                      <span className="text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>Set and manage creator pricing tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Base Price</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <Input 
                      type="number"
                      value={creator.pricing.basePrice} 
                      disabled={!isEditing}
                      onChange={(e) => {
                        setCreator({
                          ...creator,
                          pricing: {...creator.pricing, basePrice: Number(e.target.value)}
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Rush Price (24hr)</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <Input 
                      type="number"
                      value={creator.pricing.rushPrice} 
                      disabled={!isEditing}
                      onChange={(e) => {
                        setCreator({
                          ...creator,
                          pricing: {...creator.pricing, rushPrice: Number(e.target.value)}
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Business Price</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <Input 
                      type="number"
                      value={creator.pricing.businessPrice} 
                      disabled={!isEditing}
                      onChange={(e) => {
                        setCreator({
                          ...creator,
                          pricing: {...creator.pricing, businessPrice: Number(e.target.value)}
                        })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Custom Pricing</p>
                  <p className="text-sm text-gray-600">Allow creator to set custom prices for special requests</p>
                </div>
                <Switch 
                  checked={creator.pricing.customPricing}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => {
                    setCreator({
                      ...creator,
                      pricing: {...creator.pricing, customPricing: checked}
                    })
                    setHasChanges(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>Manage creator availability and order capacity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Availability Status</Label>
                  <Select 
                    value={creator.availability.status} 
                    disabled={!isEditing}
                    onValueChange={(value: any) => {
                      setCreator({
                        ...creator,
                        availability: {...creator.availability, status: value}
                      })
                      setHasChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Turnaround Time (days)</Label>
                  <Input 
                    type="number"
                    value={creator.availability.turnaroundTime} 
                    disabled={!isEditing}
                    onChange={(e) => {
                      setCreator({
                        ...creator,
                        availability: {
                          ...creator.availability, 
                          turnaroundTime: Number(e.target.value)
                        }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <div>
                <Label>Max Orders Per Week</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[creator.availability.maxOrdersPerWeek]}
                    max={50}
                    step={5}
                    disabled={!isEditing}
                    onValueChange={([value]) => {
                      setCreator({
                        ...creator,
                        availability: {...creator.availability, maxOrdersPerWeek: value}
                      })
                      setHasChanges(true)
                    }}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-semibold">
                    {creator.availability.maxOrdersPerWeek}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Accepting Orders</p>
                  <p className="text-sm text-gray-600">Allow new orders to be placed</p>
                </div>
                <Switch 
                  checked={creator.availability.acceptingOrders}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => {
                    setCreator({
                      ...creator,
                      availability: {...creator.availability, acceptingOrders: checked}
                    })
                    setHasChanges(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assessment</CardTitle>
              <CardDescription>Monitor and manage content quality metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Completion Rate</Label>
                      <span className="text-sm font-semibold">{creator.qualityMetrics.completionRate}%</span>
                    </div>
                    <Progress value={creator.qualityMetrics.completionRate} />
                    {creator.qualityMetrics.completionRate < 80 && (
                      <Alert className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Below target threshold. Training recommended.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Customer Rating</Label>
                      <span className="text-sm font-semibold">{creator.qualityMetrics.customerRating}/5</span>
                    </div>
                    <Progress value={creator.qualityMetrics.customerRating * 20} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Response Time</Label>
                      <span className="text-sm font-semibold">{creator.qualityMetrics.responseTime}h</span>
                    </div>
                    <Progress value={Math.max(0, 100 - (creator.qualityMetrics.responseTime * 2))} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Content Quality Score</Label>
                      <span className="text-sm font-semibold">{creator.qualityMetrics.contentQuality}%</span>
                    </div>
                    <Progress value={creator.qualityMetrics.contentQuality} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Policy Compliance</Label>
                      <span className="text-sm font-semibold">{creator.qualityMetrics.policyCompliance}%</span>
                    </div>
                    <Progress value={creator.qualityMetrics.policyCompliance} />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Content Violations</span>
                      <Badge variant={creator.compliance.contentViolations > 0 ? "destructive" : "secondary"}>
                        {creator.compliance.contentViolations}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">Warning Count</span>
                      <Badge variant={creator.compliance.warningCount > 0 ? "outline" : "secondary"}>
                        {creator.compliance.warningCount}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}