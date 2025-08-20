"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Users,
  Heart,
  Music,
  Smile,
  Trophy,
  Camera,
  Mic,
  ChefHat,
  Radio,
  Globe,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  RefreshCw,
  Bell,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { FilterState } from "./filter-sidebar"

type EmptyStateType = 
  | "no-results"
  | "no-filters"
  | "initial"
  | "loading"
  | "error"
  | "coming-soon"

interface EmptyStateProps {
  type: EmptyStateType
  searchQuery?: string
  filters?: FilterState
  onAction?: () => void
  onSecondaryAction?: () => void
  className?: string
}

// Category cards for browsing
const popularCategories = [
  { id: "musicians", name: "Musicians", icon: Music, color: "purple", count: 45 },
  { id: "comedians", name: "Comedians", icon: Smile, color: "yellow", count: 32 },
  { id: "athletes", name: "Athletes", icon: Trophy, color: "green", count: 28 },
  { id: "influencers", name: "Influencers", icon: Camera, color: "pink", count: 56 },
  { id: "djs", name: "DJs", icon: Radio, color: "blue", count: 23 },
  { id: "chefs", name: "Chefs", icon: ChefHat, color: "orange", count: 18 }
]

// Quick action suggestions
const quickActions = [
  { label: "Birthday wishes", icon: "🎂", query: "birthday" },
  { label: "Wedding messages", icon: "💒", query: "wedding" },
  { label: "Congratulations", icon: "🎉", query: "congratulations" },
  { label: "Motivation", icon: "💪", query: "motivation" }
]

export function SearchEmptyState({
  type,
  searchQuery,
  filters,
  onAction,
  onSecondaryAction,
  className
}: EmptyStateProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  // Initial state - no search performed yet
  if (type === "initial") {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={cn("py-12", className)}
      >
        <motion.div variants={item} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
            <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Discover Amazing Haitian Creators
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Get personalized video messages from your favorite celebrities
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="mb-12">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Popular occasions
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.query}
                variant="outline"
                onClick={() => onAction?.()}
                className="gap-2"
              >
                <span className="text-lg">{action.icon}</span>
                {action.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Category Grid */}
        <motion.div variants={item}>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Browse by category
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => onAction?.()}
                >
                  <CardContent className="p-4 text-center">
                    <div className={cn(
                      "inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2",
                      category.color === "purple" && "bg-purple-100 dark:bg-purple-900/30",
                      category.color === "yellow" && "bg-yellow-100 dark:bg-yellow-900/30",
                      category.color === "green" && "bg-green-100 dark:bg-green-900/30",
                      category.color === "pink" && "bg-pink-100 dark:bg-pink-900/30",
                      category.color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
                      category.color === "orange" && "bg-orange-100 dark:bg-orange-900/30"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        category.color === "purple" && "text-purple-600 dark:text-purple-400",
                        category.color === "yellow" && "text-yellow-600 dark:text-yellow-400",
                        category.color === "green" && "text-green-600 dark:text-green-400",
                        category.color === "pink" && "text-pink-600 dark:text-pink-400",
                        category.color === "blue" && "text-blue-600 dark:text-blue-400",
                        category.color === "orange" && "text-orange-600 dark:text-orange-400"
                      )} />
                    </div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.count} creators</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // No results with helpful guidance
  if (type === "no-results") {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={cn("py-12", className)}
      >
        <motion.div variants={item} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            No creators found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchQuery 
              ? `We couldn't find creators matching "${searchQuery}"`
              : "No creators match your current filters"}
          </p>
        </motion.div>

        {/* Helpful tips */}
        <motion.div variants={item} className="max-w-lg mx-auto mb-8">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Tips for better results
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  Try using simpler or more general terms
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  Check your spelling and try variations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  Remove some filters to see more results
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  Browse categories to discover creators
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={item} className="flex justify-center gap-3">
          <Button onClick={onAction} variant="default">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear search
          </Button>
          <Button onClick={onSecondaryAction} variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Browse all
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  // Coming soon state
  if (type === "coming-soon") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("py-12 text-center", className)}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
          <Clock className="h-10 w-10 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          More creators coming soon!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          We're constantly adding new Haitian celebrities to the platform. Check back soon!
        </p>
        <Button onClick={onAction} variant="default">
          <Bell className="h-4 w-4 mr-2" />
          Notify me
        </Button>
      </motion.div>
    )
  }

  // Default empty state
  return (
    <div className={cn("py-12 text-center", className)}>
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
        <Search className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Start your search
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        Use the search bar above to find your favorite Haitian creators
      </p>
    </div>
  )
}