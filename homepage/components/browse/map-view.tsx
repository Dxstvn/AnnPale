"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  MapPin,
  Star,
  DollarSign,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  List,
  X,
  CheckCircle,
  Clock,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface MapViewProps {
  creators: EnhancedCreator[]
  center?: { lat: number; lng: number }
  zoom?: number
  onCreatorSelect?: (creator: EnhancedCreator) => void
  onCreatorHover?: (creator: EnhancedCreator | null) => void
  selectedCreator?: EnhancedCreator | null
  hoveredCreator?: EnhancedCreator | null
  showList?: boolean
  onToggleList?: () => void
  className?: string
}

// Mock location data for creators (in production, would come from API)
const generateMockLocation = (index: number) => ({
  lat: 18.5944 + (Math.random() - 0.5) * 0.5, // Haiti coordinates
  lng: -72.3074 + (Math.random() - 0.5) * 0.5,
})

// Marker clustering utility
function clusterMarkers(
  creators: Array<EnhancedCreator & { location: { lat: number; lng: number } }>,
  zoom: number
) {
  const clusters: Array<{
    center: { lat: number; lng: number }
    creators: typeof creators
  }> = []

  const threshold = 0.01 * (20 - zoom) // Clustering threshold based on zoom

  creators.forEach(creator => {
    let addedToCluster = false

    for (const cluster of clusters) {
      const distance = Math.sqrt(
        Math.pow(cluster.center.lat - creator.location.lat, 2) +
        Math.pow(cluster.center.lng - creator.location.lng, 2)
      )

      if (distance < threshold) {
        cluster.creators.push(creator)
        // Update cluster center
        cluster.center = {
          lat: cluster.creators.reduce((sum, c) => sum + c.location.lat, 0) / cluster.creators.length,
          lng: cluster.creators.reduce((sum, c) => sum + c.location.lng, 0) / cluster.creators.length,
        }
        addedToCluster = true
        break
      }
    }

    if (!addedToCluster) {
      clusters.push({
        center: creator.location,
        creators: [creator]
      })
    }
  })

  return clusters
}

export function MapView({
  creators,
  center = { lat: 18.5944, lng: -72.3074 }, // Default to Haiti
  zoom: initialZoom = 10,
  onCreatorSelect,
  onCreatorHover,
  selectedCreator,
  hoveredCreator,
  showList = false,
  onToggleList,
  className
}: MapViewProps) {
  const [currentZoom, setCurrentZoom] = React.useState(initialZoom)
  const [mapCenter, setMapCenter] = React.useState(center)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const mapRef = React.useRef<HTMLDivElement>(null)

  // Add mock locations to creators
  const creatorsWithLocation = React.useMemo(() => 
    creators.map((creator, index) => ({
      ...creator,
      location: generateMockLocation(index)
    })),
    [creators]
  )

  // Cluster markers based on zoom level
  const clusters = React.useMemo(() => 
    clusterMarkers(creatorsWithLocation, currentZoom),
    [creatorsWithLocation, currentZoom]
  )

  const handleZoomIn = () => setCurrentZoom(prev => Math.min(prev + 1, 20))
  const handleZoomOut = () => setCurrentZoom(prev => Math.max(prev - 1, 5))
  
  const handleCenterOnUser = () => {
    // In production, would use geolocation API
    setMapCenter({ lat: 18.5944, lng: -72.3074 })
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <TooltipProvider>
      <div 
        ref={mapRef}
        className={cn(
          "relative h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden",
          isFullscreen && "h-screen",
          className
        )}
      >
        {/* Map Placeholder - In production, would integrate with real map library */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
          {/* Simple SVG map visualization */}
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Render clusters */}
            {clusters.map((cluster, index) => {
              const x = ((cluster.center.lng + 73) * 100) // Normalize coordinates
              const y = ((19 - cluster.center.lat) * 100)
              const isHovered = cluster.creators.some(c => c.id === hoveredCreator?.id)
              const isSelected = cluster.creators.some(c => c.id === selectedCreator?.id)

              if (cluster.creators.length > 1) {
                // Render cluster marker
                return (
                  <g key={`cluster-${index}`}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r={20 + cluster.creators.length * 2}
                      className={cn(
                        "fill-purple-500 stroke-white stroke-2 cursor-pointer transition-all",
                        isHovered && "fill-purple-600 scale-110",
                        isSelected && "fill-pink-500"
                      )}
                      opacity={0.8}
                      onClick={() => setCurrentZoom(prev => Math.min(prev + 2, 20))}
                    />
                    <text
                      x={`${x}%`}
                      y={`${y}%`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-bold text-sm pointer-events-none"
                    >
                      {cluster.creators.length}
                    </text>
                  </g>
                )
              }

              // Render individual marker
              const creator = cluster.creators[0]
              return (
                <g 
                  key={creator.id}
                  onClick={() => onCreatorSelect?.(creator)}
                  onMouseEnter={() => onCreatorHover?.(creator)}
                  onMouseLeave={() => onCreatorHover?.(null)}
                  className="cursor-pointer"
                >
                  <image
                    href={creator.avatar}
                    x={`${x - 2}%`}
                    y={`${y - 2}%`}
                    width="40"
                    height="40"
                    className={cn(
                      "rounded-full transition-all",
                      isHovered && "scale-125",
                      isSelected && "ring-4 ring-pink-500"
                    )}
                    clipPath="circle(20px at center)"
                  />
                  {creator.verified && (
                    <circle
                      cx={`${x + 1.5}%`}
                      cy={`${y - 1.5}%`}
                      r="8"
                      className="fill-blue-500 stroke-white stroke-1"
                    />
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleZoomIn}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleZoomOut}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleCenterOnUser}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur"
          >
            <Navigation className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={toggleFullscreen}
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          {onToggleList && (
            <Button
              size="icon"
              variant="secondary"
              onClick={onToggleList}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur"
            >
              <List className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="text-sm font-medium">Zoom: {currentZoom}</span>
          </div>
        </div>

        {/* Creator Info Popup */}
        <AnimatePresence>
          {hoveredCreator && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 z-10"
            >
              <Card className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={hoveredCreator.avatar}
                      alt={hoveredCreator.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{hoveredCreator.name}</h3>
                        {hoveredCreator.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {hoveredCreator.category}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{hoveredCreator.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${hoveredCreator.price}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{hoveredCreator.responseTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side List Panel */}
        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="absolute top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Creators in View</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {creators.length} creators found
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onToggleList}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100%-5rem)]">
                <div className="p-4 space-y-3">
                  {creatorsWithLocation.map((creator) => (
                    <Card
                      key={creator.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedCreator?.id === creator.id && "ring-2 ring-purple-500"
                      )}
                      onClick={() => onCreatorSelect?.(creator)}
                      onMouseEnter={() => onCreatorHover?.(creator)}
                      onMouseLeave={() => onCreatorHover?.(null)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{creator.name}</h4>
                              {creator.verified && (
                                <CheckCircle className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{creator.category}</span>
                              <span>•</span>
                              <span>${creator.price}</span>
                              <span>•</span>
                              <div className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{creator.rating}</span>
                              </div>
                            </div>
                          </div>
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Stats */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg px-3 py-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{creators.length} creators</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{clusters.length} locations</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}