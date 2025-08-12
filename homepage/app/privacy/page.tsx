"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Calendar, Eye, Lock, Database, UserCheck } from "lucide-react"
import Link from "next/link"

const dataTypes = [
  {
    category: "Account Information",
    description: "Name, email address, phone number, profile information",
    icon: UserCheck,
  },
  {
    category: "Payment Information",
    description: "Billing address, payment method details (processed securely by third parties)",
    icon: Lock,
  },
  {
    category: "Usage Data",
    description: "How you interact with our platform, features used, time spent",
    icon: Eye,
  },
  {
    category: "Device Information",
    description: "IP address, browser type, device type, operating system",
    icon: Database,
  },
]

export default function PrivacyPage() {
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
          <Shield className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
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
              <CardTitle>Your Privacy Matters</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-600">
                At Ann Pale, we are committed to protecting your privacy and personal information. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our platform and
                services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {dataTypes.map((type) => (
                  <div key={type.category} className="flex items-start space-x-3">
                    <type.icon className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">{type.category}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Platform Operations</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Provide and maintain our services</li>
                    <li>Process transactions and payments</li>
                    <li>Facilitate communication between creators and customers</li>
                    <li>Verify creator identities and maintain platform security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Communication</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Send important updates about your account or orders</li>
                    <li>Respond to your inquiries and provide customer support</li>
                    <li>Send marketing communications (with your consent)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Improvement & Analytics</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Analyze platform usage to improve our services</li>
                    <li>Develop new features and functionality</li>
                    <li>Ensure platform security and prevent fraud</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. How We Share Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">With Creators</h4>
                  <p className="text-gray-600">
                    When you book a video, we share necessary information (name, request details) with the creator to
                    fulfill your order.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Providers</h4>
                  <p className="text-gray-600">
                    We work with trusted third-party service providers for payment processing, email delivery,
                    analytics, and other essential services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Requirements</h4>
                  <p className="text-gray-600">
                    We may disclose information when required by law, to protect our rights, or to ensure platform
                    safety and security.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Transfers</h4>
                  <p className="text-gray-600">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                    part of the business transaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Security Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Industry-standard encryption for data transmission and storage</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Secure payment processing through PCI-compliant providers</li>
                    <li>Access controls and authentication measures for our systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Retention</h4>
                  <p className="text-gray-600">
                    We retain your personal information only as long as necessary to provide our services and comply
                    with legal obligations. You can request deletion of your account and data at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Access & Correction</h4>
                  <p className="text-gray-600">
                    You can access and update your personal information through your account settings or by contacting
                    our support team.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Portability</h4>
                  <p className="text-gray-600">
                    You can request a copy of your personal data in a structured, machine-readable format.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deletion</h4>
                  <p className="text-gray-600">
                    You can request deletion of your account and personal data, subject to legal and contractual
                    obligations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Marketing Communications</h4>
                  <p className="text-gray-600">
                    You can opt out of marketing emails at any time by clicking the unsubscribe link or updating your
                    preferences in your account settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What Are Cookies</h4>
                  <p className="text-gray-600">
                    Cookies are small data files stored on your device that help us provide and improve our services.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How We Use Cookies</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Essential cookies for platform functionality</li>
                    <li>Analytics cookies to understand how you use our platform</li>
                    <li>Preference cookies to remember your settings</li>
                    <li>Marketing cookies for personalized advertising (with consent)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cookie Control</h4>
                  <p className="text-gray-600">
                    You can control cookies through your browser settings. Note that disabling certain cookies may
                    affect platform functionality.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 bg-transparent" asChild>
                <Link href="/cookies">View Cookie Policy</Link>
              </Button>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place to protect your data in accordance with applicable privacy laws and
                regulations.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our platform is not intended for children under 18 years of age. We do not knowingly collect personal
                information from children under 18. If you believe we have collected information from a child under 18,
                please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>9. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to
                review this Privacy Policy periodically.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>Email: privacy@annpale.com</p>
                <p>Phone: +1 (305) 555-0123</p>
                <p>Address: 1234 Biscayne Blvd, Suite 567, Miami, FL 33132</p>
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
