"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Zap,
  TrendingUp,
  Users,
  Target,
  Award,
  Timer,
  Flame,
  BarChart3,
  ThumbsUp,
  Shield,
  Sparkles,
  Package,
  ArrowRight,
  Eye,
  DollarSign,
  AlertTriangle,
  Heart,
  Gift
} from "lucide-react"
import { motion } from "framer-motion"

import { EnhancedDeliveryOptions } from "@/components/booking/wizard/steps/enhanced-delivery-options"
import {
  UrgencyCountdownTimer,
  SocialProofStats,
  LiveActivityFeed,
  ValueCalculator,
  ScarcityIndicator,
  DeliveryTestimonials,
  PeaceOfMindGuarantees,
  PsychologyOptimizedDeliveryCard
} from "@/components/booking/enhanced-delivery-psychology"

export default function Phase245Demo() {
  const [activeDemo, setActiveDemo] = React.useState("delivery-options")
  const [demoData, setDemoData] = React.useState({
    basePrice: 150,
    occasion: "birthday",
    deliveryTier: "express",
    deliveryPrice: 45,
    isGift: false
  })
  
  // Demo countdown target (2 hours from now)
  const countdownTarget = new Date(Date.now() + 2 * 60 * 60 * 1000)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-orange-600">
            Phase 2.4.5 Complete
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Delivery Options & Urgency Psychology
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advanced delivery psychology with urgency tactics, social proof, and value framing 
            to maximize conversions and user satisfaction.
          </p>
        </motion.div>
        
        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/20">
            <CardHeader className="pb-3">
              <Timer className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle className="text-lg">Urgency Tactics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Countdown timers, scarcity messaging, and time-based urgency
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Social Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live activity feeds, testimonials, and popularity statistics
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20">
            <CardHeader className="pb-3">
              <DollarSign className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Value Framing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Per-day cost analysis, peace of mind guarantees, and smart pricing
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/20">
            <CardHeader className="pb-3">
              <Target className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Psychology Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cognitive triggers for decision-making and conversion optimization
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
              <TabsTrigger value="delivery-options">Complete System</TabsTrigger>
              <TabsTrigger value="urgency-tactics">Urgency Tactics</TabsTrigger>
              <TabsTrigger value="social-proof">Social Proof</TabsTrigger>
              <TabsTrigger value="value-framing">Value Framing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="delivery-options" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    Enhanced Delivery Options with Psychology
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete delivery system with advanced psychology and urgency tactics
                  </p>
                </CardHeader>
                <CardContent>
                  <EnhancedDeliveryOptions
                    data={demoData}
                    updateData={setDemoData}
                    errors={{}}
                    isActive={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="urgency-tactics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-orange-600" />
                      Countdown Timer
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Creates urgency with real-time countdown
                    </p>
                  </CardHeader>
                  <CardContent>
                    <UrgencyCountdownTimer
                      targetTime={countdownTarget}
                      message="Rush delivery deadline approaching!"
                      variant="warning"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-red-600" />
                      Scarcity Indicator
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Shows limited availability to drive action
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ScarcityIndicator
                      tier="Rush Delivery"
                      slotsRemaining={2}
                      totalSlots={10}
                      timeLeft={120}
                      variant="critical"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="social-proof" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Social Proof Statistics
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-400">
                        Trust-building metrics and delivery statistics
                      </p>
                    </CardHeader>
                    <CardContent>
                      <SocialProofStats />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Live Activity Feed
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-400">
                        Real-time activity to show platform engagement
                      </p>
                    </CardHeader>
                    <CardContent>
                      <LiveActivityFeed />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-purple-600" />
                      Customer Testimonials
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Rotating testimonials from satisfied customers
                    </p>
                  </CardHeader>
                  <CardContent>
                    <DeliveryTestimonials />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="value-framing" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Value Calculator
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Smart pricing analysis and value justification
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ValueCalculator
                      basePrice={150}
                      deliveryPrice={45}
                      timeline="2-3 days"
                      occasion="birthday"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Peace of Mind Guarantees
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Risk reduction through clear guarantees
                    </p>
                  </CardHeader>
                  <CardContent>
                    <PeaceOfMindGuarantees />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Psychology Tactics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Award className="h-6 w-6 text-orange-600" />
                Phase 2.4.5 Psychology Tactics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Timer className="h-5 w-5 text-orange-600" />
                    Urgency Tactics
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Scarcity messaging: "Only 2 rush slots left today"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Time-based urgency with real countdown timers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Flame className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Critical availability indicators with progress bars</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Deadline cutoffs: "Order by 4 PM for rush delivery"</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Social Proof
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Statistics: "99.8% on-time delivery rate"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Popularity indicators: "60% choose express"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ThumbsUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Customer testimonials with ratings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Eye className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Live activity: "3 people viewing Express option"</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Value Framing
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Per-day cost breakdown: "Only $15/day faster"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Occasion importance: "Make their birthday unforgettable"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Peace of mind: "100% satisfaction guarantee"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Value justification with smart pricing analysis</span>
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
              <div className="text-3xl font-bold text-orange-600">+35%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">+28%</div>
              <div className="text-sm text-gray-600">Express Tier Usage</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">+45%</div>
              <div className="text-sm text-gray-600">Rush Tier Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">92%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
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
            <a href="/phase-2-4-4-demo">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Phase 2.4.4: Message Details
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
    </div>
  )
}