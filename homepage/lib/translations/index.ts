import enTranslations from './en.json'
import frTranslations from './fr.json'
import htTranslations from './ht.json'

export type Language = 'en' | 'fr' | 'ht'

const translations = {
  en: enTranslations,
  fr: frTranslations,
  ht: htTranslations,
} as const

/**
 * Get a translation value using dot notation path
 * @param path - Dot notation path to translation (e.g., 'auth.login.title')
 * @param language - Language code ('en', 'fr', or 'ht')
 * @param fallback - Optional fallback text if translation not found
 * @returns Translated string
 */
export function getTranslation(
  path: string,
  language: Language,
  fallback?: string
): string {
  // Ensure we have a valid language, fallback to English
  const validLanguage = language && translations[language] ? language : 'en'
  
  const keys = path.split('.')
  let current: any = translations[validLanguage]
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      // Try English as fallback language if not already using it
      if (validLanguage !== 'en') {
        current = translations.en
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = current[k]
          } else {
            return fallback || path
          }
        }
        return current || fallback || path
      } else {
        return fallback || path
      }
    }
  }
  
  return current || fallback || path
}

/**
 * Get all translations for a specific section
 * @param section - Section name (e.g., 'auth.login')
 * @param language - Language code
 * @returns Object with all translations in that section
 */
export function getTranslationSection(
  section: string,
  language: Language
): Record<string, any> {
  const keys = section.split('.')
  let current: any = translations[language]
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return {}
    }
  }
  
  return current || {}
}

/**
 * Format a translation with dynamic values
 * @param path - Translation path
 * @param language - Language code
 * @param values - Object with replacement values
 * @returns Formatted string
 */
export function formatTranslation(
  path: string,
  language: Language,
  values: Record<string, string | number>
): string {
  let text = getTranslation(path, language)
  
  Object.entries(values).forEach(([key, value]) => {
    text = text.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
  })
  
  return text
}

// Export all translations for direct access if needed
export { enTranslations, frTranslations, htTranslations }

// Type-safe translation keys
export type TranslationKey = keyof typeof enTranslations

// Helper to get available languages
export const availableLanguages: Language[] = ['en', 'fr', 'ht']

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  ht: 'Kreyòl',
}

// Helper to get language flag emojis
export const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
  ht: '🇭🇹',
}