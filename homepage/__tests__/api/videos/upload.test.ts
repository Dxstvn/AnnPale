/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/videos/upload/route'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseClient))
}))

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234')
}))

// Create mock storage object
const mockStorageFrom = jest.fn()

// Create mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn(),
  storage: {
    from: mockStorageFrom
  }
}

// Helper to create mock request
const createMockRequest = (options: {
  formData?: FormData
  searchParams?: Record<string, string>
  method?: string
}) => {
  const url = new URL('http://localhost:3000/api/videos/upload')
  
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  
  return {
    formData: async () => options.formData || new FormData(),
    url: url.toString(),
  } as unknown as NextRequest
}

describe('POST /api/videos/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset storage mock for each test
    mockStorageFrom.mockClear()
  })
  
  it('should reject unauthenticated requests', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error('Not authenticated')
    })
    
    const formData = new FormData()
    formData.append('file', new Blob(['video data'], { type: 'video/mp4' }), 'test.mp4')
    
    const request = createMockRequest({ formData })
    const response = await POST(request)
    
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })
  
  it('should reject non-creator users', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'user-id', email: 'user@example.com' } },
      error: null
    })
    
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { role: 'fan' }, // Not a creator
        error: null
      })
    }
    
    mockSupabaseClient.from.mockReturnValueOnce(mockProfileQuery)
    
    const formData = new FormData()
    formData.append('file', new Blob(['video data'], { type: 'video/mp4' }), 'test.mp4')
    
    const request = createMockRequest({ formData })
    const response = await POST(request)
    
    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('Only creators can upload videos')
  })
  
  it('should validate file type', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'creator-id', email: 'creator@example.com' } },
      error: null
    })
    
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { role: 'creator' },
        error: null
      })
    }
    
    mockSupabaseClient.from.mockReturnValueOnce(mockProfileQuery)
    
    const formData = new FormData()
    // Invalid file type
    formData.append('file', new Blob(['data'], { type: 'text/plain' }), 'test.txt')
    
    const request = createMockRequest({ formData })
    const response = await POST(request)
    
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('Invalid file type')
  })
  
  it('should validate file size', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'creator-id', email: 'creator@example.com' } },
      error: null
    })
    
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { role: 'creator' },
        error: null
      })
    }
    
    mockSupabaseClient.from.mockReturnValueOnce(mockProfileQuery)
    
    const formData = new FormData()
    // Create a mock file that's too large (over 500MB)
    const largeFile = new Blob(['x'.repeat(501 * 1024 * 1024)], { type: 'video/mp4' })
    Object.defineProperty(largeFile, 'size', { value: 501 * 1024 * 1024 })
    formData.append('file', largeFile, 'large.mp4')
    
    const request = createMockRequest({ formData })
    const response = await POST(request)
    
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('File too large')
  })
  
  it('should successfully upload temporary video', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'creator-id', email: 'creator@example.com' } },
      error: null
    })
    
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { role: 'creator' },
        error: null
      })
    }
    
    mockSupabaseClient.from.mockReturnValueOnce(mockProfileQuery)
    
    const mockStorageUpload = {
      upload: jest.fn().mockResolvedValueOnce({
        data: { path: 'creator-id/mock-uuid-1234.mp4' },
        error: null
      })
    }
    
    mockStorageFrom.mockReturnValueOnce(mockStorageUpload)
    
    const formData = new FormData()
    formData.append('file', new Blob(['video data'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('is_temp', 'true')
    
    const request = createMockRequest({ formData })
    const response = await POST(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data).toMatchObject({
      success: true,
      storage_path: 'creator-id/mock-uuid-1234.mp4',
      bucket: 'temp-recordings',
      message: 'Video uploaded to temporary storage'
    })
    
    expect(mockStorageUpload.upload).toHaveBeenCalledWith(
      'creator-id/mock-uuid-1234.mp4',
      expect.any(Blob),
      expect.objectContaining({
        contentType: 'video/mp4',
        upsert: false
      })
    )
  })
  
  it('should successfully upload final video with request', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'creator-id', email: 'creator@example.com' } },
      error: null
    })
    
    // Mock profile query
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { role: 'creator' },
        error: null
      })
    })
    
    // Mock video request query
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { 
          creator_id: 'creator-id',
          status: 'accepted',
          fan_id: 'fan-id'
        },
        error: null
      })
    })
    
    // Mock storage upload
    mockStorageFrom.mockReturnValueOnce({
      upload: jest.fn().mockResolvedValueOnce({
        data: { path: 'creator-id/mock-uuid-1234.mp4' },
        error: null
      })
    })
    
    // Mock video insert
    mockSupabaseClient.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { id: 'video-id' },
        error: null
      })
    })
    
    // Mock request update
    mockSupabaseClient.from.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({
        data: {},
        error: null
      })
    })
    
    // Mock get request for fan_id
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { fan_id: 'fan-id' },
        error: null
      })
    })
    
    // Mock video access insert
    mockSupabaseClient.from.mockReturnValueOnce({
      insert: jest.fn().mockResolvedValueOnce({
        data: {},
        error: null
      })
    })
    
    const formData = new FormData()
    formData.append('file', new Blob(['video data'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('request_id', 'request-id')
    formData.append('duration', '120')
    formData.append('is_temp', 'false')
    
    const request = createMockRequest({ formData })
    const response = await POST(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data).toMatchObject({
      success: true,
      video_id: 'video-id',
      storage_path: 'creator-id/mock-uuid-1234.mp4',
      message: 'Video uploaded successfully!'
    })
  })
  
  it('should verify request ownership', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'creator-id', email: 'creator@example.com' } },
      error: null
    })
    
    // Mock profile query
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { role: 'creator' },
        error: null
      })
    })
    
    // Mock video request query - different creator
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { 
          creator_id: 'other-creator-id', // Different creator
          status: 'accepted'
        },
        error: null
      })
    })
    
    const formData = new FormData()
    formData.append('file', new Blob(['video data'], { type: 'video/mp4' }), 'test.mp4')
    formData.append('request_id', 'request-id')
    formData.append('is_temp', 'false')
    
    const request = createMockRequest({ formData })
    const response = await POST(request)
    
    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('Unauthorized to upload for this request')
  })
})

