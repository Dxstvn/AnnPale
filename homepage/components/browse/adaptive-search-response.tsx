"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Target,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  ShoppingCart,
  Compass,
  Filter,
  Star,
  Clock,
  DollarSign,
  Globe,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Zap,
  Heart,
  CheckCircle,
  AlertCircle,
  Eye,
  ThumbsUp,
  RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { SearchQuery, ResponseStrategy, SearchPattern, SearchIntent } from "./search-intent-engine"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

// Response component types based on Phase 2.2.1 requirements
interface ResponseComponent {
  id: string
  type: string
  weight: number
  data: any
  isVisible: boolean
  priority: number
}

interface AdaptiveResponseProps {
  searchQuery?: SearchQuery
  creators?: EnhancedCreator[]
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onFilterApply?: (filters: Partial<FilterState>) => void
  onNavigate?: (path: string) => void
  onSearch?: (query: string) => void
  className?: string
}

// Sample creators data for different response types
const SAMPLE_CREATORS: EnhancedCreator[] = [
  {
    id: "wyclef",
    name: "Wyclef Jean",
    category: "Musician",
    price: 150,
    rating: 4.9,
    reviews: 1247,
    image: "/images/wyclef-jean.png",
    responseTime: "24hr",
    verified: true,
    languages: ["English", "French", "Kreyol"],
    specialties: ["Music", "Motivation", "Business"],
    availability: "available",
    trending: true
  },
  {
    id: "tijozenny",
    name: "Ti Jo Zenny",
    category: "Comedian",
    price: 85,
    rating: 4.8,
    reviews: 456,
    image: "/images/ti-jo-zenny.jpg",
    responseTime: "2 days",
    verified: true,
    languages: ["Kreyol", "French"],
    specialties: ["Comedy", "Entertainment", "Birthdays"],
    availability: "available"
  },
  {
    id: "rutshelle",
    name: "Rutshelle Guillaume",
    category: "Singer",
    price: 85,
    rating: 4.9,
    reviews: 634,
    image: "/images/rutshelle-guillaume.jpg",
    responseTime: "1 day",
    verified: true,
    languages: ["Kreyol", "French", "English"],
    specialties: ["Music", "Inspiration", "Love songs"],
    availability: "busy"
  }
]

// Help content for informational queries
const HELP_CONTENT = {
  "how it works": {
    title: "How Ann Pale Works",
    content: "1. Browse creators 2. Book a video 3. Receive your personalized message",
    actions: ["Watch Demo", "View Pricing", "Start Browsing"]
  },
  "pricing": {
    title: "Pricing Information",
    content: "Creator prices range from $25 to $500+ depending on popularity and demand",
    actions: ["View Price Ranges", "Budget Calculator", "Browse by Price"]
  },
  "languages": {
    title: "Language Support",
    content: "Our creators speak English, French, and Kreyòl (Haitian Creole)",
    actions: ["Filter by Language", "See All Languages", "Translation Services"]
  }
}

