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
  Globe,
  Languages,
  Mic,
  Volume2,
  Search,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Translate,
  Users,
  Star,
  Clock,
  Target,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { SearchQuery, SearchLanguage } from "./search-intent-engine"

// Language-specific search patterns and translations
export interface LanguageDefinition {
  code: SearchLanguage
  name: string
  nativeName: string
  flag: string
  direction: "ltr" | "rtl"
  searchPatterns: {
    creators: RegExp[]
    categories: RegExp[]
    actions: RegExp[]
    qualifiers: RegExp[]
    questions: RegExp[]
  }
  translations: {
    common: Record<string, string>
    categories: Record<string, string>
    actions: Record<string, string>
    placeholders: string[]
  }
  culturalContext: {
    formalityLevel: "formal" | "informal" | "mixed"
    commonGreetings: string[]
    culturalTerms: Record<string, string>
  }
}

export interface MultiLanguageQuery {
  original: string
  detected_language: SearchLanguage
  confidence: number
  translations: Partial<Record<SearchLanguage, string>>
  culturalAdaptations: string[]
  suggestedClarifications: string[]
  crossLingualSuggestions: string[]
}

export interface LanguageSearchResult {
  creators: any[]
  totalResults: number
  languageSpecificResults: number
  crossLanguageResults: number
  translationQuality: number
  culturalRelevance: number
  suggestions: string[]
}

interface MultiLanguageSearchProps {
  onLanguageDetected?: (language: SearchLanguage, confidence: number) => void
  onSearch?: (query: MultiLanguageQuery, results: LanguageSearchResult) => void
  enableTranslation?: boolean
  enableCulturalAdaptation?: boolean
  defaultLanguage?: SearchLanguage
  className?: string
}

