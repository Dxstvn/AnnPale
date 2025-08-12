import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Eye, Lock, UserCheck, Flag } from "lucide-react"
import Link from "next/link"

const safetyFeatures = [
  {
    title: "Identity Verification",
    description: "All creators go through a thorough verification process before joining our platform.",
    icon: UserCheck,
  },
  {
    title: "Content Moderation",
    description: "We review all videos to ensure they meet our community standards and guidelines.",
    icon: Eye,
  },
  {
    title: "Secure Payments",
    description: "All transactions are processed through encrypted, PCI-compliant payment systems.",
    icon: Lock,
  },
  {
    title: "Report System",
    description: "Easy-to-use reporting tools to flag inappropriate content or behavior.",
    icon: Flag,
  },
]

const guidelines = [
  {
    category: "Prohibited Content",
    rules: [
      "No hate speech, harassment, or discriminatory content",
      "No explicit sexual content or nudity",
      "No violence, threats, or harmful behavior",
      "No illegal activities or promotion of illegal substances",
      "No spam, scams, or fraudulent activities",
    ],
  },
  {
    category: "Creator Responsibilities",
    rules: [
      "Deliver videos within promised timeframes",
      "Create content that matches the customer's request",
      "Maintain professional and respectful communication",
      "Respect intellectual property and copyright laws",
      "Follow all applicable local laws and regulations",
    ],
  },
  {
    category: "Customer Guidelines",
    rules: [
      "Provide clear and appropriate video requests",
      "Respect creators' boundaries and guidelines",
      "Do not request illegal or harmful content",
      "Use videos for personal purposes only (unless agreed otherwise)",
      "Report any issues or concerns promptly",
    ],
  },
]

export default function SafetyPage() {
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
          <h1 className="text-5xl font-bold mb-6">Safety & Security</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Your safety is our top priority. Learn about the measures we take to protect our community and how you can
            stay safe on Ann Pale.
          </p>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How We Keep You Safe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Community Guidelines</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {guidelines.map((section) => (
              <Card key={section.category}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.rules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Reporting Issues</h2>

            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                If you encounter any content or behavior that violates our guidelines, please report it immediately. We
                take all reports seriously and investigate them promptly.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>How to Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">1. Use the Report Button</h4>
                      <p className="text-gray-600 text-sm">
                        Every creator profile and video has a report button. Click it to start the reporting process.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">2. Provide Details</h4>
                      <p className="text-gray-600 text-sm">
                        Give us as much information as possible about the issue, including screenshots if relevant.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">3. We Investigate</h4>
                      <p className="text-gray-600 text-sm">
                        Our team reviews all reports within 24 hours and takes appropriate action.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What Happens Next</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Immediate Action</h4>
                      <p className="text-gray-600 text-sm">
                        Serious violations may result in immediate suspension of accounts or removal of content.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Investigation</h4>
                      <p className="text-gray-600 text-sm">
                        We thoroughly investigate all reports and may contact you for additional information.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Follow-up</h4>
                      <p className="text-gray-600 text-sm">
                        We'll notify you of the outcome and any actions taken as a result of your report.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Safety Tips</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>For Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Only share personal information you're comfortable with</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Review creator profiles and ratings before booking</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Report any inappropriate content or requests</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Keep all communication within the platform</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>For Creators</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        Set clear boundaries about what content you will/won't create
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Never share personal contact information</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Report any inappropriate or concerning requests</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">
                        Trust your instincts - decline requests that make you uncomfortable
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need to Report Something?</h2>
          <p className="text-xl mb-8 opacity-90">
            If you have safety concerns or need to report an issue, we're here to help 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Report an Issue
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
