"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const contactMethods = [
  {
    title: "Email Support",
    description: "Get help via email",
    icon: Mail,
    contact: "support@annpale.com",
    response: "Within 4 hours",
  },
  {
    title: "Live Chat",
    description: "Chat with our team",
    icon: MessageCircle,
    contact: "Available 24/7",
    response: "Instant response",
  },
  {
    title: "Phone Support",
    description: "Speak with us directly",
    icon: Phone,
    contact: "+1 (305) 555-0123",
    response: "Mon-Fri 9AM-6PM EST",
  },
]

const offices = [
  {
    city: "Miami, FL",
    address: "1234 Biscayne Blvd, Suite 567, Miami, FL 33132",
    phone: "+1 (305) 555-0123",
    email: "miami@annpale.com",
  },
  {
    city: "Port-au-Prince, Haiti",
    address: "123 Rue Capois, Port-au-Prince, Haiti",
    phone: "+509 1234-5678",
    email: "haiti@annpale.com",
  },
  {
    city: "Montreal, QC",
    address: "456 Rue Saint-Catherine, Montreal, QC H3B 1A7",
    phone: "+1 (514) 555-0123",
    email: "montreal@annpale.com",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    // Handle form submission
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Have questions, feedback, or need support? We're here to help! Reach out to us through any of the methods
            below.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method) => (
              <Card key={method.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <method.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  <p className="font-medium text-gray-900 mb-1">{method.contact}</p>
                  <p className="text-sm text-gray-500">{method.response}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="creator">Creator Support</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="safety">Safety & Security</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="press">Press & Media</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="Please provide as much detail as possible..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ & Quick Links */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Frequently Asked Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-1">How long does it take to get a response?</h4>
                        <p className="text-sm text-gray-600">
                          We typically respond within 4 hours during business hours.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Can I track my support ticket?</h4>
                        <p className="text-sm text-gray-600">
                          Yes, you'll receive a ticket number via email to track your request.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Do you offer phone support?</h4>
                        <p className="text-sm text-gray-600">
                          Yes, phone support is available Monday-Friday, 9AM-6PM EST.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                      <Link href="/help">View All FAQs</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">Monday - Friday</p>
                          <p className="text-sm text-gray-600">9:00 AM - 6:00 PM EST</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">Saturday - Sunday</p>
                          <p className="text-sm text-gray-600">10:00 AM - 4:00 PM EST</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">Live Chat</p>
                          <p className="text-sm text-gray-600">Available 24/7</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Offices</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office) => (
              <Card key={office.city}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span>{office.city}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">{office.address}</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{office.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
