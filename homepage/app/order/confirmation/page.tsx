"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Calendar,
  Clock,
  Mail,
  Copy,
  Home,
  MessageSquare,
  Gift,
  Star,
  ArrowRight
} from "lucide-react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

interface OrderDetails {
  id: string
  creatorName: string
  creatorImage: string
  occasion: string
  recipientName: string
  price: number
  deliveryDate: string
  estimatedDelivery: string
  videoUrl?: string
  status: "pending" | "processing" | "completed"
  isGift: boolean
  giftRecipientEmail?: string
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Simulate fetching order details
  useEffect(() => {
    const orderId = searchParams.get("orderId") || "ANN-2024-001"
    
    // Mock order details (would come from API)
    const mockOrder: OrderDetails = {
      id: orderId,
      creatorName: "Wyclef Jean",
      creatorImage: "/images/wyclef-jean.png",
      occasion: "Birthday",
      recipientName: "Marie Joseph",
      price: 150,
      deliveryDate: "December 25, 2024",
      estimatedDelivery: "Within 3 days",
      status: "processing",
      isGift: searchParams.get("gift") === "true",
      giftRecipientEmail: "marie@example.com"
    }
    
    setOrderDetails(mockOrder)
    
    // Trigger confetti animation
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }, 500)
  }, [searchParams])

  const handleCopyOrderId = () => {
    if (orderDetails) {
      navigator.clipboard.writeText(orderDetails.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (!orderDetails) return
    
    setIsSharing(true)
    const shareData = {
      title: `Order Confirmation - Ann Pale`,
      text: `I just ordered a personalized video from ${orderDetails.creatorName}! 🎉`,
      url: window.location.href
    }
    
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback to copying link
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-600 text-lg">
            Your personalized video request has been sent to {orderDetails.creatorName}
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>
                    Order ID: <span className="font-mono font-medium">{orderDetails.id}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyOrderId}
                      className="ml-2"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardDescription>
                </div>
                <Badge 
                  variant={orderDetails.status === "completed" ? "success" : "warning"}
                  className="capitalize"
                >
                  {orderDetails.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Creator Info */}
              <div className="flex items-center gap-4">
                <img
                  src={orderDetails.creatorImage}
                  alt={orderDetails.creatorName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{orderDetails.creatorName}</h3>
                  <p className="text-sm text-gray-600">Creator</p>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Occasion</p>
                      <p className="font-medium">{orderDetails.occasion}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">For</p>
                      <p className="font-medium">{orderDetails.recipientName}</p>
                    </div>
                  </div>
                  
                  {orderDetails.isGift && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Gift recipient email</p>
                        <p className="font-medium">{orderDetails.giftRecipientEmail}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery by</p>
                      <p className="font-medium">{orderDetails.deliveryDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated time</p>
                      <p className="font-medium">{orderDetails.estimatedDelivery}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Total paid</p>
                      <p className="font-medium text-lg">${orderDetails.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What's Next Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Creator receives your request</p>
                    <p className="text-sm text-gray-600">
                      {orderDetails.creatorName} will review your message details
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Video recording</p>
                    <p className="text-sm text-gray-600">
                      Your personalized video will be recorded within the specified timeframe
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Delivery notification</p>
                    <p className="text-sm text-gray-600">
                      You'll receive an email when your video is ready to download
                    </p>
                  </div>
                </li>
                {orderDetails.isGift && (
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    <div>
                      <p className="font-medium">Gift delivery</p>
                      <p className="text-sm text-gray-600">
                        The video will be sent to {orderDetails.giftRecipientEmail} on the specified date
                      </p>
                    </div>
                  </li>
                )}
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => router.push("/")}
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/browse")}
          >
            Browse More Creators
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 className="mr-2 h-5 w-5" />
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-900">
                A confirmation email has been sent to your registered email address
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}