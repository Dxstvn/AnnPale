"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Gift,
  Heart,
  GraduationCap,
  Calendar,
  Briefcase,
  Star,
  Cake,
  Users,
  Trophy,
  Music,
  Smile,
  MessageSquare,
  TrendingUp,
  Clock,
  Info,
  Search,
  Sparkles,
  PartyPopper,
  Baby,
  Home,
  Plane,
  DollarSign,
  Award,
  Coffee
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { StepComponentProps } from "../multi-step-wizard"

// Occasion categories with detailed metadata
export const occasionCategories = [
  {
    id: "celebration",
    label: "Celebration",
    icon: PartyPopper,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
    emotionalTone: "joyful",
    examples: ["Birthday", "Anniversary", "Wedding", "Engagement"],
    suggestedMessage: "Upbeat and personal celebration message",
    popular: true
  },
  {
    id: "support",
    label: "Support",
    icon: Heart,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30",
    emotionalTone: "caring",
    examples: ["Get Well", "Sympathy", "Encouragement", "Thinking of You"],
    suggestedMessage: "Thoughtful and warm support message"
  },
  {
    id: "milestone",
    label: "Milestone",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30",
    emotionalTone: "proud",
    examples: ["Graduation", "New Job", "Retirement", "Promotion"],
    suggestedMessage: "Congratulatory and inspiring message",
    trending: true
  },
  {
    id: "holiday",
    label: "Holiday",
    icon: Calendar,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30",
    emotionalTone: "festive",
    examples: ["Christmas", "New Year", "Easter", "Thanksgiving"],
    suggestedMessage: "Traditional holiday greeting with cultural touch",
    seasonal: true
  },
  {
    id: "just_because",
    label: "Just Because",
    icon: Smile,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
    emotionalTone: "spontaneous",
    examples: ["Thinking of You", "Miss You", "Thank You", "Random Surprise"],
    suggestedMessage: "Casual and friendly message"
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30",
    emotionalTone: "professional",
    examples: ["Thank You", "Welcome", "Congratulations", "Partnership"],
    suggestedMessage: "Formal and appreciative message"
  },
  {
    id: "baby",
    label: "Baby & Kids",
    icon: Baby,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30",
    emotionalTone: "playful",
    examples: ["Baby Shower", "Gender Reveal", "First Birthday", "Kids Party"],
    suggestedMessage: "Fun and playful message for children"
  },
  {
    id: "sports",
    label: "Sports & Teams",
    icon: Award,
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30",
    emotionalTone: "motivational",
    examples: ["Game Day", "Championship", "Team Spirit", "Coach Thanks"],
    suggestedMessage: "Motivational team or sports message"
  }
]

// Specific occasions with more detail
const specificOccasions = [
  { id: "birthday", category: "celebration", label: "Birthday", icon: Cake, popularity: 95 },
  { id: "anniversary", category: "celebration", label: "Anniversary", icon: Heart, popularity: 85 },
  { id: "graduation", category: "milestone", label: "Graduation", icon: GraduationCap, popularity: 80 },
  { id: "wedding", category: "celebration", label: "Wedding", icon: Users, popularity: 75 },
  { id: "new_job", category: "milestone", label: "New Job", icon: Briefcase, popularity: 70 },
  { id: "get_well", category: "support", label: "Get Well Soon", icon: Heart, popularity: 65 },
  { id: "christmas", category: "holiday", label: "Christmas", icon: Gift, popularity: 90, seasonal: true },
  { id: "mothers_day", category: "holiday", label: "Mother's Day", icon: Heart, popularity: 88, seasonal: true },
  { id: "fathers_day", category: "holiday", label: "Father's Day", icon: Coffee, popularity: 85, seasonal: true },
  { id: "valentines", category: "holiday", label: "Valentine's Day", icon: Heart, popularity: 82, seasonal: true },
  { id: "retirement", category: "milestone", label: "Retirement", icon: Plane, popularity: 60 },
  { id: "promotion", category: "milestone", label: "Promotion", icon: TrendingUp, popularity: 65 },
  { id: "thank_you", category: "just_because", label: "Thank You", icon: MessageSquare, popularity: 78 },
  { id: "congratulations", category: "milestone", label: "Congratulations", icon: Star, popularity: 82 },
  { id: "new_home", category: "milestone", label: "New Home", icon: Home, popularity: 55 },
  { id: "fundraiser", category: "business", label: "Fundraiser", icon: DollarSign, popularity: 45 }
]

