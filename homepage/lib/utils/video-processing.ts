/**
 * Video processing utilities for thumbnail generation and frame extraction
 * These functions handle real video frame capture using Canvas API
 */

export interface ThumbnailOption {
  id: string
  timestamp: number // in seconds
  blob: Blob
  dataUrl: string
  label: string
}

export interface VideoFrameExtractionResult {
  success: boolean
  thumbnails?: ThumbnailOption[]
  error?: string
}

/**
 * Extract a single frame from video at specific timestamp
 */
export async function captureVideoFrame(
  videoElement: HTMLVideoElement,
  timestamp: number,
  quality: number = 0.9
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      resolve(null)
      return
    }

    const handleSeeked = () => {
      // Set canvas dimensions to match video
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight
      
      // Draw the current video frame onto canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', quality)
      
      // Clean up event listener
      videoElement.removeEventListener('seeked', handleSeeked)
    }

    // Set the video to the desired timestamp
    videoElement.addEventListener('seeked', handleSeeked)
    videoElement.currentTime = timestamp
  })
}

/**
 * Generate multiple thumbnail options from video at different timestamps
 */
export async function generateThumbnailOptions(
  videoElement: HTMLVideoElement,
  count: number = 5
): Promise<VideoFrameExtractionResult> {
  try {
    if (!videoElement.duration || videoElement.duration === 0) {
      return {
        success: false,
        error: 'Video duration not available'
      }
    }

    const duration = videoElement.duration
    const thumbnails: ThumbnailOption[] = []

    // Generate timestamps at strategic points
    const timestamps = generateStrategicTimestamps(duration, count)

    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i]
      const blob = await captureVideoFrame(videoElement, timestamp)
      
      if (blob) {
        const dataUrl = URL.createObjectURL(blob)
        
        thumbnails.push({
          id: `thumb_${i}_${Math.floor(timestamp)}`,
          timestamp,
          blob,
          dataUrl,
          label: `${Math.floor(timestamp)}s`
        })
      }
    }

    if (thumbnails.length === 0) {
      return {
        success: false,
        error: 'Failed to generate any thumbnails'
      }
    }

    return {
      success: true,
      thumbnails
    }
  } catch (error) {
    console.error('Thumbnail generation error:', error)
    return {
      success: false,
      error: 'Failed to generate thumbnails'
    }
  }
}

/**
 * Generate strategic timestamps for thumbnail extraction
 * Avoids very beginning/end and spreads across video duration
 */
function generateStrategicTimestamps(duration: number, count: number): number[] {
  const timestamps: number[] = []
  
  // Don't take thumbnails from first 5% or last 5% of video
  const startTime = duration * 0.05
  const endTime = duration * 0.95
  const usableDuration = endTime - startTime
  
  for (let i = 0; i < count; i++) {
    // Distribute timestamps evenly across usable duration
    const progress = i / (count - 1)
    const timestamp = startTime + (progress * usableDuration)
    timestamps.push(Math.max(0, Math.min(duration - 1, timestamp)))
  }
  
  return timestamps
}

/**
 * Create a video element from blob/file for processing
 */
export async function createVideoElementFromBlob(blob: Blob): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    
    video.addEventListener('loadedmetadata', () => {
      resolve(video)
    })
    
    video.addEventListener('error', (e) => {
      reject(new Error(`Video loading error: ${e.message || 'Unknown error'}`))
    })
    
    const url = URL.createObjectURL(blob)
    video.src = url
  })
}

/**
 * Resize canvas to fit within maximum dimensions while maintaining aspect ratio
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): void {
  const { width, height } = canvas
  const aspectRatio = width / height
  
  let newWidth = width
  let newHeight = height
  
  // Scale down if necessary
  if (width > maxWidth) {
    newWidth = maxWidth
    newHeight = newWidth / aspectRatio
  }
  
  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = newHeight * aspectRatio
  }
  
  // Only resize if dimensions changed
  if (newWidth !== width || newHeight !== height) {
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    
    if (tempCtx) {
      // Copy original canvas content
      tempCanvas.width = width
      tempCanvas.height = height
      tempCtx.drawImage(canvas, 0, 0)
      
      // Resize original canvas
      canvas.width = newWidth
      canvas.height = newHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Draw resized image
        ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, newWidth, newHeight)
      }
    }
  }
}

/**
 * Extract video metadata including duration and dimensions
 */
export async function extractVideoMetadata(videoElement: HTMLVideoElement): Promise<{
  duration: number
  width: number
  height: number
  aspectRatio: number
}> {
  return {
    duration: videoElement.duration,
    width: videoElement.videoWidth,
    height: videoElement.videoHeight,
    aspectRatio: videoElement.videoWidth / videoElement.videoHeight
  }
}

/**
 * Clean up video element and blob URLs to prevent memory leaks
 */
export function cleanupVideoElement(videoElement: HTMLVideoElement): void {
  if (videoElement.src) {
    URL.revokeObjectURL(videoElement.src)
    videoElement.src = ''
  }
  videoElement.remove()
}

/**
 * Clean up thumbnail data URLs to prevent memory leaks
 */
export function cleanupThumbnails(thumbnails: ThumbnailOption[]): void {
  thumbnails.forEach(thumb => {
    if (thumb.dataUrl) {
      URL.revokeObjectURL(thumb.dataUrl)
    }
  })
}

/**
 * Convert timestamp to human readable format (mm:ss)
 */
export function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}