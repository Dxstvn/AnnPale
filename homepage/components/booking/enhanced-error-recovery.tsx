"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertCircle,
  XCircle,
  RefreshCw,
  CreditCard,
  Users,
  WifiOff,
  Clock,
  Save,
  MessageSquare,
  HelpCircle,
  Phone,
  Mail,
  Video,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  ShieldAlert,
  CheckCircle,
  Info,
  Sparkles,
  Heart,
  LifeBuoy,
  Send,
  MessageCircle,
  Headphones,
  FileText,
  Search,
  Zap,
  TrendingUp,
  Award,
  Timer,
  DollarSign,
  Gift,
  Percent,
  Bell,
  User,
  Home,
  Settings,
  LogOut,
  ExternalLink,
  PlayCircle,
  ShoppingCart,
  ThumbsUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Error type definitions
export type ErrorType = 
  | "payment_failed"
  | "creator_unavailable" 
  | "validation_error"
  | "network_error"
  | "session_timeout"
  | "server_error"
  | "permission_denied"
  | "not_found"

// Error scenario interface
interface ErrorScenario {
  type: ErrorType
  title: string
  message: string
  icon: React.ElementType
  iconColor: string
  severity: "error" | "warning" | "info"
  recoveryActions: RecoveryAction[]
  supportOptions: SupportOption[]
  showRetry?: boolean
  showSaveDraft?: boolean
  autoRecoverable?: boolean
}

// Recovery action interface
interface RecoveryAction {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  action: () => void
  variant?: "default" | "outline" | "secondary" | "destructive"
  recommended?: boolean
}

// Support option interface
interface SupportOption {
  id: string
  type: "chat" | "email" | "phone" | "faq" | "video"
  label: string
  availability?: string
  icon: React.ElementType
  action: () => void
}

// FAQ item interface
interface FAQItem {
  question: string
  answer: string
  category: string
  helpful?: number
}

// Abandoned cart recovery interface
interface AbandonedCartStage {
  delay: string
  type: "email" | "notification" | "sms"
  subject: string
  message: string
  incentive?: string
  cta: string
}

