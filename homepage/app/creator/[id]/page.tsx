"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Clock, MessageCircle, Play, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

const creatorsData = {
  "1": {
    id: 1,
    name: "Wyclef Jean",
    category: "Musician",
    price: 150,
    rating: 4.9,
    reviews: 1247,
    image: "/images/wyclef-jean.png",
    responseTime: "24hr",
    verified: true,
    bio: "Grammy-winning musician, producer, and humanitarian. Former member of the Fugees and solo artist with hits like 'Hips Don't Lie' and 'Gone Till November'. Proud Haitian-American artist.",
    completedVideos: 1247,
    languages: ["English", "Haitian Creole", "French"],
    specialties: ["Birthday wishes", "Congratulations", "Motivational messages", "Music dedications"],
    sampleVideos: [
      { id: 1, title: "Birthday Message", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Congratulations", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Marie L.",
        rating: 5,
        comment: "Wyclef made my daughter's birthday so special! He sang happy birthday in Creole and it was perfect!",
        date: "2 days ago",
      },
      {
        id: 2,
        user: "Jean P.",
        rating: 5,
        comment: "Amazing video for my graduation! Very personal and heartfelt. Worth every penny!",
        date: "1 week ago",
      },
    ],
  },
  "2": {
    id: 2,
    name: "Ti Jo Zenny",
    category: "Comedian",
    price: 85,
    rating: 4.8,
    reviews: 456,
    image: "/images/ti-jo-zenny.jpg",
    responseTime: "2 days",
    verified: true,
    bio: "Beloved Haitian comedian known for his hilarious sketches and social commentary. Ti Jo brings laughter and joy to every performance with his unique style and wit.",
    completedVideos: 456,
    languages: ["Haitian Creole", "French", "English"],
    specialties: ["Comedy messages", "Birthday roasts", "Motivational humor", "Cultural jokes"],
    sampleVideos: [
      { id: 1, title: "Birthday Roast", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Motivational Comedy", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Pierre M.",
        rating: 5,
        comment: "Ti Jo made my friend's birthday unforgettable! So funny and personal!",
        date: "1 week ago",
      },
    ],
  },
  "4": {
    id: 4,
    name: "Richard Cave",
    category: "Actor",
    price: 120,
    rating: 4.9,
    reviews: 678,
    image: "/images/richard-cave.jpg",
    responseTime: "3 days",
    verified: true,
    bio: "Acclaimed Haitian actor known for his powerful performances in film and television. Richard brings depth and authenticity to every role and message.",
    completedVideos: 678,
    languages: ["English", "Haitian Creole", "French"],
    specialties: ["Dramatic messages", "Congratulations", "Inspirational speeches", "Character voices"],
    sampleVideos: [
      { id: 1, title: "Graduation Speech", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Motivational Message", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Sarah D.",
        rating: 5,
        comment: "Richard's message was so powerful and moving. Exactly what we needed!",
        date: "3 days ago",
      },
    ],
  },
  "5": {
    id: 5,
    name: "Michael Brun",
    category: "DJ/Producer",
    price: 200,
    rating: 4.8,
    reviews: 892,
    image: "/images/michael-brun.jpg",
    responseTime: "2 days",
    verified: true,
    bio: "World-renowned Haitian DJ and producer who has performed at major festivals worldwide. Michael blends electronic music with Haitian culture, creating unique experiences.",
    completedVideos: 892,
    languages: ["English", "Haitian Creole", "French"],
    specialties: ["Party messages", "Music production tips", "Cultural pride", "Festival shout-outs"],
    sampleVideos: [
      { id: 1, title: "Festival Greeting", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Music Motivation", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "David K.",
        rating: 5,
        comment: "Michael's energy is infectious! Perfect message for our music event!",
        date: "1 day ago",
      },
    ],
  },
  "6": {
    id: 6,
    name: "Rutshelle Guillaume",
    category: "Singer",
    price: 85,
    rating: 4.9,
    reviews: 634,
    image: "/images/rutshelle-guillaume.jpg",
    responseTime: "1 day",
    verified: true,
    bio: "Rising star in Haitian music with a powerful voice and captivating stage presence. Rutshelle brings passion and soul to every performance and message.",
    completedVideos: 634,
    languages: ["Haitian Creole", "French", "English"],
    specialties: ["Song dedications", "Birthday serenades", "Love messages", "Inspirational songs"],
    sampleVideos: [
      { id: 1, title: "Birthday Serenade", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Love Song Dedication", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Michel R.",
        rating: 5,
        comment: "Rutshelle's voice is angelic! The perfect birthday surprise for my wife!",
        date: "2 days ago",
      },
    ],
  },
  "7": {
    id: 7,
    name: "Kenny",
    category: "Singer",
    price: 95,
    rating: 4.6,
    reviews: 423,
    image: "/images/kenny.jpg",
    responseTime: "2 days",
    verified: true,
    bio: "Soulful Haitian singer with a smooth voice and contemporary R&B style. Kenny creates heartfelt musical moments that touch the soul.",
    completedVideos: 423,
    languages: ["English", "Haitian Creole", "French"],
    specialties: ["R&B serenades", "Love songs", "Birthday ballads", "Smooth dedications"],
    sampleVideos: [
      { id: 1, title: "R&B Love Song", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Birthday Ballad", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Lisa M.",
        rating: 5,
        comment: "Kenny's voice is so smooth and romantic! Perfect anniversary gift!",
        date: "2 days ago",
      },
    ],
  },
  "8": {
    id: 8,
    name: "Carel Pedre",
    category: "Radio Host",
    price: 110,
    rating: 4.8,
    reviews: 567,
    image: "/images/carel-pedre.jpg",
    responseTime: "1 day",
    verified: true,
    bio: "Popular Haitian radio personality and media mogul. Known for his engaging voice and connection with the Haitian community worldwide.",
    completedVideos: 567,
    languages: ["Haitian Creole", "French", "English"],
    specialties: ["News-style messages", "Announcements", "Shout-outs", "Community messages"],
    sampleVideos: [
      { id: 1, title: "Special Announcement", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Community Shout-out", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Nadine L.",
        rating: 5,
        comment: "Carel's message was so professional and heartfelt. Perfect for our event!",
        date: "1 day ago",
      },
    ],
  },
  "9": {
    id: 9,
    name: "DJ K9",
    category: "DJ",
    price: 65,
    rating: 4.7,
    reviews: 234,
    image: "/images/dj-k9.jpg",
    responseTime: "24hr",
    verified: true,
    bio: "Energetic DJ known for mixing the hottest Haitian and international tracks. DJ K9 brings the party energy to every message and interaction.",
    completedVideos: 234,
    languages: ["Haitian Creole", "English"],
    specialties: ["Party messages", "DJ drops", "Hype messages", "Music recommendations"],
    sampleVideos: [
      { id: 1, title: "Party Hype Message", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Custom DJ Drop", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Alex T.",
        rating: 5,
        comment: "DJ K9 brought so much energy! Perfect for our party announcement!",
        date: "1 day ago",
      },
    ],
  },
  "10": {
    id: 10,
    name: "DJ Bullet",
    category: "DJ",
    price: 70,
    rating: 4.6,
    reviews: 189,
    image: "/images/dj-bullet.jpg",
    responseTime: "1 day",
    verified: true,
    bio: "Dynamic Haitian DJ with signature braids and high-energy performances. DJ Bullet brings the heat to every track and every message.",
    completedVideos: 189,
    languages: ["Haitian Creole", "English"],
    specialties: ["Club messages", "Hype videos", "Party announcements", "Music shout-outs"],
    sampleVideos: [
      { id: 1, title: "Club Hype", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Party Announcement", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Marcus J.",
        rating: 5,
        comment: "DJ Bullet's energy is unmatched! Got everyone hyped for the event!",
        date: "2 days ago",
      },
    ],
  },
  "11": {
    id: 11,
    name: "J Perry",
    category: "Singer",
    price: 90,
    rating: 4.8,
    reviews: 345,
    image: "/images/jonathan-perry.jpg",
    responseTime: "2 days",
    verified: true,
    bio: "Talented Haitian singer-songwriter with a smooth voice and contemporary style. J Perry creates memorable musical moments for every occasion.",
    completedVideos: 345,
    languages: ["English", "Haitian Creole"],
    specialties: ["R&B messages", "Love songs", "Birthday songs", "Congratulations"],
    sampleVideos: [
      { id: 1, title: "Love Song Message", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Birthday Song", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Jessica M.",
        rating: 5,
        comment: "J Perry's voice is incredible! Made our anniversary so special!",
        date: "3 days ago",
      },
    ],
  },
  "13": {
    id: 13,
    name: "Reynaldo Martino",
    category: "Singer",
    price: 105,
    rating: 4.8,
    reviews: 312,
    image: "/images/reynaldo-martino.jpg",
    responseTime: "2 days",
    verified: true,
    bio: "Versatile Haitian singer with a passion for both traditional and modern music. Reynaldo brings authenticity and heart to every performance.",
    completedVideos: 312,
    languages: ["Haitian Creole", "French", "English"],
    specialties: ["Traditional songs", "Modern hits", "Cultural messages", "Family dedications"],
    sampleVideos: [
      { id: 1, title: "Traditional Song", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Family Message", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        user: "Marie C.",
        rating: 5,
        comment: "Reynaldo sang a beautiful traditional song for my grandmother. She cried tears of joy!",
        date: "4 days ago",
      },
    ],
  },
}

