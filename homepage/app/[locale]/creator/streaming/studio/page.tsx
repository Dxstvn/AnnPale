"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Mic,
  Camera,
  Monitor,
  Settings,
  Users,
  DollarSign,
  Eye,
  Heart,
  MessageSquare,
  Gift,
  Zap,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  ScreenShare,
  ScreenShareOff,
  Copy,
  Share2,
  Bell,
  Shield,
  Sparkles,
  Crown,
  Star,
  TrendingUp,
  BarChart3,
  Clock,
  Calendar,
  ChevronRight,
  Upload,
  Image,
  Music,
  Gamepad2,
  BookOpen,
  Palette,
  Utensils,
  Mic2,
  Radio
} from "lucide-react"
import { cn } from "@/lib/utils"

// Translations
const studioTranslations: Record<string, Record<string, string>> = {
  streaming_studio: {
    en: "Streaming Studio",
    fr: "Studio de diffusion",
    ht: "Estidyo difizyon"
  },
  go_live_now: {
    en: "Go Live Now",
    fr: "Diffuser maintenant",
    ht: "Ale dir\u00e8k kounye a"
  },
  stream_setup: {
    en: "Stream Setup",
    fr: "Configuration du stream",
    ht: "Konfigirasyon emisyon"
  },
  audio_video: {
    en: "Audio/Video",
    fr: "Audio/Vid\u00e9o",
    ht: "Odyo/Videyo"
  },
  monetization: {
    en: "Monetization",
    fr: "Mon\u00e9tisation",
    ht: "Monetizasyon"
  },
  analytics: {
    en: "Analytics",
    fr: "Analytiques",
    ht: "Analitik"
  },
  stream_title: {
    en: "Stream Title",
    fr: "Titre du stream",
    ht: "Tit emisyon"
  },
  stream_description: {
    en: "Stream Description",
    fr: "Description du stream",
    ht: "Deskripsyon emisyon"
  },
  category: {
    en: "Category",
    fr: "Cat\u00e9gorie",
    ht: "Kategori"
  },
  tags: {
    en: "Tags",
    fr: "Tags",
    ht: "Tag"
  },
  language: {
    en: "Language",
    fr: "Langue",
    ht: "Lang"
  },
  schedule_stream: {
    en: "Schedule Stream",
    fr: "Planifier le stream",
    ht: "Pwograme emisyon"
  },
  premium_only: {
    en: "Premium Subscribers Only",
    fr: "Abonn\u00e9s Premium uniquement",
    ht: "Sèlman abòne Premium"
  },
  enable_chat: {
    en: "Enable Chat",
    fr: "Activer le chat",
    ht: "Aktive chat"
  },
  enable_donations: {
    en: "Enable Donations",
    fr: "Activer les dons",
    ht: "Aktive don"
  },
  enable_super_chat: {
    en: "Enable Super Chat",
    fr: "Activer Super Chat",
    ht: "Aktive Super Chat"
  },
  record_stream: {
    en: "Record Stream",
    fr: "Enregistrer le stream",
    ht: "Anrejistre emisyon"
  },
  viewers: {
    en: "Viewers",
    fr: "Spectateurs",
    ht: "Espektatè"
  },
  duration: {
    en: "Duration",
    fr: "Dur\u00e9e",
    ht: "Dire"
  },
  earnings: {
    en: "Earnings",
    fr: "Revenus",
    ht: "Revni"
  },
  engagement: {
    en: "Engagement",
    fr: "Engagement",
    ht: "Angajman"
  }
}

// Mock stream categories
const streamCategories = [
  { value: "music", label: "Music & Performance", icon: Music },
  { value: "cooking", label: "Cooking & Food", icon: Utensils },
  { value: "gaming", label: "Gaming", icon: Gamepad2 },
  { value: "education", label: "Education", icon: BookOpen },
  { value: "art", label: "Art & Creativity", icon: Palette },
  { value: "talk", label: "Talk Show", icon: Mic2 },
  { value: "podcast", label: "Podcast", icon: Radio }
]

