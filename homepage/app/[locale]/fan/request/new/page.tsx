"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Star,
  Clock,
  DollarSign,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  Cake,
  Trophy,
  Music,
  Sparkles,
  Video,
  MessageSquare,
  Globe,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Info,
  Zap,
  Shield,
  Filter,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector"
import { CreatorSelectionCard } from "@/components/enhanced/creator-selection-card"
import { VideoDetailsForm } from "@/components/enhanced/video-details-form"
import { EnhancedPaymentForm } from "@/components/enhanced/enhanced-payment-form"
import type { PaymentMethodSelection } from "@/types/video"

// Dynamic import for Stripe component to avoid SSR issues
const StripeCardForm = dynamic(
  () => import('@/components/payment/stripe-card-form'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
)

// Types
interface Creator {
  id: string
  name: string
  category: string
  avatar: string
  rating: number
  price: number
  responseTime: string
  completedVideos: number
  bio?: string
  languages?: string[]
  isAvailable: boolean
  specialties?: string[]
}

interface RequestFormData {
  creatorId: string
  occasion: string
  recipientName: string
  recipientRelation: string
  instructions: string
  deliveryDate?: Date
  rushOrder: boolean
  privateVideo: boolean
  allowDownload: boolean
}

// Mock creators data
const mockCreators: Creator[] = [
  {
    id: "1",
    name: "Marie Jean",
    category: "Music",
    avatar: "/placeholder.svg",
    rating: 4.9,
    price: 75,
    responseTime: "24h",
    completedVideos: 523,
    bio: "Award-winning Haitian singer bringing joy through personalized songs",
    languages: ["English", "Kreyòl", "Français"],
    isAvailable: true,
    specialties: ["Birthday songs", "Love messages", "Motivational"]
  },
  {
    id: "2",
    name: "Jean Baptiste",
    category: "Comedy",
    avatar: "/placeholder.svg",
    rating: 4.8,
    price: 50,
    responseTime: "48h",
    completedVideos: 342,
    bio: "Making people laugh with authentic Haitian humor",
    languages: ["Kreyòl", "English"],
    isAvailable: true,
    specialties: ["Roasts", "Birthday jokes", "Family humor"]
  },
  {
    id: "3",
    name: "Claudette Pierre",
    category: "Sports",
    avatar: "/placeholder.svg",
    rating: 4.7,
    price: 60,
    responseTime: "12h",
    completedVideos: 189,
    bio: "Olympic athlete inspiring the next generation",
    languages: ["English", "Français"],
    isAvailable: true,
    specialties: ["Motivation", "Training tips", "Victory celebrations"]
  }
]

const occasions = [
  { id: "birthday", label: "Birthday", icon: Cake, popular: true },
  { id: "anniversary", label: "Anniversary", icon: Heart, popular: true },
  { id: "graduation", label: "Graduation", icon: Trophy, popular: true },
  { id: "motivation", label: "Motivation", icon: Sparkles, popular: false },
  { id: "congratulations", label: "Congratulations", icon: Star, popular: false },
  { id: "get-well", label: "Get Well", icon: Heart, popular: false },
  { id: "holiday", label: "Holiday", icon: Gift, popular: false },
  { id: "custom", label: "Custom Message", icon: MessageSquare, popular: false }
]

export default function FanRequestNewPage() {
  const router = useRouter()
  const t = useTranslations()
  const { user, isLoading: authLoading, isAuthenticated } = useSupabaseAuth()
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [formData, setFormData] = useState<RequestFormData>({
    creatorId: "",
    occasion: "",
    recipientName: "",
    recipientRelation: "",
    instructions: "",
    rushOrder: false,
    privateVideo: false,
    allowDownload: true
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodSelection | null>(null)
  
  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const totalSteps = 4
  const progressValue = (currentStep / totalSteps) * 100
  
  // Filter creators
  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creator.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || creator.category === categoryFilter
    return matchesSearch && matchesCategory && creator.isAvailable
  })
  
  // Sort creators
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "rating") return b.rating - a.rating
    if (sortBy === "response") return parseInt(a.responseTime) - parseInt(b.responseTime)
    return b.completedVideos - a.completedVideos // popular
  })
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedCreator) return 0
    let total = selectedCreator.price
    if (formData.rushOrder) total += 25 // Rush order fee
    return total
  }
  
  // Handle step navigation
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  // Handle creator selection
  const handleCreatorSelect = (creator: Creator) => {
    setSelectedCreator(creator)
    setFormData({ ...formData, creatorId: creator.id })
    handleNextStep()
  }
  
  // Handle successful payment
  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentMethod({ method: 'stripe', intentId: paymentIntentId } as any)
    setShowConfirmation(true)
  }
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Request a Personalized Video
          </h1>
          <p className="text-gray-600 mt-2">
            Get a custom video message from your favorite Haitian creator
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium">
              {currentStep === 1 && "Choose Creator"}
              {currentStep === 2 && "Video Details"}
              {currentStep === 3 && "Review"}
              {currentStep === 4 && "Payment"}
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
        
        {/* Step 1: Creator Selection */}
        {currentStep === 1 && (
          <CreatorSelectionCard
            creators={mockCreators}
            onCreatorSelect={handleCreatorSelect}
            selectedCreatorId={selectedCreator?.id}
          />
        )}
        
        {/* Step 2: Video Details */}
        {currentStep === 2 && selectedCreator && (
          <VideoDetailsForm
            creator={{
              id: selectedCreator.id,
              name: selectedCreator.name,
              category: selectedCreator.category,
              avatar: selectedCreator.avatar,
              responseTime: selectedCreator.responseTime
            }}
            onBack={handlePreviousStep}
            onContinue={(data) => {
              setFormData({
                ...formData,
                occasion: data.occasion,
                recipientName: data.recipientName,
                recipientRelation: data.recipientRelation,
                instructions: data.instructions,
                rushOrder: data.rushDelivery,
                privateVideo: data.privateVideo
              })
              handleNextStep()
            }}
          />
        )}
        
        {/* Step 3: Review */}
        {currentStep === 3 && selectedCreator && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Review Your Request
                </CardTitle>
                <CardDescription>
                  Please review the details before proceeding to payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Creator */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedCreator.avatar} />
                      <AvatarFallback>{selectedCreator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Creator</p>
                      <p className="text-sm text-gray-600">{selectedCreator.name}</p>
                    </div>
                  </div>
                  <Badge>{selectedCreator.category}</Badge>
                </div>
                
                {/* Video Details */}
                <div className="space-y-3">
                  <h3 className="font-medium">Video Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Occasion</span>
                      <span className="font-medium">
                        {occasions.find(o => o.id === formData.occasion)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">For</span>
                      <span className="font-medium">{formData.recipientName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Relationship</span>
                      <span className="font-medium capitalize">{formData.recipientRelation}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-medium">
                        {formData.rushOrder ? "Rush (24 hours)" : `Standard (${selectedCreator.responseTime})`}
                      </span>
                    </div>
                    {formData.privateVideo && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Privacy</span>
                        <span className="font-medium">Private Video</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="space-y-2">
                  <h3 className="font-medium">Instructions</h3>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {formData.instructions}
                  </p>
                </div>
                
                {/* Pricing */}
                <div className="space-y-2 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Base Video Price</span>
                      <span>${selectedCreator.price}</span>
                    </div>
                    {formData.rushOrder && (
                      <div className="flex justify-between">
                        <span>Rush Delivery</span>
                        <span>$25</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Total</span>
                      <span className="text-purple-600">${calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Proceed to Payment
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {/* Step 4: Payment */}
        {currentStep === 4 && selectedCreator && (
          <div className="space-y-6">
            <EnhancedPaymentForm
              amount={calculateTotalPrice()}
              currency="USD"
              description={`Video request from ${selectedCreator.name}`}
              onPaymentSuccess={(paymentId) => {
                setPaymentMethod({ method: 'stripe', intentId: paymentId } as any)
                setShowConfirmation(true)
              }}
              onPaymentError={(error) => {
                setError(error)
              }}
            />
            
            <Card>
              <CardFooter className="flex justify-center pt-6">
                <Button variant="outline" onClick={handlePreviousStep} disabled={isSubmitting}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Review
                </Button>
              </CardFooter>
            </Card>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="text-center">
            <DialogHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle>Request Submitted Successfully!</DialogTitle>
              <DialogDescription className="space-y-3">
                <div>
                  Your video request has been sent to {selectedCreator?.name}.
                </div>
                <div>
                  You'll receive an email notification when your video is ready.
                  Expected delivery: {formData.rushOrder ? "Within 24 hours" : selectedCreator?.responseTime}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={() => router.push('/fan/orders')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                View Order Status
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/fan/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}