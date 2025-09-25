"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import CreatorSubscriptionTiers from "@/components/creator/creator-subscription-tiers"
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
  AlertCircle,
  Users
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"

interface CreatorServicesModalProps {
  creator: {
    id: string
    name: string
    avatar?: string
    responseTime?: string
    rating?: number
    price?: number
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "video" | "subscription"
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

export function CreatorServicesModal({
  creator,
  open,
  onOpenChange,
  defaultTab = "video"
}: CreatorServicesModalProps) {
  const router = useRouter()
  const { isAuthenticated } = useSupabaseAuth()
  const [activeTab, setActiveTab] = useState(defaultTab)
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

  const videoPrice = creator.price || 50

  // Update active tab when defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
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
      // Reset to default tab
      setActiveTab("video")
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

  const handleVideoSubmit = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      // Save form data to sessionStorage
      sessionStorage.setItem('videoRequestForm', JSON.stringify(formData))
      // Redirect to signup with return URL
      const returnUrl = `/fan/creators/${creator.id}?openBooking=true`
      router.push(`/signup?returnTo=${encodeURIComponent(returnUrl)}`)
      handleOpenChange(false)
      return
    }

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

      // Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to create a video request")
      }

      // Create video request in database
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

      const { data, error } = await supabase
        .from('video_requests')
        .insert(videoRequestData)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create video request: ${error.message}`)
      }

      // Navigate to checkout - price fetched server-side for security
      const checkoutParams = new URLSearchParams({
        type: 'video',
        creator: creator.id,
        requestId: data.id
        // SECURITY: Price removed - will be fetched from database
      })

      router.push(`/checkout?${checkoutParams.toString()}`)
      handleOpenChange(false)

    } catch (error: any) {
      console.error('Error creating video request:', error)
      toast.error(error?.message || "Failed to create video request")
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = (tierId: string, tierName: string, price: number) => {
    if (!isAuthenticated) {
      // SECURITY: Only save tierId to sessionStorage - price and name will be fetched server-side
      sessionStorage.setItem('subscriptionSelection', JSON.stringify({
        tierId
        // tierName and price removed for security - will be fetched from database
      }))
      // Redirect to signup with return URL
      const returnUrl = `/fan/creators/${creator.id}?openSubscription=true`
      router.push(`/signup?returnTo=${encodeURIComponent(returnUrl)}`)
      handleOpenChange(false)
      return
    }

    // Navigate to subscription checkout
    toast({
      title: "Redirecting to checkout...",
      description: `Subscribe to ${creator.name}'s ${tierName} tier for $${price}/month`,
    })

    handleOpenChange(false)
    // SECURITY: Price and name are now fetched server-side to prevent manipulation
    router.push(`/checkout?type=subscription&creator=${creator.id}&tier=${tierId}`)
  }

  // Load saved form data if returning from auth
  useEffect(() => {
    if (open && activeTab === "video" && isAuthenticated) {
      const savedForm = sessionStorage.getItem('videoRequestForm')
      if (savedForm) {
        setFormData(JSON.parse(savedForm))
        sessionStorage.removeItem('videoRequestForm')
      }
    }

    if (open && activeTab === "subscription" && isAuthenticated) {
      const savedSelection = sessionStorage.getItem('subscriptionSelection')
      if (savedSelection) {
        const { tierId } = JSON.parse(savedSelection)
        sessionStorage.removeItem('subscriptionSelection')
        // Auto-navigate to checkout with only tierId - price and name fetched server-side
        router.push(`/checkout?type=subscription&creator=${creator.id}&tier=${tierId}`)
        handleOpenChange(false)
      }
    }
  }, [open, activeTab, isAuthenticated])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-white rounded-xl"
        data-testid="creator-services-modal"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {creator.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "video" | "subscription")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-6" style={{ width: 'calc(100% - 3rem)' }}>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Request Video
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscribe
            </TabsTrigger>
          </TabsList>

          {/* Video Request Tab */}
          <TabsContent value="video" className="p-6 pt-4 space-y-4">
            {/* Creator Info */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
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

            {/* Occasion Selection */}
            <div className="space-y-2">
              <Label htmlFor="occasion" className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-4 w-4" />
                What's the occasion? <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.occasion}
                onValueChange={(value) => handleFieldChange('occasion', value)}
              >
                <SelectTrigger
                  id="occasion"
                  data-testid="occasion-select"
                  className={errors.occasion ? "border-red-500" : ""}
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
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.occasion}
                </p>
              )}
            </div>

            {/* Recipient Name */}
            <div className="space-y-2">
              <Label htmlFor="recipientName" className="flex items-center gap-2 text-gray-900">
                <User className="h-4 w-4" />
                Who is this video for? <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="recipientName"
                data-testid="recipient-name-input"
                placeholder="Enter recipient's name"
                value={formData.recipientName}
                onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                onBlur={() => handleFieldBlur('recipientName')}
                className={errors.recipientName && touched.recipientName ? "border-red-500" : ""}
              />
              {errors.recipientName && touched.recipientName && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.recipientName}
                </p>
              )}
            </div>

            {/* Is it a gift? */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isGift"
                data-testid="gift-checkbox"
                checked={formData.isGift}
                onCheckedChange={(checked) => handleFieldChange('isGift', checked)}
                className="border-purple-300 data-[state=checked]:bg-purple-600"
              />
              <Label
                htmlFor="isGift"
                className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-900"
              >
                <Gift className="h-4 w-4" />
                This is a gift for someone else
              </Label>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions" className="flex items-center gap-2 text-gray-900">
                <MessageSquare className="h-4 w-4" />
                Instructions for {creator.name} <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="instructions"
                  data-testid="instructions-textarea"
                  placeholder="Tell the creator what you'd like them to say, any inside jokes, pronunciation guides, etc."
                  className={`min-h-[120px] resize-y ${
                    errors.instructions && touched.instructions ? "border-red-500" : ""
                  }`}
                  value={formData.instructions}
                  onChange={(e) => handleFieldChange('instructions', e.target.value)}
                  onBlur={() => handleFieldBlur('instructions')}
                  maxLength={500}
                />
                <span
                  className={`absolute bottom-2 right-2 text-xs ${
                    formData.instructions.length > 450 ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  {formData.instructions.length}/500
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Be specific! The more details you provide, the better the video will be.
              </p>
              {errors.instructions && touched.instructions && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.instructions}
                </p>
              )}
            </div>

            {/* What's Included */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                  <Info className="h-4 w-4 text-blue-600" />
                  What's Included
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-3 w-3 text-green-600" />
                    Personalized video message (30-90 seconds)
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-3 w-3 text-green-600" />
                    HD quality video
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-3 w-3 text-green-600" />
                    Downloadable file
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-3 w-3 text-green-600" />
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
                className="min-h-[44px] min-w-[100px]"
              >
                Cancel
              </Button>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-purple-600">${videoPrice}</p>
                </div>
                <Button
                  onClick={handleVideoSubmit}
                  disabled={loading}
                  data-testid="continue-checkout-button"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 min-h-[44px] min-w-[180px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      {isAuthenticated ? "Continue to Checkout" : "Sign up to Continue"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="p-4 sm:p-6 pt-4" data-testid="subscription-tab-content">
            <div className="w-full">
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm sm:text-base">
                  Get exclusive content, early access, and more perks from {creator.name}
                </p>
              </div>

              <CreatorSubscriptionTiers
                creatorId={creator.id}
                creatorName={creator.name}
                displayMode="carousel"
                onSubscribe={handleSubscribe}
              />

              {!isAuthenticated && (
                <div className="text-center mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Sign up to subscribe and support {creator.name}
                  </p>
                  <Button
                    onClick={() => {
                      const returnUrl = `/fan/creators/${creator.id}?openSubscription=true`
                      router.push(`/signup?returnTo=${encodeURIComponent(returnUrl)}`)
                      handleOpenChange(false)
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Sign up to Subscribe
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}