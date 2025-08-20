#!/usr/bin/env node

/**
 * Script to extract all hardcoded strings from the codebase
 * and identify missing translations
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

interface ExtractedString {
  text: string
  file: string
  line: number
  context: string
}

interface TranslationMap {
  [key: string]: any
}

// Load existing translations
const translationsDir = path.join(process.cwd(), 'lib', 'translations')
const enTranslations: TranslationMap = JSON.parse(
  fs.readFileSync(path.join(translationsDir, 'en.json'), 'utf-8')
)
const frTranslations: TranslationMap = JSON.parse(
  fs.readFileSync(path.join(translationsDir, 'fr.json'), 'utf-8')
)
const htTranslations: TranslationMap = JSON.parse(
  fs.readFileSync(path.join(translationsDir, 'ht.json'), 'utf-8')
)

// Patterns to extract text from TSX files
const patterns = {
  // JSX text content: >Text<
  jsxText: />([^<>{}\n]+)</g,
  // String literals in props: prop="Text"
  propString: /(?:placeholder|title|label|text|alt|name|description|value)=["']([^"']+)["']/g,
  // Button/Link text
  buttonText: /<(?:Button|Link)[^>]*>([^<]+)</g,
  // Hardcoded strings in arrays/objects
  literalString: /["']([A-Z][^"']{2,})["']/g,
}

// Strings to ignore (common code patterns)
const ignoredPatterns = [
  /^[A-Z_]+$/, // Constants like API_KEY
  /^\d+$/, // Numbers
  /^[\d\s\+\-\%\$\.]+$/, // Numbers with symbols
  /^#[0-9A-Fa-f]{6}$/, // Hex colors
  /^https?:\/\//, // URLs
  /^\//, // Paths
  /^[a-z]+$/, // Single lowercase words (likely code)
  /^(div|span|button|input|form|section|header|footer|nav|main|aside|article)$/, // HTML tags
  /^(useState|useEffect|useRef|useCallback|useMemo)$/, // React hooks
  /^(className|onClick|onChange|onSubmit|href|src|alt)$/, // Common props
  /^[^\w\s]+$/, // Only special characters
  /^.{1,2}$/, // Too short (1-2 chars)
  /^(px|rem|em|vh|vw|xl|lg|md|sm|xs)$/, // CSS units
  /^\d+[a-z]+$/, // Like "2xl", "3px"
  /^(true|false|null|undefined)$/, // JS keywords
  /^[A-Z][a-z]+[A-Z]/, // CamelCase (likely component names)
  /^test\-/, // Test identifiers
  /\.(tsx?|jsx?|css|json|md)$/, // File extensions
]

function shouldIgnore(str: string): boolean {
  return ignoredPatterns.some(pattern => pattern.test(str))
}

function extractStringsFromFile(filePath: string): ExtractedString[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const extracted: ExtractedString[] = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    // Skip import statements and comments
    if (line.trim().startsWith('import ') || 
        line.trim().startsWith('//') || 
        line.trim().startsWith('*')) {
      return
    }

    // Extract JSX text content
    let match
    const jsxTextRegex = />([^<>{}\n]+)</g
    while ((match = jsxTextRegex.exec(line)) !== null) {
      const text = match[1].trim()
      if (text && !shouldIgnore(text) && text.length > 3 && /[a-zA-Z]/.test(text)) {
        extracted.push({
          text,
          file: filePath,
          line: index + 1,
          context: 'jsx-content'
        })
      }
    }

    // Extract prop strings
    const propRegex = /(?:placeholder|title|label|text|alt|name|description|value|aria-label)=["']([^"']+)["']/g
    while ((match = propRegex.exec(line)) !== null) {
      const text = match[1].trim()
      if (text && !shouldIgnore(text) && text.length > 3 && /[a-zA-Z]/.test(text)) {
        extracted.push({
          text,
          file: filePath,
          line: index + 1,
          context: 'prop'
        })
      }
    }
  })

  return extracted
}

function findInTranslations(text: string, translations: TranslationMap): boolean {
  const searchText = text.toLowerCase()
  
  function search(obj: any): boolean {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        if (obj[key].toLowerCase() === searchText) {
          return true
        }
      } else if (typeof obj[key] === 'object') {
        if (search(obj[key])) {
          return true
        }
      }
    }
    return false
  }

  return search(translations)
}

async function main() {
  console.log('🔍 Extracting hardcoded strings from codebase...\n')

  // Find all TSX files
  const files = await glob('**/*.tsx', {
    ignore: ['node_modules/**', '.next/**', '*.test.tsx', '*.stories.tsx'],
    cwd: process.cwd()
  })

  console.log(`Found ${files.length} TSX files to scan\n`)

  const allStrings: ExtractedString[] = []
  const uniqueStrings = new Set<string>()

  // Extract strings from each file
  for (const file of files) {
    const filePath = path.join(process.cwd(), file)
    const extracted = extractStringsFromFile(filePath)
    
    extracted.forEach(item => {
      // Only add unique strings
      if (!uniqueStrings.has(item.text)) {
        uniqueStrings.add(item.text)
        allStrings.push(item)
      }
    })
  }

  console.log(`📝 Found ${allStrings.length} unique strings\n`)

  // Categorize strings
  const missingInEn: ExtractedString[] = []
  const missingInFr: ExtractedString[] = []
  const missingInHt: ExtractedString[] = []

  allStrings.forEach(item => {
    if (!findInTranslations(item.text, enTranslations)) {
      missingInEn.push(item)
    }
    if (!findInTranslations(item.text, frTranslations)) {
      missingInFr.push(item)
    }
    if (!findInTranslations(item.text, htTranslations)) {
      missingInHt.push(item)
    }
  })

  // Group missing strings by category
  const categorizedMissing: TranslationMap = {
    common: {},
    nav: {},
    auth: {},
    home: {},
    browse: {},
    creator: {},
    booking: {},
    admin: {},
    errors: {},
    components: {}
  }

  missingInEn.forEach(item => {
    // Determine category based on file path
    let category = 'components'
    
    if (item.file.includes('/app/')) {
      if (item.file.includes('/login') || item.file.includes('/signup') || item.file.includes('/auth')) {
        category = 'auth'
      } else if (item.file.includes('/browse')) {
        category = 'browse'
      } else if (item.file.includes('/creator')) {
        category = 'creator'
      } else if (item.file.includes('/admin')) {
        category = 'admin'
      } else if (item.file.includes('/book')) {
        category = 'booking'
      } else {
        category = 'home'
      }
    } else if (item.file.includes('/components/')) {
      if (item.file.includes('/navigation') || item.file.includes('/header') || item.file.includes('/footer')) {
        category = 'nav'
      } else if (item.file.includes('/homepage')) {
        category = 'home'
      } else if (item.file.includes('/browse')) {
        category = 'browse'
      } else if (item.file.includes('/creator')) {
        category = 'creator'
      } else if (item.file.includes('/booking')) {
        category = 'booking'
      }
    }

    // Create a key from the text
    const key = item.text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 30)

    if (!categorizedMissing[category]) {
      categorizedMissing[category] = {}
    }
    
    categorizedMissing[category][key] = item.text
  })

  // Save results
  const outputDir = path.join(process.cwd(), 'scripts', 'translations-output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Save missing strings
  fs.writeFileSync(
    path.join(outputDir, 'missing-translations.json'),
    JSON.stringify(categorizedMissing, null, 2)
  )

  // Save all extracted strings
  fs.writeFileSync(
    path.join(outputDir, 'all-extracted-strings.json'),
    JSON.stringify(allStrings.map(s => ({
      text: s.text,
      file: s.file.replace(process.cwd(), ''),
      line: s.line
    })), null, 2)
  )

  // Print summary
  console.log('📊 Summary:')
  console.log(`  - Total unique strings: ${allStrings.length}`)
  console.log(`  - Missing in English: ${missingInEn.length}`)
  console.log(`  - Missing in French: ${missingInFr.length}`)
  console.log(`  - Missing in Haitian Creole: ${missingInHt.length}`)
  console.log()

  // Print top missing strings
  console.log('🔴 Top missing strings that need translation:')
  missingInEn.slice(0, 20).forEach(item => {
    console.log(`  - "${item.text}" (${item.file.split('/').pop()}:${item.line})`)
  })

  console.log('\n✅ Results saved to:')
  console.log(`  - ${path.join(outputDir, 'missing-translations.json')}`)
  console.log(`  - ${path.join(outputDir, 'all-extracted-strings.json')}`)
}

main().catch(console.error)