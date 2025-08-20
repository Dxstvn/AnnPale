"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Check,
  X,
  Info,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Wand2,
  ArrowRight,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Globe,
  Hash,
  Type,
  AtSign,
  Circle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Types for form field optimization
export interface FieldOptimizationConfig {
  autoComplete?: boolean
  autoFormat?: boolean
  autoValidate?: boolean
  smartSuggestions?: boolean
  progressiveDisclosure?: boolean
  fieldDependencies?: Record<string, string[]>
  errorRecovery?: boolean
  accessibilityMode?: "standard" | "enhanced" | "screen-reader"
}

export interface ValidationState {
  status: "idle" | "validating" | "valid" | "invalid" | "warning"
  message?: string
  suggestions?: string[]
  confidence?: number
}

export interface FieldMetrics {
  focusTime?: number
  changeCount?: number
  errorCount?: number
  hesitationTime?: number
  abandonmentRisk?: "low" | "medium" | "high"
}

// Auto-detect field type based on name/label
const detectFieldType = (name: string, label: string): string => {
  const combined = `${name} ${label}`.toLowerCase()
  
  if (combined.includes("email")) return "email"
  if (combined.includes("phone") || combined.includes("tel")) return "tel"
  if (combined.includes("url") || combined.includes("website")) return "url"
  if (combined.includes("zip") || combined.includes("postal")) return "postal"
  if (combined.includes("card") || combined.includes("credit")) return "card"
  if (combined.includes("date") || combined.includes("birth")) return "date"
  if (combined.includes("name") && combined.includes("first")) return "given-name"
  if (combined.includes("name") && combined.includes("last")) return "family-name"
  if (combined.includes("address")) return "street-address"
  if (combined.includes("city")) return "address-level2"
  if (combined.includes("state") || combined.includes("province")) return "address-level1"
  if (combined.includes("country")) return "country"
  
  return "text"
}

// AI-powered field suggestions
const getFieldSuggestions = async (
  fieldType: string,
  value: string,
  context?: Record<string, any>
): Promise<string[]> => {
  // Simulate AI suggestions (in production, this would call an API)
  const suggestions: Record<string, string[]> = {
    email: [
      value ? `${value}@gmail.com` : "",
      value ? `${value}@yahoo.com` : "",
      value ? `${value}@outlook.com` : ""
    ].filter(Boolean),
    tel: [
      "(555) 123-4567",
      "(555) 987-6543"
    ],
    "street-address": [
      "123 Main Street",
      "456 Park Avenue",
      "789 Broadway"
    ],
    "given-name": context?.recipientName ? [
      context.recipientName.split(" ")[0],
      "John",
      "Jane"
    ] : ["John", "Jane", "Alex"],
    message: [
      "Happy Birthday! Wishing you all the best!",
      "Congratulations on your special day!",
      "Thank you for everything you do!"
    ]
  }
  
  return suggestions[fieldType] || []
}

// Format input based on type
const formatFieldValue = (type: string, value: string): string => {
  switch (type) {
    case "tel":
      // Format as US phone number
      const cleaned = value.replace(/\D/g, "")
      if (cleaned.length <= 3) return cleaned
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    
    case "card":
      // Format credit card number
      const cardClean = value.replace(/\s/g, "")
      const parts = cardClean.match(/.{1,4}/g) || []
      return parts.join(" ")
    
    case "postal":
      // Format ZIP code
      const zip = value.replace(/\D/g, "")
      if (zip.length > 5) return `${zip.slice(0, 5)}-${zip.slice(5, 9)}`
      return zip
    
    case "date":
      // Format as MM/DD/YYYY
      const dateClean = value.replace(/\D/g, "")
      if (dateClean.length <= 2) return dateClean
      if (dateClean.length <= 4) return `${dateClean.slice(0, 2)}/${dateClean.slice(2)}`
      return `${dateClean.slice(0, 2)}/${dateClean.slice(2, 4)}/${dateClean.slice(4, 8)}`
    
    default:
      return value
  }
}

