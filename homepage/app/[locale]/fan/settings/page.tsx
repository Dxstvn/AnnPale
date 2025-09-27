'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { createClient } from '@/lib/supabase/client'
import {
  Settings, User, Camera, Check, Loader2, AlertCircle,
  Sparkles, Video, DollarSign, TrendingUp, Users, ArrowRight
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
  const t = useTranslations('fan')
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
    avatar_url: '',
    is_creator: false,
    current_mode: 'fan' as 'fan' | 'creator'
  })

  // Original data to detect changes
  const [originalData, setOriginalData] = useState(profileData)
  const [isActivatingCreator, setIsActivatingCreator] = useState(false)

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
            title: t('settings.profile.profileUpdateError'),
            description: t('settings.profile.profileUpdateErrorMessage'),
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
            avatar_url: profile.avatar_url || '',
            is_creator: profile.is_creator || false,
            current_mode: profile.current_mode || 'fan'
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
        title: t('settings.profile.profilePicture.invalidFileType'),
        description: t('settings.profile.profilePicture.invalidFileTypeMessage'),
        variant: 'destructive'
      })
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: t('settings.profile.profilePicture.fileTooLarge'),
        description: t('settings.profile.profilePicture.fileTooLargeMessage'),
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
        title: t('settings.profile.profilePicture.uploadSuccess'),
        description: data.message || t('settings.profile.profilePicture.uploadSuccessMessage'),
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
        title: t('settings.profile.profilePicture.uploadError'),
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsUploadingAvatar(false)
      // Reset the file input
      event.target.value = ''
    }
  }

  // Handle creator activation
  const handleActivateCreator = async () => {
    setIsActivatingCreator(true)

    try {
      const response = await fetch('/api/account/activate-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to activate creator features')
      }

      if (data.success) {
        // Update local state
        setProfileData(prev => ({ ...prev, is_creator: true }))
        setOriginalData(prev => ({ ...prev, is_creator: true }))

        toast({
          title: t('settings.creator.activationSuccess'),
          description: t('settings.creator.activationSuccessMessage'),
          variant: 'success'
        })

        // Optionally redirect to creator dashboard
        setTimeout(() => {
          router.push('/creator/dashboard')
        }, 2000)
      } else {
        toast({
          title: t('settings.creator.alreadyActivated'),
          description: data.message,
          variant: 'default'
        })
      }
    } catch (error) {
      console.error('Error activating creator features:', error)
      toast({
        title: t('settings.creator.activationFailed'),
        description: error instanceof Error ? error.message : t('settings.creator.activationError'),
        variant: 'destructive'
      })
    } finally {
      setIsActivatingCreator(false)
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
        title: t('settings.profile.profileUpdated'),
        description: t('settings.profile.profileUpdatedMessage'),
        variant: 'success'
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: t('settings.profile.profileUpdateError'),
        description: t('settings.profile.profileUpdateErrorMessage'),
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
          <p className="mt-2 text-gray-600">{t('settings.loadingSettings')}</p>
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
            {t('settings.signInRequired')}
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
                {t('settings.title')}
              </h1>
              <p className="mt-2 text-purple-100">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" data-testid="profile-tab">{t('settings.tabs.profile')}</TabsTrigger>
            <TabsTrigger value="subscriptions" data-testid="subscriptions-tab">{t('settings.tabs.subscriptions')}</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6" data-testid="profile-tab-content">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.profile.title')}</CardTitle>
                <CardDescription>{t('settings.profile.subtitle')}</CardDescription>
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
                          {t('settings.profile.profilePicture.uploading')}
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          {t('settings.profile.profilePicture.changePhoto')}
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-500">{t('settings.profile.profilePicture.uploadInstructions')}</p>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">{t('settings.profile.fields.firstName')}</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => handleProfileChange('first_name', e.target.value)}
                      className="mt-2"
                      placeholder={t('settings.profile.fields.firstNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">{t('settings.profile.fields.lastName')}</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => handleProfileChange('last_name', e.target.value)}
                      className="mt-2"
                      placeholder={t('settings.profile.fields.lastNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('settings.profile.fields.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      className="mt-2"
                      disabled
                      title={t('settings.profile.fields.emailDisabled')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('settings.profile.fields.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="mt-2"
                      placeholder={t('settings.profile.fields.phonePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">{t('settings.profile.fields.language')}</Label>
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => handleProfileChange('language', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{t('settings.profile.languages.english')}</SelectItem>
                        <SelectItem value="fr">{t('settings.profile.languages.french')}</SelectItem>
                        <SelectItem value="ht">{t('settings.profile.languages.haitian')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">{t('settings.profile.fields.timezone')}</Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => handleProfileChange('timezone', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">{t('settings.profile.timezones.eastern')}</SelectItem>
                        <SelectItem value="America/Chicago">{t('settings.profile.timezones.central')}</SelectItem>
                        <SelectItem value="America/Denver">{t('settings.profile.timezones.mountain')}</SelectItem>
                        <SelectItem value="America/Los_Angeles">{t('settings.profile.timezones.pacific')}</SelectItem>
                        <SelectItem value="America/Port-au-Prince">{t('settings.profile.timezones.haiti')}</SelectItem>
                        <SelectItem value="Europe/Paris">{t('settings.profile.timezones.paris')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">{t('settings.profile.fields.bio')}</Label>
                    <Textarea
                      id="bio"
                      placeholder={t('settings.profile.fields.bioPlaceholder')}
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {hasUnsavedChanges && (
                    <p className="text-sm text-orange-600">{t('settings.profile.unsavedChanges')}</p>
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
                        {t('settings.profile.cancel')}
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
                          {t('settings.profile.saving')}
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {t('settings.profile.saveChanges')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Tools */}
            <Card className={profileData.is_creator ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  {t('settings.creator.title')}
                </CardTitle>
                <CardDescription>
                  {profileData.is_creator
                    ? t('settings.creator.subtitleActivated')
                    : t('settings.creator.subtitleNotActivated')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!profileData.is_creator ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{t('settings.creator.features.createContent')}</p>
                          <p className="text-sm text-gray-600">{t('settings.creator.features.createContentDescription')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{t('settings.creator.features.earnMoney')}</p>
                          <p className="text-sm text-gray-600">{t('settings.creator.features.earnMoneyDescription')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{t('settings.creator.features.buildAudience')}</p>
                          <p className="text-sm text-gray-600">{t('settings.creator.features.buildAudienceDescription')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{t('settings.creator.features.analytics')}</p>
                          <p className="text-sm text-gray-600">{t('settings.creator.features.analyticsDescription')}</p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <Button
                      onClick={handleActivateCreator}
                      disabled={isActivatingCreator}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isActivatingCreator ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('settings.creator.activating')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          {t('settings.creator.becomeCreator')}
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {t('settings.creator.activatedMessage')}
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <Button
                        onClick={() => router.push('/creator/dashboard')}
                        className="w-full"
                        variant="default"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {t('settings.creator.goToCreatorStudio')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        onClick={() => router.push('/creator/settings')}
                        variant="outline"
                        className="w-full"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t('settings.creator.creatorSettings')}
                      </Button>
                    </div>
                    <Separator />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">{t('settings.creator.currentMode')}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md">
                          {profileData.current_mode === 'creator' ? t('settings.creator.creatorMode') : t('settings.creator.fanMode')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t('settings.creator.switchModeHint')}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.account.title')}</CardTitle>
                <CardDescription>{t('settings.account.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.account.changePassword')}</p>
                    <p className="text-sm text-gray-500">{t('settings.account.changePasswordDescription')}</p>
                  </div>
                  <Button variant="outline">{t('settings.account.changePassword')}</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('settings.account.downloadData')}</p>
                    <p className="text-sm text-gray-500">{t('settings.account.downloadDataDescription')}</p>
                  </div>
                  <Button variant="outline" disabled>{t('settings.account.comingSoon')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6" data-testid="subscriptions-tab-content">
            <SubscriptionManagement />

            <Card>
              <CardHeader>
                <CardTitle>{t('settings.subscriptions.discoverTitle')}</CardTitle>
                <CardDescription>{t('settings.subscriptions.discoverSubtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">{t('settings.subscriptions.exploreMessage')}</p>
                  <Button onClick={() => router.push('/browse')}>
                    {t('settings.subscriptions.browseCreators')}
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