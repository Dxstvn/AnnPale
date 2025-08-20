"use client";

import { useEffect, useState } from 'react';
import { translateText, type SupportedLanguage } from '@/lib/auto-translate';

interface AutoTranslateProps {
  text: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage?: SupportedLanguage;
  fallback?: string;
  className?: string;
}

/**
 * Component that automatically translates text using LibreTranslate API
 * Useful for content that doesn't have manual translations yet
 */
export function AutoTranslate({
  text,
  targetLanguage,
  sourceLanguage = 'en',
  fallback,
  className
}: AutoTranslateProps) {
  const [translatedText, setTranslatedText] = useState<string>(fallback || text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function performTranslation() {
      // Don't translate if source and target are the same
      if (sourceLanguage === targetLanguage) {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await translateText(text, sourceLanguage, targetLanguage);
        
        if (!isCancelled) {
          setTranslatedText(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Translation failed');
          setTranslatedText(fallback || text);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    performTranslation();

    return () => {
      isCancelled = true;
    };
  }, [text, sourceLanguage, targetLanguage, fallback]);

  if (error) {
    console.warn('AutoTranslate error:', error);
  }

  return (
    <span className={className} data-auto-translated={sourceLanguage !== targetLanguage}>
      {isLoading ? (
        <span className="opacity-70">{fallback || text}</span>
      ) : (
        translatedText
      )}
    </span>
  );
}

/**
 * Hook for translating text programmatically
 */
export function useAutoTranslate() {
  const [cache, setCache] = useState<Record<string, string>>({});

  const translate = async (
    text: string,
    targetLanguage: SupportedLanguage,
    sourceLanguage: SupportedLanguage = 'en'
  ): Promise<string> => {
    const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      const result = await translateText(text, sourceLanguage, targetLanguage);
      
      setCache(prev => ({
        ...prev,
        [cacheKey]: result
      }));
      
      return result;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text;
    }
  };

  return { translate };
}