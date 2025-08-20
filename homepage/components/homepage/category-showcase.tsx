"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { 
  Music, 
  Mic, 
  Film, 
  Users, 
  Trophy,
  Palette,
  Radio,
  Heart,
  Briefcase,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations/index"

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  count: number
  description: string
  featured?: {
    name: string
    image: string
  }
}

interface CategoryShowcaseProps {
  categories?: Category[]
  variant?: "grid" | "carousel" | "compact"
  showDescription?: boolean
  className?: string
}

// Base category data (language-agnostic)
const baseCategoryData = [
  {
    id: "music",
    icon: <Music className="h-6 w-6" />,
    color: "bg-purple-500",
    count: 125,
    featured: {
      name: "Wyclef Jean",
      image: "/images/wyclef-jean.png"
    }
  },
  {
    id: "comedy",
    icon: <Mic className="h-6 w-6" />,
    color: "bg-pink-500",
    count: 87,
    featured: {
      name: "Ti Jo Zenny",
      image: "/images/ti-jo-zenny.jpg"
    }
  },
  {
    id: "actors",
    icon: <Film className="h-6 w-6" />,
    color: "bg-blue-500",
    count: 62,
    featured: {
      name: "Jimmy Jean-Louis",
      image: "/images/jimmy-jean-louis.jpg"
    }
  },
  {
    id: "sports",
    icon: <Trophy className="h-6 w-6" />,
    color: "bg-green-500",
    count: 45,
    featured: {
      name: "Samuel Dalembert",
      image: "/images/samuel-dalembert.jpg"
    }
  },
  {
    id: "influencers",
    icon: <Users className="h-6 w-6" />,
    color: "bg-orange-500",
    count: 156
  },
  {
    id: "artists",
    icon: <Palette className="h-6 w-6" />,
    color: "bg-indigo-500",
    count: 38
  },
  {
    id: "radio",
    icon: <Radio className="h-6 w-6" />,
    color: "bg-red-500",
    count: 29
  },
  {
    id: "activists",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-teal-500",
    count: 24
  }
]

// Create translated categories
function createTranslatedCategories(language: any): Category[] {
  return baseCategoryData.map(category => ({
    ...category,
    name: getTranslation(`home.categories.${category.id}`, language),
    description: getTranslation(`home.categories.${category.id}Desc`, language)
  }))
}

// Single Category Card
function CategoryCard({ 
  category, 
  showDescription = true 
}: { 
  category: Category
  showDescription?: boolean 
}) {
  return (
    <Link href={`/category/${category.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <div className="group cursor-pointer hover:shadow-lg transition-all h-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform",
            category.color
          )}>
            {category.icon}
          </div>

          {/* Name & Count */}
          <h3 className="font-semibold text-lg mb-1 text-gray-900 group-hover:text-purple-600 transition-colors">
            {category.name}
          </h3>
          
          {showDescription && (
            <p className="text-sm text-gray-600 mb-3">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white text-gray-700 border-gray-200">
              {category.count} creators
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Featured Creator Preview */}
          {category.featured && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <img
                  src={category.featured.image}
                  alt={category.featured.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-xs text-gray-600">
                  feat. {category.featured.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

// Compact Category Card
function CompactCategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white",
          category.color
        )}>
          {category.icon}
        </div>
        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{category.name}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{category.count}</p>
      </motion.div>
    </Link>
  )
}

// Category Showcase Component
export function CategoryShowcase({
  categories,
  variant = "grid",
  showDescription = true,
  className
}: CategoryShowcaseProps) {
  const { language } = useLanguage()
  
  // Use translated categories if none provided
  const displayCategories = categories || createTranslatedCategories(language)
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (variant === "compact") {
    return (
      <div className={cn("grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2", className)}>
        {displayCategories.map((category) => (
          <CompactCategoryCard key={category.id} category={category} />
        ))}
      </div>
    )
  }

  if (variant === "carousel") {
    return (
      <div className={cn("overflow-x-auto pb-4", className)}>
        <div className="flex gap-4 min-w-min">
          {displayCategories.map((category) => (
            <div key={category.id} className="w-64 flex-shrink-0">
              <CategoryCard category={category} showDescription={showDescription} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {displayCategories.map((category) => (
        <motion.div key={category.id} variants={item}>
          <CategoryCard category={category} showDescription={showDescription} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default CategoryShowcase
