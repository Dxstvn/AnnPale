"use client";

import { useEffect, useState } from 'react';
import { translateWithAzure, type SupportedLanguage } from '@/lib/azure-translator';
import { useLanguage } from '@/contexts/language-context';

interface RealTimeTranslateProps {
  text: string;
  sourceLanguage?: SupportedLanguage;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any; // Allow additional props
}

/**
 * Component that automatically translates text in real-time using Azure Translator
 * Perfect for dynamic content that changes based on language toggle
 */
export function RealTimeTranslate({
  text,
  sourceLanguage = 'en',
  fallback,
  className,
  children,
  as: Component = 'span',
  ...otherProps
}: RealTimeTranslateProps) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(fallback || text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function performTranslation() {
      // Don't translate if source and target are the same
      if (sourceLanguage === language) {
        setTranslatedText(text);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await translateWithAzure(text, language as SupportedLanguage, sourceLanguage);
        
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
  }, [text, sourceLanguage, language, fallback]);

  if (error) {
    console.warn('RealTimeTranslate error:', error);
  }

  const content = isLoading ? (
    <span className="opacity-70">{fallback || text}</span>
  ) : (
    translatedText
  );

  return (
    <Component 
      className={className} 
      data-translated={sourceLanguage !== language}
      data-loading={isLoading}
      {...otherProps}
    >
      {children || content}
    </Component>
  );
}

/**
 * Hook for programmatic real-time translation
 */
export function useRealTimeTranslate() {
  const { language } = useLanguage();
  const [cache, setCache] = useState<Record<string, string>>({});

  const translate = async (
    text: string,
    sourceLanguage: SupportedLanguage = 'en'
  ): Promise<string> => {
    const cacheKey = `${sourceLanguage}-${language}-${text}`;
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      const result = await translateWithAzure(text, language as SupportedLanguage, sourceLanguage);
      
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

  return { translate, currentLanguage: language };
}

/**
 * Higher-order component for automatic translation
 */
export function withRealTimeTranslation<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function TranslatedComponent(props: P) {
    const translateProps = useRealTimeTranslate();
    
    return <WrappedComponent {...props} {...translateProps} />;
  };
}