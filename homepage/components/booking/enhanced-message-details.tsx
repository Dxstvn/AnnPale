"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  User,
  Users,
  MessageSquare,
  Info,
  Sparkles,
  FileText,
  Lightbulb,
  ChevronRight,
  Check,
  AlertCircle,
  Wand2,
  Heart,
  Smile,
  Gift,
  Star,
  Music,
  Camera,
  Mic,
  Hash,
  AtSign,
  GraduationCap,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Zap,
  BookOpen,
  Coffee,
  Trophy,
  ThumbsUp,
  MessageCircle,
  Shuffle,
  RefreshCw,
  Copy,
  Eye,
  BarChart3,
  Users2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { OptimizedFormField, useFieldDependencies } from "./form-field-optimization"
import type { StepComponentProps } from "./wizard/multi-step-wizard"

// Enhanced message templates with more dynamic content
const enhancedMessageTemplates = {
  birthday: {
    title: "Birthday Wishes",
    icon: Gift,
    color: "purple",
    templates: [
      {
        id: "birthday_classic",
        label: "Classic Birthday",
        popularity: 85,
        template: "Please wish [Name] a happy [Age]th birthday! They're a huge fan of yours and would love to hear about [specific_topic]. Make it personal and fun!",
        tokens: ["Name", "Age", "specific_topic"],
        tone: "cheerful",
        length: "medium",
        variations: [
          "Hey [Name]! Happy [Age]th birthday! 🎉 I heard you love [specific_topic] - let's celebrate!",
          "Happy birthday [Name]! [Age] looks amazing on you! Hope you're having the best day celebrating with [people_present]!"
        ]
      },
      {
        id: "birthday_milestone",
        label: "Milestone Birthday", 
        popularity: 70,
        template: "It's [Name]'s big [Age]! They've been following you since [time_period]. Please share some wisdom about entering this new decade and mention their love for [interest].",
        tokens: ["Name", "Age", "time_period", "interest"],
        tone: "inspirational",
        length: "long",
        variations: [
          "[Name] is turning [Age] - what a milestone! They've supported you for [time_period]. Share some life wisdom!",
          "The big [Age] for [Name]! They've been a fan since [time_period]. Make this one special!"
        ]
      },
      {
        id: "birthday_surprise",
        label: "Surprise Party",
        popularity: 60,
        template: "We're surprising [Name] for their birthday! They think this is just a regular day. Please act surprised and excited when you 'find out' it's their birthday. They love [hobby]!",
        tokens: ["Name", "hobby"],
        tone: "excited",
        length: "medium",
        variations: [
          "SURPRISE! It's [Name]'s birthday and they have no idea this is coming! They're obsessed with [hobby]!",
          "Shh... [Name] doesn't know we planned this! Act shocked when you realize it's their birthday!"
        ]
      }
    ]
  },
  anniversary: {
    title: "Anniversary Messages",
    icon: Heart,
    color: "rose",
    templates: [
      {
        id: "anniversary_wedding",
        label: "Wedding Anniversary",
        popularity: 90,
        template: "Please congratulate [Names] on their [Number] year anniversary! They met at [location_event] and would love if you mentioned [special_memory]. Make it romantic!",
        tokens: ["Names", "Number", "location_event", "special_memory"],
        tone: "romantic",
        length: "medium"
      },
      {
        id: "anniversary_dating",
        label: "Dating Anniversary", 
        popularity: 75,
        template: "Help [Name1] surprise [Name2] for their anniversary! They've been together [time] and share a love for [shared_interest]. [Name2] is your biggest fan!",
        tokens: ["Name1", "Name2", "time", "shared_interest"],
        tone: "sweet",
        length: "medium"
      }
    ]
  },
  graduation: {
    title: "Graduation",
    icon: GraduationCap,
    color: "blue",
    templates: [
      {
        id: "graduation_college",
        label: "College Graduation",
        popularity: 88,
        template: "[Name] just graduated from [School] with a degree in [Major]! They're heading to [next_step]. Please share advice and congratulate them on this achievement!",
        tokens: ["Name", "School", "Major", "next_step"],
        tone: "proud",
        length: "medium"
      },
      {
        id: "graduation_high_school", 
        label: "High School Graduation",
        popularity: 80,
        template: "Congratulate [Name] on graduating high school! They're going to [College_Plan] and would love encouragement. They've overcome [challenge] to get here.",
        tokens: ["Name", "College_Plan", "challenge"],
        tone: "encouraging",
        length: "medium"
      }
    ]
  },
  encouragement: {
    title: "Encouragement & Support",
    icon: Heart,
    color: "green",
    templates: [
      {
        id: "get_well_general",
        label: "Get Well Soon",
        popularity: 85,
        template: "Please send get well wishes to [Name]. They're recovering from [situation] and could use encouragement. They love your [specific_work_content].",
        tokens: ["Name", "situation", "specific_work_content"],
        tone: "caring",
        length: "short"
      },
      {
        id: "tough_times",
        label: "Going Through Tough Times",
        popularity: 70,
        template: "[Name] has been going through [situation] and could really use some encouragement from their favorite creator. They find strength in [what_helps_them].",
        tokens: ["Name", "situation", "what_helps_them"],
        tone: "supportive",
        length: "medium"
      }
    ]
  },
  just_because: {
    title: "Just Because",
    icon: Smile,
    color: "yellow",
    templates: [
      {
        id: "just_because_fan",
        label: "Biggest Fan",
        popularity: 92,
        template: "[Name] is your biggest fan! They've been following you since [time] and always talk about [favorite_thing_about_you]. Just wanted to surprise them!",
        tokens: ["Name", "time", "favorite_thing_about_you"],
        tone: "appreciative",
        length: "short"
      },
      {
        id: "just_because_cheer",
        label: "Cheer Up",
        popularity: 75,
        template: "[Name] has been having a rough time with [situation]. They could really use some positivity and encouragement from their favorite creator!",
        tokens: ["Name", "situation"],
        tone: "uplifting",
        length: "short"
      }
    ]
  }
}

