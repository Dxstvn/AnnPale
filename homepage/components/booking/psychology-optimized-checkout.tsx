"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Shield,
  Lock,
  CheckCircle,
  Heart,
  Star,
  Users,
  Clock,
  DollarSign,
  Gift,
  Calendar,
  CreditCard,
  Info,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  ThumbsUp,
  Smile,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Emotional state types
export type EmotionalState = "excitement" | "focused" | "anxious" | "cautious" | "relief"

// Checkout step configuration
export interface CheckoutStep {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  emotionalState: EmotionalState
  fields: FormField[]
  validation?: (data: any) => string | null
}

export interface FormField {
  id: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select" | "radio" | "checkbox" | "date"
  placeholder?: string
  required?: boolean
  autoComplete?: string
  maxLength?: number
  helper?: string
  options?: { value: string; label: string; recommended?: boolean }[]
  validation?: (value: any) => string | null
}

// Abandonment trigger detection
export interface AbandonmentTrigger {
  type: "idle" | "scroll_up" | "mouse_leave" | "form_hesitation" | "price_shock"
  timestamp: Date
  stepId: string
  resolved: boolean
}

// Trust signal configuration
export interface TrustSignal {
  icon: React.ElementType
  text: string
  highlight?: boolean
}

// Psychology-optimized checkout component
export function PsychologyOptimizedCheckout({
  steps,
  creatorName,
  price,
  onComplete,
  onAbandon,
  className
}: {
  steps: CheckoutStep[]
  creatorName: string
  price: { amount: number; currency: string; original?: number }
  onComplete: (data: any) => void
  onAbandon?: (trigger: AbandonmentTrigger) => void
  className?: string
}) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<any>({})
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})
  const [abandonmentTriggers, setAbandonmentTriggers] = React.useState<AbandonmentTrigger[]>([])
  const [showAbandonmentModal, setShowAbandonmentModal] = React.useState(false)
  const [lastActivity, setLastActivity] = React.useState(Date.now())
  
  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  
  // Idle detection for abandonment
  React.useEffect(() => {
    const idleTimer = setInterval(() => {
      if (Date.now() - lastActivity > 30000) { // 30 seconds idle
        handleAbandonmentTrigger({
          type: "idle",
          timestamp: new Date(),
          stepId: step.id,
          resolved: false
        })
      }
    }, 5000)
    
    return () => clearInterval(idleTimer)
  }, [lastActivity, step.id])
  
  // Mouse leave detection
  React.useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        handleAbandonmentTrigger({
          type: "mouse_leave",
          timestamp: new Date(),
          stepId: step.id,
          resolved: false
        })
      }
    }
    
    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [step.id])
  
  const handleAbandonmentTrigger = (trigger: AbandonmentTrigger) => {
    setAbandonmentTriggers(prev => [...prev, trigger])
    onAbandon?.(trigger)
    
    // Show intervention based on trigger type
    if (trigger.type === "mouse_leave" || trigger.type === "idle") {
      setShowAbandonmentModal(true)
    }
  }
  
  const handleFieldChange = (fieldId: string, value: any) => {
    setLastActivity(Date.now())
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }
  
  const validateStep = () => {
    const newErrors: { [key: string]: string } = {}
    
    // Validate required fields
    step.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`
      }
      
      // Field-specific validation
      if (field.validation) {
        const error = field.validation(formData[field.id])
        if (error) {
          newErrors[field.id] = error
        }
      }
    })
    
    // Step-level validation
    if (step.validation) {
      const error = step.validation(formData)
      if (error) {
        toast.error(error)
        return false
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        // Positive reinforcement
        const encouragements = [
          "Great choice!",
          "You're doing great!",
          "Almost there!",
          "Excellent!"
        ]
        toast.success(encouragements[Math.floor(Math.random() * encouragements.length)])
      } else {
        onComplete(formData)
      }
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress indicator with emotional feedback */}
      <ProgressIndicator
        progress={progress}
        currentStep={currentStep}
        totalSteps={steps.length}
        emotionalState={step.emotionalState}
      />
      
      {/* Trust signals bar */}
      <TrustSignalsBar price={price} creatorName={creatorName} />
      
      {/* Main checkout card */}
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                getEmotionalStateColor(step.emotionalState)
              )}>
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.subtitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Form fields with cognitive load management */}
            <CognitiveLoadOptimizedForm
              fields={step.fields}
              values={formData}
              errors={errors}
              onChange={handleFieldChange}
            />
            
            {/* Emotional state specific helpers */}
            <EmotionalStateHelper
              state={step.emotionalState}
              stepId={step.id}
              price={price}
              creatorName={creatorName}
            />
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(currentStep === 0 && "invisible")}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Complete Booking
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Abandonment prevention modal */}
      <AbandonmentPreventionModal
        isOpen={showAbandonmentModal}
        onClose={() => setShowAbandonmentModal(false)}
        onContinue={() => {
          setShowAbandonmentModal(false)
          // Mark trigger as resolved
          setAbandonmentTriggers(prev => 
            prev.map(t => ({ ...t, resolved: true }))
          )
        }}
        creatorName={creatorName}
        price={price}
      />
    </div>
  )
}

// Progress indicator with emotional feedback
function ProgressIndicator({
  progress,
  currentStep,
  totalSteps,
  emotionalState
}: {
  progress: number
  currentStep: number
  totalSteps: number
  emotionalState: EmotionalState
}) {
  const emotionalIcons = {
    excitement: Sparkles,
    focused: Eye,
    anxious: Shield,
    cautious: Info,
    relief: CheckCircle
  }
  
  const EmotionalIcon = emotionalIcons[emotionalState]
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EmotionalIcon className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {Math.round(progress)}% complete
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      {/* Step dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              i === currentStep
                ? "w-6 bg-purple-600"
                : i < currentStep
                ? "bg-purple-600"
                : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  )
}

// Trust signals bar
function TrustSignalsBar({
  price,
  creatorName
}: {
  price: { amount: number; currency: string; original?: number }
  creatorName: string
}) {
  const trustSignals: TrustSignal[] = [
    { icon: Lock, text: "Secure Checkout", highlight: true },
    { icon: Shield, text: "Money-back Guarantee" },
    { icon: Users, text: "5000+ Happy Customers" },
    { icon: Clock, text: "Instant Confirmation" }
  ]
  
  return (
    <div className="flex flex-wrap gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
      {trustSignals.map((signal, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-2 text-sm",
            signal.highlight
              ? "text-green-700 dark:text-green-300 font-medium"
              : "text-gray-600 dark:text-gray-400"
          )}
        >
          <signal.icon className="h-4 w-4" />
          <span>{signal.text}</span>
        </div>
      ))}
      
      {price.original && price.original > price.amount && (
        <Badge className="bg-red-500 text-white ml-auto">
          Save {price.currency}{price.original - price.amount}!
        </Badge>
      )}
    </div>
  )
}

// Cognitive load optimized form
function CognitiveLoadOptimizedForm({
  fields,
  values,
  errors,
  onChange
}: {
  fields: FormField[]
  values: any
  errors: { [key: string]: string }
  onChange: (fieldId: string, value: any) => void
}) {
  // Group fields by chunks of 3-5
  const chunks = React.useMemo(() => {
    const result: FormField[][] = []
    for (let i = 0; i < fields.length; i += 4) {
      result.push(fields.slice(i, i + 4))
    }
    return result
  }, [fields])
  
  return (
    <div className="space-y-6">
      {chunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="space-y-4">
          {chunkIndex > 0 && <div className="border-t pt-4" />}
          
          {chunk.map((field) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chunkIndex * 0.1 }}
            >
              <FormFieldRenderer
                field={field}
                value={values[field.id]}
                error={errors[field.id]}
                onChange={(value) => onChange(field.id, value)}
              />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Form field renderer
function FormFieldRenderer({
  field,
  value,
  error,
  onChange
}: {
  field: FormField
  value: any
  error?: string
  onChange: (value: any) => void
}) {
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <Input
            type={field.type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            maxLength={field.maxLength}
            className={cn(error && "border-red-500")}
          />
        )
      
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={cn(error && "border-red-500")}
          />
        )
      
      case "radio":
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                  {option.recommended && (
                    <Badge className="ml-2 text-xs">Recommended</Badge>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={onChange}
              id={field.id}
            />
            <Label htmlFor={field.id} className="cursor-pointer">
              {field.label}
            </Label>
          </div>
        )
      
      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={cn(error && "border-red-500")}
          />
        )
    }
  }
  
  if (field.type === "checkbox") {
    return renderField()
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.helper && !error && (
        <p className="text-xs text-gray-500">{field.helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

// Emotional state helper
function EmotionalStateHelper({
  state,
  stepId,
  price,
  creatorName
}: {
  state: EmotionalState
  stepId: string
  price: { amount: number; currency: string }
  creatorName: string
}) {
  const helpers = {
    excitement: {
      icon: Sparkles,
      message: `You're about to get a personalized video from ${creatorName}!`,
      color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20"
    },
    focused: {
      icon: Eye,
      message: "Take your time - we've saved your progress",
      color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20"
    },
    anxious: {
      icon: Shield,
      message: "Your payment is 100% secure and encrypted",
      color: "bg-green-50 text-green-700 dark:bg-green-900/20"
    },
    cautious: {
      icon: Info,
      message: "Review everything carefully - you can edit any section",
      color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20"
    },
    relief: {
      icon: CheckCircle,
      message: "All done! Your video will be ready soon",
      color: "bg-green-50 text-green-700 dark:bg-green-900/20"
    }
  }
  
  const helper = helpers[state]
  const Icon = helper.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("p-3 rounded-lg flex items-center gap-3", helper.color)}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{helper.message}</p>
    </motion.div>
  )
}

