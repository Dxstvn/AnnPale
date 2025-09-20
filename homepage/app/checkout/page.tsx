"use client"

import { useState, useEffect, Suspense } from "react"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/client"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CreditCard, 
  Lock, 
  Shield, 
  Gift, 
  User, 
  Mail, 
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  Info,
  Sparkles,
  Star,
  ChevronLeft,
  AlertCircle,
  Zap,
  Crown,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { CreatorAvatar } from "@/components/ui/avatar-with-fallback"
import { useLanguage } from "@/contexts/language-context"
import { useRouter, useSearchParams } from "next/navigation"

// Dynamically import Stripe components to avoid SSR issues
const StripePaymentForm = dynamic(
  () => import("@/components/payment/stripe-payment-form"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Loading payment system...</div>
      </div>
    )
  }
)

const StripeSubscriptionCheckout = dynamic(
  () => import("@/components/payment/stripe-subscription-checkout"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Loading subscription checkout...</div>
      </div>
    )
  }
)

function CheckoutContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [giftMode, setGiftMode] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [videoRequestData, setVideoRequestData] = useState<any>(null)
  const [creatorInfo, setCreatorInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recipientName, setRecipientName] = useState('')
  const [occasion, setOccasion] = useState('')
  const [instructions, setInstructions] = useState('')
  const [rushDelivery, setRushDelivery] = useState(false)
  
  // Get params from URL (safely handle null searchParams)
  const type = searchParams?.get('type') || null
  const tier = searchParams?.get('tier') || null
  const tierName = searchParams?.get('name') || null
  const creatorId = searchParams?.get('creator') || null
  const price = searchParams?.get('price') || null
  const requestId = searchParams?.get('requestId') || null
  
  // Determine checkout type based on params
  const isSubscriptionCheckout = !!(tier && creatorId && price && type !== 'video')
  const isVideoCheckout = type === 'video' && !!requestId
  const [checkoutType, setCheckoutType] = useState<'video' | 'subscription'>(
    isVideoCheckout ? 'video' : isSubscriptionCheckout ? 'subscription' : 'video'
  )
  
  // Get creator data from fetched info or use fallback
  const creatorData = creatorInfo ? {
    name: creatorInfo.display_name || 'Creator',
    image: creatorInfo.avatar_url || '/images/default-creator.png',
    verified: true
  } : {
    name: 'Loading...',
    image: '/images/default-creator.png',
    verified: false
  }
  
  // Fetch video request data if it's a video checkout
  useEffect(() => {
    const fetchVideoRequestData = async () => {
      if (isVideoCheckout && requestId) {
        setLoading(true)
        try {
          const supabase = createClient()
          
          // Fetch the video request
          const { data: videoRequest, error: requestError } = await supabase
            .from('video_requests')
            .select(`
              *,
              creator:creator_id (
                id,
                username,
                display_name,
                avatar_url,
                bio
              )
            `)
            .eq('id', requestId)
            .single()
          
          if (requestError) {
            console.error('Error fetching video request:', requestError)
          } else if (videoRequest) {
            setVideoRequestData(videoRequest)
            setCreatorInfo(videoRequest.creator)
            // Prefill form fields with data from the video request
            setRecipientName(videoRequest.recipient_name || '')
            setOccasion(videoRequest.occasion || '')
            setInstructions(videoRequest.instructions || '')
          }
        } catch (error) {
          console.error('Error:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    
    fetchVideoRequestData()
  }, [isVideoCheckout, requestId])

  // Fetch creator data for subscription checkout from profiles table
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (isSubscriptionCheckout && creatorId) {
        try {
          const supabase = createClient()

          // Fetch from profiles table where creator data is stored
          const { data: creator, error } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url, bio')
            .eq('id', creatorId)
            .single()

          if (creator && !error) {
            setCreatorInfo(creator)
          } else if (error) {
            console.error('Error fetching creator data from profiles:', error)
          }
        } catch (error) {
          console.error('Error fetching creator data:', error)
        }
      }
    }

    fetchCreatorData()
  }, [isSubscriptionCheckout, creatorId])

  // Calculate rush fee and total
  const rushFee = 25
  const basePrice = videoRequestData?.price || 50
  const serviceFee = 0 // Removed service fee
  const calculatedTotal = basePrice + (rushDelivery ? rushFee : 0)
  
  // Video order data (use actual data if available, otherwise fallback)
  const videoOrderData = videoRequestData ? {
    creator: {
      name: creatorInfo?.display_name || creatorInfo?.username || "Creator",
      image: creatorInfo?.avatar_url || "/images/default-creator.png",
      price: basePrice,
      responseTime: rushDelivery ? "24hr" : "24-48hr",
      rating: 4.9,
      verified: true
    },
    occasion: videoRequestData.occasion,
    recipientName: videoRequestData.recipient_name,
    instructions: videoRequestData.instructions,
    requestType: videoRequestData.request_type,
    package: "Standard",
    subtotal: basePrice,
    serviceFee: serviceFee,
    rushFee: rushFee,
    rushDelivery: rushDelivery,
    total: calculatedTotal
  } : {
    creator: {
      name: "Loading...",
      image: "/images/default-creator.png",
      price: 50,
      responseTime: rushDelivery ? "24hr" : "24-48hr",
      rating: 4.9,
      verified: true
    },
    package: "Standard",
    subtotal: 50,
    serviceFee: 0,
    rushFee: rushFee,
    rushDelivery: rushDelivery,
    total: 50 + (rushDelivery ? rushFee : 0)
  }
  
  // Subscription order data
  const subscriptionOrderData = {
    creator: creatorData,
    tier: tierName || 'Subscription',
    tierId: tier, // Keep tier ID for backend processing
    price: parseFloat(price || '0'),
    billingCycle: 'monthly',
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    features: [
      'Exclusive content access',
      'Direct messaging with creator',
      'Early access to new videos',
      'Monthly live sessions',
      'Member-only community access'
    ]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }
    
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real app, would process payment and redirect to success page
    router.push("/order/success")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={checkoutType === 'subscription' ? `/fan/creators/${creatorId}` : "/browse"}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to {checkoutType === 'subscription' ? 'Creator' : 'Browse'}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {checkoutType === 'subscription' ? `Subscribe to ${creatorData.name}` : 'Complete Your Order'}
          </h1>
          <p className="text-gray-600 mt-2">
            {checkoutType === 'subscription'
              ? `Start your ${subscriptionOrderData.tier} subscription`
              : 'Secure checkout powered by Stripe'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <Card className="border-0 shadow-lg" data-testid="checkout-order-details">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>{checkoutType === 'subscription' ? 'Subscription Details' : 'Order Details'}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CreatorAvatar
                    src={checkoutType === 'subscription' ? creatorData.image : videoOrderData.creator.image}
                    name={checkoutType === 'subscription' ? creatorData.name : videoOrderData.creator.name}
                    size="lg"
                    verified={checkoutType === 'subscription' ? creatorData.verified : videoOrderData.creator.verified}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg" data-testid="checkout-creator-name">
                      {checkoutType === 'subscription' ? creatorData.name : videoOrderData.creator.name}
                    </h3>
                    {checkoutType === 'subscription' ? (
                      <>
                        <p className="text-gray-600" data-testid="checkout-tier-name">
                          {subscriptionOrderData.tier}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <RefreshCw className="h-4 w-4 text-gray-400" />
                            <span data-testid="checkout-billing-cycle">
                              Billed {subscriptionOrderData.billingCycle}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span data-testid="checkout-next-billing">
                              Next: {subscriptionOrderData.nextBilling}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600">Personalized Video Message</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{videoOrderData.creator.responseTime} delivery</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{videoOrderData.creator.rating}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    {checkoutType === 'subscription' ? (
                      <>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          {subscriptionOrderData.tier}
                        </Badge>
                        <p className="text-2xl font-bold mt-2" data-testid="checkout-price">
                          ${subscriptionOrderData.price}/mo
                        </p>
                      </>
                    ) : (
                      <>
                        {videoOrderData.requestType && (
                          <Badge className="bg-purple-600 text-white">
                            {videoOrderData.requestType === 'myself' ? 'For Me' : 'For Someone Else'}
                          </Badge>
                        )}
                        <p className="text-2xl font-bold mt-2">${videoOrderData.total}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Subscription Features or Video Details Summary */}
                {checkoutType === 'subscription' ? (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Included Benefits:</p>
                    <div className="space-y-2">
                      {subscriptionOrderData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2" data-testid={`checkout-feature-${index}`}>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Video Order Details */}
                    {videoOrderData.occasion && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">Video Details:</p>
                        <div className="space-y-2 text-sm text-gray-600">
                          {videoOrderData.recipientName && (
                            <div>
                              <span className="font-medium">For:</span> {videoOrderData.recipientName}
                            </div>
                          )}
                          {videoOrderData.occasion && (
                            <div>
                              <span className="font-medium">Occasion:</span> {videoOrderData.occasion}
                            </div>
                          )}
                          {videoOrderData.instructions && (
                            <div>
                              <span className="font-medium">Instructions:</span> {videoOrderData.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Rush Delivery Option */}
                    {checkoutType === 'video' && (
                      <div className="mt-4 pt-4 border-t">
                        <Label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={rushDelivery}
                              onCheckedChange={(checked) => setRushDelivery(checked as boolean)}
                              data-testid="rush-delivery-checkbox"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">Rush Delivery</span>
                              </div>
                              <span className="text-sm text-gray-600">Get your video within 24 hours</span>
                            </div>
                          </div>
                          <span className="font-semibold text-purple-600">+${rushFee}</span>
                        </Label>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Method - Use different component for subscriptions */}
            {checkoutType === 'subscription' ? (
              <StripeSubscriptionCheckout
                tierId={tier || ''}
                creatorId={creatorId || ''}
                price={subscriptionOrderData.price}
                billingPeriod="monthly"
                onSuccess={(sessionId) => {
                  console.log('Subscription checkout initiated:', sessionId)
                }}
                onError={(error) => {
                  console.error('Subscription checkout error:', error)
                  alert(`Subscription failed: ${error}`)
                }}
              />
            ) : (
              <StripePaymentForm
                amount={videoOrderData.total}
                currency="usd"
                creatorId={creatorId || undefined}
                requestDetails={{
                  type: 'video',
                  recipientName: videoRequestData?.recipient_name || recipientName,
                  occasion: videoRequestData?.occasion || occasion,
                  instructions: videoRequestData?.instructions || instructions,
                  rushDelivery: rushDelivery,
                  requestId,
                }}
                onSuccess={(paymentIntentId) => {
                  router.push(`/fan/orders/${paymentIntentId}`)
                }}
                onError={(error) => {
                  console.error('Payment error:', error)
                  alert(`Payment failed: ${error}`)
                }}
              />
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Price Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  {checkoutType === 'subscription' ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Subscription ({subscriptionOrderData.tier})</span>
                        <span>${subscriptionOrderData.price}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Billing Cycle</span>
                        <span>Monthly</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Due Today</span>
                        <span className="text-purple-600">${subscriptionOrderData.price}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Video Message ({videoOrderData.package})</span>
                        <span>${videoOrderData.subtotal}</span>
                      </div>
                      {videoOrderData.rushDelivery && (
                        <div className="flex justify-between text-sm">
                          <span>Rush Delivery</span>
                          <span>+${videoOrderData.rushFee}</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-purple-600">${videoOrderData.total}</span>
                      </div>
                    </>
                  )}

                  <div className="text-center text-sm text-gray-600">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Secure payment powered by Stripe
                  </div>
                </CardContent>
              </Card>

              {/* Security Badges */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div className="text-sm">
                        <p className="font-medium">Secure Payment</p>
                        <p className="text-gray-600">256-bit SSL encryption</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <div className="text-sm">
                        <p className="font-medium">Money-Back Guarantee</p>
                        <p className="text-gray-600">100% satisfaction or refund</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-purple-600" />
                      <div className="text-sm">
                        <p className="font-medium">Customer Support</p>
                        <p className="text-gray-600">24/7 help available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}