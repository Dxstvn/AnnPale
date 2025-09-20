'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { createClient } from '@/lib/supabase/client'
import {
  Settings, User, Camera, Check, Loader2, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { Textarea } from '@/components/ui/textarea'
import { SubscriptionManagement } from '@/components/subscription/subscription-management'
import { useToast } from '@/components/ui/use-toast'

export default function CustomerSettingsPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useSupabaseAuth()
  const { toast } = useToast()
  const supabase = createClient()

  const [selectedTab, setSelectedTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Profile form state - initialized with empty values
  const [profileData, setProfileData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    language: 'en',
    timezone: 'America/New_York',
    avatar_url: ''
  })

  // Original data to detect changes
  const [originalData, setOriginalData] = useState(profileData)

  // Set the tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && (tab === 'profile' || tab === 'subscriptions')) {
      setSelectedTab(tab)
    }
  }, [searchParams])

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Fetch the complete profile from the database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          toast({
            title: 'Error loading profile',
            description: 'Could not load your profile data.',
            variant: 'destructive'
          })
          return
        }

        if (profile) {
          // Get language and timezone from localStorage (user preferences)
          const savedLanguage = localStorage.getItem('user_language') || 'en'
          const savedTimezone = localStorage.getItem('user_timezone') || 'America/New_York'

          const loadedData = {
            name: profile.name || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
            language: savedLanguage,
            timezone: savedTimezone,
            avatar_url: profile.avatar_url || ''
          }

          setProfileData(loadedData)
          setOriginalData(loadedData)
        }
      } catch (error) {
        console.error('Unexpected error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading && user) {
      loadUserProfile()
    }
  }, [user, authLoading, supabase, toast])

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData)
    setHasUnsavedChanges(hasChanges)
  }, [profileData, originalData])

  // Handle profile field changes
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPG, PNG, or GIF image.',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive'
      })
      return
    }

    setIsUploadingAvatar(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('[Frontend] Starting avatar upload...')
      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData
      })

      console.log('[Frontend] Upload response status:', response.status)
      console.log('[Frontend] Upload response headers:', Object.fromEntries(response.headers.entries()))

      // Check if the response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[Frontend] Non-JSON response received:', contentType)
        const responseText = await response.text()
        console.error('[Frontend] Response body:', responseText.substring(0, 500) + '...')

        throw new Error('Server returned an invalid response. Please try again or contact support.')
      }

      let data
      try {
        data = await response.json()
        console.log('[Frontend] Parsed response data:', data)
      } catch (jsonError) {
        console.error('[Frontend] JSON parsing error:', jsonError)
        throw new Error('Server returned malformed data. Please try again.')
      }

      if (!response.ok) {
        const errorMessage = data.error || `Upload failed with status ${response.status}`
        console.error('[Frontend] Upload failed:', errorMessage)
        throw new Error(errorMessage)
      }

      if (!data.avatar_url) {
        console.error('[Frontend] No avatar URL in response:', data)
        throw new Error('Server did not return avatar URL. Please try again.')
      }

      // Update local state with new avatar URL
      console.log('[Frontend] Updating local state with new avatar URL:', data.avatar_url)
      setProfileData(prev => ({ ...prev, avatar_url: data.avatar_url }))
      setOriginalData(prev => ({ ...prev, avatar_url: data.avatar_url }))

      toast({
        title: 'Profile picture updated',
        description: data.message || 'Your profile picture has been successfully updated.',
        variant: 'success'
      })
    } catch (error) {
      console.error('[Frontend] Avatar upload error:', error)

      // Provide user-friendly error messages
      let errorMessage = 'Failed to upload image. Please try again.'

      if (error instanceof Error) {
        if (error.message.includes('malformed') || error.message.includes('invalid response')) {
          errorMessage = 'Server error occurred. Please refresh the page and try again.'
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsUploadingAvatar(false)
      // Reset the file input
      event.target.value = ''
    }
  }

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Prepare update data
      const updateData: any = {
        name: profileData.name || `${profileData.first_name} ${profileData.last_name}`.trim(),
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString()
      }

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        throw error
      }

      // Save preferences to localStorage
      localStorage.setItem('user_language', profileData.language)
      localStorage.setItem('user_timezone', profileData.timezone)

      // Update original data to reflect saved state
      setOriginalData(profileData)
      setHasUnsavedChanges(false)

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        variant: 'success'
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: 'Error saving profile',
        description: 'Could not save your profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Get initials for avatar
  const getInitials = () => {
    const name = profileData.name || profileData.email
    if (!name) return 'U'

    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to access your settings.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Settings className="mr-3 h-8 w-8" />
                Settings
              </h1>
              <p className="mt-2 text-purple-100">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => handleProfileChange('first_name', e.target.value)}
                      className="mt-2"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => handleProfileChange('last_name', e.target.value)}
                      className="mt-2"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      className="mt-2"
                      disabled
                      title="Email cannot be changed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="mt-2"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => handleProfileChange('language', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ht">Kreyòl Ayisyen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => handleProfileChange('timezone', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/Port-au-Prince">Haiti Time</SelectItem>
                        <SelectItem value="Europe/Paris">Paris Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {hasUnsavedChanges && (
                    <p className="text-sm text-orange-600">You have unsaved changes</p>
                  )}
                  <div className="flex gap-2 ml-auto">
                    {hasUnsavedChanges && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setProfileData(originalData)
                          setHasUnsavedChanges(false)
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      onClick={handleSaveProfile}
                      disabled={isSaving || !hasUnsavedChanges}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account security and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Download Your Data</p>
                    <p className="text-sm text-gray-500">Get a copy of your Ann Pale data</p>
                  </div>
                  <Button variant="outline" disabled>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <SubscriptionManagement />

            <Card>
              <CardHeader>
                <CardTitle>Discover New Creators</CardTitle>
                <CardDescription>Based on your interests and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Explore new creators to follow</p>
                  <Button onClick={() => router.push('/browse')}>
                    Browse Creators
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}