export function AdaptiveSearchResponse({
  searchQuery,
  creators = SAMPLE_CREATORS,
  onCreatorSelect,
  onFilterApply,
  onNavigate,
  onSearch,
  className
}: AdaptiveResponseProps) {
  const [responseComponents, setResponseComponents] = React.useState<ResponseComponent[]>([])
  const [userFeedback, setUserFeedback] = React.useState<Record<string, "positive" | "negative">>({})
  const [isLearning, setIsLearning] = React.useState(true)
  
  // Generate response components based on search query
  React.useEffect(() => {
    if (!searchQuery) {
      setResponseComponents([])
      return
    }
    
    const components = generateResponseComponents(searchQuery, creators)
    setResponseComponents(components)
  }, [searchQuery, creators])
  
  // Generate appropriate response components
  const generateResponseComponents = (query: SearchQuery, availableCreators: EnhancedCreator[]): ResponseComponent[] => {
    const components: ResponseComponent[] = []
    
    switch (query.pattern) {
      case "known_item":
        components.push(...generateKnownItemResponse(query, availableCreators))
        break
      
      case "transactional":
        components.push(...generateTransactionalResponse(query, availableCreators))
        break
      
      case "exploratory":
        components.push(...generateExploratoryResponse(query, availableCreators))
        break
      
      case "descriptive":
        components.push(...generateDescriptiveResponse(query, availableCreators))
        break
      
      case "navigational":
        components.push(...generateNavigationalResponse(query))
        break
      
      case "informational":
        components.push(...generateInformationalResponse(query))
        break
      
      default:
        components.push(...generateDiscoveryResponse(query, availableCreators))
    }
    
    return components.sort((a, b) => b.priority - a.priority)
  }
  
  // Known item search (direct creator search)
  const generateKnownItemResponse = (query: SearchQuery, creators: EnhancedCreator[]): ResponseComponent[] => {
    const matchedCreators = creators.filter(creator => 
      creator.name.toLowerCase().includes(query.cleaned) ||
      query.tokens.some(token => creator.name.toLowerCase().includes(token))
    )
    
    return [
      {
        id: "direct-match",
        type: "DirectMatch",
        weight: 0.8,
        priority: 10,
        isVisible: matchedCreators.length > 0,
        data: { creators: matchedCreators.slice(0, 1), exact: true }
      },
      {
        id: "similar-creators",
        type: "SimilarCreators",
        weight: 0.2,
        priority: 5,
        isVisible: true,
        data: { creators: creators.slice(0, 3), title: "Similar Creators" }
      }
    ]
  }
  
  // Transactional search (booking intent)
  const generateTransactionalResponse = (query: SearchQuery, creators: EnhancedCreator[]): ResponseComponent[] => {
    const urgencyLevel = query.extractedEntities.urgencyMarkers?.length > 0 ? "high" : "medium"
    const priceFiltered = query.extractedEntities.priceRange 
      ? creators.filter(c => c.price <= (query.extractedEntities.priceRange?.[1] || 1000))
      : creators
    
    const availableCreators = priceFiltered.filter(c => c.availability === "available")
    
    return [
      {
        id: "booking-ready",
        type: "BookingReady",
        weight: 0.7,
        priority: urgencyLevel === "high" ? 10 : 8,
        isVisible: availableCreators.length > 0,
        data: { 
          creators: availableCreators.slice(0, 4), 
          urgency: urgencyLevel,
          quickBook: true
        }
      },
      {
        id: "quick-filters",
        type: "QuickFilters",
        weight: 0.2,
        priority: 6,
        isVisible: true,
        data: { 
          filters: query.suggestedFilters,
          presets: ["Under $100", "Available Today", "Highly Rated"]
        }
      },
      {
        id: "booking-tips",
        type: "BookingTips",
        weight: 0.1,
        priority: 3,
        isVisible: urgencyLevel === "high",
        data: { tips: ["Add personal details", "Check availability", "Clear instructions"] }
      }
    ]
  }
  
  // Exploratory search (category browsing)
  const generateExploratoryResponse = (query: SearchQuery, creators: EnhancedCreator[]): ResponseComponent[] => {
    const category = query.extractedEntities.categories?.[0]
    const categoryCreators = category 
      ? creators.filter(c => c.category.toLowerCase().includes(category.toLowerCase()))
      : creators
    
    return [
      {
        id: "category-showcase",
        type: "CategoryShowcase",
        weight: 0.6,
        priority: 8,
        isVisible: true,
        data: { 
          category,
          creators: categoryCreators.slice(0, 8),
          showFilters: true
        }
      },
      {
        id: "trending-in-category",
        type: "TrendingCreators",
        weight: 0.3,
        priority: 6,
        isVisible: true,
        data: { 
          creators: creators.filter(c => c.trending).slice(0, 4),
          title: category ? `Trending ${category}s` : "Trending Creators"
        }
      },
      {
        id: "category-filters",
        type: "CategoryFilters",
        weight: 0.1,
        priority: 4,
        isVisible: true,
        data: { category, availableFilters: ["Price", "Rating", "Response Time", "Language"] }
      }
    ]
  }
  
  // Descriptive search (attribute-based)
  const generateDescriptiveResponse = (query: SearchQuery, creators: EnhancedCreator[]): ResponseComponent[] => {
    const qualifiers = query.extractedEntities.qualifiers || []
    const languages = query.extractedEntities.languages || []
    
    let filteredCreators = creators
    
    if (qualifiers.includes("best") || qualifiers.includes("top")) {
      filteredCreators = filteredCreators.filter(c => c.rating >= 4.5)
    }
    
    if (languages.length > 0) {
      filteredCreators = filteredCreators.filter(c => 
        c.languages?.some(lang => 
          languages.some(queryLang => 
            lang.toLowerCase().includes(queryLang.toLowerCase())
          )
        )
      )
    }
    
    return [
      {
        id: "smart-results",
        type: "SmartResults",
        weight: 0.8,
        priority: 9,
        isVisible: true,
        data: { 
          creators: filteredCreators.slice(0, 6),
          query: query.original,
          matchReasons: qualifiers
        }
      },
      {
        id: "refine-search",
        type: "RefineSearch",
        weight: 0.2,
        priority: 5,
        isVisible: filteredCreators.length > 6,
        data: { 
          suggestions: ["Add price range", "Specify language", "Choose category"],
          currentFilters: query.suggestedFilters
        }
      }
    ]
  }
  
  // Navigational search (go to page)
  const generateNavigationalResponse = (query: SearchQuery): ResponseComponent[] => {
    const navigationMap: Record<string, string> = {
      "dashboard": "/dashboard",
      "profile": "/profile",
      "settings": "/settings",
      "help": "/help",
      "about": "/about",
      "contact": "/contact"
    }
    
    const targetPage = Object.keys(navigationMap).find(key => 
      query.cleaned.includes(key)
    )
    
    return [
      {
        id: "navigation-redirect",
        type: "NavigationRedirect",
        weight: 1.0,
        priority: 10,
        isVisible: !!targetPage,
        data: { 
          target: targetPage,
          path: targetPage ? navigationMap[targetPage] : "/",
          breadcrumb: true
        }
      }
    ]
  }
  
  // Informational search (help/learn)
  const generateInformationalResponse = (query: SearchQuery): ResponseComponent[] => {
    const helpTopic = Object.keys(HELP_CONTENT).find(topic => 
      query.cleaned.includes(topic.replace(" ", ""))
    )
    
    return [
      {
        id: "help-content",
        type: "HelpContent",
        weight: 0.7,
        priority: 8,
        isVisible: !!helpTopic,
        data: HELP_CONTENT[helpTopic || "how it works"]
      },
      {
        id: "related-faq",
        type: "RelatedFAQ",
        weight: 0.3,
        priority: 6,
        isVisible: true,
        data: { 
          faqs: [
            "How much do videos cost?",
            "How long does delivery take?",
            "Can I request in different languages?"
          ]
        }
      }
    ]
  }
  
  // Discovery search (exploration mode)
  const generateDiscoveryResponse = (query: SearchQuery, creators: EnhancedCreator[]): ResponseComponent[] => {
    return [
      {
        id: "personalized-suggestions",
        type: "PersonalizedSuggestions",
        weight: 0.4,
        priority: 7,
        isVisible: true,
        data: { creators: creators.slice(0, 4), title: "Recommended for You" }
      },
      {
        id: "trending-creators",
        type: "TrendingCreators",
        weight: 0.3,
        priority: 6,
        isVisible: true,
        data: { creators: creators.filter(c => c.trending), title: "Trending Now" }
      },
      {
        id: "category-discovery",
        type: "CategoryDiscovery",
        weight: 0.3,
        priority: 5,
        isVisible: true,
        data: { 
          categories: ["Musicians", "Comedians", "Singers", "Actors"],
          featured: creators.slice(0, 8)
        }
      }
    ]
  }
  
  // Handle user feedback
  const handleFeedback = (componentId: string, feedback: "positive" | "negative") => {
    setUserFeedback(prev => ({ ...prev, [componentId]: feedback }))
    
    if (isLearning) {
      // In production, this would update ML models
      toast.success(feedback === "positive" ? "Thanks for the feedback!" : "We'll improve this")
    }
  }
  
  // Render response component
  const renderComponent = (component: ResponseComponent) => {
    if (!component.isVisible) return null
    
    const feedback = userFeedback[component.id]
    
    return (
      <motion.div
        key={component.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {/* Component content */}
        <div className="relative">
          {renderComponentContent(component)}
          
          {/* Feedback controls */}
          {isLearning && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFeedback(component.id, "positive")}
                className={cn(
                  "h-6 w-6",
                  feedback === "positive" && "text-green-600 bg-green-100"
                )}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFeedback(component.id, "negative")}
                className={cn(
                  "h-6 w-6",
                  feedback === "negative" && "text-red-600 bg-red-100"
                )}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    )
  }
  
  // Render specific component types
  const renderComponentContent = (component: ResponseComponent) => {
    switch (component.type) {
      case "DirectMatch":
        return <DirectMatchComponent {...component.data} onSelect={onCreatorSelect} />
      
      case "BookingReady":
        return <BookingReadyComponent {...component.data} onSelect={onCreatorSelect} />
      
      case "CategoryShowcase":
        return <CategoryShowcaseComponent {...component.data} onSelect={onCreatorSelect} onFilter={onFilterApply} />
      
      case "SmartResults":
        return <SmartResultsComponent {...component.data} onSelect={onCreatorSelect} />
      
      case "HelpContent":
        return <HelpContentComponent {...component.data} onNavigate={onNavigate} />
      
      case "NavigationRedirect":
        return <NavigationRedirectComponent {...component.data} onNavigate={onNavigate} />
      
      case "PersonalizedSuggestions":
        return <PersonalizedSuggestionsComponent {...component.data} onSelect={onCreatorSelect} />
      
      case "QuickFilters":
        return <QuickFiltersComponent {...component.data} onFilter={onFilterApply} />
      
      default:
        return <DefaultComponent {...component.data} />
    }
  }
  
  if (!searchQuery || responseComponents.length === 0) {
    return null
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      <AnimatePresence mode="popLayout">
        {responseComponents.map(component => renderComponent(component))}
      </AnimatePresence>
    </div>
  )
}

