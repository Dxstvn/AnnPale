import { BaseService, ServiceResult } from './base.service'
import type { Database } from '@/types/supabase'

type VideoUpload = Database['public']['Tables']['video_uploads']['Row']
type VideoUploadInsert = Database['public']['Tables']['video_uploads']['Insert']
type VideoUploadUpdate = Database['public']['Tables']['video_uploads']['Update']

export interface UploadVideoParams {
  orderId: string
  file: File
  originalFilename: string
}

export interface VideoProcessingStatus {
  id: string
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  progress?: number
  error?: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
}

export interface VideoWithOrder extends VideoUpload {
  order: {
    id: string
    user_id: string
    creator_id: string
    amount: number
    status: string
    video_request: {
      title: string
      description?: string
      occasion?: string
    }
    user: {
      display_name: string
      avatar_url?: string
    }
  }
}

export class VideoService extends BaseService {
  async uploadVideo(params: UploadVideoParams): Promise<ServiceResult<VideoUpload>> {
    try {
      this.validateRequired(params.orderId, 'Order ID')
      this.validateRequired(params.file, 'Video file')
      this.validateRequired(params.originalFilename, 'Original filename')
      this.validateUUID(params.orderId, 'Order ID')

      const user = await this.getCurrentUser()

      // Verify order exists and user is the creator
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .select('id, user_id, creator_id, status')
        .eq('id', params.orderId)
        .single()

      if (orderError || !order) {
        return {
          success: false,
          error: 'Order not found'
        }
      }

      if (order.creator_id !== user.id) {
        return {
          success: false,
          error: 'Access denied: Only the creator can upload videos for this order'
        }
      }

      if (!['accepted', 'in_progress'].includes(order.status)) {
        return {
          success: false,
          error: 'Order must be accepted or in progress to upload video'
        }
      }

      // Validate file
      const validation = this.validateVideoFile(params.file)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Check if video upload already exists for this order
      const { data: existingUpload } = await this.supabase
        .from('video_uploads')
        .select('id')
        .eq('order_id', params.orderId)
        .single()

      if (existingUpload) {
        return {
          success: false,
          error: 'Video already uploaded for this order'
        }
      }

      // Create video upload record
      const uploadData: VideoUploadInsert = {
        order_id: params.orderId,
        creator_id: user.id,
        original_filename: params.originalFilename,
        size_bytes: params.file.size,
        processing_status: 'uploading'
      }

      const { data: videoUpload, error: uploadError } = await this.supabase
        .from('video_uploads')
        .insert(uploadData)
        .select()
        .single()

      if (uploadError) {
        return this.handleError(uploadError, 'uploadVideo')
      }

      // Upload file to storage
      const uploadResult = await this.uploadToStorage(videoUpload.id, params.file)
      
      if (!uploadResult.success) {
        // Clean up failed upload record
        await this.supabase
          .from('video_uploads')
          .delete()
          .eq('id', videoUpload.id)

        return uploadResult
      }

      // Update video upload with storage URL
      const { data: updatedUpload, error: updateError } = await this.supabase
        .from('video_uploads')
        .update({
          video_url: uploadResult.data!.videoUrl,
          processing_status: 'processing'
        })
        .eq('id', videoUpload.id)
        .select()
        .single()

      if (updateError) {
        return this.handleError(updateError, 'uploadVideo - update with URL')
      }

      // Start background video processing
      await this.startVideoProcessing(videoUpload.id)

      // Update order status to in_progress if it wasn't already
      if (order.status === 'accepted') {
        await this.supabase
          .from('orders')
          .update({ status: 'in_progress' })
          .eq('id', params.orderId)
      }

      return {
        success: true,
        data: updatedUpload
      }

    } catch (error) {
      return this.handleError(error, 'uploadVideo')
    }
  }

  async getVideoProcessingStatus(videoId: string): Promise<ServiceResult<VideoProcessingStatus>> {
    try {
      this.validateRequired(videoId, 'Video ID')
      this.validateUUID(videoId, 'Video ID')

      const user = await this.getCurrentUser()

      const { data: video, error } = await this.supabase
        .from('video_uploads')
        .select(`
          id,
          processing_status,
          processing_error,
          video_url,
          thumbnail_url,
          duration,
          order:orders!order_id(creator_id, user_id)
        `)
        .eq('id', videoId)
        .single()

      if (error || !video) {
        return {
          success: false,
          error: 'Video not found'
        }
      }

      // Check access - either creator or customer can view status
      const order = video.order as any
      if (order.creator_id !== user.id && order.user_id !== user.id) {
        return {
          success: false,
          error: 'Access denied'
        }
      }

      return {
        success: true,
        data: {
          id: video.id,
          status: video.processing_status as any,
          error: video.processing_error || undefined,
          videoUrl: video.video_url || undefined,
          thumbnailUrl: video.thumbnail_url || undefined,
          duration: video.duration || undefined
        }
      }

    } catch (error) {
      return this.handleError(error, 'getVideoProcessingStatus')
    }
  }

