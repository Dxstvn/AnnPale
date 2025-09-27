import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
})

async function applyMigration() {
  console.log('🔄 Checking and adding payment_intent_id column...')

  try {
    // First, let's check if the column exists by trying to query it
    const { data: testData, error: testError } = await supabase
      .from('video_requests')
      .select('id, payment_intent_id')
      .limit(1)

    if (!testError) {
      console.log('✅ Column payment_intent_id already exists!')
      return
    }

    if (testError.message.includes('column') || testError.code === '42703') {
      console.log('📝 Column does not exist, adding it now...')

      // Read the SQL file
      const sqlPath = resolve(process.cwd(), 'scripts/add-payment-intent-column.sql')
      const sql = readFileSync(sqlPath, 'utf-8')

      console.log('\n⚠️  IMPORTANT: Please run the following SQL in your Supabase SQL Editor:')
      console.log('=' .repeat(60))
      console.log(sql)
      console.log('=' .repeat(60))
      console.log('\n📍 Go to: https://supabase.com/dashboard/project/_/sql/new')
      console.log('1. Copy the SQL above')
      console.log('2. Paste it in the SQL Editor')
      console.log('3. Click "Run"')
      console.log('\nAfter running the SQL, the payment_intent_id column will be available.')
    }
  } catch (error) {
    console.error('❌ Error checking column:', error)
  }
}

applyMigration()