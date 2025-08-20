"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Star,
  Upload,
  X,
  Camera,
  Video,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Award,
  MessageSquare,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

export interface ReviewFormData {
  rating: number
  categoryRatings: {
    quality: number
    communication: number
    deliveryTime: number
    value: number
  }
  occasion?: string
  message: string
  media?: File[]
  wouldRecommend: boolean
}

interface ReviewFormProps {
  creatorName: string
  bookingId?: string
  onSubmit: (data: ReviewFormData) => Promise<void>
  onCancel?: () => void
  className?: string
}

// Star rating component
function StarRating({
  value,
  onChange,
  size = "default",
  label,
  icon
}: {
  value: number
  onChange: (value: number) => void
  size?: "small" | "default" | "large"
  label?: string
  icon?: React.ReactNode
}) {
  const [hover, setHover] = React.useState(0)

  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-6 w-6",
    large: "h-8 w-8"
  }

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <Label className="text-sm">{label}</Label>
        </div>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                (hover || value) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-gray-400"
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-gray-600">
            {value === 5 && "Excellent"}
            {value === 4 && "Good"}
            {value === 3 && "Average"}
            {value === 2 && "Poor"}
            {value === 1 && "Terrible"}
          </span>
        )}
      </div>
    </div>
  )
}

// Media upload component
function MediaUpload({
  files,
  onChange,
  maxFiles = 5
}: {
  files: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = React.useState<string[]>([])

  React.useEffect(() => {
    // Generate previews for image files
    const newPreviews: string[] = []
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          setPreviews([...newPreviews])
        }
        reader.readAsDataURL(file)
      }
    })

    return () => {
      // Clean up previews
      previews.forEach(URL.revokeObjectURL)
    }
  }, [files])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter(file => {
      const isValid = file.type.startsWith('image/') || file.type.startsWith('video/')
      const isUnderLimit = file.size < 50 * 1024 * 1024 // 50MB limit
      return isValid && isUnderLimit
    })

    if (files.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    onChange([...files, ...validFiles])
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Add Photos or Videos (Optional)</Label>
        <span className="text-xs text-gray-500">
          {files.length}/{maxFiles} files
        </span>
      </div>

      {/* Upload Button */}
      {files.length < maxFiles && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              {file.type.startsWith('image/') && previews[index] ? (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-2 text-center">
                  {file.type.startsWith('video/') ? (
                    <Video className="h-8 w-8 text-gray-400 mb-1" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-1" />
                  )}
                  <span className="text-xs text-gray-500 line-clamp-1">
                    {file.name}
                  </span>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Accepted formats: JPG, PNG, GIF, MP4, MOV (max 50MB each)
      </p>
    </div>
  )
}

// Review guidelines component
function ReviewGuidelines() {
  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Review Guidelines
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Mention specific details about your experience</li>
              <li>• Keep it respectful and professional</li>
              <li>• Add photos or videos to help others</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main review form component
export function ReviewForm({
  creatorName,
  bookingId,
  onSubmit,
  onCancel,
  className
}: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState<ReviewFormData>({
    rating: 0,
    categoryRatings: {
      quality: 0,
      communication: 0,
      deliveryTime: 0,
      value: 0
    },
    message: "",
    media: [],
    wouldRecommend: true
  })

  const occasions = [
    "Birthday",
    "Anniversary",
    "Graduation",
    "Wedding",
    "Holiday",
    "Congratulations",
    "Get Well",
    "Motivation",
    "Other"
  ]

  const isStep1Valid = formData.rating > 0
  const isStep2Valid = Object.values(formData.categoryRatings).every(r => r > 0)
  const isStep3Valid = formData.message.length >= 20

  const handleSubmit = async () => {
    if (!isStep3Valid) {
      toast.error("Please complete all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      toast.success("Thank you for your review!")
    } catch (error) {
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / 3) * 100

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Review Your Experience</CardTitle>
        <CardDescription>
          Share your experience with {creatorName}
        </CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Overall Rating */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">
                  How was your overall experience?
                </h3>
                <StarRating
                  value={formData.rating}
                  onChange={(rating) => setFormData({ ...formData, rating })}
                  size="large"
                />
              </div>

              <div className="space-y-4">
                <Label>What was the occasion?</Label>
                <Select
                  value={formData.occasion}
                  onValueChange={(occasion) => setFormData({ ...formData, occasion })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasions.map((occasion) => (
                      <SelectItem key={occasion} value={occasion}>
                        {occasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStep1Valid}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Category Ratings */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium">Rate specific aspects</h3>
              
              <div className="space-y-4">
                <StarRating
                  value={formData.categoryRatings.quality}
                  onChange={(quality) => setFormData({
                    ...formData,
                    categoryRatings: { ...formData.categoryRatings, quality }
                  })}
                  label="Video Quality"
                  icon={<Award className="h-4 w-4 text-purple-500" />}
                />

                <StarRating
                  value={formData.categoryRatings.communication}
                  onChange={(communication) => setFormData({
                    ...formData,
                    categoryRatings: { ...formData.categoryRatings, communication }
                  })}
                  label="Communication"
                  icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
                />

                <StarRating
                  value={formData.categoryRatings.deliveryTime}
                  onChange={(deliveryTime) => setFormData({
                    ...formData,
                    categoryRatings: { ...formData.categoryRatings, deliveryTime }
                  })}
                  label="Delivery Time"
                  icon={<Clock className="h-4 w-4 text-green-500" />}
                />

                <StarRating
                  value={formData.categoryRatings.value}
                  onChange={(value) => setFormData({
                    ...formData,
                    categoryRatings: { ...formData.categoryRatings, value }
                  })}
                  label="Value for Money"
                  icon={<DollarSign className="h-4 w-4 text-yellow-500" />}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!isStep2Valid}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Written Review & Media */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">
                    Tell others about your experience
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What did you love? What could be improved?"
                    className="min-h-[120px] mt-2"
                  />
                  <div className="flex justify-between mt-1">
                    <span className={cn(
                      "text-xs",
                      formData.message.length < 20 ? "text-red-500" : "text-gray-500"
                    )}>
                      {formData.message.length < 20 
                        ? `${20 - formData.message.length} more characters needed`
                        : `${formData.message.length} characters`
                      }
                    </span>
                    {formData.message.length >= 100 && (
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Detailed Review
                      </Badge>
                    )}
                  </div>
                </div>

                <MediaUpload
                  files={formData.media || []}
                  onChange={(media) => setFormData({ ...formData, media })}
                />

                <div className="space-y-3">
                  <Label>Would you recommend {creatorName}?</Label>
                  <RadioGroup
                    value={formData.wouldRecommend ? "yes" : "no"}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      wouldRecommend: value === "yes"
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes, definitely!</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No, I wouldn't</Label>
                    </div>
                  </RadioGroup>
                </div>

                <ReviewGuidelines />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isStep3Valid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Review prompt dialog
export function ReviewPromptDialog({
  creatorName,
  bookingId,
  onSubmit
}: {
  creatorName: string
  bookingId: string
  onSubmit: (data: ReviewFormData) => Promise<void>
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Star className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Your Experience</DialogTitle>
          <DialogDescription>
            Help others by sharing your experience with {creatorName}
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          creatorName={creatorName}
          bookingId={bookingId}
          onSubmit={async (data) => {
            await onSubmit(data)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}