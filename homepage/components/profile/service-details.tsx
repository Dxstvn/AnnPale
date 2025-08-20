"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  Clock,
  Globe,
  Gift,
  Calendar,
  Sparkles,
  MessageSquare,
  Users,
  Heart,
  Star,
  CheckCircle,
  Info,
  Zap,
  Music,
  Cake,
  GraduationCap,
  Trophy,
  Briefcase,
  Baby,
  PartyPopper,
  HeartHandshake,
  Church,
  Plane,
  AlertCircle,
  ChevronRight,
  Play,
  FileText,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

// Service details data structure
export interface ServiceDetailsData {
  // What They Offer
  serviceOverview: {
    title: string
    description: string
    videoLength: {
      min: number
      max: number
      typical: number
    }
    deliveryTime: {
      standard: number // days
      rush?: number // hours
    }
    startingPrice: number
  }
  
  // Video Style
  videoStyle: {
    tone: Array<"casual" | "professional" | "humorous" | "heartfelt" | "energetic" | "inspirational">
    setting: Array<"studio" | "home" | "outdoor" | "office" | "stage">
    props?: string[]
    specialEffects?: boolean
    customBackgrounds?: boolean
  }
  
  // Special Occasions
  occasions: Array<{
    id: string
    name: string
    icon?: string
    popular?: boolean
    examples?: string[]
    priceModifier?: number // percentage
  }>
  
  // Languages
  languages: Array<{
    language: string
    proficiency: "native" | "fluent" | "conversational"
    dialectsOrAccents?: string[]
  }>
  
  // Service Inclusions
  inclusions: {
    standard: string[]
    additional?: string[]
    notIncluded?: string[]
  }
  
  // Booking Requirements
  requirements?: {
    advanceNotice: number // days
    scriptGuidelines?: string
    maxRetakes?: number
    contentRestrictions?: string[]
  }
  
  // FAQs
  faqs?: Array<{
    question: string
    answer: string
  }>
  
  // Testimonial Highlights
  testimonialHighlights?: Array<{
    occasion: string
    quote: string
    author?: string
  }>
}

interface ServiceDetailsProps {
  data: ServiceDetailsData
  creatorName: string
  onBookNow?: () => void
  className?: string
  variant?: "full" | "compact" | "tabbed"
}

// Occasion icons mapping
const occasionIcons: Record<string, React.ElementType> = {
  birthday: Cake,
  wedding: Church,
  anniversary: Heart,
  graduation: GraduationCap,
  baby: Baby,
  congratulations: Trophy,
  motivation: Zap,
  business: Briefcase,
  holiday: Gift,
  party: PartyPopper,
  travel: Plane,
  custom: Sparkles
}

