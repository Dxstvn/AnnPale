"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Flag,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  MoreVertical,
  Reply,
  Heart,
  Share2,
  Bookmark,
  BarChart3,
  Users,
  Sparkles
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Translations
const reviewTranslations: Record<string, Record<string, string>> = {
  review_management: {
    en: "Review Management",
    fr: "Gestion des avis",
    ht: "Jesyon evalyasyon"
  },
  manage_feedback: {
    en: "Manage and respond to customer feedback",
    fr: "Gérez et répondez aux commentaires des clients",
    ht: "Jere ak reponn kòmantè kliyan yo"
  },
  average_rating: {
    en: "Average Rating",
    fr: "Note moyenne",
    ht: "Nòt mwayèn"
  },
  total_reviews: {
    en: "Total Reviews",
    fr: "Total des avis",
    ht: "Total evalyasyon"
  },
  response_rate: {
    en: "Response Rate",
    fr: "Taux de réponse",
    ht: "To repons"
  },
  satisfaction_score: {
    en: "Satisfaction Score",
    fr: "Score de satisfaction",
    ht: "Nòt satisfaksyon"
  },
  all_reviews: {
    en: "All Reviews",
    fr: "Tous les avis",
    ht: "Tout evalyasyon"
  },
  pending_response: {
    en: "Pending Response",
    fr: "En attente de réponse",
    ht: "K ap tann repons"
  },
  flagged: {
    en: "Flagged",
    fr: "Signalés",
    ht: "Siyale"
  },
  respond: {
    en: "Respond",
    fr: "Répondre",
    ht: "Reponn"
  },
  write_response: {
    en: "Write a response...",
    fr: "Écrire une réponse...",
    ht: "Ekri yon repons..."
  },
  mark_helpful: {
    en: "Mark as Helpful",
    fr: "Marquer comme utile",
    ht: "Make kòm itil"
  },
  report_review: {
    en: "Report Review",
    fr: "Signaler l'avis",
    ht: "Siyale evalyasyon"
  },
  filter_by_rating: {
    en: "Filter by Rating",
    fr: "Filtrer par note",
    ht: "Filtre pa nòt"
  }
}

// Mock data
const reviewStats = {
  averageRating: 4.8,
  totalReviews: 324,
  responseRate: 92,
  satisfactionScore: 96,
  ratingDistribution: [
    { stars: 5, count: 245, percentage: 75 },
    { stars: 4, count: 56, percentage: 17 },
    { stars: 3, count: 15, percentage: 5 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 3, percentage: 1 }
  ],
  recentTrend: {
    direction: "up",
    change: 0.3
  }
}

const reviews = [
  {
    id: "1",
    user: {
      name: "Sarah Mitchell",
      avatar: "/api/placeholder/40/40",
      location: "New York, NY"
    },
    rating: 5,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    occasion: "Birthday",
    message: "Amazing! My mom was in tears of joy. The message was heartfelt and personal. Worth every penny!",
    helpful: 23,
    response: null,
    verified: true,
    featured: true
  },
  {
    id: "2",
    user: {
      name: "Michael Rodriguez",
      avatar: "/api/placeholder/40/40",
      location: "Miami, FL"
    },
    rating: 5,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    occasion: "Anniversary",
    message: "Perfect anniversary surprise! The video quality was excellent and the message was genuine. My wife loved it!",
    helpful: 18,
    response: "Thank you so much for trusting me with your special moment! I'm so happy your wife enjoyed the message. Wishing you many more happy anniversaries! 💕",
    verified: true,
    featured: false
  },
  {
    id: "3",
    user: {
      name: "Lisa Kim",
      avatar: "/api/placeholder/40/40",
      location: "Boston, MA"
    },
    rating: 4,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    occasion: "Graduation",
    message: "Great message for my daughter's graduation! The only reason for 4 stars is it took a bit longer than expected, but the quality made up for it.",
    helpful: 12,
    response: null,
    verified: true,
    featured: false
  },
  {
    id: "4",
    user: {
      name: "John Davis",
      avatar: "/api/placeholder/40/40",
      location: "Montreal, QC"
    },
    rating: 5,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    occasion: "Wedding",
    message: "Mèsi anpil! The message in Creole was perfect. My parents were so surprised and happy. You made their day special!",
    helpful: 31,
    response: "Mèsi pou konfyans ou! It was my pleasure to create this special message for your parents' wedding anniversary. Bon bagay pou yo! 🎉",
    verified: true,
    featured: true
  },
  {
    id: "5",
    user: {
      name: "Emma Thompson",
      avatar: "/api/placeholder/40/40",
      location: "Port-au-Prince, Haiti"
    },
    rating: 3,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    occasion: "Holiday",
    message: "The message was good but felt a bit generic. I was hoping for something more personalized based on the details I provided.",
    helpful: 5,
    response: null,
    verified: false,
    featured: false,
    flagged: true
  }
]