// Smart validation with helpful feedback
const validateField = async (
  type: string,
  value: string,
  required: boolean = false
): Promise<ValidationState> => {
  if (!value && !required) {
    return { status: "idle" }
  }
  
  if (!value && required) {
    return {
      status: "invalid",
      message: "This field is required"
    }
  }
  
  // Simulate async validation
  await new Promise(resolve => setTimeout(resolve, 300))
  
  switch (type) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return {
          status: "invalid",
          message: "Please enter a valid email",
          suggestions: [`Did you mean ${value}@gmail.com?`]
        }
      }
      break
    
    case "tel":
      const phoneClean = value.replace(/\D/g, "")
      if (phoneClean.length !== 10) {
        return {
          status: "invalid",
          message: "Phone number must be 10 digits"
        }
      }
      break
    
    case "url":
      try {
        new URL(value.startsWith("http") ? value : `https://${value}`)
      } catch {
        return {
          status: "invalid",
          message: "Please enter a valid URL",
          suggestions: [`https://${value}`]
        }
      }
      break
    
    case "card":
      const cardClean = value.replace(/\s/g, "")
      if (cardClean.length < 13 || cardClean.length > 19) {
        return {
          status: "invalid",
          message: "Invalid card number"
        }
      }
      break
  }
  
  return {
    status: "valid",
    message: "Looks good!",
    confidence: 100
  }
}

