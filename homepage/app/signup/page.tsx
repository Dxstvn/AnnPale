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
import { ArrowLeft, Star, Users, Video, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

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
    stageName: "",
    category: "",
    bio: "",
    price: "",
    socialMedia: "",
    agreeToTerms: false,
  })

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle customer signup
    console.log("Customer signup:", customerForm)
  }

  const handleCreatorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle creator signup
    console.log("Creator signup:", creatorForm)
  }

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

          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="customer" className="text-lg py-3">
                <Users className="h-5 w-5 mr-2" />
                Sign up as Customer
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
                          />
                        </div>
                        <div>
                          <Label htmlFor="customer-lastName">Last Name</Label>
                          <Input
                            id="customer-lastName"
                            value={customerForm.lastName}
                            onChange={(e) => setCustomerForm({ ...customerForm, lastName: e.target.value })}
                            required
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
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customer-terms"
                          checked={customerForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setCustomerForm({ ...customerForm, agreeToTerms: checked as boolean })
                          }
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

                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                        Create Account
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Customer Benefits */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Why join as a customer?</h3>
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
                          />
                        </div>
                        <div>
                          <Label htmlFor="creator-lastName">Last Name</Label>
                          <Input
                            id="creator-lastName"
                            value={creatorForm.lastName}
                            onChange={(e) => setCreatorForm({ ...creatorForm, lastName: e.target.value })}
                            required
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
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="creator-stageName">Stage/Professional Name</Label>
                        <Input
                          id="creator-stageName"
                          placeholder="How you want to be known on the platform"
                          value={creatorForm.stageName}
                          onChange={(e) => setCreatorForm({ ...creatorForm, stageName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="creator-category">Category</Label>
                          <Select
                            value={creatorForm.category}
                            onValueChange={(value) => setCreatorForm({ ...creatorForm, category: value })}
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
                        />
                      </div>

                      <div>
                        <Label htmlFor="creator-socialMedia">Social Media Links (Optional)</Label>
                        <Input
                          id="creator-socialMedia"
                          placeholder="Instagram, TikTok, YouTube, etc."
                          value={creatorForm.socialMedia}
                          onChange={(e) => setCreatorForm({ ...creatorForm, socialMedia: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="creator-terms"
                          checked={creatorForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setCreatorForm({ ...creatorForm, agreeToTerms: checked as boolean })
                          }
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

                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                        Submit Application
                      </Button>

                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          Applications are reviewed within 2-3 business days
                        </Badge>
                      </div>
                    </form>
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
