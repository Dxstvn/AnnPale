/**
 * Supabase test utilities for proper mock chaining
 */

export interface MockSupabaseChain {
  select: jest.Mock
  eq: jest.Mock
  order: jest.Mock
  single: jest.Mock
  update: jest.Mock
  insert: jest.Mock
  delete: jest.Mock
  gte: jest.Mock
  lte: jest.Mock
  or: jest.Mock
  in: jest.Mock
  is: jest.Mock
  neq: jest.Mock
  like: jest.Mock
  ilike: jest.Mock
}

/**
 * Creates a properly chained Supabase mock
 * @param resolvedValue The value to resolve with
 * @param error Optional error to reject with
 */
export function createSupabaseChainMock(
  resolvedValue: any = null,
  error: any = null
): MockSupabaseChain {
  const chain: MockSupabaseChain = {
    select: jest.fn(),
    eq: jest.fn(),
    order: jest.fn(),
    single: jest.fn(),
    update: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
    gte: jest.fn(),
    lte: jest.fn(),
    or: jest.fn(),
    in: jest.fn(),
    is: jest.fn(),
    neq: jest.fn(),
    like: jest.fn(),
    ilike: jest.fn(),
  }

  // Make each method return the chain for chaining
  Object.keys(chain).forEach((method) => {
    if (method === 'single' || method === 'order') {
      // Terminal methods that return a promise
      chain[method as keyof MockSupabaseChain].mockResolvedValue({
        data: resolvedValue,
        error
      })
    } else {
      // Chainable methods
      chain[method as keyof MockSupabaseChain].mockReturnValue(chain)
    }
  })

  // Special handling for order which can be terminal
  chain.order.mockImplementation(() => {
    // Return immediately resolved promise
    return Promise.resolve({ data: resolvedValue, error })
  })

  // Special handling for single which is always terminal
  chain.single.mockImplementation(() => {
    // Return immediately resolved promise
    return Promise.resolve({ data: resolvedValue, error })
  })
  
  // Make gte terminal for count queries
  chain.gte.mockImplementation(() => {
    if (resolvedValue === null) {
      // This is likely a count query
      return Promise.resolve({ count: 0, error })
    }
    return chain
  })

  return chain
}

/**
 * Create a mock Supabase client with proper chaining
 */
export function createMockSupabaseClient() {
  const client = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { 
          user: { 
            id: 'creator-1', 
            email: 'creator@example.com',
            user_metadata: {}
          } 
        },
        error: null
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      signIn: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'creator-1' },
            access_token: 'mock-token'
          }
        },
        error: null
      })
    },
    from: jest.fn(),
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: { path: 'test/path' }, error: null }),
        download: jest.fn().mockResolvedValue({ data: new Blob(['test']), error: null }),
        remove: jest.fn().mockResolvedValue({ data: null, error: null }),
        createSignedUrl: jest.fn().mockResolvedValue({ 
          data: { signedUrl: 'https://test.url/signed' }, 
          error: null 
        }),
        getPublicUrl: jest.fn().mockReturnValue({ 
          data: { publicUrl: 'https://test.url/public' } 
        })
      })
    },
    rpc: jest.fn().mockResolvedValue({ data: null, error: null })
  }
  
  // Add a default from implementation that returns a valid chain
  client.from.mockImplementation(() => createSupabaseChainMock([], null))
  
  return client
}

/**
 * Setup mock for a specific table with data
 */
export function setupTableMock(
  mockClient: any,
  tableName: string,
  data: any[],
  error: any = null
) {
  const chain = createSupabaseChainMock(data, error)
  
  // Setup the from method to return our chain when called with this table
  mockClient.from.mockImplementation((table: string) => {
    if (table === tableName) {
      return chain
    }
    // Return a default empty chain for other tables
    return createSupabaseChainMock([], null)
  })
  
  return chain
}

/**
 * Setup mock for multiple table queries in sequence
 */
