/**
 * Demo Content Generator for Entertainment Icons
 * Generates realistic sample videos, reviews, and other content
 * for Ti Jo Zenny, Richard Cavé, and Carel Pedre
 */

export interface SampleVideo {
  id: string
  creator_id: string
  title: string
  description: string
  duration_seconds: number
  thumbnail_url: string
  category: string
  language: string
  view_count: number
  created_at: Date
}

export interface DemoReview {
  id: string
  creator_id: string
  reviewer_name: string
  rating: number
  review_text: string
  video_type: string
  language: string
  created_at: Date
}

export interface CreatorStats {
  id: string
  profile_id: string
  total_earnings: number
  videos_this_month: number
  average_turnaround_hours: number
  satisfaction_score: number
  featured_category: string
  trending_rank: number
}

// Sample videos for Ti Jo Zenny
export const tijoSampleVideos: SampleVideo[] = [
  {
    id: 'demo-video-tijo-1',
    creator_id: 'demo-tijo-zenny-uuid',
    title: 'Joyous Birthday Blessing in Creole',
    description: 'Traditional Haitian birthday wishes with cultural blessings and warm personal message',
    duration_seconds: 45,
    thumbnail_url: '/images/video-thumbnails/tijo-birthday.jpg',
    category: 'birthday',
    language: 'ht',
    view_count: 1247,
    created_at: new Date('2024-08-20')
  },
  {
    id: 'demo-video-tijo-2',
    creator_id: 'demo-tijo-zenny-uuid',
    title: 'Graduation Congratulations & Life Advice',
    description: 'Inspiring message for graduates about pursuing dreams while honoring Haitian heritage',
    duration_seconds: 62,
    thumbnail_url: '/images/video-thumbnails/tijo-graduation.jpg',
    category: 'achievement',
    language: 'en',
    view_count: 892,
    created_at: new Date('2024-08-18')
  },
  {
    id: 'demo-video-tijo-3',
    creator_id: 'demo-tijo-zenny-uuid',
    title: 'Wedding Anniversary Celebration',
    description: 'Heartfelt anniversary wishes with brief musical performance and love advice',
    duration_seconds: 75,
    thumbnail_url: '/images/video-thumbnails/tijo-anniversary.jpg',
    category: 'anniversary',
    language: 'fr',
    view_count: 634,
    created_at: new Date('2024-08-15')
  }
]

// Sample videos for Richard Cavé
export const richardSampleVideos: SampleVideo[] = [
  {
    id: 'demo-video-richard-1',
    creator_id: 'demo-richard-cave-uuid',
    title: 'Birthday Serenade with Keyboard',
    description: 'Personal birthday message featuring live keyboard performance of kompa melody',
    duration_seconds: 55,
    thumbnail_url: '/images/video-thumbnails/richard-birthday.jpg',
    category: 'birthday',
    language: 'en',
    view_count: 1543,
    created_at: new Date('2024-08-22')
  },
  {
    id: 'demo-video-richard-2',
    creator_id: 'demo-richard-cave-uuid',
    title: 'Music Career Inspiration',
    description: 'Encouraging message for aspiring musicians with insights from CARIMI days',
    duration_seconds: 68,
    thumbnail_url: '/images/video-thumbnails/richard-inspiration.jpg',
    category: 'encouragement',
    language: 'fr',
    view_count: 987,
    created_at: new Date('2024-08-19')
  },
  {
    id: 'demo-video-richard-3',
    creator_id: 'demo-richard-cave-uuid',
    title: 'Wedding Blessing with Song Snippet',
    description: 'Beautiful wedding congratulations featuring custom kompa arrangement',
    duration_seconds: 82,
    thumbnail_url: '/images/video-thumbnails/richard-wedding.jpg',
    category: 'wedding',
    language: 'ht',
    view_count: 756,
    created_at: new Date('2024-08-16')
  }
]

// Sample videos for Carel Pedre
export const carelSampleVideos: SampleVideo[] = [
  {
    id: 'demo-video-carel-1',
    creator_id: 'demo-carel-pedre-uuid',
    title: 'Professional Congratulations Message',
    description: 'Dynamic congratulations with signature Chokarella energy and cultural pride',
    duration_seconds: 58,
    thumbnail_url: '/images/video-thumbnails/carel-congrats.jpg',
    category: 'congratulations',
    language: 'en',
    view_count: 2156,
    created_at: new Date('2024-08-24')
  },
  {
    id: 'demo-video-carel-2',
    creator_id: 'demo-carel-pedre-uuid',
    title: 'Entrepreneur Motivation Speech',
    description: 'Inspiring message for young business owners featuring media industry insights',
    duration_seconds: 71,
    thumbnail_url: '/images/video-thumbnails/carel-entrepreneur.jpg',
    category: 'business',
    language: 'fr',
    view_count: 1432,
    created_at: new Date('2024-08-21')
  },
  {
    id: 'demo-video-carel-3',
    creator_id: 'demo-carel-pedre-uuid',
    title: 'Cultural Pride Celebration',
    description: 'Passionate message about Haitian heritage and community strength',
    duration_seconds: 64,
    thumbnail_url: '/images/video-thumbnails/carel-culture.jpg',
    category: 'cultural',
    language: 'ht',
    view_count: 1887,
    created_at: new Date('2024-08-17')
  }
]