// Error scenarios configuration
const errorScenarios: Record<ErrorType, ErrorScenario> = {
  payment_failed: {
    type: "payment_failed",
    title: "Payment Couldn't Be Processed",
    message: "Your payment was declined. Please check your payment details or try a different method.",
    icon: CreditCard,
    iconColor: "text-red-600",
    severity: "error",
    showRetry: true,
    recoveryActions: [
      {
        id: "retry",
        label: "Try Again",
        description: "Retry with same payment method",
        icon: RefreshCw,
        action: () => toast.info("Retrying payment..."),
        variant: "default",
        recommended: true
      },
      {
        id: "different_method",
        label: "Use Different Method",
        description: "Try PayPal, Apple Pay, or another card",
        icon: CreditCard,
        action: () => toast.info("Switching payment method..."),
        variant: "outline"
      }
    ],
    supportOptions: [
      {
        id: "chat",
        type: "chat",
        label: "Live Chat",
        availability: "Available now",
        icon: MessageSquare,
        action: () => toast.info("Opening chat...")
      },
      {
        id: "phone",
        type: "phone",
        label: "Call Support",
        availability: "24/7",
        icon: Phone,
        action: () => toast.info("Dialing support...")
      }
    ]
  },
  creator_unavailable: {
    type: "creator_unavailable",
    title: "Creator is Now Unavailable",
    message: "This creator is temporarily unable to accept new bookings. You can join the waitlist or explore similar creators.",
    icon: Users,
    iconColor: "text-yellow-600",
    severity: "warning",
    recoveryActions: [
      {
        id: "waitlist",
        label: "Join Waitlist",
        description: "Get notified when available",
        icon: Bell,
        action: () => toast.success("Added to waitlist!"),
        variant: "default",
        recommended: true
      },
      {
        id: "similar",
        label: "Find Similar Creators",
        description: "Browse creators in same category",
        icon: Search,
        action: () => toast.info("Finding similar creators..."),
        variant: "outline"
      }
    ],
    supportOptions: [
      {
        id: "email",
        type: "email",
        label: "Email Updates",
        icon: Mail,
        action: () => toast.info("Email notification set up")
      }
    ]
  },
  validation_error: {
    type: "validation_error",
    title: "Please Check Your Information",
    message: "Some fields need attention. Please review the highlighted areas.",
    icon: AlertCircle,
    iconColor: "text-orange-600",
    severity: "warning",
    recoveryActions: [
      {
        id: "fix",
        label: "Review Fields",
        icon: CheckCircle,
        action: () => toast.info("Scrolling to errors..."),
        variant: "default",
        recommended: true
      }
    ],
    supportOptions: [
      {
        id: "faq",
        type: "faq",
        label: "View Help",
        icon: HelpCircle,
        action: () => toast.info("Opening help...")
      }
    ]
  },
  network_error: {
    type: "network_error",
    title: "Connection Issue Detected",
    message: "We're having trouble connecting. Please check your internet and try again.",
    icon: WifiOff,
    iconColor: "text-gray-600",
    severity: "error",
    showRetry: true,
    showSaveDraft: true,
    autoRecoverable: true,
    recoveryActions: [
      {
        id: "retry",
        label: "Retry Connection",
        icon: RefreshCw,
        action: () => toast.info("Retrying..."),
        variant: "default",
        recommended: true
      },
      {
        id: "save",
        label: "Save as Draft",
        description: "Continue later",
        icon: Save,
        action: () => toast.success("Draft saved!"),
        variant: "outline"
      }
    ],
    supportOptions: [
      {
        id: "phone",
        type: "phone",
        label: "Phone Support",
        availability: "24/7",
        icon: Phone,
        action: () => toast.info("Call 1-800-ANNPALE")
      }
    ]
  },
  session_timeout: {
    type: "session_timeout",
    title: "Session Expired for Your Security",
    message: "Your session has timed out. Don't worry - we've saved your progress.",
    icon: Clock,
    iconColor: "text-blue-600",
    severity: "info",
    showSaveDraft: true,
    recoveryActions: [
      {
        id: "restore",
        label: "Restore Progress",
        description: "Continue where you left off",
        icon: RefreshCw,
        action: () => toast.success("Progress restored!"),
        variant: "default",
        recommended: true
      },
      {
        id: "start_over",
        label: "Start Fresh",
        icon: Home,
        action: () => toast.info("Starting over..."),
        variant: "outline"
      }
    ],
    supportOptions: [
      {
        id: "faq",
        type: "faq",
        label: "Why did this happen?",
        icon: HelpCircle,
        action: () => toast.info("Opening FAQ...")
      }
    ]
  },
  server_error: {
    type: "server_error",
    title: "Something Went Wrong",
    message: "We're experiencing technical difficulties. Our team has been notified.",
    icon: ShieldAlert,
    iconColor: "text-red-600",
    severity: "error",
    showRetry: true,
    recoveryActions: [
      {
        id: "retry",
        label: "Try Again",
        icon: RefreshCw,
        action: () => toast.info("Retrying..."),
        variant: "default",
        recommended: true
      },
      {
        id: "report",
        label: "Report Issue",
        icon: FileText,
        action: () => toast.info("Opening report form..."),
        variant: "outline"
      }
    ],
    supportOptions: [
      {
        id: "chat",
        type: "chat",
        label: "Technical Support",
        availability: "Priority queue",
        icon: Headphones,
        action: () => toast.info("Connecting to support...")
      }
    ]
  },
  permission_denied: {
    type: "permission_denied",
    title: "Access Restricted",
    message: "You don't have permission to access this. Please log in or contact support.",
    icon: ShieldAlert,
    iconColor: "text-purple-600",
    severity: "warning",
    recoveryActions: [
      {
        id: "login",
        label: "Log In",
        icon: User,
        action: () => toast.info("Redirecting to login..."),
        variant: "default",
        recommended: true
      },
      {
        id: "request",
        label: "Request Access",
        icon: Mail,
        action: () => toast.info("Opening request form..."),
        variant: "outline"
      }
    ],
    supportOptions: [
      {
        id: "email",
        type: "email",
        label: "Contact Admin",
        icon: Mail,
        action: () => toast.info("Opening email...")
      }
    ]
  },
  not_found: {
    type: "not_found",
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or has been moved.",
    icon: Search,
    iconColor: "text-gray-600",
    severity: "info",
    recoveryActions: [
      {
        id: "home",
        label: "Go Home",
        icon: Home,
        action: () => toast.info("Going home..."),
        variant: "default",
        recommended: true
      },
      {
        id: "search",
        label: "Search",
        icon: Search,
        action: () => toast.info("Opening search..."),
        variant: "outline"
      }
    ],
    supportOptions: [
      {
        id: "faq",
        type: "faq",
        label: "Help Center",
        icon: BookOpen,
        action: () => toast.info("Opening help center...")
      }
    ]
  }
}

