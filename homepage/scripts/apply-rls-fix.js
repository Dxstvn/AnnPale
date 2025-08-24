const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyRLSFix() {
  try {
    const sqlPath = path.join(__dirname, '..', 'supabase', 'fix_profiles_rls_recursion.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Applying RLS fix to profiles table...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    }).single();
    
    if (error) {
      // Try executing the SQL directly
      console.log('RPC failed, trying direct execution...');
      
      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.toUpperCase().startsWith('SELECT')) {
          console.log('Skipping SELECT statement');
          continue;
        }
        
        console.log('Executing:', statement.substring(0, 50) + '...');
        
        // For policy operations, we need to use raw SQL through admin API
        // Since we can't execute DDL directly, we'll create a migration file instead
        console.log('Note: This needs to be applied via Supabase CLI or dashboard');
      }
      
      console.log('\nTo apply this fix:');
      console.log('1. Go to Supabase Dashboard > SQL Editor');
      console.log('2. Paste the contents of supabase/fix_profiles_rls_recursion.sql');
      console.log('3. Execute the query');
      console.log('\nOr use Supabase CLI: supabase db push');
    } else {
      console.log('RLS fix applied successfully!');
    }
    
  } catch (error) {
    console.error('Error applying RLS fix:', error);
  }
  
  process.exit(0);
}

applyRLSFix();