// Enhanced writing prompts with categories
const enhancedWritingPrompts = [
  {
    category: "Personal Details",
    prompts: [
      { icon: User, prompt: "What makes this person special to you?", examples: ["Their kindness", "Their sense of humor", "Their determination"] },
      { icon: Heart, prompt: "What do they love about this creator?", examples: ["Your music", "Your comedy", "Your advice"] },
      { icon: Star, prompt: "Any recent achievements to celebrate?", examples: ["Got a promotion", "Ran a marathon", "Learned a new skill"] }
    ]
  },
  {
    category: "Memories & Stories", 
    prompts: [
      { icon: Camera, prompt: "Any special moments to reference?", examples: ["Their wedding day", "A family vacation", "When they met you"] },
      { icon: Smile, prompt: "Inside jokes or shared memories?", examples: ["A funny story", "A favorite quote", "A memorable experience"] },
      { icon: Music, prompt: "Favorite songs, quotes, or sayings?", examples: ["A song that means a lot", "Words they live by", "A funny catchphrase"] }
    ]
  },
  {
    category: "Context & Delivery",
    prompts: [
      { icon: Mic, prompt: "How should the creator address them?", examples: ["By their nickname", "Formally", "Like an old friend"] },
      { icon: Gift, prompt: "What would make this message perfect?", examples: ["Mention their pet", "Reference their hobby", "Include their family"] },
      { icon: Coffee, prompt: "What's happening in their life right now?", examples: ["Starting a new job", "Moving to a new city", "Recovering from illness"] }
    ]
  }
]