// Language definitions with comprehensive patterns and cultural context
const LANGUAGE_DEFINITIONS: Record<SearchLanguage, LanguageDefinition> = {
  english: {
    code: "english",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    direction: "ltr",
    searchPatterns: {
      creators: [
        /musician|singer|artist|performer|entertainer/i,
        /comedian|actor|celebrity|star|influencer/i
      ],
      categories: [
        /music|song|concert|performance|show/i,
        /comedy|funny|humor|joke|laugh/i,
        /movie|film|acting|drama|theater/i
      ],
      actions: [
        /book|hire|order|get|buy|purchase/i,
        /find|search|look|browse|discover/i,
        /message|video|greeting|shoutout/i
      ],
      qualifiers: [
        /best|top|good|great|amazing|awesome/i,
        /cheap|affordable|expensive|premium|budget/i,
        /fast|quick|slow|urgent|asap/i
      ],
      questions: [
        /how|what|where|when|why|who|which/i,
        /can|could|would|should|will/i
      ]
    },
    translations: {
      common: {
        "search": "search",
        "find": "find",
        "book": "book",
        "message": "message",
        "video": "video",
        "creator": "creator",
        "artist": "artist",
        "price": "price",
        "rating": "rating"
      },
      categories: {
        "musician": "musician",
        "singer": "singer",
        "comedian": "comedian",
        "actor": "actor"
      },
      actions: {
        "book": "book now",
        "search": "search for",
        "find": "find"
      },
      placeholders: [
        "Search for Haitian creators...",
        "Find musicians, comedians, actors...",
        "Book a personalized video message",
        "Search by name, category, or style"
      ]
    },
    culturalContext: {
      formalityLevel: "mixed",
      commonGreetings: ["hello", "hi", "hey"],
      culturalTerms: {
        "haitian": "Haitian",
        "diaspora": "diaspora",
        "caribbean": "Caribbean"
      }
    }
  },
  
  french: {
    code: "french",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    direction: "ltr",
    searchPatterns: {
      creators: [
        /musicien|chanteur|chanteuse|artiste|interprète/i,
        /comédien|comédienne|acteur|actrice|célébrité/i
      ],
      categories: [
        /musique|chanson|concert|spectacle|show/i,
        /comédie|drôle|humour|blague|rire/i,
        /film|cinéma|théâtre|drame/i
      ],
      actions: [
        /réserver|engager|commander|acheter|obtenir/i,
        /trouver|chercher|rechercher|parcourir|découvrir/i,
        /message|vidéo|salutation|dédicace/i
      ],
      qualifiers: [
        /meilleur|bon|excellent|formidable|génial/i,
        /pas cher|abordable|cher|premium|budget/i,
        /rapide|vite|lent|urgent|immédiat/i
      ],
      questions: [
        /comment|quoi|où|quand|pourquoi|qui|quel/i,
        /peut|pourrait|devrait|va|vais/i
      ]
    },
    translations: {
      common: {
        "search": "rechercher",
        "find": "trouver",
        "book": "réserver",
        "message": "message",
        "video": "vidéo",
        "creator": "créateur",
        "artist": "artiste",
        "price": "prix",
        "rating": "note"
      },
      categories: {
        "musician": "musicien",
        "singer": "chanteur",
        "comedian": "comédien",
        "actor": "acteur"
      },
      actions: {
        "book": "réserver maintenant",
        "search": "rechercher",
        "find": "trouver"
      },
      placeholders: [
        "Rechercher des créateurs haïtiens...",
        "Trouver musiciens, comédiens, acteurs...",
        "Réserver un message vidéo personnalisé",
        "Rechercher par nom, catégorie ou style"
      ]
    },
    culturalContext: {
      formalityLevel: "formal",
      commonGreetings: ["bonjour", "salut", "bonsoir"],
      culturalTerms: {
        "haitian": "haïtien",
        "diaspora": "diaspora",
        "caribbean": "caraïbes",
        "francophone": "francophone"
      }
    }
  },
  
  kreyol: {
    code: "kreyol",
    name: "Haitian Creole",
    nativeName: "Kreyòl Ayisyen",
    flag: "🇭🇹",
    direction: "ltr",
    searchPatterns: {
      creators: [
        /mizisyen|chantè|atis|aktè|kominikè/i,
        /komèdyen|aktris|vedèt|kowòl/i
      ],
      categories: [
        /mizik|chante|konsè|spektak|sho/i,
        /komedi|gag|plèzi|ri|amizman/i,
        /fim|sinema|teyat|dram/i
      ],
      actions: [
        /mande|pran|achte|jwenn|chèche/i,
        /gade|wè|dekouvri|eksplore/i,
        /mesaj|videyo|salitasyon|mo/i
      ],
      qualifiers: [
        /pi bon|bon|bèl|djòl|pi djòl/i,
        /pa chè|chè|bon mache|prè/i,
        /vit|rapidman|dousman|ijan/i
      ],
      questions: [
        /ki jan|kisa|ki kote|kilè|poukisa|kimoun/i,
        /èske|ka|ta ka|dwe|ap/i
      ]
    },
    translations: {
      common: {
        "search": "chèche",
        "find": "jwenn",
        "book": "rezerve",
        "message": "mesaj",
        "video": "videyo",
        "creator": "kreyatè",
        "artist": "atis",
        "price": "pri",
        "rating": "nòt"
      },
      categories: {
        "musician": "mizisyen",
        "singer": "chantè",
        "comedian": "komèdyen",
        "actor": "aktè"
      },
      actions: {
        "book": "rezerve koulye a",
        "search": "chèche",
        "find": "jwenn"
      },
      placeholders: [
        "Chèche kreyatè ayisyen yo...",
        "Jwenn mizisyen, komèdyen, aktè...",
        "Rezerve yon mesaj videyo pèsonèl",
        "Chèche pa non, kategori, oswa stil"
      ]
    },
    culturalContext: {
      formalityLevel: "informal",
      commonGreetings: ["bonjou", "bonswa", "sak pase"],
      culturalTerms: {
        "haitian": "ayisyen",
        "diaspora": "dyaspora",
        "caribbean": "karayib",
        "vodou": "vodou",
        "kompa": "kompa",
        "rara": "rara"
      }
    }
  },
  
  mixed: {
    code: "mixed",
    name: "Mixed Languages",
    nativeName: "Langaj Melanje",
    flag: "🌍",
    direction: "ltr",
    searchPatterns: {
      creators: [/\w+/i],
      categories: [/\w+/i],
      actions: [/\w+/i],
      qualifiers: [/\w+/i],
      questions: [/\w+/i]
    },
    translations: {
      common: {},
      categories: {},
      actions: {},
      placeholders: ["Search in any language..."]
    },
    culturalContext: {
      formalityLevel: "mixed",
      commonGreetings: [],
      culturalTerms: {}
    }
  },
  
  unknown: {
    code: "unknown",
    name: "Unknown",
    nativeName: "Unknown",
    flag: "❓",
    direction: "ltr",
    searchPatterns: {
      creators: [/\w+/i],
      categories: [/\w+/i],
      actions: [/\w+/i],
      qualifiers: [/\w+/i],
      questions: [/\w+/i]
    },
    translations: {
      common: {},
      categories: {},
      actions: {},
      placeholders: ["Search..."]
    },
    culturalContext: {
      formalityLevel: "mixed",
      commonGreetings: [],
      culturalTerms: {}
    }
  }
}

