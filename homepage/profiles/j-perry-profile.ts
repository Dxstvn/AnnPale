export const jPerryProfile = {
  id: 'j-perry-demo',
  name: 'J Perry',
  full_name: 'Jonathan Perry',
  email: 'jperry@annpale-demo.com',
  category: 'Singer/Songwriter/Producer',
  price: 125,
  currency: 'USD',
  bio: "J Perry, born Jonathan Perry in Port-au-Prince, Haiti, is an internationally acclaimed singer, songwriter, and producer who has revolutionized contemporary Haitian music. Starting classical piano at age six under his godfather's guidance, J Perry developed a unique sound that fuses Haitian roots music, kompa, reggae zouk, and soca into an innovative Caribbean pop style. His breakthrough came with the 2011 debut album \"One Life To Live,\" featuring the meteoric hit \"Dekole,\" which became the 2012 Haitian Carnival theme song and earned him a Gold Disk Plaque from President Michel Martelly. Making history as the first Haitian artist to perform at Trinidad & London Carnival, J Perry has collaborated with over 60 international artists and Grammy-winning producers. His global appeal reached new heights when \"Bouje\" was featured in Disney's \"Cars 3.\" Beyond music, J Perry champions social causes through his Ede'n Ede foundation, advocating against youth bullying in Haiti while continuing to bridge cultural boundaries with his infectious Caribbean pop sound that resonates from Port-au-Prince to international stages.",
  location: 'International (Haiti/USA)',
  languages: ['Haitian Creole', 'English', 'French', 'Spanish'],
  avatar_url: '/images/creators/profiles/djs/j-perry-profile.jpg',
  cover_url: '/images/creators/covers/djs/j-perry-cover.jpg',
  social_media: {
    website: 'jperryofficial.com',
    facebook: 'J.Perryofficial',
    instagram: '@jperryofficial',
    followers: 180000
  },
  available: true,
  response_time_hours: 72,
  total_reviews: 234,
  rating: 4.9,
  total_videos: 789,
  demo_account: true,
  is_featured: true,
  tags: ['caribbean-pop', 'kompa', 'reggae-zouk', 'soca', 'haitian-roots', 'disney-soundtrack', 'carnival', 'international'],
  achievements: [
    'Gold Disk Plaque from President Michel Martelly for "Dekole" (2012)',
    'Featured in Disney\'s "Cars 3" soundtrack with "Bouje"',
    'First Haitian artist to perform at Trinidad & London Carnival',
    'Performed at SXSW 2024',
    'Collaborated with 60+ international artists and Grammy-winning producers',
    'Founder of Ede\'n Ede foundation against youth bullying'
  ],
  pricing_tiers: {
    personal: { price: 125, description: "Personal video message with acoustic performance" },
    business: { price: 250, description: "Corporate message with custom song snippet" },
    special: { price: 400, description: "Full acoustic performance of requested song" }
  }
};

export const jPerryAuth = {
  email: 'jperry@annpale-demo.com',
  password: 'DemoPass2025!',
  role: 'creator' as const,
  profile_id: 'j-perry-demo',
  demo_account: true
};

export const jPerryReviews = [
  {
    id: 'review-jperry-1',
    creator_id: 'j-perry-demo',
    reviewer_name: 'Roseline D.',
    rating: 5,
    comment: "Having J Perry sing 'Dekole' for my daughter's sweet 16 was a dream come true! The presidential award winner himself! She cried tears of joy. Absolutely worth it for such a cultural icon! 🇭🇹👑",
    date: '2024-08-18',
    demo_review: true
  },
  {
    id: 'review-jperry-2',
    creator_id: 'j-perry-demo',
    reviewer_name: 'James M.',
    rating: 5,
    comment: "As someone who grew up with J Perry's music, getting a personal message was incredible. His voice is just as beautiful in person, and knowing his song was in Disney's Cars 3 makes it even more special!",
    date: '2024-08-14',
    demo_review: true
  },
  {
    id: 'review-jperry-3',
    creator_id: 'j-perry-demo',
    reviewer_name: 'Natalie P.',
    rating: 5,
    comment: "J Perry is a true gentleman and cultural ambassador. His message for our Haitian Heritage Month celebration was beautiful and inspiring. You can feel his passion for our culture!",
    date: '2024-08-09',
    demo_review: true
  },
  {
    id: 'review-jperry-4',
    creator_id: 'j-perry-demo',
    reviewer_name: 'David L.',
    rating: 4,
    comment: "Amazing artist with incredible international recognition. The Disney connection and presidential award really show his caliber. Professional and heartfelt delivery.",
    date: '2024-08-03',
    demo_review: true
  }
];

export const jPerrySampleVideos = [
  {
    id: 'sample-jperry-1',
    creator_id: 'j-perry-demo',
    title: 'Acoustic "Dekole" Performance',
    description: 'Intimate acoustic version of the iconic 2012 Carnival theme song',
    thumbnail_url: '/images/creators/samples/j-perry-dekole-acoustic.jpg',
    duration_seconds: 90,
    demo_video: true
  },
  {
    id: 'sample-jperry-2',
    creator_id: 'j-perry-demo',
    title: 'Birthday Serenade',
    description: 'Personalized birthday song with Caribbean pop flair',
    thumbnail_url: '/images/creators/samples/j-perry-birthday-serenade.jpg',
    duration_seconds: 75,
    demo_video: true
  },
  {
    id: 'sample-jperry-3',
    creator_id: 'j-perry-demo',
    title: 'Cultural Heritage Message',
    description: 'Inspirational message celebrating Haitian culture and heritage',
    thumbnail_url: '/images/creators/samples/j-perry-heritage-message.jpg',
    duration_seconds: 60,
    demo_video: true
  },
  {
    id: 'sample-jperry-4',
    creator_id: 'j-perry-demo',
    title: 'Behind the Scenes: Disney Feature',
    description: 'Story behind getting featured in Disney\'s "Cars 3" soundtrack',
    thumbnail_url: '/images/creators/samples/j-perry-disney-story.jpg',
    duration_seconds: 120,
    demo_video: true
  }
];