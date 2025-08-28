'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { CATEGORIES } from '@/app/fan/explore/page'

interface CategoryFilterProps {
  selectedCategories: string[]
  onCategoryToggle: (categoryId: string) => void
  showCounts?: boolean
  className?: string
}

// Mock category counts - in production, these would come from the database
const categoryCounts: Record<string, number> = {
  music: 45,
  comedy: 23,
  dance: 18,
  sports: 12,
  media: 31,
  entertainment: 27,
  podcaster: 15,
  all: 171
}

export function CategoryFilter({
  selectedCategories,
  onCategoryToggle,
  showCounts = true,
  className
}: CategoryFilterProps) {
  const isAllSelected = selectedCategories.length === 0

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {CATEGORIES.map((category) => {
        const isSelected = category.id === 'all' 
          ? isAllSelected 
          : selectedCategories.includes(category.id)
        
        const Icon = category.icon
        const count = categoryCounts[category.id] || 0
        
        // Define color classes based on category
        const colorClasses = {
          purple: {
            bg: 'bg-purple-100 hover:bg-purple-200',
            bgSelected: 'bg-purple-500',
            text: 'text-purple-700',
            textSelected: 'text-white',
            border: 'border-purple-300',
            borderSelected: 'border-purple-600'
          },
          yellow: {
            bg: 'bg-yellow-100 hover:bg-yellow-200',
            bgSelected: 'bg-yellow-500',
            text: 'text-yellow-700',
            textSelected: 'text-white',
            border: 'border-yellow-300',
            borderSelected: 'border-yellow-600'
          },
          pink: {
            bg: 'bg-pink-100 hover:bg-pink-200',
            bgSelected: 'bg-pink-500',
            text: 'text-pink-700',
            textSelected: 'text-white',
            border: 'border-pink-300',
            borderSelected: 'border-pink-600'
          },
          green: {
            bg: 'bg-green-100 hover:bg-green-200',
            bgSelected: 'bg-green-500',
            text: 'text-green-700',
            textSelected: 'text-white',
            border: 'border-green-300',
            borderSelected: 'border-green-600'
          },
          blue: {
            bg: 'bg-blue-100 hover:bg-blue-200',
            bgSelected: 'bg-blue-500',
            text: 'text-blue-700',
            textSelected: 'text-white',
            border: 'border-blue-300',
            borderSelected: 'border-blue-600'
          },
          orange: {
            bg: 'bg-orange-100 hover:bg-orange-200',
            bgSelected: 'bg-orange-500',
            text: 'text-orange-700',
            textSelected: 'text-white',
            border: 'border-orange-300',
            borderSelected: 'border-orange-600'
          },
          red: {
            bg: 'bg-red-100 hover:bg-red-200',
            bgSelected: 'bg-red-500',
            text: 'text-red-700',
            textSelected: 'text-white',
            border: 'border-red-300',
            borderSelected: 'border-red-600'
          },
          gray: {
            bg: 'bg-gray-100 hover:bg-gray-200',
            bgSelected: 'bg-gray-600',
            text: 'text-gray-700',
            textSelected: 'text-white',
            border: 'border-gray-300',
            borderSelected: 'border-gray-600'
          }
        }[category.color] || colorClasses.gray
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryToggle(category.id)}
            className={cn(
              "group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl",
              "border-2 transition-all duration-200 transform",
              "hover:scale-105 hover:shadow-md",
              isSelected ? [
                colorClasses.bgSelected,
                colorClasses.textSelected,
                colorClasses.borderSelected,
                "shadow-lg"
              ] : [
                colorClasses.bg,
                colorClasses.text,
                colorClasses.border,
                "bg-white"
              ]
            )}
          >
            {/* Icon with animation */}
            <Icon className={cn(
              "h-4 w-4 transition-transform",
              isSelected && "scale-110"
            )} />
            
            {/* Category label */}
            <span className="font-medium text-sm">
              {category.label}
            </span>
            
            {/* Count badge */}
            {showCounts && count > 0 && (
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className={cn(
                  "ml-1 h-5 px-1.5 text-xs font-normal",
                  isSelected ? "bg-white/20 text-white border-white/30" : ""
                )}
              >
                {count}
              </Badge>
            )}
            
            {/* Selected checkmark */}
            {isSelected && category.id !== 'all' && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center">
                <Check className="h-3 w-3 text-green-500" />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}