describe('GET /api/videos/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset all mocks completely
    mockSupabaseClient.auth.getUser.mockReset()
    mockSupabaseClient.from.mockReset()
    mockStorageFrom.mockReset()
  })
  
  it('should generate signed URL for authorized user', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'fan-id', email: 'fan@example.com' } },
      error: null
    })
    
    // Mock video query
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: {
          id: 'video-id',
          creator_id: 'creator-id',
          storage_path: 'creator-id/video.mp4',
          duration_seconds: 120,
          view_count: 5,
          request: {
            fan_id: 'fan-id' // User has access
          }
        },
        error: null
      })
    })
    
    // Mock storage signed URL
    mockStorageFrom.mockReturnValueOnce({
      createSignedUrl: jest.fn().mockResolvedValueOnce({
        data: { signedUrl: 'https://example.com/signed-video-url' },
        error: null
      })
    })
    
    // Mock view count update
    mockSupabaseClient.from.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({
        data: {},
        error: null
      })
    })
    
    // Mock access record update (with chained eq calls)
    const updateMock = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    }
    updateMock.eq = jest.fn().mockImplementation(() => ({
      ...updateMock,
      eq: jest.fn().mockResolvedValueOnce({
        data: {},
        error: null
      })
    }))
    mockSupabaseClient.from.mockReturnValueOnce(updateMock)
    
    // Mock checkVideoAccess query (called if not creator or requester)
    // In this case, the fan is the requester so it should not be called,
    // but let's mock it just in case
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { id: 'access-id' },
        error: null
      })
    })
    
    const request = createMockRequest({
      searchParams: {
        video_id: 'video-id',
        action: 'url'
      }
    })
    
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data).toMatchObject({
      url: 'https://example.com/signed-video-url',
      expires_in: 3600,
      video: {
        id: 'video-id',
        duration: 120
      }
    })
  })
  
  it('should deny access to unauthorized users', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'other-user-id', email: 'other@example.com' } },
      error: null
    })
    
    // Mock video query
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: {
          id: 'video-id',
          creator_id: 'creator-id',
          request: {
            fan_id: 'fan-id' // Different user
          }
        },
        error: null
      })
    })
    
    // Mock access check (no access) with chained eq
    const accessCheckMock = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: null, // No access record
        error: { code: 'PGRST116' }
      })
    }
    accessCheckMock.eq = jest.fn().mockImplementation(() => ({
      ...accessCheckMock,
      eq: jest.fn().mockReturnThis(),
      single: accessCheckMock.single
    }))
    mockSupabaseClient.from.mockReturnValueOnce(accessCheckMock)
    
    // No storage mock needed - should fail with 403 before reaching storage
    
    const request = createMockRequest({
      searchParams: {
        video_id: 'video-id',
        action: 'url'
      }
    })
    
    const response = await GET(request)
    
    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBe('Access denied')
  })
  
  it('should return video status without action parameter', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'creator-id', email: 'creator@example.com' } },
      error: null
    })
    
    // Mock video query
    mockSupabaseClient.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: {
          id: 'video-id',
          creator_id: 'creator-id', // Creator owns the video
          is_processed: true,
          duration_seconds: 180,
          file_size_bytes: 10000000,
          view_count: 42,
          created_at: '2024-01-01T00:00:00Z',
          request: {
            id: 'request-id',
            occasion: 'Birthday',
            recipient_name: 'John Doe'
          }
        },
        error: null
      })
    })
    
    const request = createMockRequest({
      searchParams: {
        video_id: 'video-id'
      }
    })
    
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(data).toMatchObject({
      video: {
        id: 'video-id',
        status: 'ready',
        duration: 180,
        size: 10000000,
        views: 42
      },
      request: {
        id: 'request-id',
        occasion: 'Birthday',
        recipient: 'John Doe'
      }
    })
  })
})