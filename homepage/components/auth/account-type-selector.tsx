"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Users, Video, Check, Star, DollarSign, Heart, Globe, Calendar } from "lucide-react"

interface AccountTypeSelectorProps {
  selected: "customer" | "creator" | null
  onSelect: (type: "customer" | "creator") => void
  className?: string
}

export function AccountTypeSelector({ selected, onSelect, className }: AccountTypeSelectorProps) {
  return (
    <div className={cn("grid md:grid-cols-2 gap-6", className)}>
      {/* Customer Card */}
      <Card
        className={cn(
          "relative cursor-pointer transition-all duration-200 p-6",
          "hover:shadow-lg hover:scale-[1.02]",
          selected === "customer" && "ring-2 ring-purple-600 bg-purple-50"
        )}
        onClick={() => onSelect("customer")}
      >
        {selected === "customer" && (
          <div className="absolute top-4 right-4">
            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Join as a Fan</h3>
              <p className="text-sm text-gray-600">Request personalized videos</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Get personalized video messages from your favorite Haitian celebrities and creators.
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Browse hundreds of creators</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Request custom video messages</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>Support Haitian culture</span>
            </li>
          </ul>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Perfect for:</p>
            <p className="text-sm font-medium">Fans • Gift Givers • Diaspora</p>
          </div>
        </div>
      </Card>

      {/* Creator Card */}
      <Card
        className={cn(
          "relative cursor-pointer transition-all duration-200 p-6",
          "hover:shadow-lg hover:scale-[1.02]",
          selected === "creator" && "ring-2 ring-purple-600 bg-purple-50"
        )}
        onClick={() => onSelect("creator")}
      >
        {selected === "creator" && (
          <div className="absolute top-4 right-4">
            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Become a Creator</h3>
              <p className="text-sm text-gray-600">Earn money from your fans</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Share your talent and connect with fans through personalized video messages.
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>Set your own prices</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Work on your schedule</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-purple-500" />
              <span>Reach global Haitian diaspora</span>
            </li>
          </ul>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Perfect for:</p>
            <p className="text-sm font-medium">Artists • Musicians • Influencers</p>
          </div>
        </div>
      </Card>
    </div>
  )
}