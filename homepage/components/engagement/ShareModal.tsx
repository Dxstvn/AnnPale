"use client"

import { useState } from "react"
import { 
  Share2, 
  Copy, 
  Twitter,
  Facebook,
  Mail,
  MessageCircle,
  Link2,
  Check,
  QrCode,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import copyToClipboard from "copy-to-clipboard"
import toast from "react-hot-toast"
import QRCode from "qrcode"

interface ShareModalProps {
  url: string
  title: string
  creatorName: string
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  shareCount?: number
  onShare?: (platform: string) => void
}

interface ShareOption {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  action: () => void
}

export function ShareModal({
  url,
  title,
  creatorName,
  size = "md",
  showCount = true,
  shareCount = 0,
  onShare,
}: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [showQrCode, setShowQrCode] = useState(false)

  // Generate full URL
  const fullUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${url}`
    : url

  const shareText = `Check out this post by @${creatorName} on Ann Pale!`

  const handleCopyLink = () => {
    const success = copyToClipboard(fullUrl)
    if (success) {
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
      onShare?.("copy")
    } else {
      toast.error("Failed to copy link")
    }
  }

  const generateQrCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(fullUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        }
      })
      setQrCodeUrl(qrDataUrl)
      setShowQrCode(true)
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Failed to generate QR code")
    }
  }

  const shareOptions: ShareOption[] = [
    {
      name: "Twitter/X",
      icon: Twitter,
      color: "hover:bg-blue-50 hover:text-blue-600",
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`
        window.open(twitterUrl, "_blank", "width=600,height=400")
        onShare?.("twitter")
      }
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-50 hover:text-blue-700",
      action: () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(shareText)}`
        window.open(fbUrl, "_blank", "width=600,height=400")
        onShare?.("facebook")
      }
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-green-50 hover:text-green-600",
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`
        window.open(whatsappUrl, "_blank")
        onShare?.("whatsapp")
      }
    },
    {
      name: "Email",
      icon: Mail,
      color: "hover:bg-gray-50 hover:text-gray-700",
      action: () => {
        const subject = `Check out @${creatorName} on Ann Pale`
        const body = `${shareText}\n\n${fullUrl}`
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        onShare?.("email")
      }
    },
  ]

  const formatCount = (num: number): string => {
    if (num < 1000) return num.toString()
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
    return `${(num / 1000000).toFixed(1)}M`
  }

  const sizeClasses = {
    sm: {
      button: "h-8 px-2",
      icon: "h-4 w-4",
      text: "text-xs"
    },
    md: {
      button: "h-10 px-3",
      icon: "h-5 w-5",
      text: "text-sm"
    },
    lg: {
      button: "h-12 px-4",
      icon: "h-6 w-6",
      text: "text-base"
    }
  }

  const sizeConfig = sizeClasses[size]

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          "group relative gap-1.5 transition-all hover:text-blue-600",
          sizeConfig.button
        )}
      >
        <Share2 className={sizeConfig.icon} />
        {showCount && shareCount > 0 && (
          <span className={cn(sizeConfig.text, "font-medium")}>
            {formatCount(shareCount)}
          </span>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Share options grid */}
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  onClick={option.action}
                  className={cn(
                    "h-auto flex flex-col gap-2 py-4 transition-all",
                    option.color
                  )}
                >
                  <option.icon className="h-6 w-6" />
                  <span className="text-xs">{option.name}</span>
                </Button>
              ))}
            </div>

            {/* Copy link section */}
            <div className="space-y-2">
              <Label htmlFor="share-link">Or copy link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-link"
                  value={fullUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={handleCopyLink}
                  variant={copied ? "default" : "outline"}
                  className={cn(
                    "transition-all",
                    copied && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code section */}
            <div className="border-t pt-4">
              {!showQrCode ? (
                <Button
                  variant="outline"
                  onClick={generateQrCode}
                  className="w-full"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>QR Code</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQrCode(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center p-4 bg-white rounded-lg border">
                    {qrCodeUrl && (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    )}
                  </div>
                  <p className="text-xs text-center text-gray-500">
                    Scan this QR code to share on mobile
                  </p>
                </div>
              )}
            </div>

            {/* Post preview */}
            <div className="border-t pt-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-1">@{creatorName}</p>
                <p className="text-xs text-gray-600">{title}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}