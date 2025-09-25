#!/bin/bash

files=(
  "app/[locale]/creator/archive/2025-09-16/messages/page.tsx"
  "app/[locale]/creator/archive/2025-09-16/fans/page.tsx"
  "app/[locale]/creator/archive/2025-09-16/analytics/audience/page.tsx"
  "app/[locale]/creator/archive/2025-09-16/reviews/page.tsx"
  "app/[locale]/creator/streaming/studio/page.tsx"
  "app/[locale]/creator/dashboard/archive/demo-dashboard-original.tsx"
  "app/[locale]/creator/finances/invoices/page.tsx"
  "app/[locale]/creator/finances/tax/page.tsx"
  "app/[locale]/creator/finances/page.tsx"
  "app/[locale]/creator/finances/payouts/page.tsx"
)

for file in "${files[@]}"; do
  echo "Fixing $file..."

  # First, fix the useTranslations line - it should be t not tCreator
  sed -i '' 's/const tCreator = useTranslations()/const t = useTranslations()/g' "$file"

  # For each file type, create a unique function name for the custom translation
  basename=$(basename "$file" .tsx)

  case "$basename" in
    "messages") funcname="tMessages" ;;
    "fans") funcname="tFans" ;;
    "audience") funcname="tAudience" ;;
    "reviews") funcname="tReviews" ;;
    "studio") funcname="tStudio" ;;
    "demo-dashboard-original") funcname="tDashboard" ;;
    "invoices") funcname="tInvoices" ;;
    "tax") funcname="tTax" ;;
    "payouts") funcname="tPayouts" ;;
    "page")
      # For files named page.tsx, use parent directory
      parent=$(basename $(dirname "$file"))
      case "$parent" in
        "finances") funcname="tFinances" ;;
        *) funcname="tCustom" ;;
      esac
      ;;
    *) funcname="tCustom" ;;
  esac

  # Replace tCreator function with unique name
  sed -i '' "s/const tCreator = (key/const $funcname = (key/g" "$file"

  # Update all function calls
  sed -i '' "s/{t('{/{$funcname('/g" "$file"
  sed -i '' "s/{t(\"{/{$funcname(\"/g" "$file"

  echo "  ✓ Fixed with $funcname"
done

echo "All files fixed!"