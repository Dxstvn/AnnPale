"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Cookie, Calendar, Settings, Eye, Target, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const cookieCategories = [
  {
    name: "Essential Cookies",
    description: "Required for basic platform functionality and security",
    icon: Zap,
    required: true,
    examples: ["Authentication", "Security", "Load balancing", "Form submissions"],
  },
  {
    name: "Analytics Cookies",
    description: "Help us understand how visitors interact with our platform",
    icon: Eye,
    required: false,
    examples: ["Page views", "User behavior", "Performance metrics", "Error tracking"],
  },
  {
    name: "Functional Cookies",
    description: "Remember your preferences and settings",
    icon: Settings,
    required: false,
    examples: ["Language preferences", "Theme settings", "Recently viewed", "Saved searches"],
  },
  {
    name: "Marketing Cookies",
    description: "Used to deliver personalized advertisements",
    icon: Target,
    required: false,
    examples: ["Ad targeting", "Campaign tracking", "Social media integration", "Retargeting"],
  },
]

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false,
  })

  const handlePreferenceChange = (category: string, enabled: boolean) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: enabled,
    }))
  }

  const savePreferences = () => {
    console.log("Saving cookie preferences:", cookiePreferences)
    // Handle saving preferences
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>🎤</span>
                <span>Ann Pale</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                  Browse
                </Link>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                  Categories
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How it works
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Cookie className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Cookie Policy</h1>
          <div className="flex items-center justify-center space-x-2 text-lg opacity-90">
            <Calendar className="h-5 w-5" />
            <span>Last updated: January 1, 2024</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us
                provide you with a better experience by remembering your preferences, analyzing how you use our
                platform, and personalizing content.
              </p>
              <p className="text-gray-600">
                This Cookie Policy explains what cookies are, how we use them, and how you can control them.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Categories */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cookieCategories.map((category) => (
                  <div key={category.name} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <category.icon className="h-6 w-6 text-purple-600" />
                        <div>
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {category.required ? (
                          <Badge variant="secondary">Required</Badge>
                        ) : (
                          <Switch
                            checked={
                              cookiePreferences[
                                category.name.toLowerCase().split(" ")[0] as keyof typeof cookiePreferences
                              ]
                            }
                            onCheckedChange={(checked) =>
                              handlePreferenceChange(category.name.toLowerCase().split(" ")[0], checked)
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example) => (
                          <Badge key={example} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button onClick={savePreferences} className="bg-purple-600 hover:bg-purple-700">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Platform Functionality</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Keep you logged in during your session</li>
                    <li>Remember your language and region preferences</li>
                    <li>Maintain your shopping cart contents</li>
                    <li>Ensure platform security and prevent fraud</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Analytics and Performance</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Understand how visitors use our platform</li>
                    <li>Identify popular content and features</li>
                    <li>Monitor platform performance and errors</li>
                    <li>Improve user experience based on usage patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Personalization</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Show relevant creator recommendations</li>
                    <li>Remember your recently viewed content</li>
                    <li>Customize the interface based on your preferences</li>
                    <li>Provide personalized marketing content</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We also use cookies from trusted third-party services to enhance your experience:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-gray-600 text-sm">
                    Helps us understand website traffic and user behavior to improve our services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Stripe</h4>
                  <p className="text-gray-600 text-sm">
                    Processes payments securely and prevents fraudulent transactions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Social Media Platforms</h4>
                  <p className="text-gray-600 text-sm">
                    Enable social sharing features and track the effectiveness of our social media campaigns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Browser Settings</h4>
                  <p className="text-gray-600 text-sm mb-2">You can control cookies through your browser settings:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set cookies to expire when you close your browser</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Platform Settings</h4>
                  <p className="text-gray-600 text-sm">
                    Use the cookie preference controls above to customize which types of cookies you want to allow on
                    our platform.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Impact of Disabling Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    Please note that disabling certain cookies may affect the functionality of our platform. Essential
                    cookies are required for basic operations and cannot be disabled.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Lifespan */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cookie Lifespan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Session Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    Temporary cookies that are deleted when you close your browser. Used for essential functions like
                    maintaining your login session.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                  <p className="text-gray-600 text-sm">
                    Remain on your device for a set period or until you delete them. Used for remembering preferences
                    and analyzing long-term usage patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to Cookie Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Updates to This Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                updated policy on this page.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Questions About Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>Email: privacy@annpale.com</p>
                <p>Phone: +1 (305) 555-0123</p>
              </div>
              <Button className="mt-4" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Back to Top */}
          <div className="text-center">
            <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
