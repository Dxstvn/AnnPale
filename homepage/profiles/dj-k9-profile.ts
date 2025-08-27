export const djK9Profile = {
  id: 'dj-k9-demo',
  name: 'DJ K9',
  full_name: 'DJ K9',
  email: 'djk9@annpale-demo.com',
  category: 'DJ',
  price: 60,
  currency: 'USD',
  bio: "DJ K9 is a dynamic Haitian DJ who brings the authentic sounds of Haiti to dance floors across Miami, New York, and beyond. With over 66K followers on social media, he's become a prominent figure in the Haitian diaspora nightlife scene. DJ K9 specializes in kompa, raboday, and zouk music, seamlessly blending traditional Haitian rhythms with contemporary Caribbean and urban beats. Based primarily in Miami's vibrant Little Haiti community, he regularly performs at major cultural events, including appearances at the prestigious BAYO celebration at Barclays Center. His tri-city presence between Miami, Haiti, and New York allows him to stay connected to both his roots and the evolving sound of modern Haitian music, making him a bridge between generations of music lovers.",
  location: 'Miami, FL / New York, NY / Haiti',
  languages: ['Haitian Creole', 'English', 'French'],
  avatar_url: '/images/creators/profiles/djs/dj-k9-profile.jpg',
  cover_url: '/images/creators/covers/djs/dj-k9-cover.jpg',
  social_media: {
    instagram: '@djk9_',
    facebook: 'DJ K9',
    followers: 66000
  },
  available: true,
  response_time_hours: 48,
  total_reviews: 127,
  rating: 4.8,
  total_videos: 340,
  demo_account: true,
  is_featured: true,
  tags: ['kompa', 'raboday', 'zouk', 'caribbean', 'haitian-culture', 'nightlife', 'miami', 'events'],
  pricing_tiers: {
    personal: { price: 60, description: "Personal video message" },
    business: { price: 120, description: "Corporate event announcement" },
    special: { price: 150, description: "Event DJ set preview" }
  }
};

export const djK9Auth = {
  email: 'djk9@annpale-demo.com',
  password: 'DemoPass2025!',
  role: 'creator' as const,
  profile_id: 'dj-k9-demo',
  demo_account: true
};

export const djK9Reviews = [
  {
    id: 'review-djk9-1',
    creator_id: 'dj-k9-demo',
    reviewer_name: 'Marie C.',
    rating: 5,
    comment: "DJ K9 made my son's graduation party unforgettable! His energy was incredible and he perfectly captured the Haitian spirit we wanted. Highly recommend! 🇭🇹",
    date: '2024-08-15',
    demo_review: true
  },
  {
    id: 'review-djk9-2',
    creator_id: 'dj-k9-demo',
    reviewer_name: 'Pierre J.',
    rating: 5,
    comment: "As a fellow Haitian living in NYC, I can say DJ K9 really understands our culture. His video message for my wife's birthday was perfect - authentic kompa vibes!",
    date: '2024-08-10',
    demo_review: true
  },
  {
    id: 'review-djk9-3',
    creator_id: 'dj-k9-demo',
    reviewer_name: 'Sophia M.',
    rating: 4,
    comment: "Great energy and professionalism. DJ K9 delivered exactly what we asked for our Miami event announcement. The crowd loved it!",
    date: '2024-08-05',
    demo_review: true
  }
];

export const djK9SampleVideos = [
  {
    id: 'sample-djk9-1',
    creator_id: 'dj-k9-demo',
    title: 'Birthday Celebration Mix',
    description: 'High-energy kompa and zouk mix perfect for birthday celebrations',
    thumbnail_url: '/images/creators/samples/dj-k9-birthday-mix.jpg',
    duration_seconds: 45,
    demo_video: true
  },
  {
    id: 'sample-djk9-2',
    creator_id: 'dj-k9-demo',
    title: 'Cultural Event Announcement',
    description: 'Professional announcement for Haitian cultural events',
    thumbnail_url: '/images/creators/samples/dj-k9-event-announce.jpg',
    duration_seconds: 30,
    demo_video: true
  },
  {
    id: 'sample-djk9-3',
    creator_id: 'dj-k9-demo',
    title: 'Personal Greeting',
    description: 'Warm personal greeting with traditional Haitian music backdrop',
    thumbnail_url: '/images/creators/samples/dj-k9-personal-greeting.jpg',
    duration_seconds: 35,
    demo_video: true
  }
];