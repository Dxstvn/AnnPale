"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Calendar,
  Package,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Users,
  Target,
  Percent,
  Gift,
  Star,
  Award,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Clock,
  RefreshCw,
  Eye,
  Brain,
  Sparkles,
  Shield,
  Flag,
  Hash,
  Filter,
  Database,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Calculator,
  Gauge,
  Timer,
  Trophy,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  Bell,
  Search,
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Link,
  Layers,
  Layout,
  Grid,
  List,
  Map,
  Globe,
  Compass,
  Navigation,
  MapPin,
  Landmark,
  Building,
  Home,
  Store,
  ShoppingCart,
  CreditCard,
  Wallet,
  Receipt,
  FileText,
  File,
  Folder,
  Archive,
  Box,
  Package2,
  Truck,
  Send,
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  Video,
  Mic,
  Headphones,
  Volume2,
  Wifi,
  Signal,
  Battery,
  Power,
  Cpu,
  Server,
  Cloud,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Droplet,
  Thermometer,
  Umbrella,
  Coffee,
  Pizza,
  Cake,
  Beer,
  Wine,
  Utensils,
  Heart,
  HeartOff,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Angry
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartssPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart
} from "recharts"

// Pricing model types
type PricingModel = "fixed" | "tiered" | "dynamic" | "seasonal" | "package"

interface PricingStrategy {
  model: PricingModel
  basePrice: number
  modifiers: PriceModifier[]
  discounts: Discount[]
  dynamicFactors: DynamicFactor[]
  abTests: ABTest[]
  competitiveData: CompetitiveData
  revenueOptimization: RevenueOptimization
}

interface PriceModifier {
  id: string
  name: string
  type: "percentage" | "fixed"
  value: number
  condition?: string
  active: boolean
}

interface Discount {
  id: string
  name: string
  type: "percentage" | "fixed"
  value: number
  condition: string
  active: boolean
  usageCount: number
}

interface DynamicFactor {
  id: string
  name: string
  impact: number
  trigger: string
  active: boolean
  frequency: number
}

interface ABTest {
  id: string
  name: string
  status: "running" | "completed" | "paused"
  variantA: number
  variantB: number
  conversionsA: number
  conversionsB: number
  significance: number
  startDate: Date
  endDate?: Date
}

interface CompetitiveData {
  averagePrice: number
  position: "below" | "at" | "above"
  percentile: number
  recommendations: string[]
}

interface RevenueOptimization {
  elasticity: number
  optimalPrice: number
  projectedRevenue: number
  confidence: number
}

interface DynamicPricingManagementProps {
  onStrategyChange?: (strategy: PricingStrategy) => void
  onTestCreate?: (test: ABTest) => void
  onPriceUpdate?: (price: number) => void
  enableABTesting?: boolean
  enableCompetitiveIntel?: boolean
  enableRevenuMax?: boolean
  className?: string
}

// Mock data generators
const generatePriceHistory = () => {
  const data = []
  const basePrice = 149
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const variation = Math.sin(i / 5) * 20 + Math.random() * 10
    data.push({
      date: date.toISOString().split('T')[0],
      price: basePrice + variation,
      revenue: (basePrice + variation) * (20 + Math.random() * 10),
      conversions: Math.floor(20 + Math.random() * 10)
    })
  }
  return data
}

const generateElasticityData = () => {
  const data = []
  for (let price = 50; price <= 300; price += 10) {
    const demand = Math.max(0, 100 - (price - 150) * 0.5 + Math.random() * 10)
    const revenue = price * demand
    data.push({ price, demand, revenue })
  }
  return data
}

const generateCompetitorData = () => [
  { name: "You", price: 149, rating: 4.8, bookings: 234 },
  { name: "Competitor A", price: 129, rating: 4.5, bookings: 189 },
  { name: "Competitor B", price: 179, rating: 4.9, bookings: 156 },
  { name: "Competitor C", price: 99, rating: 4.2, bookings: 312 },
  { name: "Market Avg", price: 139, rating: 4.5, bookings: 223 }
]

const generateSeasonalData = () => [
  { month: "Jan", multiplier: 0.8, events: ["New Year"] },
  { month: "Feb", multiplier: 1.2, events: ["Valentine's"] },
  { month: "Mar", multiplier: 0.9, events: [] },
  { month: "Apr", multiplier: 0.95, events: ["Easter"] },
  { month: "May", multiplier: 1.1, events: ["Mother's Day"] },
  { month: "Jun", multiplier: 1.0, events: ["Father's Day"] },
  { month: "Jul", multiplier: 0.85, events: ["Independence"] },
  { month: "Aug", multiplier: 0.8, events: [] },
  { month: "Sep", multiplier: 0.9, events: ["Back to School"] },
  { month: "Oct", multiplier: 1.0, events: ["Halloween"] },
  { month: "Nov", multiplier: 1.15, events: ["Thanksgiving"] },
  { month: "Dec", multiplier: 1.4, events: ["Christmas", "New Year"] }
]

