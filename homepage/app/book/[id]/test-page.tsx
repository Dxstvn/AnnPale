"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Clock,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

// Get creator data (same as profile page)
const creatorsData = {
  "marie-jean": {
    id: "marie-jean",
    name: "Marie Jean",
    price: 50,
    rushPrice: 25,
    platformFeePercentage: 0.20,
    responseTime: "48hr",
    image: "/images/marie-jean.jpg"
  },
  "1": {
    id: 1,
    name: "Wyclef Jean",
    price: 150,
    rushPrice: 75,
    platformFeePercentage: 0.30,
    responseTime: "24hr",
    image: "/images/wyclef-jean.png"
  }
}

const occasions = [
  { value: "birthday", label: "Birthday", icon: "🎂" },
  { value: "anniversary", label: "Anniversary", icon: "💑" },
  { value: "congratulations", label: "Congratulations", icon: "🎉" },
  { value: "encouragement", label: "Encouragement", icon: "💪" },
  { value: "getwell", label: "Get Well Soon", icon: "🌻" },
  { value: "graduation", label: "Graduation", icon: "🎓" },
  { value: "wedding", label: "Wedding", icon: "💍" },
  { value: "other", label: "Other", icon: "✨" }
]

export default function SimpleBookingPage() {
  const params = useParams()
  const router = useRouter()
  
  const creatorId = params.id as string
  const creator = creatorsData[creatorId as keyof typeof creatorsData]
  
  const [formData, setFormData] = React.useState({
    videoType: "personal",
    recipientName: "",
    occasion: "",
    instructions: "",
    rushDelivery: false
  })
  
  const [showPayment, setShowPayment] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [paymentError, setPaymentError] = React.useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = React.useState(false)
  const [requestId, setRequestId] = React.useState<string | null>(null)
  
  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Creator not found</h1>
      </div>
    )
  }
  
  // Calculate pricing
  const basePrice = creator.price
  const rushFee = formData.rushDelivery ? creator.rushPrice : 0
  const totalPrice = basePrice + rushFee
  const platformFee = totalPrice * creator.platformFeePercentage
  const creatorEarnings = totalPrice - platformFee
  
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPayment(true)
  }
  
  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentError(null)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate test card validation
    const testCard = (document.querySelector('[placeholder="Card number"]') as HTMLInputElement)?.value
    
    if (testCard === '4000000000000002') {
      // Declined card
      setPaymentError('Your card was declined')
      setIsProcessing(false)
      return
    }
    
    // Payment successful
    const newRequestId = `req_${Date.now()}`
    setRequestId(newRequestId)
    setPaymentSuccess(true)
    setIsProcessing(false)
    toast.success("Payment successful! The creator has been notified.")
  }
  
  if (paymentSuccess && requestId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card data-testid="payment-success">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2" data-testid="success-message">
                Payment successful!
              </h2>
              <p className="text-gray-600 mb-4">
                Your video request has been sent to {creator.name}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6" data-testid="request-summary">
                <p className="text-sm text-gray-600 mb-1">Request ID</p>
                <p className="font-mono font-semibold" data-testid="request-id">{requestId}</p>
                <Separator className="my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>For:</span>
                    <span className="font-medium">{formData.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total paid:</span>
                    <span className="font-medium">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-medium">
                      {formData.rushDelivery ? "24 hours" : creator.responseTime}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className="mb-4" data-testid="notification-sent">
                <CheckCircle className="h-3 w-3 mr-1" />
                Creator has been notified
              </Badge>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/my-requests')}
                  className="w-full"
                >
                  View My Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Book a Video from {creator.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {!showPayment ? (
              <form onSubmit={handleContinueToPayment} data-testid="video-request-form">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="video-type">Video Type</Label>
                      <Select
                        value={formData.videoType}
                        onValueChange={(value) => setFormData({...formData, videoType: value})}
                      >
                        <SelectTrigger id="video-type" data-testid="video-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Message</SelectItem>
                          <SelectItem value="business">Business/Corporate</SelectItem>
                          <SelectItem value="roast">Friendly Roast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="recipient">Recipient Name</Label>
                      <Input
                        id="recipient"
                        data-testid="recipient-name"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                        placeholder="Who is this video for?"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="occasion">Occasion</Label>
                      <Select
                        value={formData.occasion}
                        onValueChange={(value) => setFormData({...formData, occasion: value})}
                        required
                      >
                        <SelectTrigger id="occasion" data-testid="occasion">
                          <SelectValue placeholder="Select an occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          {occasions.map(occ => (
                            <SelectItem key={occ.value} value={occ.value}>
                              <span className="flex items-center gap-2">
                                <span>{occ.icon}</span>
                                <span>{occ.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="instructions">Instructions</Label>
                      <Textarea
                        id="instructions"
                        data-testid="instructions"
                        value={formData.instructions}
                        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                        placeholder="Provide any specific details or instructions for the video..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rush"
                        data-testid="rush-delivery"
                        checked={formData.rushDelivery}
                        onCheckedChange={(checked) => 
                          setFormData({...formData, rushDelivery: checked as boolean})
                        }
                      />
                      <Label htmlFor="rush" className="flex items-center gap-2 cursor-pointer">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Rush Delivery (24 hours) +${creator.rushPrice}
                      </Label>
                    </div>
                  </div>
                  
                  {/* Right Column - Pricing */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Base Price</span>
                          <span data-testid="base-price">${basePrice}</span>
                        </div>
                        {formData.rushDelivery && (
                          <div className="flex justify-between text-yellow-600">
                            <span>Rush Fee</span>
                            <span data-testid="rush-fee">${rushFee}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span data-testid="total-price">${totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Platform Fee ({(creator.platformFeePercentage * 100).toFixed(0)}%)</span>
                          <span data-testid="platform-fee">${platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Creator Earnings</span>
                          <span data-testid="creator-earnings">Creator receives: ${creatorEarnings.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      data-testid="continue-to-payment"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div data-testid="payment-section">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg space-y-3">
                    <Input placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM / YY" />
                      <Input placeholder="CVC" />
                    </div>
                    <Input placeholder="ZIP" />
                  </div>
                  
                  {paymentError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2" data-testid="payment-error">
                      <AlertCircle className="h-4 w-4" />
                      <span>{paymentError}</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handlePayment}
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                    data-testid={paymentError ? "retry-payment" : "confirm-payment"}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : paymentError ? (
                      "Retry Payment"
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Pay ${totalPrice}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}