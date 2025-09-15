#!/bin/bash

# Script to clean sensitive data from git history
echo "⚠️  WARNING: This will rewrite git history!"
echo "Make sure you have a backup of your repository before proceeding."
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Create a file with the secrets to remove
cat > secrets-to-remove.txt << 'EOF'
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU5MzI4OCwiZXhwIjoyMDcyMTY5Mjg4fQ.YmQiXzpBOPBKvRKBJZjIBJh1uRQBQWKP5_kT5u71Lqw
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU5MzI4OCwiZXhwIjoyMDcyMTY5Mjg4fQ.G9G6t9CxTa3RTFEHWrsOAd7NeOXCcPlwF0NuOKuw-M4
https://yijizsscwkvepljqojkz.supabase.co
EOF

echo "🔄 Cleaning git history..."

# Use git filter-branch to remove the secrets
git filter-branch --force --index-filter \
'while read -r secret; do
  git ls-files -z | xargs -0 sed -i "" "s|$secret|REDACTED|g" 2>/dev/null || true
done < secrets-to-remove.txt
git add --all 2>/dev/null || true' \
--prune-empty --tag-name-filter cat -- --all

# Clean up
rm -f secrets-to-remove.txt

echo "✅ Git history cleaned!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Force push to remote: git push --force-with-lease origin main"
echo "2. Rotate the exposed Supabase service role key immediately!"
echo "3. Update all local clones of this repository"
echo "4. Consider using git-secrets or similar tools to prevent future leaks"