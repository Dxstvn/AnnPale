"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollText, Calendar } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
          <ScrollText className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
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
              <CardTitle>Welcome to Ann Pale</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600">
                These Terms of Service ("Terms") govern your use of the Ann Pale platform and services. By accessing or
                using our platform, you agree to be bound by these Terms. If you disagree with any part of these terms,
                then you may not access the service.
              </p>
            </CardContent>
          </Card>

          {/* Definitions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>1. Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">"Platform"</h4>
                  <p className="text-gray-600">
                    Refers to the Ann Pale website, mobile applications, and related services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">"Creator"</h4>
                  <p className="text-gray-600">
                    A verified individual who creates personalized video content for customers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">"Customer"</h4>
                  <p className="text-gray-600">A user who purchases personalized video content from creators.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">"Content"</h4>
                  <p className="text-gray-600">All videos, text, images, and other materials shared on the platform.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>2. Account Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">2.1 Eligibility</h4>
                  <p className="text-gray-600">
                    You must be at least 18 years old to create an account. By creating an account, you represent that
                    you are of legal age to form a binding contract.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2.2 Account Information</h4>
                  <p className="text-gray-600">
                    You must provide accurate, current, and complete information during registration and keep your
                    account information updated.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2.3 Account Security</h4>
                  <p className="text-gray-600">
                    You are responsible for maintaining the confidentiality of your account credentials and for all
                    activities that occur under your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Use */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. Platform Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">3.1 Permitted Use</h4>
                  <p className="text-gray-600">
                    You may use the platform to request, create, and share personalized video content in accordance with
                    these Terms and our Community Guidelines.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3.2 Prohibited Activities</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Violating any applicable laws or regulations</li>
                    <li>Infringing on intellectual property rights</li>
                    <li>Harassing, threatening, or abusing other users</li>
                    <li>Sharing inappropriate or offensive content</li>
                    <li>Attempting to circumvent platform security measures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>4. Creator-Specific Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">4.1 Creator Application</h4>
                  <p className="text-gray-600">
                    Creator applications are subject to review and approval. We reserve the right to reject applications
                    at our discretion.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4.2 Content Creation</h4>
                  <p className="text-gray-600">
                    Creators must deliver videos within the promised timeframe and ensure content meets quality
                    standards and customer requests.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4.3 Revenue Sharing</h4>
                  <p className="text-gray-600">
                    Creators receive 85% of the video price, with Ann Pale retaining 15% as a platform fee. Payments are
                    processed within 24 hours of video delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">5.1 Pricing</h4>
                  <p className="text-gray-600">
                    Video prices are set by individual creators. All prices are displayed in USD and include applicable
                    taxes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">5.2 Payment Processing</h4>
                  <p className="text-gray-600">
                    Payments are processed securely through third-party payment processors. We do not store your payment
                    information.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">5.3 Refunds</h4>
                  <p className="text-gray-600">
                    Refunds may be issued if a creator fails to deliver within the promised timeframe or if the content
                    doesn't meet our quality standards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">6.1 Platform Content</h4>
                  <p className="text-gray-600">
                    The Ann Pale platform, including its design, features, and functionality, is owned by Ann Pale and
                    protected by copyright and other intellectual property laws.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">6.2 User Content</h4>
                  <p className="text-gray-600">
                    You retain ownership of content you create or upload. By using the platform, you grant us a license
                    to host, display, and distribute your content.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">6.3 Video Rights</h4>
                  <p className="text-gray-600">
                    Customers receive personal use rights to videos they purchase. Commercial use requires separate
                    agreement with the creator.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use,
                and protect your information when you use our platform.
              </p>
              <Button variant="outline" className="mt-4 bg-transparent" asChild>
                <Link href="/privacy">View Privacy Policy</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>8. Disclaimers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">8.1 Service Availability</h4>
                  <p className="text-gray-600">
                    We strive to maintain platform availability but cannot guarantee uninterrupted service. We may
                    suspend or modify services for maintenance or improvements.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">8.2 Creator Content</h4>
                  <p className="text-gray-600">
                    We are not responsible for the content, quality, or delivery of creator videos. Creators are
                    independent contractors, not employees of Ann Pale.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To the maximum extent permitted by law, Ann Pale shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including but not limited to loss of profits, data, or
                other intangible losses.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">10.1 By You</h4>
                  <p className="text-gray-600">
                    You may terminate your account at any time by contacting our support team or using the account
                    deletion feature in your settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">10.2 By Us</h4>
                  <p className="text-gray-600">
                    We may suspend or terminate your account if you violate these Terms or engage in activities that
                    harm the platform or other users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>11. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may update these Terms from time to time. We will notify you of any material changes by posting the
                new Terms on this page and updating the "Last updated" date. Your continued use of the platform
                constitutes acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>Email: legal@annpale.com</p>
                <p>Phone: +1 (305) 555-0123</p>
                <p>Address: 1234 Biscayne Blvd, Suite 567, Miami, FL 33132</p>
              </div>
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
