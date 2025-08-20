import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MessageCircle, Video, Clock, Shield, Heart } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layouts/header"

export default function HowItWorksPage() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">How Ann Pale Works</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get personalized video messages from your favorite Haitian creators in 3 simple steps
          </p>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Browse & Book</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Browse through our amazing collection of Haitian creators. Choose your favorite artist, musician,
                comedian, or influencer and book a personalized video message.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-12 w-12 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Share Your Request</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Tell your chosen creator what you'd like them to say. Whether it's birthday wishes, congratulations, or
                just a hello in Kreyòl, make it personal and special.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="h-12 w-12 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Receive & Share</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Your creator will record a personalized video message just for you. Download it, share it, and make
                someone's day unforgettable!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Ann Pale?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Quick Turnaround</h3>
              <p className="text-gray-700">
                Most creators respond within 24-72 hours with your personalized video message.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Satisfaction</h3>
              <p className="text-gray-700">
                If you're not happy with your video, we'll work with the creator to make it right.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
              <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Authentic Connections</h3>
              <p className="text-gray-700">
                Connect with genuine Haitian culture through personalized messages from real creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">How long does it take to receive my video?</h3>
              <p className="text-gray-600">
                Most creators deliver videos within 24-72 hours. You can see each creator's typical response time on
                their profile.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">What if I'm not satisfied with my video?</h3>
              <p className="text-gray-600">
                We offer a satisfaction guarantee. If your video doesn't meet the requirements you specified, we'll work
                with the creator to make it right or provide a refund.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Can I request videos in Haitian Creole?</h3>
              <p className="text-gray-600">
                Many of our creators are fluent in Haitian Creole and would be happy to record your message in Kreyòl.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">How much do videos cost?</h3>
              <p className="text-gray-600">
                Prices vary by creator, typically ranging from $50 to $300. Each creator sets their own price based on
                their popularity and demand.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Can I use the video for commercial purposes?</h3>
              <p className="text-gray-600">
                Standard videos are for personal use only. If you need commercial rights, please contact the creator
                directly to discuss licensing options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our amazing Haitian creators and book your first personalized video message today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/browse">Browse Creators</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
    </div>
  )
}
