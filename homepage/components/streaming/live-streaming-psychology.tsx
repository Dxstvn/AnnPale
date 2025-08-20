"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Users,
  Heart,
  MessageSquare,
  Gift,
  Star,
  TrendingUp,
  Clock,
  Zap,
  Trophy,
  Target,
  Eye,
  ThumbsUp,
  Share2,
  DollarSign,
  Sparkles,
  Crown,
  Flame,
  Music,
  Camera,
  Video,
  Mic,
  Bell,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Info,
  Activity,
  BarChart3,
  PieChart,
  Wallet,
  CreditCard,
  Coins,
  Award,
  Medal,
  Shield,
  Gem,
  Package,
  Rocket,
  Lightning,
  Brain,
  UserCheck,
  UserPlus,
  UserX,
  Volume2,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Tv,
  Headphones,
  Gamepad2,
  Coffee,
  Pizza,
  Cake,
  PartyPopper,
  Balloon,
  Megaphone,
  Radio,
  Newspaper,
  BookOpen,
  GraduationCap,
  Briefcase,
  Home,
  MapPin,
  Globe,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Waves,
  Mountain,
  Trees,
  Flower,
  Bird,
  Fish,
  Cat,
  Dog,
  Rabbit,
  Turtle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from "recharts"
import { cn } from "@/lib/utils"

// Engagement pyramid data
const engagementPyramid = [
  {
    level: 1,
    name: "Watching",
    percentage: "80%",
    viewers: 800,
    icon: <Eye className="w-5 h-5" />,
    behaviors: ["Passive consumption", "Anonymous viewing", "No interaction"],
    color: "gray",
    revenue: 0
  },
  {
    level: 2,
    name: "Reacting",
    percentage: "15%",
    viewers: 150,
    icon: <Heart className="w-5 h-5" />,
    behaviors: ["Emoji reactions", "Hearts/likes", "Simple engagement"],
    color: "pink",
    revenue: 50
  },
  {
    level: 3,
    name: "Participating",
    percentage: "4%",
    viewers: 40,
    icon: <MessageSquare className="w-5 h-5" />,
    behaviors: ["Chat messages", "Questions", "Comments"],
    color: "blue",
    revenue: 200
  },
  {
    level: 4,
    name: "Supporting",
    percentage: "0.9%",
    viewers: 9,
    icon: <Gift className="w-5 h-5" />,
    behaviors: ["Virtual gifts", "Tips", "Subscriptions"],
    color: "purple",
    revenue: 500
  },
  {
    level: 5,
    name: "Championing",
    percentage: "0.1%",
    viewers: 1,
    icon: <Crown className="w-5 h-5" />,
    behaviors: ["Top donor", "Moderator", "Brand advocate"],
    color: "yellow",
    revenue: 1000
  }
]

// Viewer personas
const viewerPersonas = [
  {
    type: "Super Fan",
    icon: <Crown className="w-6 h-6" />,
    motivation: "Exclusive access",
    engagement: "High interaction",
    spending: "High tips/gifts",
    value: "Loyalty driver",
    percentage: 5,
    avgSpend: 150,
    color: "purple"
  },
  {
    type: "Casual Viewer",
    icon: <Users className="w-6 h-6" />,
    motivation: "Entertainment",
    engagement: "Passive watching",
    spending: "Occasional tips",
    value: "Volume audience",
    percentage: 60,
    avgSpend: 5,
    color: "blue"
  },
  {
    type: "Supporter",
    icon: <Heart className="w-6 h-6" />,
    motivation: "Help creator",
    engagement: "Moderate chat",
    spending: "Regular donations",
    value: "Sustainable revenue",
    percentage: 20,
    avgSpend: 25,
    color: "pink"
  },
  {
    type: "Discoverer",
    icon: <Sparkles className="w-6 h-6" />,
    motivation: "Finding new creators",
    engagement: "Browsing",
    spending: "Trial purchases",
    value: "Growth driver",
    percentage: 10,
    avgSpend: 10,
    color: "green"
  },
  {
    type: "Event Attendee",
    icon: <PartyPopper className="w-6 h-6" />,
    motivation: "Special occasions",
    engagement: "Event-specific",
    spending: "One-time high",
    value: "Revenue spikes",
    percentage: 5,
    avgSpend: 75,
    color: "orange"
  }
]

