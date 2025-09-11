const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTables() {
  console.log('Checking database tables...\n')
  
  // List of tables we expect to exist
  const expectedTables = [
    'profiles',
    'video_requests',
    'payment_intents',
    'orders',
    'stripe_accounts',
    'video_uploads',
    'payments',
    'creator_stats',
    'platform_revenue',
    'daily_platform_stats',
    'transactions',
    'webhook_events'
  ]
  
  const tableStatus = {}
  
  for (const tableName of expectedTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        if (error.message.includes('does not exist')) {
          tableStatus[tableName] = '❌ MISSING'
        } else {
          tableStatus[tableName] = `⚠️ ERROR: ${error.message}`
        }
      } else {
        tableStatus[tableName] = `✅ EXISTS`
      }
    } catch (err) {
      tableStatus[tableName] = `❌ ERROR: ${err.message}`
    }
  }
  
  // Display results
  console.log('TABLE STATUS:')
  console.log('=============')
  
  const missing = []
  const exists = []
  const errors = []
  
  for (const [table, status] of Object.entries(tableStatus)) {
    console.log(`${table.padEnd(25)} ${status}`)
    
    if (status.includes('MISSING')) {
      missing.push(table)
    } else if (status.includes('EXISTS')) {
      exists.push(table)
    } else {
      errors.push(table)
    }
  }
  
  console.log('\n=============')
  console.log(`\nSUMMARY:`)
  console.log(`✅ Existing tables: ${exists.length}`)
  console.log(`❌ Missing tables: ${missing.length}`)
  console.log(`⚠️ Errors: ${errors.length}`)
  
  if (missing.length > 0) {
    console.log('\nMISSING TABLES:')
    missing.forEach(t => console.log(`  - ${t}`))
  }
  
  if (errors.length > 0) {
    console.log('\nTABLES WITH ERRORS:')
    errors.forEach(t => console.log(`  - ${t}`))
  }
  
  // Check for additional tables not in our list
  console.log('\nChecking for additional tables in the database...')
  
  // Query information schema
  const { data: allTables, error: schemaError } = await supabase
    .rpc('get_all_table_names')
    .catch(() => ({ data: null, error: 'RPC function not available' }))
  
  if (!schemaError && allTables) {
    const additionalTables = allTables.filter(t => !expectedTables.includes(t.table_name))
    if (additionalTables.length > 0) {
      console.log('\nADDITIONAL TABLES FOUND:')
      additionalTables.forEach(t => console.log(`  - ${t.table_name}`))
    }
  }
}

checkTables().catch(console.error)