"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { StepComponentProps } from "../multi-step-wizard"

// Message templates by occasion
const messageTemplates = {
  birthday: {
    title: "Birthday Wishes",
    icon: Gift,
    templates: [
      {
        id: "birthday_classic",
        label: "Classic Birthday",
        template: "Please wish [Name] a happy [Age]th birthday! They're a huge fan of yours and would love to hear about [specific topic]. Make it personal and fun!",
        tokens: ["Name", "Age", "specific topic"]
      },
      {
        id: "birthday_milestone",
        label: "Milestone Birthday",
        template: "It's [Name]'s big [Age]! They've been following you since [time period]. Please share some wisdom about entering this new decade and mention their love for [interest].",
        tokens: ["Name", "Age", "time period", "interest"]
      },
      {
        id: "birthday_surprise",
        label: "Surprise Party",
        template: "We're surprising [Name] for their birthday! They think this is just a regular day. Please act surprised and excited when you 'find out' it's their birthday. They love [hobby]!",
        tokens: ["Name", "hobby"]
      }
    ]
  },
  anniversary: {
    title: "Anniversary Messages",
    icon: Heart,
    templates: [
      {
        id: "anniversary_wedding",
        label: "Wedding Anniversary",
        template: "Please congratulate [Names] on their [Number] year anniversary! They met at [location/event] and would love if you mentioned [special memory]. Make it romantic!",
        tokens: ["Names", "Number", "location/event", "special memory"]
      },
      {
        id: "anniversary_dating",
        label: "Dating Anniversary",
        template: "Help [Name1] surprise [Name2] for their anniversary! They've been together [time] and share a love for [shared interest]. [Name2] is your biggest fan!",
        tokens: ["Name1", "Name2", "time", "shared interest"]
      }
    ]
  },
  graduation: {
    title: "Graduation",
    icon: GraduationCap,
    templates: [
      {
        id: "graduation_college",
        label: "College Graduation",
        template: "[Name] just graduated from [School] with a degree in [Major]! They're heading to [next step]. Please share advice and congratulate them on this achievement!",
        tokens: ["Name", "School", "Major", "next step"]
      },
      {
        id: "graduation_high_school",
        label: "High School Graduation",
        template: "Congratulate [Name] on graduating high school! They're going to [College/Plan] and would love encouragement. They've overcome [challenge] to get here.",
        tokens: ["Name", "College/Plan", "challenge"]
      }
    ]
  },
  get_well: {
    title: "Get Well Soon",
    icon: Heart,
    templates: [
      {
        id: "get_well_general",
        label: "General Get Well",
        template: "Please send get well wishes to [Name]. They're recovering from [situation] and could use encouragement. They love your [specific work/content].",
        tokens: ["Name", "situation", "specific work/content"]
      },
      {
        id: "get_well_surgery",
        label: "Post-Surgery",
        template: "[Name] just had surgery and is recovering. Your videos always make them smile! Please send positive vibes and maybe share a funny story to lift their spirits.",
        tokens: ["Name"]
      }
    ]
  },
  just_because: {
    title: "Just Because",
    icon: Smile,
    templates: [
      {
        id: "just_because_fan",
        label: "Biggest Fan",
        template: "[Name] is your biggest fan! They've been following you since [time] and always talk about [favorite thing about you]. Just wanted to surprise them!",
        tokens: ["Name", "time", "favorite thing about you"]
      },
      {
        id: "just_because_cheer",
        label: "Cheer Up",
        template: "[Name] has been going through a tough time with [situation]. They could really use some encouragement and positivity from their favorite creator!",
        tokens: ["Name", "situation"]
      }
    ]
  }
}

