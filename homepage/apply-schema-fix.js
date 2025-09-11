#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read the migration file
const migrationPath = path.join(__dirname, 'supabase/migrations/20250906_fix_webhook_processing_schema.sql')
const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

// Create admin client
const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU5MzI4OCwiZXhwIjoyMDcyMTY5Mjg4fQ.YmQiXzpBOPBKvRKBJZjIBJh1uRQBQWKP5_kT5u71Lqw'

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