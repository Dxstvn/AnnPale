#!/usr/bin/env node

/**
 * Script to merge new translations with existing translation files
 */

import fs from 'fs'
import path from 'path'

function deepMerge(target: any, source: any): any {
  const result = { ...target }
  
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

async function main() {
  console.log('📦 Merging translations...\n')

  const translationsDir = path.join(process.cwd(), 'lib', 'translations')
  const outputDir = path.join(process.cwd(), 'scripts', 'translations-output')

  // Load existing translations
  const existingEn = JSON.parse(fs.readFileSync(path.join(translationsDir, 'en.json'), 'utf-8'))
  const existingFr = JSON.parse(fs.readFileSync(path.join(translationsDir, 'fr.json'), 'utf-8'))
  const existingHt = JSON.parse(fs.readFileSync(path.join(translationsDir, 'ht.json'), 'utf-8'))

  // Load new essential translations
  const essentialEn = JSON.parse(fs.readFileSync(path.join(outputDir, 'essential-en.json'), 'utf-8'))
  const essentialFr = JSON.parse(fs.readFileSync(path.join(outputDir, 'essential-fr.json'), 'utf-8'))
  const essentialHt = JSON.parse(fs.readFileSync(path.join(outputDir, 'essential-ht.json'), 'utf-8'))

  // Merge translations
  const mergedEn = deepMerge(existingEn, essentialEn)
  const mergedFr = deepMerge(existingFr, essentialFr)
  const mergedHt = deepMerge(existingHt, essentialHt)

  // Save merged translations
  fs.writeFileSync(
    path.join(outputDir, 'en-merged.json'),
    JSON.stringify(mergedEn, null, 2)
  )

  fs.writeFileSync(
    path.join(outputDir, 'fr-merged.json'),
    JSON.stringify(mergedFr, null, 2)
  )

  fs.writeFileSync(
    path.join(outputDir, 'ht-merged.json'),
    JSON.stringify(mergedHt, null, 2)
  )

  console.log('✅ Translations merged successfully!\n')
  console.log('📁 Merged files saved to:')
  console.log(`  - ${outputDir}/en-merged.json`)
  console.log(`  - ${outputDir}/fr-merged.json`)
  console.log(`  - ${outputDir}/ht-merged.json`)
  console.log('\n📋 Next steps:')
  console.log('  1. Review the merged translations')
  console.log('  2. Copy merged files to lib/translations/ to replace existing ones:')
  console.log('     cp scripts/translations-output/*-merged.json lib/translations/')
  console.log('  3. Rename the files (en-merged.json → en.json, etc.)')
  console.log('  4. Test the application with new translations')
}

main().catch(console.error)