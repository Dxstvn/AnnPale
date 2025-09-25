"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { Shield, Award, Heart, Clock, Gift, MessageSquare, Star, Users, Info, Calendar, Share2, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileHero } from "@/components/profile/profile-hero"
import { DecisionFactors } from "@/components/profile/decision-factors"
import { ProfileDetails } from "@/components/profile/profile-details"
import { MediaGallery } from "@/components/media/media-gallery"
import { MediaCarousel } from "@/components/media/media-carousel"
import { ReviewSystem } from "@/components/reviews/review-system"
import { ReviewPromptDialog } from "@/components/reviews/review-form"
import { StorytellingBio } from "@/components/profile/storytelling-bio"
import { AchievementShowcase } from "@/components/profile/achievement-showcase"
import { FunFactsPersonality } from "@/components/profile/fun-facts-personality"
import { ServiceDetails } from "@/components/profile/service-details"
import { AvailabilityCalendar } from "@/components/scheduling/availability-calendar"
import { TimeSlotSelector } from "@/components/scheduling/time-slot-selector"
import { FollowFavoriteSystem } from "@/components/social/follow-favorite-system"
import { CommentsSection } from "@/components/social/comments-section"
import { QnASection } from "@/components/social/qna-section"
import { FanWall } from "@/components/social/fan-wall"
import { MobileProfileHeader } from "@/components/mobile/mobile-profile-header"
import { MobileGalleryCarousel } from "@/components/mobile/mobile-gallery-carousel"
import {
  MobileReviewTabs,
  StickyMobileBookingBar,
  MobileNavigationAccordion,
  MobilePerformanceWrapper,
  PullToRefresh,
  MobileQuickActions,
  useTouchGestures
} from "@/components/mobile/mobile-profile-experience"
import { useIsMobile } from "@/hooks/use-media-query"
import { StickyCTABar } from "@/components/conversion/sticky-cta-bar"
import { ExitIntentModal } from "@/components/conversion/exit-intent-modal"
import { SocialProofWidgets } from "@/components/conversion/social-proof-widgets"
import {
  UrgencyIndicators,
  TrustBadges,
  MicroConversionTracker,
  FallbackActions,
  ConversionOptimizationDashboard,
  defaultTrustBadges
} from "@/components/conversion/conversion-optimization-system"

// Psychology-optimized booking imports
import { PsychologyOptimizedCheckout, defaultCheckoutSteps, type AbandonmentTrigger } from "@/components/booking/psychology-optimized-checkout"
import { 
  SecurityIndicator, 
  SocialProofTicker, 
  TrustBadgesGrid,
  PaymentMethodTrust,
  SatisfactionGuarantee,
  LiveViewerCount,
  UrgencyCountdown,
  SuccessStoriesCarousel,
  OrderSummaryConfidence
} from "@/components/booking/confidence-builders"
import { 
  SmartInput, 
  SmartPhoneInput, 
  SmartDatePicker,
  GuestCheckoutOption,
  OneClickCheckout,
  useSmartDefaults
} from "@/components/booking/smart-form-optimizations"
import { toast } from "sonner"
import type { ProfileHeroData } from "@/components/profile/profile-hero"
import type { DecisionFactorsData, PricingTier } from "@/components/profile/decision-factors"
import type { ProfileDetailsData } from "@/components/profile/profile-details"
import type { MediaGalleryData, MediaItem } from "@/components/media/media-gallery"
import type { ReviewSystemData } from "@/components/reviews/review-system"
import type { ReviewFormData } from "@/components/reviews/review-form"
import type { StorytellingBioData } from "@/components/profile/storytelling-bio"
import type { AchievementShowcaseData } from "@/components/profile/achievement-showcase"
import type { FunFactsPersonalityData } from "@/components/profile/fun-facts-personality"
import type { ServiceDetailsData } from "@/components/profile/service-details"
import type { AvailabilityData } from "@/components/scheduling/availability-calendar"
import type { TimeSlotSelectorData, TimeSlot } from "@/components/scheduling/time-slot-selector"
import type { SocialEngagementData } from "@/components/social/follow-favorite-system"
import type { CommentsSectionData, Comment } from "@/components/social/comments-section"
import type { QnASectionData, Question } from "@/components/social/qna-section"
import type { FanWallData, FanPost } from "@/components/social/fan-wall"
import type { StickyCTAData } from "@/components/conversion/sticky-cta-bar"
import type { ExitIntentData } from "@/components/conversion/exit-intent-modal"
import type { SocialProofData, RecentActivity } from "@/components/conversion/social-proof-widgets"
import type {
  UrgencyData,
  TrustBadge,
  MicroConversion,
  FallbackAction
} from "@/components/conversion/conversion-optimization-system"

