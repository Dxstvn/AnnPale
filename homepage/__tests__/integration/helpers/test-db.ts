import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Test database client with service role for full access
export function createTestClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Clean up test data after tests
export async function cleanupTestData(
  supabase: SupabaseClient,
  tableName: string,
  condition: { column: string; value: any }
) {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq(condition.column, condition.value)
  
  if (error) {
    console.warn(`Failed to cleanup ${tableName}:`, error.message)
  }
}

// Clean up all test tiers for a creator
export async function cleanupCreatorTiers(
  supabase: SupabaseClient,
  creatorId: string
) {
  const { error } = await supabase
    .from('creator_subscription_tiers')
    .delete()
    .eq('creator_id', creatorId)
  
  if (error) {
    console.warn('Failed to cleanup tiers:', error.message)
  }
}

// Clean up test user
export async function cleanupTestUser(
  supabase: SupabaseClient,
  userId: string
) {
  // Delete from profiles first (cascades to other tables)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)
  
  if (error) {
    console.warn('Failed to cleanup user:', error.message)
  }
  
  // Note: Cannot delete from auth.users via client SDK
  // Would need admin API or database function
}

// Helper to create a test user with a specific role
export async function createTestUser(
  supabase: SupabaseClient,
  email: string,
  password: string,
  role: 'fan' | 'creator' | 'admin'
) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      test_account: true
    }
  })

  if (authError) {
    throw new Error(`Failed to create test user: ${authError.message}`)
  }

  if (!authData.user) {
    throw new Error('No user data returned')
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email,
      name: `Test ${role}`,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  if (profileError) {
    // Try to cleanup auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw new Error(`Failed to create profile: ${profileError.message}`)
  }

  return authData.user
}

// Get a Supabase client authenticated as a specific user
export async function getAuthenticatedClient(
  email: string,
  password: string
): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  
  // Create client with unique storage key to prevent session conflicts
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      }
    }
  })
  
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    throw new Error(`Failed to authenticate: ${error.message}`)
  }
  
  return client
}