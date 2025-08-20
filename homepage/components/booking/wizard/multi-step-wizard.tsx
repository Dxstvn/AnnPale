"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
  ChevronRight,
  ChevronLeft,
  Check,
  Circle,
  AlertCircle,
  Save,
  X,
  SkipForward,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Step configuration types
export interface WizardStep {
  id: string
  title: string
  subtitle?: string
  icon?: React.ElementType
  component: React.ComponentType<StepComponentProps>
  validation?: (data: any) => ValidationResult
  isOptional?: boolean
  skipCondition?: (data: any) => boolean
  onEnter?: (data: any) => void
  onExit?: (data: any) => void
  helpText?: string
  cognitiveLoad?: "low" | "medium" | "high"
}

export interface StepComponentProps {
  data: any
  updateData: (updates: any) => void
  errors?: Record<string, string>
  isActive: boolean
  stepConfig?: any
}

export interface ValidationResult {
  isValid: boolean
  errors?: Record<string, string>
  warnings?: Record<string, string>
}

export interface WizardConfig {
  steps: WizardStep[]
  initialData?: any
  onComplete: (data: any) => void | Promise<void>
  onSaveDraft?: (data: any) => void
  onCancel?: () => void
  allowSkip?: boolean
  allowSaveDraft?: boolean
  showProgressBar?: boolean
  progressVariant?: "bar" | "dots" | "numbered" | "steps"
  mobileOptimized?: boolean
  persistKey?: string // For localStorage persistence
  analyticsTracking?: boolean
}

