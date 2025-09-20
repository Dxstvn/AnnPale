"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  UserPlus,
  Heart,
  Star,
  TrendingUp,
  Gift,
  MessageCircle,
  Mail,
  Filter,
  Search,
  MoreVertical,
  Crown,
  Sparkles,
  Calendar,
  DollarSign,
  Activity,
  Target,
  Award,
  Send,
  Tag,
  UserCheck,
  Globe,
  BarChart3
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Translations
const fanTranslations: Record<string, Record<string, string>> = {
  fan_relationships: {
    en: "Fan Relationships",
    fr: "Relations avec les fans",
    ht: "Relasyon ak fanatik"
  },
  manage_fan_community: {
    en: "Build and manage your fan community",
    fr: "Construisez et gérez votre communauté de fans",
    ht: "Konstwi ak jere kominote fanatik ou"
  },
  total_fans: {
    en: "Total Fans",
    fr: "Total des fans",
    ht: "Total fanatik"
  },
  active_fans: {
    en: "Active Fans",
    fr: "Fans actifs",
    ht: "Fanatik aktif"
  },
  top_supporters: {
    en: "Top Supporters",
    fr: "Meilleurs supporters",
    ht: "Pi gwo sipòtè"
  },
  engagement_rate: {
    en: "Engagement Rate",
    fr: "Taux d'engagement",
    ht: "To angajman"
  },
  all_fans: {
    en: "All Fans",
    fr: "Tous les fans",
    ht: "Tout fanatik"
  },
  vip_fans: {
    en: "VIP Fans",
    fr: "Fans VIP",
    ht: "Fanatik VIP"
  },
  new_fans: {
    en: "New Fans",
    fr: "Nouveaux fans",
    ht: "Nouvo fanatik"
  },
  segments: {
    en: "Segments",
    fr: "Segments",
    ht: "Segman"
  },
  send_message: {
    en: "Send Message",
    fr: "Envoyer un message",
    ht: "Voye mesaj"
  },
  create_segment: {
    en: "Create Segment",
    fr: "Créer un segment",
    ht: "Kreye segman"
  },
  filter_fans: {
    en: "Filter Fans",
    fr: "Filtrer les fans",
    ht: "Filtre fanatik"
  },
  fan_insights: {
    en: "Fan Insights",
    fr: "Informations sur les fans",
    ht: "Enfòmasyon fanatik"
  }
}

// Mock data
const fanStats = {
  totalFans: 2847,
  activeFans: 1923,
  topSupporters: 127,
  engagementRate: 68,
  growth: {
    amount: 234,
    percentage: 8.9
  }
}

const fanSegments = [
  { id: "1", name: "Super Fans", count: 127, color: "bg-purple-100 text-purple-700", icon: Crown },
  { id: "2", name: "Birthday Bookers", count: 456, color: "bg-pink-100 text-pink-700", icon: Gift },
  { id: "3", name: "Repeat Customers", count: 312, color: "bg-blue-100 text-blue-700", icon: Star },
  { id: "4", name: "New Fans", count: 89, color: "bg-green-100 text-green-700", icon: UserPlus },
  { id: "5", name: "International", count: 567, color: "bg-orange-100 text-orange-700", icon: Globe }
]

const fans = [
  {
    id: "1",
    name: "Sarah Mitchell",
    avatar: "/api/placeholder/40/40",
    location: "New York, NY",
    joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalSpent: 850,
    bookings: 5,
    rating: 5,
    tags: ["VIP", "Birthday", "Repeat"],
    tier: "platinum" as const,
    engagement: "high" as const
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    avatar: "/api/placeholder/40/40",
    location: "Miami, FL",
    joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    totalSpent: 320,
    bookings: 2,
    rating: 5,
    tags: ["Anniversary"],
    tier: "gold" as const,
    engagement: "medium" as const
  },
  {
    id: "3",
    name: "Lisa Kim",
    avatar: "/api/placeholder/40/40",
    location: "Boston, MA",
    joinedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    totalSpent: 195,
    bookings: 1,
    rating: 4,
    tags: ["New", "Graduation"],
    tier: "silver" as const,
    engagement: "low" as const
  },
  {
    id: "4",
    name: "John Davis",
    avatar: "/api/placeholder/40/40",
    location: "Montreal, QC",
    joinedDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalSpent: 1250,
    bookings: 8,
    rating: 5,
    tags: ["VIP", "International", "Wedding"],
    tier: "platinum" as const,
    engagement: "high" as const
  },
  {
    id: "5",
    name: "Emma Thompson",
    avatar: "/api/placeholder/40/40",
    location: "Port-au-Prince, Haiti",
    joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    totalSpent: 95,
    bookings: 1,
    rating: 3,
    tags: ["New", "International"],
    tier: "bronze" as const,
    engagement: "low" as const
  }
]