export function MultiLanguageSearch({
  onLanguageDetected,
  onSearch,
  enableTranslation = true,
  enableCulturalAdaptation = true,
  defaultLanguage = "english",
  className
}: MultiLanguageSearchProps) {
  const [query, setQuery] = React.useState("")
  const [detectedLanguage, setDetectedLanguage] = React.useState<SearchLanguage>(defaultLanguage)
  const [confidence, setConfidence] = React.useState(0)
  const [selectedLanguage, setSelectedLanguage] = React.useState<SearchLanguage>(defaultLanguage)
  const [showTranslations, setShowTranslations] = React.useState(false)
  const [multiLangQuery, setMultiLangQuery] = React.useState<MultiLanguageQuery | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  // Detect language from input text
  const detectLanguage = React.useCallback((text: string): { language: SearchLanguage; confidence: number } => {
    if (!text.trim()) return { language: defaultLanguage, confidence: 0 }

    const scores: Record<SearchLanguage, number> = {
      english: 0,
      french: 0,
      kreyol: 0,
      mixed: 0,
      unknown: 0
    }

    // Check against language patterns
    Object.entries(LANGUAGE_DEFINITIONS).forEach(([lang, def]) => {
      if (lang === "mixed" || lang === "unknown") return

      Object.values(def.searchPatterns).forEach(patterns => {
        patterns.forEach(pattern => {
          if (pattern.test(text)) {
            scores[lang as SearchLanguage] += 1
          }
        })
      })

      // Check common words
      Object.values(def.translations.common).forEach(word => {
        if (text.toLowerCase().includes(word.toLowerCase())) {
          scores[lang as SearchLanguage] += 0.5
        }
      })

      // Check cultural terms
      Object.values(def.culturalContext.culturalTerms).forEach(term => {
        if (text.toLowerCase().includes(term.toLowerCase())) {
          scores[lang as SearchLanguage] += 1.5
        }
      })
    })

    const maxScore = Math.max(...Object.values(scores))
    if (maxScore === 0) return { language: "unknown", confidence: 0 }

    const languages = Object.keys(scores) as SearchLanguage[]
    const detectedLang = languages.find(lang => scores[lang] === maxScore) || "unknown"
    
    // Check for mixed language
    const nonZeroLangs = languages.filter(lang => scores[lang] > 0)
    if (nonZeroLangs.length > 1) {
      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
      if (maxScore / totalScore < 0.6) {
        return { language: "mixed", confidence: 0.7 }
      }
    }

    const confidenceScore = Math.min(0.95, maxScore / text.split(" ").length + 0.3)
    return { language: detectedLang, confidence: confidenceScore }
  }, [defaultLanguage])

  // Generate translations for query
  const generateTranslations = React.useCallback((text: string, sourceLang: SearchLanguage): Partial<Record<SearchLanguage, string>> => {
    const translations: Partial<Record<SearchLanguage, string>> = {}
    
    if (!enableTranslation) return translations

    // Simple word-by-word translation mapping
    const sourceWords = text.toLowerCase().split(/\s+/)
    const sourceDef = LANGUAGE_DEFINITIONS[sourceLang]

    Object.entries(LANGUAGE_DEFINITIONS).forEach(([targetLang, targetDef]) => {
      if (targetLang === sourceLang || targetLang === "mixed" || targetLang === "unknown") return

      let translatedWords: string[] = []
      
      sourceWords.forEach(word => {
        // Find translation in common words
        const sourceToTarget = Object.entries(sourceDef.translations.common).find(([_, value]) => 
          value.toLowerCase() === word
        )
        
        if (sourceToTarget) {
          const translatedWord = targetDef.translations.common[sourceToTarget[0]]
          if (translatedWord) {
            translatedWords.push(translatedWord)
            return
          }
        }

        // Check categories
        const categoryTranslation = Object.entries(sourceDef.translations.categories).find(([_, value]) => 
          value.toLowerCase() === word
        )
        
        if (categoryTranslation) {
          const translatedCategory = targetDef.translations.categories[categoryTranslation[0]]
          if (translatedCategory) {
            translatedWords.push(translatedCategory)
            return
          }
        }

        // Keep original word if no translation found
        translatedWords.push(word)
      })

      translations[targetLang as SearchLanguage] = translatedWords.join(" ")
    })

    return translations
  }, [enableTranslation])

  // Generate cultural adaptations
  const generateCulturalAdaptations = React.useCallback((text: string, language: SearchLanguage): string[] => {
    if (!enableCulturalAdaptation) return []

    const adaptations: string[] = []
    const langDef = LANGUAGE_DEFINITIONS[language]

    // Add cultural context suggestions
    if (language === "kreyol") {
      if (text.includes("music") || text.includes("mizik")) {
        adaptations.push("Try: kompa, zouk, rara artists")
      }
      if (text.includes("comedy") || text.includes("komedi")) {
        adaptations.push("Try: Haitian comedians, carnival performers")
      }
    }

    if (language === "french") {
      adaptations.push("Consider: francophone Caribbean artists")
      if (text.includes("music")) {
        adaptations.push("Try: chanson française, zouk, Caribbean French")
      }
    }

    if (language === "english") {
      adaptations.push("Consider: Haitian-American artists")
      adaptations.push("Try: diaspora creators, Caribbean music")
    }

    return adaptations
  }, [enableCulturalAdaptation])

  // Analyze query and generate multi-language response
  const analyzeQuery = React.useCallback(async (text: string) => {
    if (!text.trim()) return

    setIsAnalyzing(true)

    try {
      const detection = detectLanguage(text)
      setDetectedLanguage(detection.language)
      setConfidence(detection.confidence)
      onLanguageDetected?.(detection.language, detection.confidence)

      const translations = generateTranslations(text, detection.language)
      const culturalAdaptations = generateCulturalAdaptations(text, detection.language)

      const multiLangQuery: MultiLanguageQuery = {
        original: text,
        detected_language: detection.language,
        confidence: detection.confidence,
        translations,
        culturalAdaptations,
        suggestedClarifications: [
          "Try using specific creator names",
          "Add price range or category",
          "Specify language preference"
        ],
        crossLingualSuggestions: [
          "Search in Kreyòl: " + (translations.kreyol || text),
          "Search in French: " + (translations.french || text),
          "Search in English: " + (translations.english || text)
        ].filter(s => !s.endsWith(text))
      }

      setMultiLangQuery(multiLangQuery)

      // Simulate search results
      const mockResults: LanguageSearchResult = {
        creators: [],
        totalResults: Math.floor(Math.random() * 50) + 10,
        languageSpecificResults: Math.floor(Math.random() * 30) + 5,
        crossLanguageResults: Math.floor(Math.random() * 20) + 2,
        translationQuality: detection.confidence,
        culturalRelevance: detection.language === "kreyol" ? 0.9 : 0.7,
        suggestions: culturalAdaptations
      }

      onSearch?.(multiLangQuery, mockResults)
      
    } finally {
      setIsAnalyzing(false)
    }
  }, [detectLanguage, generateTranslations, generateCulturalAdaptations, onLanguageDetected, onSearch])

  // Handle input change with debounced analysis
  const handleInputChange = (value: string) => {
    setQuery(value)
    
    // Debounce language detection
    const timeoutId = setTimeout(() => {
      if (value.length > 2) {
        analyzeQuery(value)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  // Get current language definition
  const currentLangDef = LANGUAGE_DEFINITIONS[selectedLanguage] || LANGUAGE_DEFINITIONS.english

  return (
    <div className={cn("space-y-4", className)}>
      {/* Multi-language Search Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Multi-Language Search
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{LANGUAGE_DEFINITIONS[selectedLanguage]?.flag}</span>
                      <span>{LANGUAGE_DEFINITIONS[selectedLanguage]?.name}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LANGUAGE_DEFINITIONS).map(([code, def]) => (
                    code !== "mixed" && code !== "unknown" && (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{def.flag}</span>
                          <span>{def.name}</span>
                          <span className="text-xs text-gray-500">({def.nativeName})</span>
                        </div>
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowTranslations(!showTranslations)}
              >
                <Translate className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentLangDef.translations.placeholders[0]}
              className="pl-10 pr-20"
              dir={currentLangDef.direction}
            />
            
            {isAnalyzing && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>

          {/* Language Detection Results */}
          {query && detectedLanguage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Languages className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  Detected: <strong>{LANGUAGE_DEFINITIONS[detectedLanguage]?.name}</strong>
                </span>
                <Badge variant="outline" className="text-xs">
                  {(confidence * 100).toFixed(0)}% confidence
                </Badge>
              </div>
              
              {detectedLanguage !== selectedLanguage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLanguage(detectedLanguage)}
                >
                  Switch to {LANGUAGE_DEFINITIONS[detectedLanguage]?.name}
                </Button>
              )}
            </motion.div>
          )}

          {/* Translation Results */}
          <AnimatePresence>
            {showTranslations && multiLangQuery && Object.keys(multiLangQuery.translations).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Translate className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Translations</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(multiLangQuery.translations).map(([lang, translation]) => (
                    <div key={lang} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{LANGUAGE_DEFINITIONS[lang as SearchLanguage]?.flag}</span>
                        <span className="text-xs font-medium">
                          {LANGUAGE_DEFINITIONS[lang as SearchLanguage]?.name}
                        </span>
                      </div>
                      <p className="text-sm" dir={LANGUAGE_DEFINITIONS[lang as SearchLanguage]?.direction}>
                        {translation}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-6 px-2 text-xs"
                        onClick={() => setQuery(translation || "")}
                      >
                        Use this <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cultural Adaptations */}
          {multiLangQuery && multiLangQuery.culturalAdaptations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Cultural Suggestions</span>
              </div>
              <div className="space-y-1">
                {multiLangQuery.culturalAdaptations.map((adaptation, index) => (
                  <p key={index} className="text-xs text-yellow-700 dark:text-yellow-300">
                    {adaptation}
                  </p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cross-lingual Suggestions */}
          {multiLangQuery && multiLangQuery.crossLingualSuggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Try in other languages</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {multiLangQuery.crossLingualSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => {
                      const newQuery = suggestion.split(": ")[1]
                      if (newQuery) setQuery(newQuery)
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Support Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Supported Languages & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(LANGUAGE_DEFINITIONS).map(([code, def]) => (
              code !== "mixed" && code !== "unknown" && (
                <div key={code} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{def.flag}</span>
                    <div>
                      <h4 className="font-medium text-sm">{def.name}</h4>
                      <p className="text-xs text-gray-500">{def.nativeName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Intent detection</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Cultural context</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Auto-translation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Creator matching</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Style:</span> {def.culturalContext.formalityLevel}
                    </p>
                  </div>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for multi-language search functionality
export function useMultiLanguageSearch() {
  const [currentLanguage, setCurrentLanguage] = React.useState<SearchLanguage>("english")
  const [detectionHistory, setDetectionHistory] = React.useState<Array<{
    query: string
    language: SearchLanguage
    confidence: number
    timestamp: number
  }>>([])

  const detectAndTranslate = React.useCallback((query: string) => {
    // Implementation would use the same logic as the component
    const detection = { language: "english" as SearchLanguage, confidence: 0.8 }
    
    setDetectionHistory(prev => [
      { query, language: detection.language, confidence: detection.confidence, timestamp: Date.now() },
      ...prev.slice(0, 9)
    ])
    
    return detection
  }, [])

  return {
    currentLanguage,
    setCurrentLanguage,
    detectionHistory,
    detectAndTranslate
  }
}