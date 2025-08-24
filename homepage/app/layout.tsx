import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { SupabaseAuthProvider } from "@/contexts/supabase-auth-context"
import { Toaster } from "@/components/ui/toaster"
import { ProfileRedirect } from "@/components/auth/profile-redirect"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ann Pale - Personalized Videos from Haitian Creators",
  description:
    "Get personalized video messages from your favorite Haitian creators for birthdays, celebrations, or just to make someone smile.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <SupabaseAuthProvider>
            <ProfileRedirect />
            {children}
            <Toaster />
          </SupabaseAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
