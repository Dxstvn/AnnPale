// Create a database function that can execute raw SQL
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createSQLFunction() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  
  console.log('🚀 Creating SQL execution function...');
  
  // First, create the function using the REST API direct approach
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION public.exec_sql(sql_text text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_text;
      RETURN 'SUCCESS';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN 'ERROR: ' || SQLERRM;
    END;
    $$;
  `;

  try {
    // Try to execute via direct database connection approach
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        sql_text: createFunctionSQL
      })
    });

    if (response.ok) {
      console.log('✅ SQL function created successfully');
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Function creation failed:', errorText);
      return false;
    }
  } catch (error) {
    console.log('❌ Function creation error:', error.message);
    return false;
  }
}

async function createMissingTables() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  
  console.log('🚀 Creating missing database tables...');
  
  const tables = [
    {
      name: 'payment_intents',
      sql: `
        CREATE TABLE IF NOT EXISTS payment_intents (
          id VARCHAR PRIMARY KEY,
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'usd',
          status VARCHAR(50) NOT NULL,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'orders',
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          video_request_id UUID REFERENCES video_requests(id) ON DELETE CASCADE,
          payment_intent_id VARCHAR REFERENCES payment_intents(id),
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'usd',
          platform_fee DECIMAL(10,2) NOT NULL,
          creator_earnings DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          metadata JSONB DEFAULT '{}',
          accepted_at TIMESTAMPTZ,
          completed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      console.log(`Creating table: ${table.name}`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_text: table.sql 
      });
      
      if (error) {
        console.log(`❌ ${table.name}: ${error.message}`);
      } else {
        console.log(`✅ ${table.name}: ${data}`);
      }
    } catch (err) {
      console.log(`❌ ${table.name}: ${err.message}`);
    }
  }
}

async function main() {
  const functionCreated = await createSQLFunction();
  
  if (functionCreated) {
    await createMissingTables();
  } else {
    console.log('⚠️  Could not create SQL function. Tables must be created manually.');
    console.log('📋 Please execute the SQL statements from MANUAL_DATABASE_SETUP.md in Supabase Dashboard');
  }
}

main().catch(console.error);