// Creator statistics for database insertion
export const creatorStats: CreatorStats[] = [
  {
    id: 'demo-stats-tijo',
    profile_id: 'demo-tijo-zenny-uuid',
    total_earnings: 18750.00,
    videos_this_month: 15,
    average_turnaround_hours: 18,
    satisfaction_score: 4.85,
    featured_category: 'Cultural Messages',
    trending_rank: 3
  },
  {
    id: 'demo-stats-richard',
    profile_id: 'demo-richard-cave-uuid',
    total_earnings: 22400.00,
    videos_this_month: 12,
    average_turnaround_hours: 36,
    satisfaction_score: 4.72,
    featured_category: 'Musical Performances',
    trending_rank: 7
  },
  {
    id: 'demo-stats-carel',
    profile_id: 'demo-carel-pedre-uuid',
    total_earnings: 31200.00,
    videos_this_month: 18,
    average_turnaround_hours: 12,
    satisfaction_score: 4.91,
    featured_category: 'Professional Messages',
    trending_rank: 1
  }
]

// Additional review samples with more variety
export const additionalReviews: Record<string, DemoReview[]> = {
  'demo-tijo-zenny-uuid': [
    {
      id: 'review-tijo-4',
      creator_id: 'demo-tijo-zenny-uuid',
      reviewer_name: 'Rose-Marie D.',
      rating: 5,
      review_text: 'My son who lives in New York was so touched to receive a message in perfect Kreyòl from Ti Jo. It reminded him of home and brought tears to his eyes.',
      video_type: 'encouragement',
      language: 'en',
      created_at: new Date('2024-08-10')
    },
    {
      id: 'review-tijo-5',
      creator_id: 'demo-tijo-zenny-uuid',
      reviewer_name: 'Pierre L.',
      rating: 4,
      review_text: 'Excellent message pour mon anniversaire. Ti Jo a parlé de la musique konpa et de l\'importance de rester connecté à nos racines. Très authentique!',
      video_type: 'birthday',
      language: 'fr',
      created_at: new Date('2024-08-05')
    }
  ],
  
  'demo-richard-cave-uuid': [
    {
      id: 'review-richard-4',
      creator_id: 'demo-richard-cave-uuid',
      reviewer_name: 'Stephanie K.',
      rating: 5,
      review_text: 'As a huge CARIMI fan, getting a personal message from Richard was a dream come true. He even mentioned some behind-the-scenes stories from their touring days!',
      video_type: 'fan_message',
      language: 'en',
      created_at: new Date('2024-08-12')
    },
    {
      id: 'review-richard-5',
      creator_id: 'demo-richard-cave-uuid',
      reviewer_name: 'Max B.',
      rating: 5,
      review_text: 'Li te jwe yon ti kèk nòt sou piano a epi li te pale sou istwa mizik konpa. Kè m te kontan anpil! Respè total pou Richard!',
      video_type: 'educational',
      language: 'ht',
      created_at: new Date('2024-08-08')
    }
  ],
  
  'demo-carel-pedre-uuid': [
    {
      id: 'review-carel-4',
      creator_id: 'demo-carel-pedre-uuid',
      reviewer_name: 'Diana T.',
      rating: 5,
      review_text: 'Carel\'s message for our community center opening was perfect. His passion for Haitian culture and community development really shows through.',
      video_type: 'community',
      language: 'en',
      created_at: new Date('2024-08-14')
    },
    {
      id: 'review-carel-5',
      creator_id: 'demo-carel-pedre-uuid',
      reviewer_name: 'Johnson M.',
      rating: 5,
      review_text: 'Message exceptionnel pour notre émission de radio locale. Carel a donné des conseils précieux sur les médias et l\'importance de représenter correctement la culture haïtienne.',
      video_type: 'professional',
      language: 'fr',
      created_at: new Date('2024-08-11')
    }
  ]
}

// Export all sample data combined
export const allSampleVideos = [
  ...tijoSampleVideos,
  ...richardSampleVideos,
  ...carelSampleVideos
]

export const allSampleReviews = additionalReviews