"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Video,
  Gift,
  Calendar,
  User,
  MessageSquare,
  DollarSign,
  Clock,
  Star,
  Info,
  CircleCheckBig,
  Sparkles,
  Heart,
  PartyPopper,
  Cake,
  Trophy,
  Briefcase,
  GraduationCap,
  Baby,
  Music,
  Smile,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface VideoOrderModalProps {
  creator: {
    id: string
    name: string
    avatar?: string
    responseTime?: string
    rating?: number
    price?: number
  }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

const occasions = [
  { value: "birthday", label: "Birthday", icon: Cake },
  { value: "anniversary", label: "Anniversary", icon: Heart },
  { value: "congratulations", label: "Congratulations", icon: Trophy },
  { value: "graduation", label: "Graduation", icon: GraduationCap },
  { value: "wedding", label: "Wedding", icon: Heart },
  { value: "baby_shower", label: "Baby Shower", icon: Baby },
  { value: "retirement", label: "Retirement", icon: Briefcase },
  { value: "holiday", label: "Holiday Greeting", icon: PartyPopper },
  { value: "encouragement", label: "Encouragement", icon: Smile },
  { value: "just_because", label: "Just Because", icon: Sparkles },
  { value: "other", label: "Other", icon: MessageSquare }
]

export function VideoOrderModal({ 
  creator, 
  open, 
  onOpenChange,
  trigger 
}: VideoOrderModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    occasion: "",
    recipientName: "",
    recipientEmail: "",
    instructions: "",
    isGift: false,
    senderName: "",
    deliveryDate: ""
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})

  const videoPrice = creator.price || 50 // Default price if not set

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setIsOpen(newOpen)
    }
    // Reset form when closing
    if (!newOpen) {
      setFormData({
        occasion: "",
        recipientName: "",
        recipientEmail: "",
        instructions: "",
        isGift: false,
        senderName: "",
        deliveryDate: ""
      })
      setErrors({})
      setTouched({})
    }
  }

  const validateField = (field: string, value: string) => {
    let error = ""
    
    switch(field) {
      case "occasion":
        if (!value) error = "Please select an occasion"
        break
      case "recipientName":
        if (!value) error = "Recipient name is required"
        else if (value.length < 2) error = "Name must be at least 2 characters"
        break
      case "instructions":
        if (!value) error = "Instructions are required"
        else if (value.length < 10) error = "Please provide at least 10 characters of instructions"
        else if (value.length > 500) error = "Instructions must be less than 500 characters"
        break
      case "recipientEmail":
        if (formData.isGift && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) error = "Please enter a valid email address"
        }
        break
    }
    
    return error
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData] as string)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = async () => {
    // Mark all fields as touched
    const newTouched = {
      occasion: true,
      recipientName: true,
      instructions: true,
      recipientEmail: formData.isGift
    }
    setTouched(newTouched)

    // Validate all fields
    const newErrors: {[key: string]: string} = {}
    newErrors.occasion = validateField("occasion", formData.occasion)
    newErrors.recipientName = validateField("recipientName", formData.recipientName)
    newErrors.instructions = validateField("instructions", formData.instructions)
    if (formData.isGift && formData.recipientEmail) {
      newErrors.recipientEmail = validateField("recipientEmail", formData.recipientEmail)
    }

    // Filter out empty errors
    const hasErrors = Object.values(newErrors).some(error => error !== "")
    setErrors(newErrors)

    if (hasErrors) {
      toast.error("Please correct the errors before submitting")
      return
    }

    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Get user with detailed logging
      console.log('🔐 Checking authentication for video request...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Auth error:', userError)
        throw new Error(`Authentication error: ${userError.message}`)
      }
      
      if (!user) {
        console.error('No user found in auth context')
        throw new Error("You must be logged in to create a video request")
      }
      
      console.log(`✅ User authenticated: ${user.id} (${user.email})`)
      
      // Validate form data before database insert
      const videoRequestData = {
        fan_id: user.id,
        creator_id: creator.id,
        request_type: formData.isGift ? 'gift' : 'personal',
        occasion: formData.occasion || '',
        recipient_name: formData.recipientName || '',
        instructions: formData.instructions || '',
        price: videoPrice,
        status: 'pending' as const
      }
      
      console.log('📝 Creating video request with data:', {
        fan_id: videoRequestData.fan_id,
        creator_id: videoRequestData.creator_id,
        occasion: videoRequestData.occasion,
        recipient_name: videoRequestData.recipient_name,
        price: videoRequestData.price
      })
      
      // Create video request in database with retry logic
      let data, error
      let retryCount = 0
      const maxRetries = 2
      
      while (retryCount <= maxRetries) {
        const result = await supabase
          .from('video_requests')
          .insert(videoRequestData)
          .select()
          .single()
        
        data = result.data
        error = result.error
        
        if (!error) break
        
        retryCount++
        console.warn(`Attempt ${retryCount} failed:`, error)
        
        if (retryCount <= maxRetries) {
          console.log(`Retrying in 1 second... (attempt ${retryCount + 1}/${maxRetries + 1})`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      if (error) {
        console.error('❌ Video request creation failed after retries:', {
          error: error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          user_id: user.id,
          creator_id: creator.id
        })
        
        // Store error for E2E tests to capture
        if (typeof window !== 'undefined') {
          (window as any).__lastSupabaseError = error
        }
        
        // Provide user-friendly error messages
        if (error.code === '42501' || error.message?.includes('policy')) {
          throw new Error('Permission denied. Please try logging out and back in.')
        } else if (error.code === '23505') {
          throw new Error('Duplicate request. Please wait a moment and try again.')
        } else {
          throw new Error(`Failed to create video request: ${error.message}`)
        }
      }

      if (!data) {
        throw new Error('No data returned from video request creation')
      }
      
      console.log('✅ Video request created successfully:', data.id)

      // Navigate to checkout with video request details
      const checkoutParams = new URLSearchParams({
        type: 'video',
        creator: creator.id,
        requestId: data.id,
        price: videoPrice.toString()
      })
      
      router.push(`/checkout?${checkoutParams.toString()}`)
      handleOpenChange(false)
      
    } catch (error: any) {
      console.error('Full error object:', error)
      console.error('Error message:', error?.message)
      console.error('Error code:', error?.code)
      console.error('Error details:', error?.details)
      console.error('Error hint:', error?.hint)
      
      const errorMessage = error?.message || error?.error_description || error?.details || "Failed to create video request"
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-white text-gray-900 dark:text-gray-900 border-purple-200" 
        data-testid="video-order-modal"
        style={{ backgroundColor: 'white', color: '#111827' }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="h-6 w-6 text-purple-600" />
            Request a Video from {creator.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Get a personalized video message from your favorite creator
          </DialogDescription>
        </DialogHeader>

        {/* Creator Info */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 text-gray-900 dark:text-gray-900" style={{ background: 'linear-gradient(to right, rgb(250 245 255), rgb(254 242 248))' }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback>{creator.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {creator.responseTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {creator.responseTime}
                      </span>
                    )}
                    {creator.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {creator.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  ${videoPrice}
                </p>
                <p className="text-xs text-gray-500">per video</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mt-6">
          {/* Occasion Selection */}
          <div className="space-y-2">
            <Label htmlFor="occasion" className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              What's the occasion? <span className="text-red-500 ml-1" aria-label="required">*</span>
            </Label>
            <Select 
              value={formData.occasion} 
              onValueChange={(value) => handleFieldChange('occasion', value)}
            >
              <SelectTrigger 
                id="occasion"
                data-testid="occasion-select"
                aria-invalid={!!errors.occasion}
                aria-describedby={errors.occasion ? "occasion-error" : undefined}
                className={errors.occasion ? "border-red-500 focus:ring-red-500/20" : ""}
              >
                <SelectValue placeholder="Select an occasion" />
              </SelectTrigger>
              <SelectContent>
                {occasions.map((occasion) => (
                  <SelectItem key={occasion.value} value={occasion.value}>
                    <div className="flex items-center gap-2">
                      <occasion.icon className="h-4 w-4" />
                      {occasion.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.occasion && (
              <p id="occasion-error" className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {errors.occasion}
              </p>
            )}
          </div>

          {/* Recipient Name */}
          <div className="space-y-2">
            <Label htmlFor="recipientName" className="flex items-center gap-2 text-gray-900">
              <User className="h-4 w-4" aria-hidden="true" />
              Who is this video for? <span className="text-red-500 ml-1" aria-label="required">*</span>
            </Label>
            <Input
              id="recipientName"
              data-testid="recipient-name-input"
              placeholder="Enter recipient's name"
              value={formData.recipientName}
              onChange={(e) => handleFieldChange('recipientName', e.target.value)}
              onBlur={() => handleFieldBlur('recipientName')}
              error={touched.recipientName ? errors.recipientName : undefined}
              aria-required="true"
              aria-invalid={!!errors.recipientName}
              aria-describedby={errors.recipientName ? "recipientName-error" : undefined}
            />
          </div>

          {/* Is it a gift? */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isGift"
              data-testid="gift-checkbox"
              checked={formData.isGift}
              onCheckedChange={(checked) => handleFieldChange('isGift', checked)}
              className="border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              aria-describedby="gift-description"
            />
            <Label 
              htmlFor="isGift" 
              className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-900"
            >
              <Gift className="h-4 w-4" aria-hidden="true" />
              This is a gift for someone else
            </Label>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="flex items-center gap-2 text-gray-900">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Instructions for {creator.name} <span className="text-red-500 ml-1" aria-label="required">*</span>
            </Label>
            <div className="relative">
              <Textarea
                id="instructions"
                data-testid="instructions-textarea"
                placeholder="Tell the creator what you'd like them to say, any inside jokes, pronunciation guides, etc."
                className={`min-h-[120px] resize-y ${
                  errors.instructions ? "border-red-500 focus:ring-red-500/20" : ""
                }`}
                value={formData.instructions}
                onChange={(e) => handleFieldChange('instructions', e.target.value)}
                onBlur={() => handleFieldBlur('instructions')}
                aria-required="true"
                aria-invalid={!!errors.instructions}
                aria-describedby={`instructions-hint ${errors.instructions ? "instructions-error" : ""}`.trim()}
                maxLength={500}
              />
              <span 
                className={`absolute bottom-2 right-2 text-xs ${
                  formData.instructions.length > 450 ? "text-orange-500" : "text-gray-400"
                }`}
                aria-live="polite"
              >
                {formData.instructions.length}/500
              </span>
            </div>
            <p id="instructions-hint" className="text-xs text-gray-500">
              Be specific! The more details you provide, the better the video will be.
            </p>
            {errors.instructions && touched.instructions && (
              <p id="instructions-error" className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {errors.instructions}
              </p>
            )}
          </div>

          {/* What's Included */}
          <Card className="bg-blue-50 dark:bg-blue-50 border-blue-200 text-gray-900 dark:text-gray-900" style={{ backgroundColor: 'rgb(239 246 255)' }}>
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                <Info className="h-4 w-4 text-blue-600" />
                What's Included
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-3 w-3 text-green-600" aria-hidden="true" />
                  Personalized video message (30-90 seconds)
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-3 w-3 text-green-600" aria-hidden="true" />
                  HD quality video
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-3 w-3 text-green-600" aria-hidden="true" />
                  Downloadable file
                </li>
                <li className="flex items-center gap-2">
                  <CircleCheckBig className="h-3 w-3 text-green-600" aria-hidden="true" />
                  Shareable link
                </li>
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="min-h-[44px] min-w-[100px] border-purple-600 text-purple-600 hover:bg-purple-50 bg-white"
              aria-label="Cancel video request"
            >
              Cancel
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-purple-600">${videoPrice}</p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                data-testid="continue-checkout-button"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 min-h-[44px] min-w-[180px] focus:ring-4 focus:ring-purple-500/20 border-0"
                aria-label={loading ? "Processing request" : "Continue to checkout"}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" aria-hidden="true" />
                    Continue to Checkout
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}