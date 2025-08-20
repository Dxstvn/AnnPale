// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables if needed
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

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

// Mock matchMedia
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