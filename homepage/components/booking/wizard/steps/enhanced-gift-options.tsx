"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Gift,
  Mail,
  Phone,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Star,
  Clock,
  Bell,
  Share2,
  Zap,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Palette,
  Wand2,
  Package,
  PartyPopper,
  Layout,
  Send,
  Crown,
  Target,
  Users,
  Calendar1,
  ArrowRight,
  Settings,
  Smartphone,
  Globe,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { StepComponentProps } from "../multi-step-wizard"

import {
  enhancedGiftDeliveryMethods,
  GiftPreviewModal,
  GiftPresentationCustomizer,
  GiftMessageTemplates,
  GiftNotificationSettings,
  PerfectTimingScheduler
} from "../../enhanced-gift-system"

export function EnhancedGiftOptions({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  // State management
  const [isGift, setIsGift] = React.useState(data.isGift || false)
  const [selectedMethod, setSelectedMethod] = React.useState(data.giftMethod || "email")
  const [selectedTemplate, setSelectedTemplate] = React.useState(data.giftPresentationTemplate || "classic")
  const [showPreview, setShowPreview] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("delivery")
  
  // Gift-specific state
  const [giftCustomization, setGiftCustomization] = React.useState({
    includeAnimations: data.giftAnimations !== false,
    addMusic: data.giftMusic || false,
    confettiEffect: data.giftConfetti !== false,
    ...data.giftCustomization
  })
  
  const [notificationSettings, setNotificationSettings] = React.useState({
    notifyOnDelivery: data.notifyOnDelivery !== false,
    notifyOnView: data.notifyOnView || false,
    sendReminders: data.sendReminders !== false,
    coordinateWithSender: data.coordinateWithSender || false,
    includeDeliveryReceipt: data.includeDeliveryReceipt !== false,
    ...data.giftNotifications
  })
  
  const [perfectTiming, setPerfectTiming] = React.useState({
    scheduledDate: data.giftScheduledDate ? new Date(data.giftScheduledDate) : undefined,
    scheduledTime: data.giftScheduledTime || "00:00",
    timezone: data.recipientTimezone || "America/New_York"
  })

  // Creator and occasion data
  const creatorName = data.creatorName || "your favorite creator"
  const occasion = data.occasion || "celebration"
  
  // Handle gift toggle
  const handleGiftToggle = (checked: boolean) => {
    setIsGift(checked)
    updateData({
      isGift: checked,
      giftMethod: checked ? selectedMethod : null,
      giftPresentationTemplate: checked ? selectedTemplate : null,
      giftCustomization: checked ? giftCustomization : null,
      giftNotifications: checked ? notificationSettings : null
    })
    
    if (checked) {
      toast.success("🎁 Gift mode activated! Let's make this special.")
      setActiveTab("delivery")
    } else {
      toast.info("Gift mode disabled")
    }
  }

  // Handle delivery method change
  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId)
    updateData({ 
      giftMethod: methodId,
      giftPresentationTemplate: selectedTemplate
    })
    
    const method = enhancedGiftDeliveryMethods.find(m => m.id === methodId)
    if (method?.premium) {
      toast.success(`✨ ${method.label} selected - Premium gift experience!`)
    }
  }

  // Handle template change
  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    updateData({ giftPresentationTemplate: template })
  }

  // Handle customization change
  const handleCustomizationChange = (customization: any) => {
    setGiftCustomization(customization)
    updateData({ giftCustomization: customization })
  }

  // Handle notification settings change
  const handleNotificationChange = (settings: any) => {
    setNotificationSettings(settings)
    updateData({ giftNotifications: settings })
  }

  // Handle message template selection
  const handleMessageTemplateSelect = (template: string) => {
    updateData({ giftMessage: template })
  }

  // Handle recipient info change
  const handleRecipientInfoChange = (field: string, value: string) => {
    updateData({
      [`recipient${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
    })
  }

  // Handle perfect timing change
  const handleTimingChange = (field: string, value: any) => {
    const newTiming = { ...perfectTiming, [field]: value }
    setPerfectTiming(newTiming)
    updateData({
      [`gift${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
    })
  }

  // Get selected method data
  const selectedMethodData = enhancedGiftDeliveryMethods.find(m => m.id === selectedMethod)

  if (!isActive) return null

  return (
    <div className="space-y-6">
      {/* Gift Toggle Section */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-purple-600" />
            Make This a Special Gift
            <Badge className="bg-purple-600">
              Phase 2.4.6
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transform your order into a magical gift experience with custom presentation, perfect timing, and surprise elements.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Switch
              id="is-gift-toggle"
              checked={isGift}
              onCheckedChange={handleGiftToggle}
              className="data-[state=checked]:bg-purple-600"
            />
            <Label htmlFor="is-gift-toggle" className="text-base font-medium">
              Yes, this is a gift for someone special
            </Label>
            {isGift && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">Gift Mode Active</span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Gift Configuration */}
      {isGift && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="delivery" className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Delivery
              </TabsTrigger>
              <TabsTrigger value="presentation" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                Style
              </TabsTrigger>
              <TabsTrigger value="timing" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Timing
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Delivery Method Tab */}
            <TabsContent value="delivery" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enhancedGiftDeliveryMethods.map((method) => {
                  const Icon = method.icon
                  const isSelected = selectedMethod === method.id
                  
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={cn(
                          "relative cursor-pointer transition-all",
                          isSelected 
                            ? "ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                            : "hover:shadow-lg hover:border-purple-300"
                        )}
                        onClick={() => handleMethodChange(method.id)}
                      >
                        {/* Method Badges */}
                        <div className="absolute -top-2 -right-2 flex gap-2">
                          {method.recommended && (
                            <Badge className="bg-green-600">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                          {method.premium && (
                            <Badge className="bg-purple-600">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {method.wow_factor && (
                            <Badge className="bg-orange-600">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Wow Factor
                            </Badge>
                          )}
                        </div>

                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              isSelected ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                            )}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base flex items-center gap-2">
                                {method.label}
                                {isSelected && <CheckCircle className="h-4 w-4 text-purple-600" />}
                              </CardTitle>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          {/* Features */}
                          <div className="space-y-1">
                            {method.features.slice(0, 2).map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Popularity */}
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {method.popularity}% choose this method
                            </span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                              <div
                                className="bg-purple-600 h-1 rounded-full"
                                style={{ width: `${method.popularity}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Recipient Information */}
              {selectedMethodData?.requiresField && selectedMethodData.requiresField !== "none" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recipient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedMethodData.requiresField === "email" && (
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail">
                          Recipient's Email Address *
                        </Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          placeholder="their-email@example.com"
                          value={data.recipientEmail || ""}
                          onChange={(e) => handleRecipientInfoChange("email", e.target.value)}
                          className={cn(errors?.recipientEmail && "border-red-500")}
                        />
                        {errors?.recipientEmail && (
                          <p className="text-xs text-red-500">{errors.recipientEmail}</p>
                        )}
                      </div>
                    )}

                    {selectedMethodData.requiresField === "phone" && (
                      <div className="space-y-2">
                        <Label htmlFor="recipientPhone">
                          Recipient's Phone Number *
                        </Label>
                        <Input
                          id="recipientPhone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={data.recipientPhone || ""}
                          onChange={(e) => handleRecipientInfoChange("phone", e.target.value)}
                          className={cn(errors?.recipientPhone && "border-red-500")}
                        />
                        {errors?.recipientPhone && (
                          <p className="text-xs text-red-500">{errors.recipientPhone}</p>
                        )}
                      </div>
                    )}

                    {/* Recipient Name */}
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">
                        Recipient's Name
                        <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                      </Label>
                      <Input
                        id="recipientName"
                        placeholder="Their name for personalization"
                        value={data.recipientName || ""}
                        onChange={(e) => handleRecipientInfoChange("name", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gift Message */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-purple-600" />
                      Personal Gift Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Write a heartfelt message to accompany your gift..."
                      value={data.giftMessage || ""}
                      onChange={(e) => updateData({ giftMessage: e.target.value })}
                      rows={4}
                      maxLength={500}
                      className="resize-none"
                    />
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{(data.giftMessage || "").length}/500 characters</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("presentation")}
                      >
                        Choose Template
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Gift Message Templates */}
                <GiftMessageTemplates
                  occasion={occasion}
                  selectedTemplate={data.selectedMessageTemplate}
                  onTemplateSelect={handleMessageTemplateSelect}
                  creatorName={creatorName}
                />
              </div>
            </TabsContent>

            {/* Presentation Style Tab */}
            <TabsContent value="presentation" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <GiftPresentationCustomizer
                  selectedMethod={selectedMethod}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={handleTemplateChange}
                  customization={giftCustomization}
                  onCustomizationChange={handleCustomizationChange}
                />

                <GiftNotificationSettings
                  settings={notificationSettings}
                  onSettingsChange={handleNotificationChange}
                />
              </div>
            </TabsContent>

            {/* Perfect Timing Tab */}
            <TabsContent value="timing" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <PerfectTimingScheduler
                  occasion={occasion}
                  selectedDate={perfectTiming.scheduledDate}
                  onDateChange={(date) => handleTimingChange("scheduledDate", date)}
                  selectedTime={perfectTiming.scheduledTime}
                  onTimeChange={(time) => handleTimingChange("scheduledTime", time)}
                  timezone={perfectTiming.timezone}
                />

                {/* Additional Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-600" />
                      Additional Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="hide-price" className="text-sm">
                          Hide price from recipient
                        </Label>
                        <Switch
                          id="hide-price"
                          checked={data.hidePrice !== false}
                          onCheckedChange={(checked) => updateData({ hidePrice: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="surprise-mode" className="text-sm">
                          Maximum surprise mode
                        </Label>
                        <Switch
                          id="surprise-mode"
                          checked={data.surpriseMode || false}
                          onCheckedChange={(checked) => updateData({ surpriseMode: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="include-sender" className="text-sm">
                          Include sender name
                        </Label>
                        <Switch
                          id="include-sender"
                          checked={data.includeSenderName !== false}
                          onCheckedChange={(checked) => updateData({ includeSenderName: checked })}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Hide price keeps the gift value private</p>
                      <p>• Surprise mode maximizes the reveal experience</p>
                      <p>• Sender name helps recipient know who sent it</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    Gift Preview
                    <Badge variant="secondary" className="text-xs">
                      See What They'll Receive
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preview how your gift will appear to the recipient
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowPreview(true)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                      disabled={!selectedMethodData?.preview}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Preview Gift Experience
                    </Button>
                    
                    <Button variant="outline">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile Preview
                    </Button>
                  </div>

                  {!selectedMethodData?.preview && (
                    <div className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <Info className="h-4 w-4 inline mr-1" />
                      Preview not available for {selectedMethodData?.label}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gift Summary */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Gift Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Delivery Method:</span>
                      <p className="font-medium">{selectedMethodData?.label}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Presentation:</span>
                      <p className="font-medium capitalize">{selectedTemplate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Recipient:</span>
                      <p className="font-medium">
                        {data.recipientName || data.recipientEmail || data.recipientPhone || "To be specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Special Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {giftCustomization.includeAnimations && <Badge variant="secondary" className="text-xs">Animations</Badge>}
                        {giftCustomization.addMusic && <Badge variant="secondary" className="text-xs">Music</Badge>}
                        {giftCustomization.confettiEffect && <Badge variant="secondary" className="text-xs">Confetti</Badge>}
                        {data.hidePrice && <Badge variant="secondary" className="text-xs">Price Hidden</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* Gift Preview Modal */}
      <GiftPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        giftData={{
          deliveryMethod: selectedMethod,
          giftMessage: data.giftMessage,
          senderName: data.senderName || "A Special Someone",
          recipientEmail: data.recipientEmail,
          recipientPhone: data.recipientPhone,
          presentationTemplate: selectedTemplate,
          customization: giftCustomization
        }}
        creatorData={{
          name: creatorName
        }}
      />
    </div>
  )
}