// Optimized form field component
export function OptimizedFormField({
  name,
  label,
  value,
  onChange,
  onBlur,
  type: providedType,
  required = false,
  placeholder,
  helper,
  error,
  disabled = false,
  autoComplete: providedAutoComplete,
  maxLength,
  icon: Icon,
  config = {},
  context = {},
  className
}: {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  type?: string
  required?: boolean
  placeholder?: string
  helper?: string
  error?: string
  disabled?: boolean
  autoComplete?: string
  maxLength?: number
  icon?: React.ElementType
  config?: FieldOptimizationConfig
  context?: Record<string, any>
  className?: string
}) {
  const [localValue, setLocalValue] = React.useState(value)
  const [validation, setValidation] = React.useState<ValidationState>({ status: "idle" })
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [metrics, setMetrics] = React.useState<FieldMetrics>({})
  const [isRecovering, setIsRecovering] = React.useState(false)
  
  const inputRef = React.useRef<HTMLInputElement>(null)
  const focusStartTime = React.useRef<number | null>(null)
  const changeCount = React.useRef(0)
  const validationTimeout = React.useRef<NodeJS.Timeout>()
  
  // Auto-detect field type
  const fieldType = providedType || detectFieldType(name, label)
  const autoComplete = providedAutoComplete || (config.autoComplete !== false ? fieldType : "off")
  
  // Track focus time and hesitation
  React.useEffect(() => {
    if (isFocused) {
      focusStartTime.current = Date.now()
    } else if (focusStartTime.current) {
      const focusTime = Date.now() - focusStartTime.current
      setMetrics(prev => ({
        ...prev,
        focusTime: (prev.focusTime || 0) + focusTime,
        hesitationTime: focusTime > 5000 ? focusTime : prev.hesitationTime
      }))
      
      // Detect abandonment risk
      if (focusTime > 10000 && !localValue) {
        setMetrics(prev => ({
          ...prev,
          abandonmentRisk: "high"
        }))
      }
    }
  }, [isFocused, localValue])
  
  // Auto-format value
  React.useEffect(() => {
    if (config.autoFormat && localValue !== value) {
      const formatted = formatFieldValue(fieldType, localValue)
      if (formatted !== localValue) {
        setLocalValue(formatted)
        onChange(formatted)
      }
    }
  }, [localValue, fieldType, config.autoFormat])
  
  // Auto-validate
  React.useEffect(() => {
    if (config.autoValidate !== false && localValue) {
      clearTimeout(validationTimeout.current)
      
      if (validation.status !== "validating") {
        setValidation({ status: "validating" })
      }
      
      validationTimeout.current = setTimeout(async () => {
        const result = await validateField(fieldType, localValue, required)
        setValidation(result)
        
        if (result.status === "invalid") {
          setMetrics(prev => ({
            ...prev,
            errorCount: (prev.errorCount || 0) + 1
          }))
        }
      }, 500)
    }
  }, [localValue, fieldType, required, config.autoValidate])
  
  // Load suggestions
  React.useEffect(() => {
    if (config.smartSuggestions && isFocused) {
      getFieldSuggestions(fieldType, localValue, context).then(setSuggestions)
    }
  }, [localValue, fieldType, isFocused, config.smartSuggestions, context])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(config.autoFormat ? formatFieldValue(fieldType, newValue) : newValue)
    changeCount.current++
    setMetrics(prev => ({
      ...prev,
      changeCount: changeCount.current
    }))
    
    if (config.smartSuggestions) {
      setShowSuggestions(true)
    }
  }
  
  const handleSuggestionClick = (suggestion: string) => {
    setLocalValue(suggestion)
    onChange(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }
  
  const handleErrorRecovery = async () => {
    setIsRecovering(true)
    
    // Try to auto-fix common errors
    let fixedValue = localValue
    
    if (fieldType === "email" && !localValue.includes("@")) {
      const suggestions = await getFieldSuggestions("email", localValue)
      if (suggestions.length > 0) {
        fixedValue = suggestions[0]
      }
    } else if (fieldType === "url" && !localValue.startsWith("http")) {
      fixedValue = `https://${localValue}`
    }
    
    setLocalValue(fixedValue)
    onChange(fixedValue)
    
    // Re-validate
    const result = await validateField(fieldType, fixedValue, required)
    setValidation(result)
    setIsRecovering(false)
    
    if (result.status === "valid") {
      toast.success("Fixed! The field has been corrected.")
    }
  }
  
  const getFieldIcon = () => {
    if (Icon) return Icon
    
    const icons: Record<string, React.ElementType> = {
      email: Mail,
      tel: Phone,
      url: Globe,
      "street-address": MapPin,
      "given-name": User,
      "family-name": User,
      date: Calendar,
      card: CreditCard,
      postal: Hash,
      text: Type
    }
    
    return icons[fieldType] || Type
  }
  
  const FieldIcon = getFieldIcon()
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Label with required indicator */}
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
          {helper && !error && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{helper}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
        
        {/* Field metrics indicators */}
        {metrics.abandonmentRisk === "high" && (
          <Badge variant="destructive" className="text-xs">
            Need help?
          </Badge>
        )}
      </div>
      
      {/* Input field with icon and validation */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FieldIcon className="h-4 w-4" />
        </div>
        
        <Input
          ref={inputRef}
          id={name}
          type={fieldType === "password" && !showPassword ? "password" : "text"}
          value={localValue}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true)
            if (config.smartSuggestions) {
              setShowSuggestions(true)
            }
          }}
          onBlur={() => {
            setIsFocused(false)
            setTimeout(() => setShowSuggestions(false), 200)
            onBlur?.()
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={validation.status === "invalid" || !!error}
          aria-describedby={`${name}-error ${name}-helper`}
          className={cn(
            "pl-10 pr-10",
            validation.status === "valid" && "border-green-500 focus:ring-green-500",
            (validation.status === "invalid" || error) && "border-red-500 focus:ring-red-500",
            validation.status === "warning" && "border-yellow-500 focus:ring-yellow-500"
          )}
        />
        
        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Password toggle */}
          {fieldType === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
          
          {/* Validation status */}
          <AnimatePresence mode="wait">
            {validation.status === "validating" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              </motion.div>
            )}
            {validation.status === "valid" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
            {(validation.status === "invalid" || error) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg"
            >
              <div className="p-2 text-xs text-gray-500 border-b">
                <Sparkles className="inline h-3 w-3 mr-1" />
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Zap className="h-3 w-3 text-yellow-500" />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Character count for text areas */}
      {maxLength && (
        <div className="flex justify-between text-xs">
          <span className={cn(
            "text-gray-500",
            localValue.length >= maxLength * 0.9 && "text-orange-500",
            localValue.length >= maxLength && "text-red-500"
          )}>
            {localValue.length} / {maxLength}
          </span>
          {localValue.length >= maxLength * 0.9 && (
            <span className="text-orange-500">
              {maxLength - localValue.length} characters remaining
            </span>
          )}
        </div>
      )}
      
      {/* Validation message or error */}
      <AnimatePresence mode="wait">
        {(validation.message || error) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            id={`${name}-error`}
            className={cn(
              "text-xs flex items-start gap-1",
              validation.status === "valid" && "text-green-600",
              (validation.status === "invalid" || error) && "text-red-500",
              validation.status === "warning" && "text-yellow-600"
            )}
          >
            {validation.status === "invalid" || error ? (
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            ) : validation.status === "valid" ? (
              <Check className="h-3 w-3 mt-0.5 flex-shrink-0" />
            ) : null}
            <span>{error || validation.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error recovery button */}
      {config.errorRecovery && validation.status === "invalid" && validation.suggestions && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleErrorRecovery}
          disabled={isRecovering}
          className="text-xs"
        >
          {isRecovering ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Try auto-fix
        </Button>
      )}
      
      {/* Helper text */}
      {helper && !error && !validation.message && (
        <p id={`${name}-helper`} className="text-xs text-gray-500">
          {helper}
        </p>
      )}
      
      {/* Field quality indicator */}
      {validation.confidence && (
        <div className="flex items-center gap-2">
          <Progress value={validation.confidence} className="h-1" />
          <span className="text-xs text-gray-500">{validation.confidence}% confident</span>
        </div>
      )}
    </div>
  )
}

