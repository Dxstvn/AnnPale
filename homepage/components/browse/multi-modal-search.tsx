"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  Search,
  Mic,
  MicOff,
  Camera,
  Image,
  Clipboard,
  QrCode,
  Hand,
  Volume2,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  RotateCcw,
  Settings,
  Download,
  Upload,
  FileText,
  Link,
  Scan,
  Wand2,
  Zap,
  Brain,
  Activity,
  Globe,
  Languages,
  Eye,
  Ear,
  MousePointer
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedCreator } from "./enhanced-creator-card"

// Multi-modal search input method types per Phase 2.2.3
export type SearchInputMethod = 
  | "text"      // Typing
  | "voice"     // Mic icon  
  | "image"     // Camera icon
  | "paste"     // Ctrl/Cmd+V
  | "qr_link"   // Scan code
  | "gesture"   // Draw letter

export interface SearchInputEvent {
  method: SearchInputMethod
  query: string
  confidence: number
  metadata?: {
    language?: string
    accent?: string
    imageAnalysis?: ImageAnalysisResult
    gestureData?: GestureData
    pasteSource?: string
    qrData?: QRData
  }
  timestamp: number
  processingTime: number
}

export interface VoiceSearchConfig {
  enableLanguageDetection: boolean
  enableAccentNormalization: boolean
  enableNoiseFiltering: boolean
  enableCommandRecognition: boolean
  supportedLanguages: string[]
  confidenceThreshold: number
}

export interface ImageAnalysisResult {
  detectedObjects: Array<{
    label: string
    confidence: number
    category: "person" | "instrument" | "venue" | "text" | "logo"
  }>
  similarityMatches: Array<{
    creatorId: string
    similarity: number
    matchType: "visual" | "style" | "background" | "aesthetic"
  }>
  extractedText?: string
  dominantColors: string[]
  mood: "energetic" | "calm" | "professional" | "casual" | "festive"
}

export interface GestureData {
  strokes: Array<{
    x: number
    y: number
    timestamp: number
    pressure?: number
  }>
  recognizedLetter?: string
  confidence: number
  alternativeLetters: string[]
}

export interface QRData {
  type: "url" | "text" | "creator_profile" | "booking_link"
  content: string
  metadata?: {
    creatorId?: string
    eventType?: string
    promo?: string
  }
}

export interface VoiceCommand {
  pattern: RegExp
  action: string
  parameters?: string[]
  description: string
  examples: string[]
}

interface MultiModalSearchProps {
  onSearch: (query: string, method: SearchInputMethod, metadata?: any) => void
  onMethodChange?: (method: SearchInputMethod) => void
  creators?: EnhancedCreator[]
  voiceConfig?: Partial<VoiceSearchConfig>
  enableAllMethods?: boolean
  className?: string
}

// Voice commands as specified in Phase 2.2.3
const VOICE_COMMANDS: VoiceCommand[] = [
  {
    pattern: /^search for (.+)$/i,
    action: "search",
    parameters: ["query"],
    description: "Search for specific content",
    examples: ["Search for Wyclef Jean", "Search for comedians"]
  },
  {
    pattern: /^show me (.+)$/i,
    action: "browse_category", 
    parameters: ["category"],
    description: "Browse by category",
    examples: ["Show me musicians", "Show me singers"]
  },
  {
    pattern: /^find creators under \$?(\d+)$/i,
    action: "filter_price",
    parameters: ["maxPrice"],
    description: "Filter by maximum price",
    examples: ["Find creators under $100", "Find creators under 50"]
  },
  {
    pattern: /^book (.+)$/i,
    action: "direct_booking",
    parameters: ["creatorName"],
    description: "Direct booking intent",
    examples: ["Book Wyclef Jean", "Book Ti Jo Zenny"]
  },
  {
    pattern: /^clear search$/i,
    action: "clear",
    parameters: [],
    description: "Clear current search",
    examples: ["Clear search"]
  },
  {
    pattern: /^help$/i,
    action: "help",
    parameters: [],
    description: "Show help information",
    examples: ["Help"]
  }
]

// Language configurations for voice recognition
const VOICE_LANGUAGE_CONFIGS = {
  "en-US": { accent: "american", confidence: 0.9 },
  "en-GB": { accent: "british", confidence: 0.85 },
  "fr-FR": { accent: "french", confidence: 0.8 },
  "fr-CA": { accent: "canadian_french", confidence: 0.75 },
  "ht-HT": { accent: "haitian_creole", confidence: 0.7 }
}

