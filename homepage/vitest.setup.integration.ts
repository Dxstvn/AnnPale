import { vi } from 'vitest'
import dotenv from 'dotenv'
import path from 'path'

// Load real environment variables for integration tests
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Set up test timeout for integration tests
// Note: This is set in the config file instead

// Add global test utilities
global.flushPromises = () => new Promise(resolve => setImmediate(resolve))

// Mock IntersectionObserver (required by some components)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
} as any

// Mock Next.js navigation for integration tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

console.log('Integration test environment loaded')