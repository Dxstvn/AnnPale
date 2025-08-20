"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface AvatarWithFallbackProps {
  src?: string | null
  alt?: string
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl"
}

export function AvatarWithFallback({ 
  src, 
  alt = "Avatar", 
  name = "",
  size = "md",
  className 
}: AvatarWithFallbackProps) {
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return ""
    const parts = name.trim().split(" ")
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const initials = getInitials(name)

  // Reset error state when src changes
  React.useEffect(() => {
    setError(false)
    setLoading(true)
  }, [src])

  if (!src || error) {
    // Fallback to initials or icon
    return (
      <div 
        className={cn(
          "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold",
          sizeClasses[size],
          className
        )}
      >
        {initials ? (
          <span>{initials}</span>
        ) : (
          <User className="h-1/2 w-1/2" />
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </div>
  )
}

// Creator-specific avatar with placeholder
export function CreatorAvatar({ 
  src, 
  name, 
  size = "md",
  className,
  verified = false 
}: AvatarWithFallbackProps & { verified?: boolean }) {
  return (
    <div className="relative inline-block">
      <AvatarWithFallback
        src={src}
        alt={`${name} avatar`}
        name={name}
        size={size}
        className={className}
      />
      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.5">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Video thumbnail with fallback
export function VideoThumbnail({ 
  src, 
  alt = "Video thumbnail",
  className 
}: { 
  src?: string | null
  alt?: string
  className?: string 
}) {
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setError(false)
    setLoading(true)
  }, [src])

  if (!src || error) {
    return (
      <div className={cn(
        "relative bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center",
        className
      )}>
        <div className="text-purple-600">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
      />
    </div>
  )
}