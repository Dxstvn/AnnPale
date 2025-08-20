"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AccountTypeSelector } from "./account-type-selector"
import { MultiStepForm, StepContent } from "./multi-step-form"
import { PasswordStrength } from "./password-strength"
import { SocialLogin } from "./social-login"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, Mail, Lock, Phone, Calendar, Globe, DollarSign, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { id: "account-type", title: "Account Type", description: "Choose your role" },
  { id: "basic-info", title: "Basic Info", description: "Your details" },
  { id: "additional", title: "Complete Profile", description: "Final step" },
]

const CATEGORIES = [
  "Music",
  "Comedy",
  "Sports",
  "Politics",
  "Business",
  "Art & Culture",
  "Education",
  "Lifestyle",
  "Other",
]

export function SignupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [accountType, setAccountType] = useState<"customer" | "creator" | null>(null)
  
  const [formData, setFormData] = useState({
    // Basic info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Additional info
    phone: "",
    birthDate: "",
    language: "en",
    
    // Creator specific
    stageName: "",
    category: "",
    bio: "",
    price: "",
    socialMedia: "",
    
    // Terms
    agreeToTerms: false,
    agreeToMarketing: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    
    if (currentStep === 0 && !accountType) {
      newErrors.accountType = "Please select an account type"
    }
    
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.password) newErrors.password = "Password is required"
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }
    
    if (currentStep === 2) {
      if (!formData.agreeToTerms) newErrors.terms = "You must agree to the terms"
      
      if (accountType === "creator") {
        if (!formData.stageName) newErrors.stageName = "Stage name is required"
        if (!formData.category) newErrors.category = "Category is required"
        if (!formData.price) newErrors.price = "Price is required"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep()) return
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      })
      
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <MultiStepForm steps={STEPS} currentStep={currentStep} />
      
      <form onSubmit={handleSubmit} className="mt-8">
        {/* Step 1: Account Type */}
        {currentStep === 0 && (
          <StepContent>
            <AccountTypeSelector
              selected={accountType}
              onSelect={setAccountType}
            />
            {errors.accountType && (
              <p className="text-sm text-red-500 mt-2 text-center">{errors.accountType}</p>
            )}
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                onClick={handleNext}
                disabled={!accountType}
                size="lg"
                variant="primary"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </StepContent>
        )}

        {/* Step 2: Basic Information */}
        {currentStep === 1 && (
          <StepContent>
            <Card>
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                  Enter your information to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      leftIcon={<User className="h-4 w-4" />}
                      error={errors.firstName}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      leftIcon={<User className="h-4 w-4" />}
                      error={errors.lastName}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.password}
                    required
                  />
                  <PasswordStrength password={formData.password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.confirmPassword}
                    required
                  />
                </div>

                <SocialLogin />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  variant="primary"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </StepContent>
        )}

        {/* Step 3: Additional Information */}
        {currentStep === 2 && (
          <StepContent>
            <Card>
              <CardHeader>
                <CardTitle>Complete your profile</CardTitle>
                <CardDescription>
                  {accountType === "creator" 
                    ? "Tell us about your creator profile"
                    : "Just a few more details"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accountType === "creator" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="stageName">Stage Name / Brand Name</Label>
                      <Input
                        id="stageName"
                        value={formData.stageName}
                        onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                        error={errors.stageName}
                        placeholder="How fans will know you"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select your category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-500">{errors.category}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell fans about yourself..."
                        rows={4}
                        maxLength={500}
                        showCount
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Starting Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        leftIcon={<DollarSign className="h-4 w-4" />}
                        error={errors.price}
                        placeholder="50"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      leftIcon={<Phone className="h-4 w-4" />}
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger id="language">
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ht">Kreyòl Ayisyen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeToTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-500">{errors.terms}</p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeToMarketing: checked as boolean })
                      }
                    />
                    <Label htmlFor="marketing" className="text-sm font-normal">
                      Send me updates about Ann Pale and special offers
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading || !formData.agreeToTerms}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </StepContent>
        )}
      </form>
    </div>
  )
}