// Enhanced creator data with all trust signals and storytelling bio
const enhancedCreatorsData = {
  "1": {
    // Hero data
    hero: {
      id: "1",
      name: "Wyclef Jean",
      category: "Musician",
      tagline: "Grammy-winning artist bringing Haitian pride to the world",
      bio: "Grammy-winning musician, producer, and humanitarian. Former member of the Fugees and solo artist with hits like 'Hips Don't Lie' and 'Gone Till November'. Proud Haitian-American artist.",
      profilePhoto: "/images/wyclef-jean.png",
      coverImage: "/placeholder.jpg",
      introVideo: "/videos/wyclef-intro.mp4",
      price: 150,
      originalPrice: 200,
      discount: 25,
      rating: 4.9,
      reviewCount: 1247,
      responseTime: 24,
      responseRate: 98,
      isOnline: false,
      verificationLevels: ["identity", "platform", "celebrity", "elite"] as const,
      location: "Miami, FL",
      timezone: "EST",
      languages: ["English", "Haitian Creole", "French"],
      videosDelivered: 1247,
      memberSince: new Date(2021, 2, 15),
      completionRate: 100,
      repeatCustomers: 40,
      followers: 125000,
      following: false,
      socialLinks: {
        instagram: "https://instagram.com/wyclef",
        twitter: "https://twitter.com/wyclef",
        facebook: "https://facebook.com/wyclef",
        youtube: "https://youtube.com/wyclef"
      }
    } as ProfileHeroData,
    
    // Decision factors data
    decisionFactors: {
      basePricing: {
        id: "basic",
        name: "Personal Message",
        description: "Personalized video message for any occasion",
        price: 150,
        originalPrice: 200,
        features: [
          "Up to 3 minutes video",
          "Personalized message",
          "HD quality",
          "Download link"
        ],
        deliveryTime: "3 days",
        popular: true
      },
      additionalTiers: [
        {
          id: "song",
          name: "Custom Song",
          description: "Original song performance just for you",
          price: 250,
          originalPrice: 350,
          features: [
            "Up to 5 minutes video",
            "Custom song performance",
            "Guitar accompaniment",
            "HD quality",
            "Download link"
          ],
          deliveryTime: "5 days",
          limitedTime: true
        },
        {
          id: "business",
          name: "Business Shoutout",
          description: "Professional endorsement for your business",
          price: 500,
          features: [
            "Up to 10 minutes video",
            "Business endorsement",
            "Social media rights",
            "4K quality",
            "Raw footage included"
          ],
          deliveryTime: "7 days"
        }
      ],
      discountPercentage: 25,
      discountEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      rating: 4.9,
      totalReviews: 1247,
      recommendationRate: 95,
      responseTime: 24,
      responseRate: 98,
      isOnline: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      videosDelivered: 1247,
      averageDeliveryTime: 48,
      rushDeliveryAvailable: true,
      completionRate: 100,
      refundRate: 0.5,
      satisfactionGuarantee: true
    } as DecisionFactorsData,
    
    // Profile details data
    profileDetails: {
      fullBio: "Wyclef Jean is a Grammy-winning musician, producer, and humanitarian who has been at the forefront of bringing Haitian culture to the global stage. As a founding member of the Fugees, he helped create some of the most influential hip-hop music of the 1990s. His solo career has been equally impressive, with hits spanning multiple genres and languages. Beyond music, Wyclef is deeply committed to humanitarian work, particularly in Haiti, where he has established numerous educational and relief programs.",
      background: "Born in Haiti and raised in Brooklyn and New Jersey, Wyclef has always stayed connected to his roots while embracing global influences in his music.",
      education: [
        "Berklee College of Music (Honorary Doctorate)",
        "Vailsburg High School, Newark, NJ"
      ],
      experience: [
        "Former member of the Fugees (1989-1997, 2004-2006)",
        "Solo artist with 9 studio albums",
        "Producer for artists including Shakira, Carlos Santana",
        "Founder of Yéle Haiti Foundation"
      ],
      languages: [
        { language: "English", proficiency: "native" },
        { language: "Haitian Creole", proficiency: "native" },
        { language: "French", proficiency: "fluent" }
      ],
      location: "Miami, FL",
      timezone: "America/New_York",
      specialties: [
        "Birthday wishes",
        "Congratulations",
        "Motivational messages",
        "Music dedications",
        "Cultural celebrations"
      ],
      occasions: [
        "Birthdays",
        "Graduations",
        "Anniversaries",
        "Holidays",
        "Special achievements"
      ],
      skills: [
        "Music production",
        "Guitar",
        "Vocals",
        "Songwriting"
      ],
      metrics: {
        videosDelivered: 1247,
        avgRating: 4.9,
        totalReviews: 1247,
        responseTime: 24,
        responseRate: 98,
        completionRate: 100,
        repeatCustomers: 40,
        memberSince: "2021"
      },
      achievements: [
        "top-rated",
        "super-creator",
        "fan-favorite",
        "fast-responder"
      ] as const,
      milestones: [
        {
          date: new Date(2021, 2, 15),
          title: "Joined Ann Pale",
          description: "Started creating personalized videos"
        },
        {
          date: new Date(2022, 5, 20),
          title: "500 Videos Milestone",
          description: "Delivered 500th personalized video"
        },
        {
          date: new Date(2023, 8, 10),
          title: "Elite Creator Status",
          description: "Achieved top 1% creator status"
        }
      ],
      socialLinks: {
        instagram: "https://instagram.com/wyclef",
        twitter: "https://twitter.com/wyclef",
        facebook: "https://facebook.com/wyclef",
        youtube: "https://youtube.com/wyclef"
      },
      availability: {
        timezone: "America/New_York",
        schedule: {
          monday: [{ start: "10:00", end: "18:00" }],
          tuesday: [{ start: "10:00", end: "18:00" }],
          wednesday: [{ start: "10:00", end: "18:00" }],
          thursday: [{ start: "10:00", end: "18:00" }],
          friday: [{ start: "10:00", end: "16:00" }]
        },
        blackoutDates: [
          new Date(2024, 11, 25),
          new Date(2024, 11, 31),
          new Date(2025, 0, 1)
        ],
        nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      sampleVideos: [
        {
          id: "v1",
          title: "Birthday Surprise for Marie",
          thumbnail: "/images/video-thumb-1.jpg",
          duration: 180,
          views: 15234
        },
        {
          id: "v2",
          title: "Graduation Congratulations",
          thumbnail: "/images/video-thumb-2.jpg",
          duration: 120,
          views: 8921
        },
        {
          id: "v3",
          title: "Anniversary Song",
          thumbnail: "/images/video-thumb-3.jpg",
          duration: 240,
          views: 23456
        }
      ]
    } as ProfileDetailsData,
    
    // Media gallery data
    mediaGallery: {
      introductionVideo: {
        id: "intro",
        type: "video",
        title: "Welcome to my Ann Pale profile!",
        description: "Get to know me and what I can do for you",
        thumbnail: "/placeholder.jpg",
        url: "/videos/wyclef-intro.mp4",
        duration: 45,
        views: 125000,
        likes: 8500,
        date: new Date(2023, 8, 15),
        featured: true
      },
      recentDeliveries: [
        {
          id: "rd1",
          type: "video",
          title: "Birthday Surprise for Marie",
          thumbnail: "/images/video-thumb-1.jpg",
          url: "/videos/sample-1.mp4",
          duration: 180,
          views: 15234,
          likes: 1200,
          date: new Date(2024, 0, 10),
          category: "Birthday"
        },
        {
          id: "rd2",
          type: "video",
          title: "Graduation Congratulations for Jean",
          thumbnail: "/images/video-thumb-2.jpg",
          url: "/videos/sample-2.mp4",
          duration: 120,
          views: 8921,
          likes: 650,
          date: new Date(2024, 0, 8),
          category: "Graduation"
        },
        {
          id: "rd3",
          type: "video",
          title: "Anniversary Song for Michelle & Pierre",
          thumbnail: "/images/video-thumb-3.jpg",
          url: "/videos/sample-3.mp4",
          duration: 240,
          views: 23456,
          likes: 2100,
          date: new Date(2024, 0, 5),
          category: "Anniversary"
        },
        {
          id: "rd4",
          type: "video",
          title: "Motivational Message for David",
          thumbnail: "/images/video-thumb-4.jpg",
          url: "/videos/sample-4.mp4",
          duration: 150,
          views: 5678,
          likes: 450,
          date: new Date(2024, 0, 3),
          category: "Motivation"
        }
      ],
      behindScenes: [
        {
          id: "bs1",
          type: "video",
          title: "Recording in the Studio",
          thumbnail: "/images/behind-1.jpg",
          url: "/videos/behind-1.mp4",
          duration: 90,
          views: 45000,
          date: new Date(2023, 11, 20)
        },
        {
          id: "bs2",
          type: "photo",
          title: "Setting up for a video message",
          thumbnail: "/images/behind-2.jpg",
          url: "/images/behind-2-full.jpg",
          views: 12000,
          date: new Date(2023, 11, 15)
        },
        {
          id: "bs3",
          type: "video",
          title: "How I prepare personalized messages",
          thumbnail: "/images/behind-3.jpg",
          url: "/videos/behind-3.mp4",
          duration: 120,
          views: 28000,
          date: new Date(2023, 11, 10)
        }
      ],
      photos: [
        {
          id: "p1",
          type: "photo",
          title: "Live performance in Miami",
          thumbnail: "/images/photo-1.jpg",
          url: "/images/photo-1-full.jpg",
          views: 8900,
          likes: 650,
          date: new Date(2023, 10, 25)
        },
        {
          id: "p2",
          type: "photo",
          title: "With fans at Haiti fundraiser",
          thumbnail: "/images/photo-2.jpg",
          url: "/images/photo-2-full.jpg",
          views: 15600,
          likes: 1200,
          date: new Date(2023, 10, 20)
        },
        {
          id: "p3",
          type: "photo",
          title: "Grammy Awards 2023",
          thumbnail: "/images/photo-3.jpg",
          url: "/images/photo-3-full.jpg",
          views: 32000,
          likes: 2800,
          date: new Date(2023, 10, 15)
        },
        {
          id: "p4",
          type: "photo",
          title: "Recording new music",
          thumbnail: "/images/photo-4.jpg",
          url: "/images/photo-4-full.jpg",
          views: 6700,
          likes: 480,
          date: new Date(2023, 10, 10)
        }
      ],
      press: [
        {
          id: "pr1",
          type: "press",
          title: "Wyclef Jean Launches New Haitian Education Initiative",
          description: "Grammy winner announces major scholarship program for Haitian students",
          thumbnail: "/images/press-1.jpg",
          url: "https://example.com/article-1",
          date: new Date(2023, 11, 1),
          source: "Miami Herald",
          category: "News"
        },
        {
          id: "pr2",
          type: "press",
          title: "Exclusive Interview: Wyclef on Music and Giving Back",
          description: "The artist discusses his latest projects and humanitarian work",
          thumbnail: "/images/press-2.jpg",
          url: "https://example.com/article-2",
          date: new Date(2023, 10, 15),
          source: "Rolling Stone",
          category: "Interview"
        },
        {
          id: "pr3",
          type: "press",
          title: "Wyclef Jean Featured in Documentary on Haitian Artists",
          description: "New documentary showcases the impact of Haitian artists globally",
          thumbnail: "/images/press-3.jpg",
          url: "https://example.com/article-3",
          date: new Date(2023, 10, 1),
          source: "NPR",
          category: "Feature"
        }
      ]
    } as MediaGalleryData,
    
    // Review system data
    reviews: {
      overallRating: 4.9,
      totalReviews: 1247,
      distribution: {
        5: 978,
        4: 187,
        3: 62,
        2: 12,
        1: 8
      },
      categoryAverages: {
        quality: 4.9,
        communication: 4.8,
        deliveryTime: 4.8,
        value: 4.7
      },
      recommendationRate: 95,
      highlights: [
        "Wyclef exceeded all expectations! My mom cried tears of joy.",
        "The personal touch he added made it so special. Worth every penny!",
        "He sang a custom song for our anniversary. We'll treasure it forever.",
        "So authentic and genuine. You can tell he really cares.",
        "Fast delivery and amazing quality. Can't recommend enough!"
      ],
      reviews: [
        {
          id: "r1",
          author: {
            name: "Marie Laurent",
            avatar: "/images/avatar-1.jpg",
            location: "Miami, FL",
            memberSince: new Date(2022, 5, 15),
            reviewCount: 23
          },
          rating: 5,
          categoryRatings: {
            quality: 5,
            communication: 5,
            deliveryTime: 5,
            value: 5
          },
          date: new Date(2024, 0, 10),
          occasion: "Birthday",
          message: "Wyclef made my daughter's 16th birthday absolutely unforgettable! He not only delivered the message in perfect Creole but also sang a snippet of her favorite song. The video quality was excellent, and he really took his time to make it personal. My daughter has watched it at least 20 times already! This was worth every penny and more. Thank you so much!",
          media: [
            { type: "photo", url: "/images/review-1.jpg", thumbnail: "/images/review-1-thumb.jpg" }
          ],
          helpful: 145,
          notHelpful: 3,
          verified: true,
          repeatCustomer: true,
          platformVeteran: true,
          detailed: true,
          response: {
            message: "Thank you so much Marie! It was my pleasure to help celebrate your daughter's special day. Sending love to your family! 🎉",
            date: new Date(2024, 0, 11)
          },
          tags: ["Birthday", "Creole", "Singing"]
        },
        {
          id: "r2",
          author: {
            name: "Jean-Pierre Dubois",
            avatar: "/images/avatar-2.jpg",
            location: "New York, NY",
            reviewCount: 8
          },
          rating: 5,
          categoryRatings: {
            quality: 5,
            communication: 4,
            deliveryTime: 5,
            value: 5
          },
          date: new Date(2024, 0, 8),
          occasion: "Graduation",
          message: "Got this for my son's college graduation. Wyclef's message was incredibly inspiring and motivational. He shared his own story and really connected with my son's journey. The whole family gathered to watch it together!",
          helpful: 89,
          notHelpful: 1,
          verified: true,
          detailed: true,
          tags: ["Graduation", "Motivational"]
        },
        {
          id: "r3",
          author: {
            name: "Sarah Mitchell",
            avatar: "/images/avatar-3.jpg",
            location: "Boston, MA",
            memberSince: new Date(2023, 2, 10),
            reviewCount: 15
          },
          rating: 4,
          categoryRatings: {
            quality: 5,
            communication: 4,
            deliveryTime: 3,
            value: 4
          },
          date: new Date(2024, 0, 5),
          occasion: "Anniversary",
          message: "Beautiful message for our anniversary! Wyclef performed a short acoustic version of 'Gone Till November' which was our wedding song. Only minor issue was it took a day longer than expected, but the quality made up for it.",
          media: [
            { type: "video", url: "/videos/review-1.mp4", thumbnail: "/images/review-video-1-thumb.jpg" }
          ],
          helpful: 67,
          notHelpful: 2,
          verified: true,
          platformVeteran: true,
          detailed: true,
          tags: ["Anniversary", "Music"]
        },
        {
          id: "r4",
          author: {
            name: "Michel Robert",
            avatar: "/images/avatar-4.jpg",
            location: "Montreal, Canada",
            reviewCount: 3
          },
          rating: 5,
          categoryRatings: {
            quality: 5,
            communication: 5,
            deliveryTime: 5,
            value: 4
          },
          date: new Date(2024, 0, 3),
          occasion: "Birthday",
          message: "Incredible! Wyclef spoke in French and Creole, making it perfect for my Haitian grandmother's 80th birthday. She was so touched she cried. The message was heartfelt and genuine.",
          helpful: 112,
          notHelpful: 0,
          verified: true,
          detailed: true,
          response: {
            message: "Blessings to your grandmother! It was an honor to celebrate her milestone birthday. 80 years of wisdom! 🙏",
            date: new Date(2024, 0, 4)
          },
          tags: ["Birthday", "Multilingual", "Elder"]
        },
        {
          id: "r5",
          author: {
            name: "Ashley Thompson",
            avatar: "/images/avatar-5.jpg",
            location: "Atlanta, GA",
            reviewCount: 12
          },
          rating: 5,
          categoryRatings: {
            quality: 5,
            communication: 5,
            deliveryTime: 5,
            value: 5
          },
          date: new Date(2023, 11, 28),
          occasion: "Holiday",
          message: "Perfect Christmas gift for my husband who's a huge Fugees fan! Wyclef was funny, charming, and even threw in some holiday music. Delivered super fast too!",
          helpful: 56,
          notHelpful: 1,
          verified: true,
          repeatCustomer: true,
          detailed: true,
          tags: ["Holiday", "Gift", "Music"]
        }
      ]
    } as ReviewSystemData,
    
    // Storytelling Bio data
    storytellingBio: {
      tagline: "🎵 Grammy-winning artist bringing Haitian pride to the world 🇭🇹",
      shortBio: "From the streets of Haiti to global stages, I've been blessed to share our culture through music. As a Fugees member and solo artist, I've always kept Haiti in my heart. Whether it's through my hits or humanitarian work, I'm dedicated to uplifting our people and celebrating our resilience.",
      fullStory: "My journey began in Croix-des-Bouquets, Haiti, where music was the heartbeat of our community. When my family moved to Brooklyn, I carried that rhythm with me, using it to bridge two worlds.\n\nThe Fugees gave me a platform to showcase Haitian talent globally, and songs like 'Gone Till November' let me express our stories. But success means nothing without giving back. That's why I founded Yéle Haiti and continue working to support education and opportunity in our homeland.\n\nToday, whether I'm in the studio or on stage, I represent millions of Haitians worldwide. Every video message I create is a chance to connect our diaspora and celebrate our beautiful culture. From birthday wishes in Creole to motivational messages for young artists, I'm here to spread joy and inspiration.",
      personalMotto: "One love, one heart, one Haiti",
      favoriteQuote: "The sweetest music is the sound of your culture calling you home",
      hometown: "Croix-des-Bouquets, Haiti",
      currentLocation: "Miami, Florida",
      personalityTraits: ["Creative", "Passionate", "Humanitarian", "Authentic", "Inspiring"],
      passions: ["Music Production", "Haitian Culture", "Youth Education", "Guitar"],
      causes: ["Haiti Relief", "Music Education", "Youth Empowerment"],
      sharedExperiences: [
        "Immigrant journey to America",
        "Building success from humble beginnings",
        "Staying connected to roots",
        "Using platform for good"
      ],
      culturalBackground: "Proud Haitian-American representing both cultures with equal love and respect",
      lifePhilosophy: "Success without giving back is failure. Use your platform to lift others."
    } as StorytellingBioData,
    
    // Achievement Showcase data
    achievements: {
      achievements: [
        {
          id: "a1",
          title: "3x Grammy Award Winner",
          description: "Won Grammy Awards with the Fugees and as a solo artist",
          date: new Date(1997, 2, 1),
          category: "awards",
          icon: "trophy",
          verified: true,
          highlight: true
        },
        {
          id: "a2",
          title: "The Score - 22x Platinum",
          description: "The Fugees' album became one of the best-selling hip-hop albums ever",
          date: new Date(1996, 2, 1),
          category: "career",
          icon: "crown",
          verified: true,
          highlight: true
        },
        {
          id: "a3",
          title: "Humanitarian of the Year",
          description: "Recognized for founding Yéle Haiti and earthquake relief efforts",
          date: new Date(2010, 6, 1),
          category: "community",
          icon: "heart",
          verified: true
        },
        {
          id: "a4",
          title: "Presidential Candidate",
          description: "Ran for President of Haiti to bring change to the nation",
          date: new Date(2010, 8, 1),
          category: "community",
          icon: "star",
          verified: true
        },
        {
          id: "a5",
          title: "MTV Video Music Award",
          description: "Multiple MTV VMA wins for music videos",
          date: new Date(1997, 9, 1),
          category: "awards",
          icon: "tv",
          verified: true
        },
        {
          id: "a6",
          title: "BET Humanitarian Award",
          description: "Honored for continuous work in Haiti",
          date: new Date(2018, 6, 1),
          category: "community",
          icon: "medal",
          verified: true
        }
      ],
      milestones: [
        {
          id: "m1",
          title: "Formed the Fugees",
          description: "Started the legendary hip-hop group with Lauryn Hill and Pras",
          date: new Date(1992, 1, 1),
          type: "career",
          metric: "Changed hip-hop forever"
        },
        {
          id: "m2",
          title: "First Solo Album",
          description: "Released 'The Carnival' featuring 'Gone Till November'",
          date: new Date(1997, 6, 1),
          type: "career",
          metric: "4x Platinum"
        },
        {
          id: "m3",
          title: "Founded Yéle Haiti",
          description: "Established foundation to support Haiti's development",
          date: new Date(2005, 1, 1),
          type: "community",
          metric: "Raised millions for Haiti"
        },
        {
          id: "m4",
          title: "Earthquake Relief Leader",
          description: "Led major relief efforts after 2010 Haiti earthquake",
          date: new Date(2010, 1, 12),
          type: "community",
          metric: "Helped thousands"
        }
      ],
      stats: {
        totalAwards: 15,
        mediaAppearances: 500,
        yearsExperience: 30,
        projectsCompleted: 200
      },
      certifications: [
        {
          name: "Berklee College Honorary Doctorate",
          issuer: "Berklee College of Music",
          date: new Date(2013, 5, 1),
          verified: true
        }
      ]
    } as AchievementShowcaseData,
    
    // Fun Facts & Personality data
    funFacts: {
      funFacts: [
        { id: "f1", fact: "I can play 7 different instruments!", emoji: "🎸", category: "hobby" },
        { id: "f2", fact: "My favorite Haitian dish is griot with pikliz", emoji: "🍖", category: "food" },
        { id: "f3", fact: "I once recorded a song in 5 languages in one day", emoji: "🌍", category: "quirky" },
        { id: "f4", fact: "I collect vintage Haitian art", emoji: "🎨", category: "hobby" },
        { id: "f5", fact: "Morning coffee must be Haitian blue mountain", emoji: "☕", category: "food" },
        { id: "f6", fact: "I've visited over 50 countries performing", emoji: "✈️", category: "travel" }
      ],
      personalityType: {
        type: "The Creative Humanitarian",
        description: "Artistic soul with a heart for service and cultural pride",
        traits: ["Visionary", "Compassionate", "Energetic", "Cultural Ambassador"]
      },
      favorites: {
        food: "Griot with Pikliz",
        movie: "City of God",
        music: "Bob Marley & Compas",
        book: "The Alchemist",
        place: "Haiti's beaches",
        hobby: "Guitar jamming"
      },
      quickFire: [
        { question: "Early bird or night owl?", answer: "Night owl - best music comes after midnight" },
        { question: "Studio or stage?", answer: "Stage! Nothing beats live energy" },
        { question: "Proudest moment?", answer: "Seeing Haitian flag at the Grammys" },
        { question: "Hidden talent?", answer: "I make amazing Haitian coffee" }
      ],
      wouldYouRather: [
        { optionA: "Collaborate with Bob Marley", optionB: "Jam with Jimi Hendrix", choice: "A" },
        { optionA: "Grammy Award", optionB: "Nobel Peace Prize", choice: "B" },
        { optionA: "World tour", optionB: "Build schools in Haiti", choice: "B" }
      ],
      bucketList: [
        { item: "Win Grammy Award", completed: true },
        { item: "Help rebuild Haiti", completed: false },
        { item: "Create music school in Haiti", completed: false },
        { item: "Collaborate with every continent", completed: true },
        { item: "Write autobiography", completed: false }
      ]
    } as FunFactsPersonalityData,
    
    // Service Details data
    serviceDetails: {
      serviceOverview: {
        title: "Personal Video Messages from Wyclef",
        description: "Get a personalized video from the Grammy-winning artist himself. Perfect for birthdays, motivation, or just spreading Haitian pride!",
        videoLength: { min: 1, max: 5, typical: 3 },
        deliveryTime: { standard: 3, rush: 24 },
        startingPrice: 150
      },
      videoStyle: {
        tone: ["energetic", "heartfelt", "humorous", "inspirational"],
        setting: ["studio", "home"],
        props: ["Guitar", "Haitian flag", "Awards"],
        specialEffects: false,
        customBackgrounds: true
      },
      occasions: [
        {
          id: "birthday",
          name: "Birthday",
          icon: "birthday",
          popular: true,
          examples: ["Sweet 16", "Milestone birthdays", "Surprise parties"]
        },
        {
          id: "motivation",
          name: "Motivation",
          icon: "motivation",
          popular: true,
          examples: ["Career advice", "Artist encouragement", "Life coaching"]
        },
        {
          id: "cultural",
          name: "Cultural Pride",
          icon: "custom",
          popular: true,
          examples: ["Haitian heritage", "Diaspora connection", "Language learning"]
        },
        {
          id: "wedding",
          name: "Wedding",
          icon: "wedding",
          examples: ["Congratulations", "First dance dedication"]
        },
        {
          id: "graduation",
          name: "Graduation",
          icon: "graduation",
          examples: ["High school", "College", "Achievement celebration"]
        },
        {
          id: "business",
          name: "Business",
          icon: "business",
          priceModifier: 20,
          examples: ["Team motivation", "Product launch", "Company celebration"]
        }
      ],
      languages: [
        { language: "English", proficiency: "native" },
        { language: "Haitian Creole", proficiency: "native", dialectsOrAccents: ["Port-au-Prince", "Cap-Haïtien"] },
        { language: "French", proficiency: "fluent" },
        { language: "Spanish", proficiency: "conversational" }
      ],
      inclusions: {
        standard: [
          "Personalized video message",
          "HD quality recording",
          "Downloadable file",
          "Shareable link",
          "Message in preferred language"
        ],
        additional: [
          "Guitar performance",
          "Song dedication",
          "Shoutout to multiple people",
          "Extended message (up to 5 min)"
        ],
        notIncluded: [
          "Commercial use rights",
          "Explicit content",
          "Political endorsements"
        ]
      },
      requirements: {
        advanceNotice: 3,
        scriptGuidelines: "Please provide names, occasion, and any special message you'd like included. Keep requests positive and respectful.",
        maxRetakes: 1,
        contentRestrictions: [
          "No offensive or inappropriate content",
          "No political campaign messages",
          "No commercial endorsements without agreement"
        ]
      },
      faqs: [
        {
          question: "Can Wyclef sing in the video?",
          answer: "Yes! I often include singing, especially for birthdays and special occasions. Just mention your favorite song in the request."
        },
        {
          question: "Will the video be in Creole?",
          answer: "I can deliver messages in English, Creole, French, or a mix! Just specify your preference."
        },
        {
          question: "How long are the videos?",
          answer: "Typically 2-3 minutes, but for special requests, I can go up to 5 minutes."
        },
        {
          question: "Can I request a specific song?",
          answer: "Absolutely! I love personalizing messages with music. Just let me know the song."
        }
      ],
      testimonialHighlights: [
        {
          occasion: "Birthday",
          quote: "Wyclef sang Happy Birthday in Creole and played guitar. My mom cried happy tears!",
          author: "Marie L."
        },
        {
          occasion: "Motivation",
          quote: "His words gave me the courage to pursue my music career. Life-changing!",
          author: "Jean P."
        },
        {
          occasion: "Cultural Pride",
          quote: "He reminded my kids of their Haitian heritage in the most beautiful way.",
          author: "Sandra D."
        }
      ]
    } as ServiceDetailsData,
    
    // Availability & Scheduling data
    availability: {
      status: "limited" as const,
      nextAvailable: new Date(),
      timezone: "America/New_York",
      dailySlots: {
        [format(new Date(), "yyyy-MM-dd")]: { total: 5, available: 2, rush: true, price: 150 },
        [format(addDays(new Date(), 1), "yyyy-MM-dd")]: { total: 5, available: 4, rush: true, price: 150 },
        [format(addDays(new Date(), 2), "yyyy-MM-dd")]: { total: 5, available: 5, rush: true, price: 150 },
        [format(addDays(new Date(), 3), "yyyy-MM-dd")]: { total: 5, available: 3, rush: true, price: 150 },
        [format(addDays(new Date(), 4), "yyyy-MM-dd")]: { total: 5, available: 1, rush: false, price: 150 },
        [format(addDays(new Date(), 5), "yyyy-MM-dd")]: { total: 5, available: 0, rush: false, price: 150 },
        [format(addDays(new Date(), 6), "yyyy-MM-dd")]: { total: 5, available: 4, rush: true, price: 150 }
      },
      blackoutDates: [addDays(new Date(), 10), addDays(new Date(), 11)],
      vacationPeriods: [
        {
          start: addDays(new Date(), 20),
          end: addDays(new Date(), 25),
          reason: "Tour dates"
        }
      ],
      rushAvailable: true,
      rushSlots: 2,
      rushDeliveryTime: 24,
      minAdvanceBooking: 1,
      maxAdvanceBooking: 30,
      averageDeliveryTime: 3,
      onTimeRate: 98
    } as AvailabilityData,
    
    // Time slot data for selected dates
    timeSlots: {
      date: new Date(),
      timezone: "America/New_York",
      groups: [
        {
          label: "Morning",
          slots: [
            { id: "m1", startTime: "09:00", endTime: "09:30", available: true, capacity: 2, booked: 1, price: 150, rushEligible: true },
            { id: "m2", startTime: "09:30", endTime: "10:00", available: false, capacity: 2, booked: 2, price: 150 },
            { id: "m3", startTime: "10:00", endTime: "10:30", available: true, capacity: 2, booked: 0, price: 150, isPopular: true, rushEligible: true },
            { id: "m4", startTime: "10:30", endTime: "11:00", available: true, capacity: 2, booked: 0, price: 150, rushEligible: true },
            { id: "m5", startTime: "11:00", endTime: "11:30", available: true, capacity: 2, booked: 1, price: 150 },
            { id: "m6", startTime: "11:30", endTime: "12:00", available: false, capacity: 2, booked: 2, price: 150 }
          ]
        },
        {
          label: "Afternoon",
          slots: [
            { id: "a1", startTime: "12:00", endTime: "12:30", available: true, capacity: 3, booked: 2, price: 165, isPeak: true, priceModifier: 10 },
            { id: "a2", startTime: "12:30", endTime: "13:00", available: true, capacity: 3, booked: 2, price: 165, isPeak: true, priceModifier: 10 },
            { id: "a3", startTime: "13:00", endTime: "13:30", available: false, capacity: 3, booked: 3, price: 165, isPeak: true },
            { id: "a4", startTime: "14:00", endTime: "14:30", available: true, capacity: 2, booked: 0, price: 150, isPopular: true },
            { id: "a5", startTime: "14:30", endTime: "15:00", available: true, capacity: 2, booked: 1, price: 150, rushEligible: true },
            { id: "a6", startTime: "15:00", endTime: "15:30", available: true, capacity: 2, booked: 0, price: 150 }
          ]
        },
        {
          label: "Evening",
          slots: [
            { id: "e1", startTime: "16:00", endTime: "16:30", available: true, capacity: 3, booked: 1, price: 175, isPeak: true, priceModifier: 15 },
            { id: "e2", startTime: "16:30", endTime: "17:00", available: true, capacity: 3, booked: 2, price: 175, isPeak: true, priceModifier: 15, isPopular: true },
            { id: "e3", startTime: "17:00", endTime: "17:30", available: false, capacity: 3, booked: 3, price: 175, isPeak: true },
            { id: "e4", startTime: "18:00", endTime: "18:30", available: true, capacity: 2, booked: 1, price: 135, isLastMinute: true, priceModifier: -10 },
            { id: "e5", startTime: "18:30", endTime: "19:00", available: true, capacity: 2, booked: 0, price: 135, isLastMinute: true, priceModifier: -10 },
            { id: "e6", startTime: "19:00", endTime: "19:30", available: true, capacity: 2, booked: 0, price: 150 }
          ]
        }
      ],
      rushAvailable: true,
      popularTimes: ["10:00", "14:00", "16:30"],
      peakHours: [
        { start: "12:00", end: "13:30" },
        { start: "16:00", end: "17:30" }
      ],
      lastMinuteDiscount: 10,
      dynamicPricing: true
    } as TimeSlotSelectorData,
    
    // Social Engagement data
    socialEngagement: {
      followers: 125000,
      following: false,
      favorited: false,
      engagementRate: 89,
      responseRate: 98,
      repeatBookingRate: 40,
      totalFans: 125000,
      activeFans: 45000,
      superFans: 5000,
      notificationsEnabled: false,
      notificationTypes: {
        newVideos: true,
        availability: true,
        specialOffers: true,
        liveEvents: false
      },
      recentFollowers: [
        { id: "f1", name: "Marie Laurent", avatar: "/images/avatar-1.jpg", date: new Date() },
        { id: "f2", name: "Jean Pierre", avatar: "/images/avatar-2.jpg", date: new Date() },
        { id: "f3", name: "Sandra Dubois", avatar: "/images/avatar-3.jpg", date: new Date() }
      ],
      followerBenefits: [
        "Early access to new videos",
        "Special discount codes",
        "Behind-the-scenes content",
        "Monthly Q&A sessions"
      ],
      favoriteBenefits: [
        "Priority booking slots",
        "Exclusive content",
        "Birthday greetings",
        "VIP support"
      ]
    } as SocialEngagementData,
    
    // Comments data
    comments: {
      comments: [
        {
          id: "c1",
          author: {
            id: "u1",
            name: "Marie Laurent",
            avatar: "/images/avatar-1.jpg",
            isVerified: true
          },
          content: "Wyclef's video message made my daughter's birthday unforgettable! She's watched it 100 times already. Thank you so much!",
          timestamp: new Date(Date.now() - 86400000),
          likes: 45,
          hasLiked: false,
          isPinned: true,
          replies: [
            {
              id: "c1r1",
              author: {
                id: "creator",
                name: "Wyclef Jean",
                avatar: "/images/wyclef-jean.png",
                isCreator: true
              },
              content: "So happy to hear that! Sending love to your daughter! 🎉",
              timestamp: new Date(Date.now() - 82800000),
              likes: 28,
              hasLiked: false
            }
          ]
        },
        {
          id: "c2",
          author: {
            id: "u2",
            name: "Jean Pierre",
            avatar: "/images/avatar-2.jpg"
          },
          content: "The personalization was amazing. He mentioned specific details that made it so special.",
          timestamp: new Date(Date.now() - 172800000),
          likes: 32,
          hasLiked: false
        }
      ],
      totalComments: 247,
      allowComments: true,
      requireApproval: false,
      sortBy: "newest"
    } as CommentsSectionData,
    
    // Q&A data
    qna: {
      questions: [
        {
          id: "q1",
          question: "Do you sing in the video messages?",
          answer: "Yes! I love to include songs, especially for birthdays and special occasions. Just mention your favorite song in the request.",
          category: "Videos",
          askedBy: { name: "Sandra D." },
          answeredBy: { name: "Wyclef Jean", isCreator: true },
          askedAt: new Date(Date.now() - 604800000),
          answeredAt: new Date(Date.now() - 518400000),
          upvotes: 156,
          hasUpvoted: false,
          isPinned: true,
          views: 1200
        },
        {
          id: "q2",
          question: "Can you do messages in Haitian Creole?",
          answer: "Absolutely! I can do messages in English, Creole, French, or a mix. Just specify your preference when booking.",
          category: "Languages",
          askedBy: { name: "Michel R." },
          answeredBy: { name: "Wyclef Jean", isCreator: true },
          askedAt: new Date(Date.now() - 1209600000),
          answeredAt: new Date(Date.now() - 1123200000),
          upvotes: 89,
          hasUpvoted: false,
          isPopular: true,
          views: 890
        },
        {
          id: "q3",
          question: "How long are the video messages typically?",
          answer: "My videos are usually 2-3 minutes long, but for special requests, I can go up to 5 minutes. I make sure to include everything you ask for!",
          category: "Videos",
          askedBy: { name: "Lisa M." },
          answeredBy: { name: "Wyclef Jean", isCreator: true },
          askedAt: new Date(Date.now() - 2419200000),
          answeredAt: new Date(Date.now() - 2332800000),
          upvotes: 67,
          hasUpvoted: false,
          views: 543
        }
      ],
      totalQuestions: 127,
      answeredQuestions: 98,
      categories: ["Videos", "Languages", "Music", "Booking", "Other"],
      allowQuestions: true,
      requireApproval: false
    } as QnASectionData,
    
    // Fan Wall data
    fanWall: {
      posts: [
        {
          id: "fw1",
          author: {
            name: "Marie Laurent",
            avatar: "/images/avatar-1.jpg",
            location: "Miami, FL"
          },
          type: "testimonial" as const,
          content: "Wyclef went above and beyond for my mom's 70th birthday! He sang her favorite song and spoke in Creole. She cried tears of joy and has watched it every day since. This was worth every penny!",
          occasion: "Birthday",
          rating: 5,
          likes: 234,
          hasLiked: false,
          isFeatured: true,
          isVerified: true,
          createdAt: new Date(Date.now() - 604800000),
          creatorResponse: {
            message: "It was my pleasure! Happy 70th to your amazing mom! 🎉",
            date: new Date(Date.now() - 518400000)
          }
        },
        {
          id: "fw2",
          author: {
            name: "Jean Baptiste",
            avatar: "/images/avatar-2.jpg",
            location: "New York, NY"
          },
          type: "story" as const,
          content: "I've been a fan since the Fugees days. Getting a personal message from Wyclef for my graduation was a dream come true. He gave me advice about following my dreams and staying true to my Haitian roots.",
          occasion: "Graduation",
          rating: 5,
          likes: 156,
          hasLiked: false,
          isVerified: true,
          createdAt: new Date(Date.now() - 1209600000)
        },
        {
          id: "fw3",
          author: {
            name: "Sandra Dubois",
            avatar: "/images/avatar-3.jpg",
            location: "Boston, MA"
          },
          type: "photo" as const,
          content: "My husband is Wyclef's biggest fan! This anniversary surprise left him speechless. Thank you for making our 25th anniversary so special!",
          media: {
            type: "photo" as const,
            url: "/images/fan-photo-1.jpg"
          },
          occasion: "Anniversary",
          likes: 89,
          hasLiked: false,
          createdAt: new Date(Date.now() - 2419200000)
        }
      ],
      totalPosts: 847,
      featuredPosts: [],
      allowSubmissions: true,
      requireApproval: true,
      stats: {
        totalFans: 125000,
        totalStories: 847,
        averageRating: 4.9
      }
    } as FanWallData,
    
    // Conversion optimization data
    stickyCTA: {
      creatorName: "Wyclef Jean",
      price: {
        amount: 150,
        currency: "$",
        originalPrice: 200,
        discount: 25
      },
      availability: {
        status: "limited" as const,
        nextSlot: new Date(Date.now() + 86400000),
        slotsRemaining: 3
      },
      stats: {
        rating: 4.9,
        reviews: 1247,
        bookings: 5000,
        responseTime: "2 hours"
      },
      features: ["HD Video", "3-Day Delivery", "100% Guarantee"],
      urgencyMessage: "Only 3 spots left this week - Book now!",
      trustBadges: [
        { icon: Shield, label: "Verified" },
        { icon: Star, label: "Top Rated" }
      ]
    } as StickyCTAData,
    
    exitIntent: {
      creatorName: "Wyclef Jean",
      creatorImage: "/images/wyclef-jean.png",
      offer: {
        type: "discount" as const,
        title: "Wait! Special Offer Just for You",
        description: "Get 20% off your first video message",
        value: "20% OFF",
        validUntil: new Date(Date.now() + 86400000)
      },
      benefits: [
        "Personalized message from Wyclef",
        "HD quality video",
        "Delivered within 3 days",
        "100% satisfaction guarantee"
      ],
      testimonial: {
        text: "Wyclef's message made my daughter's birthday unforgettable!",
        author: "Marie L.",
        rating: 5
      }
    } as ExitIntentData,
    
    socialProof: {
      recentActivity: [
        {
          id: "1",
          type: "booking" as const,
          user: {
            name: "Jean-Baptiste",
            location: "Montreal, Canada"
          },
          message: "just booked a birthday message",
          timestamp: new Date(Date.now() - 300000),
          rating: 5
        },
        {
          id: "2",
          type: "review" as const,
          user: {
            name: "Sandra M.",
            location: "Miami, FL"
          },
          message: "left a 5-star review",
          timestamp: new Date(Date.now() - 900000),
          rating: 5
        },
        {
          id: "3",
          type: "video" as const,
          user: {
            name: "Pierre D.",
            location: "Paris, France"
          },
          message: "received their video message",
          timestamp: new Date(Date.now() - 1800000)
        }
      ] as RecentActivity[],
      liveStats: {
        viewersNow: 47,
        bookingsToday: 12,
        responseTime: "2 hours",
        satisfactionRate: 98,
        completionRate: 100,
        repeatRate: 40
      },
      popularity: {
        rank: 3,
        category: "Musicians",
        trending: true,
        growth: 25,
        demandLevel: "high" as const
      },
      achievements: [
        { icon: Award, label: "Grammy Winner", value: "3x" },
        { icon: Users, label: "Videos Delivered", value: "5000+" },
        { icon: Star, label: "Average Rating", value: "4.9/5" },
        { icon: Clock, label: "Response Time", value: "2 hrs" }
      ]
    } as SocialProofData,
    
    urgencyIndicators: [
      {
        type: "stock_limited" as const,
        message: "Only 3 booking slots available this week",
        severity: "high" as const,
        remaining: 3,
        total: 10
      },
      {
        type: "high_demand" as const,
        message: "12 people booked today",
        severity: "medium" as const
      },
      {
        type: "time_limited" as const,
        message: "Special price ends soon",
        severity: "medium" as const,
        deadline: new Date(Date.now() + 86400000)
      }
    ] as UrgencyData[],
    
    trustBadges: [
      ...defaultTrustBadges,
      {
        id: "grammy",
        type: "certification" as const,
        icon: Award,
        label: "Grammy Winner",
        description: "3x Grammy Award winner",
        verified: true
      },
      {
        id: "humanitarian",
        type: "certification" as const,
        icon: Heart,
        label: "Humanitarian",
        description: "Yéle Haiti founder",
        verified: true
      }
    ] as TrustBadge[],
    
    microConversions: [
      {
        id: "watch-intro",
        type: "view" as const,
        label: "Watch intro video",
        action: () => console.log("Watched intro"),
        value: 2
      },
      {
        id: "view-gallery",
        type: "engage" as const,
        label: "Browse video gallery",
        action: () => console.log("Viewed gallery"),
        value: 2
      },
      {
        id: "read-reviews",
        type: "engage" as const,
        label: "Read customer reviews",
        action: () => console.log("Read reviews"),
        value: 3
      },
      {
        id: "check-availability",
        type: "engage" as const,
        label: "Check availability",
        action: () => console.log("Checked availability"),
        value: 3
      }
    ] as MicroConversion[],
    
    fallbackActions: [
      {
        id: "save",
        type: "save" as const,
        label: "Save for Later",
        description: "Add to favorites and get notified",
        icon: Heart,
        action: () => toast.success("Saved to favorites!"),
        highlighted: true
      },
      {
        id: "waitlist",
        type: "waitlist" as const,
        label: "Join Waitlist",
        description: "Get priority when spots open",
        icon: Clock,
        action: () => toast.success("Added to waitlist!")
      },
      {
        id: "preview",
        type: "preview" as const,
        label: "Free Preview",
        description: "See sample videos",
        icon: Gift,
        action: () => toast.info("Loading preview...")
      },
      {
        id: "chat",
        type: "chat" as const,
        label: "Chat Support",
        description: "Questions? We're here to help",
        icon: MessageSquare,
        action: () => toast.info("Opening chat...")
      }
    ] as FallbackAction[]
  }
}

export default function EnhancedCreatorProfile() {
  const params = useParams()
  const router = useRouter()
  const creatorId = params.id as string
  const creator = enhancedCreatorsData[creatorId as keyof typeof enhancedCreatorsData]
  
  const [selectedTier, setSelectedTier] = React.useState<PricingTier | null>(null)
  const [activeSection, setActiveSection] = React.useState("overview")
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState<TimeSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = React.useState(false)
  const [viewerCount, setViewerCount] = React.useState(23)
  const isMobile = useIsMobile()
  
  // Smart defaults for forms
  const { defaults: smartDefaults, saveDefault } = useSmartDefaults("user-123")

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Creator not found</h1>
          <p className="text-gray-600 mb-6">The creator you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/browse")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Browse Creators
          </button>
        </div>
      </div>
    )
  }

  const handleBook = () => {
    setShowBookingModal(true)
  }
  
  const handleBookingComplete = (data: any) => {
    console.log("Booking completed:", data)
    toast.success("Your booking has been confirmed! 🎉")
    setShowBookingModal(false)
    // In a real app, would redirect to confirmation page
    router.push(`/booking/confirmation/${creatorId}`)
  }
  
  const handleAbandonmentTrigger = (trigger: AbandonmentTrigger) => {
    console.log("Abandonment trigger:", trigger)
    // Could send analytics or trigger re-engagement campaigns
  }

  const handleFollow = () => {
    toast.success("Following creator")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${creator.hero.name} on Ann Pale`,
        text: `Book a personalized video from ${creator.hero.name}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  const handleMessage = () => {
    toast.info("Opening message composer")
    router.push(`/message/${creatorId}`)
  }

  const handlePlayVideo = (videoId: string) => {
    toast.info(`Playing video: ${videoId}`)
  }

  const handleMediaClick = (media: MediaItem) => {
    if (media.type === "press" && media.url.startsWith("http")) {
      window.open(media.url, "_blank")
    } else {
      toast.info(`Opening ${media.type}: ${media.title}`)
    }
  }

  const handleReviewHelpful = (reviewId: string, helpful: boolean) => {
    toast.success(helpful ? "Marked as helpful" : "Feedback recorded")
  }

  const handleReviewReport = (reviewId: string) => {
    toast.info("Review reported for moderation")
  }

  const handleReviewSubmit = async (data: ReviewFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success("Thank you for your review!")
    console.log("Review submitted:", data)
  }

  const handleRefresh = async () => {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success("Content refreshed!")
  }

  // Mobile-specific rendering
  if (isMobile) {
    const mobileNavigationSections = [
      {
        id: "overview",
        title: "Overview",
        icon: Info,
        content: (
          <div className="space-y-4">
            {creator.storytellingBio && (
              <StorytellingBio
                data={creator.storytellingBio}
                creatorName={creator.hero.name}
                variant="compact"
              />
            )}
            <AchievementShowcase
              data={creator.achievements}
              creatorName={creator.hero.name}
              variant="compact"
            />
          </div>
        )
      },
      {
        id: "services",
        title: "Services",
        icon: Star,
        badge: "Popular",
        content: (
          <ServiceDetails
            data={creator.serviceDetails}
            creatorName={creator.hero.name}
            onBookNow={handleBook}
            variant="mobile"
          />
        )
      },
      {
        id: "reviews",
        title: "Reviews",
        icon: MessageSquare,
        badge: `${creator.reviews.stats.total}`,
        content: (
          <MobileReviewTabs
            reviews={creator.reviews.reviews}
            stats={creator.reviews.stats}
            onFilter={(rating) => console.log("Filter by rating:", rating)}
            onLoadMore={() => console.log("Load more reviews")}
          />
        )
      },
      {
        id: "schedule",
        title: "Availability",
        icon: Calendar,
        content: (
          <div className="space-y-4">
            <AvailabilityCalendar
              data={creator.availability}
              onDateSelect={setSelectedDate}
              onRushToggle={(enabled) => toast.info(`Rush: ${enabled ? "on" : "off"}`)}
              variant="compact"
            />
            {selectedDate && (
              <TimeSlotSelector
                data={{ ...creator.timeSlots, date: selectedDate }}
                onTimeSelect={setSelectedTimeSlot}
                variant="mobile"
              />
            )}
          </div>
        )
      },
      {
        id: "community",
        title: "Community",
        icon: Users,
        content: (
          <div className="space-y-4">
            <FollowFavoriteSystem
              data={creator.socialEngagement}
              creatorName={creator.hero.name}
              variant="compact"
            />
            <QnASection
              data={creator.qna}
              creatorName={creator.hero.name}
              variant="compact"
            />
          </div>
        )
      }
    ]

    return (
      <MobilePerformanceWrapper>
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="min-h-screen bg-gray-50 pb-20">
            {/* Mobile Header */}
            <div className="p-4">
              <MobileProfileHeader
                data={creator.hero}
                onBook={handleBook}
                onFollow={handleFollow}
                onShare={handleShare}
                onMessage={handleMessage}
              />
            </div>

            {/* Mobile Gallery */}
            {creator.mediaGallery && (
              <div className="px-4 mb-6">
                <MobileGalleryCarousel
                  items={creator.mediaGallery.recentDeliveries}
                  title="Recent Videos"
                  onItemClick={handleMediaClick}
                />
              </div>
            )}

            {/* Mobile Navigation Accordion */}
            <div className="px-4 mb-6">
              <MobileNavigationAccordion
                sections={mobileNavigationSections}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Sticky Mobile Booking Bar */}
            <StickyMobileBookingBar
              price={creator.hero.price}
              originalPrice={creator.hero.originalPrice}
              discount={creator.hero.discount}
              availability={creator.availability.status}
              onBook={handleBook}
              show={true}
            />

            {/* Mobile Quick Actions */}
            <MobileQuickActions
              actions={[
                {
                  icon: Heart,
                  label: "Save",
                  action: () => toast.success("Saved!"),
                  badge: "New"
                },
                {
                  icon: MessageSquare,
                  label: "Message",
                  action: handleMessage
                },
                {
                  icon: Share2,
                  label: "Share",
                  action: handleShare
                }
              ]}
            />

            {/* Mobile Social Proof */}
            {creator.socialProof && (
              <SocialProofWidgets
                data={creator.socialProof}
                variant="floating"
              />
            )}
          </div>
        </PullToRefresh>
      </MobilePerformanceWrapper>
    )
  }

  // Desktop rendering continues below
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Hero Section */}
      <ProfileHero
        data={creator.hero}
        onBook={handleBook}
        onFollow={handleFollow}
        onShare={handleShare}
        onMessage={handleMessage}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Featured Media Carousel */}
        {creator.mediaGallery && (
          <div className="mb-8">
            <MediaCarousel
              title="Recent Video Messages"
              items={creator.mediaGallery.recentDeliveries.map(item => ({
                id: item.id,
                type: item.type as "video" | "photo",
                title: item.title,
                thumbnail: item.thumbnail,
                url: item.url,
                duration: item.duration,
                views: item.views,
                featured: item.featured
              }))}
              autoPlay={true}
              onItemClick={(item) => handleMediaClick(item as MediaItem)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Details & Media Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {/* Storytelling Bio Section */}
            {creator.storytellingBio && (
              <StorytellingBio
                data={creator.storytellingBio}
                creatorName={creator.hero.name}
                variant="full"
              />
            )}
            
            {/* Service Details */}
            {creator.serviceDetails && (
              <ServiceDetails
                data={creator.serviceDetails}
                creatorName={creator.hero.name}
                onBookNow={handleBook}
                variant="tabbed"
              />
            )}
            
            {/* Availability & Scheduling */}
            {creator.availability && (
              <AvailabilityCalendar
                data={creator.availability}
                onDateSelect={(date) => {
                  toast.info(`Selected date: ${format(date, "MMM d, yyyy")}`)
                  setSelectedDate(date)
                }}
                onRushToggle={(enabled) => {
                  toast.info(`Rush delivery ${enabled ? "enabled" : "disabled"}`)
                }}
                variant="full"
              />
            )}
            
            {/* Time Slot Selection (shown when date is selected) */}
            {selectedDate && creator.timeSlots && (
              <TimeSlotSelector
                data={{
                  ...creator.timeSlots,
                  date: selectedDate
                }}
                onSlotSelect={(slot) => {
                  toast.success(`Selected time slot: ${slot.startTime} - ${slot.endTime}`)
                  setSelectedTimeSlot(slot)
                }}
                selectedSlot={selectedTimeSlot}
                variant="grid"
              />
            )}
            
            {/* Achievement Showcase */}
            {creator.achievements && (
              <AchievementShowcase
                data={creator.achievements}
                creatorName={creator.hero.name}
                variant="full"
              />
            )}
            
            {/* Fun Facts & Personality */}
            {creator.funFacts && (
              <FunFactsPersonality
                data={creator.funFacts}
                creatorName={creator.hero.name}
                variant="interactive"
              />
            )}
            
            {/* Social Engagement */}
            {creator.socialEngagement && (
              <FollowFavoriteSystem
                data={creator.socialEngagement}
                creatorName={creator.hero.name}
                onFollow={(following) => toast.info(`${following ? 'Following' : 'Unfollowed'} ${creator.hero.name}`)}
                onFavorite={(favorited) => toast.info(`${favorited ? 'Added to' : 'Removed from'} favorites`)}
                onNotificationToggle={(type, enabled) => toast.info(`${type} notifications ${enabled ? 'enabled' : 'disabled'}`)}
                variant="full"
              />
            )}
            
            {/* Q&A Section */}
            {creator.qna && (
              <QnASection
                data={creator.qna}
                creatorName={creator.hero.name}
                onQuestionSubmit={(question, category) => toast.success("Question submitted!")}
                onQuestionUpvote={(id) => toast.info("Question upvoted")}
                onAnswerSubmit={(id, answer) => toast.success("Answer posted!")}
                variant="full"
              />
            )}
            
            {/* Fan Wall */}
            {creator.fanWall && (
              <FanWall
                data={creator.fanWall}
                creatorName={creator.hero.name}
                onPostSubmit={(post) => toast.success("Your story has been submitted!")}
                onPostLike={(id) => toast.info("Post liked")}
                onPostReport={(id) => toast.info("Post reported")}
                variant="grid"
              />
            )}
            
            <ProfileDetails
              data={creator.profileDetails}
              onPlayVideo={handlePlayVideo}
            />
            
            {/* Media Gallery */}
            {creator.mediaGallery && (
              <MediaGallery
                data={creator.mediaGallery}
                creatorName={creator.hero.name}
                onMediaClick={handleMediaClick}
              />
            )}
            
            {/* Reviews Section */}
            {creator.reviews && (
              <div className="space-y-4">
                <ReviewSystem
                  data={creator.reviews}
                  onHelpful={handleReviewHelpful}
                  onReport={handleReviewReport}
                />
                
                {/* Review Prompt for Testing */}
                <div className="flex justify-center">
                  <ReviewPromptDialog
                    creatorName={creator.hero.name}
                    bookingId="test-booking-123"
                    onSubmit={handleReviewSubmit}
                  />
                </div>
              </div>
            )}
            
            {/* Comments Section */}
            {creator.comments && (
              <CommentsSection
                data={creator.comments}
                currentUserId="current-user"
                onCommentSubmit={(content, parentId) => toast.success("Comment posted!")}
                onCommentLike={(id) => toast.info("Comment liked")}
                onCommentDelete={(id) => toast.success("Comment deleted")}
                onCommentEdit={(id, content) => toast.success("Comment updated")}
                onCommentReport={(id) => toast.info("Comment reported")}
                variant="full"
              />
            )}
          </div>

          {/* Right Column - Booking Sidebar with Conversion Optimization */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Viewer Count */}
            <LiveViewerCount
              count={viewerCount}
              trend="up"
              className="p-3 bg-white rounded-lg shadow-sm"
            />
            
            {/* Urgency Countdown */}
            <UrgencyCountdown
              endTime={new Date(Date.now() + 3600000)} // 1 hour from now
              message="Special offer ends in"
              onExpire={() => toast.info("Offer expired")}
            />
            
            {/* Security Indicator */}
            <SecurityIndicator
              level="high"
              showDetails={true}
              className="p-3 bg-white rounded-lg shadow-sm"
            />
            
            {/* Urgency Indicators */}
            {creator.urgencyIndicators && (
              <UrgencyIndicators
                urgency={creator.urgencyIndicators}
                variant="banner"
              />
            )}
            
            {/* Social Proof Widgets */}
            {creator.socialProof && (
              <SocialProofWidgets
                data={creator.socialProof}
                variant="inline"
                showActivity={true}
                showStats={true}
                showPopularity={true}
              />
            )}
            
            {/* Social Proof Ticker */}
            <SocialProofTicker
              activities={[
                {
                  id: "1",
                  user: "Sarah M.",
                  action: "just booked a video",
                  time: new Date(Date.now() - 300000),
                  location: "New York"
                },
                {
                  id: "2",
                  user: "John D.",
                  action: "left a 5-star review",
                  time: new Date(Date.now() - 600000),
                  location: "Miami"
                },
                {
                  id: "3",
                  user: "Marie L.",
                  action: "received their video",
                  time: new Date(Date.now() - 900000),
                  location: "Boston"
                }
              ]}
            />
            
            <DecisionFactors
              data={creator.decisionFactors}
              onSelectTier={setSelectedTier}
              onBookNow={handleBook}
              variant="sidebar"
            />
            
            {/* Guest Checkout Option */}
            <GuestCheckoutOption
              onGuestCheckout={() => {
                toast.info("Starting guest checkout")
                handleBook()
              }}
              onCreateAccount={() => {
                toast.info("Creating account")
                router.push("/signup")
              }}
            />
            
            {/* Success Stories */}
            <SuccessStoriesCarousel
              stories={[
                {
                  id: "1",
                  author: "Emma K.",
                  content: "The video was perfect! My mom cried happy tears on her birthday.",
                  rating: 5,
                  date: new Date(Date.now() - 86400000),
                  verified: true
                },
                {
                  id: "2",
                  author: "David R.",
                  content: "Amazing quality and delivered so quickly. Worth every penny!",
                  rating: 5,
                  date: new Date(Date.now() - 172800000),
                  verified: true
                },
                {
                  id: "3",
                  author: "Lisa M.",
                  content: "My husband was so surprised! Thank you for making our anniversary special.",
                  rating: 5,
                  date: new Date(Date.now() - 259200000),
                  verified: true
                }
              ]}
            />
            
            {/* Trust Badges */}
            {creator.trustBadges && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Trust & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TrustBadges
                    badges={creator.trustBadges}
                    variant="grid"
                  />
                </CardContent>
              </Card>
            )}
            
            {/* Micro-Conversion Tracker */}
            {creator.microConversions && (
              <MicroConversionTracker
                conversions={creator.microConversions}
                onConversion={(id, type) => console.log(`Conversion: ${type} - ${id}`)}
              />
            )}
            
            {/* Fallback Actions */}
            {creator.fallbackActions && (
              <FallbackActions
                actions={creator.fallbackActions}
                title="More Options"
              />
            )}
            
            {/* Satisfaction Guarantee */}
            <SatisfactionGuarantee
              percentage={100}
              days={30}
            />
            
            {/* Payment Method Trust */}
            <PaymentMethodTrust
              methods={["visa", "mastercard", "amex", "paypal", "apple_pay"]}
            />
            
            {/* Trust Badges Grid */}
            <TrustBadgesGrid
              variant="compact"
            />
          </div>
        </div>
      </div>
      
      {/* Sticky CTA Bar */}
      {creator.stickyCTA && (
        <StickyCTABar
          data={creator.stickyCTA}
          onBookNow={handleBook}
          onSaveForLater={() => toast.success("Saved for later!")}
          onMessage={handleMessage}
          showThreshold={50}
          variant="compact"
        />
      )}
      
      {/* Exit Intent Modal */}
      {creator.exitIntent && (
        <ExitIntentModal
          data={creator.exitIntent}
          onAccept={(email) => {
            if (email) {
              toast.success(`Offer sent to ${email}!`)
            } else {
              toast.success("Offer activated!")
            }
          }}
          onDecline={() => console.log("Exit intent declined")}
          onClose={() => console.log("Exit intent closed")}
          triggerDelay={1000}
        />
      )}
      
      {/* Floating Social Proof */}
      {creator.socialProof && (
        <SocialProofWidgets
          data={creator.socialProof}
          variant="floating"
        />
      )}
      
      {/* Psychology-Optimized Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Book Your Video from {creator.hero.name}</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Psychology-Optimized Checkout */}
            <PsychologyOptimizedCheckout
              steps={defaultCheckoutSteps}
              creatorName={creator.hero.name}
              price={{
                amount: selectedTier?.price || creator.hero.price,
                currency: "$",
                original: creator.hero.originalPrice
              }}
              onComplete={handleBookingComplete}
              onAbandon={handleAbandonmentTrigger}
            />
            
            {/* Order Summary Confidence */}
            <div className="mt-6">
              <OrderSummaryConfidence
                items={[
                  {
                    label: "Video Message",
                    value: `$${selectedTier?.price || creator.hero.price}`,
                    highlight: true
                  },
                  {
                    label: "Processing Fee",
                    value: "$0"
                  },
                  {
                    label: "Delivery",
                    value: selectedDate ? format(selectedDate, "MMM d") : "3-5 days"
                  }
                ]}
                total={selectedTier?.price || creator.hero.price}
                savings={creator.hero.originalPrice ? creator.hero.originalPrice - creator.hero.price : 0}
              />
            </div>
            
            {/* One-Click Checkout Options */}
            <div className="mt-6">
              <OneClickCheckout
                methods={[
                  { id: "apple_pay", name: "Apple Pay", icon: CreditCard, color: "bg-black text-white" },
                  { id: "google_pay", name: "Google Pay", icon: CreditCard, color: "bg-blue-600 text-white" },
                  { id: "paypal", name: "PayPal", icon: CreditCard, color: "bg-yellow-400 text-black" }
                ]}
                onCheckout={(method) => {
                  toast.info(`Processing with ${method}`)
                  handleBookingComplete({ paymentMethod: method })
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}