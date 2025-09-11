-- Import all profiles data from remote to local Supabase
-- First, clear existing data to avoid conflicts
TRUNCATE TABLE profiles CASCADE;

-- Create temporary table for CSV import
CREATE TEMP TABLE profiles_import (
    id UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT,
    is_demo_account BOOLEAN,
    demo_tier TEXT,
    category TEXT,
    public_figure_verified BOOLEAN
);

-- Load data from CSV file
\copy profiles_import FROM 'remote_profiles.csv' WITH (FORMAT csv, NULL '');

-- Insert into profiles table
INSERT INTO profiles (id, created_at, updated_at, name, email, avatar_url, bio, role, is_demo_account, demo_tier, category, public_figure_verified)
SELECT 
    id,
    created_at,
    updated_at,
    name,
    email,
    NULLIF(avatar_url, ''),
    NULLIF(bio, ''),
    role,
    is_demo_account,
    NULLIF(demo_tier, ''),
    NULLIF(category, ''),
    public_figure_verified
FROM profiles_import;

-- Drop temp table
DROP TABLE profiles_import;

-- Verify import
SELECT role, COUNT(*) as count FROM profiles GROUP BY role ORDER BY role;
SELECT email, name, role FROM profiles WHERE email LIKE '%test%' ORDER BY email;