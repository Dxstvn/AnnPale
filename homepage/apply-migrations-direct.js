#!/usr/bin/env node

/**
 * Direct Supabase Migration Script
 * Applies the webhook processing schema fix using service role key
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Starting direct database migration...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Missing environment variables')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅ Found' : '❌ Missing')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('🔗 Supabase URL:', supabaseUrl)
console.log('🔑 Service Role Key:', serviceRoleKey ? 'sb-' + serviceRoleKey.slice(3, 8) + '...' : 'Missing')

// Initialize Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('✅ Supabase client initialized')

async function applyMigration() {
  try {
    console.log('📖 Reading migration file...')
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250906_fix_webhook_processing_schema.sql')
    const migrationSql = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('✅ Migration file loaded successfully')
    console.log(`📏 Migration size: ${migrationSql.length} characters`)

    // Split the migration into individual statements
    const statements = migrationSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'))

    console.log(`📋 Migration contains ${statements.length} SQL statements`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (!statement) continue

      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}...`)
      console.log(`📝 Statement preview: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`)

      try {
        const { data, error } = await supabase.rpc('execute_sql', {
          query: statement
        })

        if (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error)
          // Continue with other statements for non-critical errors
          if (error.message.includes('already exists') || error.message.includes('does not exist')) {
            console.log('⚠️  Continuing despite error (likely safe to ignore)...')
            continue
          }
          throw error
        }

        console.log(`✅ Statement ${i + 1} executed successfully`)
        
        if (data) {
          console.log(`📊 Result:`, data)
        }

      } catch (error) {
        console.error(`❌ Failed to execute statement ${i + 1}:`, error)
        throw error
      }
    }

    console.log('\n🎉 Migration completed successfully!')
    return true

  } catch (error) {
    console.error('\n💥 Migration failed:', error)
    return false
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration results...')
  
  try {
    // Check if payment_intents table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'payment_intents')

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError)
      return false
    }

    console.log('✅ payment_intents table exists:', tables.length > 0)

    // Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, tablename')
      .eq('tablename', 'payment_intents')

    if (policiesError) {
      console.error('❌ Error checking policies:', policiesError)
      return false
    }

    console.log(`✅ Found ${policies.length} RLS policies for payment_intents`)
    policies.forEach(policy => {
      console.log(`  - ${policy.policyname}`)
    })

    // Test inserting a payment intent
    console.log('\n🧪 Testing payment intent creation...')
    
    const testPaymentIntent = {
      id: 'pi_test_migration_' + Date.now(),
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      amount: 50.00,
      currency: 'usd',
      status: 'requires_payment_method',
      metadata: { test: true }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('payment_intents')
      .insert(testPaymentIntent)
      .select()

    if (insertError) {
      console.error('❌ Test insert failed:', insertError)
      return false
    }

    console.log('✅ Test payment intent created successfully')
    
    // Clean up test data
    const { error: cleanupError } = await supabase
      .from('payment_intents')
      .delete()
      .eq('id', testPaymentIntent.id)

    if (cleanupError) {
      console.error('⚠️  Error cleaning up test data:', cleanupError)
    } else {
      console.log('✅ Test data cleaned up')
    }

    return true

  } catch (error) {
    console.error('💥 Verification failed:', error)
    return false
  }
}

async function main() {
  console.log('🎬 Starting migration process...\n')
  
  const migrationSuccess = await applyMigration()
  
  if (!migrationSuccess) {
    console.error('\n💥 Migration failed - exiting')
    process.exit(1)
  }
  
  const verificationSuccess = await verifyMigration()
  
  if (!verificationSuccess) {
    console.error('\n💥 Verification failed - migration may not be complete')
    process.exit(1)
  }
  
  console.log('\n🎉 Migration completed and verified successfully!')
  console.log('📝 Next: Webhook processing should now work properly')
  process.exit(0)
}

main().catch(error => {
  console.error('💥 Unexpected error:', error)
  process.exit(1)
})