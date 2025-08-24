# Supabase CLI Guide for Ann Pale Project

## Current Setup Status

### ✅ What's Working
- Supabase CLI is installed (v2.34.3)
- Project is linked to: `supabase-amber-dog` (yijizsscwkvepljqojkz)
- Docker is installed and available
- Access token is configured

### ⚠️ Limitations
- Direct SQL execution via CLI requires proper database password
- Migration system conflicts with existing schema
- RLS policies and triggers need manual SQL execution

## Working with Remote Database

### Method 1: Using Supabase Dashboard (Recommended)
1. Go to [SQL Editor](https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/sql)
2. Copy SQL from `supabase/fix_oauth_authentication.sql`
3. Run the SQL directly

### Method 2: Using Database URL
```bash
export SUPABASE_ACCESS_TOKEN="sbp_988e9e4ffcd08c3f855dc71473c54bc94d9b6c3e"
export DATABASE_URL="postgres://postgres.yijizsscwkvepljqojkz:EhvPKtjRDjattpdq@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"

# Execute SQL directly
supabase db push --db-url "$DATABASE_URL" < your_migration.sql
```

### Method 3: Using Node.js Scripts
We've created helper scripts that work around CLI limitations:
- `scripts/execute-oauth-migration.js` - Applies OAuth fixes programmatically
- `scripts/test-oauth-auth.js` - Tests OAuth configuration
- `scripts/apply-oauth-fix.js` - Checks and creates missing profiles

## Local Development Setup (Optional)

If you want to use local Supabase for testing:

### 1. Start Local Supabase
```bash
# Make sure Docker is running
open -a Docker

# Start Supabase locally
supabase start

# This will download and start:
# - Postgres database
# - Auth server
# - Storage API
# - Realtime server
# - Edge Functions
```

### 2. Access Local Services
- Studio: http://localhost:54323
- API: http://localhost:54321
- Database: localhost:54322

### 3. Stop Local Supabase
```bash
supabase stop
```

## Current Database Credentials

- **Project**: supabase-amber-dog
- **Reference ID**: yijizsscwkvepljqojkz
- **Database Host**: aws-1-us-east-1.pooler.supabase.com
- **Database Port**: 6543
- **Database Name**: postgres
- **Database User**: postgres.yijizsscwkvepljqojkz
- **Database Password**: EhvPKtjRDjattpdq

## Common Commands

### Check Project Status
```bash
export SUPABASE_ACCESS_TOKEN="sbp_988e9e4ffcd08c3f855dc71473c54bc94d9b6c3e"
supabase projects list
```

### Link to Project
```bash
supabase link --project-ref yijizsscwkvepljqojkz
# When prompted for password, use: EhvPKtjRDjattpdq
```

### Generate Types
```bash
supabase gen types typescript --project-id yijizsscwkvepljqojkz > types/supabase.ts
```

## Troubleshooting

### "Cannot connect to Docker daemon"
```bash
# Start Docker Desktop
open -a Docker
# Wait a few seconds, then retry
```

### "Password authentication failed"
The database password in `.env.local` might be different from the actual database password. Use the password: `EhvPKtjRDjattpdq`

### "Type already exists" during migration
The migration system tries to recreate existing types. Either:
1. Use the Supabase Dashboard SQL editor
2. Modify the SQL to check for existence first
3. Use our Node.js scripts that handle this gracefully

## OAuth Configuration Status

### Required Manual Steps
1. **Configure OAuth Providers** in [Supabase Dashboard](https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/auth/providers)
   - Enable Google OAuth
   - Enable Twitter OAuth
   - Add client credentials

2. **Set Redirect URLs** in [URL Configuration](https://supabase.com/dashboard/project/yijizsscwkvepljqojkz/auth/url-configuration)
   - Site URL: `https://www.annpale.com`
   - Redirect URLs:
     - `https://www.annpale.com/auth/callback`
     - `http://localhost:3000/auth/callback`

3. **Apply SQL Migration**
   - Go to SQL Editor
   - Run `supabase/fix_oauth_authentication.sql`

## Testing OAuth

After configuration:
1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/login
3. Test Google and X login buttons
4. Debug at: http://localhost:3000/auth/debug

## Summary

While Supabase CLI has some limitations with direct SQL execution on remote databases, we've created workarounds using:
1. Node.js scripts for programmatic operations
2. Direct SQL execution via Dashboard
3. Helper utilities for testing and debugging

The OAuth system is ready - it just needs the manual configuration steps in the Supabase Dashboard to be fully functional.