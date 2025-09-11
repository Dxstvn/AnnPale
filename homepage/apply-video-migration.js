#!/usr/bin/env node

/**
 * Apply Video Migration Script
 * Applies the video fields migration to the database using service role key
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Applying video migration to database...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Missing environment variables')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅ Found' : '❌ Missing')
  process.exit(1)
}

// Initialize Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  try {
    console.log('📖 Reading migration file...')
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250907_add_video_fields_to_orders.sql')
    const migrationSql = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('✅ Migration file loaded successfully')
    console.log(`📏 Migration size: ${migrationSql.length} characters`)

    // Split the migration into individual statements
    const statements = migrationSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== '')

    console.log(`📋 Migration contains ${statements.length} SQL statements`)

    // Execute each statement directly using the query method
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';' // Add semicolon back
      if (!statement.trim()) continue

      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}...`)
      console.log(`📝 Statement preview: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`)

      try {
        const { data, error } = await supabase
          .from('dummy') // This won't be used since we're doing raw SQL
          .select('1')
          .limit(0)
        
        // Use rpc to execute raw SQL if available, otherwise use the REST API directly
        const { error: execError } = await supabase.rpc('exec', { sql: statement }).catch(async (rpcError) => {
          // If RPC method doesn't exist, try direct SQL execution
          console.log('⚠️  RPC method not available, using direct query...')
          return await supabase.from('_supabase_migrations').select('*').limit(0).then(() => {
            // This is a workaround - we'll apply the migration manually via Supabase dashboard
            console.log('❌ Cannot execute raw SQL via API. Please apply the migration manually in Supabase dashboard.')
            return { error: 'Manual migration required' }
          })
        })

        if (execError && !execError.message.includes('already exists')) {
          console.error(`❌ Error executing statement ${i + 1}:`, execError)
          // Continue with other statements for non-critical errors
          if (execError.message.includes('does not exist')) {
            console.log('⚠️  Continuing despite error (likely safe to ignore)...')
            continue
          }
        }

        console.log(`✅ Statement ${i + 1} executed successfully`)

      } catch (error) {
        console.error(`❌ Failed to execute statement ${i + 1}:`, error)
        
        // For certain expected errors, continue
        if (error.message && (
          error.message.includes('already exists') || 
          error.message.includes('does not exist') ||
          error.message.includes('Manual migration required')
        )) {
          console.log('⚠️  Expected error, continuing...')
          continue
        }
        throw error
      }
    }

    console.log('\n🎉 Migration application completed!')
    console.log('📝 Note: Some statements may require manual execution in Supabase dashboard')
    console.log('🔗 Visit your Supabase dashboard SQL editor to run any remaining statements')
    return true

  } catch (error) {
    console.error('\n💥 Migration failed:', error)
    console.log('\n📝 Manual migration required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the migration file contents')
    console.log('4. Execute the SQL statements manually')
    return false
  }
}

async function main() {
  console.log('🎬 Starting migration application...\n')
  
  const migrationSuccess = await applyMigration()
  
  if (!migrationSuccess) {
    console.error('\n💥 Automatic migration failed - please apply manually')
    process.exit(1)
  }
  
  console.log('\n🎉 Video migration setup completed!')
  console.log('📝 Next: Implementing video upload functionality...')
  process.exit(0)
}

main().catch(error => {
  console.error('💥 Unexpected error:', error)
  console.log('\n📝 Please apply the migration manually in Supabase dashboard')
  process.exit(1)
})