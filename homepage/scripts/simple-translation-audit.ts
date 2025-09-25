#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'

// Simple translation audit script
const LOCALES_DIR = './locales'
const SUPPORTED_LOCALES = ['en', 'fr', 'ht']
const SOURCE_DIRS = ['./app/[locale]', './components']

function getFilesRecursively(dir: string, extensions: string[]): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) return files

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, extensions))
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath)
    }
  }

  return files
}

function extractKeysFromObject(obj: any, prefix = ''): Set<string> {
  const keys = new Set<string>()

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      keys.add(fullKey)
    } else if (typeof value === 'object' && value !== null) {
      const nestedKeys = extractKeysFromObject(value, fullKey)
      nestedKeys.forEach(k => keys.add(k))
    }
  }

  return keys
}

async function audit() {
  console.log('🔍 Starting simple translation audit...\n')

  // Load translation files
  const translationData: { [locale: string]: { [namespace: string]: Set<string> } } = {}

  for (const locale of SUPPORTED_LOCALES) {
    translationData[locale] = {}
    const localeDir = path.join(LOCALES_DIR, locale)

    if (!fs.existsSync(localeDir)) {
      console.warn(`⚠️  Locale directory not found: ${localeDir}`)
      continue
    }

    const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'))

    for (const file of files) {
      const filePath = path.join(localeDir, file)
      const namespace = file.replace('.json', '')

      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        const keys = extractKeysFromObject(content)
        translationData[locale][namespace] = keys
        console.log(`  ✓ Loaded ${keys.size} keys from ${locale}/${namespace}`)
      } catch (error) {
        console.error(`  ❌ Error loading ${filePath}:`, error)
      }
    }
  }

  // Find useTranslations usage
  const usedTranslations: { namespace: string; file: string }[] = []
  const usedKeys: { namespace: string; key: string; file: string }[] = []

  for (const dir of SOURCE_DIRS) {
    const sourceFiles = getFilesRecursively(dir, ['.tsx', '.ts'])

    for (const file of sourceFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8')

        // Find useTranslations calls
        const useTranslationsMatches = content.matchAll(/useTranslations\(['"`]([^'"`]+)['"`]\)/g)
        for (const match of useTranslationsMatches) {
          usedTranslations.push({ namespace: match[1], file })
        }

        // Find t() calls
        const tCallMatches = content.matchAll(/\bt\(['"`]([^'"`]+)['"`]\)/g)
        for (const match of tCallMatches) {
          // Try to find the namespace for this file
          const namespaceMatch = content.match(/useTranslations\(['"`]([^'"`]+)['"`]\)/)
          if (namespaceMatch) {
            usedKeys.push({ namespace: namespaceMatch[1], key: match[1], file })
          }
        }
      } catch (error) {
        console.error(`Error scanning ${file}:`, error)
      }
    }
  }

  console.log(`\\n📊 Found ${usedTranslations.length} useTranslations usages`)
  console.log(`📊 Found ${usedKeys.length} translation key usages`)

  // Check coverage
  console.log('\\n🌐 Translation coverage:')

  const allNamespaces = new Set<string>()
  usedTranslations.forEach(ut => allNamespaces.add(ut.namespace))

  for (const locale of SUPPORTED_LOCALES) {
    console.log(`\\n  ${locale}:`)

    for (const namespace of allNamespaces) {
      const hasNamespace = translationData[locale] && translationData[locale][namespace]
      const keyCount = hasNamespace ? translationData[locale][namespace].size : 0
      const status = hasNamespace ? '✅' : '❌'

      console.log(`    ${status} ${namespace}: ${keyCount} keys`)
    }
  }

  // Find missing translations
  console.log('\\n❌ Missing namespaces:')

  for (const locale of SUPPORTED_LOCALES) {
    const missingNamespaces: string[] = []

    for (const namespace of allNamespaces) {
      if (!translationData[locale] || !translationData[locale][namespace]) {
        missingNamespaces.push(namespace)
      }
    }

    if (missingNamespaces.length > 0) {
      console.log(`  ${locale}: ${missingNamespaces.join(', ')}`)
    }
  }

  // Check for specific missing keys
  console.log('\\n🔍 Checking specific key usage:')

  const keysByNamespace: { [namespace: string]: Set<string> } = {}
  usedKeys.forEach(uk => {
    if (!keysByNamespace[uk.namespace]) {
      keysByNamespace[uk.namespace] = new Set()
    }
    keysByNamespace[uk.namespace].add(uk.key)
  })

  for (const [namespace, keys] of Object.entries(keysByNamespace)) {
    console.log(`\\n  ${namespace} (${keys.size} unique keys used):`)

    for (const locale of SUPPORTED_LOCALES) {
      const availableKeys = translationData[locale]?.[namespace] || new Set()
      const missingKeys: string[] = []

      keys.forEach(key => {
        if (!availableKeys.has(key)) {
          missingKeys.push(key)
        }
      })

      const coverage = ((keys.size - missingKeys.length) / keys.size * 100).toFixed(1)
      console.log(`    ${locale}: ${coverage}% coverage`)

      if (missingKeys.length > 0) {
        console.log(`      Missing: ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? '...' : ''}`)
      }
    }
  }

  console.log('\\n✅ Translation audit complete!')
}

audit().catch(console.error)