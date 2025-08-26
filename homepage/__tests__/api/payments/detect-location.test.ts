/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/payments/detect-location/route'

// Mock NextRequest
const createMockRequest = (options: {
  headers?: Record<string, string>
  geo?: any
  ip?: string
  body?: any
  method?: string
}) => {
  const headers = new Map(Object.entries(options.headers || {}))
  
  const request = {
    headers: {
      get: (key: string) => headers.get(key) || null,
    },
    geo: options.geo || null,
    ip: options.ip || '127.0.0.1',
    json: async () => options.body || {},
    url: 'http://localhost:3000/api/payments/detect-location',
  } as unknown as NextRequest
  
  return request
}

// Mock fetch for IP geolocation
global.fetch = jest.fn()

describe('GET /api/payments/detect-location', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should detect Haiti from Vercel headers', async () => {
    const request = createMockRequest({
      headers: {
        'x-vercel-ip-country': 'Haiti',
        'x-vercel-ip-country-code': 'HT',
        'x-vercel-ip-city': 'Port-au-Prince',
      }
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(data).toMatchObject({
      country: 'Haiti',
      country_code: 'HT',
      city: 'Port-au-Prince',
      is_haiti: true,
      currency: 'HTG'
    })
  })
  
  it('should detect international location', async () => {
    const request = createMockRequest({
      headers: {
        'x-vercel-ip-country': 'United States',
        'x-vercel-ip-country-code': 'US',
        'x-vercel-ip-city': 'New York',
      }
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(data).toMatchObject({
      country: 'United States',
      country_code: 'US',
      city: 'New York',
      is_haiti: false,
      currency: 'USD'
    })
  })
  
  it('should use geo property when headers are missing', async () => {
    const request = createMockRequest({
      geo: {
        country: 'HT',
        city: 'Cap-Haitien',
        latitude: '19.7583',
        longitude: '-72.2042'
      }
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(data).toMatchObject({
      country_code: 'HT',
      city: 'Cap-Haitien',
      latitude: 19.7583,
      longitude: -72.2042,
      is_haiti: true,
      currency: 'HTG'
    })
  })
  
  it('should fallback to IP-based detection', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        country: 'Haiti',
        countryCode: 'HT',
        regionName: 'Ouest',
        city: 'Port-au-Prince',
        lat: 18.5944,
        lon: -72.3074,
        timezone: 'America/Port-au-Prince',
        currency: 'HTG'
      })
    })
    
    const request = createMockRequest({
      ip: '190.115.0.1', // Example Haiti IP
      headers: {
        'x-forwarded-for': '190.115.0.1'
      }
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('190.115.0.1')
    )
    
    expect(data).toMatchObject({
      country: 'Haiti',
      country_code: 'HT',
      is_haiti: true,
      currency: 'HTG'
    })
  })
  
  it('should not call external API for localhost', async () => {
    const mockFetch = global.fetch as jest.Mock
    
    const request = createMockRequest({
      ip: '127.0.0.1'
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(mockFetch).not.toHaveBeenCalled()
    expect(data).toMatchObject({
      is_haiti: false,
      currency: 'USD'
    })
  })
  
  it('should handle IP geolocation API errors gracefully', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    const request = createMockRequest({
      ip: '190.115.0.1',
      headers: {
        'x-forwarded-for': '190.115.0.1'
      }
    })
    
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200) // Should not fail
    expect(data).toMatchObject({
      is_haiti: false,
      currency: 'USD'
    })
  })
})

describe('POST /api/payments/detect-location', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should enhance detection with client timezone hint', async () => {
    const request = createMockRequest({
      headers: {
        'x-vercel-ip-country': 'United States',
        'x-vercel-ip-country-code': 'US',
      },
      body: {
        timezone: 'America/Port-au-Prince',
        language: 'en',
        currency: 'USD'
      },
      method: 'POST'
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    // Timezone indicates Haiti even though IP says US
    expect(data).toMatchObject({
      is_haiti: true,
      currency: 'HTG'
    })
  })
  
  it('should detect Haiti from language preference', async () => {
    const request = createMockRequest({
      headers: {
        'x-vercel-ip-country': 'Canada',
        'x-vercel-ip-country-code': 'CA',
      },
      body: {
        language: 'ht', // Haitian Creole
        currency: 'CAD'
      },
      method: 'POST'
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(data).toMatchObject({
      is_haiti: true,
      currency: 'HTG'
    })
  })
  
  it('should detect Haiti from fr-HT language code', async () => {
    const request = createMockRequest({
      headers: {
        'x-vercel-ip-country': 'France',
        'x-vercel-ip-country-code': 'FR',
      },
      body: {
        language: 'fr-HT', // French (Haiti)
      },
      method: 'POST'
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(data).toMatchObject({
      is_haiti: true,
      currency: 'HTG'
    })
  })
  
  it('should handle missing client hints', async () => {
    const request = createMockRequest({
      headers: {
        'x-vercel-ip-country': 'United States',
        'x-vercel-ip-country-code': 'US',
      },
      body: {},
      method: 'POST'
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(data).toMatchObject({
      country: 'United States',
      country_code: 'US',
      is_haiti: false,
      currency: 'USD'
    })
  })
  
  it('should handle POST errors gracefully', async () => {
    const request = createMockRequest({
      body: null, // This will cause json() to fail
      method: 'POST'
    })
    
    // Mock json() to throw an error
    request.json = jest.fn().mockRejectedValue(new Error('Invalid JSON'))
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toMatchObject({
      error: 'Failed to process location data',
      is_haiti: false,
      currency: 'USD'
    })
  })
})