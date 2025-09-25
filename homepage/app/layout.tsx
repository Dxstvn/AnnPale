import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SupabaseAuthProvider } from "@/contexts/supabase-auth-compat"
import { StripeStatusProvider } from "@/contexts/stripe-status-context"
import { Toaster } from "@/components/ui/toaster"
import { NotificationProvider } from "@/components/providers/notification-provider"
import { getUser, getProfile } from "@/lib/auth/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ann Pale - Personalized Videos from Haitian Creators",
  description:
    "Get personalized video messages from your favorite Haitian creators for birthdays, celebrations, or just to make someone smile.",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get initial auth state from server
  const initialUser = await getUser()
  const initialProfile = await getProfile()

  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="fr" href="/fr" />
        <link rel="alternate" hrefLang="ht" href="/ht" />
        <link rel="alternate" hrefLang="x-default" href="/en" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SupabaseAuthProvider initialUser={initialUser} initialProfile={initialProfile}>
          <StripeStatusProvider>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </StripeStatusProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