// Smart suggestion engine
class SmartSuggestionEngine {
  static generateSuggestions(context: {
    occasion?: string
    recipientName?: string
    relationship?: string
    creatorStyle?: string
    previousBookings?: any[]
    popularRequests?: string[]
  }) {
    const { occasion, recipientName, relationship, creatorStyle = "friendly" } = context
    
    const suggestions = []
    
    // Base template suggestions
    if (occasion && enhancedMessageTemplates[occasion as keyof typeof enhancedMessageTemplates]) {
      const templates = enhancedMessageTemplates[occasion as keyof typeof enhancedMessageTemplates].templates
      suggestions.push(...templates.slice(0, 2).map(t => ({
        type: "template",
        content: t.template,
        confidence: t.popularity,
        source: "template_match"
      })))
    }
    
    // Personalized suggestions based on relationship
    if (relationship && recipientName) {
      const relationshipPrompts = {
        "friend": `Hey! Could you please send a message to my friend ${recipientName}? They're such a huge fan and would be thrilled to hear from you!`,
        "mom": `This is for my mom ${recipientName} - she absolutely loves you and deserves something special. Could you make her day?`,
        "dad": `My dad ${recipientName} is your biggest fan! He'd be over the moon to get a personal message from you.`,
        "spouse": `This is for my amazing spouse ${recipientName}. They love everything you do and this would mean the world to them!`,
        "child": `Could you please send a message to ${recipientName}? They're my child and look up to you so much!`
      }
      
      const prompt = relationshipPrompts[relationship.toLowerCase() as keyof typeof relationshipPrompts]
      if (prompt) {
        suggestions.push({
          type: "personalized", 
          content: prompt,
          confidence: 85,
          source: "relationship_based"
        })
      }
    }
    
    // Creator style adaptations
    const stylePrompts = {
      "funny": "Make this hilarious and don't hold back on the jokes!",
      "inspirational": "Please share some wisdom and motivation!",
      "caring": "Be warm and heartfelt - this person needs encouragement.",
      "energetic": "Bring the energy! Make this exciting and fun!",
      "professional": "Keep it classy but personal.",
      "casual": "Just be yourself - they love your authentic personality!"
    }
    
    if (creatorStyle && stylePrompts[creatorStyle as keyof typeof stylePrompts]) {
      suggestions.push({
        type: "style_adaptation",
        content: stylePrompts[creatorStyle as keyof typeof stylePrompts],
        confidence: 70,
        source: "creator_style"
      })
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence)
  }
  
  static getPopularRequests(occasion?: string) {
    const popularByOccasion = {
      birthday: [
        "Mention their age milestone",
        "Sing happy birthday",
        "Share birthday wisdom",
        "Reference their zodiac sign",
        "Mention their favorite hobby"
      ],
      graduation: [
        "Give career advice", 
        "Share success tips",
        "Congratulate their achievement",
        "Mention their field of study",
        "Inspire their next chapter"
      ],
      anniversary: [
        "Share relationship advice",
        "Mention how long they've been together",
        "Congratulate their love",
        "Reference their love story",
        "Wish them many more years"
      ]
    }
    
    return popularByOccasion[occasion as keyof typeof popularByOccasion] || [
      "Be genuine and personal",
      "Mention something specific about them",
      "Share encouragement",
      "Reference why they're a fan",
      "Make them smile"
    ]
  }
}

// Pronoun options with enhanced accessibility
const pronounOptions = [
  { value: "they/them", label: "They/Them", usage: "gender neutral" },
  { value: "she/her", label: "She/Her", usage: "feminine" },
  { value: "he/him", label: "He/Him", usage: "masculine" },
  { value: "ze/zir", label: "Ze/Zir", usage: "gender neutral" },
  { value: "prefer_not_say", label: "Prefer not to specify", usage: "no preference" }
]

// Enhanced relationship options with categories
const relationshipCategories = {
  "Family": ["Parent", "Mom", "Dad", "Sister", "Brother", "Sibling", "Spouse", "Partner", "Wife", "Husband", "Daughter", "Son", "Child", "Grandparent", "Grandma", "Grandpa", "Aunt", "Uncle", "Cousin", "Niece", "Nephew"],
  "Friends": ["Friend", "Best Friend", "Childhood Friend", "College Friend", "Roommate", "Neighbor"],
  "Romantic": ["Girlfriend", "Boyfriend", "Partner", "Fiancé", "Fiancée", "Spouse"],
  "Professional": ["Colleague", "Boss", "Employee", "Teacher", "Student", "Coach", "Teammate", "Mentor", "Client"],
  "Other": ["Fan", "Acquaintance", "Someone Special"]
}

