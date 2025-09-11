import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Export for use in tests
export const TEST_CONFIG = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000'
}

export const TEST_USERS = {
  fan: {
    email: 'testfan@annpale.test',
    password: 'TestPassword123!'
  },
  creator: {
    email: 'testcreator@annpale.test',
    password: 'TestPassword123!'
  },
  admin: {
    email: 'testadmin@annpale.test',
    password: 'TestPassword123!'
  }
}