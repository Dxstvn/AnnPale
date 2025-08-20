// LibreTranslate API integration for automatic translation
export interface TranslationCache {
  [key: string]: string;
}

// In-memory cache to avoid redundant API calls
const translationCache: TranslationCache = {};

export interface LibreTranslateResponse {
  translatedText: string;
}

export const supportedLanguages = {
  en: 'English',
  fr: 'French', 
  ht: 'Haitian Creole'
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

/**
 * Translate text using LibreTranslate API
 */
export async function translateText(
  text: string,
  from: SupportedLanguage = 'en',
  to: SupportedLanguage
): Promise<string> {
  // Don't translate if source and target are the same
  if (from === to) return text;
  
  // Check cache first
  const cacheKey = `${from}-${to}-${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: LibreTranslateResponse = await response.json();
    
    // Cache the result
    translationCache[cacheKey] = data.translatedText;
    
    return data.translatedText;
  } catch (error) {
    console.warn(`Translation failed for "${text}" (${from} -> ${to}):`, error);
    // Return original text as fallback
    return text;
  }
}

/**
 * Translate an entire object of translations
 */
export async function translateObject(
  obj: Record<string, any>,
  from: SupportedLanguage = 'en',
  to: SupportedLanguage
): Promise<Record<string, any>> {
  const translated: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, from, to);
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, from, to);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

/**
 * Generate translation files automatically
 */
export async function generateTranslationFile(
  sourceMessages: Record<string, any>,
  targetLanguage: SupportedLanguage
): Promise<string> {
  const translated = await translateObject(sourceMessages, 'en', targetLanguage);
  return JSON.stringify(translated, null, 2);
}