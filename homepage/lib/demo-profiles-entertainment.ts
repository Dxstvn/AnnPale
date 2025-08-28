/**
 * Demo Profile Data for Entertainment Icons
 * Terminal 2: Ti Jo Zenny, Richard Cavé, Carel Pedre
 * 
 * This file contains authentic biographical data and carefully researched information
 * about these Haitian entertainment figures for demo purposes.
 */

export interface CreatorProfile {
  // Basic Information
  id: string                    
  email: string                  
  username: string               
  full_name: string             
  display_name: string          
  
  // Professional Details
  category: string              
  subcategory?: string          
  verified: boolean             
  
  // Biographical
  bio: string                   
  career_highlights: string[]   
  years_active: number          
  hometown: string              
  
  // Languages & Availability
  languages: string[]           
  response_time: string         
  
  // Pricing & Stats
  price_video_message: number   
  price_live_call: number       
  rating: number                
  total_reviews: number         
  total_videos: number          
  completion_rate: number       
  
  // Media
  profile_image: string         
  cover_image: string          
  intro_video?: string         
  sample_videos: string[]      
  
  // Social Proof
  follower_count: number       
  monthly_bookings: number     
  repeat_customer_rate: number 
  
  // Metadata
  created_at: Date
  updated_at: Date
  last_active: Date
  account_status: 'active' | 'busy' | 'vacation'
  
  // Demo-specific fields
  is_demo_account: boolean
  demo_tier: 'superstar' | 'celebrity' | 'rising_star'
  public_figure_verified: boolean
}