// Writing prompts to help users
const writingPrompts = [
  { icon: User, prompt: "What makes this person special to you?" },
  { icon: Star, prompt: "Any recent achievements to celebrate?" },
  { icon: Heart, prompt: "What do they love about this creator?" },
  { icon: Music, prompt: "Favorite songs, quotes, or sayings?" },
  { icon: Smile, prompt: "Inside jokes or shared memories?" },
  { icon: Camera, prompt: "Special moments to reference?" },
  { icon: Mic, prompt: "How should the creator address them?" },
  { icon: Gift, prompt: "What would make this message perfect?" }
]

// Pronoun options
const pronounOptions = [
  { value: "they/them", label: "They/Them" },
  { value: "she/her", label: "She/Her" },
  { value: "he/him", label: "He/Him" },
  { value: "prefer_not_say", label: "Prefer not to say" }
]

// Relationship options
const relationshipSuggestions = [
  "Friend", "Best Friend", "Parent", "Mom", "Dad", 
  "Sister", "Brother", "Sibling", "Spouse", "Partner",
  "Girlfriend", "Boyfriend", "Wife", "Husband",
  "Daughter", "Son", "Child", "Grandparent", "Grandma", "Grandpa",
  "Aunt", "Uncle", "Cousin", "Niece", "Nephew",
  "Colleague", "Boss", "Employee", "Teacher", "Student",
  "Coach", "Teammate", "Mentor", "Fan"
]