export default function CreatorProfilePage() {
  const params = useParams()
  const creatorId = params.id as string
  const creator = creatorsData[creatorId as keyof typeof creatorsData]

  if (!creator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Creator not found</h1>
          <Button asChild>
            <Link href="/browse">Browse Creators</Link>
          </Button>
        </div>
      </div>
    )
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

      <div className="container mx-auto px-4 py-8">
        {/* Creator Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="relative">
              <Image
                src={creator.image || "/placeholder.svg"}
                alt={creator.name}
                width={400}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
              />
              {creator.verified && (
                <Badge className="absolute top-4 left-4 bg-blue-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{creator.name}</h1>
              <Button size="icon" variant="ghost">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-xl text-purple-600 mb-4">{creator.category}</p>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{creator.rating}</span>
                <span className="text-gray-500">({creator.reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Responds in {creator.responseTime}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{creator.bio}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{creator.completedVideos.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Videos completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{creator.responseTime}</div>
                  <div className="text-sm text-gray-600">Avg response time</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href={`/book/${creator.id}`}>
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Book Video Message - ${creator.price}
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5 mr-2" />
                Add to Favorites
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="samples">Sample Videos</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="samples" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {creator.sampleVideos.map((video) => (
                <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold">{video.title}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {creator.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{review.user}</span>
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
