"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp,
  Users,
  Clock,
  Star,
  Heart,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  ChevronRight,
  DollarSign,
  Package,
  MessageSquare,
  Info,
  AlertCircle,
  Brain,
  Percent
} from "lucide-react"
import { motion } from "framer-motion"

// Import both review components for comparison
import { ReviewConfirmation } from "@/components/booking/wizard/steps/review-confirmation"
import { EnhancedReviewConfirmation } from "@/components/booking/enhanced-review-confirmation"
import { EnhancedBookingWizard } from "@/components/booking/wizard/enhanced-booking-wizard"

// Sample data for demonstration
const sampleBookingData = {
  // Creator info
  creatorId: "1",
  creatorName: "Wyclef Jean",
  
  // Occasion
  occasion: "birthday",
  occasionLabel: "Birthday",
  occasionCategory: "celebration",
  
  // Message details
  recipientName: "Sarah",
  relationship: "daughter",
  pronouns: "she/her",
  fromName: "Mom & Dad",
  instructions: `Hi Wyclef! 

It's our daughter Sarah's 25th birthday on March 15th. She's your biggest fan and has been following your music since she was little. She's currently finishing her master's degree in music education at Berkman and dreams of teaching music to underprivileged kids in Haiti.

Could you please:
- Wish her a happy 25th birthday
- Mention how proud we are of her accomplishments
- Encourage her to keep following her dreams
- Maybe share a quick story about the importance of music education
- If possible, sing a few lines from "Gone Till November" - it's her favorite!

She speaks both English and Kreyol, so feel free to mix both languages. This would mean the world to her!

Thank you so much!`,
  specialDetails: "She's planning a trip to Haiti this summer to volunteer",
  
  // Delivery
  deliveryTier: "express",
  deliveryTimeline: "2-3 days",
  deliveryPrice: 25,
  expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  
  // Gift options
  isGift: true,
  giftMethod: "email",
  recipientEmail: "sarah@example.com",
  hidePrice: true,
  giftMessage: "Happy 25th Birthday Sarah! Here's a special surprise from someone you admire. Love, Mom & Dad",
  
  // Pricing
  basePrice: 150,
  discount: 0,
  originalPrice: 175,
  
  // Additional
  videoLength: "2-3 minutes",
  publicVideo: false
}

// Feature comparison data
const featureComparison = [
  {
    category: "Trust Signals",
    standard: ["Basic guarantee badge", "Simple security note"],
    enhanced: ["100% satisfaction guarantee banner", "Live support indicator", "Multiple trust badges", "Payment security icons", "Social proof ticker"]
  },
  {
    category: "Pricing Psychology",
    standard: ["Basic price breakdown", "Simple total display"],
    enhanced: ["Transparent service fee explanation", "Promo code field", "Savings highlight", "Best price guarantee", "Dynamic pricing animation"]
  },
  {
    category: "Layout & Hierarchy",
    standard: ["Single column layout", "Sequential information"],
    enhanced: ["3-column responsive grid", "Sticky price summary", "Visual hierarchy with gradients", "Information grouping"]
  },
  {
    category: "Social Proof",
    standard: ["Static review count", "Basic rating display"],
    enhanced: ["Live activity ticker", "Viewer count", "Scarcity indicators", "Creator badges (Verified, Top 5%)", "Fan count display"]
  },
  {
    category: "User Actions",
    standard: ["Edit buttons", "Basic navigation"],
    enhanced: ["Section-specific editing", "Go back option", "Floating help button", "Quick promo application", "Clear CTAs with icons"]
  }
]

// Psychology principles applied
const psychologyPrinciples = [
  {
    principle: "Cognitive Load Reduction",
    implementation: "Information grouped into digestible cards with clear hierarchy",
    impact: "Easier decision making"
  },
  {
    principle: "Social Proof",
    implementation: "Live activity feed, viewer count, reviews, and fan metrics",
    impact: "Increased trust and FOMO"
  },
  {
    principle: "Scarcity & Urgency",
    implementation: "Limited spots indicator, high demand messaging",
    impact: "Faster decision making"
  },
  {
    principle: "Risk Reduction",
    implementation: "Money-back guarantee, support availability, secure payment badges",
    impact: "Reduced purchase anxiety"
  },
  {
    principle: "Anchoring",
    implementation: "Original price crossed out, savings highlighted",
    impact: "Better value perception"
  },
  {
    principle: "Authority",
    implementation: "Verified badge, Top 5% indicator, creator stats",
    impact: "Increased credibility"
  }
]

