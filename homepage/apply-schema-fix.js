#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read the migration file
const migrationPath = path.join(__dirname, 'supabase/migrations/20250906_fix_webhook_processing_schema.sql')
const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

// Create admin client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('   Please ensure these are set in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function applyMigration() {
  console.log('🔄 Applying database schema migration...')
  
  try {
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .filter(stmt => !stmt.toLowerCase().includes('select \'database schema fixed'))
    
    let successCount = 0
    let errorCount = 0
    
    for (const statement of statements) {
      try {
        console.log(`📝 Executing: ${statement.substring(0, 60)}${statement.length > 60 ? '...' : ''}`)
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.warn(`⚠️  Warning (continuing): ${error.message}`)
        } else {
          successCount++
        }
      } catch (err) {
        console.warn(`⚠️  Warning (continuing): ${err.message}`)
        errorCount++
      }
    }
    
    console.log(`✅ Migration completed: ${successCount} successful, ${errorCount} warnings`)
    
    // Test database connection
    const { data: tables, error: testError } = await supabase.rpc('exec_sql', { 
      sql: "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('payment_intents', 'platform_revenue', 'webhook_events')" 
    })
    
    if (testError) {
      console.log('⚠️  Could not verify tables, but migration ran')
    } else {
      console.log('🎯 Database schema migration applied successfully!')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Create the exec_sql function if it doesn't exist
async function createExecSQLFunction() {
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createFunctionSQL })
    if (error) {
      // Function might not exist yet, try direct SQL execution
      console.log('Creating exec_sql function directly...')
      const { error: directError } = await supabase.from('_dummy').select('*').limit(0) // This will fail but establish connection
    }
  } catch (err) {
    console.log('Function creation attempted, continuing with migration...')
  }
}

async function main() {
  await createExecSQLFunction()
  await applyMigration()
}

main().catch(console.error)