"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Star,
  Clock,
  Calendar,
  CheckCircle,
  TrendingUp,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PackageTier {
  id: string
  enabled: boolean
  name: string
  description: string
  price: number
  deliveryDays: number
  videoDuration: string
  revisions: number
  features: string[]
}

interface Addon {
  id: string
  enabled: boolean
  name: string
  description: string
  price: number
}

interface AvailabilitySettings {
  weeklyLimit: number
  responseTime: string
  vacationMode: boolean
  blackoutDates: string[]
  businessDays: string[]
  businessHours: {
    start: string
    end: string
  }
}

interface PreviewPanelProps {
  packageTiers: PackageTier[]
  addons: Addon[]
  availability: AvailabilitySettings
}

export default function PreviewPanel({
  packageTiers,
  addons,
  availability
}: PreviewPanelProps) {
  const [selectedPackage, setSelectedPackage] = React.useState(packageTiers[1]?.id || packageTiers[0]?.id)
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([])

  const getPackageColor = (id: string) => {
    const colors: Record<string, string> = {
      basic: "from-gray-600 to-gray-700",
      premium: "from-purple-600 to-pink-600",
      vip: "from-yellow-600 to-orange-600"
    }
    return colors[id] || "from-gray-600 to-gray-700"
  }

  const calculateTotal = () => {
    const packagePrice = packageTiers.find(t => t.id === selectedPackage)?.price || 0
    const addonsPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)
    return packagePrice + addonsPrice
  }

  if (availability.vacationMode) {
    return (
      <div className="text-center py-8">
        <div className="p-4 bg-amber-50 rounded-lg mb-4">
          <Calendar className="h-12 w-12 text-amber-600 mx-auto mb-2" />
          <p className="font-semibold text-amber-900">Currently Unavailable</p>
          <p className="text-sm text-amber-700">This creator is on vacation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Package Selection */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Select Package</h4>
        {packageTiers.map((tier) => {
          const isPopular = tier.id === "premium"
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedPackage(tier.id)}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition-all text-left relative",
                selectedPackage === tier.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              )}
            >
              {isPopular && (
                <Badge className="absolute -top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{tier.name}</p>
                  <p className="text-xs text-gray-600">{tier.videoDuration}s • {tier.deliveryDays} days</p>
                </div>
                <p className="font-bold text-purple-600">${tier.price}</p>
              </div>
            </button>
          )
        })}
      </div>

      {addons.length > 0 && (
        <>
          <Separator />
          {/* Add-ons */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Add-ons</h4>
            {addons.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedAddons.includes(addon.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAddons([...selectedAddons, addon.id])
                      } else {
                        setSelectedAddons(selectedAddons.filter(id => id !== addon.id))
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">{addon.name}</p>
                    <p className="text-xs text-gray-600">{addon.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +${addon.price}
                </Badge>
              </label>
            ))}
          </div>
        </>
      )}

      <Separator />

      {/* Availability Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Available
          </span>
          <span className="font-medium text-green-600">
            {availability.vacationMode ? "On vacation" : "Today"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Response
          </span>
          <span className="font-medium">{availability.responseTime}</span>
        </div>
      </div>

      <Separator />

      {/* Total */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total</span>
          <span className="text-xl font-bold text-purple-600">
            ${calculateTotal()}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
        <Sparkles className="h-4 w-4 mr-2" />
        Book Now
      </Button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-600" />
          <span>Verified</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>4.9 rating</span>
        </div>
      </div>
    </div>
  )
}