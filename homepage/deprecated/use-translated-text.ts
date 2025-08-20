import { useEffect, useState } from 'react';
import { translateWithAzure, type SupportedLanguage } from '@/lib/azure-translator';
import { useLanguage } from '@/contexts/language-context';

/**
 * Hook for getting translated text for attributes like placeholder, title, etc.
 */
export function useTranslatedText(
  text: string,
  sourceLanguage: SupportedLanguage = 'en'
): string {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);

  useEffect(() => {
    let isCancelled = false;

    async function translateText() {
      if (sourceLanguage === language) {
        setTranslatedText(text);
        return;
      }

      try {
        const result = await translateWithAzure(text, language as SupportedLanguage, sourceLanguage);
        if (!isCancelled) {
          setTranslatedText(result);
        }
      } catch (error) {
        console.warn('Translation failed:', error);
        if (!isCancelled) {
          setTranslatedText(text);
        }
      }
    }

    translateText();

    return () => {
      isCancelled = true;
    };
  }, [text, sourceLanguage, language]);

  return translatedText;
}