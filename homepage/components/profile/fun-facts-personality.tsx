"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Heart,
  Music,
  Coffee,
  Book,
  Palette,
  Gamepad2,
  Plane,
  Camera,
  Utensils,
  Mountain,
  Headphones,
  Film,
  Smile,
  Sun,
  Moon,
  Star,
  Zap,
  Gift,
  Pizza,
  Dog,
  Cat,
  TreePine,
  Beach,
  Dumbbell,
  Laugh,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Fun facts data structure
export interface FunFactsPersonalityData {
  // Fun Facts
  funFacts: Array<{
    id: string
    fact: string
    emoji?: string
    category?: "quirky" | "hobby" | "food" | "travel" | "random"
  }>
  
  // Personality Type
  personalityType?: {
    type: string // e.g., "ENFP", "Creative Soul", "Night Owl"
    description: string
    traits: string[]
  }
  
  // Favorites
  favorites?: {
    food?: string
    movie?: string
    music?: string
    book?: string
    place?: string
    season?: string
    hobby?: string
    quote?: string
  }
  
  // Quick Fire Q&A
  quickFire?: Array<{
    question: string
    answer: string
  }>
  
  // Would You Rather
  wouldYouRather?: Array<{
    optionA: string
    optionB: string
    choice: "A" | "B"
  }>
  
  // Bucket List
  bucketList?: Array<{
    item: string
    completed: boolean
  }>
}

interface FunFactsPersonalityProps {
  data: FunFactsPersonalityData
  creatorName: string
  className?: string
  variant?: "full" | "compact" | "interactive"
}

// Icon mapping for categories
const categoryIcons = {
  quirky: Sparkles,
  hobby: Heart,
  food: Utensils,
  travel: Plane,
  random: Zap
}

