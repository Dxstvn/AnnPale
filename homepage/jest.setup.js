// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// Increase default timeout for async operations
jest.setTimeout(15000)

// Configure Testing Library with increased async timeouts
configure({ 
  asyncUtilTimeout: 10000,
  computedStyleSupportsPseudoElements: true 
})

// Add global test utilities
global.flushPromises = () => new Promise(resolve => setImmediate(resolve))

// Mock environment variables if needed
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'

// Mock Azure Translator environment variables for testing
process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY = 'test-azure-key'
process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_ENDPOINT = 'https://test.cognitive.microsofttranslator.com/'
process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION = 'global'
process.env.AZURE_TRANSLATOR_KEY = 'test-azure-key'
process.env.AZURE_TRANSLATOR_ENDPOINT = 'https://test.cognitive.microsofttranslator.com/'
process.env.AZURE_TRANSLATOR_REGION = 'global'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
}

// Mock matchMedia (only in jsdom environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Mock WebRTC APIs
global.MediaStream = jest.fn().mockImplementation(() => ({
  getTracks: jest.fn(() => []),
  getVideoTracks: jest.fn(() => []),
  getAudioTracks: jest.fn(() => []),
  addTrack: jest.fn(),
  removeTrack: jest.fn(),
}))

global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  state: 'inactive',
  ondataavailable: null,
  onstop: null,
  onerror: null,
}))

// Mock MediaRecorder.isTypeSupported
MediaRecorder.isTypeSupported = jest.fn(() => true)

global.navigator.mediaDevices = {
  getUserMedia: jest.fn(() => 
    Promise.resolve(new MediaStream())
  ),
  enumerateDevices: jest.fn(() => 
    Promise.resolve([
      { deviceId: 'camera1', kind: 'videoinput', label: 'Camera 1' },
      { deviceId: 'mic1', kind: 'audioinput', label: 'Microphone 1' },
    ])
  ),
}

// Mock URL methods (only in jsdom environment)
if (typeof window !== 'undefined' && global.URL) {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
  global.URL.revokeObjectURL = jest.fn()
}

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))