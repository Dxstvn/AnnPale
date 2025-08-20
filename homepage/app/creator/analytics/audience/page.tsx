"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from "recharts"
import { 
  Users, 
  Globe, 
  Heart, 
  Clock,
  MapPin,
  Calendar,
  Download,
  FileText,
  TrendingUp,
  UserCheck,
  UserPlus,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  Info,
  Filter
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// Mock data for audience analytics
const audienceData = {
  demographics: {
    ageGroups: [
      { age: "18-24", percentage: 15, count: 375 },
      { age: "25-34", percentage: 35, count: 875 },
      { age: "35-44", percentage: 28, count: 700 },
      { age: "45-54", percentage: 15, count: 375 },
      { age: "55+", percentage: 7, count: 175 },
    ],
    gender: [
      { type: "Female", value: 58, count: 1450 },
      { type: "Male", value: 40, count: 1000 },
      { type: "Other", value: 2, count: 50 },
    ],
    languages: [
      { language: "English", percentage: 45, count: 1125 },
      { language: "French", percentage: 30, count: 750 },
      { language: "Haitian Creole", percentage: 25, count: 625 },
    ]
  },
  geographic: {
    topCountries: [
      { country: "United States", users: 1200, percentage: 48 },
      { country: "Haiti", users: 500, percentage: 20 },
      { country: "Canada", users: 300, percentage: 12 },
      { country: "France", users: 250, percentage: 10 },
      { country: "Dominican Republic", users: 150, percentage: 6 },
      { country: "Other", users: 100, percentage: 4 },
    ],
    topCities: [
      { city: "New York", country: "US", users: 350 },
      { city: "Miami", country: "US", users: 280 },
      { city: "Port-au-Prince", country: "HT", users: 200 },
      { city: "Montreal", country: "CA", users: 150 },
      { city: "Boston", country: "US", users: 120 },
    ]
  },
  engagement: {
    activeUsers: {
      daily: 450,
      weekly: 1200,
      monthly: 2100
    },
    retention: [
      { day: "Day 1", rate: 100 },
      { day: "Day 7", rate: 65 },
      { day: "Day 14", rate: 45 },
      { day: "Day 30", rate: 35 },
      { day: "Day 60", rate: 28 },
      { day: "Day 90", rate: 25 },
    ],
    sessionMetrics: {
      avgDuration: "5:32",
      pagePerSession: 4.2,
      bounceRate: 32
    }
  },
  behavior: {
    deviceTypes: [
      { device: "Mobile", percentage: 65, sessions: 1625 },
      { device: "Desktop", percentage: 28, sessions: 700 },
      { device: "Tablet", percentage: 7, sessions: 175 },
    ],
    topInterests: [
      { interest: "Birthday Messages", score: 85 },
      { interest: "Anniversary", score: 72 },
      { interest: "Graduation", score: 68 },
      { interest: "Holiday Greetings", score: 60 },
      { interest: "Custom Messages", score: 55 },
    ],
    peakHours: [
      { hour: "8 AM", views: 120 },
      { hour: "12 PM", views: 280 },
      { hour: "5 PM", views: 350 },
      { hour: "8 PM", views: 420 },
      { hour: "10 PM", views: 180 },
    ]
  },
  growth: {
    monthlyGrowth: [
      { month: "Jan", users: 1800, growth: 5 },
      { month: "Feb", users: 1950, growth: 8 },
      { month: "Mar", users: 2100, growth: 8 },
      { month: "Apr", users: 2250, growth: 7 },
      { month: "May", users: 2400, growth: 7 },
      { month: "Jun", users: 2500, growth: 4 },
    ]
  }
}

// Translations
const audienceTranslations: Record<string, Record<string, string>> = {
  audience_insights: {
    en: "Audience Insights",
    fr: "Informations sur l'audience",
    ht: "Enfòmasyon sou odyans"
  },
  understand_audience: {
    en: "Understand your audience demographics and behavior",
    fr: "Comprendre les données démographiques et le comportement de votre audience",
    ht: "Konprann demografik ak konpòtman odyans ou"
  },
  total_followers: {
    en: "Total Followers",
    fr: "Total des abonnés",
    ht: "Total abòne"
  },
  active_users: {
    en: "Active Users",
    fr: "Utilisateurs actifs",
    ht: "Itilizatè aktif"
  },
  engagement_rate: {
    en: "Engagement Rate",
    fr: "Taux d'engagement",
    ht: "To angajman"
  },
  avg_session_duration: {
    en: "Avg Session Duration",
    fr: "Durée moyenne de session",
    ht: "Dire mwayèn sesyon"
  },
  demographics: {
    en: "Demographics",
    fr: "Démographie",
    ht: "Demografik"
  },
  geographic: {
    en: "Geographic",
    fr: "Géographique",
    ht: "Jewografik"
  },
  behavior: {
    en: "Behavior",
    fr: "Comportement",
    ht: "Konpòtman"
  },
  engagement: {
    en: "Engagement",
    fr: "Engagement",
    ht: "Angajman"
  },
  age_distribution: {
    en: "Age Distribution",
    fr: "Répartition par âge",
    ht: "Distribisyon laj"
  },
  gender_split: {
    en: "Gender Split",
    fr: "Répartition par genre",
    ht: "Separasyon sèks"
  },
  top_countries: {
    en: "Top Countries",
    fr: "Principaux pays",
    ht: "Pi gwo peyi"
  },
  device_usage: {
    en: "Device Usage",
    fr: "Utilisation des appareils",
    ht: "Itilizasyon aparèy"
  },
  peak_activity: {
    en: "Peak Activity Hours",
    fr: "Heures de pointe",
    ht: "Lè pi aktif"
  },
  retention_rate: {
    en: "Retention Rate",
    fr: "Taux de rétention",
    ht: "To retansyon"
  },
  export_report: {
    en: "Export Report",
    fr: "Exporter le rapport",
    ht: "Ekspòte rapò"
  }
}

// Chart colors
const COLORS = ['#9333EA', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444']

export default function AudienceAnalyticsPage() {
  const { language } = useLanguage()
  const [dateRange, setDateRange] = useState("last_30_days")
  const [activeTab, setActiveTab] = useState("demographics")
  
  const t = (key: string) => {
    return audienceTranslations[key]?.[language] || audienceTranslations[key]?.en || key
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting audience data as ${format}`)
  }
  
  // Calculate total followers
  const totalFollowers = 2500
  const followerGrowth = 4.2
  const engagementRate = 6.8
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('audience_insights')}</h1>
            <p className="text-gray-600 mt-1">{t('understand_audience')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('export_report')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('total_followers')}</p>
              <p className="text-2xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">+{followerGrowth}%</span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('active_users')}</p>
              <p className="text-2xl font-bold text-gray-900">{audienceData.engagement.activeUsers.monthly}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center">
                  <Activity className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-xs text-gray-500">Daily: {audienceData.engagement.activeUsers.daily}</span>
                </div>
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('engagement_rate')}</p>
              <p className="text-2xl font-bold text-gray-900">{engagementRate}%</p>
              <div className="flex items-center mt-2">
                <Heart className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-gray-500">Above average</span>
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{t('avg_session_duration')}</p>
              <p className="text-2xl font-bold text-gray-900">{audienceData.engagement.sessionMetrics.avgDuration}</p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-sm text-gray-500">{audienceData.engagement.sessionMetrics.pagePerSession} pages/session</span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="demographics">{t('demographics')}</TabsTrigger>
          <TabsTrigger value="geographic">{t('geographic')}</TabsTrigger>
          <TabsTrigger value="behavior">{t('behavior')}</TabsTrigger>
          <TabsTrigger value="engagement">{t('engagement')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t('age_distribution')}</CardTitle>
                <CardDescription>Breakdown of your audience by age group</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={audienceData.demographics.ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="age" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="percentage" fill="#9333EA" radius={[8, 8, 0, 0]}>
                      {audienceData.demographics.ageGroups.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {audienceData.demographics.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full")} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{group.age}</span>
                      </div>
                      <span className="text-gray-600">{group.count} users ({group.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Gender Split */}
            <Card>
              <CardHeader>
                <CardTitle>{t('gender_split')}</CardTitle>
                <CardDescription>Gender distribution of your audience</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={audienceData.demographics.gender}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {audienceData.demographics.gender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {audienceData.demographics.gender.map((gender, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full")} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="font-medium">{gender.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{gender.value}%</span>
                        <span className="text-sm text-gray-500 ml-2">({gender.count} users)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Language Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Language Preferences</CardTitle>
              <CardDescription>Primary languages of your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audienceData.demographics.languages.map((lang, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{lang.language}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{lang.percentage}%</span>
                        <span className="text-sm text-gray-500 ml-2">({lang.count} users)</span>
                      </div>
                    </div>
                    <Progress value={lang.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="geographic" className="space-y-6">
          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle>{t('top_countries')}</CardTitle>
              <CardDescription>Geographic distribution of your audience</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={audienceData.geographic.topCountries} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis dataKey="country" type="category" stroke="#6B7280" fontSize={12} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="users" fill="#9333EA" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Top Cities */}
          <Card>
            <CardHeader>
              <CardTitle>Top Cities</CardTitle>
              <CardDescription>Cities with the most active users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {audienceData.geographic.topCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                        index === 0 ? "bg-gradient-to-r from-purple-600 to-pink-600" :
                        index === 1 ? "bg-gray-400" :
                        index === 2 ? "bg-orange-400" : "bg-gray-300"
                      )}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{city.city}</p>
                        <p className="text-sm text-gray-500">{city.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{city.users}</p>
                      <p className="text-sm text-gray-500">users</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle>{t('device_usage')}</CardTitle>
                <CardDescription>Devices used to access your content</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={audienceData.behavior.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percentage }) => `${device}: ${percentage}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {audienceData.behavior.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {audienceData.behavior.deviceTypes.map((device, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {device.device === "Mobile" && <Smartphone className="h-4 w-4" />}
                      {device.device === "Desktop" && <Monitor className="h-4 w-4" />}
                      {device.device === "Tablet" && <Tablet className="h-4 w-4" />}
                      <span className="text-sm">{device.device}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Peak Activity Hours */}
            <Card>
              <CardHeader>
                <CardTitle>{t('peak_activity')}</CardTitle>
                <CardDescription>When your audience is most active</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={audienceData.behavior.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#9333EA" 
                      strokeWidth={2}
                      dot={{ fill: '#9333EA', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Top Interests</CardTitle>
              <CardDescription>Content categories your audience engages with most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audienceData.behavior.topInterests.map((interest, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{interest.interest}</span>
                      <span className="text-sm text-gray-600">{interest.score}% engagement</span>
                    </div>
                    <Progress value={interest.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          {/* Retention Curve */}
          <Card>
            <CardHeader>
              <CardTitle>{t('retention_rate')}</CardTitle>
              <CardDescription>User retention over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={audienceData.engagement.retention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#EC4899" 
                    strokeWidth={2}
                    dot={{ fill: '#EC4899', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user growth trend</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={audienceData.growth.monthlyGrowth}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorGrowth)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}