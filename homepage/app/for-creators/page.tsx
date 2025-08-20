'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layouts/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DollarSign,
  Users,
  Video,
  Calendar,
  Star,
  Globe,
  Shield,
  TrendingUp,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Award,
  Zap,
  Gift,
  ChevronRight,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

const translations = {
  hero_title: {
    en: 'Become an Ann Pale Creator',
    fr: 'Devenez un créateur Ann Pale',
    ht: 'Vin yon kreyatè Ann Pale',
  },
  hero_subtitle: {
    en: 'Share your talent, connect with the Haitian diaspora, and earn money creating personalized videos',
    fr: "Partagez votre talent, connectez-vous avec la diaspora haïtienne et gagnez de l'argent en créant des vidéos personnalisées",
    ht: 'Pataje talan ou, konekte ak dyaspora ayisyen an, epi fè lajan ap kreye videyo pèsonalize',
  },
  start_earning: {
    en: 'Start Earning Today',
    fr: "Commencez à gagner aujourd'hui",
    ht: 'Kòmanse fè lajan jodi a',
  },
  learn_more: {
    en: 'Learn More',
    fr: 'En savoir plus',
    ht: 'Aprann plis',
  },
}

export default function ForCreatorsPage() {
  const { language } = useLanguage()
  const [requestCount, setRequestCount] = useState([3])
  const [pricePerVideo, setPricePerVideo] = useState([50])

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[language] || translations[key]?.en || key
  }

  const monthlyEarnings = requestCount[0] * pricePerVideo[0] * 4

  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn Money',
      description: 'Set your own prices and keep 85% of earnings',
      bgColor: 'bg-green-500',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with Haitians worldwide',
      bgColor: 'bg-blue-500',
    },
    {
      icon: Calendar,
      title: 'Flexible Schedule',
      description: 'Work on your own time, accept requests when you want',
      bgColor: 'bg-purple-500',
    },
    {
      icon: Heart,
      title: 'Make Impact',
      description: 'Create meaningful moments for your fans',
      bgColor: 'bg-pink-500',
    },
  ]

  const steps = [
    {
      number: '1',
      title: 'Sign Up',
      description: 'Create your creator account in minutes',
    },
    {
      number: '2',
      title: 'Set Up Profile',
      description: 'Add your bio, photos, and set your prices',
    },
    {
      number: '3',
      title: 'Receive Requests',
      description: 'Get notified when fans request videos',
    },
    {
      number: '4',
      title: 'Create Videos',
      description: 'Record personalized messages for your fans',
    },
    {
      number: '5',
      title: 'Get Paid',
      description: 'Receive payments directly to your account',
    },
  ]

  const requirements = [
    'Must be 18 years or older',
    'Connected to Haitian culture or community',
    'Good video and audio quality',
    'Reliable internet connection',
    'Commitment to respond within 7 days',
  ]

  const testimonials = [
    {
      name: 'Marie Pierre',
      role: 'Musician',
      avatar: '/api/placeholder/80/80',
      quote:
        "Ann Pale has allowed me to connect with my fans in a personal way while earning extra income. It's been amazing!",
      earnings: '$2,500/month',
      bgColor: 'bg-purple-500',
    },
    {
      name: 'Jean Baptiste',
      role: 'Comedian',
      avatar: '/api/placeholder/80/80',
      quote:
        'I love making people smile with personalized videos. The platform makes it so easy to manage requests.',
      earnings: '$3,200/month',
      bgColor: 'bg-pink-500',
    },
    {
      name: 'Sarah Johnson',
      role: 'Chef',
      avatar: '/api/placeholder/80/80',
      quote:
        'Teaching Haitian recipes through personalized videos has been so rewarding. My fans love the personal touch!',
      earnings: '$1,800/month',
      bgColor: 'bg-orange-500',
    },
  ]

  const faqs = [
    {
      question: 'How much can I earn?',
      answer:
        'Earnings depend on your pricing and request volume. Top creators earn $2,000-$5,000+ per month. You set your own prices and keep 85% of earnings.',
    },
    {
      question: 'How do I get paid?',
      answer:
        'Payments are processed weekly via direct deposit or PayPal. You can track all earnings in your creator dashboard.',
    },
    {
      question: 'What kind of videos do I create?',
      answer:
        'Birthday wishes, congratulations, motivational messages, holiday greetings, or any personalized message your fans request.',
    },
    {
      question: 'How much time does it take?',
      answer:
        'Most videos are 30-60 seconds long and take just a few minutes to create. You control how many requests you accept.',
    },
    {
      question: 'Do I need professional equipment?',
      answer:
        'No! A smartphone with good lighting is all you need. We provide tips to help you create great videos.',
    },
    {
      question: 'Can I decline requests?',
      answer: 'Yes, you have complete control over which requests you accept or decline.',
    },
  ]

  return (
    <div>
      <Header />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 border-white/30 bg-white/20 text-white">
                <Sparkles className="mr-1 h-3 w-3" />
                Join 500+ Creators
              </Badge>
              <h1 className="mb-6 text-4xl font-bold md:text-6xl">{t('hero_title')}</h1>
              <p className="mb-8 text-xl text-white/90">{t('hero_subtitle')}</p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50">
                    <Zap className="mr-2 h-5 w-5" />
                    {t('start_earning')}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Why Become a Creator?</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group h-full cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  <div
                    className={cn(
                      'mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110',
                      benefit.bgColor
                    )}
                  >
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                    {benefit.title}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">{benefit.description}</p>
                  <div className="flex items-center justify-end">
                    <ChevronRight className="h-4 w-4 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-purple-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings Calculator */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="group mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
              {/* Header */}
              <div className="mb-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white transition-transform group-hover:scale-110">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-2xl font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                  Calculate Your Potential Earnings
                </h3>
                <p className="text-sm text-gray-600">
                  Adjust the sliders to see how much you could earn
                </p>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between">
                    <label className="text-sm font-medium">Videos per week</label>
                    <span className="font-semibold">{requestCount[0]}</span>
                  </div>
                  <Slider
                    value={requestCount}
                    onValueChange={setRequestCount}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full [&>span:first-child]:bg-gray-200 [&>span:first-child>span]:bg-purple-600 [&>span:last-child>span]:border-purple-600 [&>span:last-child>span]:bg-white"
                  />
                </div>
                <div>
                  <div className="mb-2 flex justify-between">
                    <label className="text-sm font-medium">Price per video</label>
                    <span className="font-semibold">${pricePerVideo[0]}</span>
                  </div>
                  <Slider
                    value={pricePerVideo}
                    onValueChange={setPricePerVideo}
                    min={25}
                    max={200}
                    step={5}
                    className="w-full [&>span:first-child]:bg-gray-200 [&>span:first-child>span]:bg-purple-600 [&>span:last-child>span]:border-purple-600 [&>span:last-child>span]:bg-white"
                  />
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <div className="text-center">
                    <p className="mb-2 text-gray-600">Estimated Monthly Earnings</p>
                    <p className="text-4xl font-bold text-purple-600">
                      ${monthlyEarnings.toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">*After 15% platform fee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
            <div className="mx-auto max-w-4xl">
              <div className="relative">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-6 pb-8 last:pb-0">
                    <div className="relative flex-shrink-0">
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white">
                        {step.number}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute top-12 left-1/2 h-[88px] w-0.5 -translate-x-0.5 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Creator Success Stories</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Avatar with colored background */}
                  <div
                    className={cn(
                      'mb-4 flex h-16 w-16 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-110',
                      testimonial.bgColor
                    )}
                  >
                    <span className="text-2xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>

                  {/* Name and role */}
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                    {testimonial.name}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">{testimonial.role}</p>

                  {/* Quote */}
                  <p className="mb-4 text-gray-700 italic">"{testimonial.quote}"</p>

                  {/* Earnings badge */}
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {testimonial.earnings}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-12 text-center text-3xl font-bold">Requirements</h2>
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                {/* Icon header */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white transition-transform group-hover:scale-110">
                  <Shield className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mb-1 text-xl font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                  Ready to Join?
                </h3>
                <p className="mb-4 text-sm text-gray-600">Meet these simple requirements</p>

                {/* Requirements list */}
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                  >
                    <AccordionItem value={`item-${index}`} className="border-0">
                      <AccordionTrigger className="flex w-full items-start justify-between gap-4 p-0 hover:no-underline">
                        <h4 className="text-left text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                          {faq.question}
                        </h4>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Start Your Creator Journey?
            </h2>
            <p className="mb-8 text-xl text-white/90">
              Join hundreds of creators already earning on Ann Pale
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                {t('start_earning')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>
}
