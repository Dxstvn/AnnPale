"use client"

import * as React from "react"
import { MultiStepWizard, type WizardStep, type StepComponentProps } from "./multi-step-wizard"
import { OptimizedFormField, useFieldDependencies } from "../form-field-optimization"
import { 
  AccessibleFormField, 
  AccessibilityToolbar, 
  AccessibleFormSection,
  VoiceNavigationHelper,
  type AccessibilityConfig,
  useScreenReaderAnnouncements
} from "../accessibility-enhanced-forms"
import { 
  Gift, 
  MessageSquare, 
  Package, 
  CheckCircle, 
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  Heart,
  PartyPopper,
  GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Enhanced occasion selection with optimization
function OptimizedOccasionSelection({ data, updateData, errors }: StepComponentProps) {
  const [accessibilityConfig, setAccessibilityConfig] = React.useState<AccessibilityConfig>({
    autoAnnounce: true,
    screenReaderMode: false
  })
  
  const { announce } = useScreenReaderAnnouncements()
  
  const occasionOptions = [
    { value: "birthday", label: "Birthday", icon: PartyPopper },
    { value: "anniversary", label: "Anniversary", icon: Heart },
    { value: "graduation", label: "Graduation", icon: GraduationCap },
    { value: "celebration", label: "General Celebration", icon: Gift },
    { value: "support", label: "Support & Encouragement", icon: Heart },
    { value: "just_because", label: "Just Because", icon: MessageSquare }
  ]
  
  const handleOccasionChange = (value: string) => {
    const option = occasionOptions.find(o => o.value === value)
    updateData({ 
      occasion: value,
      occasionLabel: option?.label 
    })
    announce(`Selected ${option?.label}`, "polite")
  }
  
  const handleVoiceCommand = (command: string) => {
    if (command.includes("birthday")) handleOccasionChange("birthday")
    else if (command.includes("anniversary")) handleOccasionChange("anniversary")
    else if (command.includes("graduation")) handleOccasionChange("graduation")
    else if (command.includes("celebration")) handleOccasionChange("celebration")
    else if (command.includes("support")) handleOccasionChange("support")
    else if (command.includes("just because")) handleOccasionChange("just_because")
  }
  
  return (
    <AccessibleFormSection
      title="Choose Your Occasion"
      description="Select the type of message you'd like to request"
      accessibilityConfig={accessibilityConfig}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {occasionOptions.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOccasionChange(option.value)}
              className={`
                p-4 rounded-lg border-2 transition-all text-center
                ${data.occasion === option.value 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${accessibilityConfig.highContrast ? 'border-black dark:border-white' : ''}
              `}
              aria-pressed={data.occasion === option.value}
              aria-describedby={`${option.value}-description`}
            >
              <Icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">{option.label}</h3>
              <span className="sr-only" id={`${option.value}-description`}>
                Select {option.label} as your occasion type
              </span>
            </button>
          )
        })}
      </div>
      
      {/* Custom occasion field */}
      <div className="mt-6">
        <OptimizedFormField
          name="customOccasion"
          label="Or enter a custom occasion"
          value={data.customOccasion || ""}
          onChange={(value) => updateData({ 
            customOccasion: value,
            occasion: value ? "custom" : data.occasion,
            occasionLabel: value || data.occasionLabel
          })}
          placeholder="e.g., Bar Mitzvah, Quinceañera"
          config={{
            smartSuggestions: true,
            autoComplete: true,
            errorRecovery: true
          }}
          context={{ fieldType: "occasion" }}
        />
      </div>
      
      <AccessibilityToolbar
        config={accessibilityConfig}
        onConfigChange={setAccessibilityConfig}
      />
      
      <VoiceNavigationHelper
        onCommand={handleVoiceCommand}
        enabled={accessibilityConfig.voiceNavigation}
      />
    </AccessibleFormSection>
  )
}

