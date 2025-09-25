#!/bin/bash

echo "Removing language-context imports from all files..."

# Find all files that import language-context
find app -name "*.tsx" -exec grep -l "language-context" {} \; 2>/dev/null | while read file; do
  echo "Processing: $file"

  # Remove the import line
  sed -i '' '/import.*language-context/d' "$file"

  # Remove any useLanguage hook calls
  sed -i '' '/const.*useLanguage/d' "$file"

  # Replace language variable with 'en' as default
  sed -i '' "s/\${language}/en/g" "$file"
  sed -i '' "s/\[language\]/['en']/g" "$file"

  echo "  ✓ Fixed"
done

echo "Done! All language-context imports have been removed."