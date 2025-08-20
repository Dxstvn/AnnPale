"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Clock,
  Shield,
  CheckCircle,
  Sparkles,
  Heart,
  Users,
  Calendar,
  TrendingUp,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CreatorBookingSidebarProps {
  creatorId: string | number
  creatorName: string
  basePrice: number
  responseTime?: string
  completedVideos?: number
  rating?: number
  nextAvailable?: string
  bookingSlots?: number
}

export default function CreatorBookingSidebar({
  creatorId,
  creatorName,
  basePrice,
  responseTime = "24hr",
  completedVideos = 0,
  rating = 5.0,
  nextAvailable = "Today",
  bookingSlots = 10
}: CreatorBookingSidebarProps) {
  const [selectedPackage, setSelectedPackage] = React.useState<"basic" | "premium" | "vip">("premium")
  const [showPackageOptions, setShowPackageOptions] = React.useState(false)

  const packages = {
    basic: {
      name: "Basic",
      price: basePrice,
      delivery: "7 days",
      features: ["30-60 seconds", "1 revision"]
    },
    premium: {
      name: "Premium",
      price: Math.round(basePrice * 1.5),
      delivery: "3 days",
      features: ["60-90 seconds", "2 revisions", "HD quality"],
      popular: true
    },
    vip: {
      name: "VIP Experience",
      price: Math.round(basePrice * 2.5),
      delivery: "24 hours",
      features: ["90-120 seconds", "Unlimited revisions", "4K quality"]
    }
  }

  const currentPackage = packages[selectedPackage]

  return (
    <div className="space-y-6">
      {/* Main Booking Card */}
      <Card className="overflow-hidden border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Book a Video</CardTitle>
            {currentPackage.popular && (
              <Badge className="bg-white/20 text-white border-white/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Package Selector */}
          <div>
            <button
              onClick={() => setShowPackageOptions(!showPackageOptions)}
              className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
            >
              <div className="text-left">
                <p className="font-semibold text-gray-900">{currentPackage.name}</p>
                <p className="text-sm text-gray-600">{currentPackage.delivery} delivery</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">${currentPackage.price}</p>
                <ChevronDown className={cn(
                  "h-4 w-4 text-gray-400 transition-transform",
                  showPackageOptions && "rotate-180"
                )} />
              </div>
            </button>

            {/* Package Options Dropdown */}
            {showPackageOptions && (
              <div className="mt-2 space-y-2 p-2 bg-gray-50 rounded-lg">
                {(Object.keys(packages) as Array<keyof typeof packages>).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPackage(key)
                      setShowPackageOptions(false)
                    }}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors",
                      selectedPackage === key
                        ? "bg-purple-100 border-2 border-purple-400"
                        : "bg-white border-2 border-gray-200 hover:border-purple-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{packages[key].name}</p>
                        <p className="text-xs text-gray-600">{packages[key].delivery}</p>
                      </div>
                      <p className="font-bold text-purple-600">${packages[key].price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Features */}
          <div className="space-y-2">
            {currentPackage.features.slice(0, 3).map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Availability */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next Available
              </span>
              <span className="font-semibold text-green-600">{nextAvailable}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Response Time
              </span>
              <span className="font-semibold">{responseTime}</span>
            </div>
            {bookingSlots > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                <p className="text-xs text-amber-800 font-medium text-center">
                  Only {bookingSlots} slots left this week!
                </p>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Link href={`/book/${creatorId}?package=${selectedPackage}`}>
              <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:translate-y-[-2px] transition-all">
                <Sparkles className="h-5 w-5 mr-2" />
                Book Now - ${currentPackage.price}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full h-10 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Heart className="h-4 w-4 mr-2" />
              Save for Later
            </Button>
          </div>

          {/* View All Packages Link */}
          <div className="text-center">
            <Link 
              href="#packages" 
              className="text-sm text-purple-600 hover:text-purple-700 underline"
            >
              View all package options →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-4 w-4 text-blue-600" />
              100% Money-back guarantee
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Verified creator
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              {rating} rating ({completedVideos}+ reviews)
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4 text-purple-600" />
              {completedVideos}+ happy customers
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-sm text-gray-700">
            <span className="font-medium">12 people</span> booked {creatorName} today
          </p>
        </div>
      </div>
    </div>
  )
}