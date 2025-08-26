// Mock Supabase client for testing

export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(() => Promise.resolve({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {
            full_name: 'Test User',
            avatar_url: 'https://example.com/avatar.jpg'
          }
        }
      },
      error: null
    })),
    getSession: jest.fn(() => Promise.resolve({
      data: {
        session: {
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          expires_at: Date.now() + 3600000,
          user: {
            id: 'test-user-id',
            email: 'test@example.com'
          }
        }
      },
      error: null
    })),
    signInWithPassword: jest.fn(() => Promise.resolve({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session: { access_token: 'test-token' }
      },
      error: null
    })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    onAuthStateChange: jest.fn((callback) => {
      // Return unsubscribe function
      return { data: { subscription: { unsubscribe: jest.fn() } } }
    }),
    exchangeCodeForSession: jest.fn(() => Promise.resolve({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session: { access_token: 'test-token' }
      },
      error: null
    })),
  },
  from: jest.fn((table: string) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(() => Promise.resolve({
      data: mockTableData[table]?.single || null,
      error: null
    })),
    maybeSingle: jest.fn(() => Promise.resolve({
      data: mockTableData[table]?.single || null,
      error: null
    })),
    then: jest.fn((callback) => {
      const result = {
        data: mockTableData[table]?.list || [],
        error: null
      }
      return Promise.resolve(callback(result))
    }),
  })),
  storage: {
    from: jest.fn((bucket: string) => ({
      upload: jest.fn(() => Promise.resolve({
        data: { path: `${bucket}/test-file.mp4` },
        error: null
      })),
      download: jest.fn(() => Promise.resolve({
        data: new Blob(['test video data']),
        error: null
      })),
      remove: jest.fn(() => Promise.resolve({
        data: { message: 'File deleted' },
        error: null
      })),
      createSignedUrl: jest.fn(() => Promise.resolve({
        data: { signedUrl: 'https://example.com/signed-url' },
        error: null
      })),
      getPublicUrl: jest.fn(() => ({
        data: { publicUrl: 'https://example.com/public-url' }
      })),
      list: jest.fn(() => Promise.resolve({
        data: [
          { name: 'file1.mp4', size: 1000000, created_at: '2024-01-01' },
          { name: 'file2.mp4', size: 2000000, created_at: '2024-01-02' }
        ],
        error: null
      })),
    }))
  },
  rpc: jest.fn(() => Promise.resolve({
    data: { result: 'success' },
    error: null
  })),
}

// Mock table data for different tables
const mockTableData: Record<string, any> = {
  profiles: {
    single: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'fan',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    list: [
      {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'fan'
      },
      {
        id: 'creator-id',
        email: 'creator@example.com',
        name: 'Test Creator',
        role: 'creator'
      }
    ]
  },
  video_requests: {
    single: {
      id: 'request-id',
      fan_id: 'fan-id',
      creator_id: 'creator-id',
      occasion: 'Birthday',
      recipient_name: 'John Doe',
      instructions: 'Please wish happy birthday',
      status: 'pending',
      price_usd: 25.00,
      created_at: '2024-01-01T00:00:00Z'
    },
    list: []
  },
  videos: {
    single: {
      id: 'video-id',
      request_id: 'request-id',
      creator_id: 'creator-id',
      storage_path: 'creator-id/video.mp4',
      duration_seconds: 120,
      file_size_bytes: 5000000,
      is_processed: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    list: []
  },
  transactions: {
    single: {
      id: 'transaction-id',
      request_id: 'request-id',
      fan_id: 'fan-id',
      creator_id: 'creator-id',
      amount: 25.00,
      currency: 'USD',
      payment_provider: 'stripe',
      status: 'completed',
      created_at: '2024-01-01T00:00:00Z'
    },
    list: []
  },
  video_access: {
    single: {
      id: 'access-id',
      video_id: 'video-id',
      user_id: 'fan-id',
      granted_at: '2024-01-01T00:00:00Z',
      download_allowed: true
    },
    list: []
  }
}

// Mock createClient functions
export const createClient = jest.fn(() => mockSupabaseClient)
export const createServerClient = jest.fn(() => Promise.resolve(mockSupabaseClient))
export const createBrowserClient = jest.fn(() => mockSupabaseClient)

// Helper to set mock data for specific tables
export const setMockTableData = (table: string, data: any) => {
  mockTableData[table] = data
}

// Helper to reset all mocks
export const resetSupabaseMocks = () => {
  jest.clearAllMocks()
  Object.keys(mockTableData).forEach(key => {
    mockTableData[key] = { single: null, list: [] }
  })
}