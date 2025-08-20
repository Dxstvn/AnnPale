import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ 
  className, 
  ...props 
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
        "bg-[length:200%_100%] bg-[position:-100%_0]",
        "[animation:shimmer_1.5s_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  )
}

// Text skeleton with multiple lines
interface SkeletonTextProps {
  lines?: number
  className?: string
}

function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 && "w-4/5" // Last line is shorter
          )} 
        />
      ))}
    </div>
  )
}

// Card skeleton
interface SkeletonCardProps {
  showAvatar?: boolean
  showImage?: boolean
  className?: string
}

function SkeletonCard({ 
  showAvatar = false, 
  showImage = true, 
  className 
}: SkeletonCardProps) {
  return (
    <div className={cn("rounded-xl border p-6 space-y-4", className)}>
      {showImage && (
        <Skeleton className="h-48 w-full rounded-lg" />
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}

// Creator card skeleton
function SkeletonCreatorCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border overflow-hidden", className)}>
      {/* Video thumbnail */}
      <Skeleton className="aspect-video w-full" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Avatar and badge */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Name and title */}
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Price */}
        <Skeleton className="h-6 w-24" />
        
        {/* Button */}
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  )
}

// Table skeleton
interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className 
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="border-b pb-3 mb-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4" 
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// List skeleton
interface SkeletonListProps {
  items?: number
  showAvatar?: boolean
  className?: string
}

function SkeletonList({ 
  items = 3, 
  showAvatar = true, 
  className 
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {showAvatar && (
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          )}
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  )
}

// Button skeleton
function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-11 w-32 rounded-md", className)} />
}

// Avatar skeleton
function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />
}

// Input skeleton
function SkeletonInput({ className }: { className?: string }) {
  return <Skeleton className={cn("h-11 w-full rounded-md", className)} />
}

// Badge skeleton
function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 w-20 rounded-full", className)} />
}

export { 
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonCreatorCard,
  SkeletonTable,
  SkeletonList,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonInput,
  SkeletonBadge,
}