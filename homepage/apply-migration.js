const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function applyMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔄 Connecting to database via Transaction Pooler...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read the consolidated migration file
    const migrationPath = path.join(__dirname, 'supabase/migrations/20250914012904_consolidated_profile_and_stripe_updates.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Applying migration to remote database...');
    console.log('   Migration file: 20250914012904_consolidated_profile_and_stripe_updates.sql');

    await client.query(migrationSQL);

    console.log('✅ Migration applied successfully!\n');

    // Verify the columns were created
    console.log('🔍 Verifying columns in remote database...\n');

    const result = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'profiles'
      AND column_name IN (
        'display_name',
        'first_name',
        'last_name',
        'stripe_charges_enabled',
        'stripe_payouts_enabled',
        'onboarding_completed_at',
        'price_per_video',
        'social_media',
        'phone',
        'website',
        'stripe_account_id'
      )
      ORDER BY column_name
    `);

    console.log('✅ Verified columns in remote database:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.column_name}`);
    });

    // Check if any records were updated with display_name
    const countResult = await client.query(`
      SELECT
        COUNT(*) as total_profiles,
        COUNT(display_name) as with_display_name,
        COUNT(first_name) as with_first_name,
        COUNT(last_name) as with_last_name
      FROM profiles
    `);

    const stats = countResult.rows[0];
    console.log('\n📊 Profile Statistics:');
    console.log(`   Total profiles: ${stats.total_profiles}`);
    console.log(`   With display_name: ${stats.with_display_name}`);
    console.log(`   With first_name: ${stats.with_first_name}`);
    console.log(`   With last_name: ${stats.with_last_name}`);

    console.log('\n🎉 Database sync complete!');
    console.log('   Your remote database now has all the required columns for:');
    console.log('   - Display names');
    console.log('   - Stripe Connect onboarding');
    console.log('   - Creator profiles');

  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error:', error.message);

    if (error.detail) {
      console.error('Details:', error.detail);
    }

    if (error.hint) {
      console.error('Hint:', error.hint);
    }

    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the migration
console.log('====================================');
console.log('  Ann Pale Database Migration Tool');
console.log('====================================\n');

applyMigration().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});