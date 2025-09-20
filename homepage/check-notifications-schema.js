const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yijizsscwkvepljqojkz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpamx6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTIzNjIsImV4cCI6MjA3Mzc4ODM2Mn0.E43M1YJz2NJKq6aJPJrYwGVaEJD3EJrvQ-3KQMOEqkE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  // Get a sample notification to see the actual structure
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .limit(1);

  if (error) {
    console.log('Error:', error);
  } else if (data && data.length > 0) {
    console.log('Actual notification structure:');
    console.log('Columns:', Object.keys(data[0]));
    console.log('\nSample data:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('No notifications found in database');
  }
}

checkSchema().catch(console.error);
