// Azure Translator API integration for real-time translation
export interface AzureTranslationResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
  detectedLanguage?: {
    language: string;
    score: number;
  };
}

export const supportedLanguages = {
  en: 'English',
  fr: 'French', 
  ht: 'Haitian Creole'
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

// In-memory cache to avoid redundant API calls
const translationCache: Record<string, string> = {};

/**
 * Translate text using Azure Translator API
 */
export async function translateWithAzure(
  text: string,
  to: SupportedLanguage,
  from: SupportedLanguage = 'en'
): Promise<string> {
  // Don't translate if source and target are the same
  if (from === to) return text;
  
  // Check cache first
  const cacheKey = `${from}-${to}-${text}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const endpoint = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_ENDPOINT;
    const key = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY;
    const region = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION || 'global';

    if (!endpoint || !key) {
      console.warn('Azure Translator credentials not found');
      return text;
    }

    const response = await fetch(`${endpoint}/translate?api-version=3.0&to=${to}&from=${from}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }])
    });

    if (!response.ok) {
      throw new Error(`Azure Translator API error: ${response.status} ${response.statusText}`);
    }

    const data: AzureTranslationResponse[] = await response.json();
    
    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      const translatedText = data[0].translations[0].text;
      
      // Cache the result
      translationCache[cacheKey] = translatedText;
      
      return translatedText;
    }
    
    throw new Error('Invalid response format from Azure Translator');
  } catch (error) {
    console.warn(`Azure translation failed for "${text}" (${from} -> ${to}):`, error);
    // Return original text as fallback
    return text;
  }
}

/**
 * Translate an entire object of strings recursively
 */
export async function translateObject(
  obj: Record<string, any>,
  to: SupportedLanguage,
  from: SupportedLanguage = 'en'
): Promise<Record<string, any>> {
  const translated: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateWithAzure(value, to, from);
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 50));
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, to, from);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

/**
 * Detect the language of a text
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const endpoint = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_ENDPOINT;
    const key = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY;
    const region = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION || 'global';

    if (!endpoint || !key) {
      return 'en'; // Default fallback
    }

    const response = await fetch(`${endpoint}/detect?api-version=3.0`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }])
    });

    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.language || 'en';
  } catch (error) {
    console.warn('Language detection failed:', error);
    return 'en'; // Default fallback
  }
}