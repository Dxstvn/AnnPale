// Service Layer Exports
export { BaseService } from './base.service'
export { PaymentService } from './payment.service'
export { OrderService } from './order.service'
export { VideoService } from './video.service'
export { StatsService } from './stats.service'

// Re-export types
export type { ServiceResult, ServiceError } from './base.service'
export type { 
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentSplit
} from './payment.service'
export type {
  CreateOrderParams,
  UpdateOrderStatusParams,
  OrderWithDetails,
  OrderStatus
} from './order.service'
export type {
  UploadVideoParams,
  VideoProcessingStatus,
  VideoWithOrder
} from './video.service'
export type {
  CreatorAnalytics,
  PlatformAnalytics
} from './stats.service'

// Service instances for common use cases
// export const paymentService = new PaymentService()
// export const orderService = new OrderService()
// export const videoService = new VideoService()

// Utility function to create service instances with custom Supabase client
import type { SupabaseClient } from '@supabase/supabase-js'

// export function createServices(supabaseClient: SupabaseClient) {
//   return {
//     payment: new PaymentService(supabaseClient),
//     order: new OrderService(supabaseClient),
//     video: new VideoService(supabaseClient)
//   }
// }