// Main Multi-Step Wizard Component
export function MultiStepWizard({
  steps,
  initialData = {},
  onComplete,
  onSaveDraft,
  onCancel,
  allowSkip = false,
  allowSaveDraft = true,
  showProgressBar = true,
  progressVariant = "bar",
  mobileOptimized = false,
  persistKey,
  analyticsTracking = false
}: WizardConfig) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [wizardData, setWizardData] = React.useState(initialData)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [visitedSteps, setVisitedSteps] = React.useState<Set<number>>(new Set([0]))
  const [isValidating, setIsValidating] = React.useState(false)
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())
  
  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  
  // Load saved draft on mount
  React.useEffect(() => {
    if (persistKey) {
      const savedData = localStorage.getItem(`wizard_draft_${persistKey}`)
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setWizardData(parsed.data)
          setCurrentStep(parsed.step || 0)
          setVisitedSteps(new Set(parsed.visitedSteps || [0]))
          toast.info("Draft loaded from previous session")
        } catch (e) {
          console.error("Failed to load draft:", e)
        }
      }
    }
  }, [persistKey])
  
  // Auto-save draft
  React.useEffect(() => {
    if (persistKey && allowSaveDraft) {
      const saveTimer = setTimeout(() => {
        const draftData = {
          data: wizardData,
          step: currentStep,
          visitedSteps: Array.from(visitedSteps),
          timestamp: Date.now()
        }
        localStorage.setItem(`wizard_draft_${persistKey}`, JSON.stringify(draftData))
      }, 1000)
      
      return () => clearTimeout(saveTimer)
    }
  }, [wizardData, currentStep, visitedSteps, persistKey, allowSaveDraft])
  
  // Track analytics
  React.useEffect(() => {
    if (analyticsTracking) {
      // Track step view
      console.log("Analytics: Step viewed", {
        step: step.id,
        stepNumber: currentStep + 1,
        totalSteps: steps.length
      })
    }
  }, [currentStep, analyticsTracking, step.id, steps.length])
  
  const updateData = React.useCallback((updates: any) => {
    setWizardData(prev => ({
      ...prev,
      ...updates
    }))
    // Clear errors when data changes
    setErrors({})
  }, [])
  
  const validateStep = async () => {
    if (!step.validation) return true
    
    setIsValidating(true)
    try {
      const result = await Promise.resolve(step.validation(wizardData))
      
      if (!result.isValid) {
        setErrors(result.errors || {})
        if (result.warnings) {
          Object.entries(result.warnings).forEach(([, warning]) => {
            toast.warning(warning)
          })
        }
      }
      
      return result.isValid
    } finally {
      setIsValidating(false)
    }
  }
  
  const canSkipStep = () => {
    if (!allowSkip) return false
    if (step.isOptional) return true
    if (step.skipCondition) {
      return step.skipCondition(wizardData)
    }
    return false
  }
  
  const handleNext = async () => {
    const isValid = await validateStep()
    
    if (!isValid && !canSkipStep()) {
      toast.error("Please fix the errors before continuing")
      return
    }
    
    // Call onExit hook
    if (step.onExit) {
      step.onExit(wizardData)
    }
    
    // Mark step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    
    if (isLastStep) {
      handleComplete()
    } else {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setVisitedSteps(prev => new Set([...prev, nextStep]))
      
      // Call onEnter hook for next step
      if (steps[nextStep].onEnter) {
        steps[nextStep].onEnter(wizardData)
      }
      
      // Show encouragement
      if (completedSteps.size > 0) {
        const encouragements = [
          "Great progress!",
          "You're doing great!",
          "Almost there!",
          "Keep going!"
        ]
        toast.success(encouragements[Math.floor(Math.random() * encouragements.length)])
      }
    }
  }
  
  const handlePrevious = () => {
    if (!isFirstStep) {
      // Call onExit hook
      if (step.onExit) {
        step.onExit(wizardData)
      }
      
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      
      // Call onEnter hook for previous step
      if (steps[prevStep].onEnter) {
        steps[prevStep].onEnter(wizardData)
      }
    }
  }
  
  const handleSkip = () => {
    if (canSkipStep()) {
      toast.info(`Skipped ${step.title}`)
      handleNext()
    }
  }
  
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(wizardData)
      toast.success("Draft saved successfully")
    }
    
    if (persistKey) {
      const draftData = {
        data: wizardData,
        step: currentStep,
        visitedSteps: Array.from(visitedSteps),
        timestamp: Date.now()
      }
      localStorage.setItem(`wizard_draft_${persistKey}`, JSON.stringify(draftData))
      toast.success("Draft saved locally")
    }
  }
  
  const handleCancel = () => {
    if (visitedSteps.size > 1 || Object.keys(wizardData).length > Object.keys(initialData).length) {
      setShowCancelDialog(true)
    } else {
      if (onCancel) onCancel()
    }
  }
  
  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      await onComplete(wizardData)
      
      // Clear draft if saved
      if (persistKey) {
        localStorage.removeItem(`wizard_draft_${persistKey}`)
      }
      
      // Track completion
      if (analyticsTracking) {
        console.log("Analytics: Wizard completed", {
          steps: steps.length,
          data: wizardData
        })
      }
    } catch (error) {
      console.error("Failed to complete wizard:", error)
      toast.error("Failed to complete. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const goToStep = (stepIndex: number) => {
    if (visitedSteps.has(stepIndex) || stepIndex === 0) {
      // Call onExit hook
      if (step.onExit) {
        step.onExit(wizardData)
      }
      
      setCurrentStep(stepIndex)
      
      // Call onEnter hook
      if (steps[stepIndex].onEnter) {
        steps[stepIndex].onEnter(wizardData)
      }
    }
  }
  
  const StepComponent = step.component
  
  return (
    <div className={cn(
      "space-y-6",
      mobileOptimized && "px-4 py-6 sm:p-0"
    )}>
      {/* Progress Indicator */}
      {showProgressBar && (
        <WizardProgress
          steps={steps}
          currentStep={currentStep}
          visitedSteps={visitedSteps}
          completedSteps={completedSteps}
          variant={progressVariant}
          onStepClick={goToStep}
          progress={progress}
        />
      )}
      
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {step.icon && <step.icon className="h-5 w-5" />}
                    {step.title}
                    {step.isOptional && (
                      <Badge variant="secondary" className="ml-2">Optional</Badge>
                    )}
                  </CardTitle>
                  {step.subtitle && (
                    <CardDescription className="mt-1">
                      {step.subtitle}
                    </CardDescription>
                  )}
                </div>
                {step.cognitiveLoad && (
                  <CognitiveLoadIndicator load={step.cognitiveLoad} />
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <StepComponent
                data={wizardData}
                updateData={updateData}
                errors={errors}
                isActive={true}
                stepConfig={step}
              />
              
              {step.helpText && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {step.helpText}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Controls */}
      <WizardNavigation
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canSkip={canSkipStep()}
        isValidating={isValidating}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSkip={handleSkip}
        onSaveDraft={allowSaveDraft ? handleSaveDraft : undefined}
        onCancel={handleCancel}
      />
      
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save your progress as a draft before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Continue Editing
            </AlertDialogCancel>
            {allowSaveDraft && (
              <AlertDialogAction
                onClick={() => {
                  handleSaveDraft()
                  if (onCancel) onCancel()
                }}
              >
                Save Draft & Exit
              </AlertDialogAction>
            )}
            <AlertDialogAction
              onClick={() => {
                if (onCancel) onCancel()
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Exit Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Progress Indicator Component
function WizardProgress({
  steps,
  currentStep,
  visitedSteps,
  completedSteps,
  variant,
  onStepClick,
  progress
}: {
  steps: WizardStep[]
  currentStep: number
  visitedSteps: Set<number>
  completedSteps: Set<number>
  variant: "bar" | "dots" | "numbered" | "steps"
  onStepClick: (step: number) => void
  progress: number
}) {
  if (variant === "bar") {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    )
  }
  
  if (variant === "dots") {
    return (
      <div className="flex justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepClick(index)}
            disabled={!visitedSteps.has(index) && index !== 0}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              completedSteps.has(index)
                ? "w-6 bg-green-600"
                : index === currentStep
                ? "w-6 bg-purple-600"
                : visitedSteps.has(index)
                ? "bg-gray-400"
                : "bg-gray-300"
            )}
          />
        ))}
      </div>
    )
  }
  
  if (variant === "numbered") {
    return (
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            disabled={!visitedSteps.has(index) && index !== 0}
            className={cn(
              "flex items-center gap-2 text-sm",
              index !== steps.length - 1 && "flex-1"
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center font-medium transition-all",
                completedSteps.has(index)
                  ? "bg-green-600 text-white"
                  : index === currentStep
                  ? "bg-purple-600 text-white ring-4 ring-purple-100"
                  : visitedSteps.has(index)
                  ? "bg-gray-200 text-gray-600"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {completedSteps.has(index) ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  completedSteps.has(index)
                    ? "bg-green-600"
                    : visitedSteps.has(index)
                    ? "bg-gray-300"
                    : "bg-gray-200"
                )}
              />
            )}
          </button>
        ))}
      </div>
    )
  }
  
  // Default: steps variant
  return (
    <div className="flex items-center justify-between overflow-x-auto">
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onStepClick(index)}
          disabled={!visitedSteps.has(index) && index !== 0}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap",
            index === currentStep
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30"
              : visitedSteps.has(index)
              ? "hover:bg-gray-100 dark:hover:bg-gray-800"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <div
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium",
              completedSteps.has(index)
                ? "bg-green-600 text-white"
                : index === currentStep
                ? "bg-purple-600 text-white"
                : "bg-gray-300 text-gray-600"
            )}
          >
            {completedSteps.has(index) ? (
              <Check className="h-3 w-3" />
            ) : (
              index + 1
            )}
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            {step.title}
          </span>
        </button>
      ))}
    </div>
  )
}

