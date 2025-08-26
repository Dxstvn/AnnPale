/**
 * Canvas-based watermark system for video recording
 * Applies creator branding overlays during video recording
 */

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

export interface WatermarkConfig {
  text: string
  position: WatermarkPosition
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor?: string
  opacity: number
  padding: number
  enabled: boolean
}

export interface WatermarkDimensions {
  width: number
  height: number
  x: number
  y: number
}

/**
 * Default watermark configuration
 */
export const defaultWatermarkConfig: WatermarkConfig = {
  text: '',
  position: 'bottom-right',
  fontSize: 24,
  fontFamily: 'Arial, sans-serif',
  color: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  opacity: 0.9,
  padding: 12,
  enabled: false
}

/**
 * Calculate watermark position and dimensions
 */
export function calculateWatermarkDimensions(
  canvasWidth: number,
  canvasHeight: number,
  config: WatermarkConfig
): WatermarkDimensions {
  // Create temporary canvas to measure text
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  
  if (!tempCtx) {
    return { width: 0, height: 0, x: 0, y: 0 }
  }

  tempCtx.font = `${config.fontSize}px ${config.fontFamily}`
  const textMetrics = tempCtx.measureText(config.text)
  
  const textWidth = textMetrics.width
  const textHeight = config.fontSize
  
  const width = textWidth + (config.padding * 2)
  const height = textHeight + (config.padding * 2)

  let x: number, y: number

  switch (config.position) {
    case 'top-left':
      x = 20
      y = 20
      break
    case 'top-right':
      x = canvasWidth - width - 20
      y = 20
      break
    case 'bottom-left':
      x = 20
      y = canvasHeight - height - 20
      break
    case 'bottom-right':
      x = canvasWidth - width - 20
      y = canvasHeight - height - 20
      break
    case 'center':
      x = (canvasWidth - width) / 2
      y = (canvasHeight - height) / 2
      break
    default:
      x = canvasWidth - width - 20
      y = canvasHeight - height - 20
  }

  return { width, height, x, y }
}

/**
 * Draw watermark on canvas context
 */
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  config: WatermarkConfig,
  canvasWidth: number,
  canvasHeight: number
): void {
  if (!config.enabled || !config.text.trim()) {
    return
  }

  const dimensions = calculateWatermarkDimensions(canvasWidth, canvasHeight, config)
  
  // Save current context state
  ctx.save()
  
  // Set opacity
  ctx.globalAlpha = config.opacity
  
  // Draw background if specified
  if (config.backgroundColor) {
    ctx.fillStyle = config.backgroundColor
    ctx.fillRect(dimensions.x, dimensions.y, dimensions.width, dimensions.height)
  }
  
  // Set text properties
  ctx.font = `${config.fontSize}px ${config.fontFamily}`
  ctx.fillStyle = config.color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  
  // Draw text
  const textX = dimensions.x + config.padding
  const textY = dimensions.y + config.padding
  
  ctx.fillText(config.text, textX, textY)
  
  // Restore context state
  ctx.restore()
}

/**
 * Create a watermarked MediaStream from original stream
 */
export function createWatermarkedStream(
  originalStream: MediaStream,
  config: WatermarkConfig
): MediaStream {
  if (!config.enabled) {
    return originalStream
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    console.warn('Canvas context not available, returning original stream')
    return originalStream
  }

  const video = document.createElement('video')
  video.srcObject = originalStream
  video.muted = true
  video.playsInline = true
  
  video.addEventListener('loadedmetadata', () => {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Start the rendering loop
    renderWatermarkedFrame()
  })
  
  video.play()

  function renderWatermarkedFrame() {
    if (!ctx || video.paused || video.ended) {
      return
    }

    // Draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Draw the watermark overlay
    drawWatermark(ctx, config, canvas.width, canvas.height)
    
    // Continue the loop
    requestAnimationFrame(renderWatermarkedFrame)
  }

  // Return MediaStream from canvas
  return canvas.captureStream(30) // 30 FPS
}

/**
 * Apply watermark to a video blob (for existing recordings)
 */
export async function applyWatermarkToVideoBlob(
  videoBlob: Blob,
  config: WatermarkConfig
): Promise<Blob> {
  if (!config.enabled) {
    return videoBlob
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    const chunks: Blob[] = []
    
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const stream = canvas.captureStream(30)
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      recorder.onstop = () => {
        const watermarkedBlob = new Blob(chunks, { type: 'video/webm' })
        resolve(watermarkedBlob)
      }
      
      recorder.onerror = (event) => {
        reject(new Error(`Recording error: ${event}`))
      }

      // Start recording
      recorder.start()
      
      // Start the rendering loop
      renderFrame()
      
      // Stop recording when video ends
      video.addEventListener('ended', () => {
        recorder.stop()
      })
    })

    video.addEventListener('error', (e) => {
      reject(new Error(`Video loading error: ${e}`))
    })

    function renderFrame() {
      if (video.paused || video.ended) {
        return
      }

      // Draw the video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Draw the watermark overlay
      drawWatermark(ctx, config, canvas.width, canvas.height)
      
      // Continue the loop
      requestAnimationFrame(renderFrame)
    }

    // Load and play the video
    const url = URL.createObjectURL(videoBlob)
    video.src = url
    video.play()
  })
}

/**
 * Generate preview image with watermark applied
 */
export function generateWatermarkPreview(
  imageSrc: string,
  config: WatermarkConfig,
  maxWidth: number = 400,
  maxHeight: number = 300
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      // Calculate scaled dimensions
      const aspectRatio = img.width / img.height
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }
      
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      canvas.width = width
      canvas.height = height
      
      // Draw the image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Draw the watermark
      drawWatermark(ctx, config, width, height)
      
      // Convert to data URL
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = imageSrc
  })
}

/**
 * Validate watermark configuration
 */
export function validateWatermarkConfig(config: WatermarkConfig): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (config.enabled) {
    if (!config.text.trim()) {
      errors.push('Watermark text is required when enabled')
    }
    
    if (config.fontSize < 12 || config.fontSize > 72) {
      errors.push('Font size must be between 12 and 72 pixels')
    }
    
    if (config.opacity < 0 || config.opacity > 1) {
      errors.push('Opacity must be between 0 and 1')
    }
    
    if (config.padding < 0 || config.padding > 50) {
      errors.push('Padding must be between 0 and 50 pixels')
    }
    
    // Validate color format (basic check)
    if (!/^#[0-9A-F]{6}$/i.test(config.color) && !/^rgba?\(/.test(config.color)) {
      errors.push('Color must be a valid hex color or RGB/RGBA value')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Create preset watermark configurations
 */
export const watermarkPresets = {
  minimal: {
    ...defaultWatermarkConfig,
    fontSize: 18,
    opacity: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8
  },
  
  bold: {
    ...defaultWatermarkConfig,
    fontSize: 32,
    opacity: 1.0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    color: '#FFFFFF'
  },
  
  subtle: {
    ...defaultWatermarkConfig,
    fontSize: 16,
    opacity: 0.5,
    backgroundColor: undefined,
    padding: 6,
    color: '#FFFFFF'
  },
  
  branded: {
    ...defaultWatermarkConfig,
    fontSize: 24,
    opacity: 0.9,
    backgroundColor: 'rgba(147, 51, 234, 0.9)', // Purple brand color
    padding: 12,
    color: '#FFFFFF'
  }
}