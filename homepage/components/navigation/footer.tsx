"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  MapPin,
  Phone,
  Send
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

export function Footer() {
  const { language } = useLanguage()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup")
  }

  const footerLinks = {
    forFans: [
      { label: "Browse Creators", href: "/browse" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Occasions", href: "/occasions" },
      { label: "FAQ", href: "/faq" },
    ],
    forCreators: [
      { label: "Become a Creator", href: "/signup?type=creator" },
      { label: "Creator Guidelines", href: "/creator-guidelines" },
      { label: "Pricing & Payments", href: "/pricing" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Resources", href: "/resources" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Community Guidelines", href: "/community" },
      { label: "Safety", href: "/safety" },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/annpale", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/annpale", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/annpale", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/annpale", label: "YouTube" },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎤</span>
              <span className="text-xl font-bold">Ann Pale</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Connecting the Haitian diaspora with beloved celebrities through personalized video messages. 
              Celebrate special moments with authentic connections.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                />
                <Button type="submit" size="icon" variant="primary">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* For Fans */}
          <div>
            <h4 className="font-semibold mb-4">For Fans</h4>
            <ul className="space-y-2">
              {footerLinks.forFans.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <h4 className="font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2">
              {footerLinks.forCreators.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a href="mailto:support@annpale.com" className="text-sm font-medium hover:text-purple-600">
                support@annpale.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <a href="tel:+1234567890" className="text-sm font-medium hover:text-purple-600">
                +1 (234) 567-890
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-sm font-medium">Miami, FL • Port-au-Prince, Haiti</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Ann Pale. All rights reserved.
            </p>
            
            {/* App Download Badges */}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-9">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                Google Play
              </Button>
            </div>

            {/* Language and Currency */}
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 hover:text-purple-600 transition">
                🇺🇸 English
              </button>
              <button className="flex items-center gap-1 hover:text-purple-600 transition">
                $ USD
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}