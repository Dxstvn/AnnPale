"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Star,
  Check,
  X as XIcon,
  Minus,
  DollarSign,
  Clock,
  Globe,
  Video,
  Users,
  Award,
  TrendingUp,
  MessageSquare,
  Calendar,
  Heart,
  Sparkles,
  Info,
  Crown,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface FeatureMatrixProps {
  creators: EnhancedCreator[]
  onRemove?: (id: string) => void
  onBook?: (id: string) => void
  onExport?: () => void
  highlightDifferences?: boolean
  className?: string
}

// Feature categories for comparison
const featureCategories = [
  {
    name: "Basics",
    icon: Info,
    features: [
      { key: "verified", label: "Verified Account", type: "boolean" },
      { key: "category", label: "Category", type: "text" },
      { key: "languages", label: "Languages", type: "array" },
      { key: "availability", label: "Availability", type: "text" }
    ]
  },
  {
    name: "Pricing & Delivery",
    icon: DollarSign,
    features: [
      { key: "price", label: "Base Price", type: "currency" },
      { key: "responseTime", label: "Response Time", type: "text" },
      { key: "rushAvailable", label: "Rush Delivery", type: "boolean" },
      { key: "bulkDiscount", label: "Bulk Discount", type: "boolean" }
    ]
  },
  {
    name: "Performance",
    icon: Award,
    features: [
      { key: "rating", label: "Average Rating", type: "rating" },
      { key: "reviewCount", label: "Total Reviews", type: "number" },
      { key: "completionRate", label: "Completion Rate", type: "percentage" },
      { key: "videoCount", label: "Videos Created", type: "number" }
    ]
  },
  {
    name: "Features",
    icon: Sparkles,
    features: [
      { key: "customRequests", label: "Custom Requests", type: "boolean" },
      { key: "liveVideo", label: "Live Video Calls", type: "boolean" },
      { key: "groupMessages", label: "Group Messages", type: "boolean" },
      { key: "subtitles", label: "Subtitles Available", type: "boolean" }
    ]
  },
  {
    name: "Engagement",
    icon: Users,
    features: [
      { key: "trending", label: "Currently Trending", type: "boolean" },
      { key: "featured", label: "Featured Creator", type: "boolean" },
      { key: "socialMedia", label: "Social Media Links", type: "boolean" },
      { key: "fanClub", label: "Fan Club Available", type: "boolean" }
    ]
  }
]

