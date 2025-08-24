# OAuth Configuration Guide for Supabase

## Important OAuth Settings

### Redirect URLs Configuration

You need to configure these redirect URLs in your Supabase Dashboard under Authentication > URL Configuration:

#### Site URL
- Production: `https://www.annpale.com`
- Local Development: `http://localhost:3000`

#### Redirect URLs (Add all of these)
```
https://www.annpale.com/auth/callback
https://annpale.com/auth/callback
http://localhost:3000/auth/callback
```

### OAuth Provider Configuration

## 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Configure OAuth consent screen if not done
4. Create OAuth 2.0 Client ID with:
   - Application type: Web application
   - Authorized JavaScript origins:
     - `https://www.annpale.com`
     - `https://annpale.com`
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `https://yijizsscwkvepljqojkz.supabase.co/auth/v1/callback`
     - `https://www.annpale.com/auth/callback`
     - `http://localhost:3000/auth/callback`

5. Copy Client ID and Client Secret
6. In Supabase Dashboard > Authentication > Providers:
   - Enable Google
   - Add Client ID and Client Secret
   - Save

## 2. X (Twitter) OAuth Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Navigate to your app settings
3. Under "User authentication settings", configure:
   - App permissions: Read
   - Type of App: Web App
   - Callback URLs:
     - `https://yijizsscwkvepljqojkz.supabase.co/auth/v1/callback`
     - `https://www.annpale.com/auth/callback`
     - `http://localhost:3000/auth/callback`
   - Website URL: `https://www.annpale.com`

4. Copy API Key (Client ID) and API Secret Key (Client Secret)
5. In Supabase Dashboard > Authentication > Providers:
   - Enable Twitter
   - Add Client ID and Client Secret
   - Save

## 3. Supabase Dashboard Settings

Navigate to your Supabase project dashboard:

### Authentication > URL Configuration
- **Site URL**: `https://www.annpale.com`
- **Redirect URLs**: 
  ```
  https://www.annpale.com/auth/callback
  https://annpale.com/auth/callback
  http://localhost:3000/auth/callback
  ```

### Authentication > Providers
Ensure both Google and Twitter are enabled with correct credentials.

## Testing OAuth

After configuration, test using:
1. Visit `/test-auth-flow` page
2. Click "Test Google OAuth" or test X login from `/login`
3. Check browser console for any errors
4. Verify profile creation in Supabase dashboard

## Common Issues and Solutions

### "Internal Server Error" on X/Twitter login
- Verify Twitter API credentials are correct
- Check that callback URLs match exactly
- Ensure Twitter app is approved and active

### Google login hangs on loading
- Check redirect URLs are properly configured
- Verify Google OAuth consent screen is published (not in testing mode)
- Check browser console for CORS errors

### Profile not created after OAuth
- Run the SQL migration: `fix_oauth_authentication.sql`
- Check RLS policies on profiles table
- Verify trigger function is active

## Environment Variables

Ensure these are set correctly in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yijizsscwkvepljqojkz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=https://www.annpale.com
```