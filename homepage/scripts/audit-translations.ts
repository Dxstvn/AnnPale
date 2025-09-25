#!/usr/bin/env tsx

/**
 * Translation Coverage Audit Script
 *
 * This script analyzes the codebase to:
 * 1. Find all translation key usage (useTranslations hooks, t() calls)
 * 2. Check translation file completeness across all locales
 * 3. Identify missing translations and hardcoded strings
 * 4. Generate a coverage report
 */

import * as fs from 'fs'
import * as path from 'path'

// Configuration
const LOCALES_DIR = './locales'
const SUPPORTED_LOCALES = ['en', 'fr', 'ht']
const SOURCE_DIRS = ['./app', './components', './lib']
const TRANSLATION_FILE_PATTERN = '**/*.json'
const SOURCE_FILE_PATTERN = '**/*.{tsx,ts,js,jsx}'

interface TranslationKey {
  key: string
  namespace: string
  file: string
  line: number
  context: string
}

interface TranslationFile {
  locale: string
  namespace: string
  keys: Set<string>
  content: any
}

interface AuditResults {
  totalKeys: number
  translationFiles: TranslationFile[]
  usedKeys: TranslationKey[]
  missingKeys: { locale: string; namespace: string; key: string }[]
  unusedKeys: { locale: string; namespace: string; key: string }[]
  hardcodedStrings: { file: string; line: number; text: string }[]
  coverage: { [locale: string]: number }
}

class TranslationAuditor {
  private results: AuditResults = {
    totalKeys: 0,
    translationFiles: [],
    usedKeys: [],
    missingKeys: [],
    unusedKeys: [],
    hardcodedStrings: [],
    coverage: {}
  }

  async run(): Promise<AuditResults> {
    console.log('🔍 Starting translation coverage audit...\n')

    // Load all translation files
    await this.loadTranslationFiles()

    // Scan source files for translation usage
    await this.scanSourceFiles()

    // Analyze coverage and find missing keys
    this.analyzeCoverage()

    // Find hardcoded strings that should be translated
    await this.findHardcodedStrings()

    // Generate report
    this.generateReport()

    return this.results
  }