export default function ReviewsPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<typeof reviews[0] | null>(null)
  const [responseText, setResponseText] = useState("")
  
  const t = (key: string) => {
    return reviewTranslations[key]?.[language] || reviewTranslations[key]?.en || key
  }
  
  const renderStars = (rating: number, size: string = "h-4 w-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size,
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    )
  }
  
  const handleResponse = (review: typeof reviews[0]) => {
    setSelectedReview(review)
    setIsResponseDialogOpen(true)
  }
  
  const submitResponse = () => {
    console.log("Submitting response:", responseText)
    setIsResponseDialogOpen(false)
    setResponseText("")
  }
  
  const filteredReviews = reviews.filter(review => {
    if (activeTab === "pending" && review.response !== null) return false
    if (activeTab === "flagged" && !review.flagged) return false
    if (filterRating !== "all" && review.rating !== Number(filterRating)) return false
    return true
  })
  
  const pendingResponseCount = reviews.filter(r => !r.response).length
  const flaggedCount = reviews.filter(r => r.flagged).length
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('review_management')}</h1>
            <p className="text-gray-600 mt-1">{t('manage_feedback')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('filter_by_rating')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('average_rating')}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-3xl font-bold text-gray-900">{reviewStats.averageRating}</p>
                <div className="flex items-center">
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{reviewStats.recentTrend.change}</span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('total_reviews')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reviewStats.totalReviews}</p>
              <p className="text-xs text-gray-500 mt-1">
                {pendingResponseCount} pending response
              </p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('response_rate')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reviewStats.responseRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Above average</p>
            </div>
            <Reply className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('satisfaction_score')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{reviewStats.satisfactionScore}%</p>
              <p className="text-xs text-gray-500 mt-1">Excellent</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>
      
      {/* Rating Distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of all reviews by star rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reviewStats.ratingDistribution.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium">{rating.stars}</span>
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex-1">
                  <Progress value={rating.percentage} className="h-2" />
                </div>
                <div className="text-sm text-gray-600 w-20 text-right">
                  {rating.count} ({rating.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Reviews Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            {t('all_reviews')}
            <Badge className="ml-2" variant="secondary">
              {reviews.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('pending_response')}
            {pendingResponseCount > 0 && (
              <Badge className="ml-2" variant="destructive">
                {pendingResponseCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="flagged">
            {t('flagged')}
            {flaggedCount > 0 && (
              <Badge className="ml-2" variant="destructive">
                {flaggedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className={cn(
              "transition-all",
              review.flagged && "border-orange-200 bg-orange-50/50"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.user.name}</p>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {review.featured && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {review.flagged && (
                          <Badge variant="destructive" className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{review.occasion}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {format(review.date, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-4">{review.message}</p>
                
                {review.response && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Reply className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Your Response</p>
                        <p className="text-sm text-gray-700">{review.response}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful ({review.helpful})
                    </Button>
                    {!review.response && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResponse(review)}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        {t('respond')}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      
      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Write a thoughtful response to {selectedReview?.user.name}'s review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedReview && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium text-sm">{selectedReview.user.name}</p>
                  {renderStars(selectedReview.rating, "h-3 w-3")}
                </div>
                <p className="text-sm text-gray-600">{selectedReview.message}</p>
              </div>
            )}
            <Textarea
              placeholder={t('write_response')}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={4}
            />
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your response will be public. Keep it professional, helpful, and authentic.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitResponse} disabled={!responseText.trim()}>
              Post Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}