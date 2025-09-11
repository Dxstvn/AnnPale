-- Export script to get data from remote Supabase
-- Run this to generate INSERT statements for local import

\echo 'Exporting profiles data...'
\o profiles_data.sql

SELECT 'DELETE FROM profiles;' AS query
UNION ALL
SELECT 'INSERT INTO profiles (id, created_at, updated_at, name, email, avatar_url, bio, role, is_demo_account, demo_tier, category, public_figure_verified) VALUES (' ||
  '''' || id || ''',' ||
  COALESCE('''' || created_at::text || '''', 'NULL') || ',' ||
  COALESCE('''' || updated_at::text || '''', 'NULL') || ',' ||
  COALESCE('''' || REPLACE(name, '''', '''''') || '''', 'NULL') || ',' ||
  COALESCE('''' || email || '''', 'NULL') || ',' ||
  COALESCE('''' || avatar_url || '''', 'NULL') || ',' ||
  COALESCE('''' || REPLACE(COALESCE(bio, ''), '''', '''''') || '''', 'NULL') || ',' ||
  COALESCE('''' || role || '''', 'NULL') || ',' ||
  COALESCE(is_demo_account::text, 'false') || ',' ||
  COALESCE('''' || demo_tier || '''', 'NULL') || ',' ||
  COALESCE('''' || category || '''', 'NULL') || ',' ||
  COALESCE(public_figure_verified::text, 'false') ||
  ');'
FROM profiles
ORDER BY created_at;

\o
\echo 'Export complete!'