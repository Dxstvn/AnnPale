const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  console.log('Applying missing migrations to remote database...\n');

  const migrations = [
    {
      name: 'Create platform_revenue table',
      sql: `
        CREATE TABLE IF NOT EXISTS platform_revenue (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id uuid REFERENCES orders(id),
          amount decimal(10,2) NOT NULL,
          platform_fee decimal(10,2) NOT NULL,
          creator_earnings decimal(10,2) NOT NULL,
          revenue_type text NOT NULL DEFAULT 'order',
          created_at timestamptz DEFAULT now()
        );
        
        CREATE INDEX IF NOT EXISTS idx_platform_revenue_created_at ON platform_revenue(created_at);
        CREATE INDEX IF NOT EXISTS idx_platform_revenue_order_id ON platform_revenue(order_id);
      `
    },
    {
      name: 'Create daily_platform_stats table',
      sql: `
        CREATE TABLE IF NOT EXISTS daily_platform_stats (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          date date NOT NULL UNIQUE,
          total_orders integer DEFAULT 0,
          total_revenue decimal(10,2) DEFAULT 0,
          total_platform_fees decimal(10,2) DEFAULT 0,
          total_creator_earnings decimal(10,2) DEFAULT 0,
          new_users integer DEFAULT 0,
          new_creators integer DEFAULT 0,
          active_users integer DEFAULT 0,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
        
        CREATE INDEX IF NOT EXISTS idx_daily_platform_stats_date ON daily_platform_stats(date);
      `
    },
    {
      name: 'Create trigger to track platform revenue',
      sql: `
        CREATE OR REPLACE FUNCTION track_platform_revenue()
        RETURNS trigger AS $$
        BEGIN
          IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
            INSERT INTO platform_revenue (
              order_id,
              amount,
              platform_fee,
              creator_earnings,
              revenue_type
            ) VALUES (
              NEW.id,
              NEW.amount,
              NEW.platform_fee,
              NEW.creator_earnings,
              'order'
            );
            
            -- Update daily stats
            INSERT INTO daily_platform_stats (date, total_orders, total_revenue, total_platform_fees, total_creator_earnings)
            VALUES (CURRENT_DATE, 1, NEW.amount, NEW.platform_fee, NEW.creator_earnings)
            ON CONFLICT (date) DO UPDATE SET
              total_orders = daily_platform_stats.total_orders + 1,
              total_revenue = daily_platform_stats.total_revenue + NEW.amount,
              total_platform_fees = daily_platform_stats.total_platform_fees + NEW.platform_fee,
              total_creator_earnings = daily_platform_stats.total_creator_earnings + NEW.creator_earnings,
              updated_at = now();
          END IF;
          
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Drop trigger if exists and recreate
        DROP TRIGGER IF EXISTS track_platform_revenue_trigger ON orders;
        CREATE TRIGGER track_platform_revenue_trigger
        AFTER INSERT OR UPDATE ON orders
        FOR EACH ROW
        EXECUTE FUNCTION track_platform_revenue();
      `
    },
    {
      name: 'Create materialized view for creator rankings',
      sql: `
        CREATE MATERIALIZED VIEW IF NOT EXISTS creator_rankings_mv AS
        SELECT 
          cs.creator_id,
          p.display_name,
          p.avatar_url,
          p.bio,
          p.price,
          p.categories,
          p.is_verified,
          p.response_time,
          cs.total_earnings,
          cs.total_orders,
          cs.completed_orders,
          cs.average_rating,
          cs.completion_rate,
          RANK() OVER (ORDER BY cs.total_earnings DESC) as earnings_rank,
          RANK() OVER (ORDER BY cs.average_rating DESC NULLS LAST) as rating_rank,
          RANK() OVER (ORDER BY cs.completed_orders DESC) as volume_rank,
          p.created_at
        FROM creator_stats cs
        JOIN profiles p ON p.id = cs.creator_id
        WHERE p.user_role = 'creator';
        
        CREATE UNIQUE INDEX IF NOT EXISTS idx_creator_rankings_mv_creator_id ON creator_rankings_mv(creator_id);
        CREATE INDEX IF NOT EXISTS idx_creator_rankings_mv_earnings_rank ON creator_rankings_mv(earnings_rank);
        CREATE INDEX IF NOT EXISTS idx_creator_rankings_mv_rating_rank ON creator_rankings_mv(rating_rank);
      `
    },
    {
      name: 'Enable RLS on new tables',
      sql: `
        ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;
        ALTER TABLE daily_platform_stats ENABLE ROW LEVEL SECURITY;
        
        -- Platform revenue policies (admin only)
        CREATE POLICY "Admins can view platform revenue"
        ON platform_revenue FOR SELECT
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_role = 'admin'
          )
        );
        
        -- Daily stats policies (admin only)
        CREATE POLICY "Admins can view daily platform stats"
        ON daily_platform_stats FOR SELECT
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_role = 'admin'
          )
        );
        
        -- Grant permissions
        GRANT SELECT ON platform_revenue TO authenticated;
        GRANT SELECT ON daily_platform_stats TO authenticated;
        GRANT ALL ON platform_revenue TO service_role;
        GRANT ALL ON daily_platform_stats TO service_role;
      `
    },
    {
      name: 'Add RLS policies for creator_stats',
      sql: `
        ALTER TABLE creator_stats ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Creators can view own stats" ON creator_stats;
        DROP POLICY IF EXISTS "System can manage creator stats" ON creator_stats;
        
        -- Creators can view their own stats
        CREATE POLICY "Creators can view own stats"
        ON creator_stats FOR SELECT
        TO authenticated
        USING (auth.uid() = creator_id);
        
        -- System can manage creator stats
        CREATE POLICY "System can manage creator stats"
        ON creator_stats FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
        
        -- Grant permissions
        GRANT SELECT ON creator_stats TO authenticated;
        GRANT ALL ON creator_stats TO service_role;
      `
    }
  ];

  for (const migration of migrations) {
    console.log(`\n🔄 Running: ${migration.name}`);
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql_query: migration.sql 
      }).catch(async (err) => {
        // If exec_sql doesn't exist, try direct execution
        console.log('  ℹ️  exec_sql not available, attempting alternative method...');
        
        // We can't directly execute SQL via the client library
        // So we'll need to use the SQL editor in Supabase dashboard
        return { error: 'Please run this SQL in Supabase SQL Editor' };
      });
      
      if (error) {
        if (error === 'Please run this SQL in Supabase SQL Editor') {
          console.log(`  ⚠️  ${error}`);
          console.log('\n📋 Copy this SQL and run in Supabase Dashboard SQL Editor:');
          console.log('----------------------------------------');
          console.log(migration.sql);
          console.log('----------------------------------------\n');
        } else {
          console.log(`  ❌ Error: ${error}`);
        }
      } else {
        console.log(`  ✅ Success`);
      }
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
    }
  }

  console.log('\n✅ Migration process complete!');
  console.log('\nNOTE: If you see "Please run this SQL in Supabase SQL Editor" messages above,');
  console.log('you need to manually run those SQL commands in your Supabase dashboard:');
  console.log('1. Go to https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql/new');
  console.log('2. Copy and paste each SQL block');
  console.log('3. Click "Run" for each one');
}

runMigrations().catch(console.error);