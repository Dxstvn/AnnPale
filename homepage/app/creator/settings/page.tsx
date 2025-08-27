"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Package,
  Calendar,
  User,
  DollarSign,
  Save,
  AlertCircle,
  Info,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  Sparkles
} from "lucide-react"
import CreatorHeroSection from "@/components/creator/settings/hero-section"
import PackageTierEditor from "@/components/creator/settings/package-tier-editor"
import AddonEditor from "@/components/creator/settings/addon-editor"
import AvailabilityCalendar from "@/components/creator/settings/availability-calendar"
import PreviewPanel from "@/components/creator/settings/preview-panel"
import { useLanguage } from "@/contexts/language-context"

interface PackageTier {
  id: string
  enabled: boolean
  name: string
  description: string
  price: number
  deliveryDays: number
  videoDuration: string
  revisions: number
  features: string[]
}

interface Addon {
  id: string
  enabled: boolean
  name: string
  description: string
  price: number
}

export default function CreatorSettingsPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("packages")

  // Creator data (would come from API/context in real app)
  const creatorData = {
    name: "Wyclef Jean",
    tagline: "Grammy Award Winner • Former Fugees Member",
    category: "Musician",
    image: "/images/wyclef-jean.png",
    coverImage: "/placeholder.jpg",
    verified: true,
    featured: true,
    trending: true,
    stats: {
      completedVideos: 1247,
      rating: 4.9,
      responseTime: "24hr",
      onTimeDelivery: 98,
      repeatCustomers: 34,
      totalEarned: "$186,500"
    }
  }

  // Package tiers state
  const [packageTiers, setPackageTiers] = React.useState<PackageTier[]>([
    {
      id: "basic",
      enabled: true,
      name: "Basic",
      description: "Perfect for simple personal messages",
      price: 150,
      deliveryDays: 7,
      videoDuration: "30-60",
      revisions: 1,
      features: [
        "Personalized message",
        "Digital download",
        "Email delivery"
      ]
    },
    {
      id: "premium",
      enabled: true,
      name: "Premium",
      description: "Most popular choice with extra features",
      price: 225,
      deliveryDays: 3,
      videoDuration: "60-90",
      revisions: 2,
      features: [
        "Extended personalized message",
        "HD quality video",
        "Custom background",
        "Special shoutout",
        "Priority delivery"
      ]
    },
    {
      id: "vip",
      enabled: true,
      name: "VIP Experience",
      description: "Ultimate personalized experience",
      price: 375,
      deliveryDays: 1,
      videoDuration: "90-120",
      revisions: -1, // Unlimited
      features: [
        "Extended personalized message",
        "4K quality video",
        "Custom script review",
        "Behind-the-scenes content",
        "Personal thank you note",
        "Express delivery",
        "Priority support"
      ]
    }
  ])

  // Add-ons state
  const [addons, setAddons] = React.useState<Addon[]>([
    {
      id: "rush",
      enabled: true,
      name: "Rush Delivery",
      description: "Get your video in 24 hours",
      price: 25
    },
    {
      id: "extra-length",
      enabled: true,
      name: "Extra Length",
      description: "Add 30 more seconds",
      price: 15
    },
    {
      id: "4k",
      enabled: true,
      name: "4K Ultra HD",
      description: "Highest quality video",
      price: 10
    },
    {
      id: "gift",
      enabled: true,
      name: "Gift Wrapping",
      description: "Special gift presentation",
      price: 5
    }
  ])

  // Availability state
  const [availability, setAvailability] = React.useState({
    weeklyLimit: 50,
    responseTime: "24hr",
    vacationMode: false,
    blackoutDates: [],
    businessDays: ["mon", "tue", "wed", "thu", "fri"],
    businessHours: { start: "09:00", end: "18:00" }
  })

  // Profile state
  const [profile, setProfile] = React.useState({
    bio: "Grammy-winning musician, producer, and humanitarian. Former member of the Fugees and solo artist with hits like 'Hips Don't Lie' and 'Gone Till November'. Proud Haitian-American artist bringing joy through personalized messages.",
    extendedBio: "",
    languages: ["English", "Kreyòl", "Français"],
    specialties: ["Birthday wishes", "Congratulations", "Motivational messages", "Music dedications"],
    socialMedia: {
      instagram: "@wyclefjean",
      twitter: "@wyclef",
      facebook: "wyclefjean",
      youtube: "wyclefjeanVEVO"
    }
  })

  const handleSaveChanges = () => {
    // Simulate API call
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    })
    setHasUnsavedChanges(false)
  }

  const handleDiscardChanges = () => {
    // Reset to original values
    setHasUnsavedChanges(false)
    toast({
      title: "Changes discarded",
      description: "Your changes have been discarded.",
    })
  }

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <CreatorHeroSection
        {...creatorData}
        onEditProfile={() => setActiveTab("profile")}
        onEditCover={() => setActiveTab("profile")}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="text-amber-900 font-medium">You have unsaved changes</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDiscardChanges}
                >
                  Discard
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  onClick={handleSaveChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full mb-6">
                <TabsTrigger value="packages" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Packages</span>
                </TabsTrigger>
                <TabsTrigger value="availability" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Availability</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="pricing" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Pricing</span>
                </TabsTrigger>
              </TabsList>

              {/* Packages Tab */}
              <TabsContent value="packages" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Packages</CardTitle>
                    <CardDescription>
                      Configure your video message packages and pricing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Package Tiers */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Package Tiers</h3>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Tier
                        </Button>
                      </div>
                      
                      {packageTiers.map((tier) => (
                        <PackageTierEditor
                          key={tier.id}
                          tier={tier}
                          onChange={(updatedTier) => {
                            setPackageTiers(prev => 
                              prev.map(t => t.id === tier.id ? updatedTier : t)
                            )
                            setHasUnsavedChanges(true)
                          }}
                          onDelete={() => {
                            setPackageTiers(prev => prev.filter(t => t.id !== tier.id))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      ))}
                    </div>

                    <Separator />

                    {/* Add-ons */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Add-on Options</h3>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Option
                        </Button>
                      </div>
                      
                      {addons.map((addon) => (
                        <AddonEditor
                          key={addon.id}
                          addon={addon}
                          onChange={(updatedAddon) => {
                            setAddons(prev => 
                              prev.map(a => a.id === addon.id ? updatedAddon : a)
                            )
                            setHasUnsavedChanges(true)
                          }}
                          onDelete={() => {
                            setAddons(prev => prev.filter(a => a.id !== addon.id))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Availability Settings</CardTitle>
                    <CardDescription>
                      Manage your booking availability and schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailabilityCalendar
                      availability={availability}
                      onChange={(updated) => {
                        setAvailability(updated)
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your public profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => {
                          setProfile(prev => ({ ...prev, bio: e.target.value }))
                          setHasUnsavedChanges(true)
                        }}
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-sm text-gray-500">
                        {profile.bio.length}/500 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="extended-bio">Extended Bio</Label>
                      <Textarea
                        id="extended-bio"
                        value={profile.extendedBio}
                        onChange={(e) => {
                          setProfile(prev => ({ ...prev, extendedBio: e.target.value }))
                          setHasUnsavedChanges(true)
                        }}
                        rows={6}
                        className="resize-none"
                        placeholder="Add more details about your background, achievements, and what makes your videos special..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang) => (
                          <Badge key={lang} variant="secondary">
                            {lang}
                            <button
                              onClick={() => {
                                setProfile(prev => ({
                                  ...prev,
                                  languages: prev.languages.filter(l => l !== lang)
                                }))
                                setHasUnsavedChanges(true)
                              }}
                              className="ml-2 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Specialties</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                            <button
                              onClick={() => {
                                setProfile(prev => ({
                                  ...prev,
                                  specialties: prev.specialties.filter(s => s !== specialty)
                                }))
                                setHasUnsavedChanges(true)
                              }}
                              className="ml-2 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Social Media Links</h3>
                      <div className="grid gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="instagram" className="w-24">Instagram</Label>
                          <Input
                            id="instagram"
                            value={profile.socialMedia.instagram}
                            onChange={(e) => {
                              setProfile(prev => ({
                                ...prev,
                                socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                              }))
                              setHasUnsavedChanges(true)
                            }}
                            placeholder="@username"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="twitter" className="w-24">Twitter</Label>
                          <Input
                            id="twitter"
                            value={profile.socialMedia.twitter}
                            onChange={(e) => {
                              setProfile(prev => ({
                                ...prev,
                                socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                              }))
                              setHasUnsavedChanges(true)
                            }}
                            placeholder="@username"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="youtube" className="w-24">YouTube</Label>
                          <Input
                            id="youtube"
                            value={profile.socialMedia.youtube}
                            onChange={(e) => {
                              setProfile(prev => ({
                                ...prev,
                                socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                              }))
                              setHasUnsavedChanges(true)
                            }}
                            placeholder="Channel name"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Profile Images</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Profile Photo</Label>
                          <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer group">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                            <p className="text-sm text-gray-700 font-medium">Click to upload</p>
                            <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Cover Image</Label>
                          <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer group">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                            <p className="text-sm text-gray-700 font-medium">Click to upload</p>
                            <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Payments</CardTitle>
                    <CardDescription>
                      Manage your earnings and payment settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Earnings Overview */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Total Earned</p>
                          <p className="text-2xl font-bold text-purple-600">{creatorData.stats.totalEarned}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">This Month</p>
                          <p className="text-2xl font-bold text-green-600">$12,450</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">Pending</p>
                          <p className="text-2xl font-bold text-amber-600">$1,850</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    {/* Platform Fees */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Platform Fees</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Platform Commission</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Payment Processing</span>
                          <span className="font-medium">2.9% + $0.30</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="font-medium">Your Earnings</span>
                          <span className="font-bold text-green-600">~77%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        <Info className="h-4 w-4 inline mr-1" />
                        Fees are automatically deducted from each transaction
                      </p>
                    </div>

                    <Separator />

                    {/* Payout Settings */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Payout Settings</h3>
                      <div className="space-y-2">
                        <Label>Payout Method</Label>
                        <select className="w-full p-2 border rounded-lg">
                          <option>Direct Deposit (Bank Transfer)</option>
                          <option>PayPal</option>
                          <option>Stripe</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Payout Schedule</Label>
                        <select className="w-full p-2 border rounded-lg">
                          <option>Weekly</option>
                          <option>Bi-weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Payout Amount</Label>
                        <Input type="number" defaultValue="100" min="50" step="10" />
                        <p className="text-sm text-gray-500">
                          Earnings below this amount will roll over to the next payout
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Promotional Tools */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Promotional Tools</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Limited-Time Discount</p>
                            <p className="text-sm text-gray-600">Offer a temporary discount to boost bookings</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Bundle Deals</p>
                            <p className="text-sm text-gray-600">Offer discounts for multiple video bookings</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Referral Program</p>
                            <p className="text-sm text-gray-600">Earn when you refer other creators</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Live Preview</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    See how your settings appear to customers
                  </CardDescription>
                </CardHeader>
                {showPreview && (
                  <CardContent>
                    <PreviewPanel
                      packageTiers={packageTiers.filter(t => t.enabled)}
                      addons={addons.filter(a => a.enabled)}
                      availability={availability}
                    />
                  </CardContent>
                )}
              </Card>

              {/* Help Card */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Pro Tips</h4>
                      <p className="text-sm text-gray-600">
                        Offering 3 package tiers increases bookings by 25% on average. 
                        Consider your pricing carefully - Premium packages typically perform best.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}