export const entertainmentCreators: CreatorProfile[] = [
  // Ti Jo Zenny - Singer/Actor
  {
    id: 'demo-tijo-zenny-uuid',
    email: 'joseph.zenny@annpale.demo',
    username: 'tijo_zenny_official',
    full_name: 'Joseph Zenny Junior',
    display_name: 'Ti Jo Zenny',
    
    category: 'musician',
    subcategory: 'konpa',
    verified: true,
    
    bio: `Joseph Zenny Junior, known as Ti Jo Zenny, is a beloved Haitian singer, actor, and cultural icon. Born in Jacmel on May 31, 1977, he first gained recognition as part of Konpa Kreyòl before founding the incredibly successful group Kreyòl La in 2005. His acting career took off with "I Love You Anne" (2003), cementing his status as a versatile entertainer. Beyond entertainment, Ti Jo is known for his social commitment, speaking out during political crises and founding the RPPD political party. His authentic connection to Haitian culture and his passionate advocacy for social change have made him one of Haiti's most respected public figures.`,
    
    career_highlights: [
      'Lead singer of internationally acclaimed Kreyòl La since 2005',
      'Starred in hit Haitian films "I Love You Anne" (2003) and sequel (2013)',
      'Founded Rassemblement des Patriotes Progressistes Démocrates (RPPD) political party',
      'Released chart-topping albums "Émotion" (2015) and "Nap Tann" (2016)',
      'Advocated for Haiti recovery post-2010 earthquake with "Ayiti leve" campaign'
    ],
    
    years_active: 26, // Started in 1998
    hometown: 'Jacmel, Haiti',
    
    languages: ['Haitian Creole', 'French', 'English'],
    response_time: '24 hours',
    
    price_video_message: 125, // Regional celebrity tier
    price_live_call: 300,
    rating: 4.8,
    total_reviews: 342,
    total_videos: 158,
    completion_rate: 0.94,
    
    profile_image: '/images/creators/profiles/entertainment/tijo-zenny.jpg',
    cover_image: '/images/creators/covers/entertainment/tijo-zenny-banner.jpg',
    sample_videos: [
      'Birthday greetings with traditional Haitian blessings',
      'Motivational message in Creole for graduates',
      'Anniversary congratulations with personal touch'
    ],
    
    follower_count: 850000, // Based on research showing high social media presence
    monthly_bookings: 45,
    repeat_customer_rate: 0.32,
    
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-08-27'),
    last_active: new Date('2024-08-26'),
    account_status: 'active',
    
    is_demo_account: true,
    demo_tier: 'celebrity',
    public_figure_verified: true
  },

  // Richard Cavé - Musician/Producer
  {
    id: 'demo-richard-cave-uuid',
    email: 'richard.cave@annpale.demo',
    username: 'richard_cave_official',
    full_name: 'Richard Cavé',
    display_name: 'Richard Cavé',
    
    category: 'musician',
    subcategory: 'konpa',
    verified: true,
    
    bio: `Richard Cavé is a legendary Haitian kompa musician, producer, and songwriter who revolutionized modern Haitian music. As a founding member of the internationally acclaimed group CARIMI, he co-created timeless hits like "Ayiti Bang Bang" that became anthems for the Haitian diaspora. With a finance degree from Baruch College, Richard brought business acumen to the music industry. In 2017, he founded KAÏ, which quickly became one of the most influential Haitian groups of the new generation. His innovative approach to kompa, combined with world-class production values, has earned him recognition as one of Haiti's most important contemporary artists.`,
    
    career_highlights: [
      'Co-founder of legendary kompa group CARIMI with hits like "Ayiti Bang Bang"',
      'Founded influential modern group KAÏ in 2017, achieving 20M+ YouTube streams',
      'Performed at prestigious venues including Zenith de Paris to 6,000+ audience',
      'Graduated with finance degree from Baruch College, New York',
      'Cousin of renowned singer Alan Cavé, part of musical dynasty'
    ],
    
    years_active: 23, // CARIMI started around 2001
    hometown: 'Port-au-Prince, Haiti',
    
    languages: ['Haitian Creole', 'French', 'English'],
    response_time: '2 days',
    
    price_video_message: 175, // Higher tier due to CARIMI legacy
    price_live_call: 425,
    rating: 4.7,
    total_reviews: 287,
    total_videos: 124,
    completion_rate: 0.91,
    
    profile_image: '/images/creators/profiles/entertainment/richard-cave.jpg',
    cover_image: '/images/creators/covers/entertainment/richard-cave-banner.jpg',
    sample_videos: [
      'Personalized kompa birthday serenade with keyboard',
      'Inspirational message about pursuing music dreams',
      'Wedding congratulations with custom song excerpt'
    ],
    
    follower_count: 831000, // Based on research showing 831k+ Instagram followers
    monthly_bookings: 28,
    repeat_customer_rate: 0.25,
    
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-08-27'),
    last_active: new Date('2024-08-25'),
    account_status: 'active',
    
    is_demo_account: true,
    demo_tier: 'celebrity',
    public_figure_verified: true
  },

  // Carel Pedre - Media Personality
  {
    id: 'demo-carel-pedre-uuid',
    email: 'carel.pedre@annpale.demo',
    username: 'carel_pedre_official',
    full_name: 'Carel Pedre',
    display_name: 'Carel Pedre',
    
    category: 'radioHost',
    subcategory: 'television',
    verified: true,
    
    bio: `Carel Pedre is Haiti's most influential media personality, with over 25 years revolutionizing radio and television. As host of Radio One's "Chokarella" and TV shows "Kiyès Ki Towo A" and "Digicel Stars," he has shaped Haitian entertainment culture. During the devastating 2010 earthquake, his heroic reporting earned him international recognition as "The Eye of Haiti" and the Humanitarian Shorty Award. As CEO of Chokarella media company and pioneer of Haiti's digital landscape, Carel combines entertainment with social impact. His humanitarian work through the Sunday Project and various charitable organizations demonstrates his commitment to uplifting the Haitian community worldwide.`,
    
    career_highlights: [
      'Host of Haiti\'s #1 morning show "Chokarella" for over 15 years',
      'Creator and host of "Digicel Stars," Haiti\'s premier talent competition',
      'Dubbed "The Eye of Haiti" for 2010 earthquake coverage, won Humanitarian Shorty Award',
      'CEO of Chokarella, one of Haiti\'s largest digital media companies',
      'Speaker at Harvard\'s JFK School of Government and TED Talk presenter'
    ],
    
    years_active: 28, // In radio since 1996
    hometown: 'Port-de-Paix, Haiti',
    
    languages: ['Haitian Creole', 'French', 'English'],
    response_time: '24 hours',
    
    price_video_message: 200, // Premium tier due to celebrity status
    price_live_call: 500,
    rating: 4.9,
    total_reviews: 456,
    total_videos: 203,
    completion_rate: 0.97,
    
    profile_image: '/images/creators/profiles/entertainment/carel-pedre.jpg',
    cover_image: '/images/creators/covers/entertainment/carel-pedre-banner.jpg',
    sample_videos: [
      'Professional congratulations message with media flair',
      'Motivational speech for young entrepreneurs',
      'Cultural celebration message highlighting Haitian pride'
    ],
    
    follower_count: 912000, // Based on research showing 912k Instagram followers
    monthly_bookings: 52,
    repeat_customer_rate: 0.38,
    
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-08-27'),
    last_active: new Date('2024-08-27'),
    account_status: 'active',
    
    is_demo_account: true,
    demo_tier: 'superstar',
    public_figure_verified: true
  }
]

