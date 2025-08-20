"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gift,
  MessageSquare,
  Package,
  CheckCircle,
  User,
  Clock,
  Star,
  TrendingUp,
  Award,
  BarChart3,
  Sparkles,
  Brain,
  Zap,
  CreditCard
} from "lucide-react"

import { MultiStepWizard, type WizardStep, type StepComponentProps } from "./multi-step-wizard"
import { EnhancedMessageDetails } from "../enhanced-message-details"
import { OccasionSelection } from "./steps/occasion-selection"
import { DeliveryOptions } from "./steps/delivery-options" 
import { ReviewConfirmation } from "./steps/review-confirmation"
import { EnhancedReviewConfirmation } from "../enhanced-review-confirmation"
import { PaymentProcessing } from "./steps/payment-processing"
import { Confirmation } from "./steps/confirmation"
import { 
  SmartProgressTracker, 
  RealTimeValidationPanel, 
  FormQualityIndicator,
  StepCompletionConfirmation,
  ValidationSummary,
  type ProgressStep,
  type ValidationResult
} from "../progress-validation-ui"

// Enhanced validation engine
class EnhancedValidationEngine {
  static validateStep(stepId: string, data: any): ValidationResult {
    const errors = []
    const warnings = []
    const suggestions = []
    let score = 100
    
    switch (stepId) {
      case "occasion":
        if (!data.occasion && !data.customOccasion) {
          errors.push({
            id: "occasion_required",
            type: "required",
            message: "Please select an occasion",
            severity: "error" as const,
            autoFix: false
          })
          score -= 30
        }
        
        if (data.occasion === "custom" && (!data.customOccasion || data.customOccasion.length < 3)) {
          warnings.push({
            id: "custom_occasion_short",
            type: "minLength",
            message: "Custom occasion should be more descriptive",
            severity: "warning" as const,
            autoFix: false
          })
          score -= 10
        }
        break
        
      case "details":
        // Required field validation
        if (!data.recipientName) {
          errors.push({
            id: "recipient_required",
            type: "required", 
            message: "Recipient name is required",
            severity: "error" as const,
            autoFix: false
          })
          score -= 25
        }
        
        if (!data.fromName) {
          errors.push({
            id: "from_required",
            type: "required",
            message: "Your name is required", 
            severity: "error" as const,
            autoFix: false
          })
          score -= 25
        }
        
        if (!data.instructions) {
          errors.push({
            id: "instructions_required",
            type: "required",
            message: "Instructions are required",
            severity: "error" as const,
            autoFix: false
          })
          score -= 30
        } else if (data.instructions.length < 20) {
          warnings.push({
            id: "instructions_short",
            type: "minLength", 
            message: "Instructions should be at least 20 characters for better results",
            severity: "warning" as const,
            autoFix: false
          })
          score -= 15
        }
        
        // Quality suggestions
        if (data.instructions && !data.specialDetails) {
          suggestions.push({
            id: "add_special_details",
            type: "custom",
            message: "Adding special details could make this more personal",
            severity: "info" as const,
            autoFix: false
          })
          score -= 5
        }
        
        if (data.recipientName && !data.relationship) {
          suggestions.push({
            id: "add_relationship",
            type: "custom", 
            message: "Specifying your relationship helps creators personalize better",
            severity: "info" as const,
            autoFix: false
          })
          score -= 5
        }
        
        // Email validation
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.push({
            id: "email_invalid",
            type: "pattern",
            message: "Please enter a valid email address",
            severity: "error" as const,
            autoFix: true
          })
          score -= 20
        }
        break
        
      case "delivery":
        if (!data.deliveryTier) {
          errors.push({
            id: "delivery_required",
            type: "required",
            message: "Please select a delivery option",
            severity: "error" as const,
            autoFix: false
          })
          score -= 30
        }
        break
        
      case "payment":
        if (!data.paymentMethod && !data.paymentComplete) {
          errors.push({
            id: "payment_required",
            type: "required",
            message: "Payment information is required",
            severity: "error" as const,
            autoFix: false
          })
          score -= 50
        }
        
        if (data.isGift && !data.giftRecipientEmail) {
          errors.push({
            id: "gift_email_required",
            type: "required",
            message: "Gift recipient email is required",
            severity: "error" as const,
            autoFix: false
          })
          score -= 20
        }
        break
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score)
    }
  }
  
  static getFormQualityMetrics(data: any) {
    const completeness = this.calculateCompleteness(data)
    const accuracy = this.calculateAccuracy(data)
    const engagement = this.calculateEngagement(data)
    const optimization = this.calculateOptimization(data)
    
    return {
      completeness,
      accuracy,
      engagement,
      optimization
    }
  }
  
  private static calculateCompleteness(data: any): number {
    const requiredFields = ["occasion", "recipientName", "fromName", "instructions", "deliveryTier"]
    const optionalFields = ["relationship", "pronouns", "specialDetails", "customOccasion"]
    
    const requiredComplete = requiredFields.filter(field => 
      data[field] && data[field].toString().trim().length > 0
    ).length
    
    const optionalComplete = optionalFields.filter(field =>
      data[field] && data[field].toString().trim().length > 0  
    ).length
    
    const requiredScore = (requiredComplete / requiredFields.length) * 80
    const optionalScore = (optionalComplete / optionalFields.length) * 20
    
    return Math.round(requiredScore + optionalScore)
  }
  
  private static calculateAccuracy(data: any): number {
    let score = 100
    
    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      score -= 20
    }
    
    // Instructions quality
    if (data.instructions) {
      if (data.instructions.length < 20) score -= 15
      if (data.instructions.length > 400) score -= 10
    }
    
    // Name validation
    if (data.recipientName && data.recipientName.length < 2) score -= 10
    if (data.fromName && data.fromName.length < 2) score -= 10
    
    return Math.max(0, score)
  }
  
  private static calculateEngagement(data: any): number {
    let score = 50 // Base score
    
    // Relationship specified
    if (data.relationship) score += 15
    
    // Pronouns specified  
    if (data.pronouns) score += 10
    
    // Special details provided
    if (data.specialDetails && data.specialDetails.length > 20) score += 20
    
    // Instructions are detailed
    if (data.instructions && data.instructions.length > 100) score += 15
    
    // Template used vs custom
    if (data.templateUsed) score += 10
    
    return Math.min(100, score)
  }
  
  private static calculateOptimization(data: any): number {
    let score = 70 // Base score
    
    // Delivery tier chosen (not just standard)
    if (data.deliveryTier && data.deliveryTier !== "standard") score += 15
    
    // Gift option consideration
    if (data.isGift !== undefined) score += 10
    
    // Complete occasion info
    if (data.occasion && data.occasion !== "custom") score += 10
    if (data.customOccasion && data.customOccasion.length > 5) score += 10
    
    return Math.min(100, score)
  }
}

