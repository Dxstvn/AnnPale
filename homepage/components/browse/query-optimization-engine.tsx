"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Brain,
  Search,
  Sparkles,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Settings,
  Code,
  Database,
  Globe,
  FileText,
  Zap,
  Eye,
  ChevronRight,
  ArrowRight,
  Hash,
  Type,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { toast } from "sonner"

// Query optimization types
export interface OptimizedQuery {
  original: string
  optimized: string
  modifications: QueryModification[]
  confidence: number
  expectedImprovement: number
}

export interface QueryModification {
  type: "spell_correction" | "synonym_expansion" | "entity_recognition" | 
        "intent_clarification" | "query_expansion" | "stop_word_removal" |
        "stemming" | "fuzzy_matching" | "language_detection"
  original: string
  modified: string
  reason: string
  impact: "high" | "medium" | "low"
}

// Synonym dictionary
export interface SynonymSet {
  id: string
  terms: string[]
  category: string
  weight: number
}

// Entity types
export interface RecognizedEntity {
  text: string
  type: "person" | "location" | "category" | "price" | "date" | "feature"
  value: any
  confidence: number
  position: [number, number]
}

// Index optimization
export interface IndexConfiguration {
  fields: IndexField[]
  fuzzyMatchingEnabled: boolean
  synonymsEnabled: boolean
  stemmingEnabled: boolean
  geographicSearchEnabled: boolean
  facetedSearchEnabled: boolean
}

export interface IndexField {
  name: string
  type: "text" | "keyword" | "numeric" | "date" | "geo_point"
  weight: number
  searchable: boolean
  facetable: boolean
  sortable: boolean
  analyzer?: string
}

interface QueryOptimizationEngineProps {
  query?: string
  onOptimize?: (optimized: OptimizedQuery) => void
  onIndexUpdate?: (config: IndexConfiguration) => void
  showDebugInfo?: boolean
  enableAutoOptimization?: boolean
  className?: string
}

// Default synonym dictionary
const DEFAULT_SYNONYMS: SynonymSet[] = [
  {
    id: "music",
    terms: ["musician", "singer", "artist", "performer", "band", "vocalist"],
    category: "musicians",
    weight: 1.0
  },
  {
    id: "comedy",
    terms: ["comedian", "comic", "humorist", "funny", "hilarious", "jokes"],
    category: "comedians",
    weight: 1.0
  },
  {
    id: "cheap",
    terms: ["cheap", "affordable", "budget", "inexpensive", "economical", "low-cost"],
    category: "price",
    weight: 0.8
  },
  {
    id: "quick",
    terms: ["quick", "fast", "rapid", "immediate", "instant", "urgent", "asap"],
    category: "availability",
    weight: 0.9
  },
  {
    id: "haitian",
    terms: ["haitian", "ayisyen", "haiti", "creole", "kreyol", "caribbean"],
    category: "culture",
    weight: 1.0
  }
]

// Common misspellings dictionary
const SPELL_CORRECTIONS: Record<string, string> = {
  "commedian": "comedian",
  "muscian": "musician",
  "singger": "singer",
  "birtday": "birthday",
  "weding": "wedding",
  "aniversary": "anniversary",
  "congradulations": "congratulations",
  "availible": "available",
  "reccomend": "recommend",
  "definately": "definitely"
}

// Stop words to remove
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "about", "as", "is", "was", "are", "were"
])