// Contextual FAQs by step
const contextualFAQs: Record<string, FAQItem[]> = {
  payment: [
    {
      question: "Why was my payment declined?",
      answer: "Common reasons include insufficient funds, incorrect card details, or bank security checks. Try updating your payment info or using a different method.",
      category: "Payment",
      helpful: 234
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes! We use industry-standard SSL encryption and never store your full card details. All payments are processed through secure, PCI-compliant systems.",
      category: "Security",
      helpful: 189
    },
    {
      question: "Can I use PayPal or Apple Pay?",
      answer: "Absolutely! We accept PayPal, Apple Pay, Google Pay, and all major credit cards for your convenience.",
      category: "Payment Methods",
      helpful: 156
    }
  ],
  booking: [
    {
      question: "How long does delivery take?",
      answer: "Standard delivery is 3-5 days, Express is 2 days, and Rush delivery is within 24 hours. The creator will start working on your video as soon as possible.",
      category: "Delivery",
      helpful: 312
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel within 2 hours of placing your order for a full refund. After that, cancellations depend on whether the creator has started your video.",
      category: "Cancellation",
      helpful: 198
    }
  ]
}

// Abandoned cart recovery stages
const abandonedCartStages: AbandonedCartStage[] = [
  {
    delay: "2 hours",
    type: "email",
    subject: "Complete your booking with {creator}",
    message: "Your personalized video is just one click away!",
    cta: "Complete Booking"
  },
  {
    delay: "24 hours",
    type: "email",
    subject: "Don't miss out - 10% off your booking",
    message: "Here's a special discount to complete your order",
    incentive: "10% OFF",
    cta: "Claim Discount"
  },
  {
    delay: "48 hours",
    type: "notification",
    subject: "{creator} is waiting to create your video",
    message: "They're excited to make something special for you",
    cta: "Finish Booking"
  },
  {
    delay: "72 hours",
    type: "email",
    subject: "Last chance - 20% off expires soon",
    message: "This is your final discount offer",
    incentive: "20% OFF",
    cta: "Get 20% Off"
  }
]

