"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Video, 
  ChevronLeft, 
  ChevronRight,
  Cake, 
  Heart, 
  Trophy, 
  Sparkles, 
  Star, 
  Gift, 
  MessageSquare,
  Zap,
  Shield,
  Info,
  User,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Creator {
  id: string
  name: string
  category: string
  avatar: string
  responseTime: string
}

interface FormData {
  occasion: string
  recipientName: string
  recipientRelation: string
  instructions: string
  rushDelivery: boolean
  privateVideo: boolean
}

interface VideoDetailsFormProps {
  creator: Creator
  onBack?: () => void
  onContinue?: (data: FormData) => void
  className?: string
}

const occasions = [
  { id: "birthday", label: "Birthday", icon: Cake, popular: true },
  { id: "anniversary", label: "Anniversary", icon: Heart, popular: true },
  { id: "graduation", label: "Graduation", icon: Trophy, popular: true },
  { id: "motivation", label: "Motivation", icon: Sparkles, popular: false },
  { id: "congratulations", label: "Congratulations", icon: Star, popular: false },
  { id: "get-well", label: "Get Well", icon: Heart, popular: false },
  { id: "holiday", label: "Holiday", icon: Gift, popular: false },
  { id: "custom", label: "Custom Message", icon: MessageSquare, popular: false },
]

const relationships = [
  "Family Member",
  "Friend", 
  "Partner/Spouse",
  "Colleague",
  "Employee",
  "Boss",
  "Client",
  "Student",
  "Teacher",
  "Other"
]

