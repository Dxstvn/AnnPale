"use client"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export type Language = 'en' | 'fr' | 'ht'

interface LanguageOption {
  code: Language
  name: string
  flag: string
  nativeName: string
}

const languages: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "ht", name: "Haitian Creole", flag: "🇭🇹", nativeName: "Kreyòl Ayisyen" },
]

interface EnhancedLanguageToggleProps {
  variant?: 'default' | 'compact' | 'full'
  showFlag?: boolean
  showName?: boolean
  className?: string
}

export function EnhancedLanguageToggle({ 
  variant = 'default',
  showFlag = true,
  showName = true,
  className 
}: EnhancedLanguageToggleProps) {
  const { language, setLanguage, isLoading } = useLanguage()

  const currentLanguage = languages.find((lang) => lang.code === language)

  // Handle language change without page reload
  const handleLanguageChange = (newLanguage: Language) => {
    if (newLanguage !== language) {
      // Store in localStorage for persistence
      localStorage.setItem('preferred-language', newLanguage)
      
      // Update context
      setLanguage(newLanguage)
      
      // Optional: Add animation or toast notification
      // You could add a toast here to confirm language change
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className={cn("gap-2", className)}>
        <Globe className="h-4 w-4 animate-pulse" />
      </Button>
    )
  }

  // Compact variant for mobile
  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={cn("h-10 w-10", className)}
          >
            <span className="text-lg">{currentLanguage?.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <AnimatePresence mode="wait">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DropdownMenuItem
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer",
                    language === lang.code && "bg-purple-50 text-purple-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName}</span>
                  </div>
                  {language === lang.code && (
                    <Check className="h-4 w-4 text-purple-600" />
                  )}
                </DropdownMenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Full variant with more details
  if (variant === 'full') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "gap-2 h-11 px-4 border-gray-200 hover:border-purple-300",
              "hover:bg-purple-50 transition-all",
              className
            )}
          >
            <Globe className="h-4 w-4" />
            <span className="text-lg">{currentLanguage?.flag}</span>
            <span className="font-medium">{currentLanguage?.nativeName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[250px] p-2">
          <div className="px-2 py-1.5 text-sm font-medium text-gray-500 mb-1">
            Select Language
          </div>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-3 rounded-lg cursor-pointer mb-1",
                "hover:bg-purple-50 transition-all",
                language === lang.code && "bg-purple-50 text-purple-600 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
              </div>
              {language === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-5 w-5 text-purple-600" />
                </motion.div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "gap-2 h-10 px-3",
            "hover:bg-purple-50 hover:text-purple-600 transition-all",
            className
          )}
        >
          {!showFlag && <Globe className="h-4 w-4" />}
          {showFlag && <span className="text-base">{currentLanguage?.flag}</span>}
          {showName && (
            <span className="hidden sm:inline font-medium">
              {currentLanguage?.code.toUpperCase()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer",
              "hover:bg-purple-50 transition-all",
              language === lang.code && "bg-purple-50 text-purple-600"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-purple-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}