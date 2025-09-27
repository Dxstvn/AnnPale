import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('Applying payment_intent_id migration...')

  try {
    // Check if column already exists
    const { data: columns } = await supabase
      .rpc('get_table_columns', { table_name: 'video_requests' })
      .single()

    // Since the RPC might not exist, let's try a different approach
    // Try to select the column to see if it exists
    const { error: checkError } = await supabase
      .from('video_requests')
      .select('payment_intent_id')
      .limit(1)

    if (!checkError || !checkError.message.includes('column')) {
      console.log('Column payment_intent_id already exists or check succeeded')
      return
    }

    console.log('Adding payment_intent_id column...')

    // Execute the migration SQL
    const migrationSQL = `
      -- Add payment_intent_id column to video_requests table
      ALTER TABLE video_requests
      ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

      -- Create an index on payment_intent_id for faster lookups
      CREATE INDEX IF NOT EXISTS idx_video_requests_payment_intent_id
      ON video_requests(payment_intent_id)
      WHERE payment_intent_id IS NOT NULL;

      -- Add a unique constraint to ensure one payment intent per video request
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'unique_payment_intent_id'
        ) THEN
          ALTER TABLE video_requests
          ADD CONSTRAINT unique_payment_intent_id
          UNIQUE(payment_intent_id);
        END IF;
      END $$;
    `

    const { error } = await supabase.rpc('exec_sql', { query: migrationSQL })

    if (error) {
      // If the RPC doesn't exist, we'll need to use the SQL Editor in Supabase Dashboard
      console.error('Could not execute migration via RPC:', error.message)
      console.log('\nPlease run the following SQL in your Supabase SQL Editor:')
      console.log('---')
      console.log(migrationSQL)
      console.log('---')
      process.exit(1)
    }

    console.log('Migration applied successfully!')
  } catch (error) {
    console.error('Error applying migration:', error)
    process.exit(1)
  }
}

applyMigration()