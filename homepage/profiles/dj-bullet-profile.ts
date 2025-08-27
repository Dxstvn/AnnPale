export const djBulletProfile = {
  id: 'dj-bullet-demo',
  name: 'DJ Bullet',
  full_name: 'Daniel Deux Verna',
  email: 'djbullet@annpale-demo.com',
  category: 'DJ/Producer',
  price: 85,
  currency: 'USD',
  bio: "DJ Bullet, born Daniel Deux Verna in Port-au-Prince, Haiti, is a multi-talented artist who has made significant waves in both the Haitian and international music scenes. Named 2017's DJ of the Year by Ticket Magazine, he's proven his versatility as a DJ, producer, and rapper under various monikers including Balalalet and Da2. Now based in Miami, DJ Bullet has worked alongside some of the biggest names in music, including Grammy-winners Steve Aoki, Walshy Fire, and Michael Brun, as well as international stars like Ozuna and Davido. His signature sound blends traditional Haitian kompa and raboday with contemporary Afrobeats, Amapiano, and dancehall, creating an infectious energy that packs dance floors from Miami to Port-au-Prince. As a regular headliner at TAP TAP! events during Haitian Flag Day celebrations, DJ Bullet continues to be a cultural ambassador, bringing the vibrant sounds of Haiti to the global stage while staying true to his Caribbean roots.",
  location: 'Miami, FL',
  languages: ['Haitian Creole', 'English', 'French'],
  avatar_url: '/images/creators/profiles/djs/dj-bullet-profile.jpg',
  cover_url: '/images/creators/covers/djs/dj-bullet-cover.jpg',
  social_media: {
    soundcloud: 'Balalatet',
    instagram: '@djbullet',
    followers: 45000
  },
  available: true,
  response_time_hours: 24,
  total_reviews: 89,
  rating: 4.9,
  total_videos: 156,
  demo_account: true,
  is_featured: true,
  tags: ['kompa', 'raboday', 'afrobeats', 'amapiano', 'soca', 'dancehall', 'producer', 'grammy-collaborations'],
  achievements: [
    '2017 DJ of the Year - Ticket Magazine',
    'Collaborations with Steve Aoki, Walshy Fire, Michael Brun',
    'Featured at TAP TAP! Haitian Flag Day events',
    'International collaborations with Ozuna, Davido, Mr. Eazi'
  ],
  pricing_tiers: {
    personal: { price: 85, description: "Personal video message with beats" },
    business: { price: 170, description: "Event promotion with custom mix" },
    special: { price: 250, description: "Custom beat production preview" }
  }
};

export const djBulletAuth = {
  email: 'djbullet@annpale-demo.com',
  password: 'DemoPass2025!',
  role: 'creator' as const,
  profile_id: 'dj-bullet-demo',
  demo_account: true
};

export const djBulletReviews = [
  {
    id: 'review-djbullet-1',
    creator_id: 'dj-bullet-demo',
    reviewer_name: 'Carlos R.',
    rating: 5,
    comment: "DJ Bullet's production skills are insane! He created a custom beat snippet for my proposal and it was absolutely perfect. My fiancée loved it! Worth every penny.",
    date: '2024-08-20',
    demo_review: true
  },
  {
    id: 'review-djbullet-2',
    creator_id: 'dj-bullet-demo',
    reviewer_name: 'Keteline V.',
    rating: 5,
    comment: "Working with a Grammy-collaborating producer was a dream come true. DJ Bullet brought that international flavor to our corporate event video. Professional and creative!",
    date: '2024-08-12',
    demo_review: true
  },
  {
    id: 'review-djbullet-3',
    creator_id: 'dj-bullet-demo',
    reviewer_name: 'Michael T.',
    rating: 4,
    comment: "Great energy and unique sound! DJ Bullet mixed Afrobeats with traditional Haitian rhythms for our event announcement. Very impressed with his versatility.",
    date: '2024-08-08',
    demo_review: true
  }
];

export const djBulletSampleVideos = [
  {
    id: 'sample-djbullet-1',
    creator_id: 'dj-bullet-demo',
    title: 'Custom Beat Creation Process',
    description: 'Behind-the-scenes look at creating a personalized beat with Afrobeats and kompa fusion',
    thumbnail_url: '/images/creators/samples/dj-bullet-beat-creation.jpg',
    duration_seconds: 60,
    demo_video: true
  },
  {
    id: 'sample-djbullet-2',
    creator_id: 'dj-bullet-demo',
    title: 'Event Hype Video',
    description: 'High-energy promotional video with amapiano and raboday mix',
    thumbnail_url: '/images/creators/samples/dj-bullet-event-hype.jpg',
    duration_seconds: 45,
    demo_video: true
  },
  {
    id: 'sample-djbullet-3',
    creator_id: 'dj-bullet-demo',
    title: 'Personal Message with Live Mix',
    description: 'Personalized greeting with live DJ mixing in background',
    thumbnail_url: '/images/creators/samples/dj-bullet-personal-mix.jpg',
    duration_seconds: 50,
    demo_video: true
  }
];