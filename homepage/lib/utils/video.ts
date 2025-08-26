/**
 * Video utility functions for the Fan Dashboard
 * These functions handle video processing, validation, and metadata
 */

export interface VideoMetadata {
  duration: number // in seconds
  width: number
  height: number
  format: string
  size: number // in bytes
  thumbnailUrl?: string
}

export interface VideoValidation {
  isValid: boolean
  error?: string
}

// Supported video formats
const SUPPORTED_FORMATS = ['mp4', 'webm', 'mov', 'avi']
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const MIN_DURATION = 10 // 10 seconds minimum
const MAX_DURATION = 600 // 10 minutes maximum

/**
 * Calculate video duration from file (mock implementation)
 * In production, this would use a video processing library
 */
export function calculateVideoDuration(file: File): number {
  // Mock implementation based on file size
  // Assuming average bitrate of 5 Mbps
  const sizeInMb = file.size / (1024 * 1024)
  const estimatedDuration = (sizeInMb * 8) / 5 // Convert to seconds
  return Math.round(estimatedDuration)
}

/**
 * Validate video file format and size
 */
export function validateVideoFormat(file: File): VideoValidation {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty'
    }
  }

  // Check file format
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !SUPPORTED_FORMATS.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
    }
  }

  // Check MIME type
  const validMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo'
  ]
  
  if (!validMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid video MIME type'
    }
  }

  return { isValid: true }
}

/**
 * Generate thumbnail URL for video (mock implementation)
 * In production, this would extract a frame from the video
 */
export function generateThumbnail(videoUrl: string): string {
  // Mock implementation - in production would use video processing
  const videoId = videoUrl.split('/').pop()?.split('.')[0] || 'default'
  return `/thumbnails/${videoId}.jpg`
}

/**
 * Get video metadata from file
 */
export function getVideoMetadata(file: File): VideoMetadata {
  // Mock implementation - in production would use video processing library
  const duration = calculateVideoDuration(file)
  const format = file.name.split('.').pop()?.toLowerCase() || 'unknown'
  
  // Mock dimensions based on file size
  let width = 1920
  let height = 1080
  
  if (file.size < 50 * 1024 * 1024) { // Less than 50MB
    width = 1280
    height = 720
  } else if (file.size < 10 * 1024 * 1024) { // Less than 10MB
    width = 854
    height = 480
  }

  return {
    duration,
    width,
    height,
    format,
    size: file.size,
    thumbnailUrl: generateThumbnail(file.name)
  }
}

/**
 * Calculate total storage size for multiple videos
 */
export function calculateStorageSize(videos: Array<{ size: number }>): {
  totalBytes: number
  formatted: string
} {
  const totalBytes = videos.reduce((sum, video) => sum + video.size, 0)
  const formatted = formatFileSize(totalBytes)
  
  return {
    totalBytes,
    formatted
  }
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format video duration to mm:ss or hh:mm:ss
 */
export function formatVideoDuration(seconds: number): string {
  if (seconds < 0) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Validate video duration against requirements
 */
export function validateVideoDuration(duration: number): VideoValidation {
  if (duration < MIN_DURATION) {
    return {
      isValid: false,
      error: `Video must be at least ${MIN_DURATION} seconds long`
    }
  }
  
  if (duration > MAX_DURATION) {
    return {
      isValid: false,
      error: `Video cannot exceed ${MAX_DURATION / 60} minutes`
    }
  }
  
  return { isValid: true }
}

/**
 * Get video quality based on dimensions
 */
export function getVideoQuality(width: number, height: number): string {
  if (width >= 3840 && height >= 2160) return '4K'
  if (width >= 1920 && height >= 1080) return '1080p (Full HD)'
  if (width >= 1280 && height >= 720) return '720p (HD)'
  if (width >= 854 && height >= 480) return '480p'
  return '360p'
}

/**
 * Estimate upload time based on file size and connection speed
 */
export function estimateUploadTime(
  fileSize: number,
  connectionSpeedMbps: number = 10
): {
  seconds: number
  formatted: string
} {
  // Convert file size to megabits
  const fileSizeMb = (fileSize * 8) / (1024 * 1024)
  
  // Calculate upload time in seconds
  // Add 20% overhead for protocol overhead
  const seconds = Math.ceil((fileSizeMb / connectionSpeedMbps) * 1.2)
  
  // Format time
  let formatted: string
  if (seconds < 60) {
    formatted = `${seconds} seconds`
  } else if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60)
    formatted = `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    const hours = Math.ceil(seconds / 3600)
    formatted = `${hours} hour${hours > 1 ? 's' : ''}`
  }
  
  return {
    seconds,
    formatted
  }
}

/**
 * Check if video can be downloaded based on permissions
 */
export function canDownloadVideo(
  video: { allowDownload: boolean; isPrivate: boolean },
  userId: string,
  ownerId: string
): boolean {
  // Owner can always download their own videos
  if (userId === ownerId) return true
  
  // Private videos can't be downloaded by others
  if (video.isPrivate) return false
  
  // Check download permission
  return video.allowDownload
}