export function EnhancedMessageDetails({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  const [activeTab, setActiveTab] = React.useState("details")
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null)
  const [smartSuggestions, setSmartSuggestions] = React.useState<any[]>([])
  const [popularRequests, setPopularRequests] = React.useState<string[]>([])
  const [characterCount, setCharacterCount] = React.useState({
    instructions: data.instructions?.length || 0,
    specialDetails: data.specialDetails?.length || 0
  })
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [templateVariation, setTemplateVariation] = React.useState(0)
  
  // Field dependencies for progressive disclosure
  const dependencies = {
    "pronouns": ["recipientName"],
    "relationship": ["recipientName"],
    "specialDetails": ["instructions"]
  }
  
  const { visibleFields } = useFieldDependencies(data, dependencies)
  
  // Generate smart suggestions when context changes
  React.useEffect(() => {
    const suggestions = SmartSuggestionEngine.generateSuggestions({
      occasion: data.occasion,
      recipientName: data.recipientName,
      relationship: data.relationship,
      creatorStyle: "friendly", // This would come from creator profile
      previousBookings: [], // This would come from user's history
      popularRequests: []
    })
    setSmartSuggestions(suggestions)
    
    const popular = SmartSuggestionEngine.getPopularRequests(data.occasion)
    setPopularRequests(popular)
  }, [data.occasion, data.recipientName, data.relationship])
  
  // Get templates for selected occasion
  const occasionTemplates = React.useMemo(() => {
    if (!data.occasion || data.occasion === "custom") return null
    return enhancedMessageTemplates[data.occasion as keyof typeof enhancedMessageTemplates]
  }, [data.occasion])
  
  // Apply template with token replacement
  const applyTemplate = (templateId: string, variationIndex = 0) => {
    const template = occasionTemplates?.templates.find(t => t.id === templateId)
    if (template) {
      let content = template.template
      
      // Use variation if available
      if (template.variations && template.variations[variationIndex]) {
        content = template.variations[variationIndex]
      }
      
      // Smart token replacement
      const tokenReplacements = {
        "[Name]": data.recipientName || "[Name]",
        "[Names]": data.recipientName || "[Names]",
        "[Age]": data.age || "[Age]",
        "[Number]": data.anniversaryYears || "[Number]"
      }
      
      Object.entries(tokenReplacements).forEach(([token, replacement]) => {
        content = content.replace(new RegExp(token, 'g'), replacement)
      })
      
      setSelectedTemplate(templateId)
      setTemplateVariation(variationIndex)
      updateData({
        instructions: content,
        templateUsed: templateId,
        templateVariation: variationIndex
      })
      setCharacterCount(prev => ({
        ...prev,
        instructions: content.length
      }))
      
      toast.success("Template applied!")
    }
  }
  
  // Generate AI suggestion with enhanced context
  const generateAISuggestion = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation with more sophisticated logic
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const context = {
      recipientName: data.recipientName || "[Name]",
      occasion: data.occasionLabel || data.customOccasion || "special day",
      relationship: data.relationship || "someone special",
      fromName: data.fromName || "a fan"
    }
    
    const sophisticatedSuggestions = [
      `Hi! Please create a heartfelt message for ${context.recipientName}. They're celebrating their ${context.occasion} and would be absolutely thrilled to hear from you. As their ${context.relationship}, I know how much your work means to them. Feel free to be personal and genuine - they'll treasure whatever you create!`,
      
      `Could you please send a special message to ${context.recipientName}? It's their ${context.occasion} and I wanted to surprise them with something unforgettable. They've been following your work for so long and always talk about how much you inspire them. This would truly make their day!`,
      
      `Hey! I'm reaching out because ${context.recipientName} is having their ${context.occasion} and I thought a message from you would be the perfect gift. They're such a genuine fan and deserve something special. Please make it personal - they'll appreciate anything that comes from the heart!`
    ]
    
    const suggestion = sophisticatedSuggestions[Math.floor(Math.random() * sophisticatedSuggestions.length)]
    
    updateData({ instructions: suggestion })
    setCharacterCount(prev => ({
      ...prev,
      instructions: suggestion.length
    }))
    
    setIsGenerating(false)
    toast.success("AI suggestion generated!")
  }
  
  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value })
    
    if (field === "instructions" || field === "specialDetails") {
      setCharacterCount(prev => ({
        ...prev,
        [field]: value.length
      }))
    }
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }
  
  // Calculate completion score
  const completionScore = React.useMemo(() => {
    let score = 0
    if (data.recipientName) score += 30
    if (data.fromName) score += 30
    if (data.instructions && data.instructions.length >= 20) score += 40
    return score
  }, [data.recipientName, data.fromName, data.instructions])
  
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Message Details Completion</span>
          <span className="text-sm text-gray-500">{completionScore}%</span>
        </div>
        <Progress value={completionScore} className="h-2" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="suggestions">
            Smart AI
            {smartSuggestions.length > 0 && (
              <Badge className="ml-1 bg-green-600 text-xs">{smartSuggestions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          {/* Enhanced recipient name field */}
          <OptimizedFormField
            name="recipientName"
            label="Who is this video for?"
            value={data.recipientName || ""}
            onChange={(value) => handleInputChange("recipientName", value)}
            type="given-name"
            required
            placeholder="e.g., John Smith, Mom, The Johnson Family"
            helper="The creator will mention this name in the video"
            maxLength={50}
            icon={User}
            config={{
              autoComplete: true,
              smartSuggestions: true,
              autoValidate: true,
              errorRecovery: true
            }}
            error={errors?.recipientName}
          />
          
          {/* Enhanced from name field */}
          <OptimizedFormField
            name="fromName"
            label="Your name"
            value={data.fromName || ""}
            onChange={(value) => handleInputChange("fromName", value)}
            type="given-name"
            required
            placeholder="How should the creator address you?"
            helper="This is how the creator will refer to you in the message"
            maxLength={50}
            icon={User}
            config={{
              autoComplete: true,
              smartSuggestions: true,
              autoValidate: true
            }}
            error={errors?.fromName}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Enhanced relationship field with categories */}
            {visibleFields.has("relationship") && (
              <div className="space-y-2">
                <Label htmlFor="relationship">
                  Relationship
                  <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                </Label>
                <Select
                  value={data.relationship || ""}
                  onValueChange={(value) => updateData({ relationship: value })}
                >
                  <SelectTrigger id="relationship">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(relationshipCategories).map(([category, relationships]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-sm font-medium text-gray-500 border-b">
                          {category}
                        </div>
                        {relationships.map(rel => (
                          <SelectItem key={rel} value={rel.toLowerCase()}>
                            {rel}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Enhanced pronouns field */}
            {visibleFields.has("pronouns") && (
              <div className="space-y-2">
                <Label htmlFor="pronouns">
                  Pronouns
                  <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                </Label>
                <Select
                  value={data.pronouns || ""}
                  onValueChange={(value) => updateData({ pronouns: value })}
                >
                  <SelectTrigger id="pronouns">
                    <SelectValue placeholder="Select pronouns" />
                  </SelectTrigger>
                  <SelectContent>
                    {pronounOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-gray-500">{option.usage}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Enhanced instructions field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="instructions">
                Instructions for the creator
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateAISuggestion}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  AI Suggest
                </Button>
                {data.instructions && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(data.instructions)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <OptimizedFormField
              name="instructions"
              label=""
              value={data.instructions || ""}
              onChange={(value) => handleInputChange("instructions", value)}
              type="textarea"
              required
              placeholder="What would you like the creator to say? Include any specific details, inside jokes, or special messages..."
              helper="Be specific about names, dates, and special moments. Include 2-3 things you want mentioned."
              maxLength={500}
              icon={MessageSquare}
              config={{
                smartSuggestions: true,
                autoValidate: true,
                errorRecovery: true
              }}
              context={{
                occasion: data.occasion,
                recipientName: data.recipientName,
                relationship: data.relationship
              }}
              error={errors?.instructions}
            />
            
            <div className="flex justify-between text-xs">
              <span className={cn(
                "text-gray-500",
                characterCount.instructions > 450 && "text-orange-500",
                characterCount.instructions >= 500 && "text-red-500"
              )}>
                {characterCount.instructions}/500 characters
              </span>
              {characterCount.instructions < 20 && (
                <span className="text-orange-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Add more details for better results
                </span>
              )}
            </div>
          </div>
          
          {/* Enhanced special details field */}
          {visibleFields.has("specialDetails") && (
            <OptimizedFormField
              name="specialDetails"
              label="Special details (Optional)"
              value={data.specialDetails || ""}
              onChange={(value) => handleInputChange("specialDetails", value)}
              type="textarea"
              placeholder="Any inside jokes, shared memories, hobbies, or other details that would make this more personal..."
              helper="Inside jokes, memories, interests that make this unique"
              maxLength={300}
              icon={Heart}
              config={{
                smartSuggestions: true
              }}
            />
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 mt-4">
          {occasionTemplates ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <occasionTemplates.icon className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">{occasionTemplates.title} Templates</h3>
                <Badge variant="secondary" className="text-xs">
                  {occasionTemplates.templates.length} available
                </Badge>
              </div>
              
              <div className="space-y-3">
                {occasionTemplates.templates.map((template) => (
                  <Card
                    key={template.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedTemplate === template.id
                        ? "ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20"
                        : "hover:shadow-md"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.label}</h4>
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {template.popularity}% choose this
                          </Badge>
                        </div>
                        {selectedTemplate === template.id && (
                          <Badge className="bg-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.template}
                        </p>
                        
                        {/* Template variations */}
                        {template.variations && template.variations.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-500">Variations:</span>
                            {template.variations.map((variation, index) => (
                              <p key={index} className="text-xs text-gray-500 pl-2 border-l-2 border-gray-200">
                                {variation}
                              </p>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {template.tokens.map(token => (
                              <Badge key={token} variant="secondary" className="text-xs">
                                {token}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => applyTemplate(template.id, 0)}
                            >
                              Use Original
                            </Button>
                            {template.variations && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => applyTemplate(template.id, Math.floor(Math.random() * template.variations!.length))}
                              >
                                <Shuffle className="h-3 w-3 mr-1" />
                                Variation
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No templates available for custom occasions
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Use the Smart AI tab for personalized suggestions
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="prompts" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="font-medium">Writing Prompts</h3>
              <Badge variant="secondary" className="text-xs">
                Get inspired
              </Badge>
            </div>
            
            {enhancedWritingPrompts.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h4 className="font-medium text-sm text-gray-600 border-b pb-1">
                  {category.category}
                </h4>
                
                <div className="grid grid-cols-1 gap-2">
                  {category.prompts.map((prompt, index) => {
                    const Icon = prompt.icon
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          const currentInstructions = data.instructions || ""
                          const promptText = `\n\n${prompt.prompt} `
                          handleInputChange(
                            "instructions",
                            currentInstructions + promptText
                          )
                          setActiveTab("details")
                        }}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all text-left"
                      >
                        <Icon className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{prompt.prompt}</p>
                          {prompt.examples && (
                            <p className="text-xs text-gray-500 mt-1">
                              Examples: {prompt.examples.join(", ")}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            ))}
            
            {/* Popular requests section */}
            <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Popular Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {popularRequests.map((request, index) => (
                  <p key={index} className="text-sm flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    {request}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium">Smart AI Suggestions</h3>
              <Badge className="bg-purple-600 text-xs">
                Powered by AI
              </Badge>
            </div>
            
            {smartSuggestions.length > 0 ? (
              <div className="space-y-3">
                {smartSuggestions.map((suggestion, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.confidence}% match
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {suggestion.source.replace('_', ' ')}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            updateData({ instructions: suggestion.content })
                            setCharacterCount(prev => ({
                              ...prev,
                              instructions: suggestion.content.length
                            }))
                            toast.success("Suggestion applied!")
                          }}
                        >
                          Use This
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion.content}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Target className="h-3 w-3" />
                          {suggestion.confidence}% confidence
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No smart suggestions available yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Fill in more details to get personalized suggestions
                </p>
              </div>
            )}
            
            {/* AI Tips */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Enhancement Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm flex items-start gap-2">
                  <Zap className="h-3 w-3 text-purple-600 mt-1 flex-shrink-0" />
                  More details = better AI suggestions
                </p>
                <p className="text-sm flex items-start gap-2">
                  <Users2 className="h-3 w-3 text-purple-600 mt-1 flex-shrink-0" />
                  Relationship context improves personalization
                </p>
                <p className="text-sm flex items-start gap-2">
                  <Clock className="h-3 w-3 text-purple-600 mt-1 flex-shrink-0" />
                  AI learns from popular successful messages
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Enhanced completion status */}
      <AnimatePresence>
        {completionScore >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800 dark:text-green-200">
                  Message details complete! 🎉
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  For: {data.recipientName} • From: {data.fromName}
                  {data.relationship && ` • ${data.relationship}`}
                  {data.pronouns && ` • ${data.pronouns}`}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  {characterCount.instructions} characters • Ready for review
                </p>
              </div>
              <Badge className="bg-green-600">
                <Trophy className="h-3 w-3 mr-1" />
                Perfect!
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}