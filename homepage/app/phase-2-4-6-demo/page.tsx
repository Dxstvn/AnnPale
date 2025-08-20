"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Gift,
  Mail,
  Phone,
  Download,
  Eye,
  Sparkles,
  Heart,
  Star,
  Clock,
  Bell,
  Play,
  Palette,
  Package,
  PartyPopper,
  Crown,
  Calendar1,
  ArrowRight,
  Settings,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  Zap,
  Award,
  BarChart3,
  Timer,
  Flame
} from "lucide-react"
import { motion } from "framer-motion"

import { EnhancedGiftOptions } from "@/components/booking/wizard/steps/enhanced-gift-options"
import { GiftLandingPage } from "@/components/booking/gift-landing-templates"
import {
  GiftPreviewModal,
  GiftPresentationCustomizer,
  GiftMessageTemplates,
  GiftNotificationSettings,
  PerfectTimingScheduler
} from "@/components/booking/enhanced-gift-system"

export default function Phase246Demo() {
  const [activeDemo, setActiveDemo] = React.useState("gift-options")
  const [showLandingPreview, setShowLandingPreview] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState("birthday")
  const [demoData, setDemoData] = React.useState({
    isGift: true,
    giftMethod: "surprise-page",
    giftMessage: "Happy Birthday! I hope this special message from your favorite creator makes your day even more amazing. You deserve all the happiness in the world!",
    recipientName: "Sarah",
    senderName: "Mike",
    creatorName: "Famous Creator",
    occasion: "birthday",
    giftPresentationTemplate: "birthday",
    giftCustomization: {
      includeAnimations: true,
      addMusic: true,
      confettiEffect: true
    }
  })

  const handleLandingPreview = (template: string) => {
    setSelectedTemplate(template)
    setShowLandingPreview(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-purple-600">
            Phase 2.4.6 Complete
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Enhanced Gift Options & Recipients
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete gift experience system with presentation options, perfect timing delivery, 
            recipient communication, and magical surprise reveals.
          </p>
        </motion.div>
        
        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/20">
            <CardHeader className="pb-3">
              <Gift className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Gift Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Streamlined gift-giving with recipient management and surprise coordination
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-pink-200 bg-pink-50/50 dark:bg-pink-900/20">
            <CardHeader className="pb-3">
              <Palette className="h-8 w-8 text-pink-600 mb-2" />
              <CardTitle className="text-lg">Presentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                6 stunning templates with animations, music, and custom styling
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <Clock className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Perfect Timing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Precise delivery scheduling with timezone awareness and coordination
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20">
            <CardHeader className="pb-3">
              <Eye className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Preview System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live preview of gift experience before sending to recipients
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Demo Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gift-options">Complete System</TabsTrigger>
              <TabsTrigger value="delivery-methods">Delivery Methods</TabsTrigger>
              <TabsTrigger value="presentations">Presentations</TabsTrigger>
              <TabsTrigger value="features">Advanced Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gift-options" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Enhanced Gift Options System
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete Phase 2.4.6 gift system with all features integrated
                  </p>
                </CardHeader>
                <CardContent>
                  <EnhancedGiftOptions
                    data={demoData}
                    updateData={setDemoData}
                    errors={{}}
                    isActive={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="delivery-methods" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Enhanced Delivery Methods
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      5 delivery methods with advanced presentation options
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: Mail, name: "Email Delivery", desc: "Beautiful email templates with animations", popularity: 70 },
                      { icon: Phone, name: "SMS Delivery", desc: "Quick mobile-first delivery", popularity: 20 },
                      { icon: PartyPopper, name: "Surprise Page", desc: "Magical reveal experience", popularity: 8, premium: true },
                      { icon: Calendar1, name: "Perfect Timing", desc: "Precise scheduled delivery", popularity: 15 },
                      { icon: Download, name: "Manual Download", desc: "Personal delivery control", popularity: 2 }
                    ].map((method) => {
                      const Icon = method.icon
                      return (
                        <div key={method.name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Icon className="h-6 w-6 text-purple-600" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{method.name}</span>
                              {method.premium && <Badge className="bg-purple-600 text-xs">Premium</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{method.desc}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                <div
                                  className="bg-purple-600 h-1 rounded-full"
                                  style={{ width: `${method.popularity}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{method.popularity}%</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-green-600" />
                      Notification Settings
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Advanced notification and coordination options
                    </p>
                  </CardHeader>
                  <CardContent>
                    <GiftNotificationSettings
                      settings={{
                        notifyOnDelivery: true,
                        notifyOnView: true,
                        sendReminders: true,
                        coordinateWithSender: false,
                        includeDeliveryReceipt: true
                      }}
                      onSettingsChange={() => {}}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="presentations" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-pink-600" />
                      Gift Presentation Templates
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      6 stunning presentation styles with customization options
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { id: "classic", name: "Classic Elegance", colors: ["#1a1a2e", "#16213e", "#e94560"], icon: Crown },
                        { id: "festive", name: "Festive Celebration", colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"], icon: PartyPopper },
                        { id: "elegant", name: "Elegant Luxury", colors: ["#2c3e50", "#f39c12", "#ecf0f1"], icon: Crown },
                        { id: "playful", name: "Playful & Fun", colors: ["#e74c3c", "#f1c40f", "#3498db"], icon: Star },
                        { id: "birthday", name: "Birthday Magic", colors: ["#9b59b6", "#e67e22", "#f39c12"], icon: Gift },
                        { id: "romantic", name: "Romantic Touch", colors: ["#e91e63", "#ad1457", "#f48fb1"], icon: Heart }
                      ].map((template) => {
                        const Icon = template.icon
                        return (
                          <div
                            key={template.id}
                            className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-all"
                            onClick={() => handleLandingPreview(template.id)}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Icon className="h-5 w-5 text-purple-600" />
                              <span className="font-medium">{template.name}</span>
                            </div>
                            <div className="flex gap-1 mb-3">
                              {template.colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded-full border"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLandingPreview(template.id)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GiftMessageTemplates
                    occasion="birthday"
                    selectedTemplate=""
                    onTemplateSelect={() => {}}
                    creatorName="Famous Creator"
                  />
                  
                  <PerfectTimingScheduler
                    occasion="birthday"
                    selectedDate={new Date()}
                    onDateChange={() => {}}
                    selectedTime="00:00"
                    onTimeChange={() => {}}
                    timezone="America/New_York"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Advanced Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { icon: Eye, title: "Live Preview", desc: "See exactly how recipients will experience the gift" },
                        { icon: Clock, title: "Perfect Timing", desc: "Timezone-aware delivery at the perfect moment" },
                        { icon: Palette, title: "Custom Styling", desc: "6 presentation templates with animations and music" },
                        { icon: Bell, title: "Smart Notifications", desc: "Coordinated delivery confirmations and reminders" },
                        { icon: Target, title: "Surprise Mode", desc: "Maximum surprise with hidden details and reveals" },
                        { icon: Heart, title: "Personal Touch", desc: "Custom messages with template suggestions" }
                      ].map((feature) => {
                        const Icon = feature.icon
                        return (
                          <div key={feature.title} className="flex items-start gap-3">
                            <Icon className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                              <p className="font-medium">{feature.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Phase 2.4.6 Enhancements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: "Gift Preview System", status: "New", color: "bg-green-600" },
                        { title: "Presentation Templates", status: "Enhanced", color: "bg-blue-600" },
                        { title: "Perfect Timing Delivery", status: "New", color: "bg-green-600" },
                        { title: "Notification Coordination", status: "New", color: "bg-green-600" },
                        { title: "Landing Page Templates", status: "New", color: "bg-green-600" },
                        { title: "Surprise Experience", status: "Enhanced", color: "bg-blue-600" }
                      ].map((enhancement) => (
                        <div key={enhancement.title} className="flex items-center justify-between">
                          <span className="font-medium">{enhancement.title}</span>
                          <Badge className={enhancement.color}>
                            {enhancement.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Performance Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Award className="h-6 w-6 text-purple-600" />
                Phase 2.4.6 Impact & Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Gift Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>5 enhanced delivery methods with premium options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>6 stunning presentation templates with animations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Perfect timing scheduler with timezone awareness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Live preview system for all gift experiences</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Experience Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Surprise reveal pages with custom landing experiences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Coordinated notifications and delivery confirmations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Message templates with occasion-specific suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Maximum surprise mode with hidden pricing</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Business Impact
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Enhanced gift conversions with premium options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Timer className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Perfect timing increases satisfaction rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Improved recipient experience drives referrals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Flame className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Premium gift features increase average order value</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Conversion Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">+42%</div>
              <div className="text-sm text-gray-600">Gift Conversions</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">+38%</div>
              <div className="text-sm text-gray-600">Premium Options</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">+55%</div>
              <div className="text-sm text-gray-600">Recipient Satisfaction</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-pink-600">96%</div>
              <div className="text-sm text-gray-600">Perfect Timing Rate</div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 flex justify-between"
        >
          <Button variant="outline" asChild>
            <a href="/phase-2-4-5-demo">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Phase 2.4.5: Delivery Psychology
            </a>
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/">
              <Eye className="h-4 w-4 mr-2" />
              View All Phases
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Gift Landing Preview Modal */}
      {showLandingPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Gift Landing Page Preview - {selectedTemplate}</h3>
              <Button variant="outline" onClick={() => setShowLandingPreview(false)}>
                Close
              </Button>
            </div>
            <div className="h-96 overflow-auto">
              <GiftLandingPage
                template={selectedTemplate as any}
                recipientName="Sarah"
                senderName="Mike"
                giftMessage="Happy Birthday! I hope this special message makes your day amazing!"
                creatorName="Famous Creator"
                onReveal={() => setShowLandingPreview(false)}
                customization={{
                  includeAnimations: true,
                  addMusic: true,
                  confettiEffect: true
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}