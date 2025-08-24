const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixMissingProfile() {
  const userId = 'df123755-fd7d-46a1-b4aa-161a6f4eecdb';
  
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('Profile not found for user:', userId);
      
      // Get user data from auth
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }
      
      if (!user) {
        console.log('User not found in auth system');
        return;
      }
      
      console.log('Found user:', user.email);
      
      // Create profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email,
          name: user.user_metadata?.full_name || 
                user.user_metadata?.name || 
                user.email?.split('@')[0] || 
                'User',
          role: 'fan',
          avatar_url: user.user_metadata?.avatar_url || 
                     user.user_metadata?.picture || 
                     null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating profile:', createError);
      } else {
        console.log('Profile created successfully:', newProfile);
      }
    } else if (existingProfile) {
      console.log('Profile already exists:', existingProfile);
    } else if (fetchError) {
      console.error('Error fetching profile:', fetchError);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
  
  process.exit(0);
}

fixMissingProfile();