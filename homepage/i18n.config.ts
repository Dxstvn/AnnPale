export const locales = ["en", "fr", "ht"] as const
export const defaultLocale = "en" as const

export type Locale = (typeof locales)[number]

// Helper function to get language name
export function getLanguageName(locale: Locale): string {
  const names = {
    en: "English",
    fr: "Français",
    ht: "Kreyòl Ayisyen"
  }
  return names[locale]
}

// Country to locale mapping for IP-based detection
export function getLocaleFromCountry(country: string): Locale {
  const countryToLocale: Record<string, Locale> = {
    // Haiti and Caribbean countries with significant Haitian population
    'HT': 'ht', // Haiti
    'DO': 'ht', // Dominican Republic (significant Haitian population)
    'BS': 'ht', // Bahamas (Haitian diaspora)
    'TC': 'ht', // Turks and Caicos (Haitian diaspora)

    // French-speaking countries
    'FR': 'fr', // France
    'CA': 'fr', // Canada (will be refined by province if possible)
    'BE': 'fr', // Belgium
    'CH': 'fr', // Switzerland
    'MC': 'fr', // Monaco
    'LU': 'fr', // Luxembourg
    'MQ': 'fr', // Martinique
    'GP': 'fr', // Guadeloupe
    'GF': 'fr', // French Guiana
    'RE': 'fr', // Réunion
    'YT': 'fr', // Mayotte
    'NC': 'fr', // New Caledonia
    'PF': 'fr', // French Polynesia
    'WF': 'fr', // Wallis and Futuna
    'PM': 'fr', // Saint Pierre and Miquelon
    'BL': 'fr', // Saint Barthélemy
    'MF': 'fr', // Saint Martin
    'SN': 'fr', // Senegal
    'ML': 'fr', // Mali
    'BF': 'fr', // Burkina Faso
    'NE': 'fr', // Niger
    'CI': 'fr', // Côte d'Ivoire
    'GN': 'fr', // Guinea
    'TD': 'fr', // Chad
    'CF': 'fr', // Central African Republic
    'CM': 'fr', // Cameroon
    'GA': 'fr', // Gabon
    'CG': 'fr', // Congo
    'CD': 'fr', // Democratic Republic of Congo
    'DJ': 'fr', // Djibouti
    'KM': 'fr', // Comoros
    'MG': 'fr', // Madagascar
    'VU': 'fr', // Vanuatu

    // Default to English for all other countries
  }

  return countryToLocale[country] || defaultLocale
}

// Helper function to detect browser language
export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale

  const browserLang = navigator.language.toLowerCase()

  // Check for French variants
  if (browserLang.startsWith("fr")) return "fr"

  // Check for Haitian Creole variants
  if (browserLang.startsWith("ht") || browserLang.includes("creole")) return "ht"

  // Default to English
  return "en"
}