export function MultiModalSearch({
  onSearch,
  onMethodChange,
  creators = [],
  voiceConfig = {},
  enableAllMethods = true,
  className
}: MultiModalSearchProps) {
  const [query, setQuery] = React.useState("")
  const [currentMethod, setCurrentMethod] = React.useState<SearchInputMethod>("text")
  const [isProcessing, setIsProcessing] = React.useState(false)
  
  // Voice search state
  const [isListening, setIsListening] = React.useState(false)
  const [voiceTranscript, setVoiceTranscript] = React.useState("")
  const [voiceConfidence, setVoiceConfidence] = React.useState(0)
  const [detectedLanguage, setDetectedLanguage] = React.useState("en-US")
  const [voiceWaveform, setVoiceWaveform] = React.useState<number[]>([])
  const [showVoicePreview, setShowVoicePreview] = React.useState(false)
  
  // Image search state
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [imageAnalysis, setImageAnalysis] = React.useState<ImageAnalysisResult | null>(null)
  const [showImagePreview, setShowImagePreview] = React.useState(false)
  
  // Gesture input state
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [gestureStrokes, setGestureStrokes] = React.useState<GestureData["strokes"]>([])
  const [recognizedGesture, setRecognizedGesture] = React.useState<string>("")
  
  // QR/Link state
  const [showQRScanner, setShowQRScanner] = React.useState(false)
  const [qrData, setQrData] = React.useState<QRData | null>(null)
  
  // Paste state
  const [pastedContent, setPastedContent] = React.useState("")
  const [showPastePreview, setShowPastePreview] = React.useState(false)

  // Voice search configuration
  const voiceSettings: VoiceSearchConfig = {
    enableLanguageDetection: true,
    enableAccentNormalization: true, 
    enableNoiseFiltering: true,
    enableCommandRecognition: true,
    supportedLanguages: ["en-US", "fr-FR", "ht-HT"],
    confidenceThreshold: 0.7,
    ...voiceConfig
  }

  // Enhanced voice search with language detection and accent normalization
  const startVoiceSearch = React.useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice search is not supported in your browser")
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    // Enhanced configuration
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 3
    
    // Language detection setup
    if (voiceSettings.enableLanguageDetection) {
      recognition.lang = detectedLanguage
    }

    let startTime = Date.now()

    recognition.onstart = () => {
      setIsListening(true)
      setVoiceTranscript("")
      setVoiceConfidence(0)
      setCurrentMethod("voice")
      onMethodChange?.("voice")
      startTime = Date.now()
      
      // Simulate waveform animation
      const waveformInterval = setInterval(() => {
        setVoiceWaveform(prev => [
          ...prev.slice(-20),
          Math.random() * 100
        ])
      }, 100)

      recognition.waveformInterval = waveformInterval
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ""
      let finalTranscript = ""
      let confidence = 0

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        confidence = result[0].confidence || 0

        if (result.isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      setVoiceTranscript(currentTranscript)
      setVoiceConfidence(confidence)
      
      // Language detection simulation
      if (voiceSettings.enableLanguageDetection) {
        const detectedLang = detectLanguageFromSpeech(currentTranscript)
        if (detectedLang !== detectedLanguage) {
          setDetectedLanguage(detectedLang)
        }
      }

      // Check for voice commands
      if (voiceSettings.enableCommandRecognition && finalTranscript) {
        const command = recognizeVoiceCommand(finalTranscript)
        if (command) {
          executeVoiceCommand(command, finalTranscript)
          return
        }
      }

      // Update query with accent normalization
      let normalizedTranscript = currentTranscript
      if (voiceSettings.enableAccentNormalization) {
        normalizedTranscript = normalizeAccent(currentTranscript, detectedLanguage)
      }

      setQuery(normalizedTranscript)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
      clearInterval(recognition.waveformInterval)
      setVoiceWaveform([])
      
      const errorMessages = {
        "no-speech": "No speech detected. Please try again.",
        "audio-capture": "Microphone access denied or unavailable.",
        "not-allowed": "Speech recognition permission denied.",
        "network": "Network error. Please check your connection.",
        "aborted": "Speech recognition was cancelled."
      }
      
      toast.error(errorMessages[event.error as keyof typeof errorMessages] || "Speech recognition failed. Please try again.")
    }

    recognition.onend = () => {
      setIsListening(false)
      clearInterval(recognition.waveformInterval)
      setVoiceWaveform([])
      
      if (voiceTranscript && voiceConfidence >= voiceSettings.confidenceThreshold) {
        setShowVoicePreview(true)
      } else if (voiceTranscript) {
        toast.warning(`Low confidence (${(voiceConfidence * 100).toFixed(0)}%). Please confirm or try again.`)
        setShowVoicePreview(true)
      }
    }

    recognition.start()
  }, [detectedLanguage, voiceSettings, voiceTranscript, voiceConfidence, onMethodChange])

  // Language detection from speech patterns
  const detectLanguageFromSpeech = (transcript: string): string => {
    const patterns = {
      "fr-FR": /\b(le|la|les|un|une|des|et|ou|dans|pour|avec|sur)\b/gi,
      "ht-HT": /\b(nan|ak|pou|sou|ki|kisa|komèn|mizik|chantè)\b/gi,
      "en-US": /\b(the|and|or|in|for|with|on|at|by)\b/gi
    }

    let maxMatches = 0
    let detectedLang = "en-US"

    Object.entries(patterns).forEach(([lang, pattern]) => {
      const matches = (transcript.match(pattern) || []).length
      if (matches > maxMatches) {
        maxMatches = matches
        detectedLang = lang
      }
    })

    return detectedLang
  }

  // Accent normalization
  const normalizeAccent = (transcript: string, language: string): string => {
    const normalizations: Record<string, Record<string, string>> = {
      "en-US": {
        // British to American
        "colour": "color",
        "favour": "favor",
        "centre": "center"
      },
      "fr-FR": {
        // Quebec to France French
        "char": "voiture",
        "blonde": "petite amie"
      },
      "ht-HT": {
        // Common variations
        "kominikè": "kominote",
        "pwodiktè": "produktè"
      }
    }

    let normalized = transcript
    const langNorms = normalizations[language]
    
    if (langNorms) {
      Object.entries(langNorms).forEach(([from, to]) => {
        normalized = normalized.replace(new RegExp(from, "gi"), to)
      })
    }

    return normalized
  }

  // Voice command recognition
  const recognizeVoiceCommand = (transcript: string): VoiceCommand | null => {
    for (const command of VOICE_COMMANDS) {
      const match = transcript.match(command.pattern)
      if (match) {
        return command
      }
    }
    return null
  }

  // Execute voice command
  const executeVoiceCommand = (command: VoiceCommand, transcript: string) => {
    const match = transcript.match(command.pattern)
    if (!match) return

    switch (command.action) {
      case "search":
        const searchQuery = match[1]
        executeSearch(searchQuery, "voice")
        break
      
      case "browse_category":
        const category = match[1]
        executeSearch(category, "voice", { category })
        break
      
      case "filter_price":
        const maxPrice = parseInt(match[1])
        executeSearch(`under $${maxPrice}`, "voice", { priceFilter: maxPrice })
        break
      
      case "direct_booking":
        const creatorName = match[1]
        executeSearch(creatorName, "voice", { bookingIntent: true })
        break
      
      case "clear":
        setQuery("")
        setVoiceTranscript("")
        toast.success("Search cleared")
        break
      
      case "help":
        toast.info("Voice commands: 'Search for...', 'Show me...', 'Find creators under $...', 'Book...', 'Clear search'")
        break
    }
  }

  // Enhanced image search with AI similarity
  const handleImageUpload = React.useCallback(async (file: File) => {
    setSelectedImage(file)
    setIsProcessing(true)
    setCurrentMethod("image")
    onMethodChange?.("image")

    try {
      // Simulate AI image analysis
      const analysis = await analyzeImageForSimilarity(file)
      setImageAnalysis(analysis)
      setShowImagePreview(true)
      
      // Generate search query from analysis
      const searchQuery = generateSearchQueryFromImage(analysis)
      setQuery(searchQuery)
      
      toast.success("Image analyzed successfully!")
      
    } catch (error) {
      console.error("Image analysis error:", error)
      toast.error("Failed to analyze image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }, [onMethodChange])

  // AI image similarity analysis (simulated)
  const analyzeImageForSimilarity = async (file: File): Promise<ImageAnalysisResult> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI analysis results
    return {
      detectedObjects: [
        { label: "microphone", confidence: 0.92, category: "instrument" },
        { label: "stage", confidence: 0.87, category: "venue" },
        { label: "person", confidence: 0.95, category: "person" }
      ],
      similarityMatches: [
        { creatorId: "wyclef", similarity: 0.89, matchType: "visual" },
        { creatorId: "tijozenny", similarity: 0.76, matchType: "style" },
        { creatorId: "rutshelle", similarity: 0.72, matchType: "background" }
      ],
      extractedText: "LIVE MUSIC",
      dominantColors: ["#1a1a1a", "#ff6b35", "#f7931e"],
      mood: "energetic"
    }
  }

  // Generate search query from image analysis
  const generateSearchQueryFromImage = (analysis: ImageAnalysisResult): string => {
    const objects = analysis.detectedObjects
      .filter(obj => obj.confidence > 0.8)
      .map(obj => obj.label)

    if (objects.includes("microphone") || objects.includes("stage")) {
      return "musicians performers live music"
    }
    
    if (objects.includes("comedy") || analysis.mood === "energetic") {
      return "comedians entertainment performers"
    }

    if (analysis.extractedText) {
      return analysis.extractedText.toLowerCase()
    }

    return "visual search results"
  }

  // Handle paste input with parsing
  const handlePaste = React.useCallback(async (event: ClipboardEvent) => {
    event.preventDefault()
    const clipboardData = event.clipboardData
    if (!clipboardData) return

    setCurrentMethod("paste")
    onMethodChange?.("paste")

    // Handle different paste types
    if (clipboardData.files.length > 0) {
      // Pasted image
      const file = clipboardData.files[0]
      if (file.type.startsWith("image/")) {
        await handleImageUpload(file)
        return
      }
    }

    // Handle text paste
    const pastedText = clipboardData.getData("text")
    if (pastedText) {
      setPastedContent(pastedText)
      
      // Parse different text types
      const parsedQuery = parseTextInput(pastedText)
      setQuery(parsedQuery.query)
      setShowPastePreview(true)
      
      toast.success(`Pasted ${parsedQuery.type} content`)
    }
  }, [handleImageUpload, onMethodChange])

  // Parse pasted text content
  const parseTextInput = (text: string): { query: string; type: string; metadata?: any } => {
    // URL detection
    if (text.match(/^https?:\/\//)) {
      if (text.includes("annpale.com") || text.includes("creator")) {
        return { query: "creator profile", type: "creator_link", metadata: { url: text } }
      }
      return { query: text, type: "url" }
    }

    // Email detection
    if (text.match(/\S+@\S+\.\S+/)) {
      return { query: "contact search", type: "email" }
    }

    // Phone number detection
    if (text.match(/^\+?[\d\s\-\(\)]+$/)) {
      return { query: "contact search", type: "phone" }
    }

    // Multi-line text (probably copied from description)
    if (text.includes("\n")) {
      const firstLine = text.split("\n")[0]
      return { query: firstLine, type: "description" }
    }

    // Plain text
    return { query: text, type: "text" }
  }

  // QR Code scanning simulation
  const handleQRScan = React.useCallback(async () => {
    setCurrentMethod("qr_link")
    onMethodChange?.("qr_link")
    setIsProcessing(true)

    try {
      // Simulate QR scanning
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock QR data
      const mockQRData: QRData = {
        type: "creator_profile",
        content: "https://annpale.com/creator/wyclef-jean",
        metadata: {
          creatorId: "wyclef",
          eventType: "booking"
        }
      }

      setQrData(mockQRData)
      setQuery("Wyclef Jean")
      toast.success("QR code scanned successfully!")
      executeSearch("Wyclef Jean", "qr_link", mockQRData)
      
    } catch (error) {
      toast.error("Failed to scan QR code. Please try again.")
    } finally {
      setIsProcessing(false)
      setShowQRScanner(false)
    }
  }, [onMethodChange])

  // Gesture input for accessibility
  const handleGestureStart = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setIsDrawing(true)
    setCurrentMethod("gesture")
    onMethodChange?.("gesture")
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    setGestureStrokes([{ x, y, timestamp: Date.now() }])
  }, [onMethodChange])

  const handleGestureMove = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    setGestureStrokes(prev => [
      ...prev,
      { x, y, timestamp: Date.now() }
    ])
  }, [isDrawing])

  const handleGestureEnd = React.useCallback(() => {
    setIsDrawing(false)
    
    // Simulate gesture recognition
    setTimeout(() => {
      const recognizedLetter = recognizeGesture(gestureStrokes)
      setRecognizedGesture(recognizedLetter)
      
      if (recognizedLetter) {
        setQuery(prev => prev + recognizedLetter)
        toast.success(`Recognized: ${recognizedLetter}`)
      }
    }, 500)
  }, [gestureStrokes])

  // Simple gesture recognition (mock)
  const recognizeGesture = (strokes: GestureData["strokes"]): string => {
    if (strokes.length < 3) return ""
    
    // Very simple pattern matching based on stroke count and direction
    const strokeCount = strokes.length
    const avgX = strokes.reduce((sum, point) => sum + point.x, 0) / strokes.length
    const avgY = strokes.reduce((sum, point) => sum + point.y, 0) / strokes.length
    
    // Mock recognition logic
    if (strokeCount > 15 && strokeCount < 25) return "o"
    if (strokeCount > 8 && avgX < 50) return "l"
    if (strokeCount > 10 && avgY < 50) return "t"
    
    return ["a", "e", "i", "s", "r", "n"][Math.floor(Math.random() * 6)]
  }

  // Execute search with method tracking
  const executeSearch = React.useCallback((searchQuery: string, method: SearchInputMethod, metadata?: any) => {
    const searchEvent: SearchInputEvent = {
      method,
      query: searchQuery,
      confidence: method === "voice" ? voiceConfidence : 1.0,
      metadata,
      timestamp: Date.now(),
      processingTime: 0 // Would be calculated in real implementation
    }

    onSearch(searchQuery, method, searchEvent)
    
    // Reset previews
    setShowVoicePreview(false)
    setShowImagePreview(false)
    setShowPastePreview(false)
  }, [onSearch, voiceConfidence])

  // Setup paste event listener
  React.useEffect(() => {
    const handleGlobalPaste = (event: ClipboardEvent) => {
      // Only handle paste if search input area has focus
      const activeElement = document.activeElement
      if (activeElement?.tagName === "INPUT" || activeElement?.getAttribute("contenteditable") === "true") {
        handlePaste(event)
      }
    }

    document.addEventListener("paste", handleGlobalPaste)
    return () => document.removeEventListener("paste", handleGlobalPaste)
  }, [handlePaste])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search Input with Multi-Modal Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-600" />
            Multi-Modal Search
            <Badge variant="outline" className="text-xs">
              Phase 2.2.3
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search Input with Method Indicators */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setCurrentMethod("text")
                onMethodChange?.("text")
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  executeSearch(query, currentMethod)
                }
              }}
              placeholder="Type, speak, upload image, or paste content..."
              className="pl-10 pr-32 h-12 text-base"
            />
            
            {/* Method Indicator */}
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary" className="text-xs">
                {currentMethod.replace("_", " ")}
              </Badge>
            </div>
            
            {/* Input Method Controls */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              
              {/* Voice Search */}
              {enableAllMethods && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startVoiceSearch}
                  disabled={isListening}
                  className={cn(
                    "h-8 w-8",
                    isListening && "text-red-500 animate-pulse"
                  )}
                >
                  {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              )}
              
              {/* Image Upload */}
              {enableAllMethods && (
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <span>
                      <Camera className="h-4 w-4" />
                    </span>
                  </Button>
                </label>
              )}
              
              {/* QR Scanner */}
              {enableAllMethods && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQRScanner(true)}
                  className="h-8 w-8"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              )}
              
              {/* More Input Methods */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MousePointer className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Input Methods</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentMethod("gesture")}>
                    <Hand className="h-4 w-4 mr-2" />
                    Gesture Input
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigator.clipboard.readText().then(text => { setPastedContent(text); setShowPastePreview(true) })}>
                    <Clipboard className="h-4 w-4 mr-2" />
                    Paste Content
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Search Button */}
              <Button
                onClick={() => executeSearch(query, currentMethod)}
                className="h-8 px-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Real-time Voice Feedback */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Volume2 className="h-5 w-5 text-red-500 animate-pulse" />
                  <span className="font-medium">Listening...</span>
                  <Badge variant="outline" className="text-xs">
                    {detectedLanguage}
                  </Badge>
                </div>
                
                {/* Voice Waveform */}
                <div className="flex items-center gap-1 h-8 mb-3">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-red-500 rounded-full transition-all duration-100"
                      style={{
                        width: "3px",
                        height: `${Math.max(4, voiceWaveform[i] || 0) / 4}px`
                      }}
                    />
                  ))}
                </div>
                
                {/* Live Transcript */}
                {voiceTranscript && (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                    <p className="text-sm font-mono">{voiceTranscript}</p>
                    {voiceConfidence > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <Progress value={voiceConfidence * 100} className="h-2 flex-1" />
                        <span className="text-xs font-medium">{(voiceConfidence * 100).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm">Processing {currentMethod} input...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Preview & Confirmation */}
      <Dialog open={showVoicePreview} onOpenChange={setShowVoicePreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Search Confirmation</DialogTitle>
            <DialogDescription>
              Please confirm or edit your voice search query
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Detected Speech:</span>
                <Badge variant="outline" className="text-xs">{detectedLanguage}</Badge>
              </div>
              <p className="font-mono">{voiceTranscript}</p>
            </div>
            
            <div>
              <Label htmlFor="voice-edit">Edit if needed:</Label>
              <Input
                id="voice-edit"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Confidence: {(voiceConfidence * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoicePreview(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              executeSearch(query, "voice")
              setShowVoicePreview(false)
            }}>
              Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Analysis Preview */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Image Search Analysis</DialogTitle>
            <DialogDescription>
              AI analysis of your uploaded image
            </DialogDescription>
          </DialogHeader>
          
          {imageAnalysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Detected Objects</h4>
                  <div className="space-y-2">
                    {imageAnalysis.detectedObjects.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm capitalize">{obj.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {(obj.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Similar Creators</h4>
                  <div className="space-y-2">
                    {imageAnalysis.similarityMatches.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm">{match.creatorId}</span>
                        <Badge variant="secondary" className="text-xs">
                          {(match.similarity * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <h4 className="font-medium mb-1">Generated Search Query:</h4>
                <p className="font-mono text-sm">{query}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImagePreview(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              executeSearch(query, "image", imageAnalysis)
              setShowImagePreview(false)
            }}>
              Search with AI Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Scanner */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Scanner</DialogTitle>
            <DialogDescription>
              Point your camera at a QR code to scan
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-8">
            <QrCode className="h-24 w-24 text-gray-400" />
            <p className="text-sm text-gray-600">Simulated QR scanner</p>
            <Button onClick={handleQRScan} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Simulate Scan
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gesture Input Area */}
      {currentMethod === "gesture" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Gesture Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-crosshair bg-gray-50 dark:bg-gray-800"
              onMouseDown={handleGestureStart}
              onMouseMove={handleGestureMove}
              onMouseUp={handleGestureEnd}
            >
              {gestureStrokes.length === 0 ? (
                <p className="text-sm text-gray-500">Draw letters here</p>
              ) : (
                <div className="relative w-full h-full">
                  <svg className="w-full h-full">
                    <polyline
                      points={gestureStrokes.map(point => `${point.x},${point.y}`).join(" ")}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {recognizedGesture && (
                    <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-sm">
                      {recognizedGesture}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGestureStrokes([])}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <span className="text-xs text-gray-500">
                Draw letters to build your search query
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Method Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Input Methods Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            {[
              { method: "text", icon: <FileText className="h-4 w-4" />, label: "Text" },
              { method: "voice", icon: <Mic className="h-4 w-4" />, label: "Voice" },
              { method: "image", icon: <Image className="h-4 w-4" />, label: "Image" },
              { method: "paste", icon: <Clipboard className="h-4 w-4" />, label: "Paste" },
              { method: "qr_link", icon: <QrCode className="h-4 w-4" />, label: "QR/Link" },
              { method: "gesture", icon: <Hand className="h-4 w-4" />, label: "Gesture" }
            ].map(({ method, icon, label }) => (
              <div 
                key={method}
                className={cn(
                  "p-3 border rounded-lg transition-colors",
                  currentMethod === method && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  {icon}
                  <span className="text-xs font-medium">{label}</span>
                  {currentMethod === method && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for using multi-modal search with analytics
export function useMultiModalSearch() {
  const [inputMethodStats, setInputMethodStats] = React.useState<Record<SearchInputMethod, number>>({
    text: 0,
    voice: 0,
    image: 0,
    paste: 0,
    qr_link: 0,
    gesture: 0
  })

  const trackInputMethod = React.useCallback((method: SearchInputMethod) => {
    setInputMethodStats(prev => ({
      ...prev,
      [method]: prev[method] + 1
    }))
  }, [])

  return {
    inputMethodStats,
    trackInputMethod
  }
}