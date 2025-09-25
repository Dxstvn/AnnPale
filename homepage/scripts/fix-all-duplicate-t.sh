#!/bin/bash

echo "Finding and fixing all duplicate t declarations..."

# Find all files with duplicate t declarations
find ./app -name "*.tsx" -type f | while read file; do
  # Check if file has both useTranslations and custom t function
  if grep -q "const t = useTranslations" "$file" 2>/dev/null && grep -q "const t = (key" "$file" 2>/dev/null; then
    echo "Fixing: $file"

    # Determine the prefix based on the path
    if [[ $file == *"admin"* ]]; then
      prefix="tAdmin"
    elif [[ $file == *"creator"* ]]; then
      prefix="tCreator"
    elif [[ $file == *"templates"* ]]; then
      prefix="tTemplate"
    elif [[ $file == *"schedule"* ]]; then
      prefix="tSchedule"
    else
      prefix="tCustom"
    fi

    # Replace the second occurrence of const t = (the custom function)
    sed -i '' "0,/const t = useTranslations/!s/const t = /const $prefix = /" "$file"

    # Replace all {t(' calls with the new prefix
    sed -i '' "s/{t('{/{$prefix('/g" "$file"
    sed -i '' "s/{t(\"{/{$prefix(\"/g" "$file"

    echo "  ✓ Renamed to $prefix"
  fi
done

echo "Done! All duplicate t declarations have been fixed."