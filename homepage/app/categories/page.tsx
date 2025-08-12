import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const categories = [
  {
    name: "Musicians",
    count: 156,
    icon: "🎵",
    description: "Kompa, Rara, Hip-Hop artists and more",
    featured: ["Wyclef Jean", "Michael Brun", "J Perry"],
  },
  {
    name: "Singers",
    count: 89,
    icon: "🎤",
    description: "Vocal artists across all genres",
    featured: ["Rutshelle Guillaume", "Kenny", "Roberto Martino"],
  },
  {
    name: "Comedians",
    count: 67,
    icon: "😂",
    description: "Stand-up comedians and entertainers",
    featured: ["Ti Jo Zenny", "Aino Zenny"],
  },
  {
    name: "Actors",
    count: 34,
    icon: "🎭",
    description: "Film and television actors",
    featured: ["Richard Cave"],
  },
  {
    name: "DJs",
    count: 45,
    icon: "🎧",
    description: "DJs and music producers",
    featured: ["DJ K9", "DJ Bullet"],
  },
  {
    name: "Radio Hosts",
    count: 23,
    icon: "📻",
    description: "Radio personalities and broadcasters",
    featured: ["Carel Pedre"],
  },
  {
    name: "Athletes",
    count: 78,
    icon: "⚽",
    description: "Professional athletes and sports figures",
    featured: [],
  },
  {
    name: "Influencers",
    count: 234,
    icon: "📱",
    description: "Social media personalities and content creators",
    featured: [],
  },
]

export default function CategoriesPage() {
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
                <Link href="/categories" className="text-purple-600 font-medium">
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
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover Haitian creators across different categories and find the perfect person for your video message
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={`/browse?category=${category.name.toLowerCase()}`}>
              <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-purple-600 font-medium mb-3">{category.count} creators</p>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>

                  {category.featured.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Featured creators:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.featured.map((creator, index) => (
                          <span key={creator} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {creator}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-purple-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">Browse all creators or search for someone specific</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/browse">Browse All Creators</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/browse">Search Creators</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