// Engagement triggers
const engagementTriggers = [
  {
    trigger: "Name Recognition",
    impact: "Very High",
    timing: "Any time",
    icon: <UserCheck className="w-5 h-5" />,
    description: "Call out viewer by name",
    effectiveness: 95
  },
  {
    trigger: "Direct Question",
    impact: "High",
    timing: "Mid-stream",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Ask audience questions",
    effectiveness: 85
  },
  {
    trigger: "Goal Setting",
    impact: "High",
    timing: "Stream start",
    icon: <Target className="w-5 h-5" />,
    description: "Set viewer/tip goals",
    effectiveness: 80
  },
  {
    trigger: "Exclusive Content",
    impact: "Very High",
    timing: "Peak viewers",
    icon: <Gem className="w-5 h-5" />,
    description: "Reveal special content",
    effectiveness: 90
  },
  {
    trigger: "Time Pressure",
    impact: "Medium",
    timing: "Stream end",
    icon: <Clock className="w-5 h-5" />,
    description: "Limited time offers",
    effectiveness: 70
  },
  {
    trigger: "Competition",
    impact: "High",
    timing: "Any time",
    icon: <Trophy className="w-5 h-5" />,
    description: "Viewer challenges",
    effectiveness: 75
  }
]

// Monetization strategies
const monetizationStrategies = [
  {
    strategy: "Virtual Gifts",
    icon: <Gift className="w-5 h-5" />,
    revenue: "$2-500",
    frequency: "Per stream",
    adoption: "70%",
    color: "purple"
  },
  {
    strategy: "Subscriptions",
    icon: <Star className="w-5 h-5" />,
    revenue: "$4.99/mo",
    frequency: "Monthly",
    adoption: "25%",
    color: "blue"
  },
  {
    strategy: "Super Chat",
    icon: <MessageSquare className="w-5 h-5" />,
    revenue: "$5-100",
    frequency: "Per message",
    adoption: "40%",
    color: "green"
  },
  {
    strategy: "Exclusive Access",
    icon: <Crown className="w-5 h-5" />,
    revenue: "$19.99/mo",
    frequency: "Monthly",
    adoption: "10%",
    color: "yellow"
  },
  {
    strategy: "Goal Funding",
    icon: <Target className="w-5 h-5" />,
    revenue: "$10-1000",
    frequency: "Per goal",
    adoption: "35%",
    color: "orange"
  },
  {
    strategy: "Paid Events",
    icon: <PartyPopper className="w-5 h-5" />,
    revenue: "$9.99-49.99",
    frequency: "Per event",
    adoption: "15%",
    color: "pink"
  }
]

// Stream performance metrics
const streamMetrics = [
  { time: "0min", viewers: 50, engagement: 10, revenue: 0 },
  { time: "5min", viewers: 120, engagement: 25, revenue: 15 },
  { time: "10min", viewers: 250, engagement: 45, revenue: 35 },
  { time: "15min", viewers: 380, engagement: 70, revenue: 85 },
  { time: "20min", viewers: 450, engagement: 95, revenue: 150 },
  { time: "25min", viewers: 520, engagement: 120, revenue: 225 },
  { time: "30min", viewers: 580, engagement: 140, revenue: 310 },
  { time: "35min", viewers: 550, engagement: 135, revenue: 380 },
  { time: "40min", viewers: 480, engagement: 115, revenue: 425 },
  { time: "45min", viewers: 400, engagement: 90, revenue: 450 }
]

// Psychological hooks
const psychologicalHooks = [
  {
    hook: "FOMO",
    description: "Fear of missing out on exclusive content",
    implementation: "Limited-time streams, exclusive reveals",
    effectiveness: 92
  },
  {
    hook: "Social Proof",
    description: "Others are watching and engaging",
    implementation: "Show viewer count, recent donations",
    effectiveness: 88
  },
  {
    hook: "Reciprocity",
    description: "Give value to receive support",
    implementation: "Free content, shoutouts, recognition",
    effectiveness: 85
  },
  {
    hook: "Scarcity",
    description: "Limited availability increases desire",
    implementation: "Limited slots, exclusive access",
    effectiveness: 90
  },
  {
    hook: "Progress",
    description: "Working toward shared goals",
    implementation: "Goal bars, milestones, celebrations",
    effectiveness: 87
  },
  {
    hook: "Belonging",
    description: "Part of a community",
    implementation: "Inside jokes, regular viewers, community events",
    effectiveness: 93
  }
]