export function QueryOptimizationEngine({
  query = "",
  onOptimize,
  onIndexUpdate,
  showDebugInfo = false,
  enableAutoOptimization = true,
  className
}: QueryOptimizationEngineProps) {
  const [optimizedQuery, setOptimizedQuery] = React.useState<OptimizedQuery | null>(null)
  const [entities, setEntities] = React.useState<RecognizedEntity[]>([])
  const [synonymSets, setSynonymSets] = React.useState<SynonymSet[]>(DEFAULT_SYNONYMS)
  const [indexConfig, setIndexConfig] = React.useState<IndexConfiguration>({
    fields: [
      { name: "name", type: "text", weight: 2.0, searchable: true, facetable: false, sortable: true },
      { name: "category", type: "keyword", weight: 1.5, searchable: true, facetable: true, sortable: true },
      { name: "bio", type: "text", weight: 1.0, searchable: true, facetable: false, sortable: false },
      { name: "price", type: "numeric", weight: 0.8, searchable: false, facetable: true, sortable: true },
      { name: "location", type: "geo_point", weight: 0.5, searchable: false, facetable: true, sortable: false },
      { name: "languages", type: "keyword", weight: 1.2, searchable: true, facetable: true, sortable: false }
    ],
    fuzzyMatchingEnabled: true,
    synonymsEnabled: true,
    stemmingEnabled: true,
    geographicSearchEnabled: true,
    facetedSearchEnabled: true
  })
  const [isOptimizing, setIsOptimizing] = React.useState(false)

  // Optimize query
  const optimizeQuery = React.useCallback(async (inputQuery: string) => {
    if (!inputQuery.trim()) return

    setIsOptimizing(true)
    const modifications: QueryModification[] = []
    let processedQuery = inputQuery.toLowerCase()

    // 1. Spell correction
    const words = processedQuery.split(/\s+/)
    const correctedWords = words.map(word => {
      if (SPELL_CORRECTIONS[word]) {
        modifications.push({
          type: "spell_correction",
          original: word,
          modified: SPELL_CORRECTIONS[word],
          reason: `Corrected spelling: "${word}" → "${SPELL_CORRECTIONS[word]}"`,
          impact: "high"
        })
        return SPELL_CORRECTIONS[word]
      }
      return word
    })
    processedQuery = correctedWords.join(" ")

    // 2. Entity recognition
    const recognizedEntities: RecognizedEntity[] = []

    // Detect price entities
    const priceMatch = processedQuery.match(/\$?(\d+)(?:\s*-\s*\$?(\d+))?|\bunder\s+\$?(\d+)|\bbelow\s+\$?(\d+)/)
    if (priceMatch) {
      const entity: RecognizedEntity = {
        text: priceMatch[0],
        type: "price",
        value: priceMatch[1] ? { min: 0, max: parseInt(priceMatch[1]) } : null,
        confidence: 0.9,
        position: [priceMatch.index!, priceMatch.index! + priceMatch[0].length]
      }
      recognizedEntities.push(entity)
      modifications.push({
        type: "entity_recognition",
        original: priceMatch[0],
        modified: `price:${priceMatch[1]}`,
        reason: "Recognized price entity",
        impact: "high"
      })
    }

    // Detect category entities
    const categories = ["musicians", "singers", "comedians", "actors", "djs"]
    categories.forEach(category => {
      if (processedQuery.includes(category) || processedQuery.includes(category.slice(0, -1))) {
        recognizedEntities.push({
          text: category,
          type: "category",
          value: category,
          confidence: 0.95,
          position: [0, category.length]
        })
        modifications.push({
          type: "entity_recognition",
          original: category,
          modified: `category:${category}`,
          reason: "Recognized category entity",
          impact: "high"
        })
      }
    })

    // Detect date/time entities
    const timePatterns = ["today", "tomorrow", "this week", "next week", "tonight", "weekend"]
    timePatterns.forEach(pattern => {
      if (processedQuery.includes(pattern)) {
        recognizedEntities.push({
          text: pattern,
          type: "date",
          value: pattern,
          confidence: 0.85,
          position: [processedQuery.indexOf(pattern), processedQuery.indexOf(pattern) + pattern.length]
        })
        modifications.push({
          type: "entity_recognition",
          original: pattern,
          modified: `availability:${pattern.replace(/\s+/g, "_")}`,
          reason: "Recognized time entity",
          impact: "medium"
        })
      }
    })

    setEntities(recognizedEntities)

    // 3. Synonym expansion
    const expandedTerms = new Set<string>()
    words.forEach(word => {
      expandedTerms.add(word)
      synonymSets.forEach(set => {
        if (set.terms.some(term => term === word)) {
          set.terms.forEach(synonym => {
            if (synonym !== word) {
              expandedTerms.add(synonym)
            }
          })
          modifications.push({
            type: "synonym_expansion",
            original: word,
            modified: set.terms.join(" OR "),
            reason: `Expanded with synonyms: ${set.terms.join(", ")}`,
            impact: "medium"
          })
        }
      })
    })

    // 4. Stop word removal
    const significantWords = correctedWords.filter(word => !STOP_WORDS.has(word))
    if (significantWords.length < correctedWords.length) {
      modifications.push({
        type: "stop_word_removal",
        original: correctedWords.join(" "),
        modified: significantWords.join(" "),
        reason: "Removed common stop words",
        impact: "low"
      })
    }

    // 5. Query expansion based on intent
    if (processedQuery.includes("birthday") || processedQuery.includes("anniversary")) {
      modifications.push({
        type: "query_expansion",
        original: processedQuery,
        modified: `${processedQuery} celebration special occasion`,
        reason: "Expanded query with related terms",
        impact: "medium"
      })
    }

    // 6. Language detection
    const kreyolWords = ["ayisyen", "konpa", "kompa", "zouk", "rara"]
    const hasKreyol = kreyolWords.some(word => processedQuery.includes(word))
    if (hasKreyol) {
      modifications.push({
        type: "language_detection",
        original: processedQuery,
        modified: `${processedQuery} [lang:kreyol]`,
        reason: "Detected Haitian Creole terms",
        impact: "medium"
      })
    }

    // Build final optimized query
    const finalQuery = Array.from(expandedTerms).join(" OR ")

    const optimized: OptimizedQuery = {
      original: inputQuery,
      optimized: finalQuery,
      modifications,
      confidence: 0.85,
      expectedImprovement: modifications.length * 10 // Rough estimate
    }

    setOptimizedQuery(optimized)
    onOptimize?.(optimized)
    setIsOptimizing(false)

    if (modifications.length > 0) {
      toast.success(`Query optimized with ${modifications.length} improvements`)
    }
  }, [synonymSets, onOptimize])

  // Auto-optimize on query change
  React.useEffect(() => {
    if (enableAutoOptimization && query) {
      const timer = setTimeout(() => {
        optimizeQuery(query)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [query, enableAutoOptimization, optimizeQuery])

  // Update index configuration
  const updateIndexConfig = React.useCallback((updates: Partial<IndexConfiguration>) => {
    const newConfig = { ...indexConfig, ...updates }
    setIndexConfig(newConfig)
    onIndexUpdate?.(newConfig)
    toast.success("Index configuration updated")
  }, [indexConfig, onIndexUpdate])

  // Add custom synonym set
  const addSynonymSet = React.useCallback((terms: string[], category: string) => {
    const newSet: SynonymSet = {
      id: `custom_${Date.now()}`,
      terms,
      category,
      weight: 0.8
    }
    setSynonymSets(prev => [...prev, newSet])
    toast.success("Synonym set added")
  }, [])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl">Query Optimization Engine</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Intelligent query understanding and optimization
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {enableAutoOptimization ? "Auto" : "Manual"}
              </Badge>
              {isOptimizing && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Test Query Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a search query to optimize..."
              value={query}
              className="flex-1"
            />
            <Button
              onClick={() => optimizeQuery(query)}
              disabled={!query || isOptimizing}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </div>

          {optimizedQuery && (
            <div className="mt-4 space-y-3">
              {/* Original vs Optimized */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Original Query</p>
                  <p className="font-mono text-sm">{optimizedQuery.original}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-purple-600 mb-1">Optimized Query</p>
                  <p className="font-mono text-sm">{optimizedQuery.optimized}</p>
                </div>
              </div>

              {/* Confidence and Improvement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      Confidence: {(optimizedQuery.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Expected Improvement: +{optimizedQuery.expectedImprovement}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modifications */}
      {optimizedQuery && optimizedQuery.modifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Query Modifications ({optimizedQuery.modifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizedQuery.modifications.map((mod, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    mod.impact === "high" && "bg-red-100 dark:bg-red-900/30",
                    mod.impact === "medium" && "bg-yellow-100 dark:bg-yellow-900/30",
                    mod.impact === "low" && "bg-blue-100 dark:bg-blue-900/30"
                  )}>
                    {mod.type === "spell_correction" && <Type className="h-4 w-4" />}
                    {mod.type === "synonym_expansion" && <Hash className="h-4 w-4" />}
                    {mod.type === "entity_recognition" && <Target className="h-4 w-4" />}
                    {mod.type === "query_expansion" && <Sparkles className="h-4 w-4" />}
                    {mod.type === "stop_word_removal" && <X className="h-4 w-4" />}
                    {mod.type === "language_detection" && <Globe className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {mod.type.replace(/_/g, " ")}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          mod.impact === "high" && "bg-red-100 text-red-700",
                          mod.impact === "medium" && "bg-yellow-100 text-yellow-700",
                          mod.impact === "low" && "bg-blue-100 text-blue-700"
                        )}
                      >
                        {mod.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm">{mod.reason}</p>
                    {showDebugInfo && (
                      <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs font-mono">
                        <span className="text-gray-500">{mod.original}</span>
                        <ArrowRight className="h-3 w-3 inline mx-2" />
                        <span className="text-purple-600">{mod.modified}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recognized Entities */}
      {entities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recognized Entities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {entities.map((entity, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="py-1.5 px-3"
                >
                  <span className="font-medium">{entity.text}</span>
                  <span className="ml-2 opacity-60">
                    {entity.type} ({(entity.confidence * 100).toFixed(0)}%)
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Index Configuration */}
      <Tabs defaultValue="fields" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fields">Index Fields</TabsTrigger>
          <TabsTrigger value="features">Search Features</TabsTrigger>
          <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
        </TabsList>

        {/* Index Fields */}
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Index Field Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Searchable</TableHead>
                    <TableHead>Facetable</TableHead>
                    <TableHead>Sortable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {indexConfig.fields.map((field, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {field.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{field.weight.toFixed(1)}</TableCell>
                      <TableCell>
                        {field.searchable && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </TableCell>
                      <TableCell>
                        {field.facetable && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </TableCell>
                      <TableCell>
                        {field.sortable && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Features */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Search Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { key: "fuzzyMatchingEnabled", label: "Fuzzy Matching", icon: <Zap /> },
                  { key: "synonymsEnabled", label: "Synonym Expansion", icon: <Hash /> },
                  { key: "stemmingEnabled", label: "Word Stemming", icon: <Type /> },
                  { key: "geographicSearchEnabled", label: "Geographic Search", icon: <MapPin /> },
                  { key: "facetedSearchEnabled", label: "Faceted Search", icon: <Filter /> }
                ].map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <p className="font-medium">{feature.label}</p>
                        <p className="text-xs text-gray-600">
                          {indexConfig[feature.key as keyof IndexConfiguration] ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={indexConfig[feature.key as keyof IndexConfiguration] as boolean}
                      onCheckedChange={(checked) => {
                        updateIndexConfig({ [feature.key]: checked })
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Synonyms */}
        <TabsContent value="synonyms">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Synonym Dictionary</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Set
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {synonymSets.map((set) => (
                  <div
                    key={set.id}
                    className="p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{set.category}</Badge>
                      <span className="text-xs text-gray-500">
                        Weight: {set.weight.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {set.terms.map((term, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export optimization utilities
export const QueryOptimizationUtils = {
  spellCorrect: (word: string): string => {
    return SPELL_CORRECTIONS[word.toLowerCase()] || word
  },

  removeStopWords: (query: string): string => {
    return query
      .split(/\s+/)
      .filter(word => !STOP_WORDS.has(word.toLowerCase()))
      .join(" ")
  },

  expandSynonyms: (query: string, synonyms: SynonymSet[]): string => {
    const words = query.toLowerCase().split(/\s+/)
    const expanded = new Set<string>()
    
    words.forEach(word => {
      expanded.add(word)
      synonyms.forEach(set => {
        if (set.terms.includes(word)) {
          set.terms.forEach(synonym => expanded.add(synonym))
        }
      })
    })
    
    return Array.from(expanded).join(" OR ")
  }
}