// Wrapper component to adapt EnhancedReviewConfirmation to wizard props
const EnhancedReviewWrapper = (props: StepComponentProps) => {
  const handleEdit = (section: string) => {
    // In a real implementation, this would navigate to the specific step
    console.log(`Edit section: ${section}`)
  }
  
  return (
    <EnhancedReviewConfirmation
      data={props.data}
      updateData={props.updateData}
      onEdit={handleEdit}
      creatorInfo={{
        name: props.data.creatorName || "Creator",
        rating: 4.9,
        reviews: 1247,
        responseTime: "24hr"
      }}
    />
  )
}

// Enhanced wizard steps with validation and enhanced review
const enhancedWizardSteps: WizardStep[] = [
  {
    id: "occasion",
    title: "Choose Occasion",
    subtitle: "What are we celebrating?",
    icon: Gift,
    component: OccasionSelection,
    cognitiveLoad: "low",
    validation: (data) => EnhancedValidationEngine.validateStep("occasion", data)
  },
  {
    id: "details",
    title: "Message Details",
    subtitle: "Personalize your message",
    icon: MessageSquare,
    component: EnhancedMessageDetails as React.ComponentType<StepComponentProps>,
    cognitiveLoad: "medium",
    validation: (data) => EnhancedValidationEngine.validateStep("details", data)
  },
  {
    id: "delivery",
    title: "Delivery Options", 
    subtitle: "When and how to deliver",
    icon: Package,
    component: DeliveryOptions,
    cognitiveLoad: "low",
    validation: (data) => EnhancedValidationEngine.validateStep("delivery", data)
  },
  {
    id: "review",
    title: "Review & Confirm",
    subtitle: "Check everything looks good", 
    icon: CheckCircle,
    component: EnhancedReviewWrapper,
    cognitiveLoad: "low"
  },
  {
    id: "payment",
    title: "Payment",
    subtitle: "Complete your order",
    icon: CreditCard,
    component: PaymentProcessing,
    cognitiveLoad: "medium",
    validation: (data) => EnhancedValidationEngine.validateStep("payment", data)
  },
  {
    id: "confirmation",
    title: "Confirmation",
    subtitle: "Your order is complete!",
    icon: CheckCircle,
    component: Confirmation,
    cognitiveLoad: "low"
  }
]