// Fun fact card
function FunFactCard({ 
  fact,
  index 
}: { 
  fact: FunFactsPersonalityData['funFacts'][0]
  index: number
}) {
  const Icon = fact.category ? categoryIcons[fact.category] : Star
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-green-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-green-500 to-teal-500"
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 180 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05, rotateZ: [-1, 1, -1, 0] }}
      className="relative group"
    >
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-75 blur-xl transition-all group-hover:opacity-100",
        `bg-gradient-to-r ${colors[index % colors.length]}`
      )} />
      
      <Card className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur border-0">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {fact.emoji ? (
              <span className="text-2xl">{fact.emoji}</span>
            ) : (
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                <Icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            )}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {fact.fact}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Personality type display
function PersonalityType({ 
  personality 
}: { 
  personality: NonNullable<FunFactsPersonalityData['personalityType']>
}) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Smile className="h-5 w-5 text-purple-500" />
          Personality Type
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {personality.type}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {personality.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {personality.traits.map((trait) => (
            <Badge
              key={trait}
              className="bg-purple-100 text-purple-700 dark:bg-purple-800/30 dark:text-purple-300"
            >
              {trait}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Favorites grid
function FavoritesGrid({ 
  favorites 
}: { 
  favorites: NonNullable<FunFactsPersonalityData['favorites']> 
}) {
  const items = [
    favorites.food && { icon: Pizza, label: "Favorite Food", value: favorites.food },
    favorites.movie && { icon: Film, label: "Favorite Movie", value: favorites.movie },
    favorites.music && { icon: Music, label: "Favorite Music", value: favorites.music },
    favorites.book && { icon: Book, label: "Favorite Book", value: favorites.book },
    favorites.place && { icon: Mountain, label: "Favorite Place", value: favorites.place },
    favorites.hobby && { icon: Heart, label: "Favorite Hobby", value: favorites.hobby }
  ].filter(Boolean)
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, index) => item && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-1">
            <item.icon className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {item.value}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// Quick fire Q&A
function QuickFireQA({ 
  questions 
}: { 
  questions: NonNullable<FunFactsPersonalityData['quickFire']> 
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const current = questions[currentIndex]
  
  const nextQuestion = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Fire Q&A
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextQuestion}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {current.question}
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {current.answer}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1 mt-3">
          {questions.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                index === currentIndex
                  ? "bg-purple-500"
                  : "bg-gray-200 dark:bg-gray-700"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Would you rather game
function WouldYouRather({ 
  choices 
}: { 
  choices: NonNullable<FunFactsPersonalityData['wouldYouRather']> 
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [revealed, setRevealed] = React.useState(false)
  const current = choices[currentIndex]
  
  const nextChoice = () => {
    setCurrentIndex((prev) => (prev + 1) % choices.length)
    setRevealed(false)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Laugh className="h-5 w-5 text-orange-500" />
          Would You Rather...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={revealed && current.choice === "A" ? "default" : "outline"}
            className="h-auto p-3 text-xs"
            onClick={() => setRevealed(true)}
            disabled={revealed}
          >
            {current.optionA}
          </Button>
          <Button
            variant={revealed && current.choice === "B" ? "default" : "outline"}
            className="h-auto p-3 text-xs"
            onClick={() => setRevealed(true)}
            disabled={revealed}
          >
            {current.optionB}
          </Button>
        </div>
        
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              They chose: <span className="font-semibold">Option {current.choice}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextChoice}
              className="mt-2"
            >
              Next Question
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

// Bucket list
function BucketList({ 
  items 
}: { 
  items: NonNullable<FunFactsPersonalityData['bucketList']> 
}) {
  const completed = items.filter(item => item.completed)
  const pending = items.filter(item => !item.completed)
  const completionRate = (completed.length / items.length) * 100
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-green-500" />
            Bucket List
          </span>
          <Badge variant="secondary">
            {completed.length}/{items.length} done
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {completed.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="line-through text-gray-500">{item.item}</span>
            </div>
          ))}
          {pending.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              <span className="text-gray-700 dark:text-gray-300">{item.item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main component
export function FunFactsPersonality({
  data,
  creatorName,
  className,
  variant = "full"
}: FunFactsPersonalityProps) {
  const [visibleFacts, setVisibleFacts] = React.useState(3)
  
  if (variant === "compact") {
    // Show only 3 fun facts
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Fun Facts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.funFacts.slice(0, 3).map((fact, index) => (
            <div key={fact.id} className="flex items-start gap-2">
              <span className="text-lg">{fact.emoji || "✨"}</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">{fact.fact}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
  
  if (variant === "interactive") {
    return (
      <div className={cn("space-y-6", className)}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Get to Know the Real {creatorName}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.quickFire && <QuickFireQA questions={data.quickFire} />}
          {data.wouldYouRather && <WouldYouRather choices={data.wouldYouRather} />}
          {data.bucketList && <BucketList items={data.bucketList} />}
          {data.personalityType && <PersonalityType personality={data.personalityType} />}
        </div>
      </div>
    )
  }
  
  // Full variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Fun Facts About {creatorName}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The little things that make me unique
        </p>
      </div>
      
      {/* Fun Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.funFacts.slice(0, visibleFacts).map((fact, index) => (
          <FunFactCard key={fact.id} fact={fact} index={index} />
        ))}
      </div>
      
      {visibleFacts < data.funFacts.length && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setVisibleFacts(prev => Math.min(prev + 3, data.funFacts.length))}
          >
            Show More Fun Facts
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      
      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personality Type */}
        {data.personalityType && (
          <PersonalityType personality={data.personalityType} />
        )}
        
        {/* Favorites */}
        {data.favorites && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                My Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FavoritesGrid favorites={data.favorites} />
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Interactive Elements */}
      {(data.quickFire || data.wouldYouRather || data.bucketList) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.quickFire && <QuickFireQA questions={data.quickFire} />}
          {data.wouldYouRather && <WouldYouRather choices={data.wouldYouRather} />}
          {data.bucketList && <BucketList items={data.bucketList} />}
        </div>
      )}
    </div>
  )
}

// Add missing import for Check icon
import { Check } from "lucide-react"