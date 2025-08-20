"use client"

import * as React from "react"
import { Input, InputProps } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { 
  Mail, 
  Phone, 
  Globe, 
  DollarSign, 
  Euro,
  Hash,
  Calendar,
  Clock,
  CreditCard,
  Percent,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react"

// Email Input with validation
export interface EmailInputProps extends Omit<InputProps, 'type'> {
  validateOnBlur?: boolean
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ validateOnBlur = true, onBlur, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState<boolean | null>(null)
    
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur && e.target.value) {
        setIsValid(validateEmail(e.target.value))
      }
      onBlur?.(e)
    }
    
    return (
      <Input
        ref={ref}
        type="email"
        leftIcon={<Mail className="h-4 w-4" />}
        error={isValid === false ? "Please enter a valid email address" : props.error}
        success={isValid === true ? "Valid email" : props.success}
        onBlur={handleBlur}
        {...props}
      />
    )
  }
)
EmailInput.displayName = "EmailInput"

// Phone Input with formatting
export interface PhoneInputProps extends Omit<InputProps, 'type'> {
  country?: "US" | "HT" | "FR" | "CA"
  formatOnChange?: boolean
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ country = "US", formatOnChange = true, onChange, ...props }, ref) => {
    const formatPhone = (value: string, country: string) => {
      const cleaned = value.replace(/\D/g, '')
      
      if (country === "US" || country === "CA") {
        if (cleaned.length <= 3) return cleaned
        if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
      }
      
      return cleaned
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (formatOnChange) {
        const formatted = formatPhone(e.target.value, country)
        e.target.value = formatted
      }
      onChange?.(e)
    }
    
    const countryCode = {
      US: "+1",
      CA: "+1", 
      HT: "+509",
      FR: "+33"
    }
    
    return (
      <div className="flex gap-2">
        <div className="flex items-center px-3 bg-gray-50 dark:bg-gray-800 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700">
          <span className="text-sm font-medium">{countryCode[country]}</span>
        </div>
        <Input
          ref={ref}
          type="tel"
          leftIcon={<Phone className="h-4 w-4" />}
          onChange={handleChange}
          placeholder={country === "US" ? "(555) 555-5555" : "Phone number"}
          {...props}
        />
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

// URL Input with protocol handling
export interface URLInputProps extends Omit<InputProps, 'type'> {
  requireProtocol?: boolean
  allowedProtocols?: string[]
}

export const URLInput = React.forwardRef<HTMLInputElement, URLInputProps>(
  ({ requireProtocol = true, allowedProtocols = ["http", "https"], onBlur, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState<boolean | null>(null)
    
    const validateURL = (url: string) => {
      try {
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
        if (requireProtocol && !allowedProtocols.includes(urlObj.protocol.slice(0, -1))) {
          return false
        }
        return true
      } catch {
        return false
      }
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value) {
        setIsValid(validateURL(e.target.value))
      }
      onBlur?.(e)
    }
    
    return (
      <Input
        ref={ref}
        type="url"
        leftIcon={<Globe className="h-4 w-4" />}
        error={isValid === false ? "Please enter a valid URL" : props.error}
        success={isValid === true ? "Valid URL" : props.success}
        onBlur={handleBlur}
        placeholder="https://example.com"
        {...props}
      />
    )
  }
)
URLInput.displayName = "URLInput"

// Currency Input with formatting
export interface CurrencyInputProps extends Omit<InputProps, 'type'> {
  currency?: "USD" | "EUR" | "HTG"
  min?: number
  max?: number
  allowNegative?: boolean
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ currency = "USD", min, max, allowNegative = false, onChange, onBlur, ...props }, ref) => {
    const currencySymbol = {
      USD: "$",
      EUR: "€",
      HTG: "G"
    }
    
    const formatCurrency = (value: string) => {
      let num = parseFloat(value.replace(/[^0-9.-]/g, ''))
      if (isNaN(num)) return ''
      
      if (!allowNegative && num < 0) num = 0
      if (min !== undefined && num < min) num = min
      if (max !== undefined && num > max) num = max
      
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.value = formatCurrency(e.target.value)
      onBlur?.(e)
    }
    
    const Icon = currency === "EUR" ? Euro : DollarSign
    
    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        leftIcon={<Icon className="h-4 w-4" />}
        onBlur={handleBlur}
        placeholder={`0.00`}
        {...props}
      />
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

// Number Input with increment/decrement
export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number
  max?: number
  step?: number
  showControls?: boolean
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step = 1, showControls = true, value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || 0)
    
    const increment = () => {
      const newValue = Number(internalValue) + step
      if (max !== undefined && newValue > max) return
      
      const syntheticEvent = {
        target: { value: String(newValue) }
      } as React.ChangeEvent<HTMLInputElement>
      
      setInternalValue(newValue)
      onChange?.(syntheticEvent)
    }
    
    const decrement = () => {
      const newValue = Number(internalValue) - step
      if (min !== undefined && newValue < min) return
      
      const syntheticEvent = {
        target: { value: String(newValue) }
      } as React.ChangeEvent<HTMLInputElement>
      
      setInternalValue(newValue)
      onChange?.(syntheticEvent)
    }
    
    React.useEffect(() => {
      setInternalValue(value || 0)
    }, [value])
    
    if (!showControls) {
      return (
        <Input
          ref={ref}
          type="number"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={(e) => {
            setInternalValue(e.target.value)
            onChange?.(e)
          }}
          leftIcon={<Hash className="h-4 w-4" />}
          {...props}
        />
      )
    }
    
    return (
      <div className="flex">
        <button
          type="button"
          onClick={decrement}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          disabled={min !== undefined && Number(internalValue) <= min}
        >
          -
        </button>
        <Input
          ref={ref}
          type="number"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={(e) => {
            setInternalValue(e.target.value)
            onChange?.(e)
          }}
          className="rounded-none text-center"
          {...props}
        />
        <button
          type="button"
          onClick={increment}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          disabled={max !== undefined && Number(internalValue) >= max}
        >
          +
        </button>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

// Date Input with calendar icon
export interface DateInputProps extends Omit<InputProps, 'type'> {
  min?: string
  max?: string
  showIcon?: boolean
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ min, max, showIcon = true, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        min={min}
        max={max}
        leftIcon={showIcon ? <Calendar className="h-4 w-4" /> : undefined}
        {...props}
      />
    )
  }
)
DateInput.displayName = "DateInput"

