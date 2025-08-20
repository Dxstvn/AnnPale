"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layouts/header"

const blogPosts = [
  {
    title: "How Haitian Creators Are Building Global Communities Through Video",
    excerpt:
      "Discover how creators like Wyclef Jean and Ti Jo Zenny are using personalized videos to connect with fans worldwide and build sustainable income streams.",
    author: "Marie-Claire Joseph",
    date: "March 22, 2024",
    category: "Creator Stories",
    readTime: "5 min read",
    image: "/placeholder.svg?height=200&width=400&text=Creator+Communities",
    featured: true,
  },
  {
    title: "The Rise of the Creator Economy in the Caribbean",
    excerpt:
      "An in-depth look at how digital platforms are transforming opportunities for Caribbean creators and connecting diaspora communities.",
    author: "Marcus Delva",
    date: "March 18, 2024",
    category: "Industry Insights",
    readTime: "8 min read",
    image: "/placeholder.svg?height=200&width=400&text=Caribbean+Economy",
  },
  {
    title: "5 Tips for Creating Engaging Personalized Videos",
    excerpt:
      "Learn from our top-performing creators about what makes a great personalized video that fans love and share.",
    author: "Sophia Laurent",
    date: "March 15, 2024",
    category: "Creator Tips",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=400&text=Video+Tips",
  },
  {
    title: "Celebrating Haitian Heritage Month with Ann Pale",
    excerpt:
      "How we partnered with cultural organizations to create special content celebrating Haitian culture and history.",
    author: "Jean-Baptiste Pierre",
    date: "March 10, 2024",
    category: "Company News",
    readTime: "4 min read",
    image: "/placeholder.svg?height=200&width=400&text=Heritage+Month",
  },
  {
    title: "Building Authentic Connections in the Digital Age",
    excerpt:
      "Why personalized video messages are more powerful than traditional social media for creator-fan relationships.",
    author: "Marie-Claire Joseph",
    date: "March 5, 2024",
    category: "Industry Insights",
    readTime: "7 min read",
    image: "/placeholder.svg?height=200&width=400&text=Digital+Connections",
  },
  {
    title: "From Local to Global: How Ann Pale Creators Expand Their Reach",
    excerpt: "Success stories of creators who've grown their international fanbase through our platform.",
    author: "Sophia Laurent",
    date: "February 28, 2024",
    category: "Creator Stories",
    readTime: "6 min read",
    image: "/placeholder.svg?height=200&width=400&text=Global+Reach",
  },
]

const categories = [
  { name: "All Posts", count: 24 },
  { name: "Creator Stories", count: 8 },
  { name: "Industry Insights", count: 6 },
  { name: "Creator Tips", count: 5 },
  { name: "Company News", count: 3 },
  { name: "Platform Updates", count: 2 },
]

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Ann Pale Blog</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Stories, insights, and tips from the world of Haitian creators. Discover how we're building the future of
            the creator economy.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-3">
              <Search className="h-5 w-5" />
              <Input
                placeholder="Search articles..."
                className="border-0 bg-transparent placeholder:text-white/70 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <Badge className="mb-4 bg-purple-600">Featured</Badge>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <Image
                        src={featuredPost.image || "/placeholder.svg"}
                        alt={featuredPost.title}
                        width={400}
                        height={200}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-6">
                      <Badge variant="secondary" className="mb-3">
                        {featuredPost.category}
                      </Badge>
                      <CardTitle className="text-2xl mb-3">{featuredPost.title}</CardTitle>
                      <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{featuredPost.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{featuredPost.date}</span>
                          </div>
                        </div>
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <Button>
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Regular Posts */}
            <div className="grid md:grid-cols-2 gap-8">
              {regularPosts.map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg mb-3 line-clamp-2">{post.title}</CardTitle>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Posts
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded cursor-pointer"
                    >
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest creator stories and platform updates delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Your email address" />
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post, index) => (
                    <div key={index} className="flex space-x-3">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2 mb-1">{post.title}</h4>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
