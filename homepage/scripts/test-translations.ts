#!/usr/bin/env node

import { getTranslation, availableLanguages, type Language } from '../lib/translations/index'

console.log('🧪 Testing Static Translation System\n')
console.log('=' .repeat(50))

// Test cases
const testKeys = [
  'home.hero.title',
  'home.hero.subtitle',
  'homepage.buttons.book_now',
  'homepage.badges.popular',
  'homepage.badges.fast_response',
  'common.search',
  'auth.login.sign_in',
  'browse.filters.all_categories',
  'creator.dashboard.welcome_back'
]

// Test each language
for (const lang of availableLanguages) {
  console.log(`\n📖 Testing ${lang.toUpperCase()} translations:`)
  console.log('-'.repeat(40))
  
  for (const key of testKeys) {
    const translation = getTranslation(key, lang)
    const status = translation === key ? '❌' : '✅'
    console.log(`${status} ${key}: "${translation}"`)
  }
}

// Test specific badge translations that we added
console.log('\n🏷️  Testing Badge Translations:')
console.log('-'.repeat(40))

const badgeKeys = [
  'homepage.badges.popular',
  'homepage.badges.fast_response',
  'homepage.badges.verified',
  'homepage.badges.new',
  'homepage.badges.trending'
]

for (const lang of availableLanguages) {
  console.log(`\n${lang.toUpperCase()}:`)
  for (const key of badgeKeys) {
    const translation = getTranslation(key, lang)
    console.log(`  ${key.split('.').pop()}: "${translation}"`)
  }
}

// Test button translations
console.log('\n🔘 Testing Button Translations:')
console.log('-'.repeat(40))

const buttonKeys = [
  'homepage.buttons.book_now',
  'homepage.buttons.browse_creators',
  'homepage.buttons.get_started',
  'homepage.buttons.learn_more',
  'homepage.buttons.view_all'
]

for (const lang of availableLanguages) {
  console.log(`\n${lang.toUpperCase()}:`)
  for (const key of buttonKeys) {
    const translation = getTranslation(key, lang)
    console.log(`  ${key.split('.').pop()}: "${translation}"`)
  }
}

// Summary
console.log('\n' + '='.repeat(50))
console.log('✨ Translation Test Complete!')
console.log('\nNote: If any translations show the key instead of translated text,')
console.log('it means the translation is missing in the JSON files.')