// Abandonment prevention modal
function AbandonmentPreventionModal({
  isOpen,
  onClose,
  onContinue,
  creatorName,
  price
}: {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  creatorName: string
  price: { amount: number; currency: string }
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Wait! Don't miss out
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You're so close to booking your personalized video from {creatorName}!
            </p>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                💝 Special offer: Complete your booking in the next 5 minutes and save 10%!
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              <span>23 other people are viewing this creator right now</span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Leave anyway
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Continue booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Helper function to get emotional state color
function getEmotionalStateColor(state: EmotionalState) {
  const colors = {
    excitement: "bg-purple-600",
    focused: "bg-blue-600",
    anxious: "bg-yellow-600",
    cautious: "bg-orange-600",
    relief: "bg-green-600"
  }
  return colors[state]
}

// Default checkout steps
export const defaultCheckoutSteps: CheckoutStep[] = [
  {
    id: "details",
    title: "Tell us about your video",
    subtitle: "Help the creator make it special",
    icon: Gift,
    emotionalState: "excitement",
    fields: [
      {
        id: "recipient_name",
        label: "Who is this video for?",
        type: "text",
        placeholder: "e.g., John Smith",
        required: true,
        helper: "The creator will mention this name"
      },
      {
        id: "occasion",
        label: "What's the occasion?",
        type: "radio",
        required: true,
        options: [
          { value: "birthday", label: "Birthday", recommended: true },
          { value: "anniversary", label: "Anniversary" },
          { value: "graduation", label: "Graduation" },
          { value: "encouragement", label: "Encouragement" },
          { value: "other", label: "Other" }
        ]
      },
      {
        id: "message",
        label: "Special instructions",
        type: "textarea",
        placeholder: "Any specific message or details you'd like included...",
        maxLength: 500,
        helper: "Optional - help make the video extra special"
      }
    ]
  },
  {
    id: "contact",
    title: "Your Information",
    subtitle: "So we can send you the video",
    icon: UserCheck,
    emotionalState: "focused",
    fields: [
      {
        id: "name",
        label: "Your name",
        type: "text",
        required: true,
        autoComplete: "name"
      },
      {
        id: "email",
        label: "Email address",
        type: "email",
        required: true,
        autoComplete: "email",
        helper: "We'll send the video link here"
      },
      {
        id: "phone",
        label: "Phone number",
        type: "tel",
        required: false,
        autoComplete: "tel",
        helper: "Optional - for order updates via SMS"
      },
      {
        id: "gift",
        label: "This is a gift for someone else",
        type: "checkbox"
      }
    ]
  },
  {
    id: "payment",
    title: "Secure Payment",
    subtitle: "Your information is encrypted and secure",
    icon: CreditCard,
    emotionalState: "anxious",
    fields: [
      {
        id: "payment_method",
        label: "Payment method",
        type: "radio",
        required: true,
        options: [
          { value: "card", label: "Credit/Debit Card", recommended: true },
          { value: "paypal", label: "PayPal" },
          { value: "apple_pay", label: "Apple Pay" }
        ]
      }
    ]
  },
  {
    id: "review",
    title: "Review Your Order",
    subtitle: "Make sure everything looks good",
    icon: CheckCircle,
    emotionalState: "cautious",
    fields: []
  }
]