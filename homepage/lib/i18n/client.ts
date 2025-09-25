"use client"

import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { locales, type Locale } from "@/i18n.config"

// Hook to use translations in client components
export function useI18n(namespace?: string) {
  const t = useTranslations(namespace)
  return { t }
}

// Hook to handle language switching
export function useLanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: Locale) => {
    // Get the current pathname without locale
    const segments = pathname.split("/")
    const currentLocale = locales.find(locale => segments[1] === locale)

    let newPathname: string
    if (currentLocale) {
      // Replace existing locale
      segments[1] = newLocale
      newPathname = segments.join("/")
    } else {
      // Add locale to path
      newPathname = `/${newLocale}${pathname}`
    }

    // Navigate to new locale
    router.push(newPathname)
    router.refresh()
  }

  // Get current locale from pathname
  const getCurrentLocale = (): Locale => {
    const segments = pathname.split("/")
    const locale = locales.find(l => segments[1] === l)
    return locale || "en"
  }

  return {
    switchLanguage,
    currentLocale: getCurrentLocale(),
    availableLocales: locales
  }
}