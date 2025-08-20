"use client"

import { useState } from "react"
import { Metadata } from "next"
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
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { CreatorAvatar } from "@/components/ui/avatar-with-fallback"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [giftMode, setGiftMode] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  
  // Mock order data - in real app would come from context/params
  const orderData = {
    creator: {
      name: "Wyclef Jean",
      image: "/images/wyclef-jean.png",
      price: 150,
      responseTime: "24hr",
      rating: 4.9,
      verified: true
    },
    package: "Premium",
    addOns: {
      rushDelivery: true,
      extraLength: false,
      hdQuality: true,
      giftWrap: false
    },
    subtotal: 150,
    rushFee: 25,
    hdFee: 10,
    serviceFee: 5,
    total: 190
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
            <Link href="/browse">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
          <p className="text-gray-600 mt-2">Secure checkout powered by Stripe</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CreatorAvatar
                    src={orderData.creator.image}
                    name={orderData.creator.name}
                    size="lg"
                    verified={orderData.creator.verified}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{orderData.creator.name}</h3>
                    <p className="text-gray-600">Personalized Video Message</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{orderData.creator.responseTime} delivery</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{orderData.creator.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-purple-600 text-white">{orderData.package}</Badge>
                    <p className="text-2xl font-bold mt-2">${orderData.total}</p>
                  </div>
                </div>

                {/* Add-ons Summary */}
                {(orderData.addOns.rushDelivery || orderData.addOns.hdQuality) && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected Add-ons:</p>
                    <div className="flex flex-wrap gap-2">
                      {orderData.addOns.rushDelivery && (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Rush Delivery (+$25)
                        </Badge>
                      )}
                      {orderData.addOns.hdQuality && (
                        <Badge variant="secondary">
                          <Sparkles className="h-3 w-3 mr-1" />
                          4K Ultra HD (+$10)
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recipient Information</CardTitle>
                <CardDescription>Who is this video for?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox 
                      checked={giftMode}
                      onCheckedChange={(checked) => setGiftMode(checked as boolean)}
                    />
                    <Gift className="h-4 w-4" />
                    This is a gift for someone else
                  </Label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipient-name">
                      {giftMode ? "Recipient's Name *" : "Your Name *"}
                    </Label>
                    <Input id="recipient-name" placeholder="Enter name" required />
                  </div>
                  <div>
                    <Label htmlFor="occasion">Occasion *</Label>
                    <Input id="occasion" placeholder="e.g., Birthday, Graduation" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea 
                    id="instructions" 
                    placeholder="Any specific message or pronunciation notes for the creator"
                    className="min-h-[100px]"
                  />
                </div>

                {giftMode && (
                  <Alert className="bg-purple-50 border-purple-200">
                    <Info className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-700">
                      We'll send the video to you first so you can review it before gifting
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Where should we send the video?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="email" type="email" className="pl-10" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input id="phone" type="tel" className="pl-10" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>All transactions are secure and encrypted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Credit/Debit Card
                        </div>
                        <div className="flex gap-2">
                          <img src="/visa.svg" alt="Visa" className="h-6" />
                          <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                          <img src="/amex.svg" alt="Amex" className="h-6" />
                        </div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <img src="/paypal.svg" alt="PayPal" className="h-4" />
                        PayPal
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="card-number" className="pl-10" placeholder="1234 5678 9012 3456" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billing-name">Name on Card</Label>
                      <Input id="billing-name" placeholder="John Doe" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <Checkbox 
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the <Link href="/terms" className="text-purple-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
              </Label>
            </div>
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
                  <div className="flex justify-between text-sm">
                    <span>Video Message ({orderData.package})</span>
                    <span>${orderData.subtotal}</span>
                  </div>
                  {orderData.addOns.rushDelivery && (
                    <div className="flex justify-between text-sm">
                      <span>Rush Delivery</span>
                      <span>+${orderData.rushFee}</span>
                    </div>
                  )}
                  {orderData.addOns.hdQuality && (
                    <div className="flex justify-between text-sm">
                      <span>4K Ultra HD</span>
                      <span>+${orderData.hdFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>${orderData.serviceFee}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">${orderData.total}</span>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isProcessing || !agreedToTerms}
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Order • ${orderData.total}
                      </>
                    )}
                  </Button>
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