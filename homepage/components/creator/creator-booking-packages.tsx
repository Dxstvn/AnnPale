"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Zap,
  Star,
  Clock,
  Gift,
  Shield,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Heart,
  Calendar,
  Users,
  MessageSquare,
  Video,
  Award
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"

interface BookingPackage {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  deliveryTime: string
  popular?: boolean
  icon: React.ReactNode
  color: string
}

interface CreatorBookingPackagesProps {
  creatorId: string | number
  creatorName: string
  basePrice: number
}

export default function CreatorBookingPackages({
  creatorId,
  creatorName,
  basePrice
}: CreatorBookingPackagesProps) {
  const [selectedPackage, setSelectedPackage] = React.useState("premium")
  const [addOns, setAddOns] = React.useState({
    rushDelivery: false,
    extraLength: false,
    hdQuality: false,
    giftWrap: false
  })

  const packages: BookingPackage[] = [
    {
      id: "basic",
      name: "Basic",
      price: basePrice,
      description: "Perfect for simple personal messages",
      features: [
        "30-60 second video",
        "Standard delivery (7 days)",
        "One revision included",
        "Digital download"
      ],
      deliveryTime: "7 days",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "from-gray-600 to-gray-700"
    },
    {
      id: "premium",
      name: "Premium",
      price: basePrice * 1.5,
      originalPrice: basePrice * 1.8,
      description: "Most popular choice with extra features",
      features: [
        "60-90 second video",
        "Priority delivery (3 days)",
        "Two revisions included",
        "HD quality video",
        "Custom background",
        "Special shoutout"
      ],
      deliveryTime: "3 days",
      popular: true,
      icon: <Star className="h-5 w-5" />,
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "vip",
      name: "VIP Experience",
      price: basePrice * 2.5,
      description: "Ultimate personalized experience",
      features: [
        "90-120 second video",
        "Express delivery (24hr)",
        "Unlimited revisions",
        "4K quality video",
        "Custom script review",
        "Behind-the-scenes content",
        "Personal thank you note",
        "Priority support"
      ],
      deliveryTime: "24 hours",
      icon: <Award className="h-5 w-5" />,
      color: "from-yellow-600 to-orange-600"
    }
  ]

  const selectedPackageData = packages.find(p => p.id === selectedPackage)
  
  const calculateTotal = () => {
    let total = selectedPackageData?.price || basePrice
    if (addOns.rushDelivery) total += 25
    if (addOns.extraLength) total += 15
    if (addOns.hdQuality) total += 10
    if (addOns.giftWrap) total += 5
    return total
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Package</h2>
        <p className="text-gray-600">Select the perfect video message experience</p>
      </div>

      {/* Package Cards - Improved responsive layout with better spacing */}
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <button
              onClick={() => setSelectedPackage(pkg.id)}
              className={cn(
                "w-full h-full min-h-[400px] p-4 sm:p-6 rounded-xl border-2 transition-all text-left flex flex-col",
                selectedPackage === pkg.id
                  ? "border-purple-600 bg-purple-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
              )}
            >
              {/* Package Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3 bg-gradient-to-r",
                    pkg.color
                  )}>
                    {pkg.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                </div>
                <div className="text-right">
                  {pkg.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">${pkg.originalPrice}</p>
                  )}
                  <p className="text-2xl font-bold text-gray-900">${pkg.price}</p>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Delivery: {pkg.deliveryTime}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              {selectedPackage === pkg.id && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <Badge className="w-full justify-center bg-purple-600 text-white">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Selected
                  </Badge>
                </div>
              )}
            </button>
          </motion.div>
        ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Add-ons Section */}
      <div className="w-full">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
          <Gift className="h-5 w-5 text-purple-600" />
          Enhance Your Order
        </h3>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors">
            <Checkbox
              checked={addOns.rushDelivery}
              onCheckedChange={(checked) => 
                setAddOns(prev => ({ ...prev, rushDelivery: checked as boolean }))
              }
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Rush Delivery</p>
                  <p className="text-sm text-gray-600">Get your video in 24 hours</p>
                </div>
                <Badge className="bg-green-100 text-green-700">+$25</Badge>
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors">
            <Checkbox
              checked={addOns.extraLength}
              onCheckedChange={(checked) => 
                setAddOns(prev => ({ ...prev, extraLength: checked as boolean }))
              }
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Extra Length</p>
                  <p className="text-sm text-gray-600">Add 30 more seconds</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700">+$15</Badge>
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors">
            <Checkbox
              checked={addOns.hdQuality}
              onCheckedChange={(checked) => 
                setAddOns(prev => ({ ...prev, hdQuality: checked as boolean }))
              }
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">4K Ultra HD</p>
                  <p className="text-sm text-gray-600">Highest quality video</p>
                </div>
                <Badge className="bg-purple-100 text-purple-700">+$10</Badge>
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-colors">
            <Checkbox
              checked={addOns.giftWrap}
              onCheckedChange={(checked) => 
                setAddOns(prev => ({ ...prev, giftWrap: checked as boolean }))
              }
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Gift Wrapping</p>
                  <p className="text-sm text-gray-600">Special gift presentation</p>
                </div>
                <Badge className="bg-pink-100 text-pink-700">+$5</Badge>
              </div>
            </div>
          </label>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Order Summary */}
      <div className="max-w-md mx-auto lg:max-w-lg">
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 border border-purple-100">
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{selectedPackageData?.name} Package</span>
            <span className="font-medium">${selectedPackageData?.price}</span>
          </div>
          {addOns.rushDelivery && (
            <div className="flex justify-between">
              <span className="text-gray-600">Rush Delivery</span>
              <span className="font-medium">+$25</span>
            </div>
          )}
          {addOns.extraLength && (
            <div className="flex justify-between">
              <span className="text-gray-600">Extra Length</span>
              <span className="font-medium">+$15</span>
            </div>
          )}
          {addOns.hdQuality && (
            <div className="flex justify-between">
              <span className="text-gray-600">4K Ultra HD</span>
              <span className="font-medium">+$10</span>
            </div>
          )}
          {addOns.giftWrap && (
            <div className="flex justify-between">
              <span className="text-gray-600">Gift Wrapping</span>
              <span className="font-medium">+$5</span>
            </div>
          )}
          <Separator className="my-3" />
          <div className="flex justify-between text-base">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-xl text-purple-600">${calculateTotal()}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 space-y-3">
          <Link href={`/book/${creatorId}`}>
            <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Sparkles className="h-5 w-5 mr-2" />
              Book Now - ${calculateTotal()}
            </Button>
          </Link>
          <Button variant="outline" className="w-full h-11 border-gray-300">
            <Heart className="h-4 w-4 mr-2" />
            Save for Later
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span>100% Satisfaction</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-md mx-auto lg:max-w-lg">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-sm text-gray-700">
            <span className="font-medium">12 people</span> booked {creatorName} in the last 24 hours
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}