export function EnhancedBookingWizard({
  creatorId = "1",
  creatorName = "Sample Creator",
  onComplete,
  onCancel,
  className
}: {
  creatorId?: string
  creatorName?: string  
  onComplete?: (data: any) => void
  onCancel?: () => void
  className?: string
}) {
  const [currentStep, setCurrentStep] = React.useState("occasion")
  const [wizardData, setWizardData] = React.useState<any>({
    creatorId,
    creatorName,
    deliveryTier: "express" // Smart default
  })
  const [validationResults, setValidationResults] = React.useState<Record<string, ValidationResult>>({})
  const [showValidationPanel, setShowValidationPanel] = React.useState(true)
  const [stepCompletion, setStepCompletion] = React.useState<Record<string, boolean>>({})
  
  // Calculate progress steps
  const progressSteps: ProgressStep[] = enhancedWizardSteps.map((step, index) => ({
    id: step.id,
    label: step.title,
    description: step.subtitle,
    status: stepCompletion[step.id] ? "completed" : 
            step.id === currentStep ? "active" : "pending",
    required: step.id !== "review",
    completionPercentage: step.id === currentStep ? 
      Math.min(100, Object.keys(wizardData).length * 25) : undefined,
    estimatedTime: step.cognitiveLoad === "high" ? "3-5 min" :
                   step.cognitiveLoad === "medium" ? "2-3 min" : "1-2 min"
  }))
  
  // Real-time validation
  React.useEffect(() => {
    const currentStepConfig = enhancedWizardSteps.find(s => s.id === currentStep)
    if (currentStepConfig?.validation) {
      const result = currentStepConfig.validation(wizardData)
      setValidationResults(prev => ({
        ...prev,
        [currentStep]: result
      }))
    }
  }, [wizardData, currentStep])
  
  // Calculate form quality metrics  
  const qualityMetrics = React.useMemo(() => 
    EnhancedValidationEngine.getFormQualityMetrics(wizardData), [wizardData]
  )
  
  const overallScore = React.useMemo(() => {
    const metrics = Object.values(qualityMetrics)
    return Math.round(metrics.reduce((sum, score) => sum + score, 0) / metrics.length)
  }, [qualityMetrics])
  
  const handleStepComplete = (stepId: string, data: any) => {
    setWizardData({ ...wizardData, ...data })
    setStepCompletion(prev => ({ ...prev, [stepId]: true }))
    
    // Auto-advance to next step
    const currentIndex = enhancedWizardSteps.findIndex(s => s.id === stepId)
    const nextStep = enhancedWizardSteps[currentIndex + 1]
    if (nextStep) {
      setCurrentStep(nextStep.id)
    }
  }
  
  const handleComplete = async (data: any) => {
    const completeData = {
      ...wizardData,
      ...data,
      bookingId: `booking_${Date.now()}`,
      createdAt: new Date().toISOString(),
      qualityScore: overallScore,
      validationResults
    }
    
    console.log("Enhanced booking completed:", completeData)
    toast.success("Booking completed with enhanced experience! 🚀")
    
    if (onComplete) {
      onComplete(completeData)
    }
  }
  
  const handleAutoFix = (ruleId: string) => {
    // Handle auto-fix for specific validation rules
    switch (ruleId) {
      case "email_invalid":
        // Could implement smart email correction
        toast.info("Email auto-fix suggestions coming soon!")
        break
      default:
        toast.info("Auto-fix not available for this issue")
    }
  }
  
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main wizard content */}
        <div className="lg:col-span-2">
          <MultiStepWizard
            steps={enhancedWizardSteps}
            initialData={wizardData}
            onComplete={handleComplete}
            onCancel={onCancel}
            allowSkip={false}
            allowSaveDraft={true}
            showProgressBar={false} // We'll use our custom progress tracker
            mobileOptimized={true}
            persistKey={`enhanced_booking_${creatorId}`}
            analyticsTracking={true}
          />
        </div>
        
        {/* Enhanced sidebar */}
        <div className="space-y-4">
          {/* Smart Progress Tracker */}
          <SmartProgressTracker
            steps={progressSteps}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            showValidation={true}
            showTimeEstimates={true}
            animateProgress={true}
            variant="default"
          />
          
          {/* Form Quality Indicator */}
          <FormQualityIndicator
            score={overallScore}
            metrics={qualityMetrics}
            showDetails={true}
          />
          
          {/* Real-time Validation Panel */}
          {showValidationPanel && validationResults[currentStep] && (
            <RealTimeValidationPanel
              validationResult={validationResults[currentStep]}
              showSuggestions={true}
              showScore={true}
              autoFix={true}
              onAutoFix={handleAutoFix}
            />
          )}
          
          {/* AI Enhancement Suggestions */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-3 w-3 text-purple-600" />
                <span>Smart suggestions enabled</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-3 w-3 text-purple-600" />
                <span>Real-time optimization</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-3 w-3 text-purple-600" />
                <span>Quality score tracking</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Creator info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                {creatorName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>4.9 rating (500+ reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-3 w-3 text-green-500" />
                <span>Usually responds in 2-3 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-3 w-3 text-purple-500" />
                <span>Top Creator</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Validation Summary (if multiple steps have issues) */}
          {Object.keys(validationResults).length > 1 && (
            <ValidationSummary
              validationResults={validationResults}
              onResolve={(stepId, ruleId) => {
                setCurrentStep(stepId)
                handleAutoFix(ruleId)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}