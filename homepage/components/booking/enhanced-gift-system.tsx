"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Gift,
  Mail,
  Phone,
  Download,
  Calendar as CalendarIcon,
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
  Calendar1
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Enhanced gift delivery methods with Phase 2.4.6 features
export const enhancedGiftDeliveryMethods = [
  {
    id: "email",
    label: "Email Delivery",
    icon: Mail,
    description: "Instant delivery with beautiful email presentation",
    requiresField: "email",
    popularity: 70,
    recommended: true,
    features: [
      "Gift-wrapped email template",
      "Animated reveal experience",
      "Personal message integration",
      "Mobile-optimized design"
    ],
    preview: true,
    presentationOptions: ["classic", "festive", "elegant", "playful"]
  },
  {
    id: "sms",
    label: "SMS Delivery",
    icon: Phone,
    description: "Quick text with link - perfect for mobile users",
    requiresField: "phone",
    popularity: 20,
    features: [
      "Teaser text message",
      "Direct video link",
      "Follow-up notifications",
      "International delivery"
    ],
    preview: true,
    presentationOptions: ["simple", "emoji-rich"]
  },
  {
    id: "surprise-page",
    label: "Surprise Reveal Page",
    icon: Sparkles,
    description: "Create a magical surprise reveal experience",
    requiresField: "none",
    premium: true,
    popularity: 8,
    wow_factor: true,
    features: [
      "Custom landing page",
      "Animated countdown",
      "Interactive reveal",
      "Shareable experience"
    ],
    preview: true,
    presentationOptions: ["birthday", "celebration", "romantic", "achievement"]
  },
  {
    id: "scheduled-delivery",
    label: "Perfect Timing Delivery",
    icon: Calendar1,
    description: "Deliver at the exact perfect moment",
    requiresField: "none",
    popularity: 15,
    features: [
      "Exact time delivery",
      "Timezone awareness",
      "Reminder notifications",
      "Backup delivery options"
    ],
    preview: true,
    presentationOptions: ["midnight", "morning", "afternoon", "custom"]
  },
  {
    id: "download",
    label: "Manual Download",
    icon: Download,
    description: "Download yourself and deliver personally",
    requiresField: "none",
    popularity: 2,
    features: [
      "High-quality download",
      "Multiple formats",
      "Delivery instructions",
      "Gift presentation guide"
    ],
    preview: false,
    presentationOptions: ["standard"]
  }
]

// Gift presentation templates
export const giftPresentationTemplates = {
  classic: {
    name: "Classic Elegance",
    description: "Timeless and sophisticated presentation",
    colors: ["#1a1a2e", "#16213e", "#e94560"],
    preview: "Clean typography with elegant spacing"
  },
  festive: {
    name: "Festive Celebration",
    description: "Colorful and joyful for special occasions",
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
    preview: "Bright colors with celebration elements"
  },
  elegant: {
    name: "Elegant Luxury",
    description: "Premium feel with gold accents",
    colors: ["#2c3e50", "#f39c12", "#ecf0f1"],
    preview: "Luxury design with premium typography"
  },
  playful: {
    name: "Playful & Fun",
    description: "Bright and cheerful for younger recipients",
    colors: ["#e74c3c", "#f1c40f", "#3498db"],
    preview: "Fun animations with vibrant colors"
  },
  birthday: {
    name: "Birthday Magic",
    description: "Special birthday-themed presentation",
    colors: ["#9b59b6", "#e67e22", "#f39c12"],
    preview: "Birthday animations with confetti"
  },
  romantic: {
    name: "Romantic Touch",
    description: "Perfect for love and romantic occasions",
    colors: ["#e91e63", "#ad1457", "#f48fb1"],
    preview: "Heart animations with soft colors"
  }
}

// Gift message templates
export const giftMessageTemplates = [
  {
    id: "birthday",
    name: "Birthday Surprise",
    template: "Happy Birthday! 🎉 I hope this special message from {creatorName} makes your day even more amazing. You deserve all the happiness in the world!",
    occasions: ["birthday", "celebration"]
  },
  {
    id: "congratulations",
    name: "Achievement Celebration",
    template: "Congratulations on your amazing achievement! 🎊 I'm so proud of you and wanted to celebrate with this special message from {creatorName}.",
    occasions: ["graduation", "achievement", "promotion"]
  },
  {
    id: "support",
    name: "Encouragement & Support",
    template: "I wanted to send you some love and encouragement through this message from {creatorName}. You've got this! 💪",
    occasions: ["general", "support", "motivation"]
  },
  {
    id: "love",
    name: "Love & Appreciation",
    template: "You mean the world to me, and I wanted to show you how special you are with this personalized message from {creatorName}. ❤️",
    occasions: ["anniversary", "valentine", "love"]
  },
  {
    id: "surprise",
    name: "Just Because",
    template: "No special reason needed - you're amazing and deserve this surprise! Enjoy this special message from {creatorName}! ✨",
    occasions: ["general", "surprise", "friendship"]
  }
]