// Field dependency manager
export function useFieldDependencies(
  fields: Record<string, any>,
  dependencies: Record<string, string[]>
) {
  const [visibleFields, setVisibleFields] = React.useState<Set<string>>(new Set())
  const [requiredFields, setRequiredFields] = React.useState<Set<string>>(new Set())
  
  React.useEffect(() => {
    const newVisible = new Set<string>()
    const newRequired = new Set<string>()
    
    Object.entries(dependencies).forEach(([field, deps]) => {
      const shouldShow = deps.every(dep => {
        const [depField, depValue] = dep.split(":")
        return fields[depField] === (depValue || true)
      })
      
      if (shouldShow) {
        newVisible.add(field)
        if (deps.some(d => d.includes("required"))) {
          newRequired.add(field)
        }
      }
    })
    
    setVisibleFields(newVisible)
    setRequiredFields(newRequired)
  }, [fields, dependencies])
  
  return { visibleFields, requiredFields }
}

// Progressive disclosure component
export function ProgressiveDisclosureForm({
  sections,
  onComplete,
  className
}: {
  sections: Array<{
    id: string
    title: string
    fields: React.ReactNode
    optional?: boolean
    collapsed?: boolean
  }>
  onComplete: () => void
  className?: string
}) {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(sections.filter(s => !s.collapsed).map(s => s.id))
  )
  const [completedSections, setCompletedSections] = React.useState<Set<string>>(new Set())
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }
  
  const markComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]))
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-lg overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggleSection(section.id)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              {completedSections.has(section.id) ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <span className="font-medium">{section.title}</span>
              {section.optional && (
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              )}
            </div>
            <ArrowRight
              className={cn(
                "h-4 w-4 transition-transform",
                expandedSections.has(section.id) && "rotate-90"
              )}
            />
          </button>
          
          <AnimatePresence>
            {expandedSections.has(section.id) && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t">
                  {section.fields}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => markComplete(section.id)}
                    className="mt-4"
                  >
                    Mark as Complete
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      
      {completedSections.size === sections.filter(s => !s.optional).length && (
        <Button onClick={onComplete} className="w-full">
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  )
}