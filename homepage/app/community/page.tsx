import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Star, MessageCircle, Award, Flag } from "lucide-react"
import Link from "next/link"

const communityValues = [
  {
    title: "Respect & Kindness",
    description: "Treat all community members with respect, regardless of background, beliefs, or opinions.",
    icon: Heart,
  },
  {
    title: "Authentic Connections",
    description: "Foster genuine relationships between creators and fans through meaningful interactions.",
    icon: Users,
  },
  {
    title: "Cultural Celebration",
    description: "Celebrate and promote Haitian culture, traditions, and achievements.",
    icon: Star,
  },
  {
    title: "Constructive Communication",
    description: "Engage in positive, helpful discussions that build up our community.",
    icon: MessageCircle,
  },
]

const guidelines = [
  {
    category: "Be Respectful",
    rules: [
      "Treat everyone with dignity and respect",
      "No harassment, bullying, or personal attacks",
      "Respect different opinions and perspectives",
      "Use appropriate language in all interactions",
    ],
    icon: Heart,
  },
  {
    category: "Stay On Topic",
    rules: [
      "Keep discussions relevant to the platform and community",
      "Avoid spam or repetitive posting",
      "Share content that adds value to conversations",
      "Use appropriate channels for different types of content",
    ],
    icon: MessageCircle,
  },
  {
    category: "Support Each Other",
    rules: [
      "Help new members learn how to use the platform",
      "Share constructive feedback with creators",
      "Celebrate community achievements and milestones",
      "Report issues to help maintain a safe environment",
    ],
    icon: Users,
  },
  {
    category: "Quality Content",
    rules: [
      "Share high-quality, original content",
      "Respect intellectual property and copyright",
      "Avoid misleading or false information",
      "Follow platform-specific content guidelines",
    ],
    icon: Award,
  },
]

const reportingReasons = [
  "Harassment or bullying",
  "Hate speech or discrimination",
  "Spam or unwanted content",
  "Inappropriate or explicit content",
  "Copyright infringement",
  "Scam or fraudulent activity",
  "Impersonation",
  "Other safety concerns",
]

export default function CommunityPage() {
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
          <Users className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Community Guidelines</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Our community guidelines help create a safe, welcoming space where everyone can connect, create, and
            celebrate Haitian culture together.
          </p>
        </div>
      </section>

      {/* Community Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Community Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityValues.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Community Guidelines</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {guidelines.map((section) => (
              <Card key={section.category}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <section.icon className="h-6 w-6 text-purple-600" />
                    <span>{section.category}</span>
                  </CardTitle>
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

      {/* Consequences */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Enforcement & Consequences</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Warning System</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        First Violation
                      </Badge>
                      <p className="text-gray-600 text-sm">Warning message and guidance on community guidelines</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Second Violation
                      </Badge>
                      <p className="text-gray-600 text-sm">Temporary restriction of certain platform features</p>
                    </div>
                    <div>
                      <Badge variant="destructive" className="mb-2">
                        Serious/Repeated Violations
                      </Badge>
                      <p className="text-gray-600 text-sm">Account suspension or permanent ban from the platform</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appeal Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">1. Submit Appeal</h4>
                      <p className="text-gray-600 text-sm">Contact our support team within 7 days of the action</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">2. Review Process</h4>
                      <p className="text-gray-600 text-sm">Our team reviews your case and any additional evidence</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">3. Final Decision</h4>
                      <p className="text-gray-600 text-sm">You'll receive a response within 5 business days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Reporting Violations</h2>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Flag className="h-6 w-6 text-purple-600" />
                  <span>How to Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you see content or behavior that violates our community guidelines, please report it. Your reports
                  help us maintain a safe and positive environment for everyone.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Common Reporting Reasons:</h4>
                    <ul className="space-y-2">
                      {reportingReasons.map((reason, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">What to Include:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Specific details about the violation</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Screenshots or evidence (if applicable)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Links to the content or profile</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Any relevant context or background</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Report a Violation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Guidelines?</h2>
          <p className="text-xl mb-8 opacity-90">
            If you need clarification on any of our community guidelines, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/help">Visit Help Center</Link>
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