// Enhanced message details step
function OptimizedMessageDetails({ data, updateData, errors }: StepComponentProps) {
  const [accessibilityConfig, setAccessibilityConfig] = React.useState<AccessibilityConfig>({
    autoAnnounce: true
  })
  
  // Field dependencies
  const dependencies = {
    "giftRecipientEmail": ["isGift:true"],
    "giftMessage": ["isGift:true"],
    "relationship": ["recipientName"]
  }
  
  const { visibleFields } = useFieldDependencies(data, dependencies)
  
  const handleVoiceCommand = (command: string) => {
    if (command.includes("next field")) {
      // Focus next input
      const inputs = document.querySelectorAll('input, textarea')
      const current = document.activeElement
      const currentIndex = Array.from(inputs).indexOf(current as Element)
      const next = inputs[currentIndex + 1] as HTMLElement
      next?.focus()
    }
  }
  
  return (
    <div className="space-y-6">
      <AccessibleFormSection
        title="Recipient Information"
        description="Tell us who this video is for"
        required
        accessibilityConfig={accessibilityConfig}
      >
        <div className="grid gap-4">
          <OptimizedFormField
            name="recipientName"
            label="Who is this video for?"
            value={data.recipientName || ""}
            onChange={(value) => updateData({ recipientName: value })}
            type="given-name"
            required
            placeholder="e.g., John Smith, Mom, The Johnson Family"
            icon={User}
            config={{
              autoComplete: true,
              smartSuggestions: true,
              autoValidate: true,
              errorRecovery: true
            }}
            error={errors?.recipientName}
          />
          
          <OptimizedFormField
            name="fromName"
            label="Your name"
            value={data.fromName || ""}
            onChange={(value) => updateData({ fromName: value })}
            type="given-name"
            required
            placeholder="How should the creator address you?"
            icon={User}
            config={{
              autoComplete: true,
              smartSuggestions: true,
              autoValidate: true
            }}
            error={errors?.fromName}
          />
          
          {visibleFields.has("relationship") && (
            <OptimizedFormField
              name="relationship"
              label="Your relationship"
              value={data.relationship || ""}
              onChange={(value) => updateData({ relationship: value })}
              placeholder="e.g., Friend, Mom, Boss"
              config={{
                smartSuggestions: true,
                autoComplete: true
              }}
              context={{
                suggestions: ["Friend", "Parent", "Sibling", "Spouse", "Colleague", "Boss"]
              }}
            />
          )}
        </div>
      </AccessibleFormSection>
      
      <AccessibleFormSection
        title="Message Instructions"
        description="What would you like the creator to say?"
        required
        accessibilityConfig={accessibilityConfig}
      >
        <OptimizedFormField
          name="instructions"
          label="Instructions for the creator"
          value={data.instructions || ""}
          onChange={(value) => updateData({ instructions: value })}
          type="textarea"
          required
          placeholder="Tell the creator what you'd like them to say. Be specific about any jokes, memories, or special messages..."
          maxLength={500}
          icon={MessageSquare}
          config={{
            smartSuggestions: true,
            autoValidate: true,
            errorRecovery: true
          }}
          error={errors?.instructions}
        />
        
        <OptimizedFormField
          name="specialDetails"
          label="Special details (optional)"
          value={data.specialDetails || ""}
          onChange={(value) => updateData({ specialDetails: value })}
          type="textarea"
          placeholder="Any inside jokes, shared memories, hobbies, or other details..."
          maxLength={300}
          config={{
            smartSuggestions: true
          }}
        />
      </AccessibleFormSection>
      
      <AccessibleFormSection
        title="Contact Information"
        description="How can we reach you?"
        required
        accessibilityConfig={accessibilityConfig}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <OptimizedFormField
            name="email"
            label="Email address"
            value={data.email || ""}
            onChange={(value) => updateData({ email: value })}
            type="email"
            required
            icon={Mail}
            config={{
              autoComplete: true,
              autoFormat: true,
              autoValidate: true,
              smartSuggestions: true,
              errorRecovery: true
            }}
            error={errors?.email}
          />
          
          <OptimizedFormField
            name="phone"
            label="Phone number (optional)"
            value={data.phone || ""}
            onChange={(value) => updateData({ phone: value })}
            type="tel"
            icon={Phone}
            config={{
              autoComplete: true,
              autoFormat: true,
              autoValidate: true
            }}
          />
        </div>
      </AccessibleFormSection>
      
      <VoiceNavigationHelper
        onCommand={handleVoiceCommand}
        enabled={accessibilityConfig.voiceNavigation}
      />
    </div>
  )
}

