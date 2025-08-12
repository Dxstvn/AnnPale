"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

const creatorsData = {
  "1": {
    id: 1,
    name: "Wyclef Jean",
    category: "Musician",
    price: 150,
    image: "/images/wyclef-jean.png",
    responseTime: "24hr",
  },
  "2": {
    id: 2,
    name: "Ti Jo Zenny",
    category: "Comedian",
    price: 85,
    image: "/images/ti-jo-zenny.jpg",
    responseTime: "2 days",
  },
  "4": {
    id: 4,
    name: "Richard Cave",
    category: "Actor",
    price: 120,
    image: "/images/richard-cave.jpg",
    responseTime: "3 days",
  },
  "5": {
    id: 5,
    name: "Michael Brun",
    category: "DJ/Producer",
    price: 200,
    image: "/images/michael-brun.jpg",
    responseTime: "2 days",
  },
  "6": {
    id: 6,
    name: "Rutshelle Guillaume",
    category: "Singer",
    price: 85,
    image: "/images/rutshelle-guillaume.jpg",
    responseTime: "1 day",
  },
  "7": {
    id: 7,
    name: "Kenny",
    category: "Singer",
    price: 95,
    image: "/images/kenny.jpg",
    responseTime: "2 days",
  },
  "8": {
    id: 8,
    name: "Carel Pedre",
    category: "Radio Host",
    price: 110,
    image: "/images/carel-pedre.jpg",
    responseTime: "1 day",
  },
  "9": {
    id: 9,
    name: "DJ K9",
    category: "DJ",
    price: 65,
    image: "/images/dj-k9.jpg",
    responseTime: "24hr",
  },
  "10": {
    id: 10,
    name: "DJ Bullet",
    category: "DJ",
    price: 70,
    image: "/images/dj-bullet.jpg",
    responseTime: "1 day",
  },
  "11": {
    id: 11,
    name: "J Perry",
    category: "Singer",
    price: 90,
    image: "/images/jonathan-perry.jpg",
    responseTime: "2 days",
  },
  "13": {
    id: 13,
    name: "Reynaldo Martino",
    category: "Singer",
    price: 105,
    image: "/images/reynaldo-martino.jpg",
    responseTime: "2 days",
  },
}

export default function BookingConfirmationPage() {
  const params = useParams()
  const creatorId = params.id as string
  const creator = creatorsData[creatorId as keyof typeof creatorsData]

  if (!creator) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
          <Button asChild>
            <Link href="/browse">Browse Creators</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>🎤</span>
              <span>Ann Pale</span>
            </Link>
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
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600">Your video request has been sent to {creator.name}</p>
          </div>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={creator.image || "/placeholder.svg"}
                  alt={creator.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{creator.name}</h3>
                  <p className="text-gray-600">{creator.category}</p>
                  <p className="text-sm text-gray-500">Booking #ANN-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount paid:</span>
                  <span className="font-semibold">${creator.price + 5}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected delivery:</span>
                  <span className="font-semibold">Within {creator.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-yellow-600 font-semibold">Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Request sent</h4>
                    <p className="text-gray-600 text-sm">{creator.name} has been notified about your video request</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Video creation</h4>
                    <p className="text-gray-600 text-sm">{creator.name} will record your personalized video message</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Delivery</h4>
                    <p className="text-gray-600 text-sm">
                      You'll receive an email when your video is ready to download
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button size="lg" asChild>
              <Link href="/browse">Book Another Video</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Need help?</h3>
            <p className="text-blue-800 text-sm">
              If you have any questions about your booking, please contact our support team at{" "}
              <a href="mailto:support@annpale.com" className="underline">
                support@annpale.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
