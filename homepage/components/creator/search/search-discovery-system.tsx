"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Filter,
  Eye,
  Mic,
  Calendar,
  Brain,
  Clock,
  User,
  Gift,
  Star,
  FileText,
  Download,
  Share2,
  Bell,
  Save,
  Folder,
  TrendingUp,
  Image,
  Volume2,
  Database,
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  History,
  Bookmark,
  Hash,
  Tag,
  Zap,
  Grid,
  List,
  Settings,
  RefreshCw,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Target,
  Users,
  Heart,
  ThumbsUp,
  MessageSquare,
  Video,
  Camera,
  Play,
  Pause,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Layers,
  Map,
  Navigation,
  Globe,
  Link,
  Code,
  Terminal,
  Cpu,
  Server,
  Cloud,
  Wifi,
  Battery,
  Moon,
  Sun
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, subDays, startOfDay, endOfDay } from "date-fns"

// Types
interface SearchResult {
  id: string
  type: "video" | "customer" | "occasion" | "tag" | "note"
  title: string
  description?: string
  thumbnail?: string
  date: Date
  relevance: number
  metadata: Record<string, any>
}

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilters
  created: Date
  lastUsed: Date
  useCount: number
  shared: boolean
  alerts: boolean
}

interface SearchFilters {
  dateRange?: { start: Date; end: Date }
  customer?: string[]
  occasion?: string[]
  status?: string[]
  quality?: number
  custom?: Record<string, any>
}

interface SearchDiscoverySystemProps {
  onSearch?: (query: string, filters: SearchFilters, type: string) => void
  onSaveSearch?: (search: SavedSearch) => void
  onExportResults?: (results: SearchResult[]) => void
  enableVisualSearch?: boolean
  enableAudioSearch?: boolean
  enableSmartSuggestions?: boolean
}

// Mock data
const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "video",
    title: "Birthday Message for John",
    description: "Personalized birthday greeting",
    thumbnail: "🎂",
    date: new Date("2024-01-15"),
    relevance: 95,
    metadata: { customer: "John Smith", occasion: "Birthday", duration: "2:30", rating: 5 }
  },
  {
    id: "2",
    type: "video",
    title: "Anniversary Celebration",
    description: "25th anniversary message",
    thumbnail: "💑",
    date: new Date("2024-01-10"),
    relevance: 88,
    metadata: { customer: "Sarah & Mike", occasion: "Anniversary", duration: "3:15", rating: 4.8 }
  },
  {
    id: "3",
    type: "video",
    title: "Graduation Congratulations",
    description: "MBA graduation message",
    thumbnail: "🎓",
    date: new Date("2024-01-05"),
    relevance: 82,
    metadata: { customer: "Emily Chen", occasion: "Graduation", duration: "2:00", rating: 4.9 }
  }
]

const mockSavedSearches: SavedSearch[] = [
  {
    id: "1",
    name: "High-value birthdays",
    query: "birthday",
    filters: { quality: 4.5, occasion: ["Birthday"] },
    created: new Date("2024-01-01"),
    lastUsed: new Date("2024-01-15"),
    useCount: 23,
    shared: true,
    alerts: true
  },
  {
    id: "2",
    name: "Recent anniversaries",
    query: "anniversary",
    filters: { dateRange: { start: subDays(new Date(), 30), end: new Date() }, occasion: ["Anniversary"] },
    created: new Date("2024-01-05"),
    lastUsed: new Date("2024-01-14"),
    useCount: 15,
    shared: false,
    alerts: false
  }
]

const searchTypes = [
  { id: "text", label: "Text", icon: FileText, description: "Title, tags, notes" },
  { id: "visual", label: "Visual", icon: Image, description: "Similar videos" },
  { id: "audio", label: "Audio", icon: Volume2, description: "Spoken words" },
  { id: "metadata", label: "Metadata", icon: Database, description: "Date ranges" },
  { id: "smart", label: "Smart", icon: Brain, description: "Natural language" }
]

const occasions = [
  "Birthday", "Anniversary", "Graduation", "Wedding", "Baby Shower",
  "Retirement", "Holiday", "Congratulations", "Get Well", "Thank You"
]

const statuses = ["Draft", "Ready", "Delivered", "Archived"]