// Pricing model configurations
const pricingModels = {
  fixed: {
    name: "Fixed Pricing",
    icon: Lock,
    description: "Simple, predictable pricing",
    complexity: "Low",
    revenueImpact: "Baseline",
    color: "bg-blue-500"
  },
  tiered: {
    name: "Tiered Pricing",
    icon: Layers,
    description: "Service levels with different prices",
    complexity: "Medium",
    revenueImpact: "+20-30%",
    color: "bg-green-500"
  },
  dynamic: {
    name: "Dynamic Pricing",
    icon: Activity,
    description: "Demand-based pricing",
    complexity: "High",
    revenueImpact: "+30-50%",
    color: "bg-purple-500"
  },
  seasonal: {
    name: "Seasonal Pricing",
    icon: Calendar,
    description: "Holiday and event-based pricing",
    complexity: "Medium",
    revenueImpact: "+25-40%",
    color: "bg-orange-500"
  },
  package: {
    name: "Package Pricing",
    icon: Package,
    description: "Bundle deals and packages",
    complexity: "Medium",
    revenueImpact: "+35% AOV",
    color: "bg-pink-500"
  }
}

export function DynamicPricingManagement({
  onStrategyChange,
  onTestCreate,
  onPriceUpdate,
  enableABTesting = true,
  enableCompetitiveIntel = true,
  enableRevenuMax = true,
  className
}: DynamicPricingManagementProps) {
  const [selectedModel, setSelectedModel] = React.useState<PricingModel>("dynamic")
  const [basePrice, setBasePrice] = React.useState(149)
  const [activeTab, setActiveTab] = React.useState("strategy")
  const [modifiers, setModifiers] = React.useState<PriceModifier[]>([
    { id: "1", name: "Rush delivery", type: "percentage", value: 50, active: true },
    { id: "2", name: "Extended length", type: "fixed", value: 25, condition: "per minute", active: true },
    { id: "3", name: "Multiple takes", type: "fixed", value: 30, active: false },
    { id: "4", name: "Commercial use", type: "percentage", value: 100, active: true }
  ])
  const [discounts, setDiscounts] = React.useState<Discount[]>([
    { id: "1", name: "Bulk booking", type: "percentage", value: 10, condition: "5+ videos", active: true, usageCount: 45 },
    { id: "2", name: "Repeat customer", type: "percentage", value: 15, condition: "2nd+ order", active: true, usageCount: 123 },
    { id: "3", name: "Promotional", type: "percentage", value: 20, condition: "Code: SAVE20", active: false, usageCount: 0 },
    { id: "4", name: "Referral", type: "percentage", value: 10, condition: "Valid referral", active: true, usageCount: 67 }
  ])
  const [dynamicFactors, setDynamicFactors] = React.useState<DynamicFactor[]>([
    { id: "1", name: "High demand", impact: 25, trigger: ">80% booked", active: true, frequency: 12 },
    { id: "2", name: "Low availability", impact: 30, trigger: "<3 slots", active: true, frequency: 8 },
    { id: "3", name: "Special occasion", impact: 20, trigger: "Holiday week", active: true, frequency: 15 },
    { id: "4", name: "Off-peak", impact: -15, trigger: "Low demand hours", active: false, frequency: 0 }
  ])

  // Data for visualizations
  const priceHistory = React.useMemo(() => generatePriceHistory(), [])
  const elasticityData = React.useMemo(() => generateElasticityData(), [])
  const competitorData = React.useMemo(() => generateCompetitorData(), [])
  const seasonalData = React.useMemo(() => generateSeasonalData(), [])

  // Calculate current effective price
  const calculateEffectivePrice = () => {
    let price = basePrice
    
    // Apply active modifiers
    modifiers.filter(m => m.active).forEach(modifier => {
      if (modifier.type === "percentage") {
        price += basePrice * (modifier.value / 100)
      } else {
        price += modifier.value
      }
    })
    
    // Apply dynamic factors
    dynamicFactors.filter(f => f.active).forEach(factor => {
      price += basePrice * (factor.impact / 100)
    })
    
    return Math.round(price)
  }

  const effectivePrice = calculateEffectivePrice()

  // Toggle modifier
  const toggleModifier = (id: string) => {
    setModifiers(prev => prev.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    ))
  }

  // Toggle discount
  const toggleDiscount = (id: string) => {
    setDiscounts(prev => prev.map(d => 
      d.id === id ? { ...d, active: !d.active } : d
    ))
  }

  // Toggle dynamic factor
  const toggleDynamicFactor = (id: string) => {
    setDynamicFactors(prev => prev.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ))
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Dynamic Pricing Management
          </CardTitle>
          <CardDescription>
            Optimize your pricing strategy with data-driven tools and flexible models
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pricing Models Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(pricingModels).map(([key, model]) => {
              const Icon = model.icon
              const isSelected = selectedModel === key
              
              return (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedModel(key as PricingModel)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mx-auto mb-2", model.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-medium text-sm">{model.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{model.complexity}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {model.revenueImpact}
                  </Badge>
                </motion.button>
              )
            })}
          </div>

          {/* Current Price Display */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Base Price</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${basePrice}</span>
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-24 h-8"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Effective Price</p>
                <p className="text-3xl font-bold text-purple-600">${effectivePrice}</p>
                {effectivePrice !== basePrice && (
                  <p className="text-sm text-gray-500">
                    {effectivePrice > basePrice ? "+" : ""}{((effectivePrice - basePrice) / basePrice * 100).toFixed(0)}% adjustment
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Strategy Tab */}
        <TabsContent value="strategy" className="space-y-6">
          {/* Price Modifiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Price Modifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {modifiers.map((modifier) => (
                <div key={modifier.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={modifier.active}
                      onCheckedChange={() => toggleModifier(modifier.id)}
                    />
                    <div>
                      <p className="font-medium">{modifier.name}</p>
                      {modifier.condition && (
                        <p className="text-sm text-gray-500">{modifier.condition}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={modifier.active ? "default" : "secondary"}>
                    {modifier.type === "percentage" ? "+" : "$"}{modifier.value}{modifier.type === "percentage" ? "%" : ""}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Discounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Discount Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {discounts.map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={discount.active}
                      onCheckedChange={() => toggleDiscount(discount.id)}
                    />
                    <div>
                      <p className="font-medium">{discount.name}</p>
                      <p className="text-sm text-gray-500">{discount.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{discount.usageCount} uses</span>
                    <Badge variant={discount.active ? "destructive" : "secondary"}>
                      -{discount.value}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dynamic Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Dynamic Pricing Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dynamicFactors.map((factor) => (
                <div key={factor.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={factor.active}
                      onCheckedChange={() => toggleDynamicFactor(factor.id)}
                    />
                    <div>
                      <p className="font-medium">{factor.name}</p>
                      <p className="text-sm text-gray-500">Triggers when: {factor.trigger}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{factor.frequency}x/month</span>
                    <Badge 
                      variant={factor.active ? (factor.impact > 0 ? "default" : "secondary") : "outline"}
                    >
                      {factor.impact > 0 ? "+" : ""}{factor.impact}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          {/* Revenue Maximization */}
          {enableRevenuMax && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Revenue Maximization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Elasticity Curve */}
                  <div>
                    <h4 className="font-medium mb-3">Price Elasticity Analysis</h4>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={elasticityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="price" />
                          <YAxis yAxisId="left" orientation="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <RechartsTooltip />
                          <Area yAxisId="left" type="monotone" dataKey="demand" fill="#8B5CF6" fillOpacity={0.3} stroke="#8B5CF6" name="Demand" />
                          <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Optimization Recommendations */}
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Optimal Price Point:</strong> Based on elasticity analysis, your optimal price is <strong>$178</strong> 
                      (projected +23% revenue increase)
                    </AlertDescription>
                  </Alert>

                  {/* Bundle Recommendations */}
                  <div>
                    <h4 className="font-medium mb-3">Bundle Opportunities</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      <Card className="border-green-200">
                        <CardContent className="p-4">
                          <h5 className="font-medium text-sm">Starter Pack</h5>
                          <p className="text-2xl font-bold mt-2">$399</p>
                          <p className="text-sm text-gray-500">3 videos bundle</p>
                          <Badge className="mt-2 bg-green-100 text-green-700">Save 11%</Badge>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200">
                        <CardContent className="p-4">
                          <h5 className="font-medium text-sm">Pro Package</h5>
                          <p className="text-2xl font-bold mt-2">$649</p>
                          <p className="text-sm text-gray-500">5 videos + rush</p>
                          <Badge className="mt-2 bg-blue-100 text-blue-700">Save 15%</Badge>
                        </CardContent>
                      </Card>
                      <Card className="border-purple-200">
                        <CardContent className="p-4">
                          <h5 className="font-medium text-sm">Enterprise</h5>
                          <p className="text-2xl font-bold mt-2">$1,299</p>
                          <p className="text-sm text-gray-500">10 videos + perks</p>
                          <Badge className="mt-2 bg-purple-100 text-purple-700">Save 20%</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Competitive Intelligence */}
          {enableCompetitiveIntel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Competitive Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Market Position */}
                  <div>
                    <h4 className="font-medium mb-3">Market Position</h4>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="price" name="Price" unit="$" />
                          <YAxis dataKey="rating" name="Rating" />
                          <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Scatter name="Competitors" data={competitorData} fill="#8884d8">
                            {competitorData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.name === "You" ? "#10B981" : "#8B5CF6"} />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Position Analysis */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Your Position</p>
                        <p className="text-2xl font-bold">60th percentile</p>
                        <Progress value={60} className="mt-2" />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">vs Market Avg</p>
                        <p className="text-2xl font-bold text-green-600">+7.2%</p>
                        <p className="text-xs text-gray-500 mt-1">Above average</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Price Gap</p>
                        <p className="text-2xl font-bold">$20-30</p>
                        <p className="text-xs text-gray-500 mt-1">Opportunity range</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommendations */}
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendations:</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Consider premium positioning (+$20-30) given your 4.8 rating</li>
                        <li>• Implement value-adds to justify higher pricing</li>
                        <li>• Test rush delivery premium pricing (competitors charge +75%)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seasonal Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Seasonal Price Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="multiplier" fill="#F97316" name="Price Multiplier">
                      {seasonalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.multiplier > 1 ? "#10B981" : "#EF4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {seasonalData.filter(s => s.events.length > 0).slice(0, 4).map((season) => (
                  <div key={season.month} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium text-sm">{season.month}</p>
                    <p className="text-xs text-gray-500">{season.events.join(", ")}</p>
                    <Badge variant={season.multiplier > 1 ? "default" : "secondary"} className="mt-2">
                      {(season.multiplier * 100 - 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          {enableABTesting && (
            <>
              {/* Active Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Active Price Experiments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Test 1 */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Rush Delivery Premium Test</h4>
                          <p className="text-sm text-gray-500">Testing +50% vs +75% premium</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Running</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Variant A: +50%</span>
                            <Badge variant="outline">Control</Badge>
                          </div>
                          <Progress value={45} className="mb-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>234 conversions</span>
                            <span>45% traffic</span>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Variant B: +75%</span>
                            <Badge className="bg-blue-100 text-blue-700">Testing</Badge>
                          </div>
                          <Progress value={55} className="mb-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>189 conversions</span>
                            <span>55% traffic</span>
                          </div>
                        </div>
                      </div>
                      <Alert className="mt-3 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Statistical Significance:</strong> 87% (need 95% for conclusive results)
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Test 2 */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Bundle Pricing Test</h4>
                          <p className="text-sm text-gray-500">3-pack: $399 vs $449</p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-700">Completed</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">$399</span>
                            <Badge variant="outline">Winner</Badge>
                          </div>
                          <Progress value={100} className="mb-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>456 conversions</span>
                            <span>+23% revenue</span>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">$449</span>
                            <Badge variant="secondary">Loser</Badge>
                          </div>
                          <Progress value={78} className="mb-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>312 conversions</span>
                            <span>-12% revenue</span>
                          </div>
                        </div>
                      </div>
                      <Alert className="mt-3 border-green-200 bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Result:</strong> $399 price point generated 23% more revenue with 99.2% confidence
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Create New Test */}
                    <Button className="w-full" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Price Experiment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Test Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Historical Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Base price: $129 vs $149", winner: "$149", impact: "+18%", confidence: "98.5%" },
                      { name: "Weekend premium: 10% vs 20%", winner: "10%", impact: "+8%", confidence: "95.3%" },
                      { name: "Bulk discount: 10% vs 15%", winner: "10%", impact: "+12%", confidence: "97.1%" },
                      { name: "Rush: Fixed $50 vs 50%", winner: "50%", impact: "+15%", confidence: "96.8%" }
                    ].map((test, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{test.name}</p>
                          <p className="text-xs text-gray-500">Winner: {test.winner}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{test.confidence}</Badge>
                          <Badge className="bg-green-100 text-green-700">{test.impact}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Price Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Price Performance Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Area yAxisId="right" type="monotone" dataKey="revenue" fill="#10B981" fillOpacity={0.3} stroke="#10B981" name="Revenue" />
                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={3} name="Price" />
                    <Bar yAxisId="right" dataKey="conversions" fill="#F97316" fillOpacity={0.5} name="Conversions" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-2xl font-bold">$187</p>
                    <p className="text-xs text-green-600 mt-1">+12% this month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">3.4%</p>
                    <p className="text-xs text-blue-600 mt-1">+0.3% this week</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Price Elasticity</p>
                    <p className="text-2xl font-bold">-1.2</p>
                    <p className="text-xs text-gray-500 mt-1">Moderate sensitivity</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue/Day</p>
                    <p className="text-2xl font-bold">$2,431</p>
                    <p className="text-xs text-green-600 mt-1">+18% optimized</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Order Price Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { range: "$0-99", count: 12 },
                    { range: "$100-149", count: 45 },
                    { range: "$150-199", count: 78 },
                    { range: "$200-249", count: 56 },
                    { range: "$250-299", count: 34 },
                    { range: "$300+", count: 23 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}