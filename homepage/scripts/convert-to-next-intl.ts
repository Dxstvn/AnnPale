#!/usr/bin/env npx tsx

import * as fs from 'fs/promises'
import * as path from 'path'

// Function to convert a single file from useLanguage to useTranslations
async function convertFile(filePath: string) {
  console.log(`Converting ${filePath}...`)

  try {
    let content = await fs.readFile(filePath, 'utf-8')

    // Check if file uses useLanguage
    if (!content.includes('useLanguage')) {
      console.log(`  ✓ Already converted or doesn't use language hook`)
      return
    }

    // Replace import
    content = content.replace(
      "import { useLanguage } from '@/contexts/language-context'",
      "import { useTranslations } from 'next-intl'"
    )

    // Replace hook usage - handle different patterns
    content = content.replace(
      /const\s*{\s*language\s*}\s*=\s*useLanguage\(\)/g,
      "const t = useTranslations()"
    )

    // For files that might have different destructuring
    content = content.replace(
      /const\s*{\s*language,\s*setLanguage\s*}\s*=\s*useLanguage\(\)/g,
      "const t = useTranslations()"
    )

    // Write the converted file back
    await fs.writeFile(filePath, content, 'utf-8')
    console.log(`  ✓ Converted successfully`)

  } catch (error) {
    console.error(`  ✗ Error converting file: ${error}`)
  }
}

// Get all TypeScript/TSX files in a directory recursively
async function getFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Skip node_modules and other build directories
        if (!['node_modules', '.next', 'dist', '.git'].includes(entry.name)) {
          files.push(...await getFiles(fullPath))
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }

  return files
}

async function main() {
  console.log('🔄 Starting conversion from useLanguage to useTranslations...\n')

  const basePath = '/Users/dustinjasmin/AnnPale/homepage'

  // Directories to process
  const directories = [
    path.join(basePath, 'app', '[locale]', 'fan'),
    path.join(basePath, 'app', '[locale]', 'creator'),
    path.join(basePath, 'app', '[locale]', 'admin'),
    path.join(basePath, 'app', 'fan'),
    path.join(basePath, 'app', 'creator'),
    path.join(basePath, 'app', 'admin'),
  ]

  let totalConverted = 0
  let totalChecked = 0

  for (const dir of directories) {
    console.log(`\n📁 Processing ${dir}...`)

    try {
      const files = await getFiles(dir)
      console.log(`  Found ${files.length} TypeScript/TSX files`)

      for (const file of files) {
        await convertFile(file)
        totalChecked++

        // Check if file was actually converted
        const content = await fs.readFile(file, 'utf-8')
        if (content.includes('useTranslations')) {
          totalConverted++
        }
      }
    } catch (error) {
      console.log(`  Directory not found or error: ${error}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ Conversion Complete!')
  console.log(`Total files checked: ${totalChecked}`)
  console.log(`Files converted: ${totalConverted}`)
  console.log('='.repeat(50) + '\n')
}

main().catch(console.error)