"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
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
  User,
  Users,
  Save,
  AlertCircle,
  Plus,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  Loader2
} from "lucide-react"
import CreatorHeroSection from "@/components/creator/settings/hero-section"
import PreviewPanel from "@/components/creator/settings/preview-panel"
import { SubscriptionTierManager } from "@/components/creator/subscription-tier-manager"
import { useLanguage } from "@/contexts/language-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { createClient } from "@/lib/supabase/client"

export default function CreatorSettingsPage() {
  const { language } = useLanguage()
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)
  const coverImageInputRef = React.useRef<HTMLInputElement>(null)
  const profileImageInputRef = React.useRef<HTMLInputElement>(null)
  const [uploadingCover, setUploadingCover] = React.useState(false)
  const [uploadingProfile, setUploadingProfile] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState(() => {
    const tabParam = searchParams.get('tab')
    return tabParam || "profile"
  })
  const [loading, setLoading] = React.useState(true)
  
  // Dynamic creator data state
  const [creatorData, setCreatorData] = React.useState({
    name: "",
    tagline: "",
    category: "",
    image: "/images/default-creator.png",
    coverImage: "/placeholder.jpg",
    verified: false,
    featured: false,
    trending: false,
    stats: {
      completedVideos: 0,
      rating: 0,
      responseTime: "N/A",
      onTimeDelivery: 0,
      repeatCustomers: 0,
      totalEarned: "$0"
    }
  })
  
  // Load creator data on mount
  React.useEffect(() => {
    loadCreatorData()
  }, [user])
  
  const loadCreatorData = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      const supabase = createClient()
      
      // Fetch creator profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        console.error('Error loading profile:', profileError)
        toast({
          title: "Error",
          description: "Failed to load your profile",
          variant: "destructive"
        })
        setLoading(false)
        return
      }
      
      // Fetch creator stats (mock for now, would come from analytics)
      const stats = {
        completedVideos: profile.completed_videos || 0,
        rating: profile.rating || 0,
        responseTime: profile.response_time || "24hr",
        onTimeDelivery: profile.on_time_delivery || 95,
        repeatCustomers: profile.repeat_customers || 30,
        totalEarned: `$${(profile.total_earned || 0).toLocaleString()}`
      }
      
      setCreatorData({
        name: profile.name || user.email?.split('@')[0] || "Creator",
        tagline: profile.tagline || profile.bio || "Welcome to my creator page",
        category: profile.category || "Creator",
        image: profile.avatar_url || profile.image || "/images/default-creator.png",
        coverImage: profile.cover_image || "/placeholder.jpg",
        verified: profile.is_verified || false,
        featured: profile.is_featured || false,
        trending: profile.is_trending || false,
        stats
      })
    } catch (error) {
      console.error('Error loading creator data:', error)
      toast({
        title: "Error",
        description: "Failed to load creator data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  

  // Profile state - will be populated from database
  const [profile, setProfile] = React.useState({
    bio: "",
    extendedBio: "",
    languages: [],
    specialties: [],
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: "",
      youtube: ""
    }
  })
  
  // Update profile state when creator data is loaded
  React.useEffect(() => {
    if (creatorData.name && !loading) {
      setProfile(prev => ({
        ...prev,
        bio: creatorData.tagline || prev.bio,
        languages: prev.languages.length > 0 ? prev.languages : ["English"],
        specialties: prev.specialties.length > 0 ? prev.specialties : ["Custom messages"]
      }))
    }
  }, [creatorData, loading])

  const handleImageUpload = async (file: File, type: 'cover' | 'profile') => {
    if (!user) return

    const isUploadingCover = type === 'cover'
    if (isUploadingCover) {
      setUploadingCover(true)
    } else {
      setUploadingProfile(true)
    }

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${type}-images/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile in database
      const updateField = type === 'cover' ? 'cover_image' : 'avatar_url'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update local state
      setCreatorData(prev => ({
        ...prev,
        [type === 'cover' ? 'coverImage' : 'image']: publicUrl
      }))

      toast({
        title: "Image uploaded",
        description: `Your ${type} image has been updated successfully.`,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: `Failed to upload ${type} image. Please try again.`,
        variant: "destructive"
      })
    } finally {
      if (isUploadingCover) {
        setUploadingCover(false)
      } else {
        setUploadingProfile(false)
      }
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your creator settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hidden file inputs for images that can be triggered from hero */}
      <input
        ref={coverImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file, 'cover')
        }}
      />
      <input
        ref={profileImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file, 'profile')
        }}
      />

      {/* Hero Section */}
      <CreatorHeroSection
        {...creatorData}
        onEditProfile={() => profileImageInputRef.current?.click()}
        onEditCover={() => coverImageInputRef.current?.click()}
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
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="subscription-tiers" className="flex items-center gap-2" data-testid="subscription-tiers-tab">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Subscription Tiers</span>
                </TabsTrigger>
              </TabsList>

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
                          <div
                            onClick={() => profileImageInputRef.current?.click()}
                            className="relative border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer group"
                          >
                            {uploadingProfile ? (
                              <Loader2 className="h-8 w-8 mx-auto mb-2 text-purple-600 animate-spin" />
                            ) : (
                              <Upload className="h-8 w-8 mx-auto mb-2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                            )}
                            <p className="text-sm text-gray-700 font-medium">
                              {uploadingProfile ? "Uploading..." : "Click to upload"}
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                            <input
                              ref={profileImageInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'profile')
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Cover Image</Label>
                          <div
                            onClick={() => coverImageInputRef.current?.click()}
                            className="relative border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer group"
                          >
                            {uploadingCover ? (
                              <Loader2 className="h-8 w-8 mx-auto mb-2 text-purple-600 animate-spin" />
                            ) : (
                              <Upload className="h-8 w-8 mx-auto mb-2 text-purple-400 group-hover:text-purple-600 transition-colors" />
                            )}
                            <p className="text-sm text-gray-700 font-medium">
                              {uploadingCover ? "Uploading..." : "Click to upload"}
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                            <input
                              ref={coverImageInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'cover')
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscription Tiers Tab */}
              <TabsContent value="subscription-tiers" className="space-y-6">
                <SubscriptionTierManager />
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
                      packageTiers={[]}
                      addons={[]}
                      availability={{
                        weeklyLimit: 50,
                        responseTime: "24hr",
                        vacationMode: false,
                        blackoutDates: [],
                        businessDays: ["mon", "tue", "wed", "thu", "fri"],
                        businessHours: { start: "09:00", end: "18:00" }
                      }}
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