export function FeatureMatrix({
  creators,
  onRemove,
  onBook,
  onExport,
  highlightDifferences = true,
  className
}: FeatureMatrixProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [comparisonMode, setComparisonMode] = React.useState<"features" | "ratings" | "pricing">("features")

  // Find the best value for each feature
  const getBestValue = (feature: any, values: any[]) => {
    const validValues = values.filter(v => v !== undefined && v !== null)
    if (validValues.length === 0) return null

    switch (feature.type) {
      case "boolean":
        return true // Best is having the feature
      case "number":
      case "percentage":
        return Math.max(...validValues.filter(v => typeof v === "number"))
      case "rating":
        return Math.max(...validValues.filter(v => typeof v === "number"))
      case "currency":
        return Math.min(...validValues.filter(v => typeof v === "number")) // Lower price is better
      case "text":
        // For response time, convert to hours and find minimum
        if (feature.key === "responseTime") {
          const times = validValues.map(v => {
            const num = parseInt(v)
            if (v.includes("hour")) return num
            if (v.includes("day")) return num * 24
            return num * 168 // weeks
          })
          const minTime = Math.min(...times)
          return validValues[times.indexOf(minTime)]
        }
        return null
      default:
        return null
    }
  }

  // Render feature value
  const renderFeatureValue = (feature: any, value: any, isBest: boolean) => {
    if (value === undefined || value === null) {
      return <Minus className="h-4 w-4 text-gray-400" />
    }

    const valueClass = cn(
      isBest && highlightDifferences && "text-green-600 dark:text-green-400 font-semibold"
    )

    switch (feature.type) {
      case "boolean":
        return value ? (
          <Check className={cn("h-4 w-4", value ? "text-green-500" : "text-gray-400")} />
        ) : (
          <XIcon className="h-4 w-4 text-gray-400" />
        )
      
      case "rating":
        return (
          <div className={cn("flex items-center gap-1", valueClass)}>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{value.toFixed(1)}</span>
          </div>
        )
      
      case "currency":
        return (
          <span className={valueClass}>
            ${value}
          </span>
        )
      
      case "percentage":
        return (
          <span className={valueClass}>
            {value}%
          </span>
        )
      
      case "array":
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((item: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
            {value.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{value.length - 2}
              </Badge>
            )}
          </div>
        )
      
      default:
        return <span className={valueClass}>{value}</span>
    }
  }

  // Calculate overall scores
  const calculateScores = () => {
    return creators.map(creator => {
      let score = 0
      let maxScore = 0

      featureCategories.forEach(category => {
        category.features.forEach(feature => {
          maxScore += 10
          const value = (creator as any)[feature.key]
          
          if (feature.type === "boolean" && value) score += 10
          else if (feature.type === "rating") score += (value / 5) * 10
          else if (feature.type === "percentage" && value) score += (value / 100) * 10
          else if (feature.type === "number" && value) score += Math.min(value / 100, 1) * 10
          else if (value) score += 5
        })
      })

      return {
        creator,
        score: Math.round((score / maxScore) * 100)
      }
    })
  }

  const scores = calculateScores()
  const winner = scores.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  )

  const filteredCategories = selectedCategory === "all" 
    ? featureCategories 
    : featureCategories.filter(cat => cat.name.toLowerCase().includes(selectedCategory))

  return (
    <TooltipProvider>
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Feature Comparison Matrix</CardTitle>
              {winner && (
                <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Best Match: {winner.creator.name}
                </Badge>
              )}
            </div>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-start px-6 rounded-none">
              <TabsTrigger value="all">All Features</TabsTrigger>
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Matrix Table */}
          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-4 font-medium">Feature</th>
                    {creators.map(creator => (
                      <th key={creator.id} className="p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="text-sm font-medium">{creator.name}</span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{creator.rating}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, catIndex) => (
                    <React.Fragment key={category.name}>
                      {/* Category Header */}
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td colSpan={creators.length + 1} className="p-3">
                          <div className="flex items-center gap-2 font-medium">
                            <category.icon className="h-4 w-4" />
                            {category.name}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Features */}
                      {category.features.map((feature, index) => {
                        const values = creators.map(c => (c as any)[feature.key])
                        const bestValue = getBestValue(feature, values)
                        
                        return (
                          <tr 
                            key={feature.key}
                            className={cn(
                              "border-b",
                              index % 2 === 0 && "bg-gray-50/50 dark:bg-gray-800/50"
                            )}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{feature.label}</span>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      Compare {feature.label.toLowerCase()} across creators
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                            {creators.map((creator, idx) => {
                              const value = (creator as any)[feature.key]
                              const isBest = bestValue !== null && value === bestValue
                              
                              return (
                                <td key={creator.id} className="p-4 text-center">
                                  {renderFeatureValue(feature, value, isBest)}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </React.Fragment>
                  ))}
                  
                  {/* Overall Score Row */}
                  <tr className="bg-purple-50 dark:bg-purple-900/20 font-semibold">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        Overall Score
                      </div>
                    </td>
                    {scores.map(({ creator, score }) => (
                      <td key={creator.id} className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn(
                            "text-lg",
                            score === winner.score && "text-purple-600 dark:text-purple-400"
                          )}>
                            {score}%
                          </div>
                          {score === winner.score && (
                            <Badge variant="default" className="text-xs">
                              Best Match
                            </Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Action Footer */}
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comparing {creators.length} creators across {featureCategories.reduce((acc, cat) => acc + cat.features.length, 0)} features
              </p>
              <div className="flex gap-2">
                {creators.map(creator => (
                  <Button
                    key={creator.id}
                    size="sm"
                    onClick={() => onBook?.(creator.id)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Book {creator.name.split(" ")[0]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}