// Gift notification settings
interface GiftNotificationSettings {
  notifyOnDelivery: boolean
  notifyOnView: boolean
  sendReminders: boolean
  coordinateWithSender: boolean
  includeDeliveryReceipt: boolean
}

// Enhanced gift preview modal
export function GiftPreviewModal({
  isOpen,
  onClose,
  giftData,
  creatorData
}: {
  isOpen: boolean
  onClose: () => void
  giftData: any
  creatorData: any
}) {
  const [previewType, setPreviewType] = React.useState("recipient")

  const renderPreview = () => {
    switch (giftData.deliveryMethod) {
      case "email":
        return (
          <div className="bg-white rounded-lg border shadow-lg p-6 max-w-md mx-auto">
            <div className="text-center mb-4">
              <Gift className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <h3 className="text-xl font-bold text-gray-800">You've Received a Gift!</h3>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">From: {giftData.senderName}</p>
              {giftData.giftMessage && (
                <p className="italic text-gray-700">"{giftData.giftMessage}"</p>
              )}
            </div>
            
            <div className="text-center">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                <Play className="h-4 w-4 mr-2" />
                Watch Your Video Message
              </Button>
            </div>
          </div>
        )
      
      case "surprise-page":
        return (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="h-16 w-16 mx-auto text-purple-600 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Surprise! 🎉</h2>
            <p className="text-gray-600 mb-6">Someone special has sent you a personalized video message!</p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="h-5 w-5 mr-2" />
              Reveal Your Surprise
            </Button>
          </div>
        )
      
      default:
        return (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Preview not available for this delivery method</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Gift Preview
          </DialogTitle>
          <DialogDescription>
            See how your gift will appear to the recipient
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={previewType} onValueChange={setPreviewType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recipient">Recipient View</TabsTrigger>
            <TabsTrigger value="sender">Sender Receipt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipient" className="mt-6">
            {renderPreview()}
          </TabsContent>
          
          <TabsContent value="sender" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Gift Delivery Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-medium">{giftData.recipientEmail || giftData.recipientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Method:</span>
                  <span className="font-medium capitalize">{giftData.deliveryMethod?.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">{format(new Date(), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Ready to Send</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Gift presentation customizer
export function GiftPresentationCustomizer({
  selectedMethod,
  selectedTemplate,
  onTemplateChange,
  customization,
  onCustomizationChange
}: {
  selectedMethod: string
  selectedTemplate: string
  onTemplateChange: (template: string) => void
  customization: any
  onCustomizationChange: (customization: any) => void
}) {
  if (!selectedMethod || selectedMethod === "download") {
    return null
  }

  const availableTemplates = enhancedGiftDeliveryMethods
    .find(m => m.id === selectedMethod)?.presentationOptions || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          Presentation Style
          <Badge variant="secondary" className="text-xs">
            Make it Special
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Selection */}
        <div className="space-y-3">
          <Label>Choose Presentation Style</Label>
          <div className="grid grid-cols-2 gap-3">
            {availableTemplates.map((templateId) => {
              const template = giftPresentationTemplates[templateId as keyof typeof giftPresentationTemplates]
              if (!template) return null
              
              return (
                <div
                  key={templateId}
                  className={cn(
                    "p-3 border-2 rounded-lg cursor-pointer transition-all",
                    selectedTemplate === templateId
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 hover:border-purple-300"
                  )}
                  onClick={() => onTemplateChange(templateId)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.colors[0] }}
                    />
                    <span className="font-medium text-sm">{template.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{template.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-3">
          <Label>Customization Options</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-animations" className="text-sm">
                Include Animations
              </Label>
              <Switch
                id="include-animations"
                checked={customization.includeAnimations !== false}
                onCheckedChange={(checked) => 
                  onCustomizationChange({...customization, includeAnimations: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="add-music" className="text-sm">
                Background Music
              </Label>
              <Switch
                id="add-music"
                checked={customization.addMusic || false}
                onCheckedChange={(checked) => 
                  onCustomizationChange({...customization, addMusic: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="confetti-effect" className="text-sm">
                Confetti Effect
              </Label>
              <Switch
                id="confetti-effect"
                checked={customization.confettiEffect !== false}
                onCheckedChange={(checked) => 
                  onCustomizationChange({...customization, confettiEffect: checked})
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Gift message templates selector
export function GiftMessageTemplates({
  occasion,
  selectedTemplate,
  onTemplateSelect,
  creatorName
}: {
  occasion?: string
  selectedTemplate?: string
  onTemplateSelect: (template: string) => void
  creatorName: string
}) {
  const relevantTemplates = giftMessageTemplates.filter(template => 
    !occasion || template.occasions.includes(occasion) || template.occasions.includes("general")
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          Gift Message Templates
          <Badge variant="secondary" className="text-xs">
            Quick Start
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3">
          {relevantTemplates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-all",
                selectedTemplate === template.id
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 hover:border-purple-300"
              )}
              onClick={() => onTemplateSelect(template.template)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{template.name}</span>
                {selectedTemplate === template.id && (
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 italic">
                {template.template.replace("{creatorName}", creatorName)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Gift notification settings
export function GiftNotificationSettings({
  settings,
  onSettingsChange
}: {
  settings: GiftNotificationSettings
  onSettingsChange: (settings: GiftNotificationSettings) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-600" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-delivery" className="text-sm">
              Notify me when delivered
            </Label>
            <Switch
              id="notify-delivery"
              checked={settings.notifyOnDelivery}
              onCheckedChange={(checked) => 
                onSettingsChange({...settings, notifyOnDelivery: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-view" className="text-sm">
              Notify me when viewed
            </Label>
            <Switch
              id="notify-view"
              checked={settings.notifyOnView}
              onCheckedChange={(checked) => 
                onSettingsChange({...settings, notifyOnView: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="send-reminders" className="text-sm">
              Send delivery reminders
            </Label>
            <Switch
              id="send-reminders"
              checked={settings.sendReminders}
              onCheckedChange={(checked) => 
                onSettingsChange({...settings, sendReminders: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="coordinate-sender" className="text-sm">
              Coordinate with recipient
            </Label>
            <Switch
              id="coordinate-sender"
              checked={settings.coordinateWithSender}
              onCheckedChange={(checked) => 
                onSettingsChange({...settings, coordinateWithSender: checked})
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="delivery-receipt" className="text-sm">
              Include delivery receipt
            </Label>
            <Switch
              id="delivery-receipt"
              checked={settings.includeDeliveryReceipt}
              onCheckedChange={(checked) => 
                onSettingsChange({...settings, includeDeliveryReceipt: checked})
              }
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Delivery confirmations help coordinate surprise timing</p>
          <p>• View notifications let you know when your gift was opened</p>
          <p>• Reminders ensure perfect delivery timing</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Perfect timing scheduler
export function PerfectTimingScheduler({
  occasion,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  timezone
}: {
  occasion?: string
  selectedDate?: Date
  onDateChange: (date: Date | undefined) => void
  selectedTime?: string
  onTimeChange: (time: string) => void
  timezone: string
}) {
  const suggestedTimes = {
    birthday: ["00:00", "09:00", "12:00", "18:00"],
    anniversary: ["00:00", "19:00", "20:00"],
    graduation: ["09:00", "12:00", "15:00"],
    celebration: ["00:00", "10:00", "18:00"],
    default: ["00:00", "09:00", "12:00", "18:00", "20:00"]
  }

  const times = suggestedTimes[occasion as keyof typeof suggestedTimes] || suggestedTimes.default

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Perfect Timing
          <Badge variant="secondary" className="text-xs">
            Precision Delivery
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick the perfect date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                disabled={(date) =>
                  isBefore(date, startOfDay(new Date())) ||
                  isAfter(date, addDays(new Date(), 365))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label>Delivery Time ({timezone})</Label>
          <RadioGroup value={selectedTime} onValueChange={onTimeChange}>
            {times.map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <RadioGroupItem value={time} id={`time-${time}`} />
                <Label htmlFor={`time-${time}`} className="flex items-center gap-2">
                  <span>{time === "00:00" ? "Midnight" : format(new Date(`2000-01-01T${time}`), "h:mm a")}</span>
                  {time === "00:00" && (
                    <Badge variant="secondary" className="text-xs">Perfect for birthdays</Badge>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Timezone Info */}
        <div className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
          <Info className="h-3 w-3 inline mr-1" />
          Times are automatically adjusted for the recipient's timezone based on their location.
        </div>
      </CardContent>
    </Card>
  )
}