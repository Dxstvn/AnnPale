const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function executeRLSFix() {
  // Use the direct database connection
  const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!\n');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250822173000_fix_profiles_rls.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by statements and execute each
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...\n`);

    for (const statement of statements) {
      if (statement.length > 0) {
        const preview = statement.substring(0, 60).replace(/\n/g, ' ');
        console.log(`Executing: ${preview}...`);
        
        try {
          await client.query(statement);
          console.log('  ✓ Success\n');
        } catch (err) {
          if (err.message.includes('does not exist')) {
            console.log('  ⚠ Policy doesn\'t exist (already dropped)\n');
          } else {
            console.log(`  ✗ Error: ${err.message}\n`);
          }
        }
      }
    }

    // Verify the fix
    console.log('Verifying RLS policies...');
    const result = await client.query(`
      SELECT policyname, cmd, permissive 
      FROM pg_policies 
      WHERE tablename = 'profiles'
      ORDER BY policyname;
    `);

    console.log('\nCurrent policies on profiles table:');
    result.rows.forEach(row => {
      console.log(`  - ${row.policyname} (${row.cmd}, ${row.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'})`);
    });

    console.log('\n✅ RLS fix completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

executeRLSFix();