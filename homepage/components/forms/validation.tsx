"use client"

import * as React from "react"
import { z } from "zod"
import { useForm, UseFormReturn, FieldValues, Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Common validation schemas
export const ValidationSchemas = {
  email: z.string().email("Please enter a valid email address"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  
  url: z.string().url("Please enter a valid URL"),
  
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
  creditCard: z.string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Please enter a valid credit card number"),
  
  cvv: z.string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  
  postalCode: z.string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid postal code"),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
  
  time: z.string()
    .regex(/^\d{2}:\d{2}$/, "Please enter a valid time"),
}

// Validation message component
interface ValidationMessageProps {
  type?: "error" | "success" | "warning" | "info"
  message: string
  className?: string
}

export function ValidationMessage({ 
  type = "error", 
  message, 
  className 
}: ValidationMessageProps) {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle,
    info: Info
  }
  
  const colors = {
    error: "text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200",
    success: "text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200",
    warning: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200",
    info: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200"
  }
  
  const Icon = icons[type]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border text-sm",
        colors[type],
        className
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </motion.div>
  )
}

// Field error component
interface FieldErrorProps {
  error?: string
  className?: string
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null
  
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={cn("text-sm text-red-500 mt-1", className)}
    >
      {error}
    </motion.p>
  )
}

// Form validation summary
interface ValidationSummaryProps {
  errors: Record<string, any>
  className?: string
}

export function ValidationSummary({ errors, className }: ValidationSummaryProps) {
  const errorMessages = Object.entries(errors)
    .filter(([_, error]) => error?.message)
    .map(([field, error]) => ({
      field,
      message: error.message
    }))
  
  if (errorMessages.length === 0) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-900 dark:text-red-400">
            Please fix the following errors:
          </h3>
          <ul className="mt-2 space-y-1">
            {errorMessages.map(({ field, message }) => (
              <li key={field} className="text-sm text-red-700 dark:text-red-300">
                • {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// Real-time field validation hook
export function useFieldValidation<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: Path<T>,
  schema?: z.ZodSchema
) {
  const [isValidating, setIsValidating] = React.useState(false)
  const [fieldError, setFieldError] = React.useState<string | null>(null)
  const [isValid, setIsValid] = React.useState<boolean | null>(null)
  
  const validate = React.useCallback(async (value: any) => {
    if (!schema) return
    
    setIsValidating(true)
    try {
      await schema.parseAsync(value)
      setFieldError(null)
      setIsValid(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldError(error.errors[0]?.message || "Invalid value")
        setIsValid(false)
      }
    } finally {
      setIsValidating(false)
    }
  }, [schema])
  
  return {
    validate,
    isValidating,
    fieldError,
    isValid
  }
}

// Password strength indicator
interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const calculateStrength = (password: string) => {
    let strength = 0
    
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    return Math.min(strength, 5)
  }
  
  const strength = calculateStrength(password)
  
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong"
  ]
  
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-green-600"
  ]
  
  if (!password) return null
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all",
              i < strength ? strengthColors[strength] : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Password strength: <span className="font-medium">{strengthLabels[strength]}</span>
      </p>
    </div>
  )
}

// Form field wrapper with validation
interface ValidatedFieldProps {
  name: string
  label?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export function ValidatedField({
  name,
  label,
  required,
  error,
  hint,
  children,
  className
}: ValidatedFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      
      <AnimatePresence>
        {error && <FieldError error={error} />}
      </AnimatePresence>
    </div>
  )
}

// Inline validation component
interface InlineValidationProps {
  isValid?: boolean | null
  isValidating?: boolean
  successMessage?: string
  errorMessage?: string
}

export function InlineValidation({
  isValid,
  isValidating,
  successMessage = "Valid",
  errorMessage = "Invalid"
}: InlineValidationProps) {
  if (isValidating) {
    return (
      <span className="text-xs text-gray-500">Validating...</span>
    )
  }
  
  if (isValid === true) {
    return (
      <span className="text-xs text-green-500 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        {successMessage}
      </span>
    )
  }
  
  if (isValid === false) {
    return (
      <span className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {errorMessage}
      </span>
    )
  }
  
  return null
}

// Custom validation rules
export const CustomValidators = {
  matchField: (fieldName: string, message?: string) => {
    return (value: any, ctx: z.RefinementCtx) => {
      const form = (ctx as any).parent
      if (form && form[fieldName] !== value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: message || `Must match ${fieldName}`
        })
      }
    }
  },
  
  minAge: (minAge: number) => {
    return (value: string, ctx: z.RefinementCtx) => {
      const date = new Date(value)
      const today = new Date()
      const age = Math.floor((today.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      
      if (age < minAge) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Must be at least ${minAge} years old`
        })
      }
    }
  },
  
  futureDate: (message?: string) => {
    return (value: string, ctx: z.RefinementCtx) => {
      const date = new Date(value)
      const today = new Date()
      
      if (date <= today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: message || "Date must be in the future"
        })
      }
    }
  }
}