const topSupporters = fans
  .filter(f => f.tier === "platinum")
  .sort((a, b) => b.totalSpent - a.totalSpent)
  .slice(0, 3)

export default function FansPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSegment, setFilterSegment] = useState("all")
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isSegmentDialogOpen, setIsSegmentDialogOpen] = useState(false)
  const [selectedFans, setSelectedFans] = useState<string[]>([])
  const [messageContent, setMessageContent] = useState("")
  const [segmentName, setSegmentName] = useState("")
  const [segmentCriteria, setSegmentCriteria] = useState({
    minBookings: "",
    minSpent: "",
    location: "",
    tier: ""
  })
  
  const t = (key: string) => {
    return fanTranslations[key]?.[language] || fanTranslations[key]?.en || key
  }
  
  const getTierBadge = (tier: string) => {
    const config = {
      platinum: { label: "Platinum", className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white", icon: Crown },
      gold: { label: "Gold", className: "bg-yellow-100 text-yellow-800", icon: Star },
      silver: { label: "Silver", className: "bg-gray-100 text-gray-700", icon: Award },
      bronze: { label: "Bronze", className: "bg-orange-100 text-orange-700", icon: Award }
    }
    const tierConfig = config[tier as keyof typeof config]
    if (!tierConfig) return null
    
    const Icon = tierConfig.icon
    return (
      <Badge className={tierConfig.className}>
        <Icon className="h-3 w-3 mr-1" />
        {tierConfig.label}
      </Badge>
    )
  }
  
  const getEngagementIndicator = (engagement: string) => {
    const config = {
      high: { color: "bg-green-500", label: "High" },
      medium: { color: "bg-yellow-500", label: "Medium" },
      low: { color: "bg-gray-400", label: "Low" }
    }
    const engConfig = config[engagement as keyof typeof config]
    return engConfig ? (
      <div className="flex items-center gap-1">
        <div className={cn("h-2 w-2 rounded-full", engConfig.color)} />
        <span className="text-xs text-gray-500">{engConfig.label}</span>
      </div>
    ) : null
  }
  
  const handleSendMessage = () => {
    console.log("Sending message:", messageContent, "to fans:", selectedFans)
    setIsMessageDialogOpen(false)
    setMessageContent("")
    setSelectedFans([])
  }
  
  const handleCreateSegment = () => {
    console.log("Creating segment:", segmentName, "with criteria:", segmentCriteria)
    setIsSegmentDialogOpen(false)
    setSegmentName("")
    setSegmentCriteria({
      minBookings: "",
      minSpent: "",
      location: "",
      tier: ""
    })
  }
  
  const toggleFanSelection = (fanId: string) => {
    setSelectedFans(prev =>
      prev.includes(fanId)
        ? prev.filter(id => id !== fanId)
        : [...prev, fanId]
    )
  }
  
  const filteredFans = fans.filter(fan => {
    if (activeTab === "vip" && fan.tier !== "platinum") return false
    if (activeTab === "new" && !fan.tags.includes("New")) return false
    if (searchQuery && !fan.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('fan_relationships')}</h1>
            <p className="text-gray-600 mt-1">{t('manage_fan_community')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isSegmentDialogOpen} onOpenChange={setIsSegmentDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  {t('create_segment')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('create_segment')}</DialogTitle>
                  <DialogDescription>
                    Define criteria to create a custom fan segment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="segment-name">Segment Name</Label>
                    <Input
                      id="segment-name"
                      placeholder="e.g., Holiday Shoppers"
                      value={segmentName}
                      onChange={(e) => setSegmentName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-bookings">Min Bookings</Label>
                      <Input
                        id="min-bookings"
                        type="number"
                        placeholder="0"
                        value={segmentCriteria.minBookings}
                        onChange={(e) => setSegmentCriteria({...segmentCriteria, minBookings: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-spent">Min Spent ($)</Label>
                      <Input
                        id="min-spent"
                        type="number"
                        placeholder="0"
                        value={segmentCriteria.minSpent}
                        onChange={(e) => setSegmentCriteria({...segmentCriteria, minSpent: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., New York"
                      value={segmentCriteria.location}
                      onChange={(e) => setSegmentCriteria({...segmentCriteria, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tier">Fan Tier</Label>
                    <Select
                      value={segmentCriteria.tier}
                      onValueChange={(value) => setSegmentCriteria({...segmentCriteria, tier: value})}
                    >
                      <SelectTrigger id="tier">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="bronze">Bronze</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSegmentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSegment} disabled={!segmentName}>
                    Create Segment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  disabled={selectedFans.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {t('send_message')} {selectedFans.length > 0 && `(${selectedFans.length})`}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Message to Fans</DialogTitle>
                  <DialogDescription>
                    Compose a message for {selectedFans.length} selected fan{selectedFans.length !== 1 ? 's' : ''}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedFans.map(fanId => {
                        const fan = fans.find(f => f.id === fanId)
                        return fan ? (
                          <Badge key={fanId} variant="secondary">
                            {fan.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                    Send Message
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('total_fans')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{fanStats.totalFans.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{fanStats.growth.amount}</span>
                <span className="text-xs text-gray-500 ml-1">({fanStats.growth.percentage}%)</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('active_fans')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{fanStats.activeFans.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('top_supporters')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{fanStats.topSupporters}</p>
              <p className="text-xs text-gray-500 mt-1">Platinum tier</p>
            </div>
            <Crown className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('engagement_rate')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{fanStats.engagementRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Above average</p>
            </div>
            <Heart className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>
      
      {/* Fan Segments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fan Segments</CardTitle>
          <CardDescription>Quick access to your fan groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {fanSegments.map((segment) => {
              const Icon = segment.icon
              return (
                <Button
                  key={segment.id}
                  variant="outline"
                  className="h-auto flex-col p-4 hover:shadow-md transition-shadow"
                  onClick={() => setFilterSegment(segment.id)}
                >
                  <Badge className={cn("mb-2", segment.color)}>
                    <Icon className="h-3 w-3 mr-1" />
                    {segment.count}
                  </Badge>
                  <span className="text-sm font-medium">{segment.name}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Top Supporters Highlight */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Supporters</CardTitle>
              <CardDescription>Your most valuable fans</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              VIP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {topSupporters.map((fan, index) => (
              <div key={fan.id} className="flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={fan.avatar} />
                    <AvatarFallback>{fan.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{fan.name}</p>
                  <p className="text-sm text-gray-500">{fan.bookings} bookings • ${fan.totalSpent}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Fans List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('fan_insights')}</CardTitle>
              <CardDescription>Detailed information about your fans</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search fans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[200px]"
                />
              </div>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                {t('all_fans')}
                <Badge className="ml-2" variant="secondary">{fans.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="vip">
                {t('vip_fans')}
                <Badge className="ml-2" variant="secondary">
                  {fans.filter(f => f.tier === "platinum").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="new">
                {t('new_fans')}
                <Badge className="ml-2" variant="secondary">
                  {fans.filter(f => f.tags.includes("New")).length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFans(filteredFans.map(f => f.id))
                        } else {
                          setSelectedFans([])
                        }
                      }}
                      checked={selectedFans.length === filteredFans.length && filteredFans.length > 0}
                    />
                  </TableHead>
                  <TableHead>Fan</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFans.map((fan) => (
                  <TableRow key={fan.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedFans.includes(fan.id)}
                        onChange={() => toggleFanSelection(fan.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={fan.avatar} />
                          <AvatarFallback>{fan.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{fan.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {fan.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{fan.location}</TableCell>
                    <TableCell>{getTierBadge(fan.tier)}</TableCell>
                    <TableCell>{fan.bookings}</TableCell>
                    <TableCell className="font-bold">${fan.totalSpent}</TableCell>
                    <TableCell>{getEngagementIndicator(fan.engagement)}</TableCell>
                    <TableCell>
                      {format(fan.lastActive, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}