// Time Input
export interface TimeInputProps extends Omit<InputProps, 'type'> {
  min?: string
  max?: string
  showIcon?: boolean
  step?: number
}

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ min, max, showIcon = true, step = 60, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="time"
        min={min}
        max={max}
        step={step}
        leftIcon={showIcon ? <Clock className="h-4 w-4" /> : undefined}
        {...props}
      />
    )
  }
)
TimeInput.displayName = "TimeInput"

// Credit Card Input with formatting
export interface CreditCardInputProps extends Omit<InputProps, 'type'> {
  formatOnChange?: boolean
}

export const CreditCardInput = React.forwardRef<HTMLInputElement, CreditCardInputProps>(
  ({ formatOnChange = true, onChange, ...props }, ref) => {
    const formatCardNumber = (value: string) => {
      const cleaned = value.replace(/\s/g, '')
      const chunks = cleaned.match(/.{1,4}/g) || []
      return chunks.join(' ').substr(0, 19)
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (formatOnChange) {
        e.target.value = formatCardNumber(e.target.value)
      }
      onChange?.(e)
    }
    
    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        leftIcon={<CreditCard className="h-4 w-4" />}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        {...props}
      />
    )
  }
)
CreditCardInput.displayName = "CreditCardInput"

// Percentage Input
export interface PercentageInputProps extends Omit<InputProps, 'type'> {
  min?: number
  max?: number
  decimals?: number
}

export const PercentageInput = React.forwardRef<HTMLInputElement, PercentageInputProps>(
  ({ min = 0, max = 100, decimals = 0, onChange, onBlur, ...props }, ref) => {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let value = parseFloat(e.target.value)
      if (isNaN(value)) value = 0
      if (value < min) value = min
      if (value > max) value = max
      
      e.target.value = value.toFixed(decimals)
      onBlur?.(e)
    }
    
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="number"
          min={min}
          max={max}
          step={decimals > 0 ? Math.pow(10, -decimals) : 1}
          leftIcon={<Percent className="h-4 w-4" />}
          onBlur={handleBlur}
          {...props}
        />
      </div>
    )
  }
)
PercentageInput.displayName = "PercentageInput"

// Tag Input for multiple values
export interface TagInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value = [], onChange, placeholder = "Add tag...", maxTags, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState("")
    const [tags, setTags] = React.useState<string[]>(value)
    
    React.useEffect(() => {
      setTags(value)
    }, [value])
    
    const addTag = (tag: string) => {
      const trimmed = tag.trim()
      if (trimmed && !tags.includes(trimmed)) {
        if (maxTags && tags.length >= maxTags) return
        
        const newTags = [...tags, trimmed]
        setTags(newTags)
        onChange?.(newTags)
        setInputValue("")
      }
    }
    
    const removeTag = (index: number) => {
      const newTags = tags.filter((_, i) => i !== index)
      setTags(newTags)
      onChange?.(newTags)
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        addTag(inputValue)
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1)
      }
    }
    
    return (
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:border-purple-500">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-sm"
          >
            <Tag className="h-3 w-3" />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={maxTags ? tags.length >= maxTags : false}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          {...props}
        />
      </div>
    )
  }
)
TagInput.displayName = "TagInput"

// Location Input with geolocation
export interface LocationInputProps extends InputProps {
  enableGeolocation?: boolean
  onLocationSelect?: (coords: { lat: number; lng: number }) => void
}

export const LocationInput = React.forwardRef<HTMLInputElement, LocationInputProps>(
  ({ enableGeolocation = false, onLocationSelect, ...props }, ref) => {
    const [loading, setLoading] = React.useState(false)
    
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser")
        return
      }
      
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationSelect?.({ lat: latitude, lng: longitude })
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLoading(false)
        }
      )
    }
    
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          leftIcon={<MapPin className="h-4 w-4" />}
          disabled={loading}
          {...props}
        />
        {enableGeolocation && (
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700"
          >
            {loading ? "Getting location..." : "Use my location"}
          </button>
        )}
      </div>
    )
  }
)
LocationInput.displayName = "LocationInput"