"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertCircle,
  Check,
  Info,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  RefreshCw,
  Keyboard,
  Mouse,
  TouchpadIcon,
  Accessibility,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Accessibility configuration
export interface AccessibilityConfig {
  screenReaderMode?: boolean
  highContrast?: boolean
  largeText?: boolean
  reducedMotion?: boolean
  keyboardOnly?: boolean
  voiceNavigation?: boolean
  autoAnnounce?: boolean
  skipLinks?: boolean
}

// ARIA live region announcements
const LiveRegion = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; priority?: "polite" | "assertive" }
>(({ children, priority = "polite" }, ref) => (
  <div
    ref={ref}
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {children}
  </div>
))

LiveRegion.displayName = "LiveRegion"

// Screen reader announcements hook
export function useScreenReaderAnnouncements() {
  const [announcement, setAnnouncement] = React.useState("")
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  
  const announce = React.useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    clearTimeout(timeoutRef.current)
    setAnnouncement("")
    
    timeoutRef.current = setTimeout(() => {
      setAnnouncement(message)
    }, 100)
    
    // Clear after announcement
    setTimeout(() => setAnnouncement(""), 1000)
  }, [])
  
  return { announcement, announce }
}

// Enhanced accessible form field
export function AccessibleFormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  required = false,
  placeholder,
  description,
  error,
  warning,
  success,
  disabled = false,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  accessibilityConfig = {},
  className
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  type?: string
  required?: boolean
  placeholder?: string
  description?: string
  error?: string
  warning?: string
  success?: string
  disabled?: boolean
  autoComplete?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  accessibilityConfig?: AccessibilityConfig
  className?: string
}) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = React.useState(false)
  
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { announcement, announce } = useScreenReaderAnnouncements()
  
  // Detect keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setKeyboardNavigation(true)
      }
    }
    
    const handleMouseDown = () => {
      setKeyboardNavigation(false)
    }
    
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleMouseDown)
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])
  
  // Announce changes to screen readers
  React.useEffect(() => {
    if (accessibilityConfig.autoAnnounce) {
      if (error) {
        announce(`Error in ${label}: ${error}`, "assertive")
      } else if (success) {
        announce(`${label} is valid`, "polite")
      } else if (warning) {
        announce(`Warning for ${label}: ${warning}`, "polite")
      }
    }
  }, [error, success, warning, label, announce, accessibilityConfig.autoAnnounce])
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enhanced keyboard navigation
    if (e.key === "Escape" && isFocused) {
      inputRef.current?.blur()
    }
    
    if (e.key === "Enter" && type !== "textarea") {
      // Move to next focusable element
      const form = inputRef.current?.closest("form")
      const inputs = form?.querySelectorAll(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled])'
      )
      if (inputs) {
        const currentIndex = Array.from(inputs).indexOf(inputRef.current!)
        const nextInput = inputs[currentIndex + 1] as HTMLElement
        nextInput?.focus()
      }
    }
  }
  
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
    announce(showPassword ? "Password hidden" : "Password visible", "polite")
  }
  
  // Generate accessible descriptions
  const getAriaDescribedBy = () => {
    const ids = []
    if (description) ids.push(`${id}-description`)
    if (error) ids.push(`${id}-error`)
    if (warning) ids.push(`${id}-warning`)
    if (success) ids.push(`${id}-success`)
    if (maxLength) ids.push(`${id}-count`)
    return ids.length > 0 ? ids.join(" ") : undefined
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Skip link for keyboard users */}
      {accessibilityConfig.skipLinks && (
        <button
          type="button"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-white border p-2 z-50"
          onClick={() => inputRef.current?.focus()}
        >
          Skip to {label}
        </button>
      )}
      
      {/* Label with enhanced semantics */}
      <Label
        htmlFor={id}
        className={cn(
          "flex items-center gap-2",
          accessibilityConfig.largeText && "text-lg",
          required && "after:content-['*'] after:text-red-500 after:ml-1"
        )}
      >
        <span>{label}</span>
        {required && (
          <span className="sr-only">(required)</span>
        )}
        
        {/* Accessibility indicators */}
        {accessibilityConfig.screenReaderMode && (
          <Badge variant="outline" className="text-xs">
            <Accessibility className="h-3 w-3 mr-1" />
            Screen Reader Mode
          </Badge>
        )}
      </Label>
      
      {/* Description */}
      {description && (
        <p
          id={`${id}-description`}
          className={cn(
            "text-sm text-gray-600 dark:text-gray-400",
            accessibilityConfig.largeText && "text-base"
          )}
        >
          <Info className="inline h-3 w-3 mr-1" />
          {description}
        </p>
      )}
      
      {/* Input field with enhanced accessibility */}
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            if (accessibilityConfig.autoAnnounce) {
              announce(`Focused on ${label}`, "polite")
            }
          }}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          aria-describedby={getAriaDescribedBy()}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(
            // High contrast mode
            accessibilityConfig.highContrast && [
              "border-2 border-black dark:border-white",
              "bg-white dark:bg-black",
              "text-black dark:text-white"
            ],
            // Large text mode
            accessibilityConfig.largeText && "text-lg p-4",
            // Focus indicators for keyboard navigation
            keyboardNavigation && [
              "focus:ring-4 focus:ring-purple-500/50",
              "focus:border-purple-500"
            ],
            // Error states
            error && "border-red-500 bg-red-50 dark:bg-red-900/20",
            warning && "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
            success && "border-green-500 bg-green-50 dark:bg-green-900/20",
            type === "password" && "pr-10"
          )}
        />
        
        {/* Password visibility toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
      
      {/* Character count */}
      {maxLength && (
        <div
          id={`${id}-count`}
          className="flex justify-between text-xs"
          aria-live="polite"
        >
          <span className={cn(
            "text-gray-500",
            value.length >= maxLength * 0.9 && "text-orange-500",
            value.length >= maxLength && "text-red-500"
          )}>
            {value.length} / {maxLength} characters
          </span>
          {value.length >= maxLength * 0.9 && (
            <span className="text-orange-500">
              {maxLength - value.length} remaining
            </span>
          )}
        </div>
      )}
      
      {/* Status messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={accessibilityConfig.reducedMotion ? {} : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={accessibilityConfig.reducedMotion ? {} : { opacity: 0, y: -5 }}
            role="alert"
            aria-live="assertive"
          >
            <Alert variant="destructive" id={`${id}-error`}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        {warning && !error && (
          <motion.div
            initial={accessibilityConfig.reducedMotion ? {} : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={accessibilityConfig.reducedMotion ? {} : { opacity: 0, y: -5 }}
            role="alert"
            aria-live="polite"
          >
            <Alert id={`${id}-warning`} className="border-yellow-500">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        {success && !error && !warning && (
          <motion.div
            initial={accessibilityConfig.reducedMotion ? {} : { opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={accessibilityConfig.reducedMotion ? {} : { opacity: 0, y: -5 }}
            role="status"
            aria-live="polite"
          >
            <Alert id={`${id}-success`} className="border-green-500">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Live region for announcements */}
      <LiveRegion priority="polite">
        {announcement}
      </LiveRegion>
    </div>
  )
}

