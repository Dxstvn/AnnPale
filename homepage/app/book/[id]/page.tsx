"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

const creatorsData = {
  "1": {
    id: 1,
    name: "Wyclef Jean",
    category: "Musician",
    price: 150,
    rating: 4.9,
    reviews: 1247,
    image: "/images/wyclef-jean.png",
    responseTime: "24hr",
    verified: true,
  },
  "2": {
    id: 2,
    name: "Ti Jo Zenny",
    category: "Comedian",
    price: 85,
    rating: 4.8,
    reviews: 456,
    image: "/images/ti-jo-zenny.jpg",
    responseTime: "2 days",
    verified: true,
  },
  "4": {
    id: 4,
    name: "Richard Cave",
    category: "Actor",
    price: 120,
    rating: 4.9,
    reviews: 678,
    image: "/images/richard-cave.jpg",
    responseTime: "3 days",
    verified: true,
  },
  "5": {
    id: 5,
    name: "Michael Brun",
    category: "DJ/Producer",
    price: 200,
    rating: 4.8,
    reviews: 892,
    image: "/images/michael-brun.jpg",
    responseTime: "2 days",
    verified: true,
  },
  "6": {
    id: 6,
    name: "Rutshelle Guillaume",
    category: "Singer",
    price: 85,
    rating: 4.9,
    reviews: 634,
    image: "/images/rutshelle-guillaume.jpg",
    responseTime: "1 day",
    verified: true,
  },
  "7": {
    id: 7,
    name: "Kenny",
    category: "Singer",
    price: 95,
    rating: 4.6,
    reviews: 423,
    image: "/images/kenny.jpg",
    responseTime: "2 days",
    verified: true,
  },
  "8": {
    id: 8,
    name: "Carel Pedre",
    category: "Radio Host",
    price: 110,
    rating: 4.8,
    reviews: 567,
    image: "/images/carel-pedre.jpg",
    responseTime: "1 day",
    verified: true,
  },
  "9": {
    id: 9,
    name: "DJ K9",
    category: "DJ",
    price: 65,
    rating: 4.7,
    reviews: 234,
    image: "/images/dj-k9.jpg",
    responseTime: "24hr",
    verified: true,
  },
  "10": {
    id: 10,
    name: "DJ Bullet",
    category: "DJ",
    price: 70,
    rating: 4.6,
    reviews: 189,
    image: "/images/dj-bullet.jpg",
    responseTime: "1 day",
    verified: true,
  },
  "11": {
    id: 11,
    name: "J Perry",
    category: "Singer",
    price: 90,
    rating: 4.8,
    reviews: 345,
    image: "/images/jonathan-perry.jpg",
    responseTime: "2 days",
    verified: true,
  },
  "13": {
    id: 13,
    name: "Reynaldo Martino",
    category: "Singer",
    price: 105,
    rating: 4.8,
    reviews: 312,
    image: "/images/reynaldo-martino.jpg",
    responseTime: "2 days",
    verified: true,
  },
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const creatorId = params.id as string
  const creator = creatorsData[creatorId as keyof typeof creatorsData]

  const [formData, setFormData] = useState({
    occasion: "",
    recipientName: "",
    message: "",
    language: "english",
    isGift: false,
    giftEmail: "",
    deliveryDate: "",
  })

  const [step, setStep] = useState(1)

  if (!creator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Creator not found</h1>
          <Button asChild>
            <Link href="/browse">Browse Creators</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Process payment and booking
      router.push(`/booking-confirmation/${creatorId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>🎤</span>
              <span>Ann Pale</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href={`/creator/${creatorId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {creator.name}'s profile
            </Link>
          </Button>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? "bg-purple-600" : "bg-gray-200"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {step === 1 && "Tell us about your video"}
                    {step === 2 && "Review your request"}
                    {step === 3 && "Payment details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                      <>
                        <div>
                          <Label htmlFor="occasion">What's the occasion?</Label>
                          <Input
                            id="occasion"
                            placeholder="e.g., Birthday, Graduation, Anniversary"
                            value={formData.occasion}
                            onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="recipientName">Who is this video for?</Label>
                          <Input
                            id="recipientName"
                            placeholder="Recipient's name"
                            value={formData.recipientName}
                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="message">What would you like {creator.name} to say?</Label>
                          <Textarea
                            id="message"
                            placeholder="Be specific about what you'd like mentioned..."
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Be specific! The more details you provide, the more personalized your video will be.
                          </p>
                        </div>

                        <div>
                          <Label>Preferred language</Label>
                          <RadioGroup
                            value={formData.language}
                            onValueChange={(value) => setFormData({ ...formData, language: value })}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="english" id="english" />
                              <Label htmlFor="english">English</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="creole" id="creole" />
                              <Label htmlFor="creole">Haitian Creole</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="french" id="french" />
                              <Label htmlFor="french">French</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isGift"
                            checked={formData.isGift}
                            onCheckedChange={(checked) => setFormData({ ...formData, isGift: checked as boolean })}
                          />
                          <Label htmlFor="isGift">This is a gift for someone else</Label>
                        </div>

                        {formData.isGift && (
                          <div>
                            <Label htmlFor="giftEmail">Recipient's email (optional)</Label>
                            <Input
                              id="giftEmail"
                              type="email"
                              placeholder="recipient@example.com"
                              value={formData.giftEmail}
                              onChange={(e) => setFormData({ ...formData, giftEmail: e.target.value })}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Occasion</h3>
                          <p className="text-gray-600">{formData.occasion}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Recipient</h3>
                          <p className="text-gray-600">{formData.recipientName}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Message</h3>
                          <p className="text-gray-600">{formData.message}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Language</h3>
                          <p className="text-gray-600 capitalize">{formData.language}</p>
                        </div>
                        {formData.isGift && (
                          <div>
                            <h3 className="font-semibold mb-2">Gift Details</h3>
                            <p className="text-gray-600">
                              This is a gift{formData.giftEmail && ` for ${formData.giftEmail}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="billingName">Name on Card</Label>
                          <Input id="billingName" placeholder="Full name" required />
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Shield className="h-4 w-4" />
                          <span>Your payment information is secure and encrypted</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      {step > 1 && (
                        <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                          Back
                        </Button>
                      )}
                      <Button type="submit" className="ml-auto">
                        {step === 3 ? `Pay $${creator.price}` : "Continue"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src={creator.image || "/placeholder.svg"}
                      alt={creator.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{creator.name}</h3>
                      <p className="text-sm text-gray-600">{creator.category}</p>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{creator.rating}</span>
                        {creator.verified && <Badge className="text-xs">Verified</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Video message</span>
                      <span>${creator.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>$5</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${creator.price + 5}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Delivery:</strong> Typically within {creator.responseTime}
                    </p>
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