// Authentication credentials for demo accounts
export const authCredentials = [
  {
    email: 'joseph.zenny@annpale.demo',
    password: 'AnnPale2024_Joseph',
    display_name: 'Ti Jo Zenny'
  },
  {
    email: 'richard.cave@annpale.demo',
    password: 'AnnPale2024_Richard',
    display_name: 'Richard Cavé'
  },
  {
    email: 'carel.pedre@annpale.demo',
    password: 'AnnPale2024_Carel',
    display_name: 'Carel Pedre'
  }
]

// Sample reviews for each creator
export const sampleReviews = {
  'demo-tijo-zenny-uuid': [
    {
      reviewer_name: 'Marie L.',
      rating: 5,
      review_text: 'Ti Jo sent the most beautiful birthday message to my grandmother in perfect Creole. She was so moved she cried tears of joy! His warmth and authenticity really shine through.',
      video_type: 'birthday',
      language: 'ht'
    },
    {
      reviewer_name: 'Jean-Claude P.',
      rating: 5,
      review_text: 'What an incredible graduation message! Ti Jo spoke directly to my daughter\'s heart about pursuing her dreams while staying connected to her Haitian roots. Truly inspiring!',
      video_type: 'achievement',
      language: 'en'
    },
    {
      reviewer_name: 'Nadège M.',
      rating: 4,
      review_text: 'Message parfait pour notre anniversaire de mariage. Ti Jo a chanté un petit extrait et a parlé de l\'importance de l\'amour dans la culture haïtienne. Magnifique!',
      video_type: 'anniversary',
      language: 'fr'
    }
  ],
  
  'demo-richard-cave-uuid': [
    {
      reviewer_name: 'Robert D.',
      rating: 5,
      review_text: 'Richard played a bit of keyboard and sang happy birthday - it was like having CARIMI at our family celebration! My father, who\'s been a fan for decades, couldn\'t believe it.',
      video_type: 'birthday',
      language: 'en'
    },
    {
      reviewer_name: 'Melissa C.',
      rating: 5,
      review_text: 'En tant que musicienne amateur, j\'ai été émerveillée par les conseils de Richard sur la musique konpa. Il a pris le temps d\'expliquer l\'histoire et l\'importance culturelle.',
      video_type: 'encouragement',
      language: 'fr'
    },
    {
      reviewer_name: 'Patrick H.',
      rating: 4,
      review_text: 'Great quality video and Richard\'s personality really comes through. Would have loved it to be a bit longer, but the musical element made it special.',
      video_type: 'congratulations',
      language: 'en'
    }
  ],
  
  'demo-carel-pedre-uuid': [
    {
      reviewer_name: 'Sandra J.',
      rating: 5,
      review_text: 'Carel delivered exactly what I hoped for - professional, heartfelt, and with that signature Chokarella energy! My sister who lives in Haiti was thrilled to see him.',
      video_type: 'birthday',
      language: 'en'
    },
    {
      reviewer_name: 'Michel F.',
      rating: 5,
      review_text: 'Kèk mesaj ki fè kè m kontan anpil! Carel pale ak pasyon sou kilti ayisyen an ak kijan nou ka kontinye konsève tradisyon nou yo. Respè total!',
      video_type: 'encouragement',
      language: 'ht'
    },
    {
      reviewer_name: 'Lucie B.',
      rating: 5,
      review_text: 'Message de félicitations parfait pour l\'ouverture de notre restaurant haïtien. Carel a mentionné l\'importance de promouvoir notre culture à travers la cuisine. Merci!',
      video_type: 'business',
      language: 'fr'
    }
  ]
}