export function SearchDiscoverySystem({
  onSearch,
  onSaveSearch,
  onExportResults,
  enableVisualSearch = true,
  enableAudioSearch = true,
  enableSmartSuggestions = true
}: SearchDiscoverySystemProps) {
  const [activeTab, setActiveTab] = React.useState("search")
  const [searchType, setSearchType] = React.useState("text")
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>(mockSavedSearches)
  const [filters, setFilters] = React.useState<SearchFilters>({})
  const [showFilters, setShowFilters] = React.useState(false)
  const [searching, setSearching] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  
  // Filter states
  const [dateRangePreset, setDateRangePreset] = React.useState("all")
  const [selectedOccasions, setSelectedOccasions] = React.useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([])
  const [qualityThreshold, setQualityThreshold] = React.useState([4.0])
  const [customerSearch, setCustomerSearch] = React.useState("")

  // Handle search
  const handleSearch = React.useCallback(() => {
    setSearching(true)
    
    // Build filters
    const searchFilters: SearchFilters = {
      occasion: selectedOccasions.length > 0 ? selectedOccasions : undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      quality: qualityThreshold[0],
      customer: customerSearch ? [customerSearch] : undefined
    }
    
    // Apply date range
    if (dateRangePreset !== "all") {
      const days = parseInt(dateRangePreset)
      searchFilters.dateRange = {
        start: startOfDay(subDays(new Date(), days)),
        end: endOfDay(new Date())
      }
    }
    
    setFilters(searchFilters)
    
    // Simulate search
    setTimeout(() => {
      setResults(mockResults)
      setSearching(false)
      onSearch?.(query, searchFilters, searchType)
    }, 1000)
  }, [query, searchType, selectedOccasions, selectedStatuses, qualityThreshold, customerSearch, dateRangePreset, onSearch])

  // Save search
  const handleSaveSearch = () => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: query || "Untitled Search",
      query,
      filters,
      created: new Date(),
      lastUsed: new Date(),
      useCount: 0,
      shared: false,
      alerts: false
    }
    
    setSavedSearches([newSearch, ...savedSearches])
    onSaveSearch?.(newSearch)
  }

  // Load saved search
  const handleLoadSearch = (search: SavedSearch) => {
    setQuery(search.query)
    setFilters(search.filters)
    
    // Update UI from filters
    if (search.filters.occasion) setSelectedOccasions(search.filters.occasion)
    if (search.filters.status) setSelectedStatuses(search.filters.status)
    if (search.filters.quality) setQualityThreshold([search.filters.quality])
    
    // Update use count
    const updated = savedSearches.map(s => 
      s.id === search.id 
        ? { ...s, useCount: s.useCount + 1, lastUsed: new Date() }
        : s
    )
    setSavedSearches(updated)
    
    // Execute search
    handleSearch()
  }

  // Smart suggestions
  const suggestions = React.useMemo(() => {
    if (!enableSmartSuggestions || !query) return []
    
    return [
      { type: "related", text: "Similar to recent searches", icon: <Clock className="h-4 w-4" /> },
      { type: "trending", text: "Trending: Birthday messages", icon: <TrendingUp className="h-4 w-4" /> },
      { type: "customer", text: "Same customer videos", icon: <User className="h-4 w-4" /> },
      { type: "style", text: "Similar style videos", icon: <Sparkles className="h-4 w-4" /> }
    ]
  }, [query, enableSmartSuggestions])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Discovery
            </CardTitle>
            <CardDescription>
              Multi-type search with advanced filtering and discovery
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4">
            {/* Search Type Selection */}
            <div className="flex flex-wrap gap-2">
              {searchTypes.map((type) => {
                const Icon = type.icon
                const disabled = 
                  (type.id === "visual" && !enableVisualSearch) ||
                  (type.id === "audio" && !enableAudioSearch)
                
                return (
                  <Button
                    key={type.id}
                    variant={searchType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType(type.id)}
                    disabled={disabled}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </Button>
                )
              })}
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={
                      searchType === "text" ? "Search titles, tags, notes..." :
                      searchType === "visual" ? "Upload or select a video..." :
                      searchType === "audio" ? "Enter spoken words..." :
                      searchType === "metadata" ? "Enter date range or metadata..." :
                      "Ask anything in natural language..."
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                  {query && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button onClick={handleSearch} disabled={searching}>
                  {searching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Type Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>
                  {searchType === "text" && "Instant search across titles, tags, and notes"}
                  {searchType === "visual" && "Find similar videos by visual content (2-3 sec)"}
                  {searchType === "audio" && "Search spoken words in transcriptions (1-2 sec)"}
                  {searchType === "metadata" && "Perfect accuracy with instant metadata search"}
                  {searchType === "smart" && "Natural language understanding (1 sec)"}
                </span>
              </div>
            </div>

            {/* Quick Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 border-t pt-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Date Range */}
                    <div>
                      <Label>Date Range</Label>
                      <RadioGroup value={dateRangePreset} onValueChange={setDateRangePreset}>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all">All time</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="7" id="week" />
                            <Label htmlFor="week">Last 7 days</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="30" id="month" />
                            <Label htmlFor="month">Last 30 days</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="90" id="quarter" />
                            <Label htmlFor="quarter">Last 90 days</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Customer */}
                    <div>
                      <Label>Customer</Label>
                      <Input
                        placeholder="Search by customer name..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Occasion */}
                    <div>
                      <Label>Occasion</Label>
                      <ScrollArea className="h-32 mt-2 border rounded-md p-2">
                        {occasions.map((occasion) => (
                          <div key={occasion} className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={occasion}
                              checked={selectedOccasions.includes(occasion)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedOccasions([...selectedOccasions, occasion])
                                } else {
                                  setSelectedOccasions(selectedOccasions.filter(o => o !== occasion))
                                }
                              }}
                            />
                            <Label htmlFor={occasion} className="text-sm cursor-pointer">
                              {occasion}
                            </Label>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>

                    {/* Status */}
                    <div>
                      <Label>Status</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {statuses.map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={status}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedStatuses([...selectedStatuses, status])
                                } else {
                                  setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                                }
                              }}
                            />
                            <Label htmlFor={status} className="text-sm cursor-pointer">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quality Threshold */}
                  <div>
                    <Label>Minimum Quality Rating</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={qualityThreshold}
                        onValueChange={setQualityThreshold}
                        min={0}
                        max={5}
                        step={0.5}
                        className="flex-1"
                      />
                      <Badge variant="secondary">{qualityThreshold[0].toFixed(1)} ⭐</Badge>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedOccasions([])
                      setSelectedStatuses([])
                      setQualityThreshold([4.0])
                      setCustomerSearch("")
                      setDateRangePreset("all")
                    }}>
                      Clear Filters
                    </Button>
                    <Button size="sm" onClick={handleSaveSearch}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Search
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Smart Suggestions */}
            {enableSmartSuggestions && suggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Smart Suggestions</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => console.log("Apply suggestion:", suggestion)}
                    >
                      {suggestion.icon}
                      {suggestion.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Found {results.length} results
                  </span>
                  <Button variant="outline" size="sm" onClick={() => onExportResults?.(results)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className={cn(
                  viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"
                )}>
                  {results.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "border rounded-lg p-4 hover:shadow-md transition-shadow",
                        viewMode === "list" && "flex items-center gap-4"
                      )}
                    >
                      <div className={cn(
                        "text-3xl mb-2",
                        viewMode === "list" && "mb-0"
                      )}>
                        {result.thumbnail}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{result.title}</h4>
                        <p className="text-sm text-gray-600">{result.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {result.relevance}% match
                          </Badge>
                          {result.metadata.rating && (
                            <Badge variant="outline" className="text-xs">
                              ⭐ {result.metadata.rating}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {viewMode === "list" && (
                        <Button size="sm">View</Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-4">
            <Alert>
              <Filter className="h-4 w-4" />
              <AlertDescription>
                Advanced filtering allows you to combine multiple criteria for precise searches.
                All filters work together to narrow down results.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              {/* Filter Categories */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Date & Time</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Custom date range</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Time of day filters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Historical periods</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Content Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Video messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Text notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Tags & labels</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quality & Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Rating threshold</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Engagement metrics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Performance trends</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Custom Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Any metadata field</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Custom attributes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Nested properties</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter Combination Logic */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Filter Logic</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="and">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="and" id="and" />
                      <Label htmlFor="and">AND - All conditions must match</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="or" id="or" />
                      <Label htmlFor="or">OR - Any condition can match</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Custom - Define complex logic</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Saved Searches Tab */}
          <TabsContent value="saved" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Saved Searches</h3>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Search
              </Button>
            </div>

            <div className="space-y-3">
              {savedSearches.map((search) => (
                <Card key={search.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{search.name}</h4>
                          {search.shared && (
                            <Badge variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              Shared
                            </Badge>
                          )}
                          {search.alerts && (
                            <Badge variant="outline" className="text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              Alerts
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Query: "{search.query}"</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Used {search.useCount} times</span>
                          <span>Last: {format(search.lastUsed, "MMM d")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadSearch(search)}
                        >
                          Load
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {savedSearches.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bookmark className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No saved searches yet</p>
                <p className="text-sm mt-1">Save your frequently used searches for quick access</p>
              </div>
            )}
          </TabsContent>

          {/* Discovery Tab */}
          <TabsContent value="discovery" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Related Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Related Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Similar style videos", "Same occasion type", "Recent customer videos"].map((item) => (
                    <Button key={item} variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {item}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Videos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Videos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Top rated this week", "Most viewed", "Trending themes"].map((item) => (
                    <Button key={item} variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {item}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Smart Collections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    Smart Collections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Birthdays this month", "Pending deliveries", "High-value customers"].map((item) => (
                    <Button key={item} variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {item}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Peak booking times", "Popular occasions", "Customer patterns"].map((item) => (
                    <Button key={item} variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {item}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Discovery Alerts */}
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>Discovery Alerts:</strong> Get notified when new content matches your saved searches or when trending patterns emerge.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}