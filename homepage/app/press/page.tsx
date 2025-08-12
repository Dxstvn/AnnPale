import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

const pressReleases = [
  {
    title: "Ann Pale Raises $5M Series A to Expand Haitian Creator Economy Platform",
    date: "March 15, 2024",
    excerpt:
      "Leading venture capital firms invest in platform connecting global Haitian diaspora with their favorite creators through personalized video messages.",
    category: "Funding",
  },
  {
    title: "Ann Pale Surpasses 50,000 Video Messages Created, $1M Earned by Creators",
    date: "February 8, 2024",
    excerpt:
      "Platform celebrates major milestone as Haitian creators worldwide build sustainable income streams through personalized fan interactions.",
    category: "Milestone",
  },
  {
    title: "Ann Pale Partners with Haitian Cultural Organizations for Heritage Month",
    date: "January 20, 2024",
    excerpt:
      "New initiative brings together creators and cultural institutions to celebrate Haitian heritage through exclusive video content and educational programming.",
    category: "Partnership",
  },
  {
    title: "Ann Pale Launches in Canada, Expanding to Serve Montreal's Haitian Community",
    date: "December 12, 2023",
    excerpt:
      "Platform expansion brings personalized creator content to one of North America's largest Haitian diaspora communities.",
    category: "Expansion",
  },
]

const mediaKit = [
  {
    title: "Company Logo Pack",
    description: "High-resolution logos in various formats and color schemes",
    fileType: "ZIP",
    size: "2.3 MB",
  },
  {
    title: "Brand Guidelines",
    description: "Complete brand identity guidelines and usage instructions",
    fileType: "PDF",
    size: "1.8 MB",
  },
  {
    title: "Executive Photos",
    description: "Professional headshots of leadership team",
    fileType: "ZIP",
    size: "5.2 MB",
  },
  {
    title: "Product Screenshots",
    description: "High-quality screenshots of platform interface",
    fileType: "ZIP",
    size: "3.7 MB",
  },
]

const mediaFeatures = [
  {
    outlet: "TechCrunch",
    title: "Ann Pale is Building the Cameo for Haitian Creators",
    date: "March 20, 2024",
    url: "#",
  },
  {
    outlet: "The Miami Herald",
    title: "Local Startup Connects Haitian Diaspora Through Video Messages",
    date: "February 15, 2024",
    url: "#",
  },
  {
    outlet: "Caribbean Business",
    title: "Digital Platform Empowers Haitian Creators Worldwide",
    date: "January 30, 2024",
    url: "#",
  },
  {
    outlet: "Haitian Times",
    title: "Ann Pale: A New Way for Haitians to Connect Globally",
    date: "December 18, 2023",
    url: "#",
  },
]

const awards = [
  {
    title: "Best Startup - Caribbean Tech Awards 2024",
    organization: "Caribbean Tech Association",
    year: "2024",
  },
  {
    title: "Innovation in Creator Economy - Miami Tech Week",
    organization: "Miami Tech Week",
    year: "2024",
  },
  {
    title: "Rising Star - Black Tech Awards",
    organization: "Black Tech Awards",
    year: "2023",
  },
]

export default function PressPage() {
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
          <h1 className="text-5xl font-bold mb-6">Press & Media</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Get the latest news, updates, and media resources about Ann Pale. We're building the future of the creator
            economy for the Haitian diaspora.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
            <Link href="/contact">Media Inquiries</Link>
          </Button>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Latest Press Releases</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="secondary">{release.category}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{release.date}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-3">{release.title}</CardTitle>
                      <p className="text-gray-600">{release.excerpt}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Media Coverage</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {mediaFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <Badge variant="outline">{feature.outlet}</Badge>
                        <span className="text-sm text-gray-600">{feature.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={feature.url}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Awards & Recognition</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {awards.map((award, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                  <p className="text-gray-600 mb-1">{award.organization}</p>
                  <Badge variant="secondary">{award.year}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Media Kit</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {mediaKit.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{item.fileType}</span>
                    <span>{item.size}</span>
                  </div>
                  <Button size="sm" className="w-full">
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">By the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <p className="text-gray-600">Verified Creators</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <p className="text-gray-600">Videos Created</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">25+</div>
              <p className="text-gray-600">Countries Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">$1M+</div>
              <p className="text-gray-600">Earned by Creators</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
          <p className="text-xl mb-8 opacity-90">
            For press inquiries, interviews, or additional information, please contact our media team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="mailto:press@annpale.com">press@annpale.com</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Form</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
