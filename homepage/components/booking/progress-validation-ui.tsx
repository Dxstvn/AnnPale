"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Target,
  Shield,
  TrendingUp,
  BarChart3,
  Activity,
  Eye,
  Users,
  Star,
  Gauge,
  Timer,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Brain,
  Sparkles,
  Award,
  ThumbsUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Progress tracking types
export interface ProgressStep {
  id: string
  label: string
  description?: string
  status: "pending" | "active" | "completed" | "error" | "warning"
  required?: boolean
  validationRules?: ValidationRule[]
  completionPercentage?: number
  estimatedTime?: string
  dependencies?: string[]
}

export interface ValidationRule {
  id: string
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom"
  message: string
  value?: any
  severity: "error" | "warning" | "info"
  autoFix?: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationRule[]
  warnings: ValidationRule[]
  suggestions: ValidationRule[]
  score: number
  completionTime?: number
}

// Smart progress tracker component
export function SmartProgressTracker({
  steps,
  currentStep,
  onStepClick,
  showValidation = true,
  showTimeEstimates = true,
  animateProgress = true,
  variant = "default",
  className
}: {
  steps: ProgressStep[]
  currentStep: string
  onStepClick?: (stepId: string) => void
  showValidation?: boolean
  showTimeEstimates?: boolean
  animateProgress?: boolean
  variant?: "default" | "compact" | "detailed" | "circular"
  className?: string
}) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  const completedSteps = steps.filter(step => step.status === "completed").length
  const totalSteps = steps.length
  const overallProgress = (completedSteps / totalSteps) * 100
  
  if (variant === "circular") {
    return (
      <div className={cn("relative", className)}>
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={283}
              strokeDashoffset={283 - (283 * overallProgress) / 100}
              strokeLinecap="round"
              className="text-purple-600"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * overallProgress) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-xs text-gray-500">
                {completedSteps}/{totalSteps} steps
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-gray-500">{completedSteps}/{totalSteps}</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Step {currentStepIndex + 1}: {steps[currentStepIndex]?.label}</span>
          {showTimeEstimates && steps[currentStepIndex]?.estimatedTime && (
            <span className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {steps[currentStepIndex].estimatedTime}
            </span>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Booking Progress</h3>
          <Badge variant="outline">
            {completedSteps}/{totalSteps} Complete
          </Badge>
        </div>
        {animateProgress ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <Progress value={overallProgress} className="h-3" />
          </motion.div>
        ) : (
          <Progress value={overallProgress} className="h-3" />
        )}
      </div>
      
      {/* Step indicators */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.status === "completed"
          const hasError = step.status === "error"
          const hasWarning = step.status === "warning"
          const isClickable = onStepClick && (isCompleted || index <= currentStepIndex)
          
          return (
            <motion.div
              key={step.id}
              initial={animateProgress ? { opacity: 0, x: -20 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                isActive && "border-purple-500 bg-purple-50/50 dark:bg-purple-900/20",
                isCompleted && !isActive && "border-green-200 bg-green-50/50 dark:bg-green-900/20",
                hasError && "border-red-200 bg-red-50/50 dark:bg-red-900/20",
                hasWarning && "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/20",
                isClickable && "cursor-pointer hover:shadow-md"
              )}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              {/* Step indicator */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isCompleted && "bg-green-600 text-white",
                isActive && !isCompleted && "bg-purple-600 text-white",
                hasError && "bg-red-600 text-white",
                hasWarning && "bg-yellow-600 text-white",
                !isActive && !isCompleted && !hasError && !hasWarning && "bg-gray-200 text-gray-600"
              )}>
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : hasError ? (
                  <X className="h-4 w-4" />
                ) : hasWarning ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Step content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={cn(
                    "font-medium",
                    isActive && "text-purple-700 dark:text-purple-300",
                    isCompleted && "text-green-700 dark:text-green-300"
                  )}>
                    {step.label}
                  </h4>
                  {step.required && (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                  {isActive && (
                    <Badge className="bg-purple-600 text-xs">Current</Badge>
                  )}
                </div>
                {step.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                )}
                
                {/* Step progress */}
                {isActive && step.completionPercentage !== undefined && (
                  <div className="mt-2">
                    <Progress value={step.completionPercentage} className="h-1" />
                  </div>
                )}
              </div>
              
              {/* Time estimate */}
              {showTimeEstimates && step.estimatedTime && isActive && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {step.estimatedTime}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Real-time validation panel
export function RealTimeValidationPanel({
  validationResult,
  showSuggestions = true,
  showScore = true,
  autoFix = true,
  onAutoFix,
  className
}: {
  validationResult: ValidationResult
  showSuggestions?: boolean
  showScore?: boolean
  autoFix?: boolean
  onAutoFix?: (ruleId: string) => void
  className?: string
}) {
  const { isValid, errors, warnings, suggestions, score } = validationResult
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }
  
  const getScoreIcon = (score: number) => {
    if (score >= 90) return Award
    if (score >= 70) return Target
    return AlertTriangle
  }
  
  const ScoreIcon = getScoreIcon(score)
  
  return (
    <Card className={cn("border-l-4", isValid ? "border-l-green-500" : "border-l-red-500", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Validation Status
          </CardTitle>
          {showScore && (
            <div className="flex items-center gap-2">
              <ScoreIcon className={cn("h-4 w-4", getScoreColor(score))} />
              <span className={cn("font-bold", getScoreColor(score))}>
                {score}/100
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Errors ({errors.length})
            </h4>
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription className="flex items-center justify-between">
                  <span>{error.message}</span>
                  {autoFix && error.autoFix && onAutoFix && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAutoFix(error.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Fix
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        
        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Warnings ({warnings.length})
            </h4>
            {warnings.map((warning, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{warning.message}</span>
                  {autoFix && warning.autoFix && onAutoFix && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAutoFix(warning.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Fix
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        
        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-blue-600 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions ({suggestions.length})
            </h4>
            {suggestions.map((suggestion, index) => (
              <Alert key={index}>
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{suggestion.message}</span>
                  {autoFix && suggestion.autoFix && onAutoFix && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAutoFix(suggestion.id)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
        
        {/* Success state */}
        {isValid && errors.length === 0 && warnings.length === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Perfect!</AlertTitle>
            <AlertDescription>
              Your form looks great and is ready to submit.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

// Form quality indicator
export function FormQualityIndicator({
  score,
  metrics,
  showDetails = false,
  className
}: {
  score: number
  metrics: {
    completeness: number
    accuracy: number
    engagement: number
    optimization: number
  }
  showDetails?: boolean
  className?: string
}) {
  const getQualityLevel = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "green", icon: Award }
    if (score >= 80) return { label: "Great", color: "blue", icon: ThumbsUp }
    if (score >= 70) return { label: "Good", color: "yellow", icon: Target }
    if (score >= 60) return { label: "Fair", color: "orange", icon: Activity }
    return { label: "Needs Work", color: "red", icon: AlertTriangle }
  }
  
  const quality = getQualityLevel(score)
  const QualityIcon = quality.icon
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Gauge className="h-5 w-5 text-purple-600" />
          Form Quality Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QualityIcon className={cn("h-5 w-5", `text-${quality.color}-600`)} />
              <span className="font-medium">{quality.label}</span>
            </div>
            <div className="text-right">
              <div className={cn("text-2xl font-bold", `text-${quality.color}-600`)}>
                {score}
              </div>
              <div className="text-xs text-gray-500">out of 100</div>
            </div>
          </div>
          
          <Progress value={score} className="h-2" />
          
          {/* Detailed metrics */}
          {showDetails && (
            <div className="space-y-3 pt-2 border-t">
              <h4 className="font-medium text-sm">Breakdown</h4>
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={value} className="h-1" />
                </div>
              ))}
            </div>
          )}
          
          {/* Tips */}
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              {score >= 90 && "Your form is optimized for the best experience!"}
              {score >= 70 && score < 90 && "Good job! A few tweaks could make this even better."}
              {score < 70 && "Consider adding more details for better results."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Step completion confirmation
export function StepCompletionConfirmation({
  stepTitle,
  completionData,
  nextStep,
  onConfirm,
  onEdit,
  showSummary = true,
  className
}: {
  stepTitle: string
  completionData: Record<string, any>
  nextStep?: string
  onConfirm: () => void
  onEdit: () => void
  showSummary?: boolean
  className?: string
}) {
  const [isConfirming, setIsConfirming] = React.useState(false)
  
  const handleConfirm = async () => {
    setIsConfirming(true)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate processing
    onConfirm()
    setIsConfirming(false)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            {stepTitle} Complete!
          </CardTitle>
        </CardHeader>
        {showSummary && (
          <CardContent>
            <div className="space-y-2">
              {Object.entries(completionData).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </span>
                  <span className="font-medium">
                    {typeof value === 'string' && value.length > 50 
                      ? `${value.substring(0, 50)}...` 
                      : String(value)
                    }
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="flex-1"
        >
          {isConfirming ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          {nextStep ? `Continue to ${nextStep}` : "Confirm & Continue"}
        </Button>
      </div>
    </motion.div>
  )
}

// Validation summary widget
export function ValidationSummary({
  validationResults,
  onResolve,
  className
}: {
  validationResults: Record<string, ValidationResult>
  onResolve?: (stepId: string, ruleId: string) => void
  className?: string
}) {
  const totalErrors = Object.values(validationResults).reduce((sum, result) => sum + result.errors.length, 0)
  const totalWarnings = Object.values(validationResults).reduce((sum, result) => sum + result.warnings.length, 0)
  const averageScore = Object.values(validationResults).reduce((sum, result) => sum + result.score, 0) / Object.keys(validationResults).length
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          Validation Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
              <div className="text-xs text-gray-500">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalWarnings}</div>
              <div className="text-xs text-gray-500">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(averageScore)}</div>
              <div className="text-xs text-gray-500">Avg Score</div>
            </div>
          </div>
          
          {/* Step-by-step validation */}
          <div className="space-y-2">
            {Object.entries(validationResults).map(([stepId, result]) => (
              <div key={stepId} className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm font-medium capitalize">
                  {stepId.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <div className="flex items-center gap-2">
                  {result.errors.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {result.errors.length} errors
                    </Badge>
                  )}
                  {result.warnings.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {result.warnings.length} warnings
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {result.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}