export function OccasionSelection({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    data.occasionCategory || null
  )
  const [selectedOccasion, setSelectedOccasion] = React.useState<string | null>(
    data.occasion || null
  )
  const [customOccasion, setCustomOccasion] = React.useState(data.customOccasion || "")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showAllOccasions, setShowAllOccasions] = React.useState(false)
  
  // Get current season for seasonal recommendations
  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return "spring"
    if (month >= 5 && month <= 7) return "summer"
    if (month >= 8 && month <= 10) return "fall"
    return "winter"
  }
  
  const currentSeason = getCurrentSeason()
  
  // Get seasonal occasions
  const seasonalOccasions = React.useMemo(() => {
    const seasonal = specificOccasions.filter(o => o.seasonal)
    // Filter based on current season/time
    const month = new Date().getMonth()
    if (month === 11 || month === 0) {
      return seasonal.filter(o => o.id === "christmas" || o.id === "new_year")
    }
    if (month === 1) {
      return seasonal.filter(o => o.id === "valentines")
    }
    if (month === 4) {
      return seasonal.filter(o => o.id === "mothers_day")
    }
    if (month === 5) {
      return seasonal.filter(o => o.id === "fathers_day" || o.id === "graduation")
    }
    return []
  }, [])
  
  // Filter occasions based on search
  const filteredOccasions = React.useMemo(() => {
    if (!searchQuery) {
      return showAllOccasions 
        ? specificOccasions 
        : specificOccasions.filter(o => o.popularity >= 70)
    }
    
    return specificOccasions.filter(o =>
      o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.category.includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, showAllOccasions])
  
  // Get occasions for selected category
  const categoryOccasions = React.useMemo(() => {
    if (!selectedCategory) return []
    return specificOccasions.filter(o => o.category === selectedCategory)
  }, [selectedCategory])
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    updateData({
      occasionCategory: categoryId,
      occasion: null,
      customOccasion: null
    })
    setSelectedOccasion(null)
    setCustomOccasion("")
  }
  
  const handleOccasionSelect = (occasionId: string) => {
    const occasion = specificOccasions.find(o => o.id === occasionId)
    if (occasion) {
      setSelectedOccasion(occasionId)
      setSelectedCategory(occasion.category)
      updateData({
        occasion: occasionId,
        occasionCategory: occasion.category,
        occasionLabel: occasion.label,
        customOccasion: null
      })
      setCustomOccasion("")
    }
  }
  
  const handleCustomOccasion = () => {
    if (customOccasion.trim()) {
      updateData({
        occasion: "custom",
        occasionCategory: selectedCategory || "just_because",
        occasionLabel: customOccasion,
        customOccasion: customOccasion
      })
      setSelectedOccasion("custom")
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Seasonal Recommendations */}
      {seasonalOccasions.length > 0 && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <h3 className="font-medium">Trending Now</h3>
            <Badge variant="secondary" className="text-xs">Seasonal</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {seasonalOccasions.map((occasion) => {
              const Icon = occasion.icon
              return (
                <motion.button
                  key={occasion.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOccasionSelect(occasion.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-left",
                    selectedOccasion === occasion.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-sm">{occasion.label}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < Math.floor(occasion.popularity / 20)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {occasion.popularity}% popular
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search occasions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Category Selection */}
      {!searchQuery && (
        <div className="space-y-3">
          <h3 className="font-medium">Choose a Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {occasionCategories.map((category) => {
              const Icon = category.icon
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all",
                    selectedCategory === category.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {category.popular && (
                    <Badge className="absolute -top-2 -right-2 text-xs">
                      Popular
                    </Badge>
                  )}
                  {category.trending && (
                    <Badge className="absolute -top-2 -right-2 text-xs bg-orange-500">
                      Trending
                    </Badge>
                  )}
                  <div className={cn("p-3 rounded-lg mb-2", category.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-medium text-sm">{category.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.examples.slice(0, 2).join(", ")}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Specific Occasions */}
      {(selectedCategory || searchQuery) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {searchQuery 
                ? `Search Results (${filteredOccasions.length})`
                : "Select Specific Occasion"
              }
            </h3>
            {!searchQuery && !showAllOccasions && categoryOccasions.length > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllOccasions(true)}
              >
                Show All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {(searchQuery ? filteredOccasions : categoryOccasions)
                .slice(0, showAllOccasions || searchQuery ? undefined : 6)
                .map((occasion) => {
                  const Icon = occasion.icon
                  return (
                    <motion.button
                      key={occasion.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOccasionSelect(occasion.id)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-left",
                        selectedOccasion === occasion.id
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm">{occasion.label}</span>
                      </div>
                      {occasion.seasonal && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Limited Time
                        </Badge>
                      )}
                    </motion.button>
                  )
                })}
            </AnimatePresence>
          </div>
        </div>
      )}
      
      {/* Custom Occasion */}
      <div className="space-y-3">
        <h3 className="font-medium">Or Enter Custom Occasion</h3>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Bar Mitzvah, Quinceañera, etc."
            value={customOccasion}
            onChange={(e) => setCustomOccasion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCustomOccasion()
              }
            }}
            className={cn(
              selectedOccasion === "custom" && "border-purple-500"
            )}
          />
          <Button
            onClick={handleCustomOccasion}
            disabled={!customOccasion.trim()}
          >
            Select
          </Button>
        </div>
      </div>
      
      {/* Error Display */}
      {errors?.occasion && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.occasion}
          </p>
        </div>
      )}
      
      {/* Selected Occasion Summary */}
      {selectedOccasion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium">
                Occasion Selected: {data.occasionLabel || customOccasion}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {occasionCategories.find(c => c.id === selectedCategory)?.suggestedMessage}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}