// Enhanced delivery options
function OptimizedDeliveryOptions({ data, updateData, errors }: StepComponentProps) {
  const [accessibilityConfig, setAccessibilityConfig] = React.useState<AccessibilityConfig>({
    autoAnnounce: true
  })
  
  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      timeline: "5-7 days",
      price: 0,
      description: "Regular processing queue"
    },
    {
      id: "express", 
      name: "Express Delivery",
      timeline: "2-3 days",
      price: 30,
      description: "Priority processing",
      popular: true
    },
    {
      id: "rush",
      name: "Rush Delivery", 
      timeline: "24 hours",
      price: 50,
      description: "Top priority processing"
    }
  ]
  
  const handleDeliveryChange = (optionId: string) => {
    const option = deliveryOptions.find(o => o.id === optionId)
    updateData({
      deliveryTier: optionId,
      deliveryPrice: option?.price || 0,
      deliveryTimeline: option?.timeline
    })
  }
  
  return (
    <AccessibleFormSection
      title="Delivery Options"
      description="Choose your delivery speed"
      required
      accessibilityConfig={accessibilityConfig}
    >
      <div className="space-y-4">
        {deliveryOptions.map((option) => (
          <label
            key={option.id}
            className={`
              relative block p-4 border-2 rounded-lg cursor-pointer transition-all
              ${data.deliveryTier === option.id 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <input
              type="radio"
              name="deliveryTier"
              value={option.id}
              checked={data.deliveryTier === option.id}
              onChange={() => handleDeliveryChange(option.id)}
              className="sr-only"
            />
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{option.name}</h3>
                  {option.popular && (
                    <Badge className="bg-purple-600">Popular</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
                <p className="text-sm font-medium text-purple-600">{option.timeline}</p>
              </div>
              <div className="text-right">
                {option.price > 0 ? (
                  <span className="font-bold">+${option.price}</span>
                ) : (
                  <Badge variant="secondary">Included</Badge>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-4">
        <h4 className="font-medium">Additional Options</h4>
        
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={data.isGift || false}
            onChange={(e) => updateData({ isGift: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span>This is a gift for someone else</span>
        </label>
        
        {data.isGift && (
          <OptimizedFormField
            name="giftRecipientEmail"
            label="Gift recipient's email"
            value={data.giftRecipientEmail || ""}
            onChange={(value) => updateData({ giftRecipientEmail: value })}
            type="email"
            required
            icon={Mail}
            config={{
              autoComplete: true,
              autoValidate: true,
              errorRecovery: true
            }}
            error={errors?.giftRecipientEmail}
          />
        )}
      </div>
    </AccessibleFormSection>
  )
}

// Enhanced review step
function OptimizedReviewConfirmation({ data }: StepComponentProps) {
  const [accessibilityConfig, setAccessibilityConfig] = React.useState<AccessibilityConfig>({
    autoAnnounce: true
  })
  
  const basePrice = 150
  const deliveryPrice = data.deliveryPrice || 0
  const total = basePrice + deliveryPrice
  
  return (
    <AccessibleFormSection
      title="Review Your Order"
      description="Please review your order details before proceeding"
      completed={true}
      accessibilityConfig={accessibilityConfig}
    >
      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Occasion:</span>
            <span className="font-medium">{data.occasionLabel || data.customOccasion}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">For:</span>
            <span className="font-medium">{data.recipientName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{data.fromName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery:</span>
            <span className="font-medium">
              {data.deliveryTier?.charAt(0).toUpperCase() + data.deliveryTier?.slice(1)} 
              ({data.deliveryTimeline})
            </span>
          </div>
          
          {data.isGift && (
            <div className="flex justify-between">
              <span className="text-gray-600">Gift recipient:</span>
              <span className="font-medium">{data.giftRecipientEmail}</span>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Video message:</span>
            <span>${basePrice}</span>
          </div>
          
          {deliveryPrice > 0 && (
            <div className="flex justify-between">
              <span>Delivery upgrade:</span>
              <span>+${deliveryPrice}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">
            <CheckCircle className="inline h-4 w-4 mr-2 text-green-500" />
            100% satisfaction guaranteed - we'll make it right or refund you
          </p>
        </div>
      </div>
    </AccessibleFormSection>
  )
}

// Define optimized wizard steps
const optimizedSteps: WizardStep[] = [
  {
    id: "occasion",
    title: "Choose Occasion",
    subtitle: "What are we celebrating?",
    icon: Gift,
    component: OptimizedOccasionSelection,
    cognitiveLoad: "low",
    validation: (data) => ({
      isValid: !!(data.occasion || data.customOccasion),
      errors: !(data.occasion || data.customOccasion) ? { occasion: "Please select an occasion" } : {}
    })
  },
  {
    id: "details",
    title: "Message Details", 
    subtitle: "Personalize your request",
    icon: MessageSquare,
    component: OptimizedMessageDetails,
    cognitiveLoad: "medium",
    validation: (data) => {
      const errors: Record<string, string> = {}
      if (!data.recipientName) errors.recipientName = "Recipient name is required"
      if (!data.fromName) errors.fromName = "Your name is required"
      if (!data.instructions || data.instructions.length < 20) {
        errors.instructions = "Please provide more detailed instructions (minimum 20 characters)"
      }
      if (!data.email) errors.email = "Email address is required"
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Please enter a valid email address"
      }
      if (data.isGift && !data.giftRecipientEmail) {
        errors.giftRecipientEmail = "Gift recipient email is required"
      }
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    }
  },
  {
    id: "delivery",
    title: "Delivery Options",
    subtitle: "When and how to deliver", 
    icon: Package,
    component: OptimizedDeliveryOptions,
    cognitiveLoad: "low",
    validation: (data) => ({
      isValid: !!data.deliveryTier,
      errors: !data.deliveryTier ? { deliveryTier: "Please select a delivery option" } : {}
    })
  },
  {
    id: "review",
    title: "Review & Confirm",
    subtitle: "Check everything looks good",
    icon: CheckCircle,
    component: OptimizedReviewConfirmation,
    cognitiveLoad: "low"
  }
]

// Main optimized wizard component
export function OptimizedBookingWizard({
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
  const handleComplete = async (data: any) => {
    const completeData = {
      ...data,
      creatorId,
      creatorName,
      bookingId: `booking_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    console.log("Optimized booking completed:", completeData)
    toast.success("Booking completed with optimized experience! 🚀")
    
    if (onComplete) {
      onComplete(completeData)
    }
  }
  
  return (
    <div className={className}>
      <MultiStepWizard
        steps={optimizedSteps}
        initialData={{
          creatorId,
          creatorName,
          deliveryTier: "express" // Smart default
        }}
        onComplete={handleComplete}
        onCancel={onCancel}
        allowSkip={false}
        allowSaveDraft={true}
        showProgressBar={true}
        progressVariant="numbered"
        mobileOptimized={true}
        persistKey={`optimized_booking_${creatorId}`}
        analyticsTracking={true}
      />
    </div>
  )
}