const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addStatsColumns() {
  console.log('🔧 Adding stats columns to profiles table...')
  
  try {
    // Try to add columns via SQL (may fail if exec_sql doesn't exist)
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          -- Add stats columns if they don't exist
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS tagline TEXT,
          ADD COLUMN IF NOT EXISTS completed_videos INTEGER DEFAULT 0,
          ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
          ADD COLUMN IF NOT EXISTS response_time VARCHAR(20) DEFAULT '24hr',
          ADD COLUMN IF NOT EXISTS on_time_delivery INTEGER DEFAULT 95,
          ADD COLUMN IF NOT EXISTS repeat_customers INTEGER DEFAULT 0,
          ADD COLUMN IF NOT EXISTS total_earned DECIMAL(10,2) DEFAULT 0.00,
          ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
          ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
          ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT false;
        `
      })
      
      if (!error) {
        console.log('✅ Columns added successfully via SQL')
      }
    } catch (sqlError) {
      console.log('Note: Could not add columns via exec_sql, continuing with update...')
    }
    
    // Update Dustin's profile with some initial stats
    // This will work with existing columns
    const updateData = {}
    
    // Only add fields that might exist
    const possibleFields = {
      tagline: 'Creator on Ann Pale • Bringing joy through personalized messages',
      bio: 'Creator on Ann Pale • Bringing joy through personalized messages'
    }
    
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update(possibleFields)
      .eq('id', '530c7ea1-4946-4f34-b636-7530c2e376fb')
      
    if (updateError) {
      console.log('Note: Some columns might not exist yet:', updateError.message)
    } else {
      console.log('✅ Profile stats updated successfully')
    }
    
  } catch (error) {
    console.error('❌ Error adding stats columns:', error)
  }
}

addStatsColumns().catch(console.error)