// Accessibility toolbar for users
export function AccessibilityToolbar({
  config,
  onConfigChange,
  className
}: {
  config: AccessibilityConfig
  onConfigChange: (config: AccessibilityConfig) => void
  className?: string
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  const toggleConfig = (key: keyof AccessibilityConfig) => {
    onConfigChange({
      ...config,
      [key]: !config[key]
    })
  }
  
  return (
    <div className={cn("fixed top-4 right-4 z-50", className)}>
      <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
          aria-expanded={isExpanded}
          aria-controls="accessibility-options"
        >
          <Accessibility className="h-5 w-5" />
          <span className="font-medium">Accessibility</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="accessibility-options"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="high-contrast" className="text-sm font-medium">
                    High Contrast
                  </label>
                  <Button
                    id="high-contrast"
                    variant={config.highContrast ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleConfig("highContrast")}
                  >
                    {config.highContrast ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="large-text" className="text-sm font-medium">
                    Large Text
                  </label>
                  <Button
                    id="large-text"
                    variant={config.largeText ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleConfig("largeText")}
                  >
                    {config.largeText ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="reduced-motion" className="text-sm font-medium">
                    Reduced Motion
                  </label>
                  <Button
                    id="reduced-motion"
                    variant={config.reducedMotion ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleConfig("reducedMotion")}
                  >
                    {config.reducedMotion ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="screen-reader" className="text-sm font-medium">
                    Screen Reader Mode
                  </label>
                  <Button
                    id="screen-reader"
                    variant={config.screenReaderMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleConfig("screenReaderMode")}
                  >
                    {config.screenReaderMode ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="auto-announce" className="text-sm font-medium">
                    Auto Announcements
                  </label>
                  <Button
                    id="auto-announce"
                    variant={config.autoAnnounce ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleConfig("autoAnnounce")}
                  >
                    {config.autoAnnounce ? "On" : "Off"}
                  </Button>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    These settings improve accessibility for users with disabilities
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Form section with accessibility enhancements
export function AccessibleFormSection({
  title,
  description,
  children,
  required = false,
  completed = false,
  error,
  accessibilityConfig = {},
  className
}: {
  title: string
  description?: string
  children: React.ReactNode
  required?: boolean
  completed?: boolean
  error?: string
  accessibilityConfig?: AccessibilityConfig
  className?: string
}) {
  const sectionId = React.useId()
  const { announce } = useScreenReaderAnnouncements()
  
  React.useEffect(() => {
    if (completed && accessibilityConfig.autoAnnounce) {
      announce(`Section ${title} completed`, "polite")
    }
  }, [completed, title, announce, accessibilityConfig.autoAnnounce])
  
  return (
    <section
      aria-labelledby={`${sectionId}-title`}
      aria-describedby={description ? `${sectionId}-description` : undefined}
      className={cn(
        "space-y-4 p-4 border rounded-lg",
        completed && "border-green-500 bg-green-50/50 dark:bg-green-900/10",
        error && "border-red-500 bg-red-50/50 dark:bg-red-900/10",
        accessibilityConfig.highContrast && "border-2",
        className
      )}
    >
      <header>
        <h3
          id={`${sectionId}-title`}
          className={cn(
            "font-semibold flex items-center gap-2",
            accessibilityConfig.largeText && "text-xl",
            completed && "text-green-700 dark:text-green-300",
            error && "text-red-700 dark:text-red-300"
          )}
        >
          {completed ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : error ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : null}
          {title}
          {required && (
            <Badge variant="secondary" className="text-xs">
              Required
            </Badge>
          )}
          {completed && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              Complete
            </Badge>
          )}
        </h3>
        
        {description && (
          <p
            id={`${sectionId}-description`}
            className={cn(
              "text-sm text-gray-600 dark:text-gray-400 mt-1",
              accessibilityConfig.largeText && "text-base"
            )}
          >
            {description}
          </p>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </header>
      
      <div role="group" aria-labelledby={`${sectionId}-title`}>
        {children}
      </div>
    </section>
  )
}

// Voice navigation helper
export function VoiceNavigationHelper({
  onCommand,
  enabled = false,
  className
}: {
  onCommand: (command: string) => void
  enabled?: boolean
  className?: string
}) {
  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState("")
  
  React.useEffect(() => {
    if (!enabled || !("webkitSpeechRecognition" in window)) return
    
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setTranscript(transcript)
      
      if (event.results[current].isFinal) {
        onCommand(transcript.toLowerCase())
        setTranscript("")
      }
    }
    
    if (isListening) {
      recognition.start()
    } else {
      recognition.stop()
    }
    
    return () => recognition.stop()
  }, [isListening, enabled, onCommand])
  
  if (!enabled) return null
  
  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setIsListening(!isListening)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isListening 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-gray-100 hover:bg-gray-200"
            )}
            aria-label={isListening ? "Stop voice navigation" : "Start voice navigation"}
          >
            {isListening ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
          <span className="text-sm font-medium">
            Voice Navigation
          </span>
        </div>
        
        {transcript && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            "{transcript}"
          </p>
        )}
        
        <p className="text-xs text-gray-500 mt-2">
          Say "next field", "previous", "submit", or "help"
        </p>
      </div>
    </div>
  )
}