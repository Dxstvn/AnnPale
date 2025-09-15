"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Users, Video, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { useToast } from "@/components/ui/use-toast"

// Password validation helper
const validatePassword = (password: string): string | null => {
  if (password.length < 6) return "Password must be at least 6 characters"
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter"
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter"
  if (!/[0-9]/.test(password)) return "Password must contain at least one number"
  if (!/[^a-zA-Z0-9]/.test(password)) return "Password must contain at least one special character"
  return null
}

export default function SignUpPage() {
  const [customerForm, setCustomerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [creatorForm, setCreatorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    category: "",
    bio: "",
    price: "",
    socialMedia: "",
    agreeToTerms: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("customer")
  
  const { signup, loginWithProvider } = useSupabaseAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password strength
    const passwordError = validatePassword(customerForm.password)
    if (passwordError) {
      toast({
        title: "Invalid password",
        description: passwordError,
        variant: "destructive",
      })
      return
    }
    
    if (customerForm.password !== customerForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (!customerForm.agreeToTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the Terms of Service and Privacy Policy.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const fullName = `${customerForm.firstName} ${customerForm.lastName}`.trim()
      const result = await signup(
        customerForm.email, 
        customerForm.password, 
        fullName,
        'fan'
      )
      
      if (result.error) {
        toast({
          title: "Signup failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Welcome to Ann Pale!",
          description: "Your account has been created successfully.",
          variant: "success"
        })
        router.push('/fan/dashboard')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creator form submission started')
    console.log('Form data:', creatorForm)

    // Validate password strength
    const passwordError = validatePassword(creatorForm.password)
    if (passwordError) {
      console.error('Password validation failed:', passwordError)
      toast({
        title: "Invalid password",
        description: passwordError,
        variant: "destructive",
      })
      return
    }

    if (creatorForm.password !== creatorForm.confirmPassword) {
      console.error('Password mismatch:', {
        password: creatorForm.password,
        confirmPassword: creatorForm.confirmPassword
      })
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (!creatorForm.agreeToTerms) {
      console.error('Terms not accepted')
      toast({
        title: "Terms not accepted",
        description: "Please accept the Terms of Service and Creator Agreement.",
        variant: "destructive",
      })
      return
    }

    console.log('All validations passed, starting signup...')
    setIsLoading(true)

    try {
      const fullName = `${creatorForm.firstName} ${creatorForm.lastName}`.trim()
      const metadata = {
        firstName: creatorForm.firstName,
        lastName: creatorForm.lastName,
        displayName: creatorForm.displayName || fullName,
        category: creatorForm.category,
        bio: creatorForm.bio,
        pricePerVideo: creatorForm.price,
        socialMedia: creatorForm.socialMedia
      }

      const result = await signup(
        creatorForm.email,
        creatorForm.password,
        fullName,
        'creator',
        metadata
      )
      
      if (result.error) {
        toast({
          title: "Application failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Application submitted!",
          description: "Your creator application has been submitted for review.",
          variant: "success"
        })
        router.push('/creator/dashboard')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignup = async (provider: 'google' | 'twitter') => {
    setOauthLoading(provider)
    try {
      // Pass the role based on which tab is active
      const role = activeTab === 'creator' ? 'creator' : 'fan'
      await loginWithProvider(provider, { role })
    } catch (error) {
      toast({
        title: "Signup failed",
        description: `Failed to sign up with ${provider}. Please try again.`,
        variant: "destructive",
      })
      setOauthLoading(null)
    }
  }

  const OAuthButtons = () => (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleOAuthSignup('google')}
          disabled={isLoading || oauthLoading !== null}
        >
          {oauthLoading === 'google' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleOAuthSignup('twitter')}
          disabled={isLoading || oauthLoading !== null}
        >
          {oauthLoading === 'twitter' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          X
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>🎤</span>
                <span>Ann Pale</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Already have an account?</span>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Ann Pale</h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with your favorite Haitian creators or become one yourself
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="customer" className="text-lg py-3">
                <Users className="h-5 w-5 mr-2" />
                Sign up as Fan
              </TabsTrigger>
              <TabsTrigger value="creator" className="text-lg py-3">
                <Video className="h-5 w-5 mr-2" />
                Become a Creator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Customer Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Create Your Account</CardTitle>
                    <p className="text-gray-600">Start booking personalized videos from your favorite creators</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCustomerSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customer-firstName">First Name</Label>
                          <Input
                            id="customer-firstName"
                            value={customerForm.firstName}
                            onChange={(e) => setCustomerForm({ ...customerForm, firstName: e.target.value })}
                            required
                            disabled={isLoading || oauthLoading !== null}
                          />
                        </div>
                        <div>
                          <Label htmlFor="customer-lastName">Last Name</Label>
                          <Input
                            id="customer-lastName"
                            value={customerForm.lastName}
                            onChange={(e) => setCustomerForm({ ...customerForm, lastName: e.target.value })}
                            required
                            disabled={isLoading || oauthLoading !== null}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="customer-email">Email</Label>
                        <Input
                          id="customer-email"
                          type="email"
                          value={customerForm.email}
                          onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                          required
                          disabled={isLoading || oauthLoading !== null}
                        />
                      </div>

                      <div>
                        <Label htmlFor="customer-password">Password</Label>
                        <Input
                          id="customer-password"
                          type="password"
                          value={customerForm.password}
                          onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                          required
                          disabled={isLoading || oauthLoading !== null}
                        />
                      </div>

                      <div>
                        <Label htmlFor="customer-confirmPassword">Confirm Password</Label>
                        <Input
                          id="customer-confirmPassword"
                          type="password"
                          value={customerForm.confirmPassword}
                          onChange={(e) => setCustomerForm({ ...customerForm, confirmPassword: e.target.value })}
                          required
                          disabled={isLoading || oauthLoading !== null}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customer-terms"
                          checked={customerForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setCustomerForm({ ...customerForm, agreeToTerms: checked as boolean })
                          }
                          disabled={isLoading || oauthLoading !== null}
                        />
                        <Label htmlFor="customer-terms" className="text-sm">
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

                      <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700" 
                        size="lg"
                        disabled={isLoading || oauthLoading !== null}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>

                    <div className="mt-6">
                      <OAuthButtons />
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Benefits */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Why join as a fan?</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Star className="h-5 w-5 text-yellow-500 mt-1" />
                          <div>
                            <h4 className="font-medium">Exclusive Access</h4>
                            <p className="text-gray-600 text-sm">
                              Get personalized videos from your favorite Haitian celebrities and creators
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Video className="h-5 w-5 text-purple-500 mt-1" />
                          <div>
                            <h4 className="font-medium">Perfect Gifts</h4>
                            <p className="text-gray-600 text-sm">
                              Surprise friends and family with unique, personalized video messages
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Users className="h-5 w-5 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-medium">Easy Booking</h4>
                            <p className="text-gray-600 text-sm">
                              Simple process to request and receive your custom videos
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Featured Creators</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            🎵
                          </div>
                          <div>
                            <p className="font-medium">Wyclef Jean</p>
                            <p className="text-sm text-gray-600">Musician • $150</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            😂
                          </div>
                          <div>
                            <p className="font-medium">Ti Jo Zenny</p>
                            <p className="text-sm text-gray-600">Comedian • $85</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            🎭
                          </div>
                          <div>
                            <p className="font-medium">Richard Cave</p>
                            <p className="text-sm text-gray-600">Actor • $120</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="creator">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Creator Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Apply to Become a Creator</CardTitle>
                    <p className="text-gray-600">Share your talent and earn money creating personalized videos</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreatorSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="creator-firstName">First Name</Label>
                          <Input
                            id="creator-firstName"
                            value={creatorForm.firstName}
                            onChange={(e) => setCreatorForm({ ...creatorForm, firstName: e.target.value })}
                            required
                            disabled={isLoading || oauthLoading !== null}
                          />
                        </div>
                        <div>
                          <Label htmlFor="creator-lastName">Last Name</Label>
                          <Input
                            id="creator-lastName"
                            value={creatorForm.lastName}
                            onChange={(e) => setCreatorForm({ ...creatorForm, lastName: e.target.value })}
                            required
                            disabled={isLoading || oauthLoading !== null}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="creator-email">Email</Label>
                        <Input
                          id="creator-email"
                          type="email"
                          value={creatorForm.email}
                          onChange={(e) => setCreatorForm({ ...creatorForm, email: e.target.value })}
                          required
                          disabled={isLoading || oauthLoading !== null}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="creator-password">Password</Label>
                          <Input
                            id="creator-password"
                            type="password"
                            value={creatorForm.password}
                            onChange={(e) => setCreatorForm({ ...creatorForm, password: e.target.value })}
                            required
                            disabled={isLoading || oauthLoading !== null}
                          />
                        </div>
                        <div>
                          <Label htmlFor="creator-confirmPassword">Confirm Password</Label>
                          <Input
                            id="creator-confirmPassword"
                            type="password"
                            value={creatorForm.confirmPassword}
                            onChange={(e) => setCreatorForm({ ...creatorForm, confirmPassword: e.target.value })}
                            required
                            disabled={isLoading || oauthLoading !== null}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="creator-displayName">Display Name</Label>
                        <Input
                          id="creator-displayName"
                          placeholder="How you want to be known on the platform"
                          value={creatorForm.displayName}
                          onChange={(e) => setCreatorForm({ ...creatorForm, displayName: e.target.value })}
                          required
                          disabled={isLoading || oauthLoading !== null}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="creator-category">Category</Label>
                          <Select
                            value={creatorForm.category}
                            onValueChange={(value) => setCreatorForm({ ...creatorForm, category: value })}
                            disabled={isLoading || oauthLoading !== null}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="musician">Musician</SelectItem>
                              <SelectItem value="singer">Singer</SelectItem>
                              <SelectItem value="comedian">Comedian</SelectItem>
                              <SelectItem value="actor">Actor</SelectItem>
                              <SelectItem value="dj">DJ</SelectItem>
                              <SelectItem value="influencer">Influencer</SelectItem>
                              <SelectItem value="athlete">Athlete</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="creator-price">Price per Video ($)</Label>
                          <Input
                            id="creator-price"
                            type="number"
                            placeholder="50"
                            value={creatorForm.price}
                            onChange={(e) => setCreatorForm({ ...creatorForm, price: e.target.value })}
                            required
                            disabled={isLoading || oauthLoading !== null}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="creator-bio">Bio</Label>
                        <Textarea
                          id="creator-bio"
                          placeholder="Tell us about yourself and your experience..."
                          rows={4}
                          value={creatorForm.bio}
                          onChange={(e) => setCreatorForm({ ...creatorForm, bio: e.target.value })}
                          required
                          disabled={isLoading || oauthLoading !== null}
                        />
                      </div>

                      <div>
                        <Label htmlFor="creator-socialMedia">Social Media Links (Optional)</Label>
                        <Input
                          id="creator-socialMedia"
                          placeholder="Instagram, TikTok, YouTube, etc."
                          value={creatorForm.socialMedia}
                          onChange={(e) => setCreatorForm({ ...creatorForm, socialMedia: e.target.value })}
                          disabled={isLoading || oauthLoading !== null}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="creator-terms"
                          checked={creatorForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setCreatorForm({ ...creatorForm, agreeToTerms: checked as boolean })
                          }
                          disabled={isLoading || oauthLoading !== null}
                        />
                        <Label htmlFor="creator-terms" className="text-sm">
                          I agree to the{" "}
                          <Link href="/terms" className="text-purple-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/creator-terms" className="text-purple-600 hover:underline">
                            Creator Agreement
                          </Link>
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700" 
                        size="lg"
                        disabled={isLoading || oauthLoading !== null}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting application...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>

                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          Applications are reviewed within 2-3 business days
                        </Badge>
                      </div>
                    </form>

                    <div className="mt-6">
                      <OAuthButtons />
                    </div>
                  </CardContent>
                </Card>

                {/* Creator Benefits */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Why become a creator?</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <DollarSign className="h-5 w-5 text-green-500 mt-1" />
                          <div>
                            <h4 className="font-medium">Earn Money</h4>
                            <p className="text-gray-600 text-sm">
                              Set your own prices and earn 85% of each video you create
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Users className="h-5 w-5 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-medium">Connect with Fans</h4>
                            <p className="text-gray-600 text-sm">
                              Build deeper connections with your audience through personal messages
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Video className="h-5 w-5 text-purple-500 mt-1" />
                          <div>
                            <h4 className="font-medium">Flexible Schedule</h4>
                            <p className="text-gray-600 text-sm">
                              Work on your own time and choose which requests to fulfill
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Creator Success Stories</h3>
                      <div className="space-y-4">
                        <div className="border-l-4 border-purple-500 pl-4">
                          <p className="text-sm text-gray-700 italic">
                            "I've earned over $3,000 in my first month and love connecting with my fans!"
                          </p>
                          <p className="text-xs text-gray-500 mt-1">- Ti Jo Zenny, Comedian</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <p className="text-sm text-gray-700 italic">
                            "Ann Pale has helped me reach fans I never could before. It's amazing!"
                          </p>
                          <p className="text-xs text-gray-500 mt-1">- Rutshelle Guillaume, Singer</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3">Application Process</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            1
                          </div>
                          <p className="text-sm">Submit your application</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            2
                          </div>
                          <p className="text-sm">Our team reviews your profile</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            3
                          </div>
                          <p className="text-sm">Get approved and start earning!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}