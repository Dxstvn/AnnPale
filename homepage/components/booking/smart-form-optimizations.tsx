"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Check,
  X,
  Info,
  Eye,
  EyeOff,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Zap,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Auto-complete suggestions for common fields
const autoCompleteSuggestions = {
  occasion: [
    "Birthday",
    "Anniversary",
    "Graduation",
    "Wedding",
    "Congratulations",
    "Get Well Soon",
    "Thank You",
    "Just Because"
  ],
  relationship: [
    "Parent",
    "Spouse",
    "Child",
    "Friend",
    "Sibling",
    "Grandparent",
    "Colleague",
    "Partner"
  ]
}

// Smart input with real-time validation
export function SmartInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  helper,
  required,
  autoComplete,
  placeholder,
  maxLength,
  showStrength = false,
  showSuggestions = false,
  suggestions = [],
  onSuggestionSelect,
  className
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  helper?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  maxLength?: number
  showStrength?: boolean
  showSuggestions?: boolean
  suggestions?: string[]
  onSuggestionSelect?: (value: string) => void
  className?: string
}) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = React.useState(false)
  
  // Real-time validation
  const getValidationState = () => {
    if (!value) return null
    if (isValidating) return "validating"
    if (error) return "error"
    if (value.length > 2) return "success"
    return null
  }
  
  const validationState = getValidationState()
  
  // Password strength calculation
  const getPasswordStrength = () => {
    if (!value) return 0
    let strength = 0
    if (value.length >= 8) strength++
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++
    if (/\d/.test(value)) strength++
    if (/[^a-zA-Z0-9]/.test(value)) strength++
    return strength
  }
  
  const passwordStrength = type === "password" ? getPasswordStrength() : 0
  
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
  
  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(value.toLowerCase())
  )
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {helper && !error && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="inline h-3 w-3 ml-1 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{helper}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Label>
      
      <div className="relative">
        <Input
          id={label}
          type={showPassword ? "text" : type}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            if (showSuggestions) {
              setShowSuggestionsDropdown(true)
            }
          }}
          onFocus={() => {
            setIsFocused(true)
            if (showSuggestions && value) {
              setShowSuggestionsDropdown(true)
            }
          }}
          onBlur={() => {
            setIsFocused(false)
            setTimeout(() => setShowSuggestionsDropdown(false), 200)
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={cn(
            "pr-10 transition-all",
            validationState === "error" && "border-red-500 focus:ring-red-500",
            validationState === "success" && "border-green-500 focus:ring-green-500",
            isFocused && "ring-2 ring-purple-500"
          )}
        />
        
        {/* Validation icon */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {type === "password" && (
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
          
          <AnimatePresence mode="wait">
            {validationState === "validating" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              </motion.div>
            )}
            {validationState === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <X className="h-4 w-4 text-red-500" />
              </motion.div>
            )}
            {validationState === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestionsDropdown && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg"
            >
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    onChange(suggestion)
                    onSuggestionSelect?.(suggestion)
                    setShowSuggestionsDropdown(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Character count */}
      {maxLength && (
        <div className="flex justify-between text-xs">
          <span className={cn(
            "text-gray-500",
            value.length >= maxLength && "text-red-500"
          )}>
            {value.length} / {maxLength}
          </span>
        </div>
      )}
      
      {/* Password strength indicator */}
      {showStrength && type === "password" && value && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all",
                  i < passwordStrength
                    ? strengthColors[passwordStrength - 1]
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Password strength: {strengthLabels[passwordStrength - 1] || "None"}
          </p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Smart date picker with availability
export function SmartDatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  required,
  error,
  helper,
  className
}: {
  label: string
  value: Date | undefined
  onChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  highlightedDates?: Array<{ date: Date; label: string; color: string }>
  required?: boolean
  error?: string
  helper?: string
  className?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? value.toLocaleDateString() : "Select date"}
        </Button>
        
        {/* Quick date options */}
        <div className="mt-2 flex gap-2">
          {["Today", "Tomorrow", "Next Week"].map((option) => (
            <Badge
              key={option}
              variant="outline"
              className="cursor-pointer hover:bg-purple-50"
              onClick={() => {
                const date = new Date()
                if (option === "Tomorrow") {
                  date.setDate(date.getDate() + 1)
                } else if (option === "Next Week") {
                  date.setDate(date.getDate() + 7)
                }
                onChange(date)
              }}
            >
              {option}
            </Badge>
          ))}
        </div>
      </div>
      
      {helper && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

// Smart phone input with formatting
export function SmartPhoneInput({
  label,
  value,
  onChange,
  country = "US",
  required,
  error,
  helper,
  className
}: {
  label: string
  value: string
  onChange: (value: string) => void
  country?: string
  required?: boolean
  error?: string
  helper?: string
  className?: string
}) {
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    const cleaned = input.replace(/\D/g, "")
    
    // Format based on country (US example)
    if (country === "US") {
      if (cleaned.length <= 3) {
        return cleaned
      } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
      }
    }
    
    return cleaned
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    onChange(formatted)
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id={label}
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          className={cn(
            "pl-10",
            error && "border-red-500"
          )}
          maxLength={14} // US phone format length
        />
      </div>
      
      {helper && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

// Guest checkout option
export function GuestCheckoutOption({
  onGuestCheckout,
  onCreateAccount,
  className
}: {
  onGuestCheckout: () => void
  onCreateAccount: () => void
  className?: string
}) {
  return (
    <div className={cn("space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", className)}>
      <div className="text-center space-y-2">
        <h3 className="font-medium">Checkout Options</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose how you'd like to proceed
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={onGuestCheckout}
          variant="outline"
          className="flex flex-col items-center py-4"
        >
          <Zap className="h-5 w-5 mb-2 text-purple-600" />
          <span className="font-medium">Guest Checkout</span>
          <span className="text-xs text-gray-500">Quick & easy</span>
        </Button>
        
        <Button
          onClick={onCreateAccount}
          className="flex flex-col items-center py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        >
          <User className="h-5 w-5 mb-2" />
          <span className="font-medium">Create Account</span>
          <span className="text-xs opacity-90">Track orders & save time</span>
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Already have an account?{" "}
          <button className="text-purple-600 hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

// One-click checkout buttons
export function OneClickCheckout({
  methods,
  onCheckout,
  className
}: {
  methods: Array<{
    id: string
    name: string
    icon: React.ElementType
    color: string
  }>
  onCheckout: (method: string) => void
  className?: string
}) {
  const defaultMethods = methods.length > 0 ? methods : [
    { id: "apple_pay", name: "Apple Pay", icon: CreditCard, color: "bg-black text-white" },
    { id: "google_pay", name: "Google Pay", icon: CreditCard, color: "bg-blue-600 text-white" },
    { id: "paypal", name: "PayPal", icon: CreditCard, color: "bg-yellow-400 text-black" }
  ]
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium">Express Checkout</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {defaultMethods.map((method) => {
          const Icon = method.icon
          return (
            <Button
              key={method.id}
              onClick={() => onCheckout(method.id)}
              className={cn("w-full justify-center", method.color)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {method.name}
            </Button>
          )
        })}
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
            Or continue with form
          </span>
        </div>
      </div>
    </div>
  )
}

// Smart defaults based on user behavior
export function useSmartDefaults(userId?: string) {
  const [defaults, setDefaults] = React.useState<{ [key: string]: any }>({})
  
  React.useEffect(() => {
    // Load saved preferences from localStorage
    if (userId) {
      const saved = localStorage.getItem(`checkout_defaults_${userId}`)
      if (saved) {
        setDefaults(JSON.parse(saved))
      }
    }
    
    // Set smart defaults based on context
    setDefaults(prev => ({
      ...prev,
      country: Intl.DateTimeFormat().resolvedOptions().timeZone.includes("America") ? "US" : "Other",
      language: navigator.language.split("-")[0],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }))
  }, [userId])
  
  const saveDefault = (key: string, value: any) => {
    const updated = { ...defaults, [key]: value }
    setDefaults(updated)
    
    if (userId) {
      localStorage.setItem(`checkout_defaults_${userId}`, JSON.stringify(updated))
    }
  }
  
  return { defaults, saveDefault }
}