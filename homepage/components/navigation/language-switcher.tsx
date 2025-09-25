"use client"

import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

type Language = "en" | "fr" | "ht"

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ht", name: "Kreyòl", flag: "🇭🇹" },
]

interface LanguageSwitcherProps {
  variant?: "default" | "minimal"
  align?: "start" | "center" | "end"
}

export function LanguageSwitcher({ variant = "default", align = "end" }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0]

  // Function to switch locale
  const switchLocale = (newLocale: Language) => {
    // Set locale preference cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`

    const segments = pathname.split('/').filter(Boolean)

    // Check if first segment is a locale
    const isLocaleInPath = segments.length > 0 && ['en', 'fr', 'ht'].includes(segments[0])

    let newPath: string
    if (isLocaleInPath) {
      // Replace existing locale
      segments[0] = newLocale
      newPath = `/${segments.join('/')}`
    } else {
      // Add locale to path
      newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`
    }

    // Use window.location for full page reload to ensure middleware processes the new locale
    window.location.href = newPath
  }

  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-purple-50 transition-colors">
            <Globe className="h-5 w-5 text-purple-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="bg-white border-purple-100">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`cursor-pointer hover:bg-purple-50 transition-all ${
                locale === lang.code ? "bg-gradient-to-r from-purple-50 to-pink-50" : ""
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              <span>{lang.name}</span>
              {locale === lang.code && (
                <span className="ml-auto text-purple-600">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
        >
          <Globe className="h-4 w-4 text-purple-600" />
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="bg-white border-purple-100">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            className={`cursor-pointer hover:bg-purple-50 transition-all ${
              locale === lang.code ? "bg-gradient-to-r from-purple-50 to-pink-50" : ""
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
            {locale === lang.code && (
              <span className="ml-auto text-purple-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}