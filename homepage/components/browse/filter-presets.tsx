"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bookmark,
  BookmarkPlus,
  MoreVertical,
  Trash2,
  Share2,
  Copy,
  Check,
  Sparkles,
  DollarSign,
  Clock,
  Star,
  Globe,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { FilterState } from "./filter-sidebar"
import type { FilterPreset } from "@/hooks/use-filter-persistence"

interface FilterPresetsProps {
  currentFilters: FilterState
  presets: FilterPreset[]
  onSavePreset: (name: string, description: string, icon?: string) => void
  onLoadPreset: (preset: FilterPreset) => void
  onDeletePreset: (presetId: string) => void
  onShareFilters: () => void
  className?: string
}

const presetIcons = [
  { icon: "💰", label: "Budget" },
  { icon: "⚡", label: "Fast" },
  { icon: "⭐", label: "Premium" },
  { icon: "🎉", label: "Party" },
  { icon: "🎂", label: "Birthday" },
  { icon: "💑", label: "Romance" },
  { icon: "🎓", label: "Graduation" },
  { icon: "🎄", label: "Holiday" },
]

// Default system presets
const systemPresets: FilterPreset[] = [
  {
    id: "budget-friendly",
    name: "Budget Friendly",
    description: "Creators under $50",
    icon: "💰",
    filters: {
      categories: [],
      priceRange: [0, 50],
      responseTime: [],
      languages: [],
      rating: 0,
      availability: "all",
      verified: false
    },
    createdAt: "system"
  },
  {
    id: "quick-turnaround",
    name: "Quick Turnaround",
    description: "24-hour response time",
    icon: "⚡",
    filters: {
      categories: [],
      priceRange: [0, 500],
      responseTime: ["24hr"],
      languages: [],
      rating: 0,
      availability: "available",
      verified: false
    },
    createdAt: "system"
  },
  {
    id: "top-rated",
    name: "Top Rated",
    description: "4.8+ stars, verified only",
    icon: "⭐",
    filters: {
      categories: [],
      priceRange: [0, 500],
      responseTime: [],
      languages: [],
      rating: 4.8,
      availability: "all",
      verified: true
    },
    createdAt: "system"
  },
  {
    id: "haitian-culture",
    name: "Haitian Culture",
    description: "Kreyòl speaking creators",
    icon: "🇭🇹",
    filters: {
      categories: [],
      priceRange: [0, 500],
      responseTime: [],
      languages: ["kreyol"],
      rating: 0,
      availability: "all",
      verified: false
    },
    createdAt: "system"
  }
]

export function FilterPresets({
  currentFilters,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onShareFilters,
  className
}: FilterPresetsProps) {
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [presetName, setPresetName] = React.useState("")
  const [presetDescription, setPresetDescription] = React.useState("")
  const [selectedIcon, setSelectedIcon] = React.useState("⭐")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const allPresets = [...systemPresets, ...presets]

  const handleSave = () => {
    if (presetName.trim()) {
      onSavePreset(presetName, presetDescription, selectedIcon)
      setShowSaveDialog(false)
      setPresetName("")
      setPresetDescription("")
      setSelectedIcon("⭐")
    }
  }

  const handleShare = (preset: FilterPreset) => {
    onLoadPreset(preset)
    setTimeout(() => {
      onShareFilters()
      setCopiedId(preset.id)
      setTimeout(() => setCopiedId(null), 2000)
    }, 100)
  }

  const getFilterSummary = (filters: FilterState) => {
    const parts = []
    
    if (filters.categories.length > 0) {
      parts.push(`${filters.categories.length} categories`)
    }
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
      parts.push(`$${filters.priceRange[0]}-${filters.priceRange[1]}`)
    }
    
    if (filters.rating > 0) {
      parts.push(`${filters.rating}+ stars`)
    }
    
    if (filters.responseTime.length > 0) {
      parts.push(`${filters.responseTime.length} response times`)
    }
    
    if (filters.languages.length > 0) {
      parts.push(`${filters.languages.length} languages`)
    }
    
    if (filters.verified) {
      parts.push("Verified only")
    }
    
    return parts.join(" • ") || "No filters"
  }

  const hasActiveFilters = 
    currentFilters.categories.length > 0 ||
    currentFilters.priceRange[0] > 0 ||
    currentFilters.priceRange[1] < 500 ||
    currentFilters.responseTime.length > 0 ||
    currentFilters.languages.length > 0 ||
    currentFilters.rating > 0 ||
    currentFilters.availability !== "all" ||
    currentFilters.verified

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Filters
          </h3>
          {hasActiveFilters && (
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <BookmarkPlus className="h-3 w-3 mr-1" />
                  Save Current
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Filter Preset</DialogTitle>
                  <DialogDescription>
                    Save your current filter combination for quick access later
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="preset-name">Preset Name</Label>
                    <Input
                      id="preset-name"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="e.g., Birthday Budget"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preset-description">Description (optional)</Label>
                    <Textarea
                      id="preset-description"
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                      placeholder="Describe when to use this filter..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Choose an Icon</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {presetIcons.map((item) => (
                        <button
                          key={item.icon}
                          onClick={() => setSelectedIcon(item.icon)}
                          className={cn(
                            "p-2 rounded-lg border-2 transition",
                            selectedIcon === item.icon
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                          )}
                        >
                          <span className="text-2xl">{item.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Current Filters:
                    </p>
                    <p className="text-sm">
                      {getFilterSummary(currentFilters)}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={!presetName.trim()}>
                    Save Preset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {allPresets.slice(0, 4).map((preset) => (
            <Card
              key={preset.id}
              className="group cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => onLoadPreset(preset)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-sm font-medium truncate">
                        {preset.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                  
                  {preset.createdAt !== "system" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShare(preset)}>
                          <Share2 className="h-3 w-3 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeletePreset(preset.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  {copiedId === preset.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-2 right-2"
                    >
                      <Badge variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Presets */}
        {allPresets.length > 4 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full mt-2">
                View all presets ({allPresets.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>All Filter Presets</DialogTitle>
                <DialogDescription>
                  Quick access to your saved filter combinations
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {allPresets.map((preset) => (
                    <Card
                      key={preset.id}
                      className="group cursor-pointer hover:shadow-md transition"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <button
                            onClick={() => {
                              onLoadPreset(preset)
                              // Close dialog
                              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                            }}
                            className="flex-1 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{preset.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-medium">{preset.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {preset.description}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                  {getFilterSummary(preset.filters)}
                                </p>
                              </div>
                            </div>
                          </button>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(preset)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            {preset.createdAt !== "system" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeletePreset(preset.id)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}