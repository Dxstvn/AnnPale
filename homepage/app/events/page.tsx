"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Video,
  Ticket,
  Star,
  TrendingUp,
  Search,
  Filter,
  Globe,
  Music,
  Mic,
  Book,
  Heart,
  Gift,
  Sparkles,
  Crown,
  Plus,
  ChevronRight,
  Calendar as CalendarIcon,
  Bell,
  Share2,
  DollarSign
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Translations
const eventsTranslations: Record<string, Record<string, string>> = {
  events_directory: {
    en: "Events Directory",
    fr: "Répertoire des événements",
    ht: "Lis evènman"
  },
  discover_events: {
    en: "Discover and join amazing events from Haitian creators",
    fr: "Découvrez et rejoignez des événements incroyables de créateurs haïtiens",
    ht: "Dekouvri ak patisipe nan evènman etonan kreyatè ayisyen"
  },
  upcoming: {
    en: "Upcoming",
    fr: "À venir",
    ht: "K ap vini"
  },
  past: {
    en: "Past",
    fr: "Passés",
    ht: "Pase"
  },
  featured: {
    en: "Featured",
    fr: "En vedette",
    ht: "An vedèt"
  },
  all_events: {
    en: "All Events",
    fr: "Tous les événements",
    ht: "Tout evènman"
  },
  virtual: {
    en: "Virtual",
    fr: "Virtuel",
    ht: "Vityèl"
  },
  in_person: {
    en: "In Person",
    fr: "En personne",
    ht: "An pèsòn"
  },
  free: {
    en: "Free",
    fr: "Gratuit",
    ht: "Gratis"
  },
  paid: {
    en: "Paid",
    fr: "Payant",
    ht: "Peye"
  },
  register: {
    en: "Register",
    fr: "S'inscrire",
    ht: "Enskri"
  },
  sold_out: {
    en: "Sold Out",
    fr: "Complet",
    ht: "Fini"
  },
  create_event: {
    en: "Create Event",
    fr: "Créer un événement",
    ht: "Kreye evènman"
  },
  attendees: {
    en: "attendees",
    fr: "participants",
    ht: "patisipan"
  }
}

// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Live Kompa Concert: Summer Vibes",
    description: "Join us for an unforgettable night of Kompa music with special guests",
    creator: {
      name: "Jean Baptiste",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    type: "virtual",
    category: "music",
    date: new Date("2024-02-15T20:00:00"),
    duration: "2 hours",
    price: 25,
    currency: "USD",
    attendees: 245,
    maxAttendees: 500,
    thumbnail: "/api/placeholder/400/225",
    tags: ["music", "kompa", "concert", "live"],
    featured: true,
    status: "upcoming"
  },
  {
    id: "2",
    title: "Haitian Cooking Masterclass",
    description: "Learn to cook authentic Haitian dishes with Chef Marie",
    creator: {
      name: "Marie Pierre",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    type: "virtual",
    category: "cooking",
    date: new Date("2024-02-20T18:00:00"),
    duration: "90 minutes",
    price: 0,
    currency: "USD",
    attendees: 89,
    maxAttendees: 150,
    thumbnail: "/api/placeholder/400/225",
    tags: ["cooking", "masterclass", "haitian cuisine"],
    featured: false,
    status: "upcoming"
  },
  {
    id: "3",
    title: "Haitian Literature Discussion",
    description: "Monthly book club discussing contemporary Haitian authors",
    creator: {
      name: "Paul Lafontant",
      avatar: "/api/placeholder/40/40",
      verified: false
    },
    type: "virtual",
    category: "education",
    date: new Date("2024-02-25T19:00:00"),
    duration: "1 hour",
    price: 0,
    currency: "USD",
    attendees: 32,
    maxAttendees: 50,
    thumbnail: "/api/placeholder/400/225",
    tags: ["literature", "book club", "discussion"],
    featured: false,
    status: "upcoming"
  },
  {
    id: "4",
    title: "Carnival Dance Workshop",
    description: "Learn traditional Haitian carnival dances",
    creator: {
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    type: "in-person",
    category: "dance",
    location: "Miami, FL",
    date: new Date("2024-03-01T14:00:00"),
    duration: "3 hours",
    price: 45,
    currency: "USD",
    attendees: 78,
    maxAttendees: 100,
    thumbnail: "/api/placeholder/400/225",
    tags: ["dance", "carnival", "workshop"],
    featured: true,
    status: "upcoming"
  },
  {
    id: "5",
    title: "Haitian Art Exhibition Opening",
    description: "Celebrating contemporary Haitian artists",
    creator: {
      name: "Gallery Ann Pale",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    type: "in-person",
    category: "art",
    location: "New York, NY",
    date: new Date("2024-01-10T18:00:00"),
    duration: "4 hours",
    price: 0,
    currency: "USD",
    attendees: 156,
    maxAttendees: 200,
    thumbnail: "/api/placeholder/400/225",
    tags: ["art", "exhibition", "gallery"],
    featured: false,
    status: "past"
  }
]

const eventCategories = [
  { value: "all", label: "All Categories", icon: Globe },
  { value: "music", label: "Music & Concerts", icon: Music },
  { value: "cooking", label: "Cooking Classes", icon: Gift },
  { value: "education", label: "Education & Talks", icon: Book },
  { value: "dance", label: "Dance & Performance", icon: Heart },
  { value: "art", label: "Art & Culture", icon: Sparkles }
]

export default function EventsPage() {
  const { language } = useLanguage()
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const t = (key: string) => {
    return eventsTranslations[key]?.[language] || eventsTranslations[key]?.en || key
  }

  const filteredEvents = mockEvents.filter(event => {
    if (selectedTab === "featured" && !event.featured) return false
    if (selectedTab === "upcoming" && event.status !== "upcoming") return false
    if (selectedTab === "past" && event.status !== "past") return false
    if (selectedCategory !== "all" && event.category !== selectedCategory) return false
    if (selectedType === "virtual" && event.type !== "virtual") return false
    if (selectedType === "in-person" && event.type !== "in-person") return false
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getCategoryIcon = (category: string) => {
    const cat = eventCategories.find(c => c.value === category)
    return cat ? <cat.icon className="w-4 h-4" /> : null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t('events_directory')}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          {t('discover_events')}
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            {t('create_event')}
          </Button>
          <Button variant="outline">
            <CalendarIcon className="w-4 h-4 mr-2" />
            My Events
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="virtual">{t('virtual')}</SelectItem>
                <SelectItem value="in-person">{t('in_person')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Events Grid */}
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">{t('all_events')}</TabsTrigger>
              <TabsTrigger value="featured">{t('featured')}</TabsTrigger>
              <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
              <TabsTrigger value="past">{t('past')}</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.featured && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {event.type === "virtual" ? (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          <Video className="w-3 h-3 mr-1" />
                          {t('virtual')}
                        </Badge>
                      ) : (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mt-1">{event.description}</p>
                        </div>
                        {getCategoryIcon(event.category)}
                      </div>

                      <div className="flex items-center gap-2 mt-3 mb-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={event.creator.avatar} />
                          <AvatarFallback>{event.creator.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{event.creator.name}</span>
                        {event.creator.verified && (
                          <Badge variant="secondary" className="h-5">
                            <Crown className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {format(event.date, "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(event.date, "h:mm a")}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendees}/{event.maxAttendees} {t('attendees')}
                          </div>
                          {event.price === 0 ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {t('free')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              ${event.price}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {event.attendees >= event.maxAttendees ? (
                          <Button className="flex-1" disabled>
                            {t('sold_out')}
                          </Button>
                        ) : (
                          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                            {t('register')}
                          </Button>
                        )}
                        <Button variant="outline" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Trending Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Trending Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvents.filter(e => e.featured).slice(0, 3).map((event, index) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="text-2xl font-bold text-gray-400">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{event.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {event.attendees} {t('attendees')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Events</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">This Week</span>
                  <span className="font-bold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Attendees</span>
                  <span className="font-bold">8.4K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Revenue</span>
                  <span className="font-bold">$45.6K</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}