import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, MessageCircle, Mail, Phone, Book, Users, CreditCard, Video } from "lucide-react"
import Link from "next/link"

const faqCategories = [
  {
    title: "Getting Started",
    icon: Book,
    faqs: [
      {
        question: "How do I create an account on Ann Pale?",
        answer:
          "Creating an account is easy! Click the 'Sign up' button in the top right corner, choose whether you're a customer or creator, and fill out the required information. For customers, you'll be able to start booking videos immediately. For creators, your application will be reviewed within 2-3 business days.",
      },
      {
        question: "What types of videos can I request?",
        answer:
          "You can request various types of personalized videos including birthday messages, congratulations, motivational messages, holiday greetings, or just a general shout-out. Each creator may have their own specialties and preferences, which you can see on their profile.",
      },
      {
        question: "How long does it take to receive my video?",
        answer:
          "Delivery times vary by creator, typically ranging from 24 hours to 7 days. You can see each creator's average response time on their profile. Most creators deliver within 2-3 days.",
      },
    ],
  },
  {
    title: "For Customers",
    icon: Users,
    faqs: [
      {
        question: "How do I book a video from a creator?",
        answer:
          "Browse our creators, select the one you want, click 'Book Video', fill out your request details including who the video is for and what you'd like them to say, then complete your payment. You'll receive email updates throughout the process.",
      },
      {
        question: "Can I request a refund if I'm not satisfied?",
        answer:
          "Yes! If your video doesn't meet our quality standards or the creator doesn't deliver within their promised timeframe, you're eligible for a full refund. Contact our support team within 7 days of delivery.",
      },
      {
        question: "Can I share the video I receive?",
        answer:
          "The videos are created specifically for you to share with friends, family, or on social media. However, please don't use them for commercial purposes without the creator's permission.",
      },
    ],
  },
  {
    title: "For Creators",
    icon: Video,
    faqs: [
      {
        question: "How do I become a creator on Ann Pale?",
        answer:
          "Apply through our creator signup form. We review applications based on your public profile, content quality, and audience engagement. The review process typically takes 2-3 business days.",
      },
      {
        question: "How much money can I earn?",
        answer:
          "Earnings vary based on your pricing and request volume. Creators keep 85% of each video's price. Top creators earn $1,000-$5,000+ per month. You set your own prices and can adjust them anytime.",
      },
      {
        question: "What if I can't fulfill a request?",
        answer:
          "You can decline any request that doesn't align with your values or comfort level. If you need to cancel an accepted request, contact support immediately so we can issue a refund to the customer.",
      },
    ],
  },
  {
    title: "Payments & Billing",
    icon: CreditCard,
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through Stripe.",
      },
      {
        question: "When do creators get paid?",
        answer:
          "Creators receive payment 24 hours after delivering their video, minus our 15% platform fee. Payments are sent via direct deposit, PayPal, or other supported methods.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No hidden fees! Customers pay exactly what's shown at checkout. Creators keep 85% of the video price, and we clearly display our 15% platform fee.",
      },
    ],
  },
]

const supportOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    action: "Start Chat",
    available: "24/7",
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    action: "Send Email",
    available: "Response within 4 hours",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our team",
    icon: Phone,
    action: "Call Now",
    available: "Mon-Fri 9AM-6PM EST",
  },
]

export default function HelpPage() {
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
          <h1 className="text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Find answers to common questions or get in touch with our support team. We're here to help you make the most
            of Ann Pale.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-3">
              <Search className="h-5 w-5" />
              <Input
                placeholder="Search for help..."
                className="border-0 bg-transparent placeholder:text-white/70 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Get Support</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {supportOptions.map((option) => (
              <Card key={option.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <option.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{option.available}</p>
                  <Button className="w-full">{option.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category) => (
              <Card key={category.title} className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <category.icon className="h-6 w-6 text-purple-600" />
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.title}-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Creator Guidelines</h3>
                <p className="text-sm text-gray-600 mb-4">Learn about our content policies and best practices</p>
                <Button variant="outline" size="sm">
                  View Guidelines
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Safety Center</h3>
                <p className="text-sm text-gray-600 mb-4">Information about staying safe on our platform</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/safety">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Terms of Service</h3>
                <p className="text-sm text-gray-600 mb-4">Read our terms and conditions</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/terms">Read Terms</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Privacy Policy</h3>
                <p className="text-sm text-gray-600 mb-4">How we protect your personal information</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/privacy">View Policy</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
