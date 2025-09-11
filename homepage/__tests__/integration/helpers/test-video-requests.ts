import { SupabaseClient } from '@supabase/supabase-js'

export interface TestVideoRequest {
  id?: string
  fan_id: string
  creator_id: string
  request_type: string
  occasion?: string
  recipient_name?: string
  instructions?: string
  price: number
  platform_fee?: number
  status?: 'pending' | 'accepted' | 'recording' | 'completed' | 'cancelled' | 'refunded'
  video_url?: string
  thumbnail_url?: string
  duration?: number
  rating?: number
  review?: string
  responded_at?: string
  completed_at?: string
  created_at?: string
  updated_at?: string
}

// Create a single test video request
export function createTestVideoRequest(
  creatorId: string,
  fanId: string,
  overrides?: Partial<TestVideoRequest>
): TestVideoRequest {
  return {
    fan_id: fanId,
    creator_id: creatorId,
    request_type: overrides?.request_type || 'birthday',
    occasion: overrides?.occasion || 'Birthday',
    recipient_name: overrides?.recipient_name || 'Test Recipient',
    instructions: overrides?.instructions || 'Please wish them a happy birthday!',
    price: overrides?.price ?? 50.00,
    platform_fee: overrides?.platform_fee ?? 10.00, // 20% platform fee
    status: overrides?.status || 'pending',
    ...overrides
  }
}

// Create multiple test video requests with different statuses
export async function createTestOrders(
  supabase: SupabaseClient,
  creatorId: string,
  fanId: string,
  count: number = 10
): Promise<TestVideoRequest[]> {
  const requests: TestVideoRequest[] = []
  
  // Create a mix of different statuses
  const statuses: ('pending' | 'completed' | 'cancelled')[] = ['completed', 'completed', 'completed', 'pending', 'cancelled']
  
  for (let i = 0; i < count; i++) {
    const status = statuses[i % statuses.length]
    const basePrice = 50 + (i * 10)
    
    const request = createTestVideoRequest(creatorId, fanId, {
      request_type: ['birthday', 'congratulations', 'roast', 'pep_talk'][i % 4],
      occasion: ['Birthday', 'Graduation', 'Anniversary', 'Motivation'][i % 4],
      price: basePrice,
      platform_fee: basePrice * 0.2, // 20% platform fee
      status,
      rating: status === 'completed' ? (3 + (i % 3)) : undefined,
      review: status === 'completed' ? `Great video! ${i}` : undefined,
      video_url: status === 'completed' ? `https://example.com/video${i}.mp4` : undefined,
      duration: status === 'completed' ? (30 + (i * 5)) : undefined,
      responded_at: status !== 'pending' ? new Date(Date.now() - (i * 3600000)).toISOString() : undefined,
      completed_at: status === 'completed' ? new Date(Date.now() - (i * 1800000)).toISOString() : undefined,
    })
    
    requests.push(request)
  }
  
  // Insert all requests
  const { data, error } = await supabase
    .from('video_requests')
    .insert(requests)
    .select()
  
  if (error) {
    throw new Error(`Failed to create test orders: ${error.message}`)
  }
  
  return data || []
}

// Create test earnings (for completed orders)
export async function createTestEarnings(
  supabase: SupabaseClient,
  creatorId: string,
  fanId: string,
  totalAmount: number
): Promise<void> {
  // Create completed orders that sum up to the total amount
  const orderCount = 5
  const pricePerOrder = totalAmount / orderCount
  const platformFee = pricePerOrder * 0.2 // 20% platform fee
  
  const completedOrders = []
  for (let i = 0; i < orderCount; i++) {
    completedOrders.push(
      createTestVideoRequest(creatorId, fanId, {
        price: pricePerOrder,
        platform_fee: platformFee,
        status: 'completed',
        rating: 4 + (i % 2),
        review: `Excellent work! Order ${i + 1}`,
        video_url: `https://example.com/completed${i}.mp4`,
        duration: 45 + (i * 10),
        completed_at: new Date(Date.now() - (i * 86400000)).toISOString(), // Completed over past days
        responded_at: new Date(Date.now() - (i * 86400000) - 3600000).toISOString(),
      })
    )
  }
  
  const { error } = await supabase
    .from('video_requests')
    .insert(completedOrders)
  
  if (error) {
    throw new Error(`Failed to create test earnings: ${error.message}`)
  }
}

// Clean up test video requests
export async function cleanupTestVideoRequests(
  supabase: SupabaseClient,
  creatorId?: string,
  fanId?: string
): Promise<void> {
  // Supabase requires a WHERE clause for DELETE operations
  // If no specific IDs provided, skip cleanup
  if (!creatorId && !fanId) {
    return
  }
  
  let query = supabase.from('video_requests').delete()
  
  if (creatorId) {
    query = query.eq('creator_id', creatorId)
  }
  
  if (fanId) {
    query = query.eq('fan_id', fanId)
  }
  
  const { error } = await query
  
  if (error) {
    console.warn('Failed to cleanup video requests:', error.message)
  }
}