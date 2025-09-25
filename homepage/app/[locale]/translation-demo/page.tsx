"use client"

import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TranslationDemoPage() {
  const t = useTranslations("common")
  const tAuth = useTranslations("auth")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Translation Demo</h1>
        <LanguageSwitcher />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Navigation Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">browse:</span>
              <span className="font-medium">{t("navigation.browse")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">categories:</span>
              <span className="font-medium">{t("navigation.categories")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">howItWorks:</span>
              <span className="font-medium">{t("navigation.howItWorks")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">login:</span>
              <span className="font-medium">{t("navigation.login")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">signup:</span>
              <span className="font-medium">{t("navigation.signup")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">searchPlaceholder:</span>
              <span className="font-medium">{t("navigation.searchPlaceholder")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Hero Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <span className="text-muted-foreground block">title:</span>
              <p className="font-medium">{t("hero.title")}</p>
            </div>
            <div className="space-y-2 mt-4">
              <span className="text-muted-foreground block">subtitle:</span>
              <p className="font-medium">{t("hero.subtitle")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Categories Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">musicians:</span>
              <span className="font-medium">{t("categories.musicians")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">actors:</span>
              <span className="font-medium">{t("categories.actors")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">athletes:</span>
              <span className="font-medium">{t("categories.athletes")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">comedians:</span>
              <span className="font-medium">{t("categories.comedians")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">influencers:</span>
              <span className="font-medium">{t("categories.influencers")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">artists:</span>
              <span className="font-medium">{t("categories.artists")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Auth Translations */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <span className="text-muted-foreground block">login.title:</span>
              <p className="font-medium">{tAuth("login.title")}</p>
            </div>
            <div className="space-y-2 mt-4">
              <span className="text-muted-foreground block">signup.title:</span>
              <p className="font-medium">{tAuth("signup.title")}</p>
            </div>
            <div className="space-y-2 mt-4">
              <span className="text-muted-foreground block">signup.subtitle:</span>
              <p className="font-medium">{tAuth("signup.subtitle")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to use translations:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Import useTranslations: <code className="bg-background px-2 py-0.5 rounded">{"import { useTranslations } from 'next-intl'"}</code></li>
          <li>Get translations for a namespace: <code className="bg-background px-2 py-0.5 rounded">{"const t = useTranslations('common')"}</code></li>
          <li>Use in your component: <code className="bg-background px-2 py-0.5 rounded">{"t('navigation.browse')"}</code></li>
          <li>Switch language using the language switcher in the top right</li>
        </ol>
      </div>
    </div>
  )
}