  private async loadTranslationFiles(): Promise<void> {
    console.log('📂 Loading translation files...')

    for (const locale of SUPPORTED_LOCALES) {
      const localeDir = path.join(LOCALES_DIR, locale)

      if (!fs.existsSync(localeDir)) {
        console.warn(`⚠️  Locale directory not found: ${localeDir}`)
        continue
      }

      const translationFiles = fs.readdirSync(localeDir).filter(file => file.endsWith('.json'))

      for (const file of translationFiles) {
        const filePath = path.join(localeDir, file)
        const namespace = file.replace('.json', '')

        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          const keys = this.extractKeysFromObject(content)

          this.results.translationFiles.push({
            locale,
            namespace,
            keys,
            content
          })

          console.log(`  ✓ Loaded ${keys.size} keys from ${locale}/${namespace}`)
        } catch (error) {
          console.error(`  ❌ Error loading ${filePath}:`, error)
        }
      }
    }
  }

  private extractKeysFromObject(obj: any, prefix = ''): Set<string> {
    const keys = new Set<string>()

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'string') {
        keys.add(fullKey)
      } else if (typeof value === 'object' && value !== null) {
        const nestedKeys = this.extractKeysFromObject(value, fullKey)
        nestedKeys.forEach(k => keys.add(k))
      }
    }

    return keys
  }

  private async scanSourceFiles(): Promise<void> {
    console.log('\n🔍 Scanning source files for translation usage...')

    for (const dir of SOURCE_DIRS) {
      if (!fs.existsSync(dir)) continue

      const sourceFiles = await glob(SOURCE_FILE_PATTERN, { cwd: dir })

      for (const file of sourceFiles) {
        const filePath = path.join(dir, file)
        await this.scanFile(filePath)
      }
    }

    console.log(`  ✓ Found ${this.results.usedKeys.length} translation key usages`)
  }

  private async scanFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.split('\n')

      // Look for useTranslations hooks
      const useTranslationsRegex = /useTranslations\\(['"`]([^'"`]+)['"`]\\)/g
      let match

      while ((match = useTranslationsRegex.exec(content)) !== null) {
        const namespace = match[1]
        const lineNumber = content.substring(0, match.index).split('\n').length

        // Find t() calls in this file that use this namespace
        await this.findTranslationCalls(content, lines, filePath, namespace)
      }
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error)
    }
  }

  private async findTranslationCalls(
    content: string,
    lines: string[],
    filePath: string,
    namespace: string
  ): Promise<void> {
    // Look for t('key') calls
    const tCallRegex = /\\bt\\(['"`]([^'"`]+)['"`]\\)/g
    let match

    while ((match = tCallRegex.exec(content)) !== null) {
      const key = match[1]
      const lineNumber = content.substring(0, match.index).split('\n').length
      const context = lines[lineNumber - 1]?.trim() || ''

      this.results.usedKeys.push({
        key,
        namespace,
        file: filePath,
        line: lineNumber,
        context
      })
    }
  }

  private analyzeCoverage(): void {
    console.log('\n📊 Analyzing translation coverage...')

    // Get all unique keys used in the codebase
    const usedKeySet = new Set<string>()
    this.results.usedKeys.forEach(uk => {
      usedKeySet.add(`${uk.namespace}.${uk.key}`)
    })

    this.results.totalKeys = usedKeySet.size

    // Check coverage for each locale
    for (const locale of SUPPORTED_LOCALES) {
      const localeFiles = this.results.translationFiles.filter(tf => tf.locale === locale)
      const availableKeys = new Set<string>()

      localeFiles.forEach(tf => {
        tf.keys.forEach(key => {
          availableKeys.add(`${tf.namespace}.${key}`)
        })
      })

      // Find missing keys for this locale
      usedKeySet.forEach(usedKey => {
        if (!availableKeys.has(usedKey)) {
          const [namespace, ...keyParts] = usedKey.split('.')
          this.results.missingKeys.push({
            locale,
            namespace,
            key: keyParts.join('.')
          })
        }
      })

      // Calculate coverage percentage
      const coverage = (availableKeys.size / this.results.totalKeys) * 100
      this.results.coverage[locale] = Math.round(coverage * 100) / 100

      console.log(`  ${locale}: ${coverage.toFixed(1)}% (${availableKeys.size}/${this.results.totalKeys} keys)`)
    }
  }

  private async findHardcodedStrings(): Promise<void> {
    console.log('\n🔍 Scanning for potential hardcoded strings...')

    const hardcodedPatterns = [
      // JSX text content that looks like user-facing text
      />\\s*([A-Z][^<>{]*[a-z][^<>{}]*)</g,
      // Common hardcoded patterns
      /placeholder=['"`]([A-Z][^'"`]+)['"`]/g,
      /title=['"`]([A-Z][^'"`]+)['"`]/g,
      /alt=['"`]([A-Z][^'"`]+)['"`]/g,
    ]

    for (const dir of SOURCE_DIRS) {
      if (!fs.existsSync(dir)) continue

      const sourceFiles = await glob(SOURCE_FILE_PATTERN, { cwd: dir })

      for (const file of sourceFiles) {
        const filePath = path.join(dir, file)
        await this.scanFileForHardcodedStrings(filePath, hardcodedPatterns)
      }
    }

    console.log(`  ⚠️  Found ${this.results.hardcodedStrings.length} potential hardcoded strings`)
  }

  private async scanFileForHardcodedStrings(
    filePath: string,
    patterns: RegExp[]
  ): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.split('\n')

      for (const pattern of patterns) {
        let match
        while ((match = pattern.exec(content)) !== null) {
          const text = match[1]

          // Skip if it's likely a variable name, import, or other non-user-facing text
          if (this.shouldSkipString(text)) continue

          const lineNumber = content.substring(0, match.index).split('\n').length

          this.results.hardcodedStrings.push({
            file: filePath,
            line: lineNumber,
            text: text.trim()
          })
        }
      }
    } catch (error) {
      console.error(`Error scanning ${filePath} for hardcoded strings:`, error)
    }
  }

  private shouldSkipString(text: string): boolean {
    const skipPatterns = [
      /^[a-z]/,  // Starts with lowercase (likely variable)
      /^\\d/,     // Starts with number
      /^[A-Z_]+$/, // All caps (likely constant)
      /\\./,      // Contains dots (likely import path)
      /^(div|span|button|input|form|svg|path|g)$/i, // HTML/SVG elements
      /^(className|onClick|onChange|onSubmit|href|src|alt)$/i, // React props
      /^[A-Z][a-z]+([A-Z][a-z]+)*$/, // PascalCase (likely component name)
    ]

    return skipPatterns.some(pattern => pattern.test(text)) || text.length < 3
  }

  private generateReport(): void {
    console.log('\n📋 Translation Coverage Report')
    console.log('=' .repeat(50))

    console.log(`\\n📊 Overview:`)
    console.log(`  Total translation keys used: ${this.results.totalKeys}`)
    console.log(`  Translation files loaded: ${this.results.translationFiles.length}`)
    console.log(`  Hardcoded strings found: ${this.results.hardcodedStrings.length}`)

    console.log(`\\n🌐 Coverage by locale:`)
    for (const [locale, coverage] of Object.entries(this.results.coverage)) {
      const status = coverage >= 100 ? '✅' : coverage >= 80 ? '⚠️' : '❌'
      console.log(`  ${status} ${locale}: ${coverage}%`)
    }

    if (this.results.missingKeys.length > 0) {
      console.log(`\\n❌ Missing translations (${this.results.missingKeys.length}):`)
      const missingByLocale = this.groupBy(this.results.missingKeys, 'locale')

      for (const [locale, keys] of Object.entries(missingByLocale)) {
        console.log(`\\n  ${locale}:`)
        keys.forEach(k => console.log(`    - ${k.namespace}.${k.key}`))
      }
    }

    if (this.results.hardcodedStrings.length > 0) {
      console.log(`\\n⚠️  Potential hardcoded strings (top 20):`)
      this.results.hardcodedStrings
        .slice(0, 20)
        .forEach(hs => {
          console.log(`    ${hs.file}:${hs.line} - "${hs.text}"`)
        })

      if (this.results.hardcodedStrings.length > 20) {
        console.log(`    ... and ${this.results.hardcodedStrings.length - 20} more`)
      }
    }

    console.log(`\\n💡 Recommendations:`)

    if (this.results.missingKeys.length > 0) {
      console.log(`  1. Add ${this.results.missingKeys.length} missing translation keys`)
    }

    if (this.results.hardcodedStrings.length > 0) {
      console.log(`  2. Review ${this.results.hardcodedStrings.length} potential hardcoded strings`)
    }

    const lowestCoverage = Math.min(...Object.values(this.results.coverage))
    if (lowestCoverage < 100) {
      console.log(`  3. Improve translation coverage (lowest: ${lowestCoverage}%)`)
    }

    if (this.results.missingKeys.length === 0 && this.results.hardcodedStrings.length === 0) {
      console.log(`  🎉 Translation coverage looks good!`)
    }
  }

  private groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key])
      groups[groupKey] = groups[groupKey] || []
      groups[groupKey].push(item)
      return groups
    }, {} as { [key: string]: T[] })
  }
}

// Run the audit if called directly
if (require.main === module) {
  const auditor = new TranslationAuditor()
  auditor.run().catch(console.error)
}

export { TranslationAuditor }