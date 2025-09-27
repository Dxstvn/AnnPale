import { Client } from 'pg'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const connectionString = process.env.POSTGRES_URL

if (!connectionString) {
  console.error('Missing POSTGRES_URL environment variable')
  process.exit(1)
}

async function applyMigration() {
  // Parse the connection string to add SSL mode
  let finalConnectionString = connectionString

  // If it doesn't already have sslmode, add it
  if (!finalConnectionString.includes('sslmode=')) {
    const separator = finalConnectionString.includes('?') ? '&' : '?'
    finalConnectionString = `${finalConnectionString}${separator}sslmode=require`
  }

  const client = new Client({
    connectionString: finalConnectionString
  })

  try {
    console.log('🔄 Connecting to database via transaction pooler...')
    await client.connect()
    console.log('✅ Connected successfully')

    // Check if column exists
    const checkQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'video_requests'
      AND column_name = 'payment_intent_id'
    `

    const checkResult = await client.query(checkQuery)

    if (checkResult.rows.length > 0) {
      console.log('✅ Column payment_intent_id already exists')
      return
    }

    console.log('📝 Adding payment_intent_id column...')

    // Add the column
    await client.query(`
      ALTER TABLE video_requests
      ADD COLUMN payment_intent_id TEXT
    `)
    console.log('✅ Column added')

    // Create index
    console.log('📝 Creating index...')
    await client.query(`
      CREATE INDEX idx_video_requests_payment_intent_id
      ON video_requests(payment_intent_id)
      WHERE payment_intent_id IS NOT NULL
    `)
    console.log('✅ Index created')

    // Update RLS policy
    console.log('📝 Updating RLS policies...')

    // Drop existing policy if it exists
    await client.query(`
      DROP POLICY IF EXISTS "Fans can update payment intent" ON video_requests
    `)

    // Create new policy
    await client.query(`
      CREATE POLICY "Fans can update payment intent"
      ON video_requests
      FOR UPDATE
      USING (auth.uid() = fan_id)
      WITH CHECK (auth.uid() = fan_id)
    `)
    console.log('✅ RLS policies updated')

    console.log('🎉 Migration completed successfully!')

  } catch (error) {
    console.error('❌ Error applying migration:', error)
    if (error instanceof Error) {
      console.error('Details:', error.message)
    }
  } finally {
    await client.end()
    console.log('🔌 Database connection closed')
  }
}

applyMigration()