const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigrations() {
  console.log('🔍 Verifying database migrations...\n');

  const checks = {
    tables: {
      creator_stats: false,
      platform_revenue: false,
      daily_platform_stats: false,
      statistics_audit_log: false
    },
    hasData: {
      creator_stats: false,
      platform_revenue: false
    },
    materialized_view: false,
    rls_enabled: false
  };

  // Check each table
  console.log('📊 Checking tables:');
  for (const table of Object.keys(checks.tables)) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        checks.tables[table] = true;
        console.log(`  ✅ ${table} exists`);
        
        // Check if has data
        if (count && count > 0) {
          checks.hasData[table] = true;
          console.log(`     📈 Has ${count} records`);
        }
      } else if (error.code === '42P01') {
        console.log(`  ❌ ${table} does not exist`);
      } else {
        console.log(`  ⚠️  ${table}: ${error.message}`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: ${err.message}`);
    }
  }

  // Check materialized view
  console.log('\n🔮 Checking materialized view:');
  try {
    const { error } = await supabase
      .from('creator_rankings_mv')
      .select('*', { count: 'exact', head: true });
    
    if (!error) {
      checks.materialized_view = true;
      console.log('  ✅ creator_rankings_mv exists');
    } else {
      console.log('  ❌ creator_rankings_mv does not exist');
    }
  } catch (err) {
    console.log('  ❌ Error checking materialized view');
  }

  // Summary
  console.log('\n📋 Summary:');
  const allTablesExist = Object.values(checks.tables).every(v => v);
  const criticalTablesExist = checks.tables.creator_stats && checks.tables.platform_revenue;
  
  if (allTablesExist) {
    console.log('  ✅ All tables exist!');
  } else if (criticalTablesExist) {
    console.log('  ⚠️  Critical tables exist, but some auxiliary tables are missing');
  } else {
    console.log('  ❌ Some critical tables are missing');
  }

  if (checks.materialized_view) {
    console.log('  ✅ Materialized view exists');
  } else {
    console.log('  ⚠️  Materialized view is missing (optional)');
  }

  // Migration status
  console.log('\n🚀 Migration Status:');
  if (allTablesExist && checks.materialized_view) {
    console.log('  ✅ All migrations have been applied successfully!');
  } else if (criticalTablesExist) {
    console.log('  ⚠️  Core functionality is available, but some features may be limited');
    console.log('\n  To complete the migration:');
    console.log('  1. Go to: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql/new');
    console.log('  2. Open the file: APPLY_MIGRATIONS.sql');
    console.log('  3. Copy and run the SQL in the Supabase SQL Editor');
  } else {
    console.log('  ❌ Migrations need to be applied');
    console.log('\n  To apply migrations:');
    console.log('  1. Go to: https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql/new');
    console.log('  2. Open the file: APPLY_MIGRATIONS.sql');
    console.log('  3. Copy and run the SQL in the Supabase SQL Editor');
  }

  return checks;
}

verifyMigrations()
  .then(checks => {
    process.exit(Object.values(checks.tables).every(v => v) ? 0 : 1);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });