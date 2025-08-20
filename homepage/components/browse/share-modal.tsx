"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Link2,
  Mail,
  MessageCircle,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  Users,
  Heart,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import QRCode from "qrcode"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  creator?: EnhancedCreator
  creators?: EnhancedCreator[] // For sharing collections
  mode?: "single" | "collection"
}

export function ShareModal({
  isOpen,
  onClose,
  creator,
  creators = [],
  mode = "single"
}: ShareModalProps) {
  const [copied, setCopied] = React.useState(false)
  const [qrCodeUrl, setQrCodeUrl] = React.useState("")
  const [customMessage, setCustomMessage] = React.useState("")
  const [selectedPlatform, setSelectedPlatform] = React.useState<string | null>(null)

  // Generate share URL
  const shareUrl = React.useMemo(() => {
    if (mode === "single" && creator) {
      return `${window.location.origin}/creator/${creator.id}`
    } else if (mode === "collection" && creators.length > 0) {
      const ids = creators.map(c => c.id).join(",")
      return `${window.location.origin}/collection?ids=${ids}`
    }
    return window.location.href
  }, [mode, creator, creators])

  // Generate share text
  const shareText = React.useMemo(() => {
    if (mode === "single" && creator) {
      return `Check out ${creator.name} on Ann Pale! Get personalized video messages from your favorite Haitian celebrities. 🇭🇹`
    } else if (mode === "collection") {
      return `Check out my favorite creators on Ann Pale! ${creators.length} amazing Haitian celebrities ready to send you personalized video messages. 🇭🇹`
    }
    return "Check out Ann Pale!"
  }, [mode, creator, creators])

  // Generate QR code
  React.useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(shareUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      }).then(setQrCodeUrl).catch(console.error)
    }
  }, [isOpen, shareUrl])

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (platform: string) => {
    setSelectedPlatform(platform)
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(customMessage || shareText)
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent("Check out Ann Pale!")}&body=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400")
      toast.success(`Shared on ${platform}!`)
    }
  }

  const handleDownloadQR = () => {
    const link = document.createElement("a")
    link.download = mode === "single" ? `${creator?.name}-qr.png` : "collection-qr.png"
    link.href = qrCodeUrl
    link.click()
    toast.success("QR code downloaded!")
  }

  const socialPlatforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-sky-500" },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "bg-green-500" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
    { id: "telegram", name: "Telegram", icon: Send, color: "bg-blue-500" },
    { id: "email", name: "Email", icon: Mail, color: "bg-gray-600" }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "single" ? `Share ${creator?.name}` : "Share Collection"}
          </DialogTitle>
          <DialogDescription>
            Share this {mode === "single" ? "creator" : "collection"} with friends and family
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="social" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-4">
            {/* Custom Message */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Custom Message (Optional)
              </label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={shareText}
                className="min-h-[80px] resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {customMessage.length}/280 characters
              </p>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-3 gap-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <button
                    key={platform.id}
                    onClick={() => handleShare(platform.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg transition hover:scale-105",
                      selectedPlatform === platform.id && "ring-2 ring-purple-500"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white",
                      platform.color
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Preview */}
            {mode === "single" && creator && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{creator.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {customMessage || shareText}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {mode === "collection" && creators.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Collection Preview</p>
                <div className="flex -space-x-2 mb-2">
                  {creators.slice(0, 5).map((c) => (
                    <img
                      key={c.id}
                      src={c.avatar}
                      alt={c.name}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                  {creators.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <span className="text-xs font-medium">+{creators.length - 5}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {customMessage || shareText}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Copy Link Tab */}
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Link</label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={handleCopyLink}
                  className={cn(
                    "min-w-[100px]",
                    copied && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Short Link Option */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Short Link</span>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Get a shorter, custom link for easier sharing
              </p>
            </div>

            {/* Embed Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Embed Code</label>
              <Textarea
                value={`<iframe src="${shareUrl}" width="400" height="600" frameborder="0"></iframe>`}
                readOnly
                className="font-mono text-xs"
              />
              <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(`<iframe src="${shareUrl}" width="400" height="600" frameborder="0"></iframe>`)
                toast.success("Embed code copied!")
              }}>
                Copy Embed Code
              </Button>
            </div>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              {qrCodeUrl && (
                <>
                  <div className="p-4 bg-white rounded-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownloadQR}>
                      <Download className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                    <Button variant="outline" onClick={() => {
                      navigator.clipboard.writeText(qrCodeUrl)
                      toast.success("QR code copied!")
                    }}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Image
                    </Button>
                  </div>
                </>
              )}
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scan this QR code to view {mode === "single" ? "this creator" : "this collection"}
                </p>
                <p className="text-xs text-gray-500">
                  Perfect for events, business cards, or printed materials
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Share Stats */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span>234 shares</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-gray-400" />
                <span>45 saves</span>
              </div>
            </div>
            <Badge variant="secondary">
              <Share2 className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}