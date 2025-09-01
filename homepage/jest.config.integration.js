const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Integration test specific configuration
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.integration.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle CSS imports
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    
    // Handle image imports
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    
    // Module aliases
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },
  testMatch: [
    '**/__tests__/integration/**/*.test.[jt]s?(x)',
  ],
  testTimeout: 30000, // Longer timeout for integration tests
  displayName: 'integration',
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
}

module.exports = createJestConfig(customJestConfig)