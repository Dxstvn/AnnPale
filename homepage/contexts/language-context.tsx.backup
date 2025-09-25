"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "fr" | "ht"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper function to detect browser language
function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language.toLowerCase()
  
  // Check for French variants
  if (browserLang.startsWith('fr')) return 'fr'
  
  // Check for Haitian Creole variants
  if (browserLang.startsWith('ht') || browserLang.includes('creole')) return 'ht'
  
  // Default to English
  return 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load saved language from localStorage or detect from browser
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem("language") as Language
      
      if (savedLanguage && ["en", "fr", "ht"].includes(savedLanguage)) {
        setLanguage(savedLanguage)
      } else {
        // No saved preference, detect from browser
        const detectedLang = detectBrowserLanguage()
        setLanguage(detectedLang)
        localStorage.setItem("language", detectedLang)
      }
      
      setIsLoading(false)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", newLanguage)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
