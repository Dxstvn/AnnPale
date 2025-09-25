import { getTranslations } from "next-intl/server"
import { getLocale } from "next-intl/server"
import { getUser } from "@/lib/auth/server"
import { Button } from "@/components/ui/button"
import { Sparkles, Home, Search, HelpCircle, Users } from "lucide-react"
import Link from "next/link"
import { MobileMenu } from "./mobile-menu"
import { UserMenu } from "@/components/navigation/user-menu"

export async function ServerHeader({ locale: providedLocale }: { locale?: string }) {
  const locale = providedLocale || await getLocale()
  const t = await getTranslations({ locale, namespace: 'common.navigation' })
  const user = await getUser()

  const navLinks = [
    { href: `/${locale}`, label: t('home'), iconName: 'Home' },
    { href: `/${locale}/browse`, label: t('browse'), iconName: 'Search' },
    { href: `/${locale}/how-it-works`, label: t('howItWorks'), iconName: 'HelpCircle' },
    { href: `/${locale}/for-creators`, label: t('forCreators'), iconName: 'Users' },
  ]

  // Simple language switcher data
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ht", name: "Kreyòl", flag: "🇭🇹" },
  ]

  const currentLanguage = languages.find(l => l.code === locale) || languages[0]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-purple-100/50 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-white/50 to-pink-50/50 pointer-events-none" />

      <div className="container mx-auto flex h-20 items-center justify-between px-4 relative">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ann Pale
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors group"
            >
              <span>{link.label}</span>
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left transition-transform scale-x-0 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Right side actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Simple Language Switcher - Just Links */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={`/${lang.code}`}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  locale === lang.code
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
                title={lang.name}
              >
                {lang.flag}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link href={`/${locale}/login`}>
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-md hover:translate-y-[-2px] transition-all"
                >
                  {t('signIn')}
                </Button>
              </Link>
              <Link href={`/${locale}/signup`}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t('joinNow')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button and Language Switcher */}
        <div className="flex md:hidden items-center space-x-2">
          {/* Mobile Language Switcher - Simple Flags */}
          <div className="flex items-center gap-1">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={`/${lang.code}`}
                className={`p-1.5 rounded text-sm ${
                  locale === lang.code
                    ? "bg-purple-100"
                    : "hover:bg-gray-100"
                }`}
                title={lang.name}
              >
                {lang.flag}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle - Client Component */}
          <MobileMenu
            navLinks={navLinks}
            isAuthenticated={!!user}
            locale={locale}
            currentLanguage={currentLanguage.name}
          />
        </div>
      </div>

      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 opacity-50" />
    </header>
  )
}