export function LiveStreamingPsychology() {
  const [selectedPersona, setSelectedPersona] = useState(viewerPersonas[0])
  const [selectedPyramidLevel, setSelectedPyramidLevel] = useState(3)
  const [activeTab, setActiveTab] = useState("overview")
  const [showDetails, setShowDetails] = useState(false)

  // Calculate total revenue potential
  const totalRevenuePotential = engagementPyramid.reduce((acc, level) => 
    acc + (level.viewers * level.revenue), 0
  )

  // Calculate engagement score
  const engagementScore = Math.round(
    (engagementPyramid.slice(1).reduce((acc, level) => 
      acc + level.viewers, 0) / 1000) * 100
  )

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium">Live Streaming Psychology & Engagement</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Understanding Your Live Audience
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the psychology of live streaming to maximize engagement, build community, and increase revenue
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Score</p>
                <p className="text-2xl font-bold">{engagementScore}%</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from average</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue/Stream</p>
                <p className="text-2xl font-bold">${totalRevenuePotential.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">↑ $2,450 potential</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Viewers</p>
                <p className="text-2xl font-bold">20%</p>
                <p className="text-xs text-blue-600 mt-1">200 of 1000</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">4.9%</p>
                <p className="text-xs text-orange-600 mt-1">To paid supporters</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Engagement Pyramid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Live Stream Engagement Pyramid
              </CardTitle>
              <CardDescription>
                Understanding viewer behavior levels and monetization potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...engagementPyramid].reverse().map((level, index) => {
                  const widthPercentage = 100 - (index * 18)
                  const isSelected = selectedPyramidLevel === level.level
                  
                  return (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-center"
                    >
                      <button
                        onClick={() => setSelectedPyramidLevel(level.level)}
                        className={cn(
                          "relative transition-all duration-300 hover:scale-105",
                          isSelected && "scale-105"
                        )}
                        style={{ width: `${widthPercentage}%` }}
                      >
                        <div
                          className={cn(
                            "py-4 px-6 rounded-lg transition-colors border-2",
                            isSelected ? "border-purple-500" : "border-transparent",
                            level.level === 5 && "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
                            level.level === 4 && "bg-purple-100 dark:bg-purple-900/50",
                            level.level === 3 && "bg-blue-100 dark:bg-blue-900/50",
                            level.level === 2 && "bg-pink-100 dark:bg-pink-900/50",
                            level.level === 1 && "bg-gray-100 dark:bg-gray-800"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {level.icon}
                              <div className="text-left">
                                <p className="font-semibold">
                                  Level {level.level}: {level.name}
                                </p>
                                <p className="text-sm opacity-80">
                                  {level.percentage} • {level.viewers} viewers
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${level.revenue}</p>
                              <p className="text-xs opacity-80">per viewer</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  )
                })}

                {/* Selected Level Details */}
                <AnimatePresence mode="wait">
                  {selectedPyramidLevel && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 p-4 bg-muted rounded-lg"
                    >
                      <h4 className="font-semibold mb-2">
                        {engagementPyramid[selectedPyramidLevel - 1].name} Behaviors
                      </h4>
                      <ul className="space-y-1">
                        {engagementPyramid[selectedPyramidLevel - 1].behaviors.map((behavior, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {behavior}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Viewers</p>
                          <p className="font-semibold">
                            {engagementPyramid[selectedPyramidLevel - 1].viewers}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue/viewer</p>
                          <p className="font-semibold">
                            ${engagementPyramid[selectedPyramidLevel - 1].revenue}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total potential</p>
                          <p className="font-semibold">
                            ${(engagementPyramid[selectedPyramidLevel - 1].viewers * 
                              engagementPyramid[selectedPyramidLevel - 1].revenue).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Psychological Hooks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Psychological Hooks That Drive Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {psychologicalHooks.map((hook, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{hook.hook}</h4>
                      <Badge variant="outline">{hook.effectiveness}% effective</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{hook.description}</p>
                    <p className="text-sm"><strong>How:</strong> {hook.implementation}</p>
                    <Progress value={hook.effectiveness} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personas Tab */}
        <TabsContent value="personas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Viewer Personas & Behavior Patterns</CardTitle>
              <CardDescription>
                Understanding different viewer types to tailor content and monetization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Persona Distribution */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={viewerPersonas}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.type}: ${entry.percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {viewerPersonas.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.color === "purple" ? "#9333ea" :
                            entry.color === "blue" ? "#3b82f6" :
                            entry.color === "pink" ? "#ec4899" :
                            entry.color === "green" ? "#10b981" :
                            "#f97316"
                          } 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>

              {/* Persona Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {viewerPersonas.map((persona, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        selectedPersona.type === persona.type && "ring-2 ring-purple-500"
                      )}
                      onClick={() => setSelectedPersona(persona)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            persona.color === "purple" && "bg-purple-100",
                            persona.color === "blue" && "bg-blue-100",
                            persona.color === "pink" && "bg-pink-100",
                            persona.color === "green" && "bg-green-100",
                            persona.color === "orange" && "bg-orange-100"
                          )}>
                            {persona.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{persona.type}</h4>
                            <p className="text-sm text-muted-foreground">{persona.percentage}% of audience</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Motivation:</span>
                            <span>{persona.motivation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Engagement:</span>
                            <span>{persona.engagement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg spend:</span>
                            <span className="font-semibold">${persona.avgSpend}</span>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <p className="text-sm">
                          <strong>Platform value:</strong> {persona.value}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Selected Persona Details */}
              {selectedPersona && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedPersona.icon}
                      Engaging {selectedPersona.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Best Practices</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Acknowledge their presence regularly</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Create exclusive content for their tier</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Offer personalized rewards</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Build community around shared interests</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Revenue Optimization</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-background rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>Average spend:</span>
                              <span className="font-semibold">${selectedPersona.avgSpend}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span>Audience share:</span>
                              <span className="font-semibold">{selectedPersona.percentage}%</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span>Revenue contribution:</span>
                              <span className="font-semibold">
                                ${(selectedPersona.avgSpend * selectedPersona.percentage * 10).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Alert>
                            <Info className="w-4 h-4" />
                            <AlertDescription>
                              Focus on converting {selectedPersona.type} viewers to the next engagement level 
                              for maximum revenue impact.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Triggers & Techniques</CardTitle>
              <CardDescription>
                Proven methods to increase viewer interaction and retention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Engagement Triggers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {engagementTriggers.map((trigger, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {trigger.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{trigger.trigger}</h4>
                          <Badge 
                            variant={trigger.impact === "Very High" ? "default" : "secondary"}
                          >
                            {trigger.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{trigger.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Best timing: {trigger.timing}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">{trigger.effectiveness}%</span>
                            <Progress value={trigger.effectiveness} className="w-16 h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Engagement Flow Chart */}
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Optimal Engagement Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { phase: "Opening (0-5 min)", action: "Welcome viewers, set expectations", metric: "Retention" },
                      { phase: "Warm-up (5-10 min)", action: "Easy interactions, polls, greetings", metric: "Participation" },
                      { phase: "Main Content (10-30 min)", action: "Core value, demonstrations, Q&A", metric: "Engagement" },
                      { phase: "Peak Moment (30-35 min)", action: "Special reveal, exclusive content", metric: "Monetization" },
                      { phase: "Closing (35-45 min)", action: "Thank viewers, next stream preview", metric: "Return rate" }
                    ].map((phase, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium">{phase.phase}</div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 p-3 bg-background rounded-lg">
                          <p className="text-sm">{phase.action}</p>
                        </div>
                        <Badge variant="outline">{phase.metric}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stream Performance Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={streamMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <RechartsTooltip />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="viewers"
                          stroke="#9333ea"
                          fill="#9333ea20"
                          name="Viewers"
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="engagement"
                          stroke="#ec4899"
                          strokeWidth={2}
                          name="Engagement"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="revenue"
                          fill="#10b981"
                          name="Revenue ($)"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monetization Strategies & Psychology</CardTitle>
              <CardDescription>
                Convert engagement into sustainable revenue streams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strategy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monetizationStrategies.map((strategy, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          strategy.color === "purple" && "bg-purple-100",
                          strategy.color === "blue" && "bg-blue-100",
                          strategy.color === "green" && "bg-green-100",
                          strategy.color === "yellow" && "bg-yellow-100",
                          strategy.color === "orange" && "bg-orange-100",
                          strategy.color === "pink" && "bg-pink-100"
                        )}>
                          {strategy.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{strategy.strategy}</h4>
                          <p className="text-sm text-muted-foreground">{strategy.frequency}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Revenue range:</span>
                          <span className="font-semibold">{strategy.revenue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Adoption rate:</span>
                          <span>{strategy.adoption}</span>
                        </div>
                        <Progress value={parseInt(strategy.adoption)} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Revenue Optimization Tips */}
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Revenue Optimization Playbook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Psychological Triggers</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5" />
                          <div>
                            <strong>Exclusivity:</strong> "Only for my top supporters"
                          </div>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <strong>Urgency:</strong> "Next 10 minutes only"
                          </div>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Users className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <strong>Social Proof:</strong> "Join 50 others who..."
                          </div>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-purple-500 mt-0.5" />
                          <div>
                            <strong>Gamification:</strong> "Unlock the next level"
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Timing Strategies</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <ArrowUp className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <strong>Peak moments:</strong> After high-energy content
                          </div>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Target className="w-4 h-4 text-red-500 mt-0.5" />
                          <div>
                            <strong>Goal setting:</strong> Start of stream milestones
                          </div>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Gift className="w-4 h-4 text-purple-500 mt-0.5" />
                          <div>
                            <strong>Reciprocity:</strong> After giving value
                          </div>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Heart className="w-4 h-4 text-pink-500 mt-0.5" />
                          <div>
                            <strong>Emotional peaks:</strong> During personal stories
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Potential Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg Viewers</p>
                        <p className="text-xl font-bold">1,000</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        <p className="text-xl font-bold">20%</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-xl font-bold">4.9%</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg Transaction</p>
                        <p className="text-xl font-bold">$25</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Revenue per Stream</p>
                        <p className="text-3xl font-bold text-green-600">$1,225</p>
                      </div>
                      <Button>
                        Optimize Strategy
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deep Analytics & Insights</CardTitle>
              <CardDescription>
                Data-driven insights to improve your streaming strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Performance Radar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stream Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={[
                          { metric: 'Viewer Count', value: 85 },
                          { metric: 'Engagement', value: 72 },
                          { metric: 'Retention', value: 68 },
                          { metric: 'Monetization', value: 45 },
                          { metric: 'Growth', value: 78 },
                          { metric: 'Satisfaction', value: 88 }
                        ]}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Current" dataKey="value" stroke="#9333ea" fill="#9333ea" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Viewer Journey Funnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { stage: "Discovery", count: 5000, percentage: 100 },
                        { stage: "First View", count: 2500, percentage: 50 },
                        { stage: "Return Viewer", count: 1000, percentage: 20 },
                        { stage: "Active Participant", count: 200, percentage: 4 },
                        { stage: "Paid Supporter", count: 50, percentage: 1 }
                      ].map((stage, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{stage.stage}</span>
                            <span className="font-semibold">{stage.count.toLocaleString()}</span>
                          </div>
                          <Progress value={stage.percentage} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Insights */}
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="space-y-2">
                  <strong>Key Insights from Your Data:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Peak engagement occurs 15-20 minutes into streams</li>
                    <li>Name recognition increases tips by 3.5x</li>
                    <li>Goal-setting at stream start improves retention by 25%</li>
                    <li>Mobile viewers convert 40% better than desktop</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Action Items */}
              <Card className="bg-muted">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Recommended Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { priority: "High", action: "Implement viewer name recognition system", impact: "+35% engagement" },
                      { priority: "High", action: "Add goal progress bar overlay", impact: "+25% tips" },
                      { priority: "Medium", action: "Create tiered supporter benefits", impact: "+20% retention" },
                      { priority: "Medium", action: "Schedule streams at optimal times", impact: "+15% viewers" },
                      { priority: "Low", action: "Add custom emotes for supporters", impact: "+10% satisfaction" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"}>
                          {item.priority}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.action}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          {item.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready to maximize your streaming success?</h3>
              <p className="text-white/90">Apply these psychological insights to boost engagement and revenue</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg">
                Download Playbook
              </Button>
              <Button variant="default" size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                Start Streaming
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}