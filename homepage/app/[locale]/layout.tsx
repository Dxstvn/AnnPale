import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { locales } from "@/i18n.config"
import type { Metadata } from "next"

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles = {
    en: "Ann Pale - Personalized Videos from Haitian Creators",
    fr: "Ann Pale - Vidéos Personnalisées de Créateurs Haïtiens",
    ht: "Ann Pale - Videyo Pèsonalize nan men Kreyatè Ayisyen yo"
  }

  const descriptions = {
    en: "Get personalized video messages from your favorite Haitian creators for birthdays, celebrations, or just to make someone smile.",
    fr: "Recevez des messages vidéo personnalisés de vos créateurs haïtiens préférés pour les anniversaires, célébrations, ou juste pour faire sourire quelqu'un.",
    ht: "Jwenn mesaj videyo pèsonalize nan men kreyatè ayisyen ou pi renmen yo pou kominote, selebrasyon, oswa jis pou fè yon moun souri."
  }

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      languages: {
        en: '/en',
        fr: '/fr',
        ht: '/ht',
        'x-default': '/en'
      }
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Await the params as required in Next.js 15
  const { locale } = await params

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale })

  // Set document language attribute on client side to avoid hydration mismatch
  return (
    <>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang = '${locale}';`
          }}
        />
        {children}
      </NextIntlClientProvider>
    </>
  )
}