export default function StreamingStudioPage() {
  const t = useTranslations()
  const [isLive, setIsLive] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")
  const [streamCategory, setStreamCategory] = useState("talk")
  const [streamTags, setStreamTags] = useState("")
  const [streamLanguage, setStreamLanguage] = useState("ht")
  const [isPremium, setIsPremium] = useState(false)
  const [chatEnabled, setChatEnabled] = useState(true)
  const [donationsEnabled, setDonationsEnabled] = useState(true)
  const [superChatEnabled, setSuperChatEnabled] = useState(true)
  const [recordEnabled, setRecordEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [screenShareEnabled, setScreenShareEnabled] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("connected")
  const [streamStats, setStreamStats] = useState({
    viewers: 0,
    peakViewers: 0,
    duration: 0,
    messages: 0,
    donations: 0,
    earnings: 0,
    newFollowers: 0,
    engagement: 0
  })

  const tCustom = (key: string) => {
    return studioTranslations[key]?.['en'] || studioTranslations[key]?.en || key
  }

  const handleGoLive = () => {
    if (!streamTitle) {
      alert("Please enter a stream title")
      return
    }
    setIsLive(true)
    // Simulate stream stats updates
    const interval = setInterval(() => {
      setStreamStats(prev => ({
        viewers: Math.max(0, prev.viewers + Math.floor(Math.random() * 10 - 3)),
        peakViewers: Math.max(prev.peakViewers, prev.viewers),
        duration: prev.duration + 1,
        messages: prev.messages + Math.floor(Math.random() * 3),
        donations: prev.donations + (Math.random() > 0.9 ? 1 : 0),
        earnings: prev.earnings + (Math.random() > 0.9 ? Math.floor(Math.random() * 50) : 0),
        newFollowers: prev.newFollowers + (Math.random() > 0.8 ? 1 : 0),
        engagement: Math.min(100, Math.floor(Math.random() * 100))
      }))
    }, 1000)
    return () => clearInterval(interval)
  }

  const handleEndStream = () => {
    setIsLive(false)
    // Reset stats
    setStreamStats({
      viewers: 0,
      peakViewers: 0,
      duration: 0,
      messages: 0,
      donations: 0,
      earnings: 0,
      newFollowers: 0,
      engagement: 0
    })
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCategoryIcon = (value: string) => {
    const category = streamCategories.find(c => c.value === value)
    return category ? <category.icon className="w-4 h-4" /> : null
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('streaming_studio')}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">Manage your live streams and connect with your audience</p>
          </div>
          <div className="flex items-center gap-3">
            {isLive ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">LIVE</span>
                  <span className="text-sm">{formatDuration(streamStats.duration)}</span>
                </div>
                <Button variant="destructive" onClick={handleEndStream}>
                  <Square className="w-4 h-4 mr-2" />
                  End Stream
                </Button>
              </>
            ) : (
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleGoLive}
                disabled={!streamTitle}
              >
                <Video className="w-4 h-4 mr-2" />
                {t('go_live_now')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <Alert className={cn(
        "mb-6",
        connectionStatus === "connected" ? "bg-green-50 border-green-200" :
        connectionStatus === "connecting" ? "bg-yellow-50 border-yellow-200" :
        "bg-red-50 border-red-200"
      )}>
        {connectionStatus === "connected" ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : connectionStatus === "connecting" ? (
          <Wifi className="h-4 w-4 text-yellow-600 animate-pulse" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-600" />
        )}
        <AlertTitle>
          {connectionStatus === "connected" ? "Connected" :
           connectionStatus === "connecting" ? "Connecting..." :
           "Disconnected"}
        </AlertTitle>
        <AlertDescription>
          {connectionStatus === "connected" ? "Your streaming connection is stable and ready" :
           connectionStatus === "connecting" ? "Establishing connection to streaming servers..." :
           "Check your internet connection and try again"}
        </AlertDescription>
      </Alert>

      {/* Live Stats Dashboard (shown when live) */}
      {isLive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('viewers')}</p>
                  <p className="text-2xl font-bold">{streamStats.viewers}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Peak: {streamStats.peakViewers}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Chat Messages</p>
                  <p className="text-2xl font-bold">{streamStats.messages}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{streamStats.donations} donations</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('earnings')}</p>
                  <p className="text-2xl font-bold">${streamStats.earnings}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">+{streamStats.newFollowers} followers</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('engagement')}</p>
                  <p className="text-2xl font-bold">{streamStats.engagement}%</p>
                  <Progress value={streamStats.engagement} className="mt-2 h-2" />
                </div>
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">{t('stream_setup')}</TabsTrigger>
          <TabsTrigger value="media">{t('audio_video')}</TabsTrigger>
          <TabsTrigger value="monetization">{t('monetization')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stream Information</CardTitle>
              <CardDescription>Configure your stream details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t('stream_title')}</Label>
                <Input
                  id="title"
                  placeholder="Enter an engaging title for your stream"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  disabled={isLive}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('stream_description')}</Label>
                <Textarea
                  id="description"
                  placeholder="Tell viewers what your stream is about"
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  rows={4}
                  disabled={isLive}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">{t('category')}</Label>
                  <Select value={streamCategory} onValueChange={setStreamCategory} disabled={isLive}>
                    <SelectTrigger id="category">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(streamCategory)}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {streamCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t('language')}</Label>
                  <Select value={streamLanguage} onValueChange={setStreamLanguage} disabled={isLive}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ht">Kreyòl Ayisyen</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">{t('tags')}</Label>
                <Input
                  id="tags"
                  placeholder="Add tags separated by commas (e.g., music, haiti, live)"
                  value={streamTags}
                  onChange={(e) => setStreamTags(e.target.value)}
                  disabled={isLive}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('premium_only')}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Restrict stream to premium subscribers</p>
                  </div>
                  <Switch checked={isPremium} onCheckedChange={setIsPremium} disabled={isLive} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('enable_chat')}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow viewers to chat during stream</p>
                  </div>
                  <Switch checked={chatEnabled} onCheckedChange={setChatEnabled} disabled={isLive} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('record_stream')}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Save stream for later viewing</p>
                  </div>
                  <Switch checked={recordEnabled} onCheckedChange={setRecordEnabled} disabled={isLive} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Camera</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable video feed</p>
                  </div>
                  <Switch checked={videoEnabled} onCheckedChange={setVideoEnabled} />
                </div>

                <div className="space-y-2">
                  <Label>Video Quality</Label>
                  <Select defaultValue="720p">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="360p">360p - Low</SelectItem>
                      <SelectItem value="480p">480p - Medium</SelectItem>
                      <SelectItem value="720p">720p - HD</SelectItem>
                      <SelectItem value="1080p">1080p - Full HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Screen Share</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share your screen</p>
                  </div>
                  <Switch checked={screenShareEnabled} onCheckedChange={setScreenShareEnabled} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Microphone</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable audio input</p>
                  </div>
                  <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
                </div>

                <div className="space-y-2">
                  <Label>Audio Source</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Microphone</SelectItem>
                      <SelectItem value="external">External Microphone</SelectItem>
                      <SelectItem value="system">System Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Audio Level</Label>
                  <Slider defaultValue={[75]} max={100} step={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('enable_donations')}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accept donations from viewers</p>
                  </div>
                  <Switch checked={donationsEnabled} onCheckedChange={setDonationsEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('enable_super_chat')}</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Highlighted paid messages</p>
                  </div>
                  <Switch checked={superChatEnabled} onCheckedChange={setSuperChatEnabled} />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Donation</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">$1</SelectItem>
                      <SelectItem value="5">$5</SelectItem>
                      <SelectItem value="10">$10</SelectItem>
                      <SelectItem value="25">$25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Basic Tier</span>
                    </div>
                    <Badge variant="secondary">$4.99/mo</Badge>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Premium Tier</span>
                    </div>
                    <Badge variant="secondary">$9.99/mo</Badge>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      <span className="font-medium">VIP Tier</span>
                    </div>
                    <Badge variant="secondary">$24.99/mo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Stream Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avg. Viewers</span>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Views</span>
                    <span className="font-medium">12.4K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Watch Time</span>
                    <span className="font-medium">485 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">This Month</span>
                    <span className="font-medium">$2,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Month</span>
                    <span className="font-medium">$1,890</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Growth</span>
                    <span className="font-medium text-green-600">+29.6%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Followers</span>
                    <span className="font-medium">8.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Subscribers</span>
                    <span className="font-medium">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Engagement</span>
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-9 bg-gray-100 rounded flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Live Kompa Music Session</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2 days ago • 2h 15m</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1,245 views</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">$145 earned</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-9 bg-gray-100 rounded flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">Q&A with Fans</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">5 days ago • 1h 30m</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">892 views</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">$89 earned</p>
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