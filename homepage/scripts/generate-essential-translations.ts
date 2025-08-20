#!/usr/bin/env node

/**
 * Script to generate translations for essential UI strings using Azure Translator
 */

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Azure configuration
const AZURE_KEY = process.env.AZURE_TRANSLATOR_KEY || process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY
const AZURE_ENDPOINT = process.env.AZURE_TRANSLATOR_ENDPOINT || process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com/'
const AZURE_REGION = process.env.AZURE_TRANSLATOR_REGION || process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION || 'global'

if (!AZURE_KEY) {
  console.error('❌ Azure Translator API key not found')
  process.exit(1)
}

async function translateText(text: string, targetLang: 'fr' | 'ht'): Promise<string> {
  try {
    const response = await fetch(`${AZURE_ENDPOINT}/translate?api-version=3.0&to=${targetLang}&from=en`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY!,
        'Ocp-Apim-Subscription-Region': AZURE_REGION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }])
    })

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status}`)
    }

    const data = await response.json()
    return data[0]?.translations[0]?.text || text
  } catch (error) {
    console.error(`Failed to translate "${text}":`, error)
    return text
  }
}

async function translateObject(obj: any, targetLang: 'fr' | 'ht'): Promise<any> {
  const result: any = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      console.log(`  Translating: ${value}`)
      result[key] = await translateText(value, targetLang)
      await new Promise(resolve => setTimeout(resolve, 100)) // Rate limiting
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await translateObject(value, targetLang)
    } else {
      result[key] = value
    }
  }
  
  return result
}

async function main() {
  console.log('🌐 Generating essential translations...\n')

  // Load essential translations
  const essentialPath = path.join(process.cwd(), 'scripts', 'essential-translations.json')
  const essential = JSON.parse(fs.readFileSync(essentialPath, 'utf-8'))

  // Generate French translations
  console.log('🇫🇷 Generating French translations...\n')
  const frTranslations = await translateObject(essential, 'fr')

  // Generate Haitian Creole translations
  console.log('\n🇭🇹 Generating Haitian Creole translations...\n')
  const htTranslations = await translateObject(essential, 'ht')

  // Save translations
  const outputDir = path.join(process.cwd(), 'scripts', 'translations-output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(
    path.join(outputDir, 'essential-en.json'),
    JSON.stringify(essential, null, 2)
  )

  fs.writeFileSync(
    path.join(outputDir, 'essential-fr.json'),
    JSON.stringify(frTranslations, null, 2)
  )

  fs.writeFileSync(
    path.join(outputDir, 'essential-ht.json'),
    JSON.stringify(htTranslations, null, 2)
  )

  console.log('\n✅ Essential translations generated!')
  console.log('\n📁 Files saved to:')
  console.log(`  - ${outputDir}/essential-en.json`)
  console.log(`  - ${outputDir}/essential-fr.json`)
  console.log(`  - ${outputDir}/essential-ht.json`)
}

main().catch(console.error)