// Component implementations
function DirectMatchComponent({ creators, exact, onSelect }: any) {
  if (!creators?.length) return null
  
  const creator = creators[0]
  
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-medium">Direct Match Found</span>
          {exact && <Badge variant="secondary" className="text-xs">Exact</Badge>}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
            {creator.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{creator.name}</h3>
            <p className="text-sm text-gray-600">{creator.category}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-lg font-bold">${creator.price}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{creator.rating}</span>
              </div>
              <Badge variant="outline" className="text-xs">{creator.responseTime}</Badge>
            </div>
          </div>
          
          <Button 
            onClick={() => onSelect?.(creator)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BookingReadyComponent({ creators, urgency, quickBook, onSelect }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Ready to Book
          </CardTitle>
          {urgency === "high" && (
            <Badge variant="destructive" className="animate-pulse">
              Urgent Request
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creators?.slice(0, 4).map((creator: EnhancedCreator) => (
            <div key={creator.id} className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{creator.name}</h4>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">${creator.price}</span>
                <Button 
                  size="sm" 
                  onClick={() => onSelect?.(creator)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {quickBook ? "Quick Book" : "Book Now"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryShowcaseComponent({ category, creators, showFilters, onSelect, onFilter }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}s` : "Browse Creators"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creators?.slice(0, 8).map((creator: EnhancedCreator) => (
            <div key={creator.id} className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer" onClick={() => onSelect?.(creator)}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold mx-auto mb-2">
                  {creator.name.charAt(0)}
                </div>
                <h4 className="font-medium text-sm">{creator.name}</h4>
                <p className="text-xs text-gray-600">${creator.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Refine your search:</p>
            <div className="flex flex-wrap gap-2">
              {["Under $100", "Highly Rated", "Fast Response", "Available Now"].map(filter => (
                <Badge 
                  key={filter}
                  variant="outline" 
                  className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  onClick={() => onFilter?.({ /* filter logic */ })}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SmartResultsComponent({ creators, query, matchReasons, onSelect }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Smart Results for "{query}"
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {creators?.slice(0, 6).map((creator: EnhancedCreator) => (
            <div key={creator.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {creator.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{creator.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{creator.category}</span>
                    <span>•</span>
                    <span>${creator.price}</span>
                    {matchReasons?.map((reason: string) => (
                      <Badge key={reason} variant="secondary" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => onSelect?.(creator)}>
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function HelpContentComponent({ title, content, actions, onNavigate }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="flex flex-wrap gap-2">
          {actions?.map((action: string) => (
            <Button 
              key={action}
              variant="outline" 
              size="sm"
              onClick={() => onNavigate?.(`/help/${action.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              {action}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function NavigationRedirectComponent({ target, path, breadcrumb, onNavigate }: any) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium">Navigate to {target}</h3>
              <p className="text-sm text-gray-600">Taking you to {path}</p>
            </div>
          </div>
          <Button onClick={() => onNavigate?.(path)}>
            Go <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PersonalizedSuggestionsComponent({ creators, title, onSelect }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creators?.slice(0, 4).map((creator: EnhancedCreator) => (
            <div key={creator.id} className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer" onClick={() => onSelect?.(creator)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {creator.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{creator.name}</h4>
                  <p className="text-sm text-gray-600">${creator.price} • {creator.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickFiltersComponent({ filters, presets, onFilter }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5 text-purple-600" />
          Quick Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {presets?.map((preset: string) => (
            <Badge 
              key={preset}
              variant="outline" 
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
              onClick={() => onFilter?.({ /* preset filter logic */ })}
            >
              {preset}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DefaultComponent({ data }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-gray-600">Component data: {JSON.stringify(data)}</p>
      </CardContent>
    </Card>
  )
}