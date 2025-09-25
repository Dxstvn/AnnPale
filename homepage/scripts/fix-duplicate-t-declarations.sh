#!/bin/bash

# List of files with duplicate t declarations
files=(
  "app/[locale]/admin/enhanced-dashboard/page.tsx"
  "app/[locale]/admin/finances/page.tsx"
  "app/[locale]/admin/moderation/queue/page.tsx"
  "app/[locale]/admin/security/page.tsx"
  "app/[locale]/creator/analytics/revenue/page.tsx"
)

for file in "${files[@]}"; do
  echo "Processing $file..."

  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "File $file not found, skipping..."
    continue
  fi

  # Find the line with the duplicate t declaration (usually a custom translation function)
  # Replace the second occurrence of "const t =" with a more specific name

  # For admin pages, use tAdmin
  if [[ $file == *"admin"* ]]; then
    sed -i '' '0,/const t = useTranslations/!s/const t = /const tAdmin = /' "$file"
    sed -i '' 's/{t(\(["'"'"'][^)]*\))/{tAdmin(\1/g' "$file"
    echo "  - Renamed second t to tAdmin and updated references"
  # For creator pages, use tCreator
  elif [[ $file == *"creator"* ]]; then
    sed -i '' '0,/const t = useTranslations/!s/const t = /const tCreator = /' "$file"
    sed -i '' 's/{t(\(["'"'"'][^)]*\))/{tCreator(\1/g' "$file"
    echo "  - Renamed second t to tCreator and updated references"
  fi
done

echo "Done! All duplicate t declarations have been fixed."