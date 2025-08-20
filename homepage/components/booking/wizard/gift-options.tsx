"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Gift, Mail, MessageSquare, Sparkles } from "lucide-react"

interface GiftOptionsProps {
  bookingData: any
  updateBookingData: (data: any) => void
}

export function GiftOptions({ bookingData, updateBookingData }: GiftOptionsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Is this a gift?
        </h2>
        <p className="text-gray-600">
          Make it extra special with gift options
        </p>
      </div>

      {/* Gift Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Gift className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <Label htmlFor="gift-mode" className="text-base font-medium cursor-pointer">
                Send as a gift
              </Label>
              <p className="text-sm text-gray-500">
                We'll help you surprise them!
              </p>
            </div>
          </div>
          <Switch
            id="gift-mode"
            checked={bookingData.isGift}
            onCheckedChange={(checked) => updateBookingData({ isGift: checked })}
          />
        </div>
      </Card>

      {/* Gift Options - Only show if gift mode is enabled */}
      {bookingData.isGift && (
        <>
          {/* Gift From */}
          <div>
            <Label htmlFor="giftFrom" className="mb-2 block">
              Gift from
            </Label>
            <Input
              id="giftFrom"
              placeholder="Your name or 'Your friends at work'"
              value={bookingData.giftFrom || ""}
              onChange={(e) => updateBookingData({ giftFrom: e.target.value })}
              className="py-3 px-4"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be included in the video message
            </p>
          </div>

          {/* Gift Message */}
          <div>
            <Label htmlFor="giftMessage" className="mb-2 block">
              Gift message (optional)
            </Label>
            <Textarea
              id="giftMessage"
              placeholder="Add a personal note to accompany the video gift..."
              value={bookingData.giftMessage || ""}
              onChange={(e) => updateBookingData({ giftMessage: e.target.value })}
              className="min-h-[100px] py-3 px-4 resize-none"
            />
          </div>

          {/* Gift Delivery Options */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Gift delivery options
            </Label>
            <div className="space-y-3">
              <Card className="p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="giftDelivery"
                    value="email"
                    checked={bookingData.giftDeliveryMethod === "email"}
                    onChange={() => updateBookingData({ giftDeliveryMethod: "email" })}
                    className="text-purple-600"
                  />
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">Send via email</p>
                    <p className="text-sm text-gray-500">
                      We'll send a beautiful gift email with the video
                    </p>
                  </div>
                </label>
              </Card>

              <Card className="p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="giftDelivery"
                    value="link"
                    checked={bookingData.giftDeliveryMethod === "link"}
                    onChange={() => updateBookingData({ giftDeliveryMethod: "link" })}
                    className="text-purple-600"
                  />
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">Get a gift link</p>
                    <p className="text-sm text-gray-500">
                      Share the link yourself via text, social media, etc.
                    </p>
                  </div>
                </label>
              </Card>
            </div>
          </div>

          {/* Recipient Email (if email delivery selected) */}
          {bookingData.giftDeliveryMethod === "email" && (
            <div>
              <Label htmlFor="recipientEmail" className="mb-2 block">
                Recipient's email
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="their-email@example.com"
                value={bookingData.recipientEmail || ""}
                onChange={(e) => updateBookingData({ recipientEmail: e.target.value })}
                className="py-3 px-4"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send the video gift to this email address
              </p>
            </div>
          )}
        </>
      )}

      {/* Gift Features */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Gift features included
        </h4>
        <ul className="space-y-2 text-sm text-purple-700">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Beautiful gift wrapping animation
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Personalized gift card with your message
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Surprise reveal experience
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Download link for keepsake
          </li>
        </ul>
      </Card>
    </div>
  )
}