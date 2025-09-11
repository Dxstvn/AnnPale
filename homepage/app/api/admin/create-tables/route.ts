import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin-only API to create missing database tables
// Uses the service role key to execute DDL statements
export async function POST(request: NextRequest) {
  try {
    // Get the service role key from environment
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    console.log('🚀 Starting database table creation...')

    const results: any[] = []

    // SQL to create missing tables
    const SQL_STATEMENTS = [
      {
        name: 'payment_intents',
        sql: `
          CREATE TABLE IF NOT EXISTS payment_intents (
            id VARCHAR PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            video_request_id UUID REFERENCES video_requests(id) ON DELETE CASCADE,
            payment_intent_id VARCHAR,
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
      },
      {
        name: 'stripe_accounts',
        sql: `
          CREATE TABLE IF NOT EXISTS stripe_accounts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
            stripe_account_id VARCHAR NOT NULL UNIQUE,
            charges_enabled BOOLEAN DEFAULT false,
            payouts_enabled BOOLEAN DEFAULT false,
            onboarding_complete BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      },
      {
        name: 'video_uploads',
        sql: `
          CREATE TABLE IF NOT EXISTS video_uploads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            original_filename TEXT NOT NULL,
            video_url TEXT,
            thumbnail_url TEXT,
            duration INTEGER,
            size_bytes BIGINT,
            processing_status VARCHAR(50) DEFAULT 'uploading',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      },
      {
        name: 'payments',
        sql: `
          CREATE TABLE IF NOT EXISTS payments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            stripe_payment_id VARCHAR NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            platform_fee DECIMAL(10,2) NOT NULL,
            creator_earnings DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      }
    ]

    // Execute each CREATE TABLE statement
    for (const statement of SQL_STATEMENTS) {
      try {
        console.log(`Creating table: ${statement.name}`)
        
        // Try to execute the SQL via RPC if available
        const { data, error } = await supabase.rpc('exec', { sql: statement.sql })
        
        if (error) {
          console.error(`Error creating ${statement.name}:`, error)
          results.push({
            table: statement.name,
            status: 'error',
            error: error.message
          })
        } else {
          console.log(`✅ Created table: ${statement.name}`)
          results.push({
            table: statement.name,
            status: 'created'
          })
        }
      } catch (err: any) {
        console.error(`Failed to create ${statement.name}:`, err)
        results.push({
          table: statement.name,
          status: 'failed',
          error: err.message
        })
      }
    }

    // Verify tables exist by trying to query them
    const tables = ['payment_intents', 'orders', 'stripe_accounts', 'video_uploads', 'payments']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1)
        
        if (!error) {
          console.log(`✅ Verified table: ${table}`)
          const result = results.find(r => r.table === table)
          if (result) {
            result.verified = true
          }
        } else {
          console.log(`❌ Could not verify table: ${table} - ${error.message}`)
          const result = results.find(r => r.table === table)
          if (result) {
            result.verified = false
            result.verification_error = error.message
          }
        }
      } catch (err: any) {
        console.log(`❌ Verification error for ${table}:`, err.message)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Table creation process completed',
      results: results
    })

  } catch (error: any) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      { 
        error: 'Database setup failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check table status
export async function GET(request: NextRequest) {
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    const tables = ['payment_intents', 'orders', 'stripe_accounts', 'video_uploads', 'payments']
    const status: any[] = []
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1)
        
        status.push({
          table,
          exists: !error,
          error: error?.message
        })
      } catch (err: any) {
        status.push({
          table,
          exists: false,
          error: err.message
        })
      }
    }

    return NextResponse.json({
      tables: status
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}