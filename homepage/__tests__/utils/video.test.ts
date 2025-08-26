/**
 * Unit tests for video utility functions
 */

import {
  calculateVideoDuration,
  validateVideoFormat,
  generateThumbnail,
  getVideoMetadata,
  calculateStorageSize,
  formatFileSize,
  formatVideoDuration,
  validateVideoDuration,
  getVideoQuality,
  estimateUploadTime,
  canDownloadVideo
} from '@/lib/utils/video'

// Mock File object
function createMockFile(name: string, size: number, type: string): File {
  return new File([''], name, { type })
}

describe('Video Utilities', () => {
  describe('calculateVideoDuration', () => {
    it('should estimate duration based on file size', () => {
      const file = createMockFile('video.mp4', 10 * 1024 * 1024, 'video/mp4') // 10MB
      const duration = calculateVideoDuration(file)
      expect(duration).toBe(16) // (10 * 8) / 5 = 16 seconds
    })

    it('should handle small files', () => {
      const file = createMockFile('video.mp4', 1024 * 1024, 'video/mp4') // 1MB
      const duration = calculateVideoDuration(file)
      expect(duration).toBe(2) // (1 * 8) / 5 = 1.6, rounded to 2
    })

    it('should handle large files', () => {
      const file = createMockFile('video.mp4', 100 * 1024 * 1024, 'video/mp4') // 100MB
      const duration = calculateVideoDuration(file)
      expect(duration).toBe(160) // (100 * 8) / 5 = 160 seconds
    })

    it('should handle empty files', () => {
      const file = createMockFile('video.mp4', 0, 'video/mp4')
      const duration = calculateVideoDuration(file)
      expect(duration).toBe(0)
    })
  })

  describe('validateVideoFormat', () => {
    it('should validate valid MP4 file', () => {
      const file = createMockFile('video.mp4', 10 * 1024 * 1024, 'video/mp4')
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate valid WebM file', () => {
      const file = createMockFile('video.webm', 10 * 1024 * 1024, 'video/webm')
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(true)
    })

    it('should validate valid MOV file', () => {
      const file = createMockFile('video.mov', 10 * 1024 * 1024, 'video/quicktime')
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(true)
    })

    it('should reject files over size limit', () => {
      const file = createMockFile('video.mp4', 600 * 1024 * 1024, 'video/mp4') // 600MB
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('File size exceeds')
    })

    it('should reject empty files', () => {
      const file = createMockFile('video.mp4', 0, 'video/mp4')
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('File is empty')
    })

    it('should reject unsupported formats', () => {
      const file = createMockFile('video.mkv', 10 * 1024 * 1024, 'video/x-matroska')
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Unsupported format')
    })

    it('should reject invalid MIME types', () => {
      const file = createMockFile('video.mp4', 10 * 1024 * 1024, 'application/pdf')
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Invalid video MIME type')
    })

    it('should reject files without extension', () => {
      const file = createMockFile('video', 10 * 1024 * 1024, 'video/mp4')
      const result = validateVideoFormat(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Unsupported format')
    })
  })

  describe('generateThumbnail', () => {
    it('should generate thumbnail URL from video URL', () => {
      expect(generateThumbnail('/videos/test-video.mp4')).toBe('/thumbnails/test-video.jpg')
      expect(generateThumbnail('test.mp4')).toBe('/thumbnails/test.jpg')
    })

    it('should handle URLs without extension', () => {
      expect(generateThumbnail('/videos/test')).toBe('/thumbnails/test.jpg')
    })

    it('should handle empty URL', () => {
      expect(generateThumbnail('')).toBe('/thumbnails/default.jpg')
    })

    it('should handle complex paths', () => {
      expect(generateThumbnail('/path/to/videos/my-video.mp4'))
        .toBe('/thumbnails/my-video.jpg')
    })
  })

  describe('getVideoMetadata', () => {
    it('should extract metadata from large file', () => {
      const file = createMockFile('video.mp4', 100 * 1024 * 1024, 'video/mp4')
      const metadata = getVideoMetadata(file)
      
      expect(metadata.duration).toBe(160)
      expect(metadata.width).toBe(1920)
      expect(metadata.height).toBe(1080)
      expect(metadata.format).toBe('mp4')
      expect(metadata.size).toBe(100 * 1024 * 1024)
      expect(metadata.thumbnailUrl).toBe('/thumbnails/video.jpg')
    })

    it('should extract metadata from medium file', () => {
      const file = createMockFile('video.webm', 30 * 1024 * 1024, 'video/webm')
      const metadata = getVideoMetadata(file)
      
      expect(metadata.width).toBe(1280)
      expect(metadata.height).toBe(720)
      expect(metadata.format).toBe('webm')
    })

    it('should extract metadata from small file', () => {
      const file = createMockFile('video.mov', 5 * 1024 * 1024, 'video/quicktime')
      const metadata = getVideoMetadata(file)
      
      expect(metadata.width).toBe(854)
      expect(metadata.height).toBe(480)
    })

    it('should handle files without extension', () => {
      const file = createMockFile('video', 10 * 1024 * 1024, 'video/mp4')
      const metadata = getVideoMetadata(file)
      
      expect(metadata.format).toBe('unknown')
    })
  })

  describe('calculateStorageSize', () => {
    it('should calculate total storage for multiple videos', () => {
      const videos = [
        { size: 10 * 1024 * 1024 }, // 10MB
        { size: 20 * 1024 * 1024 }, // 20MB
        { size: 30 * 1024 * 1024 }  // 30MB
      ]
      
      const result = calculateStorageSize(videos)
      expect(result.totalBytes).toBe(60 * 1024 * 1024)
      expect(result.formatted).toBe('60 MB')
    })

    it('should handle empty array', () => {
      const result = calculateStorageSize([])
      expect(result.totalBytes).toBe(0)
      expect(result.formatted).toBe('0 Bytes')
    })

    it('should handle single video', () => {
      const videos = [{ size: 1024 * 1024 * 1024 }] // 1GB
      const result = calculateStorageSize(videos)
      expect(result.totalBytes).toBe(1024 * 1024 * 1024)
      expect(result.formatted).toBe('1 GB')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(100)).toBe('100 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('should format KB correctly', () => {
      expect(formatFileSize(10 * 1024)).toBe('10 KB')
      expect(formatFileSize(1024 * 1024 - 1)).toBe('1024 KB')
    })

    it('should format MB correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB')
      expect(formatFileSize(100 * 1024 * 1024)).toBe('100 MB')
    })

    it('should format GB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
      expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB')
    })

    it('should format TB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB')
    })
  })

  describe('formatVideoDuration', () => {
    it('should format seconds only', () => {
      expect(formatVideoDuration(0)).toBe('0:00')
      expect(formatVideoDuration(5)).toBe('0:05')
      expect(formatVideoDuration(30)).toBe('0:30')
      expect(formatVideoDuration(59)).toBe('0:59')
    })

    it('should format minutes and seconds', () => {
      expect(formatVideoDuration(60)).toBe('1:00')
      expect(formatVideoDuration(90)).toBe('1:30')
      expect(formatVideoDuration(125)).toBe('2:05')
      expect(formatVideoDuration(3599)).toBe('59:59')
    })

    it('should format hours, minutes and seconds', () => {
      expect(formatVideoDuration(3600)).toBe('1:00:00')
      expect(formatVideoDuration(3665)).toBe('1:01:05')
      expect(formatVideoDuration(7200)).toBe('2:00:00')
      expect(formatVideoDuration(10921)).toBe('3:02:01')
    })

    it('should handle negative values', () => {
      expect(formatVideoDuration(-10)).toBe('0:00')
    })
  })

  describe('validateVideoDuration', () => {
    it('should accept valid durations', () => {
      expect(validateVideoDuration(30).isValid).toBe(true)
      expect(validateVideoDuration(60).isValid).toBe(true)
      expect(validateVideoDuration(300).isValid).toBe(true)
      expect(validateVideoDuration(600).isValid).toBe(true)
    })

    it('should reject durations below minimum', () => {
      const result = validateVideoDuration(5)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least 10 seconds')
    })

    it('should reject durations above maximum', () => {
      const result = validateVideoDuration(700)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('cannot exceed 10 minutes')
    })

    it('should accept boundary values', () => {
      expect(validateVideoDuration(10).isValid).toBe(true)
      expect(validateVideoDuration(600).isValid).toBe(true)
    })
  })

  describe('getVideoQuality', () => {
    it('should identify 4K quality', () => {
      expect(getVideoQuality(3840, 2160)).toBe('4K')
      expect(getVideoQuality(4096, 2160)).toBe('4K')
    })

    it('should identify 1080p quality', () => {
      expect(getVideoQuality(1920, 1080)).toBe('1080p (Full HD)')
    })

    it('should identify 720p quality', () => {
      expect(getVideoQuality(1280, 720)).toBe('720p (HD)')
    })

    it('should identify 480p quality', () => {
      expect(getVideoQuality(854, 480)).toBe('480p')
    })

    it('should identify 360p quality', () => {
      expect(getVideoQuality(640, 360)).toBe('360p')
      expect(getVideoQuality(320, 240)).toBe('360p')
    })

    it('should handle non-standard resolutions', () => {
      expect(getVideoQuality(1600, 900)).toBe('720p (HD)')
      expect(getVideoQuality(2560, 1440)).toBe('1080p (Full HD)')
    })
  })

  describe('estimateUploadTime', () => {
    it('should estimate upload time for 10 Mbps connection', () => {
      const fileSize = 100 * 1024 * 1024 // 100MB
      const result = estimateUploadTime(fileSize, 10)
      
      // 100MB = 800Mb, 800/10 = 80 seconds, +20% = 96 seconds
      expect(result.seconds).toBe(96)
      expect(result.formatted).toBe('2 minutes')
    })

    it('should estimate upload time for fast connection', () => {
      const fileSize = 100 * 1024 * 1024 // 100MB
      const result = estimateUploadTime(fileSize, 100)
      
      expect(result.seconds).toBe(10)
      expect(result.formatted).toBe('10 seconds')
    })

    it('should estimate upload time for slow connection', () => {
      const fileSize = 100 * 1024 * 1024 // 100MB
      const result = estimateUploadTime(fileSize, 1)
      
      expect(result.seconds).toBe(960)
      expect(result.formatted).toBe('16 minutes')
    })

    it('should format hours correctly', () => {
      const fileSize = 1024 * 1024 * 1024 // 1GB
      const result = estimateUploadTime(fileSize, 2)
      
      expect(result.seconds).toBe(4915)
      expect(result.formatted).toBe('2 hours')
    })

    it('should use default connection speed', () => {
      const fileSize = 10 * 1024 * 1024 // 10MB
      const result = estimateUploadTime(fileSize)
      
      expect(result.seconds).toBe(10)
      expect(result.formatted).toBe('10 seconds')
    })

    it('should handle small files', () => {
      const fileSize = 1024 * 1024 // 1MB
      const result = estimateUploadTime(fileSize, 10)
      
      expect(result.seconds).toBe(1)
      expect(result.formatted).toBe('1 seconds')
    })
  })

  describe('canDownloadVideo', () => {
    const video = {
      allowDownload: true,
      isPrivate: false
    }

    it('should allow owner to download their own video', () => {
      expect(canDownloadVideo(video, 'user1', 'user1')).toBe(true)
    })

    it('should allow owner to download private video', () => {
      const privateVideo = { ...video, isPrivate: true }
      expect(canDownloadVideo(privateVideo, 'user1', 'user1')).toBe(true)
    })

    it('should allow owner to download non-downloadable video', () => {
      const noDownloadVideo = { ...video, allowDownload: false }
      expect(canDownloadVideo(noDownloadVideo, 'user1', 'user1')).toBe(true)
    })

    it('should allow others to download public downloadable video', () => {
      expect(canDownloadVideo(video, 'user2', 'user1')).toBe(true)
    })

    it('should prevent others from downloading private video', () => {
      const privateVideo = { ...video, isPrivate: true }
      expect(canDownloadVideo(privateVideo, 'user2', 'user1')).toBe(false)
    })

    it('should prevent others from downloading non-downloadable video', () => {
      const noDownloadVideo = { ...video, allowDownload: false }
      expect(canDownloadVideo(noDownloadVideo, 'user2', 'user1')).toBe(false)
    })

    it('should prevent download for private non-downloadable video', () => {
      const restrictedVideo = { allowDownload: false, isPrivate: true }
      expect(canDownloadVideo(restrictedVideo, 'user2', 'user1')).toBe(false)
    })
  })
})