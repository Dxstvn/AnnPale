"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const occasions = [
  { id: "birthday", label: "Birthday", icon: "🎂", popular: true },
  { id: "anniversary", label: "Anniversary", icon: "💑", popular: false },
  { id: "graduation", label: "Graduation", icon: "🎓", popular: false },
  { id: "wedding", label: "Wedding", icon: "💒", popular: false },
  { id: "baby", label: "New Baby", icon: "👶", popular: false },
  { id: "getwell", label: "Get Well", icon: "💐", popular: false },
  { id: "congratulations", label: "Congratulations", icon: "🎉", popular: true },
  { id: "motivation", label: "Motivation", icon: "💪", popular: false },
  { id: "justbecause", label: "Just Because", icon: "😊", popular: true },
  { id: "holiday", label: "Holiday", icon: "🎄", popular: false },
  { id: "roast", label: "Roast", icon: "🔥", popular: false },
  { id: "other", label: "Other", icon: "✨", popular: false }
]

interface OccasionSelectionProps {
  bookingData: any
  updateBookingData: (data: any) => void
  creator: any
}

export function OccasionSelection({ bookingData, updateBookingData, creator }: OccasionSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What's the occasion?
        </h2>
        <p className="text-gray-600">
          Help {creator.name} create the perfect message
        </p>
      </div>

      {/* Popular Occasions */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Popular Occasions
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {occasions.filter(o => o.popular).map((occasion) => (
            <button
              key={occasion.id}
              onClick={() => updateBookingData({ occasion: occasion.id })}
              className={cn(
                "p-4 rounded-lg border-2 transition-all hover:shadow-md",
                bookingData.occasion === occasion.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <div className="text-3xl mb-2">{occasion.icon}</div>
              <div className="text-sm font-medium">{occasion.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* All Occasions */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          All Occasions
        </Label>
        <RadioGroup
          value={bookingData.occasion}
          onValueChange={(value) => updateBookingData({ occasion: value })}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {occasions.map((occasion) => (
              <div key={occasion.id}>
                <RadioGroupItem
                  value={occasion.id}
                  id={occasion.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={occasion.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                    "peer-checked:border-purple-600 peer-checked:bg-purple-50",
                    bookingData.occasion === occasion.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  <span className="text-2xl">{occasion.icon}</span>
                  <span className="font-medium">{occasion.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Custom Occasion */}
      {bookingData.occasion === "other" && (
        <div className="mt-4">
          <Label htmlFor="customOccasion" className="mb-2 block">
            Describe the occasion
          </Label>
          <Input
            id="customOccasion"
            placeholder="Enter the occasion..."
            value={bookingData.customOccasion || ""}
            onChange={(e) => updateBookingData({ customOccasion: e.target.value })}
            className="py-3 px-4"
          />
        </div>
      )}

      {/* Recipient Name */}
      <div>
        <Label htmlFor="recipient" className="mb-2 block">
          Who is this video for?
        </Label>
        <Input
          id="recipient"
          placeholder="Enter recipient's name..."
          value={bookingData.recipient}
          onChange={(e) => updateBookingData({ recipient: e.target.value })}
          className="py-3 px-4"
        />
        <p className="text-xs text-gray-500 mt-1">
          This is how {creator.name} will address them in the video
        </p>
      </div>
    </div>
  )
}