export function MessageDetails({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  const [activeTab, setActiveTab] = React.useState("details")
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null)
  const [showPrompts, setShowPrompts] = React.useState(false)
  const [characterCount, setCharacterCount] = React.useState({
    instructions: data.instructions?.length || 0,
    specialDetails: data.specialDetails?.length || 0
  })
  
  // Get templates for selected occasion
  const occasionTemplates = React.useMemo(() => {
    if (!data.occasion || data.occasion === "custom") return null
    return messageTemplates[data.occasion as keyof typeof messageTemplates]
  }, [data.occasion])
  
  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = occasionTemplates?.templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      updateData({
        instructions: template.template,
        templateUsed: templateId
      })
      setCharacterCount(prev => ({
        ...prev,
        instructions: template.template.length
      }))
    }
  }
  
  // Generate AI suggestion (mock)
  const generateAISuggestion = () => {
    const suggestions = [
      `Hi! Please wish ${data.recipientName || "[Name]"} a happy ${data.occasionLabel || "special day"}! They're a huge fan and would be thrilled to hear from you. Make it personal and mention how special this day is. Thanks so much!`,
      `Could you please create a heartfelt message for ${data.recipientName || "[Name]"}? It's their ${data.occasionLabel || "special occasion"} and they absolutely love your work. Include some encouragement and make them smile!`,
      `Hey! ${data.recipientName || "[Name]"} is celebrating their ${data.occasionLabel || "big day"}! They've been following you forever and would love a personalized message. Feel free to be creative and fun with it!`
    ]
    
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    updateData({ instructions: suggestion })
    setCharacterCount(prev => ({
      ...prev,
      instructions: suggestion.length
    }))
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
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          {/* Recipient Name */}
          <div className="space-y-2">
            <Label htmlFor="recipientName">
              Who is this video for? *
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="inline h-3 w-3 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">The creator will mention this name in the video</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="recipientName"
              placeholder="e.g., John Smith, Mom, The Johnson Family"
              value={data.recipientName || ""}
              onChange={(e) => handleInputChange("recipientName", e.target.value)}
              maxLength={50}
              className={cn(errors?.recipientName && "border-red-500")}
            />
            {errors?.recipientName && (
              <p className="text-xs text-red-500">{errors.recipientName}</p>
            )}
          </div>
          
          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="fromName">
              Your name *
              <span className="text-xs text-gray-500 ml-2">
                (How the creator should address you)
              </span>
            </Label>
            <Input
              id="fromName"
              placeholder="e.g., Sarah, The Smith Family"
              value={data.fromName || ""}
              onChange={(e) => handleInputChange("fromName", e.target.value)}
              maxLength={50}
              className={cn(errors?.fromName && "border-red-500")}
            />
            {errors?.fromName && (
              <p className="text-xs text-red-500">{errors.fromName}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Relationship */}
            <div className="space-y-2">
              <Label htmlFor="relationship">
                Relationship
                <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
              </Label>
              <Input
                id="relationship"
                placeholder="e.g., Friend, Mom, Boss"
                value={data.relationship || ""}
                onChange={(e) => handleInputChange("relationship", e.target.value)}
                maxLength={30}
                list="relationship-suggestions"
              />
              <datalist id="relationship-suggestions">
                {relationshipSuggestions.map(rel => (
                  <option key={rel} value={rel} />
                ))}
              </datalist>
            </div>
            
            {/* Pronouns */}
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
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="instructions">
                Instructions for the creator *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="inline h-3 w-3 ml-1 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        Tell the creator what you'd like them to say. Be specific about 
                        any jokes, memories, or special messages you want included.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateAISuggestion}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Suggest
              </Button>
            </div>
            <Textarea
              id="instructions"
              placeholder="What would you like the creator to say? Include any specific details, inside jokes, or special messages..."
              value={data.instructions || ""}
              onChange={(e) => handleInputChange("instructions", e.target.value)}
              rows={4}
              maxLength={500}
              className={cn(errors?.instructions && "border-red-500")}
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
                <span className="text-orange-500">
                  <AlertCircle className="inline h-3 w-3 mr-1" />
                  Add more details for better results
                </span>
              )}
            </div>
            {errors?.instructions && (
              <p className="text-xs text-red-500">{errors.instructions}</p>
            )}
          </div>
          
          {/* Special Details */}
          <div className="space-y-2">
            <Label htmlFor="specialDetails">
              Special details
              <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
              <span className="text-xs text-gray-500 ml-2">
                (Inside jokes, memories, interests)
              </span>
            </Label>
            <Textarea
              id="specialDetails"
              placeholder="Any inside jokes, shared memories, hobbies, or other details that would make this more personal..."
              value={data.specialDetails || ""}
              onChange={(e) => handleInputChange("specialDetails", e.target.value)}
              rows={3}
              maxLength={300}
            />
            <div className="text-xs text-gray-500">
              {characterCount.specialDetails}/300 characters
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 mt-4">
          {occasionTemplates ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <occasionTemplates.icon className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">{occasionTemplates.title} Templates</h3>
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
                    onClick={() => applyTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{template.label}</h4>
                        {selectedTemplate === template.id && (
                          <Badge className="bg-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {template.template}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {template.tokens.map(token => (
                          <Badge key={token} variant="secondary" className="text-xs">
                            {token}
                          </Badge>
                        ))}
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
                Use the prompts tab for inspiration
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="prompts" className="space-y-4 mt-4">
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Writing Prompts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click on any prompt below to help you write better instructions
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {writingPrompts.map((prompt, index) => {
                const Icon = prompt.icon
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const currentInstructions = data.instructions || ""
                      const promptText = `\n\n${prompt.prompt} `
                      handleInputChange(
                        "instructions",
                        currentInstructions + promptText
                      )
                      setActiveTab("details")
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all text-left"
                  >
                    <Icon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm">{prompt.prompt}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
          
          {/* Tips Section */}
          <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Pro Tips for Great Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Be specific about names, dates, and special moments
              </p>
              <p className="text-sm flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Include 2-3 specific things you want mentioned
              </p>
              <p className="text-sm flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Share why this person is a fan of the creator
              </p>
              <p className="text-sm flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Keep instructions clear and concise (under 200 words)
              </p>
              <p className="text-sm flex items-start gap-2">
                <span className="text-blue-600">•</span>
                Mention any inside jokes or references they'll appreciate
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Completion Status */}
      {data.recipientName && data.fromName && data.instructions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Message details complete!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For: {data.recipientName} • From: {data.fromName}
                {data.relationship && ` • ${data.relationship}`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}