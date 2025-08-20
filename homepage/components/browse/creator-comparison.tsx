"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Star,
  Clock,
  Globe,
  DollarSign,
  Video,
  MessageSquare,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Minus,
  Award,
  Users,
  ArrowRight,
  X,
  Heart,
  Share2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface ComparisonProps {
  creators: EnhancedCreator[]
  onRemove: (id: string) => void
  onClear: () => void
  onBook: (id: string) => void
  onClose?: () => void
  isModal?: boolean
}

// Comparison metrics
const metrics = [
  { key: "price", label: "Price", icon: DollarSign, format: (val: number) => `$${val}`, lowerBetter: true },
  { key: "rating", label: "Rating", icon: Star, format: (val: number) => val.toFixed(1), lowerBetter: false },
  { key: "reviewCount", label: "Reviews", icon: MessageSquare, format: (val: number) => val.toString(), lowerBetter: false },
  { key: "responseTime", label: "Response Time", icon: Clock, format: (val: string) => val, lowerBetter: true },
  { key: "videoCount", label: "Videos", icon: Video, format: (val: number) => val?.toString() || "N/A", lowerBetter: false },
  { key: "completionRate", label: "Completion Rate", icon: CheckCircle, format: (val: number) => val ? `${val}%` : "N/A", lowerBetter: false },
]

function ComparisonContent({ creators, onRemove, onClear, onBook }: Omit<ComparisonProps, "isModal" | "onClose">) {
  const [selectedCreator, setSelectedCreator] = React.useState<string>(creators[0]?.id || "")

  // Find best values for each metric
  const getBestValue = (metric: typeof metrics[0]) => {
    const values = creators.map(c => (c as any)[metric.key]).filter(v => v !== undefined && v !== null)
    if (values.length === 0) return null
    
    if (metric.lowerBetter) {
      if (metric.key === "responseTime") {
        // Custom logic for response time comparison
        const timeValues = values.map(v => {
          const num = parseInt(v)
          const multiplier = v.includes("hour") ? 1 : v.includes("day") ? 24 : 168
          return num * multiplier
        })
        return values[timeValues.indexOf(Math.min(...timeValues))]
      }
      return Math.min(...values)
    }
    return Math.max(...values)
  }

  const isWinner = (creator: EnhancedCreator, metric: typeof metrics[0]) => {
    const bestValue = getBestValue(metric)
    const creatorValue = (creator as any)[metric.key]
    
    if (metric.key === "responseTime") {
      return creatorValue === bestValue
    }
    
    return creatorValue === bestValue
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Compare Creators</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Side-by-side comparison of {creators.length} creators
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClear}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Mobile View - Tabs */}
      <div className="lg:hidden">
        <Tabs value={selectedCreator} onValueChange={setSelectedCreator}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${creators.length}, 1fr)` }}>
            {creators.map((creator) => (
              <TabsTrigger key={creator.id} value={creator.id}>
                {creator.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          {creators.map((creator) => (
            <TabsContent key={creator.id} value={creator.id}>
              <CreatorComparisonCard
                creator={creator}
                metrics={metrics}
                isWinner={isWinner}
                onRemove={() => onRemove(creator.id)}
                onBook={() => onBook(creator.id)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Desktop View - Grid */}
      <div className="hidden lg:block flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(creators.length, 4)}, 1fr)` }}>
            {/* Creator Cards Row */}
            {creators.map((creator) => (
              <motion.div key={creator.id} variants={item}>
                <Card className="relative overflow-hidden">
                  {/* Remove button */}
                  <button
                    onClick={() => onRemove(creator.id)}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Creator Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={creator.coverImage || creator.avatar}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                    {creator.verified && (
                      <Badge className="absolute top-3 left-3 bg-blue-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{creator.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {creator.category}
                    </p>

                    {/* Quick Stats */}
                    <div className="space-y-3">
                      {metrics.map((metric) => {
                        const value = (creator as any)[metric.key]
                        const winner = isWinner(creator, metric)
                        const Icon = metric.icon

                        return (
                          <div
                            key={metric.key}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg transition",
                              winner && "bg-green-50 dark:bg-green-900/20"
                            )}
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <Icon className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {metric.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={cn(
                                "font-medium",
                                winner && "text-green-600 dark:text-green-400"
                              )}>
                                {metric.format(value)}
                              </span>
                              {winner && (
                                <Award className="h-3 w-3 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Languages */}
                    {creator.languages.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Globe className="h-3 w-3" />
                          {creator.languages.join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <Button
                        onClick={() => onBook(creator.id)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Book {creator.name.split(" ")[0]}
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed Comparison Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 text-sm font-medium">Feature</th>
                      {creators.map((creator) => (
                        <th key={creator.id} className="text-center py-2 px-3 text-sm font-medium">
                          {creator.name.split(" ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Specialties */}
                    <tr className="border-b">
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                        Specialties
                      </td>
                      {creators.map((creator) => (
                        <td key={creator.id} className="py-3 px-3 text-center">
                          {creator.specialties ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {creator.specialties.slice(0, 3).map((specialty) => (
                                <Badge key={specialty} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Minus className="h-4 w-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Availability */}
                    <tr className="border-b">
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                        Availability
                      </td>
                      {creators.map((creator) => (
                        <td key={creator.id} className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              creator.availability === "available" && "bg-green-500",
                              creator.availability === "busy" && "bg-yellow-500",
                              creator.availability === "offline" && "bg-gray-400"
                            )} />
                            <span className="text-sm capitalize">
                              {creator.availability || "Unknown"}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Trending Status */}
                    <tr className="border-b">
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </td>
                      {creators.map((creator) => (
                        <td key={creator.id} className="py-3 px-3 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {creator.trending && (
                              <Badge variant="warning" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {creator.featured && (
                              <Badge variant="success" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {!creator.trending && !creator.featured && (
                              <Minus className="h-4 w-4 text-gray-300" />
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Last Active */}
                    <tr>
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                        Last Active
                      </td>
                      {creators.map((creator) => (
                        <td key={creator.id} className="py-3 px-3 text-center text-sm">
                          {creator.lastActive || "Recently"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </motion.div>
  )
}

// Individual creator card for mobile view
function CreatorComparisonCard({
  creator,
  metrics,
  isWinner,
  onRemove,
  onBook
}: {
  creator: EnhancedCreator
  metrics: typeof metrics
  isWinner: (creator: EnhancedCreator, metric: typeof metrics[0]) => boolean
  onRemove: () => void
  onBook: () => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{creator.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {creator.category}
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {metrics.map((metric) => {
            const value = (creator as any)[metric.key]
            const winner = isWinner(creator, metric)
            const Icon = metric.icon

            return (
              <div
                key={metric.key}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg",
                  winner && "bg-green-50 dark:bg-green-900/20"
                )}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4 text-gray-400" />
                  <span>{metric.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "font-medium",
                    winner && "text-green-600 dark:text-green-400"
                  )}>
                    {metric.format(value)}
                  </span>
                  {winner && (
                    <Award className="h-3 w-3 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Button
          onClick={onBook}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  )
}

export function CreatorComparison(props: ComparisonProps) {
  if (props.isModal) {
    return (
      <Dialog open onOpenChange={props.onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <div className="p-6 h-full overflow-hidden">
            <ComparisonContent {...props} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return <ComparisonContent {...props} />
}