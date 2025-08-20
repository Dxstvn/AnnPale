"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Form section component
interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  className
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// Form row for side-by-side fields
interface FormRowProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function FormRow({
  children,
  className,
  columns = 2
}: FormRowProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  }
  
  return (
    <div className={cn(
      "grid gap-4",
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  )
}

// Form actions footer
interface FormActionsProps {
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
  primaryLoading?: boolean
  primaryDisabled?: boolean
  align?: "left" | "center" | "right" | "between"
  className?: string
}

export function FormActions({
  primaryLabel = "Submit",
  secondaryLabel = "Cancel",
  onPrimary,
  onSecondary,
  primaryLoading = false,
  primaryDisabled = false,
  align = "right",
  className
}: FormActionsProps) {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  }
  
  return (
    <div className={cn(
      "flex gap-3",
      alignClasses[align],
      className
    )}>
      {onSecondary && (
        <Button
          type="button"
          variant="outline"
          onClick={onSecondary}
          disabled={primaryLoading}
        >
          {secondaryLabel}
        </Button>
      )}
      {onPrimary && (
        <Button
          type="submit"
          variant="primary"
          onClick={onPrimary}
          disabled={primaryDisabled || primaryLoading}
        >
          {primaryLoading && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          {primaryLabel}
        </Button>
      )}
    </div>
  )
}

// Multi-step form progress
interface FormProgressProps {
  steps: { label: string; description?: string }[]
  currentStep: number
  variant?: "dots" | "bar" | "numbered"
  className?: string
}

export function FormProgress({
  steps,
  currentStep,
  variant = "numbered",
  className
}: FormProgressProps) {
  if (variant === "dots") {
    return (
      <div className={cn("flex justify-center gap-2", className)}>
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              index <= currentStep 
                ? "bg-purple-600 w-8" 
                : "bg-gray-300 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
    )
  }
  
  if (variant === "bar") {
    const progress = ((currentStep + 1) / steps.length) * 100
    
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="font-medium">
            {steps[currentStep].label}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    )
  }
  
  // Numbered steps (default)
  return (
    <div className={cn("relative", className)}>
      {/* Progress line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full bg-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep
          
          return (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center",
                index === 0 && "items-start",
                index === steps.length - 1 && "items-end"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                  isCompleted && "bg-purple-600 text-white",
                  isCurrent && "bg-purple-600 text-white ring-4 ring-purple-200 dark:ring-purple-800",
                  isUpcoming && "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className={cn(
                "mt-2 text-center",
                index === 0 && "text-left",
                index === steps.length - 1 && "text-right"
              )}>
                <p className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-purple-600" : "text-gray-900 dark:text-gray-100"
                )}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Multi-step form container
interface MultiStepFormProps {
  steps: { label: string; description?: string; component: React.ReactNode }[]
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => void
  showProgress?: boolean
  allowNavigation?: boolean
  className?: string
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  showProgress = true,
  allowNavigation = true,
  className
}: MultiStepFormProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  
  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      onStepChange(currentStep + 1)
    }
  }
  
  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1)
    }
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress indicator */}
      {showProgress && (
        <FormProgress
          steps={steps}
          currentStep={currentStep}
          variant="numbered"
        />
      )}
      
      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {steps[currentStep].component}
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation */}
      {allowNavigation && (
        <>
          <Separator />
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
            >
              {isLastStep ? "Complete" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

// Collapsible form section
interface CollapsibleFormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function CollapsibleFormSection({
  title,
  description,
  children,
  defaultOpen = true,
  className
}: CollapsibleFormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  return (
    <div className={cn("border rounded-lg", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        <div className="text-left">
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <ChevronRight
          className={cn(
            "h-5 w-5 text-gray-400 transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Form card wrapper
interface FormCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormCard({
  title,
  description,
  children,
  className
}: FormCardProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-sm border",
      className
    )}>
      {(title || description) && (
        <div className="px-6 py-4 border-b">
          {title && (
            <h2 className="text-lg font-semibold">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}