export function setupMultipleTableMocks(
  mockClient: any,
  mocks: Array<{ table: string; data: any[]; error?: any }>
) {
  let callCount = 0
  
  mockClient.from.mockImplementation((table: string) => {
    const mock = mocks[callCount]
    callCount++
    
    if (mock && mock.table === table) {
      return createSupabaseChainMock(mock.data, mock.error || null)
    }
    
    // Return a default empty chain if no match
    return createSupabaseChainMock([], null)
  })
}

/**
 * Helper to create mock request data
 */
export function createMockVideoRequest(overrides = {}) {
  return {
    id: 'request-1',
    fan_id: 'fan-1',
    creator_id: 'creator-1',
    occasion: 'Birthday',
    recipient_name: 'John Doe',
    instructions: 'Please wish John a happy 30th birthday!',
    status: 'pending',
    price_usd: 50,
    currency: 'USD',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    requested_at: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
    fan: {
      id: 'fan-1',
      username: 'johndoe',
      full_name: 'John Doe',
      avatar_url: null
    },
    ...overrides
  }
}

/**
 * Helper to create mock transaction data
 */
export function createMockTransaction(overrides = {}) {
  return {
    id: 'trans-1',
    video_request_id: 'request-1',
    fan_id: 'fan-1',
    creator_id: 'creator-1',
    amount: 50,
    currency: 'USD',
    status: 'completed',
    payment_method: 'stripe',
    provider: 'stripe',
    created_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    video_request: {
      occasion: 'Birthday',
      recipient_name: 'John Doe',
    },
    ...overrides
  }
}

/**
 * Setup mocks for earnings page with all required queries
 */
export function setupEarningsPageMocks(mockClient: any, transactions: any[]) {
  let callCount = 0
  
  mockClient.from.mockImplementation((table: string) => {
    callCount++
    
    // First call: get transactions with video_request join
    if (callCount === 1 && table === 'transactions') {
      const chain = createSupabaseChainMock(transactions, null)
      // Override order to return properly
      chain.order.mockResolvedValue({ data: transactions, error: null })
      return chain
    }
    
    // Second call: count videos
    if (callCount === 2 && table === 'videos') {
      const chain = createSupabaseChainMock(null, null)
      // select with count returns count property
      chain.select = jest.fn().mockReturnValue(chain)
      chain.eq = jest.fn().mockReturnValue(chain)
      chain.gte = jest.fn().mockResolvedValue({ count: 3, error: null })
      return chain
    }
    
    // Third call: count total requests
    if (callCount === 3 && table === 'video_requests') {
      const chain = createSupabaseChainMock(null, null)
      chain.select = jest.fn().mockReturnValue(chain)
      chain.eq = jest.fn().mockReturnValue(chain)
      chain.gte = jest.fn().mockResolvedValue({ count: 4, error: null })
      return chain
    }
    
    // Additional calls for tab changes
    if (table === 'transactions') {
      const chain = createSupabaseChainMock(transactions, null)
      chain.order.mockResolvedValue({ data: transactions, error: null })
      return chain
    }
    
    // Default
    return createSupabaseChainMock([], null)
  })
}

/**
 * Setup mocks for requests page with all required queries
 */
export function setupRequestsPageMocks(mockClient: any, requests: any[]) {
  mockClient.from.mockImplementation((table: string) => {
    if (table === 'video_requests') {
      const chain = createSupabaseChainMock(requests, null)
      // Override order to return properly
      chain.order.mockResolvedValue({ data: requests, error: null })
      return chain
    }
    
    // Default
    return createSupabaseChainMock([], null)
  })
}

/**
 * Setup mocks for record page with single request
 */
export function setupRecordPageMocks(mockClient: any, request: any) {
  let callCount = 0
  
  mockClient.from.mockImplementation((table: string) => {
    callCount++
    
    // First call: get single request
    if (callCount === 1 && table === 'video_requests') {
      const chain = createSupabaseChainMock([request], null)
      // Override single to return properly
      chain.single.mockResolvedValue({ data: request, error: null })
      return chain
    }
    
    // Second call: update status to recording
    if (callCount === 2 && table === 'video_requests') {
      const chain = createSupabaseChainMock(null, null)
      chain.eq.mockResolvedValue({ data: request, error: null })
      return chain
    }
    
    // Default
    return createSupabaseChainMock([], null)
  })
}