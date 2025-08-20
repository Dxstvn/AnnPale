import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center">
            <FileQuestion className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go to homepage
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="text-purple-600 hover:text-purple-700 flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Browse creators
            </Link>
            <Link href="/help" className="text-purple-600 hover:text-purple-700">
              Get help
            </Link>
          </div>
        </div>

        {/* Cultural touch */}
        <div className="mt-12 text-4xl">
          🇭🇹 🎤 🎵
        </div>
      </div>
    </div>
  )
}