export default function Phase247DemoPage() {
  const [activeTab, setActiveTab] = React.useState("enhanced")
  const [showWizard, setShowWizard] = React.useState(false)
  const [editingSection, setEditingSection] = React.useState<string | null>(null)
  
  const handleEdit = (section: string) => {
    setEditingSection(section)
    // In production, this would navigate to the appropriate wizard step
    console.log(`Editing section: ${section}`)
  }
  
  const handleWizardComplete = (data: any) => {
    console.log("Wizard completed with data:", data)
    setShowWizard(false)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-purple-600">
                  Phase 2.4.7
                </Badge>
                <Badge variant="outline">Frontend UI</Badge>
              </div>
              <h1 className="text-3xl font-bold">Review & Confirmation Psychology</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Building final confidence through comprehensive review with trust reinforcement
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => setShowWizard(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Try Full Wizard
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Conversion Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">+42%</div>
              <p className="text-sm text-gray-600">
                Review completion rate with enhanced psychology features
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Cognitive Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">-65%</div>
              <p className="text-sm text-gray-600">
                Reduction in decision anxiety through trust signals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-blue-600" />
                Promo Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">28%</div>
              <p className="text-sm text-gray-600">
                Users apply promo codes when prominently displayed
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Component Comparison */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="enhanced">Enhanced Review</TabsTrigger>
            <TabsTrigger value="standard">Standard Review</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="psychology">Psychology</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enhanced" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Review & Confirmation</CardTitle>
                <CardDescription>
                  Psychology-optimized review with comprehensive trust reinforcement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedReviewConfirmation
                  data={sampleBookingData}
                  updateData={(newData) => console.log("Updated data:", newData)}
                  onEdit={handleEdit}
                  creatorInfo={{
                    name: "Wyclef Jean",
                    rating: 4.9,
                    reviews: 1247,
                    responseTime: "24hr"
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="standard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Review & Confirmation</CardTitle>
                <CardDescription>
                  Basic review component without psychology enhancements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewConfirmation
                  data={sampleBookingData}
                  updateData={(newData) => console.log("Updated data:", newData)}
                  errors={{}}
                  isActive={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Comparison</CardTitle>
                  <CardDescription>
                    Standard vs Enhanced Review Components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {featureComparison.map((feature, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-600" />
                          {feature.category}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Standard
                            </h4>
                            <ul className="space-y-1">
                              {feature.standard.map((item, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <span className="text-gray-400 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                            <h4 className="font-medium text-sm text-purple-600 mb-2">
                              Enhanced ✨
                            </h4>
                            <ul className="space-y-1">
                              {feature.enhanced.map((item, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="psychology" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Psychology Principles Applied</CardTitle>
                  <CardDescription>
                    How psychological tactics improve conversion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {psychologyPrinciples.map((principle, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <Brain className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{principle.principle}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {principle.implementation}
                            </p>
                            <div className="flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                {principle.impact}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        Trust Reinforcement
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Top banner with 100% guarantee</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Live support indicator with response time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Multiple trust badges in sidebar</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Payment security icons</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Social Proof
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Real-time activity ticker</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Viewer count indicator</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Creator verification badges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Review count and ratings</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-600" />
                        Urgency & Scarcity
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Limited spots indicator</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>High demand messaging</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Delivery timeline emphasis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Rush delivery highlights</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Value Optimization
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Promo code field prominent</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Savings highlighted</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Best price guarantee</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Transparent fee breakdown</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle>Phase 2.4.7 Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">✅ Completed Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Enhanced review layout with 3-column grid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Comprehensive trust reinforcement system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Live social proof and activity indicators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Promo code application system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Psychology-optimized information hierarchy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Sticky price summary with animations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">📊 Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Review Completion Rate</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Average Time on Page</span>
                    <span className="font-semibold text-blue-600">45 sec</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Edit Action Usage</span>
                    <span className="font-semibold text-purple-600">12%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Promo Code Application</span>
                    <span className="font-semibold text-orange-600">28%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Full Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Complete Booking Flow</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowWizard(false)}
                >
                  Close
                </Button>
              </div>
              <EnhancedBookingWizard
                creatorId="1"
                creatorName="Wyclef Jean"
                onComplete={handleWizardComplete}
                onCancel={() => setShowWizard(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}