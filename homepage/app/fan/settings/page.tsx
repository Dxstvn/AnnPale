'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import {
  Settings, User, Bell, Shield, Globe, CreditCard, Smartphone,
  Eye, Lock, Mail, Phone, Camera, Check, X, AlertCircle,
  ChevronRight, Moon, Sun, Volume2, Vibrate, Download, Trash2,
  LogOut, HelpCircle, FileText, Heart, Flag, Users, Star, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Textarea } from '@/components/ui/textarea'
import { SubscriptionManagement } from '@/components/subscription/subscription-management'

export default function CustomerSettingsPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTab, setSelectedTab] = useState('profile')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [profileImage, setProfileImage] = useState('/api/placeholder/100/100')
  
  // Set the tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setSelectedTab(tab)
    }
  }, [searchParams])
  
  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    language: 'en',
    timezone: 'America/New_York',
    joinDate: 'January 2024'
  }

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailMessages: true,
    emailBookings: true,
    emailPromotions: false,
    pushMessages: true,
    pushBookings: true,
    pushLivestreams: true,
    smsBookings: false,
    smsReminders: false
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'friends',
    showActivity: true,
    allowMessages: 'everyone',
    dataCollection: true,
    personalization: true
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    soundEffects: true,
    vibration: true,
    autoplayVideos: true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Settings className="mr-3 h-8 w-8" />
                {'Settings'}
              </h1>
              <p className="mt-2 text-purple-100">
                {'Manage your account and preferences'}
              </p>
            </div>
            <Button variant="secondary" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <SubscriptionManagement />

            <Card>
              <CardHeader>
                <CardTitle>Recommended Creators</CardTitle>
                <CardDescription>Discover new creators based on your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock recommended creators */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>CR</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Creator Name</p>
                          <p className="text-sm text-gray-500">Music · Entertainment</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => router.push('/browse')}>View Profile</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                    <AvatarImage src={profileImage} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={userData.name} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={userData.email} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue={userData.phone} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue={userData.language}>
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
                    <Select defaultValue={userData.timezone}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself..." 
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what emails you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Messages from creators</p>
                    <p className="text-sm text-gray-500">Get notified when creators send you messages</p>
                  </div>
                  <Switch 
                    checked={notifications.emailMessages}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailMessages: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking confirmations</p>
                    <p className="text-sm text-gray-500">Receive confirmations for your bookings</p>
                  </div>
                  <Switch 
                    checked={notifications.emailBookings}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailBookings: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotional emails</p>
                    <p className="text-sm text-gray-500">Special offers and announcements</p>
                  </div>
                  <Switch 
                    checked={notifications.emailPromotions}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailPromotions: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage your mobile app notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New messages</p>
                    <p className="text-sm text-gray-500">Instant notifications for new messages</p>
                  </div>
                  <Switch 
                    checked={notifications.pushMessages}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushMessages: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking updates</p>
                    <p className="text-sm text-gray-500">Updates about your bookings</p>
                  </div>
                  <Switch 
                    checked={notifications.pushBookings}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushBookings: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Live stream alerts</p>
                    <p className="text-sm text-gray-500">When your favorite creators go live</p>
                  </div>
                  <Switch 
                    checked={notifications.pushLivestreams}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushLivestreams: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show activity status</p>
                    <p className="text-sm text-gray-500">Let others see when you're online</p>
                  </div>
                  <Switch 
                    checked={privacy.showActivity}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showActivity: checked})}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="message-privacy">Who can message you</Label>
                  <Select value={privacy.allowMessages} onValueChange={(value) => setPrivacy({...privacy, allowMessages: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="creators">Creators Only</SelectItem>
                      <SelectItem value="none">No One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data collection for analytics</p>
                    <p className="text-sm text-gray-500">Help us improve by sharing usage data</p>
                  </div>
                  <Switch 
                    checked={privacy.dataCollection}
                    onCheckedChange={(checked) => setPrivacy({...privacy, dataCollection: checked})}
                  />
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Your privacy matters</AlertTitle>
                  <AlertDescription>
                    We never sell your personal data. Read our privacy policy for more details.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the app looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <Button
                      variant={appearance.theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, theme: 'light'})}
                      className="justify-start"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={appearance.theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, theme: 'dark'})}
                      className="justify-start"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={appearance.theme === 'auto' ? 'default' : 'outline'}
                      onClick={() => setAppearance({...appearance, theme: 'auto'})}
                      className="justify-start"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Auto
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select value={appearance.fontSize} onValueChange={(value) => setAppearance({...appearance, fontSize: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sound effects</p>
                      <p className="text-sm text-gray-500">Play sounds for notifications</p>
                    </div>
                    <Switch 
                      checked={appearance.soundEffects}
                      onCheckedChange={(checked) => setAppearance({...appearance, soundEffects: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vibration</p>
                      <p className="text-sm text-gray-500">Vibrate for notifications</p>
                    </div>
                    <Switch 
                      checked={appearance.vibration}
                      onCheckedChange={(checked) => setAppearance({...appearance, vibration: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autoplay videos</p>
                      <p className="text-sm text-gray-500">Automatically play videos when scrolling</p>
                    </div>
                    <Switch 
                      checked={appearance.autoplayVideos}
                      onCheckedChange={(checked) => setAppearance({...appearance, autoplayVideos: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Trusted Devices</p>
                      <p className="text-sm text-gray-500">Manage your trusted devices</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Manage
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Security Tip</AlertTitle>
                  <AlertDescription>
                    Use a unique password and enable two-factor authentication for maximum security.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Download your data</p>
                      <p className="text-sm text-gray-500">Get a copy of all your Ann Pale data</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Account Status</p>
                      <p className="text-sm text-gray-500">Member since {userData.joinDate}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Deactivate Account</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Temporarily disable your account. You can reactivate it anytime.
                    </AlertDescription>
                    <Button variant="outline" className="mt-3 text-yellow-700 border-yellow-600">
                      Deactivate Account
                    </Button>
                  </Alert>

                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Delete Account</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Permanently delete your account and all associated data. This cannot be undone.
                    </AlertDescription>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-3 text-red-600 border-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive">
                            Delete Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex-1 md:flex-initial">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="outline" className="flex-1 md:flex-initial">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help Center
              </Button>
              <Button variant="outline" className="flex-1 md:flex-initial">
                <FileText className="h-4 w-4 mr-2" />
                Terms of Service
              </Button>
              <Button variant="outline" className="flex-1 md:flex-initial">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}