// Service overview card
function ServiceOverview({ 
  overview,
  onBookNow 
}: { 
  overview: ServiceDetailsData['serviceOverview']
  onBookNow?: () => void 
}) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-purple-500" />
          {overview.title}
        </CardTitle>
        <CardDescription>{overview.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Video Length</p>
            <p className="font-semibold">{overview.videoLength.typical} min</p>
            <p className="text-xs text-gray-500">
              ({overview.videoLength.min}-{overview.videoLength.max} min range)
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Delivery</p>
            <p className="font-semibold">{overview.deliveryTime.standard} days</p>
            {overview.deliveryTime.rush && (
              <p className="text-xs text-orange-600">
                Rush: {overview.deliveryTime.rush}h
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Starting at</p>
            <p className="text-2xl font-bold text-purple-600">${overview.startingPrice}</p>
          </div>
          <div className="flex items-end">
            {onBookNow && (
              <Button
                size="sm"
                className="w-full"
                onClick={onBookNow}
              >
                Book Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Video style display
function VideoStyle({ style }: { style: ServiceDetailsData['videoStyle'] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Play className="h-4 w-4" />
        Video Style & Production
      </h3>
      
      {/* Tone */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Tone & Mood</p>
        <div className="flex flex-wrap gap-2">
          {style.tone.map((tone) => (
            <Badge key={tone} variant="secondary" className="capitalize">
              {tone}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Setting */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Recording Settings</p>
        <div className="flex flex-wrap gap-2">
          {style.setting.map((setting) => (
            <Badge key={setting} variant="outline" className="capitalize">
              {setting}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Special Features */}
      {(style.props || style.specialEffects || style.customBackgrounds) && (
        <div className="flex flex-wrap gap-3 pt-2 border-t">
          {style.props && style.props.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Props available</span>
            </div>
          )}
          {style.specialEffects && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Special effects</span>
            </div>
          )}
          {style.customBackgrounds && (
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Custom backgrounds</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Occasions grid
function OccasionsGrid({ occasions }: { occasions: ServiceDetailsData['occasions'] }) {
  const popularOccasions = occasions.filter(o => o.popular)
  const otherOccasions = occasions.filter(o => !o.popular)
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Gift className="h-4 w-4" />
        Perfect For These Occasions
      </h3>
      
      {popularOccasions.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Most Popular</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularOccasions.map((occasion) => {
              const Icon = occasion.icon ? occasionIcons[occasion.icon] || Gift : Gift
              
              return (
                <motion.div
                  key={occasion.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm">{occasion.name}</span>
                      </div>
                      {occasion.examples && (
                        <div className="space-y-1">
                          {occasion.examples.slice(0, 2).map((example, idx) => (
                            <p key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                              • {example}
                            </p>
                          ))}
                        </div>
                      )}
                      {occasion.priceModifier && occasion.priceModifier > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-orange-500 text-xs">
                          +{occasion.priceModifier}%
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
      
      {otherOccasions.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Also Available For</p>
          <div className="flex flex-wrap gap-2">
            {otherOccasions.map((occasion) => {
              const Icon = occasion.icon ? occasionIcons[occasion.icon] || Gift : Gift
              
              return (
                <Badge key={occasion.id} variant="outline" className="gap-1">
                  <Icon className="h-3 w-3" />
                  {occasion.name}
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Language capabilities
function LanguageCapabilities({ 
  languages 
}: { 
  languages: ServiceDetailsData['languages'] 
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Language Capabilities
      </h3>
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{lang.language}</span>
              <Badge
                variant={lang.proficiency === "native" ? "default" : "secondary"}
                className="text-xs"
              >
                {lang.proficiency}
              </Badge>
            </div>
            {lang.dialectsOrAccents && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Dialects/Accents: {lang.dialectsOrAccents.join(", ")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Service inclusions
function ServiceInclusions({ 
  inclusions 
}: { 
  inclusions: ServiceDetailsData['inclusions'] 
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        What's Included
      </h3>
      
      <div className="space-y-3">
        {/* Standard inclusions */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Standard Package</p>
          <div className="space-y-1">
            {inclusions.standard.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional options */}
        {inclusions.additional && inclusions.additional.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Available Add-Ons</p>
            <div className="space-y-1">
              {inclusions.additional.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Not included */}
        {inclusions.notIncluded && inclusions.notIncluded.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Not Included</p>
            <div className="space-y-1">
              {inclusions.notIncluded.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500 dark:text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Booking requirements
function BookingRequirements({ 
  requirements 
}: { 
  requirements: NonNullable<ServiceDetailsData['requirements']> 
}) {
  return (
    <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-orange-500" />
          Booking Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
          <span className="text-sm">Advance Notice</span>
          <Badge variant="secondary">{requirements.advanceNotice} days</Badge>
        </div>
        
        {requirements.scriptGuidelines && (
          <div className="p-2 bg-white dark:bg-gray-800 rounded">
            <p className="text-xs text-gray-500 mb-1">Script Guidelines</p>
            <p className="text-sm">{requirements.scriptGuidelines}</p>
          </div>
        )}
        
        {requirements.maxRetakes && (
          <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
            <span className="text-sm">Max Retakes</span>
            <Badge variant="secondary">{requirements.maxRetakes}</Badge>
          </div>
        )}
        
        {requirements.contentRestrictions && requirements.contentRestrictions.length > 0 && (
          <div className="p-2 bg-white dark:bg-gray-800 rounded">
            <p className="text-xs text-gray-500 mb-1">Content Restrictions</p>
            <div className="space-y-1">
              {requirements.contentRestrictions.map((restriction, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Shield className="h-3 w-3 text-red-500" />
                  <span className="text-gray-600 dark:text-gray-400">{restriction}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// FAQs section
function FAQs({ faqs }: { faqs: NonNullable<ServiceDetailsData['faqs']> }) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0)
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Frequently Asked Questions
      </h3>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="cursor-pointer"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium pr-2">{faq.question}</p>
                <ChevronRight className={cn(
                  "h-4 w-4 flex-shrink-0 transition-transform",
                  expandedIndex === index && "rotate-90"
                )} />
              </div>
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Testimonial highlights
function TestimonialHighlights({ 
  testimonials 
}: { 
  testimonials: NonNullable<ServiceDetailsData['testimonialHighlights']> 
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-500" />
        What Customers Say
      </h3>
      <div className="grid gap-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200">
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">
                {testimonial.occasion}
              </Badge>
              <p className="text-sm italic text-gray-700 dark:text-gray-300">
                "{testimonial.quote}"
              </p>
              {testimonial.author && (
                <p className="text-xs text-gray-500 mt-2">— {testimonial.author}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Main service details component
export function ServiceDetails({
  data,
  creatorName,
  onBookNow,
  className,
  variant = "full"
}: ServiceDetailsProps) {
  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Video Length</p>
              <p className="font-medium">{data.serviceOverview.videoLength.typical} min</p>
            </div>
            <div>
              <p className="text-gray-500">Delivery</p>
              <p className="font-medium">{data.serviceOverview.deliveryTime.standard} days</p>
            </div>
            <div>
              <p className="text-gray-500">Languages</p>
              <p className="font-medium">{data.languages.length} available</p>
            </div>
            <div>
              <p className="text-gray-500">Starting at</p>
              <p className="font-medium text-purple-600">${data.serviceOverview.startingPrice}</p>
            </div>
          </div>
          <Button className="w-full" size="sm" onClick={onBookNow}>
            View Full Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  if (variant === "tabbed") {
    return (
      <div className={cn("space-y-6", className)}>
        <ServiceOverview overview={data.serviceOverview} onBookNow={onBookNow} />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="occasions">Occasions</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <VideoStyle style={data.videoStyle} />
            <LanguageCapabilities languages={data.languages} />
          </TabsContent>
          
          <TabsContent value="occasions" className="mt-4">
            <OccasionsGrid occasions={data.occasions} />
          </TabsContent>
          
          <TabsContent value="inclusions" className="space-y-4 mt-4">
            <ServiceInclusions inclusions={data.inclusions} />
            {data.requirements && <BookingRequirements requirements={data.requirements} />}
          </TabsContent>
          
          <TabsContent value="faqs" className="space-y-4 mt-4">
            {data.faqs && <FAQs faqs={data.faqs} />}
            {data.testimonialHighlights && (
              <TestimonialHighlights testimonials={data.testimonialHighlights} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  
  // Full variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview */}
      <ServiceOverview overview={data.serviceOverview} onBookNow={onBookNow} />
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Production & Style</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoStyle style={data.videoStyle} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Perfect Occasions</CardTitle>
            </CardHeader>
            <CardContent>
              <OccasionsGrid occasions={data.occasions} />
            </CardContent>
          </Card>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceInclusions inclusions={data.inclusions} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageCapabilities languages={data.languages} />
            </CardContent>
          </Card>
          
          {data.requirements && <BookingRequirements requirements={data.requirements} />}
        </div>
      </div>
      
      {/* FAQs and Testimonials */}
      {(data.faqs || data.testimonialHighlights) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.faqs && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <FAQs faqs={data.faqs} />
              </CardContent>
            </Card>
          )}
          
          {data.testimonialHighlights && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <TestimonialHighlights testimonials={data.testimonialHighlights} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}