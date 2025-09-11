const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndApplyMigrations() {
  console.log('Checking which migrations need to be applied...\n');

  // Check if statistics tables exist
  const tables = [
    'creator_stats',
    'platform_revenue', 
    'daily_platform_stats',
    'statistics_audit_log'
  ];

  const tableStatus = {};
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      tableStatus[table] = 'missing';
      console.log(`❌ Table '${table}' does not exist`);
    } else if (error) {
      tableStatus[table] = 'error';
      console.log(`⚠️  Table '${table}' error: ${error.message}`);
    } else {
      tableStatus[table] = 'exists';
      console.log(`✅ Table '${table}' exists`);
    }
  }

  // Check for RLS policies on creator_stats
  const { data: policies, error: policyError } = await supabase.rpc('get_policies_for_table', { 
    table_name: 'creator_stats' 
  }).catch(() => ({ data: null, error: true }));

  if (policyError || !policies) {
    console.log('\n⚠️  Could not check RLS policies (function may not exist)');
  } else if (policies && policies.length > 0) {
    console.log(`\n✅ RLS policies found on creator_stats: ${policies.length} policies`);
  } else {
    console.log('\n❌ No RLS policies found on creator_stats');
  }

  // List migration files
  console.log('\n📁 Migration files found:');
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const files = await fs.readdir(migrationsDir);
  
  const statsFiles = files.filter(f => f.includes('statistics') || f.includes('stats'));
  for (const file of statsFiles) {
    console.log(`  - ${file}`);
  }

  // Determine what needs to be applied
  console.log('\n📋 Migrations to apply:');
  const migrationsToApply = [];
  
  if (tableStatus['creator_stats'] === 'missing') {
    migrationsToApply.push('20250906_statistics_tables.sql');
  }
  
  if (tableStatus['statistics_audit_log'] === 'missing') {
    migrationsToApply.push('20250906_statistics_rls_policies.sql');
  }

  if (migrationsToApply.length === 0) {
    console.log('✅ All migrations appear to be applied!');
    
    // Check if we need RLS policies
    if (!policies || policies.length === 0) {
      console.log('\n⚠️  However, RLS policies may still need to be applied.');
      console.log('Would you like to apply RLS policies? Run: node apply-rls-policies.js');
    }
  } else {
    console.log('\nMigrations that need to be applied:');
    migrationsToApply.forEach(m => console.log(`  - ${m}`));
    console.log('\nTo apply these migrations, run:');
    console.log('  node run-migrations.js');
  }

  // Check materialized view
  const { error: mvError } = await supabase
    .from('creator_rankings_mv')
    .select('*')
    .limit(1);
  
  if (mvError && mvError.code === '42P01') {
    console.log('\n❌ Materialized view creator_rankings_mv does not exist');
  } else if (!mvError) {
    console.log('\n✅ Materialized view creator_rankings_mv exists');
  }
}

checkAndApplyMigrations().catch(console.error);