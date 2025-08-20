"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, Sparkles, Heart, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const messageTemplates = [
  {
    id: "birthday",
    icon: <Sparkles className="h-4 w-4" />,
    title: "Birthday Wishes",
    template: "Happy Birthday [Name]! Hope your special day is filled with joy and laughter..."
  },
  {
    id: "motivation",
    icon: <Zap className="h-4 w-4" />,
    title: "Motivation",
    template: "Hey [Name]! Just wanted to send you some encouragement..."
  },
  {
    id: "congratulations",
    icon: <Star className="h-4 w-4" />,
    title: "Congratulations",
    template: "Congratulations [Name] on your amazing achievement..."
  },
  {
    id: "love",
    icon: <Heart className="h-4 w-4" />,
    title: "Love & Support",
    template: "Hi [Name], sending you love and positive vibes..."
  }
]

const pronunciationHelps = [
  { label: "Phonetic spelling", example: "John (pronounced 'zhahn')" },
  { label: "Rhymes with", example: "Sarah (rhymes with 'terra')" },
  { label: "Audio reference", example: "Like the city 'Paris'" }
]

interface MessageDetailsProps {
  bookingData: any
  updateBookingData: (data: any) => void
  creator: any
}

export function MessageDetails({ bookingData, updateBookingData, creator }: MessageDetailsProps) {
  const [charCount, setCharCount] = useState(bookingData.message?.length || 0)
  const maxChars = 500

  const handleMessageChange = (value: string) => {
    if (value.length <= maxChars) {
      updateBookingData({ message: value })
      setCharCount(value.length)
    }
  }

  const applyTemplate = (template: string) => {
    const personalizedTemplate = template.replace("[Name]", bookingData.recipient || "[Name]")
    handleMessageChange(personalizedTemplate)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What should {creator.name} say?
        </h2>
        <p className="text-gray-600">
          Share details to make this video special and personal
        </p>
      </div>

      {/* Message Templates */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Need inspiration? Try a template
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {messageTemplates.map((template) => (
            <Card
              key={template.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-purple-400"
              onClick={() => applyTemplate(template.template)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{template.template}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div>
        <Label htmlFor="message" className="mb-2 block">
          Your message to {creator.name}
        </Label>
        <Textarea
          id="message"
          placeholder={`Tell ${creator.name} what you'd like them to say. Include inside jokes, memories, or specific things to mention...`}
          value={bookingData.message}
          onChange={(e) => handleMessageChange(e.target.value)}
          className="min-h-[150px] py-3 px-4 resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Be specific! The more details, the better the video
          </p>
          <p className={cn(
            "text-xs",
            charCount > maxChars * 0.9 ? "text-orange-500" : "text-gray-500"
          )}>
            {charCount}/{maxChars}
          </p>
        </div>
      </div>

      {/* Pronunciation Help */}
      <div>
        <Label htmlFor="pronunciation" className="mb-2 block">
          Pronunciation help (optional)
        </Label>
        <Input
          id="pronunciation"
          placeholder="Help with pronouncing names (e.g., 'Marie' pronounced 'Mah-REE')"
          value={bookingData.pronunciation || ""}
          onChange={(e) => updateBookingData({ pronunciation: e.target.value })}
          className="py-3 px-4"
        />
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Pronunciation tips:</p>
              <ul className="space-y-1">
                {pronunciationHelps.map((help, index) => (
                  <li key={index}>
                    • {help.label}: {help.example}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <Label htmlFor="notes" className="mb-2 block">
          Additional notes (optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Any other information that would help make this video perfect..."
          value={bookingData.additionalNotes || ""}
          onChange={(e) => updateBookingData({ additionalNotes: e.target.value })}
          className="min-h-[100px] py-3 px-4 resize-none"
        />
      </div>

      {/* Tips Card */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Pro Tips for a Great Video
        </h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Mention specific memories or inside jokes</li>
          <li>• Include the recipient's hobbies or interests</li>
          <li>• Add personal touches that show you care</li>
          <li>• Keep it authentic and from the heart</li>
        </ul>
      </Card>
    </div>
  )
}