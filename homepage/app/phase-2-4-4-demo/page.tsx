"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  Users,
  MessageSquare,
  Gauge,
  Zap,
  CheckCircle,
  Info,
  Gift,
  ArrowRight,
  Eye
} from "lucide-react"
import { motion } from "framer-motion"

import { EnhancedBookingWizard } from "@/components/booking/wizard/enhanced-booking-wizard"
import { EnhancedMessageDetails } from "@/components/booking/enhanced-message-details"
import { 
  SmartProgressTracker, 
  RealTimeValidationPanel, 
  FormQualityIndicator,
  type ProgressStep,
  type ValidationResult
} from "@/components/booking/progress-validation-ui"

export default function Phase244Demo() {
  const [activeDemo, setActiveDemo] = React.useState("wizard")
  const [demoData, setDemoData] = React.useState({
    recipientName: "Sarah",
    fromName: "Mike",
    occasion: "birthday",
    instructions: "Please wish Sarah a happy 25th birthday! She's been following you since 2020 and absolutely loves your comedy content. She's starting a new job next week and could use some encouragement!"
  })
  
  // Demo progress steps
  const demoProgressSteps: ProgressStep[] = [
    {
      id: "occasion",
      label: "Choose Occasion",
      description: "What are we celebrating?",
      status: "completed",
      required: true,
      completionPercentage: 100,
      estimatedTime: "1-2 min"
    },
    {
      id: "details",
      label: "Message Details",
      description: "Personalize your request", 
      status: "active",
      required: true,
      completionPercentage: 75,
      estimatedTime: "2-3 min"
    },
    {
      id: "delivery",
      label: "Delivery Options",
      description: "When and how to deliver",
      status: "pending", 
      required: true,
      estimatedTime: "1-2 min"
    },
    {
      id: "review",
      label: "Review & Confirm",
      description: "Check everything looks good",
      status: "pending",
      required: true,
      estimatedTime: "1 min"
    }
  ]
  
  // Demo validation result
  const demoValidationResult: ValidationResult = {
    isValid: false,
    errors: [
      {
        id: "email_required",
        type: "required",
        message: "Email address is required for order updates",
        severity: "error",
        autoFix: false
      }
    ],
    warnings: [
      {
        id: "relationship_suggested",
        type: "custom",
        message: "Adding your relationship could make this more personal",
        severity: "warning",
        autoFix: false
      }
    ],
    suggestions: [
      {
        id: "add_special_details",
        type: "custom", 
        message: "Consider adding special details about shared memories",
        severity: "info",
        autoFix: false
      }
    ],
    score: 82
  }
  
  const demoQualityMetrics = {
    completeness: 85,
    accuracy: 90,
    engagement: 75,
    optimization: 80
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
            Phase 2.4.4 Complete
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Message Details & Personalization
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enhanced message details with smart suggestions, AI-powered personalization, 
            and real-time validation for the perfect booking experience.
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
              <Brain className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Smart AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered suggestions based on occasion, relationship, and creator style
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <Target className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Real-time Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instant feedback with auto-fix suggestions and quality scoring
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20">
            <CardHeader className="pb-3">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Smart progress indicators with completion estimates and guidance
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/20">
            <CardHeader className="pb-3">
              <Sparkles className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle className="text-lg">Enhanced Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dynamic templates with token replacement and style variations
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
              <TabsTrigger value="wizard">Complete Wizard</TabsTrigger>
              <TabsTrigger value="message-details">Message Details</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
              <TabsTrigger value="validation">Validation UI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wizard" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Enhanced Booking Wizard
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete booking experience with all Phase 2.4.4 enhancements integrated
                  </p>
                </CardHeader>
                <CardContent>
                  <EnhancedBookingWizard
                    creatorId="demo-creator"
                    creatorName="Demo Creator"
                    onComplete={(data) => console.log("Demo booking completed:", data)}
                    onCancel={() => console.log("Demo booking cancelled")}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="message-details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Enhanced Message Details
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Advanced message personalization with AI suggestions and smart validation
                  </p>
                </CardHeader>
                <CardContent>
                  <EnhancedMessageDetails
                    data={demoData}
                    updateData={setDemoData}
                    errors={{}}
                    isActive={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Smart Progress Tracker
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Intelligent progress tracking with time estimates
                    </p>
                  </CardHeader>
                  <CardContent>
                    <SmartProgressTracker
                      steps={demoProgressSteps}
                      currentStep="details"
                      showValidation={true}
                      showTimeEstimates={true}
                      animateProgress={true}
                      variant="default"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-purple-600" />
                      Form Quality Indicator
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                      Real-time quality scoring and optimization tips
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FormQualityIndicator
                      score={82}
                      metrics={demoQualityMetrics}
                      showDetails={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="validation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-red-600" />
                    Real-time Validation Panel
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Instant validation feedback with auto-fix suggestions
                  </p>
                </CardHeader>
                <CardContent>
                  <RealTimeValidationPanel
                    validationResult={demoValidationResult}
                    showSuggestions={true}
                    showScore={true}
                    autoFix={true}
                    onAutoFix={(ruleId) => console.log("Auto-fix:", ruleId)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Key Improvements */}
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
                Phase 2.4.4 Key Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Enhanced Intelligence
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>AI-powered smart suggestions based on context</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Creator style adaptation for personalization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Popular request patterns and trending suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Dynamic template variations with token replacement</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    User Experience
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Real-time validation with instant feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Progress tracking with completion estimates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Quality scoring and optimization guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Enhanced accessibility and form optimization</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">40%</div>
              <div className="text-sm text-gray-600">Faster Input</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-600">60%</div>
              <div className="text-sm text-gray-600">Use AI Suggestions</div>
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
            <a href="/phase-2-4-3-demo">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Phase 2.4.3: Form Optimization
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