// Help widget component
const HelpWidget = ({ 
  isOpen, 
  onToggle,
  currentStep 
}: { 
  isOpen: boolean
  onToggle: () => void
  currentStep?: string
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const faqs = currentStep && contextualFAQs[currentStep] || contextualFAQs.booking
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-20 right-4 z-50 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border"
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-purple-600" />
                How can we help?
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggle}
                className="h-6 w-6 p-0"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-col h-auto py-2"
                onClick={() => toast.info("Opening live chat...")}
              >
                <MessageSquare className="h-4 w-4 mb-1" />
                <span className="text-xs">Chat</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-col h-auto py-2"
                onClick={() => toast.info("Calling support...")}
              >
                <Phone className="h-4 w-4 mb-1" />
                <span className="text-xs">Call</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-col h-auto py-2"
                onClick={() => toast.info("Opening email...")}
              >
                <Mail className="h-4 w-4 mb-1" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
            
            <Separator />
            
            {/* Contextual FAQs */}
            <div>
              <h4 className="text-sm font-medium mb-2">Common Questions</h4>
              <Accordion type="single" collapsible className="w-full">
                {faqs.slice(0, 3).map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-gray-600">
                      {faq.answer}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs"
                          onClick={() => toast.success("Thanks for your feedback!")}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Helpful ({faq.helpful})
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => toast.info("Opening help center...")}
            >
              View All Help Articles
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Main error recovery component
export interface EnhancedErrorRecoveryProps {
  error?: ErrorType
  onRecover?: () => void
  onSupport?: (type: string) => void
  showHelp?: boolean
  currentStep?: string
  savedData?: any
  className?: string
}

export function EnhancedErrorRecovery({
  error = "payment_failed",
  onRecover,
  onSupport,
  showHelp = true,
  currentStep = "payment",
  savedData,
  className
}: EnhancedErrorRecoveryProps) {
  const [isHelpOpen, setIsHelpOpen] = React.useState(false)
  const [isRecovering, setIsRecovering] = React.useState(false)
  const [abandonedCartSent, setAbandonedCartSent] = React.useState<string[]>([])
  
  const scenario = errorScenarios[error]
  
  const handleRecovery = async (action: RecoveryAction) => {
    setIsRecovering(true)
    action.action()
    
    // Simulate recovery process
    setTimeout(() => {
      setIsRecovering(false)
      if (onRecover) onRecover()
    }, 2000)
  }
  
  const handleSupport = (option: SupportOption) => {
    option.action()
    if (onSupport) onSupport(option.type)
  }
  
  const simulateAbandonedCart = (stage: AbandonedCartStage) => {
    setAbandonedCartSent(prev => [...prev, stage.delay])
    toast.success(`${stage.type === "email" ? "📧" : "🔔"} ${stage.subject}`)
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Error Alert */}
      <Alert className={cn(
        "border-2",
        scenario.severity === "error" && "border-red-200 bg-red-50 dark:bg-red-900/20",
        scenario.severity === "warning" && "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20",
        scenario.severity === "info" && "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
      )}>
        <scenario.icon className={cn("h-5 w-5", scenario.iconColor)} />
        <AlertTitle className="text-lg font-semibold">
          {scenario.title}
        </AlertTitle>
        <AlertDescription className="mt-2">
          {scenario.message}
        </AlertDescription>
        
        {/* Recovery Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {scenario.recoveryActions.map(action => (
            <TooltipProvider key={action.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={action.variant || "default"}
                    onClick={() => handleRecovery(action)}
                    disabled={isRecovering}
                    className={cn(
                      action.recommended && "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    )}
                  >
                    {isRecovering ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <action.icon className="h-4 w-4 mr-2" />
                    )}
                    {action.label}
                    {action.recommended && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Recommended
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                {action.description && (
                  <TooltipContent>
                    <p>{action.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        
        {/* Auto-recovery indicator */}
        {scenario.autoRecoverable && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Auto-retrying in 5 seconds...</span>
          </div>
        )}
      </Alert>
      
      {/* Support Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-purple-600" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {scenario.supportOptions.map(option => (
              <Button
                key={option.id}
                variant="outline"
                onClick={() => handleSupport(option)}
                className="justify-start"
              >
                <option.icon className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  {option.availability && (
                    <div className="text-xs text-gray-500">{option.availability}</div>
                  )}
                </div>
              </Button>
            ))}
          </div>
          
          {/* Additional support info */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-blue-600" />
              <span>Average response time: <strong>2 minutes</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Saved Progress Card (if applicable) */}
      {scenario.showSaveDraft && savedData && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Your Progress is Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              We've automatically saved your booking details. You can continue anytime within the next 7 days.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Draft saved to account")}
              >
                <Save className="h-3 w-3 mr-1" />
                Save to Account
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`https://annpale.com/booking/draft/${Date.now()}`)
                  toast.success("Link copied!")
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Abandoned Cart Recovery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            Don't Lose Your Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            If you can't complete now, we'll help you finish later:
          </p>
          <div className="space-y-3">
            {abandonedCartStages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg",
                  abandonedCartSent.includes(stage.delay) 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200"
                    : "bg-gray-50 dark:bg-gray-800"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  abandonedCartSent.includes(stage.delay)
                    ? "bg-green-100 dark:bg-green-800"
                    : "bg-gray-200 dark:bg-gray-700"
                )}>
                  {stage.type === "email" ? <Mail className="h-5 w-5" /> :
                   stage.type === "sms" ? <MessageCircle className="h-5 w-5" /> :
                   <Bell className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{stage.delay}</span>
                    {stage.incentive && (
                      <Badge variant="secondary" className="text-xs">
                        {stage.incentive}
                      </Badge>
                    )}
                    {abandonedCartSent.includes(stage.delay) && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        Sent
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{stage.message}</p>
                </div>
                {!abandonedCartSent.includes(stage.delay) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => simulateAbandonedCart(stage)}
                    className="text-xs"
                  >
                    Preview
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Help Widget */}
      {showHelp && (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg flex items-center justify-center"
          >
            {isHelpOpen ? <XCircle className="h-6 w-6" /> : <HelpCircle className="h-6 w-6" />}
          </motion.button>
          
          <HelpWidget
            isOpen={isHelpOpen}
            onToggle={() => setIsHelpOpen(!isHelpOpen)}
            currentStep={currentStep}
          />
        </>
      )}
    </div>
  )
}