"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
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

export function Footer() {
  const t = useTranslations('common.footer')
  const tCommon = useTranslations('common')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup")
  }

  const footerLinks = {
    forFans: [
      { label: tCommon('navigation.browse'), href: "/browse" },
      { label: tCommon('navigation.howItWorks'), href: "/how-it-works" },
      { label: t('giftCards', { defaultValue: 'Gift Cards' }), href: "/gift-cards" },
      { label: t('occasions', { defaultValue: 'Occasions' }), href: "/occasions" },
      { label: t('faq', { defaultValue: 'FAQ' }), href: "/faq" },
    ],
    forCreators: [
      { label: tCommon('cta.becomeCreator'), href: "/signup?type=creator" },
      { label: t('creatorGuidelines', { defaultValue: 'Creator Guidelines' }), href: "/creator-guidelines" },
      { label: t('pricingPayments', { defaultValue: 'Pricing & Payments' }), href: "/pricing" },
      { label: t('successStories', { defaultValue: 'Success Stories' }), href: "/success-stories" },
      { label: t('resources', { defaultValue: 'Resources' }), href: "/resources" },
    ],
    company: [
      { label: t('about'), href: "/about" },
      { label: t('careers'), href: "/careers" },
      { label: t('press'), href: "/press" },
      { label: t('blog'), href: "/blog" },
      { label: t('contact'), href: "/contact" },
    ],
    legal: [
      { label: t('termsOfService'), href: "/terms" },
      { label: t('privacyPolicy'), href: "/privacy" },
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
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎤</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Ann Pale</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('aboutAnnPale')}
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">{t('stayUpdated', { defaultValue: 'Stay Updated' })}</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t('enterEmail', { defaultValue: 'Enter your email' })}
                  className="flex-1 border-gray-300 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400"
                  required
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
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
                  className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <social.icon className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400" />
                </a>
              ))}
            </div>
          </div>

          {/* For Fans */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('forFans', { defaultValue: 'For Fans' })}</h4>
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
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('forCreators', { defaultValue: 'For Creators' })}</h4>
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
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('company')}</h4>
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
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('legal')}</h4>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
              <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('email', { defaultValue: 'Email' })}</p>
              <a href="mailto:support@annpale.com" className="text-sm font-medium hover:text-purple-600">
                support@annpale.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
              <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('phone', { defaultValue: 'Phone' })}</p>
              <a href="tel:+1234567890" className="text-sm font-medium hover:text-purple-600">
                +1 (234) 567-890
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('location', { defaultValue: 'Location' })}</p>
              <p className="text-sm font-medium">{t('locations', { defaultValue: 'Miami, FL • Port-au-Prince, Haiti' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Ann Pale. {t('allRightsReserved')}
            </p>
            
            {/* App Download Badges */}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="h-9 border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                {t('appStore', { defaultValue: 'App Store' })}
              </Button>
              <Button variant="outline" size="sm" className="h-9 border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                </svg>
                {t('googlePlay', { defaultValue: 'Google Play' })}
              </Button>
            </div>

            {/* Language and Currency */}
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition">
                🇺🇸 {tCommon('languages.english')}
              </button>
              <button className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition">
                $ {t('usd', { defaultValue: 'USD' })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}