#!/usr/bin/env tsx

/**
 * Component Spacing Fix Script
 * Applies Phase 0 design system spacing (8-point grid) to all UI components
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Component fix configurations
const componentFixes = {
  'button.tsx': [
    {
      find: 'xs: "h-7 px-2.5 text-xs gap-1.5',
      replace: 'xs: "h-8 px-3 text-xs gap-2'
    },
    {
      find: 'sm: "h-9 px-3.5 text-sm gap-1.5',
      replace: 'sm: "h-10 px-4 text-sm gap-2'
    },
    {
      find: 'default: "h-11 px-5 text-sm',
      replace: 'default: "h-12 px-6 text-sm'
    },
    {
      find: 'md: "h-11 px-5 text-sm',
      replace: 'md: "h-12 px-6 text-sm'
    },
    {
      find: 'lg: "h-[52px] px-8 text-base',
      replace: 'lg: "h-14 px-8 text-base'
    },
    {
      find: 'xl: "h-[60px] px-10 text-lg',
      replace: 'xl: "h-16 px-10 text-lg'
    },
    {
      find: 'icon: "size-11',
      replace: 'icon: "size-12'
    },
    {
      find: '"icon-xs": "size-7',
      replace: '"icon-xs": "size-8'
    },
    {
      find: '"icon-sm": "size-9',
      replace: '"icon-sm": "size-10'
    },
    {
      find: '"icon-lg": "size-[52px]',
      replace: '"icon-lg": "size-14'
    }
  ],
  'card.tsx': [
    {
      find: '"grid auto-rows-min items-start gap-1.5 px-6 py-6"',
      replace: '"grid auto-rows-min items-start gap-2 p-6"'
    },
    {
      find: 'className={cn("px-6", className)}',
      replace: 'className={cn("px-6 py-4", className)}'
    }
  ],
  'input.tsx': [
    {
      find: 'xs: "h-7 px-2 text-xs',
      replace: 'xs: "h-8 px-3 text-xs'
    },
    {
      find: 'sm: "h-9 px-3 text-sm',
      replace: 'sm: "h-10 px-3 text-sm'
    },
    {
      find: 'default: "h-11 px-4 text-base',
      replace: 'default: "h-12 px-4 text-base'
    },
    {
      find: 'lg: "h-13 px-5 text-lg',
      replace: 'lg: "h-14 px-5 text-lg'
    },
    {
      find: 'xl: "h-14 px-6 text-xl',
      replace: 'xl: "h-16 px-6 text-xl'
    },
    {
      find: 'className={cn("pt-6 pb-2", className)}',
      replace: 'className={cn("pt-7 pb-3", className)}'
    }
  ],
  'badge.tsx': [
    {
      find: /size:\s*{[^}]*}/,
      replace: `size: {
        sm: "h-5 px-2 text-xs",
        default: "h-6 px-3 text-sm",
        lg: "h-8 px-4 text-base",
      }`
    }
  ],
  'textarea.tsx': [
    {
      find: 'className={cn(',
      replace: 'className={cn("p-4 min-h-[96px]",'
    }
  ]
}

// Spacing utilities to add
const spacingUtilities = `
// Consistent spacing utilities following 8-point grid
export const spacing = {
  xs: 'p-2',    // 8px
  sm: 'p-3',    // 12px
  md: 'p-4',    // 16px
  lg: 'p-6',    // 24px
  xl: 'p-8',    // 32px
  '2xl': 'p-12' // 48px
} as const

export const gap = {
  xs: 'gap-2',   // 8px
  sm: 'gap-3',   // 12px
  md: 'gap-4',   // 16px
  lg: 'gap-6',   // 24px
  xl: 'gap-8',   // 32px
  '2xl': 'gap-12' // 48px
} as const

export const padding = {
  xs: { x: 'px-2', y: 'py-2' },     // 8px
  sm: { x: 'px-3', y: 'py-3' },     // 12px
  md: { x: 'px-4', y: 'py-4' },     // 16px
  lg: { x: 'px-6', y: 'py-6' },     // 24px
  xl: { x: 'px-8', y: 'py-8' },     // 32px
  '2xl': { x: 'px-12', y: 'py-12' } // 48px
} as const
`

// Function to apply fixes to a file
function applyFixes(filePath: string, fixes: Array<{find: string | RegExp, replace: string}>) {
  try {
    let content = readFileSync(filePath, 'utf-8')
    let modified = false

    for (const fix of fixes) {
      const originalContent = content
      if (typeof fix.find === 'string') {
        content = content.replace(fix.find, fix.replace)
      } else {
        content = content.replace(fix.find, fix.replace)
      }
      
      if (content !== originalContent) {
        modified = true
        console.log(`  ✓ Applied fix: ${typeof fix.find === 'string' ? fix.find.substring(0, 30) + '...' : 'RegExp'}`)
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8')
      console.log(`✅ Fixed ${filePath}`)
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}`)
    }

    return modified
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error)
    return false
  }
}

// Function to create spacing utilities file
function createSpacingUtilities() {
  const utilsPath = join(process.cwd(), 'lib', 'utils', 'spacing.ts')
  
  try {
    writeFileSync(utilsPath, spacingUtilities, 'utf-8')
    console.log(`✅ Created spacing utilities at ${utilsPath}`)
    return true
  } catch (error) {
    console.error(`❌ Error creating spacing utilities:`, error)
    return false
  }
}

// Main execution
function main() {
  console.log('🚀 Starting component spacing fixes...\n')

  const componentsDir = join(process.cwd(), 'components', 'ui')
  let fixedCount = 0
  let totalFiles = 0

  // Apply fixes to each component
  for (const [filename, fixes] of Object.entries(componentFixes)) {
    const filePath = join(componentsDir, filename)
    console.log(`\n📝 Processing ${filename}...`)
    
    if (applyFixes(filePath, fixes)) {
      fixedCount++
    }
    totalFiles++
  }

  // Create spacing utilities
  console.log('\n📦 Creating spacing utilities...')
  createSpacingUtilities()

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log(`✨ Component Spacing Fix Complete!`)
  console.log(`📊 Fixed ${fixedCount} out of ${totalFiles} components`)
  console.log('='.repeat(50))

  // Next steps
  console.log('\n📋 Next Steps:')
  console.log('1. Review the changes in each component')
  console.log('2. Run your build process to check for errors')
  console.log('3. Test components visually in the browser')
  console.log('4. Update any Storybook stories if needed')
}

// Run the script
if (require.main === module) {
  main()
}

export { applyFixes, createSpacingUtilities }