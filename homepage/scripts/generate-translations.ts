#!/usr/bin/env node

/**
 * Script to generate French and Haitian Creole translations using Azure Translator API
 * This script reads missing translations and generates complete translation files
 */

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

interface TranslationMap {
  [key: string]: any
}

interface TranslationResponse {
  translations: Array<{
    text: string
    to: string
  }>
}

// Azure Translator configuration
const AZURE_KEY = process.env.AZURE_TRANSLATOR_KEY || process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY
const AZURE_ENDPOINT = process.env.AZURE_TRANSLATOR_ENDPOINT || process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com/'
const AZURE_REGION = process.env.AZURE_TRANSLATOR_REGION || process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION || 'global'

if (!AZURE_KEY) {
  console.error('❌ Azure Translator API key not found in environment variables')
  process.exit(1)
}

// Translation cache to avoid duplicate API calls
const translationCache: Map<string, string> = new Map()

/**
 * Translate text using Azure Translator API
 */
async function translateText(text: string, targetLang: 'fr' | 'ht', sourceLang: string = 'en'): Promise<string> {
  // Check cache first
  const cacheKey = `${text}-${sourceLang}-${targetLang}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    const response = await fetch(`${AZURE_ENDPOINT}/translate?api-version=3.0&to=${targetLang}&from=${sourceLang}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY!,
        'Ocp-Apim-Subscription-Region': AZURE_REGION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }])
    })

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status} ${response.statusText}`)
    }

    const data: TranslationResponse[] = await response.json()
    
    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      const translatedText = data[0].translations[0].text
      
      // Cache the result
      translationCache.set(cacheKey, translatedText)
      
      return translatedText
    }
    
    throw new Error('Invalid response format from Azure Translator')
  } catch (error) {
    console.error(`Translation failed for "${text}":`, error)
    return text // Return original text as fallback
  }
}

/**
 * Translate an entire object recursively
 */
async function translateObject(
  obj: TranslationMap,
  targetLang: 'fr' | 'ht',
  sourceLang: string = 'en',
  path: string = ''
): Promise<TranslationMap> {
  const translated: TranslationMap = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key
    
    if (typeof value === 'string') {
      console.log(`  Translating: ${currentPath}`)
      translated[key] = await translateText(value, targetLang, sourceLang)
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang, sourceLang, currentPath)
    } else {
      translated[key] = value
    }
  }
  
  return translated
}

/**
 * Deep merge two objects, preserving existing translations
 */
function deepMerge(target: TranslationMap, source: TranslationMap): TranslationMap {
  const result = { ...target }
  
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else if (!(key in result) || result[key] === '') {
      // Only add if key doesn't exist or is empty
      result[key] = source[key]
    }
  }
  
  return result
}

async function main() {
  console.log('🌐 Starting translation generation using Azure Translator...\n')

  const translationsDir = path.join(process.cwd(), 'lib', 'translations')
  const outputDir = path.join(process.cwd(), 'scripts', 'translations-output')
  
  // Load existing translations
  const enTranslations = JSON.parse(
    fs.readFileSync(path.join(translationsDir, 'en.json'), 'utf-8')
  )
  const existingFr = JSON.parse(
    fs.readFileSync(path.join(translationsDir, 'fr.json'), 'utf-8')
  )
  const existingHt = JSON.parse(
    fs.readFileSync(path.join(translationsDir, 'ht.json'), 'utf-8')
  )

  // Load missing translations if extraction was run
  let missingTranslations: TranslationMap = {}
  const missingFile = path.join(outputDir, 'missing-translations.json')
  if (fs.existsSync(missingFile)) {
    missingTranslations = JSON.parse(fs.readFileSync(missingFile, 'utf-8'))
    console.log('📋 Found missing translations to generate\n')
  }

  // Merge missing translations into English
  const completeEn = deepMerge(enTranslations, missingTranslations)

  console.log('🇫🇷 Generating French translations...\n')
  
  // Generate French translations for missing keys only
  const frMissing: TranslationMap = {}
  for (const [category, values] of Object.entries(missingTranslations)) {
    if (typeof values === 'object' && values !== null) {
      frMissing[category] = await translateObject(values as TranslationMap, 'fr')
    }
  }
  
  // Merge with existing French translations
  const completeFr = deepMerge(existingFr, frMissing)

  console.log('\n🇭🇹 Generating Haitian Creole translations...\n')
  
  // Generate Haitian Creole translations for missing keys only
  const htMissing: TranslationMap = {}
  for (const [category, values] of Object.entries(missingTranslations)) {
    if (typeof values === 'object' && values !== null) {
      htMissing[category] = await translateObject(values as TranslationMap, 'ht')
    }
  }
  
  // Merge with existing Haitian Creole translations
  const completeHt = deepMerge(existingHt, htMissing)

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Save complete translation files
  fs.writeFileSync(
    path.join(outputDir, 'en-complete.json'),
    JSON.stringify(completeEn, null, 2)
  )
  
  fs.writeFileSync(
    path.join(outputDir, 'fr-complete.json'),
    JSON.stringify(completeFr, null, 2)
  )
  
  fs.writeFileSync(
    path.join(outputDir, 'ht-complete.json'),
    JSON.stringify(completeHt, null, 2)
  )

  // Also save just the newly generated translations
  fs.writeFileSync(
    path.join(outputDir, 'fr-new.json'),
    JSON.stringify(frMissing, null, 2)
  )
  
  fs.writeFileSync(
    path.join(outputDir, 'ht-new.json'),
    JSON.stringify(htMissing, null, 2)
  )

  console.log('\n✅ Translation generation complete!')
  console.log('\n📁 Generated files:')
  console.log(`  - ${path.join(outputDir, 'en-complete.json')} (Complete English)`)
  console.log(`  - ${path.join(outputDir, 'fr-complete.json')} (Complete French)`)
  console.log(`  - ${path.join(outputDir, 'ht-complete.json')} (Complete Haitian Creole)`)
  console.log(`  - ${path.join(outputDir, 'fr-new.json')} (New French translations)`)
  console.log(`  - ${path.join(outputDir, 'ht-new.json')} (New Haitian Creole translations)`)
  
  console.log('\n📋 Next steps:')
  console.log('  1. Review the generated translations')
  console.log('  2. Copy complete files to lib/translations/ to replace existing ones')
  console.log('  3. Update components to use translation keys instead of hardcoded strings')
  console.log('  4. Test language switching functionality')
}

main().catch(console.error)