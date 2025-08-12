import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Users, Code, Megaphone, Heart } from "lucide-react"
import Link from "next/link"

const jobOpenings = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote (Americas)",
    type: "Full-time",
    salary: "$120k - $160k",
    description:
      "Help us build the next generation of creator economy tools. You'll work on our core platform, mobile apps, and creator dashboard.",
    requirements: [
      "5+ years React/Node.js experience",
      "Experience with video streaming",
      "Startup experience preferred",
    ],
    icon: Code,
  },
  {
    title: "Creator Success Manager",
    department: "Creator Relations",
    location: "Miami, FL / Remote",
    type: "Full-time",
    salary: "$70k - $90k",
    description:
      "Be the bridge between our platform and our amazing creators. Help them succeed and grow their earnings.",
    requirements: ["Experience in creator economy", "Fluent in Haitian Creole", "Strong communication skills"],
    icon: Users,
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $100k",
    description:
      "Lead our marketing efforts to reach Haitian communities worldwide and grow our creator and customer base.",
    requirements: ["5+ years marketing experience", "Social media expertise", "Understanding of Haitian culture"],
    icon: Megaphone,
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $120k",
    description:
      "Design beautiful, intuitive experiences for creators and fans. Help us make video creation seamless and joyful.",
    requirements: ["4+ years product design", "Mobile design experience", "Portfolio required"],
    icon: Heart,
  },
]

const benefits = [
  "Competitive salary and equity package",
  "Comprehensive health, dental, and vision insurance",
  "Unlimited PTO and flexible work arrangements",
  "Annual learning and development budget ($2,000)",
  "Top-tier equipment and home office setup",
  "Annual company retreat in Haiti",
  "Mental health and wellness support",
  "Parental leave (16 weeks paid)",
]

const values = [
  {
    title: "Culture First",
    description: "We celebrate and amplify Haitian culture in everything we do.",
  },
  {
    title: "Creator Obsessed",
    description: "Our creators' success is our success. We build for them first.",
  },
  {
    title: "Move Fast",
    description: "We ship quickly, learn from feedback, and iterate constantly.",
  },
  {
    title: "Think Global",
    description: "We're building for the global Haitian diaspora.",
  },
]

export default function CareersPage() {
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
          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Help us build the future of the creator economy while celebrating Haitian culture worldwide. We're looking
            for passionate people who want to make a real impact.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            View Open Positions
          </Button>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Benefits & Perks</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Open Positions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <job.icon className="h-8 w-8 text-purple-600" />
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{job.department}</Badge>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Life at Ann Pale</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Remote-First Culture</h3>
                <p className="text-gray-600">
                  We believe great work happens anywhere. Our team spans multiple time zones, and we've built processes
                  that make remote collaboration seamless.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Learning & Growth</h3>
                <p className="text-gray-600">
                  We invest in our team's growth with learning budgets, mentorship programs, and opportunities to attend
                  conferences and workshops.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Impact-Driven Work</h3>
                <p className="text-gray-600">
                  Every day, you'll see how your work directly impacts creators' lives and helps strengthen the global
                  Haitian community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're always looking for talented people who share our mission. Send us your resume!
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