// Navigation Controls Component
function WizardNavigation({
  isFirstStep,
  isLastStep,
  canSkip,
  isValidating,
  isSubmitting,
  onPrevious,
  onNext,
  onSkip,
  onSaveDraft,
  onCancel
}: {
  isFirstStep: boolean
  isLastStep: boolean
  canSkip: boolean
  isValidating: boolean
  isSubmitting: boolean
  onPrevious: () => void
  onNext: () => void
  onSkip: () => void
  onSaveDraft?: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isValidating || isSubmitting}
        >
          <X className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Cancel</span>
        </Button>
        
        {onSaveDraft && (
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={isValidating || isSubmitting}
          >
            <Save className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Save Draft</span>
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isValidating || isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        )}
        
        {canSkip && !isLastStep && (
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={isValidating || isSubmitting}
          >
            <SkipForward className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Skip</span>
          </Button>
        )}
        
        <Button
          onClick={onNext}
          disabled={isValidating || isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        >
          {isValidating || isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isLastStep ? (
            <>
              Complete
              <Check className="h-4 w-4 sm:ml-2" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Continue</span>
              <ChevronRight className="h-4 w-4 sm:ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Cognitive Load Indicator
function CognitiveLoadIndicator({ load }: { load: "low" | "medium" | "high" }) {
  const indicators = {
    low: { dots: 1, color: "bg-green-500", label: "Quick" },
    medium: { dots: 2, color: "bg-yellow-500", label: "Moderate" },
    high: { dots: 3, color: "bg-orange-500", label: "Detailed" }
  }
  
  const config = indicators[load]
  
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full",
            i < config.dots ? config.color : "bg-gray-300"
          )}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{config.label}</span>
    </div>
  )
}