export function VideoDetailsForm({ 
  creator, 
  onBack, 
  onContinue,
  className 
}: VideoDetailsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    occasion: "",
    recipientName: "",
    recipientRelation: "",
    instructions: "",
    rushDelivery: false,
    privateVideo: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const characterCount = formData.instructions.length
  const maxCharacters = 500

  const validateField = (name: keyof FormData, value: string | boolean) => {
    const newErrors: Record<string, string> = {}

    switch (name) {
      case 'occasion':
        if (!value) {
          newErrors.occasion = 'Please select an occasion'
        }
        break
      case 'recipientName':
        if (!value || (value as string).trim().length === 0) {
          newErrors.recipientName = 'Recipient name is required'
        } else if ((value as string).trim().length < 2) {
          newErrors.recipientName = 'Name must be at least 2 characters'
        }
        break
      case 'recipientRelation':
        if (!value) {
          newErrors.recipientRelation = 'Please select your relationship'
        }
        break
      case 'instructions':
        if (!value || (value as string).trim().length === 0) {
          newErrors.instructions = 'Instructions are required'
        } else if ((value as string).trim().length < 10) {
          newErrors.instructions = 'Instructions must be at least 10 characters'
        }
        break
    }

    setErrors(prev => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = <K extends keyof FormData>(
    name: K, 
    value: FormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = () => {
    // Validate all fields
    const fieldsToValidate: (keyof FormData)[] = ['occasion', 'recipientName', 'recipientRelation', 'instructions']
    let isValid = true

    fieldsToValidate.forEach(field => {
      const valid = validateField(field, formData[field])
      if (!valid) isValid = false
    })

    if (isValid) {
      onContinue?.(formData)
    }
  }

  const isFormValid = formData.occasion && 
                     formData.recipientName.trim() && 
                     formData.recipientRelation && 
                     formData.instructions.trim().length >= 10

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Video className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Video Request Details</CardTitle>
            <CardDescription className="text-base mt-1">
              Provide details for your personalized video message
            </CardDescription>
          </div>
        </div>

        {/* Creator Info Alert */}
        <Alert className="border-purple-200 bg-purple-50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={creator.avatar} alt={`${creator.name}'s avatar`} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-purple-900">Creating video with {creator.name}</p>
              <p className="text-sm text-purple-700 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Typical delivery: {creator.responseTime}
              </p>
            </div>
          </div>
        </Alert>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Occasion Selection */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">What's the occasion? *</legend>
          <div 
            role="radiogroup" 
            aria-labelledby="occasion-label"
            aria-describedby={errors.occasion ? "occasion-error" : "occasion-help"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {occasions.map((occasion) => {
              const Icon = occasion.icon
              const isSelected = formData.occasion === occasion.id
              
              return (
                <label
                  key={occasion.id}
                  className={cn(
                    "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md",
                    "focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2",
                    isSelected 
                      ? "border-purple-600 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  )}
                  htmlFor={`occasion-${occasion.id}`}
                >
                  <input
                    type="radio"
                    id={`occasion-${occasion.id}`}
                    name="occasion"
                    value={occasion.id}
                    checked={isSelected}
                    onChange={(e) => handleInputChange('occasion', e.target.value)}
                    className="sr-only"
                    aria-describedby={errors.occasion ? "occasion-error" : undefined}
                  />
                  <Icon 
                    className={cn(
                      "h-8 w-8",
                      isSelected ? "text-purple-600" : "text-gray-600"
                    )} 
                  />
                  <span className={cn(
                    "text-sm font-medium text-center",
                    isSelected ? "text-purple-900" : "text-gray-700"
                  )}>
                    {occasion.label}
                  </span>
                  {occasion.popular && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                      Popular
                    </Badge>
                  )}
                </label>
              )
            })}
          </div>
          <div id="occasion-help" className="sr-only">Select the occasion for your video message</div>
          {errors.occasion && (
            <div id="occasion-error" className="text-red-600 text-sm" role="alert">
              {errors.occasion}
            </div>
          )}
        </fieldset>

        {/* Recipient Details */}
        <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <legend className="sr-only">Recipient Information</legend>
          <div className="space-y-2">
            <Label htmlFor="recipient-name" className="text-sm font-medium">
              Who is this video for? *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="recipient-name"
                type="text"
                placeholder="Recipient's name"
                value={formData.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                onBlur={() => validateField('recipientName', formData.recipientName)}
                onFocus={() => setFocusedField('recipientName')}
                className={cn(
                  "pl-10",
                  errors.recipientName && "border-red-500 focus:ring-red-500",
                  focusedField === 'recipientName' && "ring-2 ring-purple-500"
                )}
                aria-invalid={!!errors.recipientName}
                aria-describedby={errors.recipientName ? "recipient-name-error" : "recipient-name-help"}
                autoComplete="name"
                required
              />
            </div>
            <div id="recipient-name-help" className="text-xs text-gray-500">
              The person who will receive this video message
            </div>
            {errors.recipientName && (
              <div id="recipient-name-error" className="text-red-600 text-sm" role="alert">
                {errors.recipientName}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-relation" className="text-sm font-medium">
              Their relationship to you *
            </Label>
            <Select 
              value={formData.recipientRelation} 
              onValueChange={(value) => handleInputChange('recipientRelation', value)}
            >
              <SelectTrigger 
                id="recipient-relation"
                className={cn(
                  errors.recipientRelation && "border-red-500 focus:ring-red-500"
                )}
                aria-invalid={!!errors.recipientRelation}
                aria-describedby={errors.recipientRelation ? "relation-error" : "relation-help"}
                aria-label="Select your relationship to the recipient"
              >
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationships.map((relation) => (
                  <SelectItem key={relation} value={relation.toLowerCase().replace(/\s+/g, '-')}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div id="relation-help" className="text-xs text-gray-500">
              This helps the creator personalize the message
            </div>
            {errors.recipientRelation && (
              <div id="relation-error" className="text-red-600 text-sm" role="alert">
                {errors.recipientRelation}
              </div>
            )}
          </div>
        </fieldset>

        {/* Instructions */}
        <div className="space-y-2">
          <Label htmlFor="instructions" className="text-lg font-semibold">
            Instructions for {creator.name} *
          </Label>
          <Textarea
            id="instructions"
            placeholder="Tell the creator what you'd like them to say, any inside jokes, pronunciations, or special requests..."
            value={formData.instructions}
            onChange={(e) => handleInputChange('instructions', e.target.value)}
            onBlur={() => validateField('instructions', formData.instructions)}
            onFocus={() => setFocusedField('instructions')}
            className={cn(
              "min-h-[120px] resize-none",
              errors.instructions && "border-red-500 focus:ring-red-500",
              focusedField === 'instructions' && "ring-2 ring-purple-500"
            )}
            maxLength={maxCharacters}
            rows={6}
            aria-invalid={!!errors.instructions}
            aria-describedby={errors.instructions ? "instructions-error" : "instructions-help"}
            required
          />
          <div className="flex justify-between items-center">
            <div id="instructions-help" className="text-xs text-gray-500">
              Be specific! Include names, relationships, and what you'd like mentioned
            </div>
            <div className={cn(
              "text-sm",
              characterCount > maxCharacters * 0.9 ? "text-red-600" : "text-gray-600"
            )}>
              {characterCount}/{maxCharacters} characters
            </div>
          </div>
          {errors.instructions && (
            <div id="instructions-error" className="text-red-600 text-sm" role="alert">
              {errors.instructions}
            </div>
          )}
        </div>

        {/* Delivery Options */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Delivery Options</legend>
          
          <div className="space-y-3">
            {/* Rush Delivery */}
            <label 
              className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
              htmlFor="rush-delivery"
            >
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <div>
                  <p className="font-medium">Rush Delivery</p>
                  <p className="text-sm text-gray-600">Get your video within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-purple-600" aria-label="Additional cost: $25">+$25</span>
                <input
                  type="checkbox"
                  id="rush-delivery"
                  checked={formData.rushDelivery}
                  onChange={(e) => handleInputChange('rushDelivery', e.target.checked)}
                  className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  aria-describedby="rush-delivery-help"
                />
              </div>
            </label>
            <div id="rush-delivery-help" className="text-xs text-gray-500 ml-8">
              Priority handling for faster delivery
            </div>

            {/* Private Video */}
            <label 
              className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
              htmlFor="private-video"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-500" aria-hidden="true" />
                <div>
                  <p className="font-medium">Private Video</p>
                  <p className="text-sm text-gray-600">Only you can view this video</p>
                </div>
              </div>
              <input
                type="checkbox"
                id="private-video"
                checked={formData.privateVideo}
                onChange={(e) => handleInputChange('privateVideo', e.target.checked)}
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                aria-describedby="private-video-help"
              />
            </label>
            <div id="private-video-help" className="text-xs text-gray-500 ml-8">
              Video won't be shared publicly or used for promotion
            </div>
          </div>
        </fieldset>

        {/* Guidelines */}
        <Alert className="border-blue-200 bg-blue-50" role="region" aria-labelledby="tips-heading">
          <Info className="h-4 w-4 text-blue-600" aria-hidden="true" />
          <AlertDescription className="text-blue-800">
            <strong id="tips-heading">Tips for great videos:</strong> Be specific about names, relationships, and special moments you'd like mentioned. 
            Include pronunciation guides for unusual names. The more detail you provide, the better your personalized video will be!
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
        >
          Continue to Review
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}