  async getCreatorVideos(creatorId?: string): Promise<ServiceResult<VideoWithOrder[]>> {
    try {
      const user = creatorId ? { id: creatorId } : await this.getCurrentUser()

      const { data: videos, error } = await this.supabase
        .from('video_uploads')
        .select(`
          *,
          order:orders!order_id(
            id,
            user_id,
            creator_id,
            amount,
            status,
            video_request:video_requests(title, description, occasion),
            user:profiles!user_id(display_name, avatar_url)
          )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return this.handleError(error, 'getCreatorVideos')
      }

      return {
        success: true,
        data: (videos || []) as VideoWithOrder[]
      }

    } catch (error) {
      return this.handleError(error, 'getCreatorVideos')
    }
  }

  async getUserVideos(userId?: string): Promise<ServiceResult<VideoWithOrder[]>> {
    try {
      const user = userId ? { id: userId } : await this.getCurrentUser()

      const { data: videos, error } = await this.supabase
        .from('video_uploads')
        .select(`
          *,
          order:orders!order_id(
            id,
            user_id,
            creator_id,
            amount,
            status,
            video_request:video_requests(title, description, occasion),
            creator:profiles!creator_id(display_name, avatar_url)
          )
        `)
        .eq('order.user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return this.handleError(error, 'getUserVideos')
      }

      return {
        success: true,
        data: (videos || []) as VideoWithOrder[]
      }

    } catch (error) {
      return this.handleError(error, 'getUserVideos')
    }
  }

  async completeVideoDelivery(videoId: string): Promise<ServiceResult<VideoUpload>> {
    try {
      this.validateRequired(videoId, 'Video ID')
      this.validateUUID(videoId, 'Video ID')

      const user = await this.getCurrentUser()

      // Get video and order details
      const { data: video, error } = await this.supabase
        .from('video_uploads')
        .select(`
          id,
          order_id,
          creator_id,
          processing_status,
          video_url,
          order:orders!order_id(id, status, user_id, creator_id)
        `)
        .eq('id', videoId)
        .single()

      if (error || !video) {
        return {
          success: false,
          error: 'Video not found'
        }
      }

      if (video.creator_id !== user.id) {
        return {
          success: false,
          error: 'Access denied: Only the creator can complete video delivery'
        }
      }

      if (video.processing_status !== 'completed' || !video.video_url) {
        return {
          success: false,
          error: 'Video must be fully processed before delivery'
        }
      }

      const order = video.order as any
      if (!['in_progress', 'accepted'].includes(order.status)) {
        return {
          success: false,
          error: 'Order is not in correct status for delivery'
        }
      }

      // Update order status to completed
      const { error: orderError } = await this.supabase
        .from('orders')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', video.order_id)

      if (orderError) {
        return this.handleError(orderError, 'completeVideoDelivery - order update')
      }

      // Send notification to customer
      await this.sendVideoDeliveryNotification(video.order_id)

      // Return updated video
      const { data: updatedVideo, error: videoError } = await this.supabase
        .from('video_uploads')
        .select('*')
        .eq('id', videoId)
        .single()

      if (videoError) {
        return this.handleError(videoError, 'completeVideoDelivery - video fetch')
      }

      return {
        success: true,
        data: updatedVideo
      }

    } catch (error) {
      return this.handleError(error, 'completeVideoDelivery')
    }
  }

  private validateVideoFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 500MB'
      }
    }

    // Check file type
    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/avi',
      'video/mov'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File must be a video (MP4, MOV, WebM, or AVI)'
      }
    }

    return { valid: true }
  }

  private async uploadToStorage(videoId: string, file: File): Promise<ServiceResult<{ videoUrl: string }>> {
    try {
      const fileName = `videos/${videoId}/${Date.now()}_${file.name}`
      
      const { data, error } = await this.supabase.storage
        .from('video-uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return this.handleError(error, 'uploadToStorage')
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('video-uploads')
        .getPublicUrl(fileName)

      return {
        success: true,
        data: {
          videoUrl: urlData.publicUrl
        }
      }

    } catch (error) {
      return this.handleError(error, 'uploadToStorage')
    }
  }

  private async startVideoProcessing(videoId: string): Promise<void> {
    try {
      // This would typically trigger a background job or webhook
      // For now, we'll simulate processing completion after a delay
      console.log(`Starting video processing for ${videoId}`)

      // In a real implementation, this would:
      // 1. Trigger AWS MediaConvert, Cloudflare Stream, or similar service
      // 2. Generate thumbnail
      // 3. Extract video duration
      // 4. Possibly create multiple quality versions
      // 5. Update the video_uploads record when complete

      // For demo purposes, simulate processing
      setTimeout(async () => {
        await this.updateProcessingStatus(videoId, 'completed')
      }, 10000) // 10 seconds

    } catch (error) {
      console.error('Failed to start video processing:', error)
    }
  }

  private async updateProcessingStatus(
    videoId: string, 
    status: 'processing' | 'completed' | 'failed',
    error?: string
  ): Promise<void> {
    try {
      const updateData: VideoUploadUpdate = {
        processing_status: status,
        updated_at: new Date().toISOString()
      }

      if (error) {
        updateData.processing_error = error
      }

      await this.supabase
        .from('video_uploads')
        .update(updateData)
        .eq('id', videoId)

    } catch (err) {
      console.error('Failed to update processing status:', err)
    }
  }

  private async sendVideoDeliveryNotification(orderId: string): Promise<void> {
    try {
      await this.supabase
        .from('notifications')
        .insert({
          type: 'video_delivered',
          data: { orderId },
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.warn('Failed to send video delivery notification:', error)
    }
  }
}